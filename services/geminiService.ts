import { GoogleGenAI, Type } from "@google/genai";
import { Quest, QuestStatus } from "../types";

// Always use process.env.API_KEY directly during initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fallback quests if Gemini API fails
const FALLBACK_QUESTS: Omit<Quest, 'id' | 'startTime' | 'endTime' | 'status' | 'completedCount'>[] = [
  {
    title: "Swap on Uniswap Base",
    description: "Complete your first swap on Uniswap's Base deployment. Join millions of users trading on the world's leading DEX.",
    protocol: "Uniswap",
    protocolUrl: "https://app.uniswap.org",
    actionRequired: "Swap any amount of tokens",
    targetContract: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
    rewardType: "ERC20",
    rewardAmount: "25 QUEST",
    difficulty: "EASY" as const,
    category: "DEFI" as const,
    verificationLogic: "Check for Swap event emission from user address on Uniswap V3 Router"
  },
  {
    title: "Provide Liquidity on Aerodrome",
    description: "Become a liquidity provider on Aerodrome Finance. Earn trading fees while supporting the Base DeFi ecosystem.",
    protocol: "Aerodrome",
    protocolUrl: "https://aerodrome.finance",
    actionRequired: "Add liquidity to any pool",
    targetContract: "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43",
    rewardType: "SOULBOUND",
    rewardAmount: "LP Badge #001",
    difficulty: "MEDIUM" as const,
    category: "DEFI" as const,
    verificationLogic: "Verify Mint event from Aerodrome pools with user as recipient"
  },
  {
    title: "Create on BasePaint",
    description: "Express your creativity on BasePaint. Contribute to the collaborative canvas and become part of Base's creative community.",
    protocol: "BasePaint",
    protocolUrl: "https://basepaint.xyz",
    actionRequired: "Mint a BasePaint NFT",
    targetContract: "0xBa5e05cb26b78eDa3A2f8e3b3814726305dcAc83",
    rewardType: "SOULBOUND",
    rewardAmount: "Creator Badge",
    difficulty: "EASY" as const,
    category: "NFT" as const,
    verificationLogic: "Check Transfer event from BasePaint contract to user address"
  }
];

export const generateNewQuest = async (previousQuests: string[]): Promise<Quest> => {
  try {
    // Determine difficulty distribution (60% easy, 30% medium, 10% hard)
    const rand = Math.random();
    let targetDifficulty: 'EASY' | 'MEDIUM' | 'HARD';
    if (rand < 0.6) targetDifficulty = 'EASY';
    else if (rand < 0.9) targetDifficulty = 'MEDIUM';
    else targetDifficulty = 'HARD';

    // Rotate categories for variety
    const categories = ['DEFI', 'NFT', 'SOCIAL', 'GOVERNANCE'];
    const targetCategory = categories[Math.floor(Math.random() * categories.length)];

    const prompt = `You are BaseQuest, an autonomous agent on the Base network. 
Generate a new onchain quest for real users on the Base blockchain.

PREVIOUS QUESTS (avoid repetition): ${previousQuests.join(', ')}

TARGET DIFFICULTY: ${targetDifficulty}
TARGET CATEGORY: ${targetCategory}

QUEST REQUIREMENTS:
1. Must target a real Base protocol from this list:
   - DeFi: Uniswap, Aerodrome, Aave, Moonwell, Morpho, BaseSwap, Velodrome
   - NFT: BasePaint, Zora, Unlock Protocol, Coinbase NFT
   - Social: Friend.tech, Farcaster, Lens Protocol, Base Names
   - Governance: Base DAO proposals, Protocol governance votes

2. Action must be quantifiable onchain and verifiable through smart contract events

3. Difficulty guidelines:
   - EASY: Simple actions (single swap <$10, NFT mint, social follow)
   - MEDIUM: Multi-step or moderate value ($10-100 volume, LP provision)
   - HARD: Complex strategies, governance participation, high value ($100+)

4. Include accurate contract addresses for Base mainnet

5. Reward should match difficulty:
   - EASY: 10-25 points or basic badge
   - MEDIUM: 50-100 points or silver badge
   - HARD: 200+ points or gold badge

Return a complete quest as JSON.`;

    // Use ai.models.generateContent with enhanced schema
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Engaging quest title (max 60 chars)" },
            description: { type: Type.STRING, description: "Clear quest description explaining value proposition" },
            protocol: { type: Type.STRING, description: "Protocol name" },
            protocolUrl: { type: Type.STRING, description: "Official website or documentation URL" },
            actionRequired: { type: Type.STRING, description: "Specific action user must complete" },
            targetContract: { type: Type.STRING, description: "Base mainnet contract address (0x...)" },
            rewardType: { type: Type.STRING, enum: ["SOULBOUND", "ERC20"] },
            rewardAmount: { type: Type.STRING, description: "Reward quantity and denomination" },
            difficulty: { type: Type.STRING, enum: ["EASY", "MEDIUM", "HARD"] },
            category: { type: Type.STRING, enum: ["DEFI", "NFT", "SOCIAL", "GOVERNANCE"] },
            verificationLogic: { type: Type.STRING, description: "Technical verification method (events, function calls)" }
          },
          required: ["title", "description", "protocol", "protocolUrl", "actionRequired", "targetContract", "rewardType", "rewardAmount", "difficulty", "category", "verificationLogic"]
        }
      }
    });

    // Extract and parse response
    const jsonStr = response.text?.trim() || '{}';
    const data = JSON.parse(jsonStr);
    const now = Date.now();

    return {
      id: `q-${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      startTime: now,
      endTime: now + 24 * 60 * 60 * 1000,
      status: QuestStatus.ACTIVE,
      completedCount: 0
    };
  } catch (error) {
    // Fallback to template quest on error
    console.error('Gemini quest generation failed, using fallback:', error);
    const fallback = FALLBACK_QUESTS[Math.floor(Math.random() * FALLBACK_QUESTS.length)];
    const now = Date.now();

    return {
      id: `q-fallback-${Math.random().toString(36).substr(2, 9)}`,
      ...fallback,
      startTime: now,
      endTime: now + 24 * 60 * 60 * 1000,
      status: QuestStatus.ACTIVE,
      completedCount: 0
    };
  }
};

export const verifyAddress = async (quest: Quest, address: string): Promise<boolean> => {
  // In a real app, this would query a Base indexer or JSON-RPC.
  // For this demo, we use Gemini to "simulate" a logic-based verification check if needed,
  // but here we'll just mock it with a random success for the UI logic.
  return Math.random() > 0.5;
};
