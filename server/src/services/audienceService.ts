import { Audience } from "../models/Audience";
import { Firestore } from "../storage/DB";
import { Redis } from "../storage/Redis";
import { RestError } from "../errors/RestError";

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
  const cache = Redis.getInstance();
  const db = Firestore.getInstance();

  try {
    const cachedAudience = await cache.get(`${CACHE_AUDIENCE_NAME}:${id}`);
    if (cachedAudience) {
      console.log("Got audience from cache");
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
  const cache = Redis.getInstance();
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

const remove = async (id: string): Promise<void> => {
  const db = Firestore.getInstance();
  const cache = Redis.getInstance();

  await db.delete(DB_AUDIENCE_COLLECTION, id);

  try {
    await cache.del(`${CACHE_AUDIENCE_NAME}:${id}`);
  } catch (error) {
    console.error("Failed to delete audience from cache", error);
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
