import { ICache } from "./ICache";

export class NoOpCache implements ICache {
  async connect(): Promise<void> {
    return;
  }

  async get(key: string): Promise<string | null> {
    return null;
  }

  async set(key: string, value: any, expire?: number): Promise<void> {
    // No-op
  }

  async del(key: string): Promise<void> {
    // No-op
  }

  async hget(key: string, field: string): Promise<string | null> {
    return null;
  }

  async hset(
    key: string,
    field: string,
    value: any,
    expire?: number
  ): Promise<void> {
    // No-op
  }

  async hdel(key: string, field: string): Promise<void> {
    // No-op
  }

  async incr(key: string): Promise<number> {
    return 0;
  }

  async expire(key: string, seconds: number): Promise<void> {
    // No-op
  }

  async hincrby(
    key: string,
    field: string,
    increment: number
  ): Promise<number> {
    return 0;
  }

  async ping(): Promise<void> {
    // No-op
  }
}
