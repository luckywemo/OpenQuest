/**
 * Twitter/X Bot Integration for BaseQuest
 * Handles mentions, DMs, quest announcements, and reward celebrations
 */

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

import { TwitterApi, ETwitterStreamEvent } from 'twitter-api-v2';
import { GoogleGenAI } from "@google/genai";
import type { Quest } from "../types";

// Validate Twitter credentials
if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET ||
    !process.env.TWITTER_ACCESS_TOKEN || !process.env.TWITTER_ACCESS_SECRET) {
    console.error('❌ Missing Twitter API credentials in .env file');
    console.error('Required: TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET');
    process.exit(1);
}

// Initialize Twitter client
const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// v1.1 and v2 clients
const v1Client = twitterClient.v1;
const v2Client = twitterClient.v2;

// Initialize Gemini AI lazily
let aiInstance: GoogleGenAI | null = null;
function getAi() {
    if (!aiInstance) {
        aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    }
    return aiInstance;
}

// Storage for user wallet addresses (use Redis/DB in production)
const userWallets = new Map<string, string>();
const twitterHandles = new Map<string, string>(); // userId -> @handle
const processedTweets = new Set<string>(); // Track processed tweet IDs

// ============================================
// QUEST ANNOUNCEMENTS
// ============================================

export async function announceNewQuest(quest: Quest): Promise<string | null> {
    try {
        const difficultyEmoji = {
            EASY: '🟢',
            MEDIUM: '🟡',
            HARD: '🔴'
        }[quest.difficulty];

        const categoryEmoji = {
            DEFI: '💱',
            NFT: '🖼️',
            SOCIAL: '👥',
            GOVERNANCE: '🗳️'
        }[quest.category];

        const tweet = `🎯 NEW QUEST LIVE ON BASE

${quest.title}

${difficultyEmoji} ${quest.difficulty} | ${categoryEmoji} ${quest.category}
🏛️ ${quest.protocol}
🎁 ${quest.rewardAmount || 'Soulbound Badge'}
⏰ ${getTimeRemaining(quest.endTime)}

Complete & claim via WhatsApp:
👉 Message @OpenQuest

#OpenQuest #Onchain`;

        const response = await v2Client.tweet(tweet);
        console.log(`📢 Quest announced on Twitter: ${response.data.id}`);
        console.log(`   Users can interact via WhatsApp/OpenClaw`);
        return response.data.id;
    } catch (error) {
        console.error('Error announcing quest:', error);
        return null;
    }
}

// ============================================
// LISTEN TO MENTIONS
// ============================================

export async function startMentionListener(botUsername: string) {
    try {
        console.log(`🐦 Starting Twitter mention listener for @${botUsername}...`);
        console.log('📝 Note: Using polling mode (Free tier compatible)');

        // Poll for mentions every 60 seconds
        setInterval(async () => {
            try {
                // Search for recent mentions (last 30 seconds)
                const mentions = await v2Client.search(`@${botUsername}`, {
                    max_results: 10,
                    'tweet.fields': ['author_id', 'created_at'],
                    'user.fields': ['username'],
                    expansions: ['author_id'],
                });

                if (!mentions.data?.data) return;

                for (const tweet of mentions.data.data) {
                    // Avoid processing same tweet twice
                    if (processedTweets.has(tweet.id)) continue;
                    processedTweets.add(tweet.id);

                    const text = tweet.text;
                    const userId = tweet.author_id!;
                    const username = mentions.data.includes?.users?.find(u => u.id === userId)?.username || 'user';

                    // Skip our own tweets
                    const me = await v2Client.me();
                    if (userId === me.data.id) continue;

                    console.log(`📥 Mention from @${username}: ${text}`);

                    // Save username for later
                    twitterHandles.set(userId, username);

                    // Route to appropriate handler
                    await handleMention(tweet.id, userId, username, text);
                }
            } catch (error: any) {
                // Silently handle rate limits and transient errors
                if (error.code !== 429) {
                    console.error('Error checking mentions:', error.message);
                }
            }
        }, 30000); // Check every 30 seconds

        console.log('✅ Twitter mention listener started (polling mode)');
    } catch (error) {
        console.error('Failed to start mention listener:', error);
    }
}

import openclawAgent from './openclawAgent';

