import { RedisClientType } from "redis";
import { createClient } from "redis";
import { CacheConfig } from "../config";
import { Cache } from "./Cache";
import { ICache } from "./ICache";

export class RedisCache implements ICache {
  private redisClient: RedisClientType;

  constructor(config: CacheConfig) {
    this.redisClient = createClient({
      url: `redis://${config.host}:6379`,
    });
  }

  public async connect() {
    return new Promise<void>((resolve, reject) => {
      this.redisClient.connect();

      this.redisClient.on("connect", () => {
        console.log("Connected to Redis");
        resolve();
      });

      this.redisClient.on("error", (err) => {
        console.error(`Error connecting to Redis: ${err}`);
        reject(err);
      });
    });
  }

  public async get(key: string): Promise<string | null> {
    const result = await this.redisClient.get(key);
    return result ?? null;
  }

  public async set(key: string, value: any, expire?: number): Promise<void> {
    await this.redisClient.set(key, value);
    if (expire) {
      await this.redisClient.expire(key, expire);
    }
  }

  public async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  public async hget(key: string, field: string): Promise<string | null> {
    const result = await this.redisClient.hGet(key, field);
    return result ?? null;
  }

  public async hset(
    key: string,
    field: string,
    value: any,
    expire?: number
  ): Promise<void> {
    await this.redisClient.hSet(key, field, value);
    if (expire) {
      await this.redisClient.expire(key, expire);
    }
  }

  public async hdel(key: string, field: string): Promise<void> {
    await this.redisClient.hDel(key, field);
  }

  public async incr(key: string): Promise<number> {
    return await this.redisClient.incr(key);
  }

  public async expire(key: string, seconds: number): Promise<void> {
    await this.redisClient.expire(key, seconds);
  }

  public async hincrby(
    key: string,
    field: string,
    increment: number
  ): Promise<number> {
    return await this.redisClient.hIncrBy(key, field, increment);
  }

  public async ping(): Promise<void> {
    await this.redisClient.ping();
  }
}
