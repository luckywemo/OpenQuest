import React from 'react';
import { Link } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { useProfile } from "@farcaster/auth-kit";

const ProfilePage: React.FC = () => {
    const { address, isConnected } = useAccount();
    const { isAuthenticated, profile } = useProfile();
    const { disconnect } = useDisconnect();

    if ((!isConnected || !address) && !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-6">🔐</div>
                    <h1 className="text-4xl font-bold mb-4">Login Required</h1>
                    <p className="text-slate-400 mb-8">
                        Connect your wallet or social account to view your profile
                    </p>

                    <Link
                        to="/"
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-600/50 inline-block"
                    >
                        Go to Home to Login
                    </Link>

                    <div className="mt-8">
                        <Link to="/" className="text-blue-400 hover:text-blue-300">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Authenticated view (Real data from Farcaster and Wagmi)
    const user = {
        username: profile?.displayName || profile?.username || 'User',
        fid: profile?.fid || 'N/A',
        pfp: profile?.pfpUrl || 'https://i.pravatar.cc/150?img=3',
        wallet: address || 'N/A'
    };

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
                            className="w-24 h-24 rounded-2xl border-2 border-blue-500/20"
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">Connected Profile</h1>
                            <p className="text-slate-400 text-sm mb-4">Social integration active via OnchainKit</p>
                            <div className="flex gap-2 items-center flex-wrap">
                                <span className="text-xs text-slate-500 uppercase font-mono tracking-wider text-[10px]">Your Wallet:</span>
                                <code className="text-xs bg-slate-800/50 px-3 py-1 rounded-lg border border-white/5 text-blue-300 font-mono">
                                    {user.wallet}
                                </code>
                            </div>
                        </div>

                        <button
                            onClick={() => disconnect()}
                            className="px-6 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 rounded-lg font-semibold transition text-sm"
                        >
                            Log Out
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass p-6 rounded-2xl border border-white/5">
                        <div className="text-3xl font-bold text-blue-400 mb-2">{stats.totalQuests}</div>
                        <div className="text-slate-400 text-sm uppercase tracking-wider font-mono text-[10px]">Quests Completed</div>
                    </div>
                    <div className="glass p-6 rounded-2xl border border-white/5">
                        <div className="text-3xl font-bold text-emerald-400 mb-2">{stats.totalRewards}</div>
                        <div className="text-slate-400 text-sm uppercase tracking-wider font-mono text-[10px]">QUEST Earned</div>
                    </div>
                    <div className="glass p-6 rounded-2xl border border-white/5">
                        <div className="text-3xl font-bold text-purple-400 mb-2">#{stats.rank}</div>
                        <div className="text-slate-400 text-sm uppercase tracking-wider font-mono text-[10px]">Global Rank</div>
                    </div>
                </div>

                {/* Completed Quests */}
                <div className="glass p-8 rounded-3xl border border-white/5">
                    <h2 className="text-2xl font-bold mb-6">Activity Log</h2>

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
                                    className="flex items-center justify-between p-5 bg-white/5 rounded-2xl hover:bg-white/10 transition border border-white/5 group"
                                >
                                    <div>
                                        <h3 className="font-semibold mb-1 group-hover:text-blue-400 transition">{quest.title}</h3>
                                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{quest.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-emerald-400 text-lg">+{quest.reward}</div>
                                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Claimed</div>
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
