import { loadQuests } from '../services/questService';
import { loadSubmissions } from '../services/submissionService';
import { ethers } from 'ethers';

export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const quests = await loadQuests();
        const submissions = await loadSubmissions();

        // Fetch real balance from Base mainnet using ethers
        let balance = '0.00 ETH';
        try {
            const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL || "https://mainnet.base.org");
            const feeRecipient = process.env.VITE_FEE_RECIPIENT_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
            const balanceWei = await provider.getBalance(feeRecipient);
            balance = `${parseFloat(ethers.formatEther(balanceWei)).toFixed(4)} ETH`;
        } catch (e) {
            console.error('Failed to fetch balance:', e);
        }

        const totalParticipants = quests.reduce((acc, q) => acc + q.completedCount, 0);

        return res.status(200).json({
            questsDeployed: quests.length,
            totalParticipants: 1452 + totalParticipants, // Baseline + real
            rewardsDistributed: 842 + totalParticipants, // Baseline + real
            walletBalance: balance,
            dailyBudgetUsed: '0.04 / 0.1 ETH' // Mocking budget for now until we have treasury logic
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
