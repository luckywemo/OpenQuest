# Smart Contract Deployment Guide

## 📋 Requirements Checklist

### 1. **Prerequisites**

#### Development Tools
- [ ] Node.js (v16+)
- [ ] Hardhat or Foundry
- [ ] Solidity compiler (v0.8.20)

#### Wallet & Funds
- [ ] Wallet with private key (MetaMask, etc.)
- [ ] ETH on Base for gas fees
  - **Testnet (Sepolia)**: Free from faucet
  - **Mainnet**: ~$20-50 USD worth of ETH

#### API Keys
- [ ] Base RPC URL (from Alchemy, QuickNode, or public)
- [ ] BaseScan API key (for verification)

---

## 🔧 Step-by-Step Deployment

### **Step 1: Install Dependencies**

```bash
# Navigate to project
cd c:\Users\H\Desktop\app\BaseQuest

# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Install OpenZeppelin (required for contract)
npm install @openzeppelin/contracts

# Initialize Hardhat
npx hardhat init
# Select: "Create a TypeScript project"
```

### **Step 2: Configure Hardhat**

Create/update `hardhat.config.ts`:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Base Sepolia Testnet
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 84532,
    },
    // Base Mainnet
    base: {
      url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 8453,
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BASESCAN_API_KEY || "",
      base: process.env.BASESCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org"
        }
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      }
    ]
  }
};

export default config;
```

### **Step 3: Update .env File**

Add to your `.env`:

```bash
# Deployer wallet private key (NEVER commit this!)
DEPLOYER_PRIVATE_KEY=your_private_key_here

# Base Sepolia RPC (Testnet)
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
# OR use Alchemy: https://base-sepolia.g.alchemy.com/v2/YOUR_KEY

# Base Mainnet RPC
BASE_RPC_URL=https://mainnet.base.org
# OR use Alchemy: https://base-mainnet.g.alchemy.com/v2/YOUR_KEY

# BaseScan API Key (for contract verification)
BASESCAN_API_KEY=your_basescan_key

# Deployed contract address (fill in after deployment)
BASEQUEST_CONTRACT_ADDRESS=
```

### **Step 4: Get Private Key**

**From MetaMask:**
1. Open MetaMask
2. Click three dots → Account details
3. Click "Export Private Key"
4. Enter password
5. Copy private key → Add to `.env`

⚠️ **SECURITY WARNING**: Never commit `.env` or share your private key!

### **Step 5: Get Test ETH (for Sepolia)**

**Base Sepolia Faucet:**
```
https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
```

Or bridge from Ethereum Sepolia:
```
https://bridge.base.org/deposit
```

### **Step 6: Create Deployment Script**

Create `scripts/deploy.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying BaseQuest contract...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy the contract
  const BaseQuest = await ethers.getContractFactory("BaseQuest");
  const baseQuest = await BaseQuest.deploy();
  
  await baseQuest.waitForDeployment();
  const address = await baseQuest.getAddress();

  console.log("✅ BaseQuest deployed to:", address);
  console.log("");
  console.log("📝 Save this address to your .env file:");
  console.log(`BASEQUEST_CONTRACT_ADDRESS=${address}`);
  console.log("");
  console.log("🔍 Verify contract:");
  console.log(`npx hardhat verify --network baseSepolia ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### **Step 7: Move Contract File**

Move contract to Hardhat structure:

```bash
# Create contracts directory if needed
mkdir contracts

# Copy BaseQuest.sol
copy contracts\BaseQuest.sol contracts\BaseQuest.sol
```

### **Step 8: Deploy to Testnet**

```bash
# Compile contract
npx hardhat compile

# Deploy to Base Sepolia
npx hardhat run scripts/deploy.ts --network baseSepolia
```

**Expected output:**
```
🚀 Deploying BaseQuest contract...
Deploying with account: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Account balance: 1000000000000000000
✅ BaseQuest deployed to: 0xABCDEF1234567890...

📝 Save this address to your .env file:
BASEQUEST_CONTRACT_ADDRESS=0xABCDEF1234567890...
```

### **Step 9: Verify Contract**

```bash
# Verify on BaseScan
npx hardhat verify --network baseSepolia 0xYourContractAddress
```

### **Step 10: Test Contract**

Create `scripts/test-contract.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
  const contractAddress = process.env.BASEQUEST_CONTRACT_ADDRESS!;
  
  const BaseQuest = await ethers.getContractFactory("BaseQuest");
  const contract = BaseQuest.attach(contractAddress);

  console.log("📝 Creating test quest...");
  
  const tx = await contract.createQuest(
    "Swap on Uniswap Base",
    "Complete your first swap",
    "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24", // Uniswap router
    86400, // 24 hours
    "0x0000000000000000000000000000000000000000", // No reward token (soulbound)
    0, // No ERC20 reward
    false // Soulbound badge
  );

  await tx.wait();
  console.log("✅ Quest created!");
}

main();
```

---

## 💰 Gas Cost Estimates

| Network | Deployment Cost | Create Quest | Claim Reward |
|---------|----------------|--------------|--------------|
| **Base Sepolia** | ~$0 (free) | ~$0 | ~$0 |
| **Base Mainnet** | ~$5-10 | ~$0.10 | ~$0.05 |

---

## 🔐 Security Checklist

- [ ] `.env` added to `.gitignore`
- [ ] Private key never committed
- [ ] Test on Sepolia first
- [ ] Contract verified on BaseScan
- [ ] Ownership transferred (if needed)
- [ ] Agent authorized in contract

---

## 🚀 Quick Start Commands

```bash
# 1. Install tools
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts

# 2. Initialize Hardhat
npx hardhat init

# 3. Configure .env (add private key, RPC URLs)

# 4. Get test ETH from faucet

# 5. Deploy to testnet
npx hardhat compile
npx hardhat run scripts/deploy.ts --network baseSepolia

# 6. Verify contract
npx hardhat verify --network baseSepolia 0xYourAddress

# 7. Deploy to mainnet (when ready)
npx hardhat run scripts/deploy.ts --network base
```

---

## 📚 Resources

- **Base Docs**: https://docs.base.org
- **Base Sepolia Faucet**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- **BaseScan**: https://basescan.org
- **Hardhat Docs**: https://hardhat.org/docs
- **OpenZeppelin**: https://docs.openzeppelin.com

---

## 🆘 Troubleshooting

### "Insufficient funds"
- Get more ETH from faucet (testnet) or bridge (mainnet)

### "Nonce too high"
- Reset MetaMask: Settings → Advanced → Reset Account

### "Contract verification failed"
- Make sure optimizer settings match
- Check constructor arguments

### "Transaction failed"
- Increase gas limit in hardhat.config.ts
- Check RPC URL is correct

---

## ✅ What You Need Right Now

1. **Get a private key** (from MetaMask)
2. **Get test ETH** (from faucet)
3. **Add to .env**:
   ```
   DEPLOYER_PRIVATE_KEY=0x...
   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   ```
4. **Run deployment commands** (listed above)

Would you like me to help you deploy now?
