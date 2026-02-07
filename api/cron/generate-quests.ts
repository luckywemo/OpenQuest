import { generateNewQuest } from '../../services/geminiService';
import twitterBot from '../../services/twitterBot';
import farcasterBot from '../../services/farcasterBot';

export const config = {
    maxDuration: 60, // 1 minute max for AI generation
};

export default async function handler(req: any, res: any) {
    // Check authorization (Vercel Cron sends CRON_SECRET)
    // Or look for a custom header/api key
    const authHeader = req.headers['authorization'];
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('🎯 Cron Triggered: Generating New Quest...');

    try {
        // 1. Generate new quest using Gemini
        const quest = await generateNewQuest([]);
        console.log(`✅ Generated: "${quest.title}"`);

        const results = {
            twitter: false,
            farcaster: false,
            quest: quest.title
        };

        // 2. Announce on Twitter (if enabled)
        if (process.env.ENABLE_TWITTER === 'true') {
            try {
                await twitterBot.announceNewQuest(quest);
                results.twitter = true;
            } catch (err) {
                console.error('❌ Twitter announcement failed:', err);
            }
        }

        // 3. Announce on Farcaster (if enabled)
        if (process.env.ENABLE_FARCASTER === 'true') {
            try {
                await farcasterBot.announceNewQuest(quest);
                results.farcaster = true;
            } catch (err) {
                console.error('❌ Farcaster announcement failed:', err);
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Quest generated and announced successfully',
            ...results
        });

    } catch (error: any) {
        console.error('❌ Cron Job Failed:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
