import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

import { OPENQUEST_ABI, OPENQUEST_ADDRESS } from "./constants/contractConstants";

async function checkContract() {
    const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
    const contract = new ethers.Contract(OPENQUEST_ADDRESS, OPENQUEST_ABI, provider);

    try {
        const stats = await contract.getContractStats();
        console.log("Contract Stats:");
        console.log("Total Quests:", stats.totalQuests.toString());
        console.log("Total Participants:", stats.totalParticipants.toString());
        console.log("Total Completions:", stats.totalCompletions.toString());

        if (stats.totalQuests > 0n) {
            const quest = await contract.quests(stats.totalQuests);
            console.log("\nLatest Quest:");
            console.log("ID:", quest.id.toString());
            console.log("Title:", quest.title);
            console.log("Active:", quest.active);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

checkContract();
