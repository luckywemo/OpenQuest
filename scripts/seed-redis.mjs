import { Redis } from '@upstash/redis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
    console.error('❌ Redis credentials missing in .env');
    process.exit(1);
}

const redis = new Redis({
    url: redisUrl,
    token: redisToken,
});

async function seed() {
    console.log('🚀 Starting Redis seed...');

    try {
        // 1. Quests
        const questsPath = path.resolve('data/quests.json');
        if (fs.existsSync(questsPath)) {
            const quests = JSON.parse(fs.readFileSync(questsPath, 'utf8'));
            await redis.set('quests', quests);
            console.log(`✅ Seeded ${quests.length} quests to Redis.`);
        }

        // 2. Submissions (if any)
        const subsPath = path.resolve('data/submissions.json');
        if (fs.existsSync(subsPath)) {
            const subs = JSON.parse(fs.readFileSync(subsPath, 'utf8'));
            await redis.set('submissions', subs);
            console.log(`✅ Seeded ${subs.length} submissions to Redis.`);
        }

        console.log('🎉 Seeding successfully completed!');

        // Test a GET
        const testGet = await redis.get('quests');
        if (testGet) {
            console.log('🔍 Verification: Data successfully retrieved from Redis.');
        }

    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
}

seed();
