import { Audience } from "../models/Audience";
import { Firestore } from "../storage/DB";
import { Cache } from "../storage/Cache";
import { RestError } from "../errors/RestError";
import configurationService from "./configurationService";
import overrideService from "./overrideService";

const CACHE_AUDIENCE_NAME = "audience";
const CACHE_TTL = 60 * 60;
const DB_AUDIENCE_COLLECTION = "audiences";

const create = async (audience: Audience): Promise<Audience> => {
  const db = Firestore.getInstance();

  audience.createdAt = new Date();
  audience.updatedAt = new Date();

  const audienceRef = await db.createWithId(
    DB_AUDIENCE_COLLECTION,
    audience.name,
    {
      description: audience.description,
      createdAt: audience.createdAt,
      updatedAt: audience.updatedAt,
    }
  );

  return audience;
};

const getById = async (id: string): Promise<Audience | null> => {
  const cache = Cache.getInstance();
  const db = Firestore.getInstance();

  try {
    const cachedAudience = await cache.get(`${CACHE_AUDIENCE_NAME}:${id}`);
    if (cachedAudience) {
      return Audience.fromPlain(JSON.parse(cachedAudience));
    }
  } catch (error) {
    console.error("Failed to get audience from cache", error);
  }

  const audienceDoc = await db.getById(DB_AUDIENCE_COLLECTION, id);
  if (!audienceDoc.exists) {
    return null;
  }

  const audience = Audience.fromDB(audienceDoc.data(), audienceDoc.id);

  try {
    await cache.set(
      `${CACHE_AUDIENCE_NAME}:${id}`,
      JSON.stringify(audience.toObject()),
      CACHE_TTL
    );
  } catch (error) {
    console.error("Failed to cache audience", error);
  }

  return audience;
};

const update = async (audience: Audience): Promise<Audience> => {
  const cache = Cache.getInstance();
  const db = Firestore.getInstance();

  audience.updatedAt = new Date();

  await db.update(DB_AUDIENCE_COLLECTION, audience.name, {
    description: audience.description,
    createdAt: audience.createdAt,
    updatedAt: audience.updatedAt,
  });

  try {
    await cache.set(
      `${CACHE_AUDIENCE_NAME}:${audience.name}`,
      JSON.stringify(audience.toObject()),
      CACHE_TTL
    );
    console.log("Updated cache");
  } catch (error) {
    console.error("Failed to update cache", error);
  }

  return audience;
};

const remove = async (audience: Audience): Promise<void> => {
  const db = Firestore.getInstance();
  const cache = Cache.getInstance();

  await db.delete(DB_AUDIENCE_COLLECTION, audience.name);

  try {
    await cache.del(`${CACHE_AUDIENCE_NAME}:${audience.name}`);
    await configurationService.invalidateCache();
  } catch (error) {
    console.error("Failed to delete audience from cache", error);
  }

  try {
    const overrides = await overrideService.getAll(audience, undefined);
    for (const override of overrides) {
      try {
        await overrideService.remove(override);
      } catch (error) {
        console.error(
          "[audienceService.remove] Failed to remove override",
          error
        );
      }
    }
  } catch (error) {
    console.error("[audienceService.remove] Failed to get overrides", error);
  }
};

const getAll = async (): Promise<Audience[]> => {
  const db = Firestore.getInstance();

  const audienceDocs = await db.get(DB_AUDIENCE_COLLECTION);

  const audiences: Audience[] = [];

  audienceDocs.forEach((doc) => {
    const audience = Audience.fromDB(doc.data(), doc.id);
    audiences.push(audience);
  });

  return audiences;
};

const getRef = (id: string) => {
  const db = Firestore.getInstance();
  return db.getRef(DB_AUDIENCE_COLLECTION, id);
};

export default {
  create,
  getById,
  update,
  remove,
  getAll,
  getRef,
};
