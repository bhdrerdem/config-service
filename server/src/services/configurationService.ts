import { firestore } from "firebase-admin";
import { Configuration } from "../models/Configuration";
import { Firestore } from "../storage/DB";
import { Redis } from "../storage/Redis";
import { RestError } from "../errors/RestError";
import audienceService from "./audienceService";
import { Audience } from "../models/Audience";
import { ConfigOverride } from "../models/ConfigOverride";

const CACHE_CONFIG_NAME = "configuration";
const CACHE_TTL = 60 * 60;
const DB_CONFIG_COLLECTION = "configurations";
const DB_OVERRIDE_COLLECTION = "overrides";

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

const getById = async (
  id: string,
  audience: Audience | null = null
): Promise<Configuration | null> => {
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

  if (audience) {
    const overrideValue = await getOverrideValue(configuration, audience);
    if (overrideValue) {
      configuration.value = overrideValue;
    }
  }

  try {
    await cache.set(
      `${CACHE_CONFIG_NAME}:${id}:${audience?.name || "default"}`,
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

const getAll = async (
  audience: Audience | null = null
): Promise<Configuration[]> => {
  const db = Firestore.getInstance();

  const configDocs = await db.get(DB_CONFIG_COLLECTION);

  const configurations: Configuration[] = [];

  configDocs.forEach((doc) => {
    const configuration = Configuration.fromDB(doc.data(), doc.id);
    configurations.push(configuration);
  });

  if (audience) {
    const overrides = await getAllOverrides(audience);
    overrides.forEach((value, key) => {
      const config = configurations.find((c) => c.id === key);
      if (config) {
        config.value = value;
      }
    });
  }

  return configurations;
};

const getAllForMobile = async (
  audience: Audience | null = null
): Promise<Map<string, string>> => {
  const db = Firestore.getInstance();

  const configurations = await getAll(audience);

  const configMap = new Map<string, string>();
  configurations.forEach((config) => {
    configMap.set(config.parameterKey, config.value);
  });

  return configMap;
};

const getOverrideValue = async (
  configuration: Configuration,
  audience: Audience
): Promise<string | null> => {
  const db = Firestore.getInstance();

  const overrideDoc = await db.client
    .collection(DB_OVERRIDE_COLLECTION)
    .where(
      "audienceRef",
      "==",
      db.client.collection("audiences").doc(audience.name)
    )
    .where(
      "configRef",
      "==",
      db.client.collection("configurations").doc(configuration.id!)
    )
    .get();

  if (overrideDoc.empty) {
    return null;
  }

  return overrideDoc.docs[0].data().value;
};

const getAllOverrides = async (
  audience: Audience
): Promise<Map<string, string>> => {
  const db = Firestore.getInstance();

  const overrideDocs = await db.client
    .collection(DB_OVERRIDE_COLLECTION)
    .where(
      "audienceRef",
      "==",
      db.client.collection("audiences").doc(audience.name)
    )
    .get();

  const overrides = new Map<string, string>();

  overrideDocs.forEach((doc) => {
    const override = doc.data();
    overrides.set(override.configRef.id, override.value);
  });

  return overrides;
};

const createOverride = async (
  configuration: Configuration,
  audience: Audience,
  value: string
) => {
  const db = Firestore.getInstance();

  const overrideRef = await db.create(DB_OVERRIDE_COLLECTION, {
    audienceRef: db.client.collection("audiences").doc(audience.name),
    configRef: db.client.collection("configurations").doc(configuration.id!),
    value,
  });

  return ConfigOverride.fromPlain({
    id: overrideRef.id,
    audienceId: audience.name,
    configurationId: configuration.id!,
    value,
  });
};

const getOverrideById = async (id: string) => {
  const db = Firestore.getInstance();

  const overrideDoc = await db.getById(DB_OVERRIDE_COLLECTION, id);
  if (!overrideDoc.exists) {
    throw new RestError(`Override ${id} not found`, 404);
  }

  return ConfigOverride.fromDB(overrideDoc.data(), overrideDoc.id);
};

const updateOverride = async (override: ConfigOverride) => {
  const db = Firestore.getInstance();
  await db.update(DB_OVERRIDE_COLLECTION, override.id!, override.toObject());
};

const removeOverride = async (id: string) => {
  const db = Firestore.getInstance();
  await db.delete(DB_OVERRIDE_COLLECTION, id);
};

export default {
  create,
  getById,
  update,
  remove,
  getAll,
  getAllForMobile,
  createOverride,
  getOverrideById,
  updateOverride,
  removeOverride,
};
