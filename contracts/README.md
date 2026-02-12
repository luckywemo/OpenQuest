# OpenQuest Smart Contract

## Overview

**OpenQuest.sol** is a unified smart contract that handles all quest functionality:
- ✅ Quest creation and management
- ✅ Completion tracking and verification
- ✅ Reward distribution (Soulbound NFTs, ERC20, ETH)
- ✅ Leaderboard and user stats
- ✅ Agent authorization system

## Architecture

### Single Contract Benefits
- **Gas Efficient**: No inter-contract calls
- **Simple Deployment**: One transaction to deploy everything
- **Easy Upgrades**: Single contract to manage
- **Unified State**: All data in one place

### Key Features

#### 1. Quest Management
```solidity
function createQuest(
    string memory title,
    string memory description,
    string memory protocol,
    address targetContract,
    QuestDifficulty difficulty,    // EASY, MEDIUM, HARD
    QuestCategory category,        // DEFI, NFT, SOCIAL, GOVERNANCE
    RewardType rewardType,         // SOULBOUND_NFT, ERC20_TOKEN, NATIVE_ETH
    uint256 rewardAmount,
    address rewardToken,
    uint256 duration,
    uint256 maxCompletions
) external onlyAgent returns (uint256)
```

#### 2. Completion Tracking
```solidity
function recordCompletion(
    uint256 questId,
    address user,
    bytes32 proofHash  // Transaction hash proving completion
) external onlyAgent
```

#### 3. Reward Distribution
```solidity
function claimReward(uint256 questId) external
```

Supports three reward types:
- **Soulbound NFT**: Non-transferable achievement badges
- **ERC20 Tokens**: Quest points or protocol tokens
- **Native ETH**: Direct ETH rewards

#### 4. Leaderboard
```solidity
function getLeaderboard(uint256 limit) external view returns (
    address[] memory topUsers,
    uint256[] memory completionCounts
)
```

## Deployment

### Prerequisites
```bash
npm install --save-dev hardhat @openzeppelin/contracts
```

### Deploy Script

```javascript
// scripts/deploy.js
async function main() {
    const OpenQuest = await ethers.getContractFactory("OpenQuest");
    const openQuest = await OpenQuest.deploy();
    await openQuest.waitForDeployment();
    
    console.log("OpenQuest deployed to:", await openQuest.getAddress());
    
    // Fund contract with initial ETH for rewards
    await openQuest.fundContract({ value: ethers.parseEther("1.0") });
}

main();
```

### Deploy to Base Sepolia (Testnet)
```bash
npx hardhat run scripts/deploy.js --network base-sepolia
```

### Deploy to Base Mainnet
```bash
npx hardhat run scripts/deploy.js --network base
```

## Usage Examples

### Creating a Quest (Agent)

```javascript
const tx = await openQuest.createQuest(
    "Swap on Uniswap Base",                    // title
    "Complete your first swap on Uniswap",     // description
    "Uniswap",                                  // protocol
    "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24", // targetContract
    0, // QuestDifficulty.EASY
    0, // QuestCategory.DEFI
    0, // RewardType.SOULBOUND_NFT
    0,                                          // rewardAmount (0 for NFT)
    ethers.ZeroAddress,                         // rewardToken
    86400,                                      // duration: 24 hours
    1000                                        // maxCompletions
);
```

### Recording Completion (Agent monitors blockchain)

```javascript
// Agent detects user swap on Uniswap
const userAddress = "0x...";
const txHash = "0x...";

await openQuest.recordCompletion(
    questId,
    userAddress,
    txHash  // Proof of completion
);
```

### Claiming Reward (User)

```javascript
// User claims their soulbound badge
await openQuest.claimReward(questId);
```

### Querying User Stats

```javascript
const stats = await openQuest.getUserStats(userAddress);
console.log("Total Completed:", stats.totalCompleted);
console.log("Current Streak:", stats.currentStreak);
console.log("Badges:", stats.badgeTokenIds);
```

## Agent Authorization

The contract uses an agent authorization system:

```javascript
// Owner authorizes AI agent wallet
await openQuest.setAgent(agentAddress, true);

// Agent can now create quests and record completions
```

**Security Model:**
- Owner/deployer is default agent
- Additional agents can be authorized/revoked
- Only agents can create quests and record completions
- Users can only claim rewards for verified completions

## Gas Estimates

| Function | Estimated Gas |
|----------|--------------|
| `createQuest` | ~200,000 |
| `recordCompletion` | ~150,000 |
| `claimReward` (NFT) | ~180,000 |
| `claimReward` (ERC20) | ~80,000 |
| `batchRecordCompletions` (10 users) | ~800,000 |

## Contract Addresses

### Base Sepolia (Testnet)
```
OpenQuest: 0x... (deploy to get address)
```

### Base Mainnet
```
OpenQuest: 0x... (deploy when ready)
```

## Security Features

✅ **ReentrancyGuard**: Prevents reentrancy attacks on reward claims  
✅ **Ownable**: Owner-only admin functions  
✅ **Agent System**: Separate role for quest management  
✅ **Soulbound NFTs**: Non-transferable badges (can't be sold)  
✅ **Verification Required**: Users can't self-report completions  

## Frontend Integration

```typescript
// Example: Connect to contract from frontend
import { ethers } from 'ethers';
import OpenQuestABI from './contracts/OpenQuest.json';

const provider = new ethers.BrowserProvider(window.ethereum);
const contract = new ethers.Contract(
    contractAddress,
    OpenQuestABI,
    provider
);

// Get active quest
const quest = await contract.getQuest(1);

// Check if user completed quest
const hasCompleted = await contract.hasCompletedQuest(1, userAddress);

// Claim reward
const signer = await provider.getSigner();
const contractWithSigner = contract.connect(signer);
await contractWithSigner.claimReward(questId);
```

## Future Enhancements

- [ ] Add quest templates for common DeFi actions
- [ ] Implement quest dependencies (complete Quest A to unlock Quest B)
- [ ] Add quest expiration with grace period
- [ ] Support multi-signature quest verification
- [ ] Add quest tagging and search functionality
- [ ] Implement dynamic difficulty adjustment
- [ ] Add referral system for quest sharing

## License

MIT
