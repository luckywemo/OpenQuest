import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import { ethers } from "ethers";
import { Quest, QuestStatus } from "../types";
import aiJudgeService from "./aiJudgeService";
import { executeBankrCommand, getBankrHelp, isBankrAvailable } from "./bankrService";
import { OPENQUEST_ABI, OPENQUEST_ADDRESS } from "../constants/contractConstants";

// Initialize Gemini AI lazily
let aiInstance: GoogleGenAI | null = null;
function getAi() {
    if (!aiInstance) {
        aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    }
    return aiInstance;
}

// Initialize Provider and Signer
const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL || "https://mainnet.base.org");
const privateKey = process.env.DEPLOYER_PRIVATE_KEY!.startsWith('0x')
    ? process.env.DEPLOYER_PRIVATE_KEY!
    : `0x${process.env.DEPLOYER_PRIVATE_KEY!}`;
const signer = new ethers.Wallet(privateKey, provider);
const openQuestContract = new ethers.Contract(OPENQUEST_ADDRESS, OPENQUEST_ABI, signer);

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

    if (lowerMessage.startsWith("submit")) {
        return await handleSubmitRequest(senderId, message);
    }

    if (lowerMessage === "help" || lowerMessage === "how") {
        return getHelpMessage();
    }

    if (lowerMessage === "leaderboard" || lowerMessage === "top") {
        return await handleLeaderboardRequest();
    }

    // Bankr trading commands
    if (lowerMessage.startsWith("bankr ") ||
        lowerMessage.startsWith("trade ") ||
        lowerMessage.startsWith("buy ") ||
        lowerMessage.startsWith("sell ") ||
        lowerMessage.startsWith("swap ") ||
        lowerMessage === "portfolio" ||
        lowerMessage === "balance") {
        return await handleBankrCommand(message, senderId);
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
        const stats = await openQuestContract.getContractStats();
        const totalQuests = Number(stats.totalQuests);

        const activeQuests: Quest[] = [];

        // Fetch last 5 quests for the demo/active list
        for (let i = Math.max(1, totalQuests - 4); i <= totalQuests; i++) {
            const q = await openQuestContract.quests(i);
            if (q.active) {
                activeQuests.push({
                    id: q.id.toString(),
                    title: q.title,
                    description: q.description,
                    protocol: q.protocol,
                    protocolUrl: "", // Contract doesn't store this, could map it
                    actionRequired: q.description,
                    targetContract: q.targetContract,
                    rewardType: ["SOULBOUND", "ERC20", "NATIVE"][q.rewardType] as any,
                    rewardAmount: q.rewardType === 2 ? ethers.formatEther(q.rewardAmount) + " ETH" : q.rewardAmount.toString(),
                    difficulty: ["EASY", "MEDIUM", "HARD"][q.difficulty] as any,
                    category: ["DEFI", "NFT", "SOCIAL", "GOVERNANCE"][q.category] as any,
                    startTime: Number(q.startTime) * 1000,
                    endTime: Number(q.endTime) * 1000,
                    status: QuestStatus.ACTIVE,
                    verificationLogic: "Onchain Verification",
                    completedCount: Number(q.completionCount)
                });
            }
        }

        if (activeQuests.length === 0) {
            return `🎯 No active quests found on the contract right now. Check back soon!`;
        }

        return formatQuestsMessage(activeQuests, senderId);
    } catch (error) {
        console.error("Error fetching quests from contract:", error);
        return `❌ Error fetching live quests: ${(error as Error).message}`;
    }
}

async function handleStatsRequest(senderId: string): Promise<string> {
    const userAddress = userWallets.get(senderId);

    if (!userAddress) {
        return `❌ Wallet not linked! Send "link 0xYourAddress" first to track your stats.`;
    }

    try {
        const stats = await openQuestContract.getUserStats(userAddress);

        return `📊 Your OpenQuest Stats (Onchain)

Wallet: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}

✅ Quests Completed: ${stats.totalCompleted.toString()}
🎁 Rewards Claimed: ${stats.totalRewardsClaimed.toString()}
🔥 Current Streak: ${stats.currentStreak.toString()} completions
🏅 Badges Earned: ${stats.badgeTokenIds.length}

Keep crushing it! 💪

Send "quests" to see what's active!`;
    } catch (error) {
        console.error("Stats error:", error);
        return `❌ Error fetching onchain stats: ${(error as Error).message}`;
    }
}

