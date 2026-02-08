export const OPENQUEST_ADDRESS = "0x6c8DB116C32b60F86b483A495565f431EA25068A";

export const OPENQUEST_ABI = [
    "function quests(uint256) view returns (uint256 id, string title, string description, string protocol, address targetContract, uint8 difficulty, uint8 category, uint8 rewardType, uint256 rewardAmount, address rewardToken, uint256 startTime, uint256 endTime, bool active, uint256 completionCount, uint256 maxCompletions)",
    "function completions(uint256, address) view returns (address user, uint256 questId, uint256 timestamp, bytes32 proofHash, bool verified, bool rewardClaimed, uint256 rewardTokenId)",
    "function userStats(address) view returns (uint256 totalCompleted, uint256 totalRewardsClaimed, uint256 currentStreak, uint256 lastCompletionTime)",
    "function recordCompletion(uint256 questId, address user, bytes32 proofHash) external",
    "function claimReward(uint256 questId) external",
    "function createQuest(string title, string description, string protocol, address targetContract, uint8 difficulty, uint8 category, uint8 rewardType, uint256 rewardAmount, address rewardToken, uint256 duration, uint256 maxCompletions) external returns (uint256)",
    "function getLeaderboard(uint256 limit) view returns (address[] topUsers, uint256[] completionCounts)",
    "function getUserStats(address user) view returns (tuple(uint256 totalCompleted, uint256 totalRewardsClaimed, uint256 currentStreak, uint256 lastCompletionTime, uint256[] badgeTokenIds))",
    "function getContractStats() view returns (uint256 totalQuests, uint256 totalParticipants, uint256 totalCompletions, uint256 totalBadgesMinted)",
    "event QuestCompleted(uint256 indexed questId, address indexed user, bytes32 proofHash, uint256 timestamp)",
    "event RewardClaimed(uint256 indexed questId, address indexed user, uint8 rewardType, uint256 amount)"
];
