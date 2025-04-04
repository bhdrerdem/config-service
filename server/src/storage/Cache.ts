import { createClient, RedisClientType } from "redis";
import { CacheConfig } from "../config";
import { ICache } from "./ICache";
import { NoOpCache } from "./NoOpCache";
import { RedisCache } from "./RedisCache";

export class Cache implements ICache {
  private static instance: Cache;
  private config: CacheConfig;
  private health: boolean = false;
  private client!: ICache;

  constructor(config: CacheConfig) {
    this.config = config;
  }

  public static async init(config: CacheConfig): Promise<void> {
    if (!Cache.instance) {
      Cache.instance = new Cache(config);
      await Cache.instance.connect();
      Cache.instance.health = true;
    }
  }

  public getHealthCheck() {
    return this.health;
  }

  public async connect(): Promise<void> {
    if (this.config.isDisabled) {
      this.client = new NoOpCache();
      return;
    }

    try {
      this.client = new RedisCache(this.config);
      await this.client.connect();
      this.health = true;
    } catch (err) {
      this.health = false;
      throw new Error("Failed to connect to Redis");
    }
  }

  public async ping() {
    if (this.config.isDisabled) {
      return;
    }

    try {
      await this.client?.ping();
    } catch (error) {
      console.error("Error pinging Redis:", error);
      this.health = false;
      throw error;
    }
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      throw new Error("Cache not initialized");
    }

    return Cache.instance;
  }

  public async get(key: string): Promise<string | null> {
    return this.client?.get(key);
  }

  public async set(key: string, value: string, expire?: number): Promise<void> {
    await this.client?.set(key, value, expire);
  }

  public async del(key: string): Promise<void> {
    await this.client?.del(key);
  }

  public async hget(key: string, field: string): Promise<string | null> {
    return this.client?.hget(key, field);
  }

  public async hset(
    key: string,
    field: string,
    value: string,
    expire?: number
  ): Promise<void> {
    await this.client?.hset(key, field, value, expire);
  }

  public async hdel(key: string, field: string): Promise<void> {
    await this.client?.hdel(key, field);
  }

  public async incr(key: string): Promise<number> {
    return this.client?.incr(key);
  }

  public async expire(key: string, seconds: number): Promise<void> {
    await this.client?.expire(key, seconds);
  }

  public async hincrby(
    key: string,
    field: string,
    increment: number
  ): Promise<number> {
    return this.client?.hincrby(key, field, increment);
  }
}
