import { Configuration } from "../models/Configuration";
import { Firestore } from "../storage/DB";
import { RestError } from "../errors/RestError";
import { Audience } from "../models/Audience";
import { ConfigOverride } from "../models/ConfigOverride";
import configurationService from "./configurationService";

const DB_OVERRIDE_COLLECTION = "overrides";

const getOne = async (
  configuration: Configuration,
  audience: Audience
): Promise<ConfigOverride | null> => {
  const db = Firestore.getInstance();

  const filters: Array<{
    field: string;
    op: FirebaseFirestore.WhereFilterOp;
    value: unknown;
  }> = [];
  if (audience) {
    filters.push({
      field: "audienceRef",
      op: "==",
      value: db.getRef("audiences", audience.name),
    });
  }
  if (configuration) {
    filters.push({
      field: "configRef",
      op: "==",
      value: db.getRef("configurations", configuration.id!),
    });
  }

  const overrideDocs = await db.get(DB_OVERRIDE_COLLECTION, undefined, filters);

  if (overrideDocs.empty) {
    return null;
  }

  return ConfigOverride.fromDB(
    overrideDocs.docs[0].data(),
    overrideDocs.docs[0].id,
    ["audience", "configuration"]
  );
};

const getAll = async (
  audience: Audience | null = null,
  configuration: Configuration | null = null,
  includes: string[] = []
): Promise<ConfigOverride[]> => {
  const db = Firestore.getInstance();

  const filters: Array<{
    field: string;
    op: FirebaseFirestore.WhereFilterOp;
    value: unknown;
  }> = [];
  if (audience) {
    filters.push({
      field: "audienceRef",
      op: "==",
      value: db.getRef("audiences", audience.name),
    });
  }
  if (configuration) {
    filters.push({
      field: "configRef",
      op: "==",
      value: db.getRef("configurations", configuration.id!),
    });
  }

  const overrideDocs = await db.get(DB_OVERRIDE_COLLECTION, undefined, filters);

  const overrides: ConfigOverride[] = [];

  for (const doc of overrideDocs.docs) {
    const override = await ConfigOverride.fromDB(doc.data(), doc.id, includes);
    overrides.push(override);
  }

  return overrides;
};

const create = async (override: ConfigOverride) => {
  const db = Firestore.getInstance();

  const overrideRef = await db.create(DB_OVERRIDE_COLLECTION, {
    audienceRef: db.getRef("audiences", override.audience.name),
    configRef: db.getRef("configurations", override.configuration.id!),
    value: override.value,
  });

  override.id = overrideRef.id;

  return override;
};

const getById = async (id: string): Promise<ConfigOverride | null> => {
  const db = Firestore.getInstance();

  const overrideDoc = await db.getById(DB_OVERRIDE_COLLECTION, id);
  if (!overrideDoc.exists) {
    return null;
  }

  return await ConfigOverride.fromDB(overrideDoc.data(), overrideDoc.id, [
    "audience",
    "configuration",
  ]);
};

const update = async (override: ConfigOverride) => {
  const db = Firestore.getInstance();
  await db.update(DB_OVERRIDE_COLLECTION, override.id!, {
    audienceRef: db.getRef("audiences", override.audience.name),
    configRef: db.getRef("configurations", override.configuration.id!),
    value: override.value,
  });

  try {
    await configurationService.invalidateCache(override.configuration);
  } catch (error) {
    console.error("Failed to invalidate config cache", error);
  }
};

const remove = async (override: ConfigOverride) => {
  const db = Firestore.getInstance();
  await db.delete(DB_OVERRIDE_COLLECTION, override.id!);

  try {
    await configurationService.invalidateCache(override.configuration);
  } catch (error) {
    console.error("Failed to invalidate config cache", error);
  }
};

export default {
  getOne,
  getAll,
  create,
  getById,
  update,
  remove,
};
