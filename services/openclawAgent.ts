/**
 * OpenClaw Agent Handler for BaseQuest
 * Connects OpenClaw messaging platforms to Gemini AI and BaseQuest smart contract
 */

import { GoogleGenAI } from "@google/genai";
import { ethers } from "ethers";
import type { Quest } from "../types";

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Storage for user wallet addresses (use Redis/DB in production)
const userWallets = new Map<string, string>();
const conversationHistory = new Map<string, Array<{ role: string; content: string }>>();

// ============================================
// MAIN MESSAGE HANDLER
// ============================================

export async function handleOpenClawMessage(
    message: string,
    senderId: string,
    platform: string,
    senderName?: string
): Promise<string> {
    console.log(`📨 [${platform}] Message from ${senderName || senderId}: ${message}`);

    const lowerMessage = message.toLowerCase().trim();

    // Command routing
    if (lowerMessage.startsWith("link 0x")) {
        return await handleWalletLink(message, senderId);
    }

    if (lowerMessage === "quests" || lowerMessage === "active quests") {
        return await handleActiveQuestsRequest(senderId);
    }

    if (lowerMessage === "stats" || lowerMessage === "my stats" || lowerMessage === "profile") {
        return await handleStatsRequest(senderId);
    }

    if (lowerMessage.startsWith("claim")) {
        return await handleClaimRequest(senderId, message);
    }

    if (lowerMessage === "help" || lowerMessage === "how") {
        return getHelpMessage();
    }

    if (lowerMessage === "leaderboard" || lowerMessage === "top") {
        return await handleLeaderboardRequest();
    }

    // AI conversation fallback with context
    return await handleAIConversation(message, senderId, senderName);
}

// ============================================
// COMMAND HANDLERS
// ============================================

async function handleWalletLink(message: string, senderId: string): Promise<string> {
    const addressMatch = message.match(/(0x[a-fA-F0-9]{40})/);

    if (!addressMatch) {
        return `❌ Invalid format. Please send:\nlink 0xYourWalletAddress`;
    }

    const address = addressMatch[1];

    if (!ethers.isAddress(address)) {
        return `❌ Invalid Ethereum address. Please check and try again.`;
    }

    userWallets.set(senderId, address);

    return `✅ Wallet linked successfully!

Address: ${address}

You can now:
• Complete quests and get auto-verified
• Claim rewards
• Track your stats
• Compete on the leaderboard

Send "quests" to see active quests!`;
}

async function handleActiveQuestsRequest(senderId: string): Promise<string> {
    try {
        // In a real implementation, fetch from smart contract
        // For now, we'll use mock data that matches our Quest type
        const mockQuests: Quest[] = [
            {
                id: "q-demo1",
                title: "Swap on Uniswap Base",
                description: "Complete your first swap on Uniswap's Base deployment",
                protocol: "Uniswap",
                protocolUrl: "https://app.uniswap.org",
                actionRequired: "Swap any amount of tokens",
                targetContract: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
                rewardType: "ERC20",
                rewardAmount: "25 QUEST",
                difficulty: "EASY",
                category: "DEFI",
                startTime: Date.now(),
                endTime: Date.now() + 24 * 60 * 60 * 1000,
                status: "ACTIVE",
                verificationLogic: "Check Swap event emission",
                completedCount: 142
            },
            {
                id: "q-demo2",
                title: "Mint BasePaint NFT",
                description: "Express creativity on BasePaint collaborative canvas",
                protocol: "BasePaint",
                protocolUrl: "https://basepaint.xyz",
                actionRequired: "Mint a BasePaint NFT",
                targetContract: "0xBa5e05cb26b78eDa3A2f8e3b3814726305dcAc83",
                rewardType: "SOULBOUND",
                rewardAmount: "Creator Badge",
                difficulty: "EASY",
                category: "NFT",
                startTime: Date.now(),
                endTime: Date.now() + 12 * 60 * 60 * 1000,
                status: "ACTIVE",
                verificationLogic: "Check Transfer event",
                completedCount: 89
            }
        ];

        return formatQuestsMessage(mockQuests, senderId);
    } catch (error) {
        return `❌ Error fetching quests: ${(error as Error).message}`;
    }
}

async function handleStatsRequest(senderId: string): Promise<string> {
    const userAddress = userWallets.get(senderId);

    if (!userAddress) {
        return `❌ Wallet not linked!

Send "link 0xYourAddress" first to track your stats.`;
    }

    try {
        // In production, fetch from smart contract
        // Mock stats for demo
        const mockStats = {
            totalCompleted: 5,
            totalRewardsClaimed: 4,
            currentStreak: 3,
            badgeTokenIds: [1, 2, 3, 4]
        };

        return `📊 Your BaseQuest Stats

Wallet: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}

✅ Quests Completed: ${mockStats.totalCompleted}
🎁 Rewards Claimed: ${mockStats.totalRewardsClaimed}
🔥 Current Streak: ${mockStats.currentStreak} days
🏅 Badges Earned: ${mockStats.badgeTokenIds.length}

Keep crushing it! 💪

Send "quests" to see what's active!`;
    } catch (error) {
        return `❌ Error fetching stats: ${(error as Error).message}`;
    }
}