// ... inside handleMention ...
async function handleMention(tweetId: string, userId: string, username: string, text: string) {
    const cleanText = text.replace(/@\w+/g, '').trim();

    try {
        // Use the common OpenClaw agent logic for all commands (Quests, Stats, Claim, Bankr, etc.)
        const response = await openclawAgent.handleMessage(
            cleanText || "help",
            userId,
            'twitter',
            username
        );

        // Ensure response fits in a tweet (280 chars)
        let reply = `@${username} ${response}`;
        if (reply.length > 280) {
            reply = reply.substring(0, 277) + '...';
        }

        await v2Client.reply(reply, tweetId);
    } catch (error) {
        console.error(`Error handling mention from @${username}:`, error);
    }
}

// ============================================
// COMMAND HANDLERS
// ============================================

async function handleQuestsCommand(tweetId: string, userId: string, username: string) {
    // Mock quests (in production, fetch from smart contract)
    const response = `@${username} 🎯 Active Quests:

1️⃣ Swap on Uniswap Base
   🟢 EASY | 💱 DEFI
   Reward: 25 QUEST | ⏰ 23h left

2️⃣ Mint BasePaint NFT
   🟢 EASY | 🖼️ NFT
   Reward: Creator Badge | ⏰ 11h left

DM me "link 0xYourAddress" to start!

More: basequest.app`;

    await v2Client.reply(response, tweetId);
}

async function handleStatsCommand(tweetId: string, userId: string, username: string) {
    const userAddress = userWallets.get(userId);

    if (!userAddress) {
        await v2Client.reply(
            `@${username} 👋 First time here?\n\nDM me to link your wallet:\n"link 0xYourAddress"\n\nThen I can track your stats! 📊`,
            tweetId
        );
        return;
    }

    // Mock stats (in production, fetch from smart contract)
    const response = `@${username} 📊 Your Stats:

✅ Completed: 5 quests
🎁 Rewards: 4 claimed
🔥 Streak: 3 days
🏅 Badges: 4

Keep crushing it! 💪`;

    await v2Client.reply(response, tweetId);
}

async function handleHowCommand(tweetId: string, userId: string, username: string) {
    const response = `@${username} 📖 How BaseQuest Works:

1️⃣ DM me: "link 0xYourAddress"
2️⃣ Complete onchain actions (swap, mint, etc)
3️⃣ I auto-detect within 30 seconds! ⚡
4️⃣ Reply "claim" to get rewards

Start: basequest.app`;

    await v2Client.reply(response, tweetId);
}

async function handleClaimCommand(tweetId: string, userId: string, username: string) {
    const userAddress = userWallets.get(userId);

    if (!userAddress) {
        await v2Client.reply(
            `@${username} Link your wallet first!\n\nDM me: "link 0xYourAddress"`,
            tweetId
        );
        return;
    }

    // Mock claim (in production, call smart contract)
    const txHash = '0x' + Math.random().toString(16).substr(2, 64);

    const response = `@${username} 🎉 Reward Claimed!

Quest: Swap on Uniswap Base
Reward: 25 QUEST tokens

TX: basescan.org/tx/${txHash}

Total claimed: 5 🏆`;

    await v2Client.reply(response, tweetId);
}

async function handleLeaderboardCommand(tweetId: string) {
    const response = `🏆 Top 5 Quest Crushers:

1. 🥇 @cryptowhale - 127 quests
2. 🥈 @baseddev - 98 quests  
3. 🥉 @onchainmaxi - 84 quests
4. @degentrader - 67 quests
5. @nftcollector - 59 quests

Full leaderboard: basequest.app/leaderboard`;

    await v2Client.reply(response, tweetId);
}

async function handleAIResponse(tweetId: string, userId: string, username: string, text: string) {
    try {
        const prompt = `You are BaseQuest, an autonomous quest agent on Base blockchain.

User @${username} mentioned: "${text}"

Respond helpfully in 280 characters or less. Focus on Base ecosystem quests.
Be friendly and use emojis. Start with @${username}`;

        const response = await getAi().models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });

        let reply = response.text?.trim() || `@${username} I'm here to help with Base quests! Reply "how" to learn more! 🎯`;

        // Ensure it starts with @username
        if (!reply.startsWith(`@${username}`)) {
            reply = `@${username} ${reply}`;
        }

        // Truncate if too long
        if (reply.length > 280) {
            reply = reply.substring(0, 277) + '...';
        }

        await v2Client.reply(reply, tweetId);
    } catch (error) {
        console.error('AI response error:', error);
        await v2Client.reply(
            `@${username} I'm here to help with quests! Reply "how" to see what I can do! 🎯`,
            tweetId
        );
    }
}

