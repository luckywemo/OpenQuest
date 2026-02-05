export enum QuestStatus {
  ACTIVE = 'ACTIVE',
  VERIFYING = 'VERIFYING',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED'
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  protocol: string;
  protocolUrl?: string;
  actionRequired: string;
  targetContract: string;
  rewardType: 'SOULBOUND' | 'ERC20';
  rewardAmount?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: 'DEFI' | 'NFT' | 'SOCIAL' | 'GOVERNANCE';
  startTime: number;
  endTime: number;
  status: QuestStatus;
  verificationLogic: string;
  completedCount: number;
}

export interface ActivityLog {
  id: string;
  timestamp: number;
  type: 'INFO' | 'TRANSACTION' | 'VERIFICATION' | 'ALERT';
  message: string;
  txHash?: string;
}

export interface AgentStats {
  questsDeployed: number;
  totalParticipants: number;
  rewardsDistributed: number;
  walletBalance: string;
  dailyBudgetUsed: string;
}

export interface Participant {
  address: string;
  status: 'COMPLETED' | 'PENDING';
  txHash?: string;
}

export interface ProjectSubmission {
  name: string;
  website: string;
  contract: string;
  questAction: string;
  rewardBudget: string;
}