async function handleClaimRequest(senderId: string, message: string): Promise<string> {
    const userAddress = userWallets.get(senderId);

    if (!userAddress) {
        return `❌ Wallet not linked! Send "link 0xYourAddress" first.`;
    }

    // Extract quest ID if provided (e.g., "claim 1")
    const questIdMatch = message.match(/claim\s+(\d+)/i);
    const questId = questIdMatch ? questIdMatch[1] : null;

    if (!questId) {
        return `❌ Please specify the quest ID to claim.\nExample: claim 1`;
    }

    try {
        // We can't claim FOR the user easily via messaging (requires their signature)
        // For the demo, the Agent can "push" the claim if authorized, 
        // or provide a link to the web dashboard.

        return `🎁 To claim your reward for Quest #${questId}, please visit the OpenQuest dashboard:
        
https://overriding-carie-prepotently.ngrok-free.dev/profile

(Transaction signing requires your connected wallet)`;
    } catch (error) {
        return `❌ Error processing claim: ${(error as Error).message}`;
    }
}

async function handleSubmitRequest(senderId: string, message: string): Promise<string> {
    const content = message.replace(/^submit\s+/i, '').trim();
    const userAddress = userWallets.get(senderId);

    if (!userAddress) {
        return `❌ Wallet not linked! Send "link 0xYourAddress" first so I can record your completion.`;
    }

    if (!content) {
        return `❌ Nothing to submit! Please provide a link or text.\nExample: submit https://mirror.xyz/...`;
    }

    try {
        // For demo, we'll evaluate for the most recent quest
        const stats = await openQuestContract.getContractStats();
        const questId = Number(stats.totalQuests);
        const quest = await openQuestContract.quests(questId);

        const result = await aiJudgeService.evaluateContent(content, quest.title, quest.description);

        if (result.isApproved) {
            console.log(`✅ Approved submission from ${userAddress}. Recording onchain...`);

            // Record completion onchain (Agent is authorized)
            const tx = await openQuestContract.recordCompletion(
                questId,
                userAddress,
                ethers.id(content) // Use content hash as proof
            );

            await tx.wait();

            return `✅ SUBMISSION APPROVED! Score: ${result.score}/100
            
"${result.feedback}"

🚀 Your completion has been recorded on the Base blockchain!
TX: ${tx.hash}

You can now visit the dashboard to claim your reward.`;
        } else {
            return `❌ SUBMISSION REJECTED. Score: ${result.score}/100

"${result.feedback}"

Please improve your content and try again!`;
        }
    } catch (error) {
        console.error("Submission error:", error);
        return `❌ Error reviewing submission: ${(error as Error).message}`;
    }
}

async function handleLeaderboardRequest(): Promise<string> {
    // Mock leaderboard
    return `🏆 OpenQuest Leaderboard

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
        const systemPrompt = `You are OpenQuest, an autonomous AI agent on the Base blockchain.

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

        const conversationText = history.map(h => `${h.role === 'user' ? 'User' : 'OpenQuest'}: ${h.content}`).join('\n');

        // Use getAi().models.generateContent
        const response = await getAi().models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `${systemPrompt}\n\nConversation:\n${conversationText}\n\nOpenQuest:`
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

// ============================================
// BANKR TRADING HANDLER
// ============================================

async function handleBankrCommand(message: string, senderId: string): Promise<string> {
    console.log(`🪙 [Bankr] Command from ${senderId}: ${message}`);

    if (!isBankrAvailable()) {
        return `❌ Bankr is not configured yet.

To enable crypto trading:
1. Visit https://bankr.bot/api
2. Create an API key with "Agent API" access
3. Save it to .skills/bankr/config.json

Bankr enables:
• Token trading across Base, ETH, Polygon, Solana
• Portfolio management
• NFT operations
• Leverage trading & Polymarket
• DeFi automation`;
    }

    try {
        // Remove the "bankr" prefix if present
        let command = message.trim();
        if (command.toLowerCase().startsWith('bankr ')) {
            command = command.substring(6).trim();
        }

        const response = await executeBankrCommand(command);
        return `🪙 **Bankr Response:**

${response}`;
    } catch (error: any) {
        console.error('[Bankr] Error:', error);
        return `❌ Bankr command failed: ${error.message}

Try "help" to see available commands.`;
    }
}

function getHelpMessage(): string {
    return `📖 OpenQuest Commands

🔗 Wallet
• link 0x... - Link your wallet address

🎯 Quests
• quests - View active quests
• submit [link/text] - Submit content for review
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
