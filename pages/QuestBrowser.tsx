import React from 'react';
import { Link } from 'react-router-dom';

const QuestBrowser: React.FC = () => {
    // This will eventually connect to smart contract
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
        {
            id: 'q2',
            title: 'Mint a Base NFT',
            description: 'Mint an NFT from any collection on the Base network',
            difficulty: 'MEDIUM',
            category: 'NFT',
            reward: '75 QUEST',
            participants: 89
        },
        {
            id: 'q3',
            title: 'Provide Liquidity on Aerodrome',
            description: 'Add liquidity to any pool on Aerodrome Finance',
            difficulty: 'HARD',
            category: 'DEFI',
            reward: '150 QUEST',
            participants: 34
        }
    ];

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'EASY': return 'text-emerald-400 bg-emerald-400/10';
            case 'MEDIUM': return 'text-yellow-400 bg-yellow-400/10';
            case 'HARD': return 'text-red-400 bg-red-400/10';
            default: return 'text-slate-400 bg-slate-400/10';
        }
    };

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-12 animate-fadeIn">
                    <Link to="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block transition-all duration-300">
                        ← Back to Home
                    </Link>
                    <h1 className="text-5xl font-bold mb-4 animate-fadeInUp gradient-text">Active Quests</h1>
                    <p className="text-xl text-slate-400 animate-fadeInUp stagger-2">
                        Choose a quest, complete it onchain, and earn rewards
                    </p>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-8 flex-wrap animate-fadeInUp stagger-3">
                    <button className="px-6 py-2 glass rounded-lg hover:bg-white/10 transition-all duration-300 hover-lift">
                        All Quests
                    </button>
                    <button className="px-6 py-2 glass rounded-lg hover:bg-white/10 transition-all duration-300 hover-lift">
                        DeFi
                    </button>
                    <button className="px-6 py-2 glass rounded-lg hover:bg-white/10 transition-all duration-300 hover-lift">
                        NFT
                    </button>
                    <button className="px-6 py-2 glass rounded-lg hover:bg-white/10 transition-all duration-300 hover-lift">
                        Social
                    </button>
                </div>

                {/* Quest Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockQuests.map((quest) => (
                        <div key={quest.id} className="glass p-6 rounded-2xl hover:border-blue-600/50 border border-white/5 transition-all duration-300 group hover-lift card-entrance">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getDifficultyColor(quest.difficulty)}`}>
                                    {quest.difficulty}
                                </span>
                                <span className="text-slate-500 text-sm">{quest.category}</span>
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-all duration-300">
                                {quest.title}
                            </h3>
                            <p className="text-slate-400 text-sm mb-6">
                                {quest.description}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div>
                                    <div className="text-lg font-bold text-blue-400">{quest.reward}</div>
                                    <div className="text-xs text-slate-500">{quest.participants} completed</div>
                                </div>
                                <Link
                                    to="/profile"
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all duration-300 interactive-button"
                                >
                                    Start
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State (for when no quests match filters) */}
                {mockQuests.length === 0 && (
                    <div className="text-center py-24">
                        <div className="text-6xl mb-4">🎯</div>
                        <h3 className="text-2xl font-bold mb-2">No Quests Found</h3>
                        <p className="text-slate-400">Check back soon for new quests!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestBrowser;
