import { Configuration } from "../models/Configuration";
import { Firestore } from "../storage/DB";
import { Cache } from "../storage/Cache";
import { RestError } from "../errors/RestError";
import { Audience } from "../models/Audience";
import overrideService from "./overrideService";

const CACHE_CONFIG_PREFIX = "configuration";
const CACHE_CONFIG_ALL_PREFIX = `${CACHE_CONFIG_PREFIX}:all`;
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

  await invalidateCache();

  return configuration;
};

const getById = async (
  id: string,
  audience: Audience | null = null
): Promise<Configuration | null> => {
  const cache = Cache.getInstance();
  const db = Firestore.getInstance();

  try {
    const cachedConfig = await cache.hget(
      `${CACHE_CONFIG_PREFIX}:${id}`,
      audience?.name ?? "default"
    );
    if (cachedConfig) {
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
    const override = await overrideService.getOne(configuration, audience);
    if (override) {
      configuration.value = override.value;
    }
  }

  try {
    await cache.hset(
      `${CACHE_CONFIG_PREFIX}:${id}`,
      audience?.name ?? "default",
      JSON.stringify(configuration.toObject())
    );
  } catch (error) {
    console.error("Failed to cache config", error);
  }

  return configuration;
};

const update = async (configuration: Configuration): Promise<Configuration> => {
  const cache = Cache.getInstance();
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

  await invalidateCache(configuration);

  return configuration;
};

const remove = async (configuration: Configuration): Promise<void> => {
  const db = Firestore.getInstance();

  await db.delete(DB_CONFIG_COLLECTION, configuration.id!);

  await invalidateCache(configuration);

  try {
    const overrides = await overrideService.getAll(undefined, configuration);
    for (const override of overrides) {
      await overrideService.remove(override);
    }
  } catch (error) {}
};

const getAll = async (
  audience: Audience | null = null
): Promise<Configuration[]> => {
  const db = Firestore.getInstance();
  const cache = Cache.getInstance();

  try {
    const cachedConfigs = await cache.hget(
      CACHE_CONFIG_ALL_PREFIX,
      audience?.name ?? "default"
    );
    if (cachedConfigs) {
      const configurations = JSON.parse(cachedConfigs);
      if (configurations.length > 0) {
        return configurations.map((config: any) =>
          Configuration.fromPlain(config)
        );
      }
    }
  } catch (error) {
    console.error("Failed to get configs from cache", error);
  }

  const configDocs = await db.get(DB_CONFIG_COLLECTION);
  const configurations: Configuration[] = [];
  configDocs.forEach((doc) => {
    const configuration = Configuration.fromDB(doc.data(), doc.id);
    configurations.push(configuration);
  });

  if (audience) {
    const overrides = await overrideService.getAll(audience);
    overrides.forEach((override, _) => {
      const config = configurations.find(
        (c) => c.id === override.configuration.id
      );
      if (config) {
        config.value = override.value;
      }
    });
  }

  try {
    await cache.hset(
      `${CACHE_CONFIG_ALL_PREFIX}`,
      audience?.name ?? "default",
      JSON.stringify(configurations.map((config) => config.toObject()))
    );
  } catch (error) {
    console.error("Failed to cache configs", error);
  }

  return configurations;
};

const getAllForMobile = async (
  audience: Audience | null = null
): Promise<Map<string, string>> => {
  const configurations = await getAll(audience);

  const configMap = new Map<string, string>();
  configurations.forEach((config) => {
    configMap.set(config.parameterKey, config.value);
  });

  return configMap;
};

const getByParameterKey = async (
  parameterKey: string
): Promise<Configuration | null> => {
  const db = Firestore.getInstance();

  const configDocs = await db.get(
    DB_CONFIG_COLLECTION,
    [],
    [
      {
        field: "parameterKey",
        op: "==",
        value: parameterKey,
      },
    ]
  );

  if (configDocs.empty) {
    return null;
  }

  const doc = configDocs.docs[0];
  return Configuration.fromDB(doc.data(), doc.id);
};

const invalidateCache = async (
  configuration: Configuration | null = null,
  audience: Audience | null = null
): Promise<void> => {
  const cache = Cache.getInstance();

  try {
    if (!configuration && !audience) {
      await cache.del(CACHE_CONFIG_ALL_PREFIX);
    } else if (!configuration && audience) {
      await cache.hdel(CACHE_CONFIG_ALL_PREFIX, audience.name);
    } else if (configuration && !audience) {
      await cache.del(`${CACHE_CONFIG_PREFIX}:${configuration.id}`);
      await cache.del(CACHE_CONFIG_ALL_PREFIX);
    } else if (configuration && audience) {
      await cache.hdel(
        `${CACHE_CONFIG_PREFIX}:${configuration.id}`,
        audience.name
      );
      await cache.hdel(CACHE_CONFIG_ALL_PREFIX, audience.name);
    }
  } catch (error) {
    console.error("Failed to invalidate config cache", error);
  }
};

export default {
  create,
  getById,
  update,
  remove,
  getAll,
  getAllForMobile,
  getByParameterKey,
  invalidateCache,
};