// ============================================
// HANDLE DMs (for wallet linking)
// ============================================

export async function startDMListener() {
    console.log('💬 Starting Twitter DM listener...');

    // Poll for DMs every 15 seconds
    setInterval(async () => {
        try {
            const dms = await (v1Client as any).listDmEvents({ count: 50 });

            if (!dms.events) return;

            const me = await v2Client.me();

            for (const event of dms.events) {
                const senderId = event.message_create?.sender_id;

                // Skip our own messages
                if (senderId === me.data.id) continue;

                const message = event.message_create?.message_data?.text || '';

                // Check if it's a wallet link command
                if (message.toLowerCase().startsWith('link 0x')) {
                    await handleWalletLink(senderId!, message);
                }
            }
        } catch (error) {
            console.error('DM listener error:', error);
        }
    }, 15000);

    console.log('✅ Twitter DM listener started');
}

async function handleWalletLink(userId: string, message: string) {
    const addressMatch = message.match(/(0x[a-fA-F0-9]{40})/);

    if (!addressMatch) {
        await sendDM(userId, '❌ Invalid format. Send: link 0xYourAddress');
        return;
    }

    const address = addressMatch[1];
    userWallets.set(userId, address);

    await sendDM(userId, `✅ Wallet linked!

Address: ${address}

You can now:
• Complete quests
• Get auto-verified
• Claim rewards
• Track stats

Mention me with "quests" to see what's active! 🎯`);
}

async function sendDM(recipientId: string, text: string) {
    try {
        await (v1Client as any).sendDm({
            recipient_id: recipientId,
            text: text
        });
    } catch (error) {
        console.error('Error sending DM:', error);
    }
}

// ============================================
// AUTO-CELEBRATE COMPLETIONS
// ============================================

export async function celebrateCompletion(quest: Quest, userAddress: string) {
    try {
        // Find user's Twitter handle
        let username = '';
        for (const [userId, address] of userWallets.entries()) {
            if (address.toLowerCase() === userAddress.toLowerCase()) {
                username = twitterHandles.get(userId) || '';
                break;
            }
        }

        const difficultyEmoji = {
            EASY: '🟢',
            MEDIUM: '🟡',
            HARD: '🔴'
        }[quest.difficulty];

        const tweet = username
            ? `🎉 QUEST COMPLETED!

${username ? '@' + username : 'Someone'} just crushed:
"${quest.title}"

${difficultyEmoji} ${quest.difficulty} ${quest.category} quest ✅

Claim your reward via WhatsApp:
👉 Message @OpenQuest

#OpenQuest`
            : `🎉 Someone just completed:
"${quest.title}"

${difficultyEmoji} ${quest.difficulty} quest ✅

Join via WhatsApp & start earning!
👉 Message @OpenQuest

#OpenQuest`;

        await v2Client.tweet(tweet);
        console.log(`🎊 Celebrated completion on Twitter`);
    } catch (error) {
        console.error('Error celebrating completion:', error);
    }
}

// ============================================
// DAILY STATS TWEET
// ============================================

export async function tweetDailyStats() {
    try {
        // Mock stats (in production, fetch from contract)
        const tweet = `📊 BaseQuest Daily Stats

🎯 Quests Completed: 247
👥 Active Users: 89
🎁 Rewards Distributed: 182
🔥 Hottest Quest: Uniswap Swap

Keep building onchain! 🚀

#Base #BaseQuest`;

        await v2Client.tweet(tweet);
        console.log('📈 Daily stats tweeted');
    } catch (error) {
        console.error('Error tweeting daily stats:', error);
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getTimeRemaining(endTime: number): string {
    const remaining = endTime - Date.now();
    const hours = Math.floor(remaining / (1000 * 60 * 60));

    if (hours > 24) {
        return `${Math.floor(hours / 24)}d ${hours % 24}h left`;
    }
    return `${hours}h left`;
}

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================

export default {
    announceNewQuest,
    startMentionListener,
    startDMListener,
    celebrateCompletion,
    tweetDailyStats,
    getUserWallet: (userId: string) => userWallets.get(userId),
    linkWallet: (userId: string, address: string) => userWallets.set(userId, address)
};
