import fs from 'fs';
import path from 'path';
import { Quest, QuestStatus } from '../types';
import { kv } from './redisService';
import { ethers } from 'ethers';
import { OPENQUEST_ABI, OPENQUEST_ADDRESS } from '../constants/contractConstants';
import dotenv from 'dotenv';
dotenv.config();

const QUESTS_FILE = path.join(process.cwd(), 'data', 'quests.json');

function ensureDataDir() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

// FS Fallback Load
function loadQuestsFs(): Quest[] {
    ensureDataDir();
    if (!fs.existsSync(QUESTS_FILE)) return [];
    try {
        const data = fs.readFileSync(QUESTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// FS Fallback Save
function saveQuestsFs(quests: Quest[]) {
    ensureDataDir();
    fs.writeFileSync(QUESTS_FILE, JSON.stringify(quests, null, 2));
}

export async function loadQuests(): Promise<Quest[]> {
    const quests = await kv.get<Quest[]>('quests');
    if (quests) return quests;
    return loadQuestsFs();
}

export async function addQuest(quest: Quest) {
    const quests = await loadQuests();

    try {
        console.log(`🔗 Deploying quest "${quest.title}" onchain...`);
        const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL || "https://mainnet.base.org");
        const privateKey = process.env.DEPLOYER_PRIVATE_KEY!.startsWith('0x')
            ? process.env.DEPLOYER_PRIVATE_KEY!
            : `0x${process.env.DEPLOYER_PRIVATE_KEY!}`;
        const signer = new ethers.Wallet(privateKey, provider);
        const contract = new ethers.Contract(OPENQUEST_ADDRESS, OPENQUEST_ABI, signer);

        const tx = await contract.createQuest(
            quest.title,
            quest.description,
            quest.protocol,
            quest.targetContract || "0x0000000000000000000000000000000000000000",
            ["EASY", "MEDIUM", "HARD"].indexOf(quest.difficulty),
            ["DEFI", "NFT", "SOCIAL", "GOVERNANCE"].indexOf(quest.category),
            ["SOULBOUND", "ERC20", "NATIVE"].indexOf(quest.rewardType),
            quest.rewardAmount ? (quest.rewardType === 'ERC20' ? ethers.parseUnits(quest.rewardAmount, 18) : ethers.parseEther(quest.rewardAmount)) : 0,
            "0x0000000000000000000000000000000000000000", // Default reward token for demo
            Math.floor((quest.endTime - quest.startTime) / 1000),
            0 // Unlimited completions
        );

        console.log(`⏳ Waiting for onchain quest deployment...`);
        await tx.wait();
        console.log(`✅ Quest deployed onchain! TX: ${tx.hash}`);
    } catch (error) {
        console.error("❌ Failed to deploy quest onchain:", error);
    }

    quests.push(quest);
    await kv.set('quests', quests);
    saveQuestsFs(quests); // Mirror to FS for safety/local
}

export async function getActiveQuests(): Promise<Quest[]> {
    const now = Date.now();
    const quests = await loadQuests();
    return quests.filter(q => q.status === QuestStatus.ACTIVE && (q.endTime > now || !q.endTime));
}

export async function archiveExpiredQuests() {
    const now = Date.now();
    const quests = await loadQuests();
    const updated = quests.map(q => {
        if (q.status === QuestStatus.ACTIVE && q.endTime < now) {
            return { ...q, status: QuestStatus.EXPIRED };
        }
        return q;
    });
    await kv.set('quests', updated);
    saveQuestsFs(updated);
}

export async function updateQuestParticipantCount(questId: string) {
    const quests = await loadQuests();
    const index = quests.findIndex(q => q.id === questId);
    if (index !== -1) {
        quests[index].completedCount += 1;
        await kv.set('quests', quests);
        saveQuestsFs(quests);
    }
}
