// Deploy OpenQuest to Base Mainnet
import { ethers } from "ethers";
import fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    console.log("\n╔══════════════════════════════════════╗");
    console.log("║  Deploying OpenQuest to Base        ║");
    console.log("╚══════════════════════════════════════╝\n");

    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
    const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

    console.log("📝 Deployment Details:");
    console.log("   Deployer:", wallet.address);
    const balance = await provider.getBalance(wallet.address);
    console.log("   Balance:", ethers.formatEther(balance), "ETH\n");

    // Check balance (reduced requirement for actual deployment cost)
    if (balance < ethers.parseEther("0.00001")) {
        console.log("⚠️  WARNING: Extremely low balance!");
        process.exit(1);
    }

    // Load compiled contract
    const contractPath = "./artifacts/contracts/OpenQuest.sol/OpenQuest.json";
    const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf-8"));

    console.log("🚀 Deploying OpenQuest contract...\n");

    // Create contract factory and deploy
    const factory = new ethers.ContractFactory(
        contractJson.abi,
        contractJson.bytecode,
        wallet
    );

    const contract = await factory.deploy();
    console.log("⏳ Waiting for deployment...");

    await contract.waitForDeployment();
    const address = await contract.getAddress();

    console.log("\n════════════════════════════════════════");
    console.log("✅ OpenQuest deployed successfully!");
    console.log("════════════════════════════════════════\n");
    console.log("📍 Contract Address:", address);
    console.log("\n📝 Add to .env:");
    console.log(`OPENQUEST_CONTRACT_ADDRESS=${address}`);
    console.log("\n🔍 View on BaseScan:");
    console.log(`https://basescan.org/address/${address}\n`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Deployment failed:");
        console.error(error);
        process.exit(1);
    });
