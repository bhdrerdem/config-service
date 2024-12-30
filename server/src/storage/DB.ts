import * as admin from "firebase-admin";
import { FirebaseConfig } from "../config";
import { cert } from "firebase-admin/app";

export class Firestore {
  private static instance: Firestore;
  private config: FirebaseConfig;
  private health: boolean = false;
  public client!: FirebaseFirestore.Firestore;

  constructor(config: FirebaseConfig) {
    this.config = config;
  }

  public static async init(config: FirebaseConfig): Promise<void> {
    if (!Firestore.instance) {
      Firestore.instance = new Firestore(config);
    }

    Firestore.instance.connect();
  }

  public connect() {
    admin.initializeApp({
      credential: cert(this.config),
    });

    Firestore.instance.client = admin.firestore();
    Firestore.instance.health = true;
    console.log("Connected to Firestore");
  }

  public getHealthCheck() {
    return this.health;
  }

  public static getInstance(): Firestore {
    if (!Firestore.instance || !Firestore.instance.getHealthCheck()) {
      throw new Error("Firestore not initialized");
    }

    return Firestore.instance;
  }

  public async create(collection: string, data: any) {
    return await this.client.collection(collection).add(data);
  }

  public async createWithId(collection: string, id: string, data: any) {
    return await this.client.collection(collection).doc(id).set(data);
  }

  public async update(collection: string, id: string, data: any) {
    return await this.client.collection(collection).doc(id).update(data);
  }

  public async delete(collection: string, id: string) {
    return await this.client.collection(collection).doc(id).delete();
  }

  public async get(
    collection: string,
    fields?: string[],
    filters?: Array<{
      field: string;
      op: FirebaseFirestore.WhereFilterOp;
      value: unknown;
    }>
  ) {
    let query = Firestore.getInstance().client.collection(
      collection
    ) as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;

    if (fields && fields.length > 0) {
      query = query.select(...fields);
    }

    if (filters && filters.length > 0) {
      for (const filter of filters) {
        query = query.where(filter.field, filter.op, filter.value);
      }
    }

    return await query.get();
  }

  public async getById(collection: string, id: string) {
    return await this.client.collection(collection).doc(id).get();
  }

  public getRef(
    collection: string,
    id: string
  ): FirebaseFirestore.DocumentReference {
    return Firestore.getInstance().client.collection(collection).doc(id);
  }
}
