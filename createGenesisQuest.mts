import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

import { OPENQUEST_ABI, OPENQUEST_ADDRESS } from "./constants/contractConstants";

async function createGenesisQuest() {
    const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL || "https://mainnet.base.org");
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY!.startsWith('0x')
        ? process.env.DEPLOYER_PRIVATE_KEY!
        : `0x${process.env.DEPLOYER_PRIVATE_KEY!}`;
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(OPENQUEST_ADDRESS, OPENQUEST_ABI, signer);

    console.log("🚀 Creating Genesis Quest onchain...");

    try {
        const tx = await contract.createQuest(
            "Welcome to BaseQuest",
            "Say hello to the community on our social hub to earn your Genesis badge.",
            "BaseQuest",
            "0x0000000000000000000000000000000000000000", // No target contract needed
            0, // EASY
            2, // SOCIAL
            0, // SOULBOUND_NFT
            0, // No token amount
            "0x0000000000000000000000000000000000000000",
            365 * 24 * 60 * 60, // 1 year
            0 // Unlimited completions
        );

        console.log("⏳ Waiting for transaction...");
        await tx.wait();
        console.log("✅ Genesis Quest created! TX:", tx.hash);
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

createGenesisQuest();