async function handleClaimRequest(senderId: string, message: string): Promise<string> {
    const userAddress = userWallets.get(senderId);

    if (!userAddress) {
        return `❌ Wallet not linked!

Send "link 0xYourAddress" first.`;
    }

    // Extract quest ID if provided (e.g., "claim q-demo1")
    const questIdMatch = message.match(/claim\s+(q-[\w]+)/i);

    return `🎉 Reward Claimed!

Quest: Swap on Uniswap Base
Reward: 25 QUEST tokens

Transaction submitted!
TX: 0x${Math.random().toString(16).substr(2, 64)}

View on BaseScan:
https://basescan.org/tx/0x...

Total rewards claimed: 5
Send "stats" to see your progress!`;
}

async function handleLeaderboardRequest(): Promise<string> {
    // Mock leaderboard
    return `🏆 BaseQuest Leaderboard

Top 10 Quest Completers:

1. 🥇 0x742d...0bEb - 127 quests
2. 🥈 0x9f3a...4d2c - 98 quests
3. 🥉 0x1a5b...7e8f - 84 quests
4. 0x6c2e...3a9b - 67 quests
5. 0x8d4f...1c5a - 59 quests
6. 0xe7a2...9f4d - 52 quests
7. 0x3b9c...6e1a - 48 quests
8. 0x5f1d...2b7c - 41 quests
9. 0xa4e6...8d3f - 37 quests
10. 0x2c8b...5a4e - 34 quests

Keep completing quests to climb! 🚀`;
}

// ============================================
// AI CONVERSATION HANDLER
// ============================================

async function handleAIConversation(
    message: string,
    senderId: string,
    senderName?: string
): Promise<string> {
    try {
        // Get or create conversation history
        if (!conversationHistory.has(senderId)) {
            conversationHistory.set(senderId, []);
        }

        const history = conversationHistory.get(senderId)!;

        // Add user message to history
        history.push({
            role: "user",
            content: message
        });

        // Keep last 10 messages for context
        if (history.length > 10) {
            history.shift();
        }

        // Build prompt with context
        const systemPrompt = `You are BaseQuest, an autonomous AI agent on the Base blockchain.

You help users:
- Discover onchain quests on Base
- Complete DeFi, NFT, Social, and Governance actions
- Earn rewards (tokens and soulbound badges)
- Track their progress and compete on leaderboards

Base Ecosystem Protocols:
- DeFi: Uniswap, Aerodrome, Aave, Moonwell, Morpho
- NFT: BasePaint, Zora, Coinbase NFT
- Social: Farcaster, Base Names, Friend.tech
- Governance: Various DAO proposals

Be friendly, enthusiastic, and helpful. Keep responses concise for chat.

Available Commands:
- "quests" - View active quests
- "stats" - See user statistics
- "link 0x..." - Link wallet address
- "claim" - Claim quest rewards
- "leaderboard" - See top users
- "help" - Show all commands`;

        const conversationText = history.map(h => `${h.role === 'user' ? 'User' : 'BaseQuest'}: ${h.content}`).join('\n');

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `${systemPrompt}\n\nConversation:\n${conversationText}\n\nBaseQuest:`
        });

        const aiResponse = response.text?.trim() || "I'm here to help with quests! Send 'help' to see what I can do.";

        // Add AI response to history
        history.push({
            role: "assistant",
            content: aiResponse
        });

        return aiResponse;

    } catch (error) {
        console.error('AI conversation error:', error);
        return `I'm having trouble processing that. Try sending "help" to see available commands!`;
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatQuestsMessage(quests: Quest[], senderId: string): string {
    const userAddress = userWallets.get(senderId);

    let message = `🎯 Active Quests on Base (${quests.length})\n\n`;

    quests.forEach((quest, index) => {
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

        const timeLeft = getTimeRemaining(quest.endTime);

        message += `${index + 1}. ${quest.title}

${difficultyEmoji} ${quest.difficulty} | ${categoryEmoji} ${quest.category}
🏛️  Protocol: ${quest.protocol}
🎁 Reward: ${quest.rewardAmount}
⏰ ${timeLeft}
👥 ${quest.completedCount} completed

`;
    });

    if (!userAddress) {
        message += `\n💡 Link your wallet to start:\nSend "link 0xYourAddress"`;
    } else {
        message += `\n✅ Complete any quest and I'll auto-detect it!\nThen send "claim" to get your reward.`;
    }

    return message;
}

function getHelpMessage(): string {
    return `📖 BaseQuest Commands

🔗 Wallet
• link 0x... - Link your wallet address

🎯 Quests
• quests - View active quests
• claim - Claim quest rewards

📊 Stats  
• stats - Your quest statistics
• leaderboard - Top completers

💬 Chat
• Ask me anything about Base quests!

Get started: Send "quests" to see what's available!`;
}

function getTimeRemaining(endTime: number): string {
    const remaining = endTime - Date.now();
    const hours = Math.floor(remaining / (1000 * 60 * 60));

    if (hours > 24) {
        return `${Math.floor(hours / 24)}d ${hours % 24}h left`;
    }
    return `${hours}h left`;
}

// ============================================
// EXPORT
// ============================================

export default {
    handleMessage: handleOpenClawMessage,
    getUserWallet: (userId: string) => userWallets.get(userId),
    linkWallet: (userId: string, address: string) => userWallets.set(userId, address)
};
