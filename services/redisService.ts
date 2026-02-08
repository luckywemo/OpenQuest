import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;

if (redisUrl && redisToken) {
    redis = new Redis({
        url: redisUrl,
        token: redisToken,
    });
} else {
    console.warn('⚠️ UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is missing. Redis service will be disabled.');
}

export const kv = {
    async get<T>(key: string): Promise<T | null> {
        if (!redis) return null;
        return await redis.get<T>(key);
    },
    async set(key: string, value: any, opts?: { ex?: number }) {
        if (!redis) return;
        await redis.set(key, value, opts);
    },
    async pushToList(key: string, value: any) {
        if (!redis) return;
        await redis.lpush(key, value);
    },
    async getList<T>(key: string, start = 0, stop = -1): Promise<T[]> {
        if (!redis) return [];
        return await redis.lrange<T>(key, start, stop);
    },
    async delete(key: string) {
        if (!redis) return;
        await redis.del(key);
    }
};
