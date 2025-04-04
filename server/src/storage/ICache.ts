export interface ICache {
  connect(): Promise<void>;
  get(key: string): Promise<string | null>;
  set(key: string, value: any, expire?: number): Promise<void>;
  del(key: string): Promise<void>;
  hget(key: string, field: string): Promise<string | null>;
  hset(key: string, field: string, value: any, expire?: number): Promise<void>;
  hdel(key: string, field: string): Promise<void>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<void>;
  hincrby(key: string, field: string, increment: number): Promise<number>;
  ping(): Promise<void>;
}
