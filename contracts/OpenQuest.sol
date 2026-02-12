// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title OpenQuest
 * @notice Unified contract for autonomous onchain quest management
 * @dev Handles quest creation, tracking, verification, and reward distribution
 */
contract OpenQuest is ERC721, Ownable, ReentrancyGuard {
    
    // ============================================
    // STATE VARIABLES
    // ============================================
    
    uint256 private _nextQuestId = 1;
    uint256 private _nextTokenId = 1;
    
    enum QuestDifficulty { EASY, MEDIUM, HARD }
    enum QuestCategory { DEFI, NFT, SOCIAL, GOVERNANCE }
    enum RewardType { SOULBOUND_NFT, ERC20_TOKEN, NATIVE_ETH }
    
    struct Quest {
        uint256 id;
        string title;
        string description;
        string protocol;
        address targetContract;
        QuestDifficulty difficulty;
        QuestCategory category;
        RewardType rewardType;
        uint256 rewardAmount;
        address rewardToken; // For ERC20 rewards
        uint256 startTime;
        uint256 endTime;
        bool active;
        uint256 completionCount;
        uint256 maxCompletions; // 0 = unlimited
    }
    
    struct Completion {
        address user;
        uint256 questId;
        uint256 timestamp;
        bytes32 proofHash; // Transaction hash proving completion
        bool verified;
        bool rewardClaimed;
        uint256 rewardTokenId; // For NFT rewards
    }
    
    struct UserStats {
        uint256 totalCompleted;
        uint256 totalRewardsClaimed;
        uint256 currentStreak;
        uint256 lastCompletionTime;
        uint256[] badgeTokenIds;
    }
    
    // ============================================
    // MAPPINGS
    // ============================================
    
    mapping(uint256 => Quest) public quests;
    mapping(uint256 => mapping(address => Completion)) public completions;
    mapping(address => UserStats) public userStats;
    mapping(uint256 => string) public tokenURIs; // NFT metadata
    mapping(address => bool) public agents; // Authorized agents
    
    // Leaderboard tracking
    address[] public participants;
    mapping(address => bool) private hasParticipated;
    
    // ============================================
    // EVENTS
    // ============================================
    
    event QuestCreated(
        uint256 indexed questId,
        string title,
        QuestDifficulty difficulty,
        QuestCategory category
    );
    
    event QuestCompleted(
        uint256 indexed questId,
        address indexed user,
        bytes32 proofHash,
        uint256 timestamp
    );
    
    event RewardClaimed(
        uint256 indexed questId,
        address indexed user,
        RewardType rewardType,
        uint256 amount
    );
    
    event AgentAuthorized(address indexed agent, bool authorized);
    
    // ============================================
    // MODIFIERS
    // ============================================
    
    modifier onlyAgent() {
        require(agents[msg.sender] || msg.sender == owner(), "Not authorized agent");
        _;
    }
    
    modifier questActive(uint256 questId) {
        require(quests[questId].active, "Quest not active");
        require(block.timestamp >= quests[questId].startTime, "Quest not started");
        require(block.timestamp <= quests[questId].endTime, "Quest expired");
        _;
    }
    
    // ============================================
    // CONSTRUCTOR
    // ============================================
    
    constructor() ERC721("OpenQuest Badge", "OQBADGE") Ownable(msg.sender) {
        agents[msg.sender] = true; // Owner is default agent
    }
    
    // ============================================
    // QUEST MANAGEMENT
    // ============================================
    
    /**
     * @notice Create a new quest (agent/owner only)
     */
    function createQuest(
        string memory title,
        string memory description,
        string memory protocol,
        address targetContract,
        QuestDifficulty difficulty,
        QuestCategory category,
        RewardType rewardType,
        uint256 rewardAmount,
        address rewardToken,
        uint256 duration,
        uint256 maxCompletions
    ) external onlyAgent returns (uint256) {
        uint256 questId = _nextQuestId++;
        
        quests[questId] = Quest({
            id: questId,
            title: title,
            description: description,
            protocol: protocol,
            targetContract: targetContract,
            difficulty: difficulty,
            category: category,
            rewardType: rewardType,
            rewardAmount: rewardAmount,
            rewardToken: rewardToken,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            active: true,
            completionCount: 0,
            maxCompletions: maxCompletions
        });
        
        emit QuestCreated(questId, title, difficulty, category);
        return questId;
    }
    
    /**
     * @notice Deactivate a quest early
     */
    function deactivateQuest(uint256 questId) external onlyAgent {
        quests[questId].active = false;
    }
    
    // ============================================
    // QUEST COMPLETION & VERIFICATION
    // ============================================
    
    /**
     * @notice Record a quest completion (verified by agent)
     */
    function recordCompletion(
        uint256 questId,
        address user,
        bytes32 proofHash
    ) external onlyAgent questActive(questId) {
        require(completions[questId][user].timestamp == 0, "Already completed");
        
        Quest storage quest = quests[questId];
        require(
            quest.maxCompletions == 0 || quest.completionCount < quest.maxCompletions,
            "Quest completed max times"
        );
        
        completions[questId][user] = Completion({
            user: user,
            questId: questId,
            timestamp: block.timestamp,
            proofHash: proofHash,
            verified: true,
            rewardClaimed: false,
            rewardTokenId: 0
        });
        
        quest.completionCount++;
        
        // Track participant for leaderboard
        if (!hasParticipated[user]) {
            participants.push(user);
            hasParticipated[user] = true;
        }
        
        // Update user stats
        UserStats storage stats = userStats[user];
        stats.totalCompleted++;
        
        // Calculate streak
        if (block.timestamp - stats.lastCompletionTime <= 1 days) {
            stats.currentStreak++;
        } else {
            stats.currentStreak = 1;
        }
        stats.lastCompletionTime = block.timestamp;
        
        emit QuestCompleted(questId, user, proofHash, block.timestamp);
    }
    
    /**
     * @notice Batch record multiple completions (gas efficient)
     */
    function batchRecordCompletions(
        uint256 questId,
        address[] calldata users,
        bytes32[] calldata proofHashes
    ) external onlyAgent questActive(questId) {
        require(users.length == proofHashes.length, "Array length mismatch");
        
        Quest storage quest = quests[questId];
        
        for (uint256 i = 0; i < users.length; i++) {
            if (completions[questId][users[i]].timestamp == 0) {
                require(
                    quest.maxCompletions == 0 || quest.completionCount < quest.maxCompletions,
                    "Quest completed max times"
                );
                
                completions[questId][users[i]] = Completion({
                    user: users[i],
                    questId: questId,
                    timestamp: block.timestamp,
                    proofHash: proofHashes[i],
                    verified: true,
                    rewardClaimed: false,
                    rewardTokenId: 0
                });
                
                quest.completionCount++;
                
                // Track participant
                if (!hasParticipated[users[i]]) {
                    participants.push(users[i]);
                    hasParticipated[users[i]] = true;
                }
                
                // Update user stats
                UserStats storage stats = userStats[users[i]];
                stats.totalCompleted++;
                
                if (block.timestamp - stats.lastCompletionTime <= 1 days) {
                    stats.currentStreak++;
                } else {
                    stats.currentStreak = 1;
                }
                stats.lastCompletionTime = block.timestamp;
                
                emit QuestCompleted(questId, users[i], proofHashes[i], block.timestamp);
            }
        }
    }
    
    // ============================================
    // REWARD DISTRIBUTION
    // ============================================
    
    /**
     * @notice Claim reward for completed quest
     */
    function claimReward(uint256 questId) external nonReentrant {
        Completion storage completion = completions[questId][msg.sender];
        require(completion.verified, "Not verified");
        require(!completion.rewardClaimed, "Already claimed");
        
        Quest storage quest = quests[questId];
        completion.rewardClaimed = true;
        
        if (quest.rewardType == RewardType.SOULBOUND_NFT) {
            // Mint soulbound NFT
            uint256 tokenId = _nextTokenId++;
            _safeMint(msg.sender, tokenId);
            completion.rewardTokenId = tokenId;
            userStats[msg.sender].badgeTokenIds.push(tokenId);
            
            // Generate metadata URI based on quest
            tokenURIs[tokenId] = string(abi.encodePacked(
                "https://openquest.app/api/badge/",
                Strings.toString(questId),
                "/",
                Strings.toString(uint256(quest.difficulty))
            ));
            
        } else if (quest.rewardType == RewardType.ERC20_TOKEN) {
            // Transfer ERC20 tokens
            require(quest.rewardToken != address(0), "Invalid token");
            IERC20(quest.rewardToken).transfer(msg.sender, quest.rewardAmount);
            
        } else if (quest.rewardType == RewardType.NATIVE_ETH) {
            // Transfer ETH
            (bool success, ) = msg.sender.call{value: quest.rewardAmount}("");
            require(success, "ETH transfer failed");
        }
        
        userStats[msg.sender].totalRewardsClaimed++;
        
        emit RewardClaimed(questId, msg.sender, quest.rewardType, quest.rewardAmount);
    }
    
    /**
     * @notice Override transfer to make NFTs soulbound
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0)) but prevent transfers
        if (from != address(0)) {
            revert("Soulbound: Transfer not allowed");
        }
        
        return super._update(to, tokenId, auth);
    }
    
    // ============================================
    // QUERY FUNCTIONS
    // ============================================
    
    /**
     * @notice Get quest details
     */
    function getQuest(uint256 questId) external view returns (Quest memory) {
        return quests[questId];
    }
    
    /**
     * @notice Get user's completion for a quest
     */
    function getUserCompletion(uint256 questId, address user) 
        external 
        view 
        returns (Completion memory) 
    {
        return completions[questId][user];
    }
    
    /**
     * @notice Get user stats
     */
    function getUserStats(address user) external view returns (UserStats memory) {
        return userStats[user];
    }
    
    /**
     * @notice Get leaderboard (top N users by completions)
     */
    function getLeaderboard(uint256 limit) external view returns (
        address[] memory topUsers,
        uint256[] memory completionCounts
    ) {
        uint256 participantCount = participants.length;
        uint256 resultSize = limit < participantCount ? limit : participantCount;
        
        topUsers = new address[](resultSize);
        completionCounts = new uint256[](resultSize);
        
        // Simple bubble sort for top N (inefficient for large datasets, but works for demo)
        address[] memory sortedUsers = new address[](participantCount);
        uint256[] memory sortedCounts = new uint256[](participantCount);
        
        for (uint256 i = 0; i < participantCount; i++) {
            sortedUsers[i] = participants[i];
            sortedCounts[i] = userStats[participants[i]].totalCompleted;
        }
        
        // Sort descending
        for (uint256 i = 0; i < participantCount; i++) {
            for (uint256 j = i + 1; j < participantCount; j++) {
                if (sortedCounts[i] < sortedCounts[j]) {
                    // Swap counts
                    (sortedCounts[i], sortedCounts[j]) = (sortedCounts[j], sortedCounts[i]);
                    // Swap users
                    (sortedUsers[i], sortedUsers[j]) = (sortedUsers[j], sortedUsers[i]);
                }
            }
        }
        
        for (uint256 i = 0; i < resultSize; i++) {
            topUsers[i] = sortedUsers[i];
            completionCounts[i] = sortedCounts[i];
        }
        
        return (topUsers, completionCounts);
    }
    
    /**
     * @notice Check if user has completed a quest
     */
    function hasCompletedQuest(uint256 questId, address user) 
        external 
        view 
        returns (bool) 
    {
        return completions[questId][user].verified;
    }
    
    /**
     * @notice Get user's badge token IDs
     */
    function getUserBadges(address user) external view returns (uint256[] memory) {
        return userStats[user].badgeTokenIds;
    }
    
    // ============================================
    // ADMIN FUNCTIONS
    // ============================================
    
    /**
     * @notice Authorize/deauthorize an agent
     */
    function setAgent(address agent, bool authorized) external onlyOwner {
        agents[agent] = authorized;
        emit AgentAuthorized(agent, authorized);
    }
    
    /**
     * @notice Fund contract with ETH for rewards
     */
    function fundContract() external payable onlyOwner {}
    
    /**
     * @notice Withdraw excess ETH
     */
    function withdrawETH(uint256 amount) external onlyOwner {
        (bool success, ) = owner().call{value: amount}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @notice Withdraw ERC20 tokens
     */
    function withdrawTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
    
    /**
     * @notice Override tokenURI for NFT metadata
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenURIs[tokenId];
    }
    
    /**
     * @notice Get contract stats
     */
    function getContractStats() external view returns (
        uint256 totalQuests,
        uint256 totalParticipants,
        uint256 totalCompletions,
        uint256 totalBadgesMinted
    ) {
        totalQuests = _nextQuestId - 1;
        totalParticipants = participants.length;
        totalBadgesMinted = _nextTokenId - 1;
        
        // Calculate total completions
        for (uint256 i = 1; i < _nextQuestId; i++) {
            totalCompletions += quests[i].completionCount;
        }
        
        return (totalQuests, totalParticipants, totalCompletions, totalBadgesMinted);
    }
}
