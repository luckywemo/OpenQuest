import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

const OPENQUEST_ADDRESS = "0x6c8DB116C32b60F86b483A495565f431EA25068A";
const OPENQUEST_ABI = [
    "function getContractStats() view returns (uint256 totalQuests, uint256 totalParticipants, uint256 totalCompletions, uint256 totalBadgesMinted)",
    "function quests(uint256) view returns (uint256 id, string title, string description, string protocol, address targetContract, uint8 difficulty, uint8 category, uint8 rewardType, uint256 rewardAmount, address rewardToken, uint256 startTime, uint256 endTime, bool active, uint256 completionCount, uint256 maxCompletions)"
];

async function verifyMainnet() {
    const rpc = process.env.BASE_RPC_URL || "https://mainnet.base.org";
    console.log(`🔍 Verifying contract at: ${OPENQUEST_ADDRESS} on ${rpc}`);
    const provider = new ethers.JsonRpcProvider(rpc);

    try {
        const code = await provider.getCode(OPENQUEST_ADDRESS);
        if (code === "0x") {
            console.log("❌ No code at this address on Base Mainnet.");
            return;
        }
        console.log("✅ Code found at address.");

        const contract = new ethers.Contract(OPENQUEST_ADDRESS, OPENQUEST_ABI, provider);
        const stats = await contract.getContractStats();
        console.log("📊 Stats:", {
            totalQuests: stats.totalQuests.toString(),
            totalParticipants: stats.totalParticipants.toString(),
            totalCompletions: stats.totalCompletions.toString()
        });

        if (stats.totalQuests > 0n) {
            console.log("\n📍 Active Quests:");
            for (let i = 1; i <= Number(stats.totalQuests); i++) {
                const q = await contract.quests(i);
                console.log(`[${i}] ${q.title} (${q.active ? 'ACTIVE' : 'INACTIVE'})`);
            }
        }
    } catch (error) {
        console.log(`⚠️ Error: ${(error as Error).message}`);
    }
}

verifyMainnet();
