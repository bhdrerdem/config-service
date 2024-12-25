import { firestore } from "firebase-admin";
import { Configuration } from "../models/Configuration";
import { Firestore } from "../storage/DB";
import { Redis } from "../storage/Redis";
import { RestError } from "../errors/RestError";

const CACHE_CONFIG_NAME = "configuration";
const CACHE_TTL = 60 * 60;
const DB_CONFIG_COLLECTION = "configurations";

const create = async (configuration: Configuration): Promise<Configuration> => {
  const db = Firestore.getInstance();

  configuration.createdAt = new Date();
  configuration.updatedAt = new Date();
  configuration.version = 1;

  const configRef = await db.create(DB_CONFIG_COLLECTION, {
    parameterKey: configuration.parameterKey,
    value: configuration.value,
    description: configuration.description,
    createdAt: configuration.createdAt,
    updatedAt: configuration.updatedAt,
    version: configuration.version,
  });

  configuration.id = configRef.id;

  return configuration;
};

const getById = async (id: string): Promise<Configuration> => {
  const cache = Redis.getInstance();
  const db = Firestore.getInstance();

  try {
    const cachedConfig = await cache.get(`${CACHE_CONFIG_NAME}:${id}`);
    if (cachedConfig) {
      console.log("Got config from cache");
      return Configuration.fromPlain(JSON.parse(cachedConfig));
    }
  } catch (error) {
    console.error("Failed to get config from cache", error);
  }

  const configDoc = await db.getById(DB_CONFIG_COLLECTION, id);
  if (!configDoc.exists) {
    throw new RestError(`Configuration ${id} not found.`, 404);
  }

  const configuration = Configuration.fromDB(configDoc.data(), configDoc.id);

  try {
    await cache.set(
      `${CACHE_CONFIG_NAME}:${id}`,
      JSON.stringify(configuration.toObject()),
      CACHE_TTL
    );
  } catch (error) {
    console.error("Failed to cache config", error);
  }

  return configuration;
};

const update = async (configuration: Configuration): Promise<Configuration> => {
  const cache = Redis.getInstance();
  const db = Firestore.getInstance();

  configuration.version = configuration.version ? configuration.version + 1 : 1;
  configuration.updatedAt = new Date();

  await db.update(DB_CONFIG_COLLECTION, configuration.id!, {
    parameterKey: configuration.parameterKey,
    value: configuration.value,
    description: configuration.description,
    createdAt: configuration.createdAt,
    updatedAt: configuration.updatedAt,
    version: configuration.version,
  });

  try {
    await cache.set(
      `${CACHE_CONFIG_NAME}:${configuration.id}`,
      JSON.stringify(configuration.toObject()),
      CACHE_TTL
    );
    console.log("Updated cache");
  } catch (error) {
    console.error("Failed to update cache", error);
  }

  return configuration;
};

const remove = async (id: string): Promise<void> => {
  const db = Firestore.getInstance();
  const cache = Redis.getInstance();

  await db.delete(DB_CONFIG_COLLECTION, id);

  try {
    await cache.del(`${CACHE_CONFIG_NAME}:${id}`);
  } catch (error) {
    console.error("Failed to delete config from cache", error);
  }
};

const getAll = async (): Promise<Configuration[]> => {
  const db = Firestore.getInstance();

  const configDocs = await db.get(DB_CONFIG_COLLECTION);

  const configurations: Configuration[] = [];

  configDocs.forEach((doc) => {
    const configuration = Configuration.fromDB(doc.data(), doc.id);
    configurations.push(configuration);
  });

  return configurations;
};

const getAllForMobile = async (): Promise<Map<string, string>> => {
  const db = Firestore.getInstance();

  const configDocs = await db.get(DB_CONFIG_COLLECTION, [
    "parameterKey",
    "value",
  ]);

  const mobileConfigs = new Map<string, string>();

  configDocs.forEach((doc) => {
    const configuration = Configuration.fromDB(doc.data(), doc.id);
    mobileConfigs.set(configuration.parameterKey, configuration.value);
  });

  return mobileConfigs;
};

export default {
  create,
  getById,
  update,
  remove,
  getAll,
  getAllForMobile,
};
