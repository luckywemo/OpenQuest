import React from 'react';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    // TODO: Replace with actual Neynar auth
    const isAuthenticated = false;
    const user = {
        username: 'basechad',
        fid: 12345,
        pfp: 'https://i.pravatar.cc/150?img=3',
        wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-6">🔐</div>
                    <h1 className="text-4xl font-bold mb-4">Login Required</h1>
                    <p className="text-slate-400 mb-8">
                        Connect your Farcaster account to start earning rewards
                    </p>

                    {/* TODO: Replace with NeynarAuthButton */}
                    <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold text-lg transition shadow-lg shadow-purple-600/50">
                        🟣 Sign in with Farcaster
                    </button>

                    <div className="mt-8">
                        <Link to="/" className="text-blue-400 hover:text-blue-300">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Authenticated view
    const completedQuests = [
        { id: 1, title: 'Swap on Uniswap Base', reward: '50 QUEST', date: '2026-02-05' },
        { id: 2, title: 'Mint a Base NFT', reward: '75 QUEST', date: '2026-02-04' }
    ];

    const stats = {
        totalQuests: 2,
        totalRewards: 125,
        rank: 142
    };

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-12">
                    <Link to="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
                        ← Back to Home
                    </Link>
                </div>

                {/* Profile Card */}
                <div className="glass p-8 rounded-3xl mb-8">
                    <div className="flex items-start gap-6 flex-wrap">
                        <img
                            src={user.pfp}
                            alt={user.username}
                            className="w-24 h-24 rounded-2xl"
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">@{user.username}</h1>
                            <p className="text-slate-400 text-sm mb-4">FID: {user.fid}</p>
                            <div className="flex gap-2 items-center">
                                <span className="text-xs text-slate-500">Wallet:</span>
                                <code className="text-xs bg-slate-800 px-3 py-1 rounded-lg">
                                    {user.wallet.substring(0, 6)}...{user.wallet.substring(38)}
                                </code>
                            </div>
                        </div>

                        <button className="px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-semibold transition">
                            Disconnect
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass p-6 rounded-2xl">
                        <div className="text-3xl font-bold text-blue-400 mb-2">{stats.totalQuests}</div>
                        <div className="text-slate-400 text-sm uppercase tracking-wider">Quests Completed</div>
                    </div>
                    <div className="glass p-6 rounded-2xl">
                        <div className="text-3xl font-bold text-emerald-400 mb-2">{stats.totalRewards}</div>
                        <div className="text-slate-400 text-sm uppercase tracking-wider">QUEST Earned</div>
                    </div>
                    <div className="glass p-6 rounded-2xl">
                        <div className="text-3xl font-bold text-purple-400 mb-2">#{stats.rank}</div>
                        <div className="text-slate-400 text-sm uppercase tracking-wider">Global Rank</div>
                    </div>
                </div>

                {/* Completed Quests */}
                <div className="glass p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold mb-6">Completed Quests</h2>

                    {completedQuests.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">🎯</div>
                            <p className="text-slate-400">No quests completed yet</p>
                            <Link
                                to="/quests"
                                className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                            >
                                Browse Quests
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {completedQuests.map((quest) => (
                                <div
                                    key={quest.id}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                                >
                                    <div>
                                        <h3 className="font-semibold mb-1">{quest.title}</h3>
                                        <p className="text-xs text-slate-500">{quest.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-emerald-400">+{quest.reward}</div>
                                        <div className="text-xs text-slate-500">Claimed</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
