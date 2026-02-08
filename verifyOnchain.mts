import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

import { OPENQUEST_ABI, OPENQUEST_ADDRESS } from "./constants/contractConstants";

async function verifyOnchain() {
    const rpcs = [
        process.env.BASE_SEPOLIA_RPC_URL,
        "https://sepolia.base.org",
        "https://base-sepolia-rpc.publicnode.com"
    ];

    console.log(`🔍 Verifying contract at: ${OPENQUEST_ADDRESS}`);

    for (const rpc of rpcs) {
        if (!rpc) continue;
        console.log(`\n🌐 Checking RPC: ${rpc}`);
        const provider = new ethers.JsonRpcProvider(rpc);

        try {
            const code = await provider.getCode(OPENQUEST_ADDRESS);
            if (code === "0x") {
                console.log("❌ No code at this address on this network.");
                continue;
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
                const q = await contract.quests(1);
                console.log("📍 Quest #1:", q.title);
            }

            break; // Success!
        } catch (error) {
            console.log(`⚠️ Error on this RPC: ${(error as Error).message}`);
        }
    }
}

verifyOnchain();
