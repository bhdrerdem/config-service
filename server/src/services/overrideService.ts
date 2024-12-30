import { Configuration } from "../models/Configuration";
import { Firestore } from "../storage/DB";
import { RestError } from "../errors/RestError";
import { Audience } from "../models/Audience";
import { ConfigOverride } from "../models/ConfigOverride";

const DB_OVERRIDE_COLLECTION = "overrides";

const getValue = async (
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

const getAll = async (
  audience?: Audience,
  configuration?: Configuration
): Promise<Map<string, string>> => {
  const db = Firestore.getInstance();

  let query = db.client.collection(
    DB_OVERRIDE_COLLECTION
  ) as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;

  if (audience) {
    query = query.where(
      "audienceRef",
      "==",
      db.client.collection("audiences").doc(audience.name)
    );
  }

  if (configuration) {
    query = query.where(
      "configRef",
      "==",
      db.client.collection("configurations").doc(configuration.id!)
    );
  }

  const overrideDocs = await query.get();

  const overrides = new Map<string, string>();

  overrideDocs.docs.forEach((doc) => {
    const override = doc.data();
    overrides.set(override.configRef.id, override.value);
  });

  return overrides;
};

const getAllForUI = async () => {
  const db = Firestore.getInstance();

  const overrideDocs = await db.client.collection(DB_OVERRIDE_COLLECTION).get();

  const overrides: ConfigOverride[] = [];

  for (const doc of overrideDocs.docs) {
    const override = await ConfigOverride.fromDB(doc.data(), doc.id);
    overrides.push(override);
  }

  return overrides;
};

const create = async (override: ConfigOverride) => {
  const db = Firestore.getInstance();

  const overrideRef = await db.create(DB_OVERRIDE_COLLECTION, {
    audienceRef: db.client.collection("audiences").doc(override.audience.name),
    configRef: db.client
      .collection("configurations")
      .doc(override.configuration.id!),
    value: override.value,
  });

  override.id = overrideRef.id;

  return override;
};

const getById = async (id: string) => {
  const db = Firestore.getInstance();

  const overrideDoc = await db.getById(DB_OVERRIDE_COLLECTION, id);
  if (!overrideDoc.exists) {
    throw new RestError(`Override ${id} not found`, 404);
  }

  return ConfigOverride.fromDB(overrideDoc.data(), overrideDoc.id);
};

const update = async (override: ConfigOverride) => {
  const db = Firestore.getInstance();
  await db.update(DB_OVERRIDE_COLLECTION, override.id!, {
    audienceRef: db.client.collection("audiences").doc(override.audience.name),
    configRef: db.client
      .collection("configurations")
      .doc(override.configuration.id!),
    value: override.value,
  });
};

const remove = async (id: string) => {
  const db = Firestore.getInstance();
  await db.delete(DB_OVERRIDE_COLLECTION, id);
};

export default {
  getValue,
  getAll,
  create,
  getById,
  update,
  remove,
  getAllForUI,
};
