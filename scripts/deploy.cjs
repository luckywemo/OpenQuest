const hre = require("hardhat");

async function main() {
    console.log("");
    console.log("╔══════════════════════════════════════╗");
    console.log("║  Deploying OpenQuest                 ║");
    console.log("╚══════════════════════════════════════╝");
    console.log("");

    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    const balance = await hre.ethers.provider.getBalance(deployer.address);

    console.log("📝 Deployment Details:");
    console.log("   Deployer:", deployer.address);
    console.log("   Balance:", hre.ethers.formatEther(balance), "ETH");
    console.log("");

    // Check if we have enough balance
    if (balance < hre.ethers.parseEther("0.001")) {
        console.log("⚠️  WARNING: Low balance! You might need more ETH for deployment.");
        console.log("   Recommended: At least 0.001 ETH");
        console.log("");
    }

    console.log("🚀 Deploying OpenQuest contract...");
    console.log("");

    // Deploy the contract
    const OpenQuest = await hre.ethers.getContractFactory("OpenQuest");
    const openQuest = await OpenQuest.deploy();

    console.log("⏳ Waiting for deployment...");
    await openQuest.waitForDeployment();

    const address = await openQuest.getAddress();

    console.log("");
    console.log("════════════════════════════════════════");
    console.log("✅ OpenQuest deployed successfully!");
    console.log("════════════════════════════════════════");
    console.log("");
    console.log("📍 Contract Address:", address);
    console.log("");
    console.log("📝 Next Steps:");
    console.log("   1. Add to .env:");
    console.log(`      OPENQUEST_CONTRACT_ADDRESS=${address}`);
    console.log("");
    console.log("   2. Verify contract (wait 30 seconds, then run):");
    console.log(`      npx hardhat verify --network base ${address}`);
    console.log("");
    console.log("   3. View on BaseScan:");
    console.log(`      https://basescan.org/address/${address}`);
    console.log("");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("");
        console.error("❌ Deployment failed:");
        console.error(error);
        console.error("");
        process.exit(1);
    });
