/**
 * OpenQuest Multi-Platform Bot
 * Unified entry point for OpenClaw (WhatsApp/Telegram/Discord) and Twitter
 */

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import openclawAgent from './services/openclawAgent';
import twitterBot from './services/twitterBot';
import farcasterBot from './services/farcasterBot';
import { generateNewQuest } from './services/geminiService';

// ============================================
// CONFIGURATION
// ============================================

const config = {
    openclaw: {
        enabled: process.env.ENABLE_OPENCLAW === 'true',
        gatewayUrl: process.env.OPENCLAW_GATEWAY_URL || 'ws://127.0.0.1:18789'
    },
    twitter: {
        enabled: process.env.ENABLE_TWITTER === 'true',
        botUsername: process.env.TWITTER_BOT_USERNAME || 'BaseQuestBot'
    },
    farcaster: {
        enabled: process.env.ENABLE_FARCASTER === 'true'
    },
    questGeneration: {
        enabled: process.env.ENABLE_AUTO_QUESTS === 'true',
        intervalHours: parseInt(process.env.QUEST_INTERVAL_HOURS || '24')
    }
};

// ============================================
// STARTUP FUNCTIONS
// ============================================

async function startTwitterBot() {
    if (!config.twitter.enabled) {
        console.log('⏭️  Twitter bot disabled');
        return;
    }

    console.log('🐦 Starting Twitter bot (announcement mode)...');

    try {
        console.log('📣 Twitter will post:');
        console.log('   ✅ Quest announcements');
        console.log('   ✅ Completion celebrations');
        console.log('   ✅ Daily stats');
        console.log('');
        console.log('💬 User interaction via OpenClaw (WhatsApp/Telegram/Discord)');

        // Start listening for mentions and DMs
        twitterBot.startMentionListener(config.twitter.botUsername);
        twitterBot.startDMListener();

        // Schedule daily stats tweet (every 24 hours)
        setInterval(() => {
            twitterBot.tweetDailyStats();
        }, 24 * 60 * 60 * 1000);

        console.log(`✅ Twitter bot ready (@${config.twitter.botUsername})`);
    } catch (error) {
        console.error('❌ Failed to start Twitter bot:', error);
    }
}

async function startFarcasterBot() {
    if (!config.farcaster.enabled) {
        console.log('⏭️  Farcaster bot disabled');
        return;
    }

    console.log('🟣 Starting Farcaster bot (announcement mode)...');
    console.log('📣 Farcaster will post:');
    console.log('   ✅ Quest announcements');
    console.log('   ✅ Completion celebrations');

    // Start listening for mentions/replies
    farcasterBot.startMentionListener();

    console.log('✅ Farcaster bot ready');
}

async function startOpenClawIntegration() {
    if (!config.openclaw.enabled) {
        console.log('⏭️  OpenClaw integration disabled');
        console.log('   To enable: Set ENABLE_OPENCLAW=true in .env');
        console.log('   Then run: openclaw gateway --port 18789');
        return;
    }

    console.log('🦞 Starting OpenClaw integration...');

    try {
        // OpenClaw handles its own gateway
        // Our agent handler is already set up in services/openclawAgent.ts
        console.log('✅ OpenClaw integration ready');
        console.log('');
        console.log('📱 To activate OpenClaw (for WhatsApp/Telegram/Discord):');
        console.log('   1. Run: openclaw gateway --port 18789');
        console.log('   2. Pair WhatsApp: openclaw channels login');
        console.log('   3. Dashboard: http://localhost:18789');
        console.log('');
    } catch (error) {
        console.error('❌ Failed to start OpenClaw:', error);
    }
}

async function startAutoQuestGeneration() {
    if (!config.questGeneration.enabled) {
        console.log('⏭️  Auto quest generation disabled');
        return;
    }

    console.log('🎯 Starting auto quest generation...');

    const generateAndAnnounce = async () => {
        try {
            console.log('📝 Generating new quest...');
            const quest = await generateNewQuest([]);

            console.log(`✅ Generated: "${quest.title}"`);

            // Announce on Twitter
            if (config.twitter.enabled) {
                await twitterBot.announceNewQuest(quest);
            }

            // Announce on Farcaster
            if (config.farcaster.enabled) {
                await farcasterBot.announceNewQuest(quest);
            }

            // Note: OpenClaw users will see quests when they ask
            // You could also implement push notifications here

        } catch (error) {
            console.error('❌ Failed to generate quest:', error);
        }
    };

    // Generate first quest immediately
    await generateAndAnnounce();

    // Then schedule regular generation
    const intervalMs = config.questGeneration.intervalHours * 60 * 60 * 1000;
    setInterval(generateAndAnnounce, intervalMs);

    console.log(`✅ Quest generation scheduled every ${config.questGeneration.intervalHours}h`);
}

// ============================================
// MAIN ENTRY POINT
// ============================================

async function main() {
    console.log('');
    console.log('╔══════════════════════════════════════╗');
    console.log('║   OpenQuest Multi-Platform Bot       ║');
    console.log('╚══════════════════════════════════════╝');
    console.log('');

    // Check required environment variables
    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY not set in environment');
        process.exit(1);
    }

    console.log('🚀 Starting all enabled services...\n');

    // Start all services
    await startTwitterBot();
    await startFarcasterBot();
    await startOpenClawIntegration();
    await startAutoQuestGeneration();

    console.log('');
    console.log('════════════════════════════════════════');
    console.log('✅ All services running!');
    console.log('════════════════════════════════════════');
    console.log('');

    if (config.twitter.enabled) {
        console.log('🐦 Twitter: @' + config.twitter.botUsername);
    }

    if (config.openclaw.enabled) {
        console.log('🦞 OpenClaw: http://localhost:18789');
    }

    console.log('');
    console.log('Press Ctrl+C to stop\n');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n👋 Shutting down gracefully...');
    process.exit(0);
});

// Start the bot
main().catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
