import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swap, SwapAmountInput, SwapToggleButton, SwapButton, SwapMessage } from '@coinbase/onchainkit/swap';
import { useAccount } from 'wagmi';
import { useNeynarContext } from "@neynar/react";
import Header from '../components/Header';

const QuestBrowser: React.FC = () => {
    const { isConnected } = useAccount();
    const { user: neynarUser } = useNeynarContext();
    const isUserAuthenticated = isConnected || !!neynarUser;
    const [selectedQuest, setSelectedQuest] = useState<any>(null);

    // Fee Configuration for Monetization
    const feeRecipient = process.env.VITE_FEE_RECIPIENT_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
    const feeAmount = '1'; // 1%

    const mockQuests = [
        {
            id: 'q1',
            title: 'Swap on Uniswap Base',
            description: 'Perform your first swap on Uniswap V3 on Base chain',
            difficulty: 'EASY',
            category: 'DEFI',
            reward: '50 QUEST',
            participants: 142
        },
        // ... rest of quests
    ];

    // ... difficulty color function

    return (
        <div className="min-h-screen py-6">
            <div className="max-w-7xl mx-auto px-4">
                <Header onOpenSubmit={() => { }} />

                <div className="mt-12">
                    <h2 className="text-4xl font-bold mb-2">Quest Browser</h2>
                    <p className="text-slate-400 mb-8">Discover and complete onchain tasks to earn rewards</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Quest Cards with "Start" opening the swap widget */}
                </div>

                {/* Swap Modal/Widget for Monetization */}
                {isUserAuthenticated && (
                    <div className="mt-16 glass p-8 rounded-3xl border border-blue-500/20 max-w-xl mx-auto animate-fadeInUp">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">Quick Swap & Earn</h2>
                                <p className="text-slate-400 text-sm">Swap tokens to complete quests (1% protocol fee applies)</p>
                            </div>
                            <div className="bg-blue-600/20 px-3 py-1 rounded-full text-blue-400 text-[10px] font-bold tracking-widest uppercase">
                                Monetized Agent
                            </div>
                        </div>

                        <Swap className="w-full">
                            <SwapAmountInput
                                label="Sell"
                                swappableTokens={[]} // Default tokens
                                type="from"
                            />
                            <SwapToggleButton />
                            <SwapAmountInput
                                label="Buy"
                                swappableTokens={[]}
                                type="to"
                            />
                            <SwapButton className="!bg-blue-600 hover:!bg-blue-500 !text-white !font-bold !py-3 !rounded-xl !mt-4" />
                            <SwapMessage />
                        </Swap>

                        <div className="mt-4 text-[10px] text-slate-500 text-center font-mono">
                            FEES COLLECTED SUPPORT AGENT AUTONOMY & INFRASTRUCTURE
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestBrowser;
