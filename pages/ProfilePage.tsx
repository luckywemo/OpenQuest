import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { useProfile, useSignIn } from "@farcaster/auth-kit";
import { Target, Award, Shield, LogOut, ChevronLeft, UserCircle, Users, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import { Icons } from '../constants';
import { Identity, Avatar, Name, Address, EthBalance } from '@coinbase/onchainkit/identity';
import { AgentStats } from '../types';

const ProfilePage: React.FC = () => {
    const { isAuthenticated, profile } = useProfile();
    const { signOut } = useSignIn({});
    const [stats, setStats] = useState<AgentStats | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetch('/api/stats')
                .then(res => res.json())
                .then(data => setStats(data))
                .catch(err => console.error('Failed to fetch profile stats:', err));
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-7xl mx-auto">
                <Header onOpenSubmit={() => { }} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="glass p-8 md:p-12 rounded-[2.5rem] text-center max-w-md border-blue-500/10 animate-scaleIn">
                        <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                            <Icons.Logo className="w-12 h-12 object-contain" />
                        </div>
                        <h2 className="text-3xl font-black mb-4 tracking-tighter">IDENTITY REQUIRED</h2>
                        <p className="text-slate-400 mb-8 text-sm leading-relaxed">Sign in with Farcaster or connect your wallet to access your operative profile and mission records.</p>
                        <Link
                            to="/"
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] uppercase tracking-widest block"
                        >
                            RETURN TO BASE
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Authenticated view - using profile data or address
    const user = {
        username: profile?.displayName || profile?.username || 'Operative',
        fid: profile?.fid || 'N/A',
        pfp: profile?.pfpUrl || '',
        bio: (profile as any)?.bio || 'Active onchain operative. Profile data synchronized via unified authentication protocol.',
        wallet: profile?.custody || 'N/A',
        followers: (profile as any)?.followerCount || 0,
        following: (profile as any)?.followingCount || 0
    };

    const profileStats = [
        { label: 'Completed', value: stats?.questsDeployed || '0', icon: Target, color: 'text-emerald-400' },
        { label: 'Rewards', value: stats?.rewardsDistributed || '0', icon: Award, color: 'text-blue-400' },
        { label: 'Participants', value: stats?.totalParticipants || '0', icon: Users, color: 'text-purple-400' },
    ];

    return (
        <div className="min-h-screen py-4 md:py-8">
            <div className="max-w-7xl mx-auto px-4 space-y-8">
                <Header onOpenSubmit={() => { }} />

                {/* Back Link */}
                <div className="animate-fadeIn">
                    <Link to="/quests" className="text-slate-500 hover:text-white mb-2 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors">
                        <ChevronLeft size={14} /> BACK TO MISSIONS
                    </Link>
                </div>

                {/* Profile Card / Social Hub */}
                <div className="glass p-6 md:p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden animate-fadeInUp shadow-2xl">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                        {/* Avatar / PFP Section */}
                        <div className="relative group">
                            {user.pfp ? (
                                <img
                                    src={user.pfp}
                                    alt={user.username}
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] border-4 border-blue-600/20 shadow-2xl transition-transform group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-blue-600/10 flex items-center justify-center border-4 border-blue-600/20 shadow-2xl">
                                    <UserCircle size={48} className="text-blue-500" />
                                </div>
                            )}
                            {user.fid !== 'N/A' && (
                                <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-1 rounded-lg shadow-lg">
                                    <Icons.Logo className="w-5 h-5 object-contain" />
                                </div>
                            )}
                        </div>

                        {/* Profile Info Section */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
                                    {user.username}
                                </h1>
                                {user.fid !== 'N/A' && (
                                    <span className="px-3 py-1 bg-blue-600/10 rounded-full border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                                        FID: {user.fid}
                                    </span>
                                )}
                            </div>

                            <p className="text-slate-300 text-sm md:text-lg mb-6 max-w-xl font-medium line-clamp-2 md:line-clamp-none">
                                {user.bio}
                            </p>

                            {/* Social Stats */}
                            <div className="flex items-center justify-center md:justify-start gap-6 mb-8">
                                <div className="flex flex-col">
                                    <span className="text-xl font-black text-white">{user.followers.toLocaleString()}</span>
                                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-1">
                                        <Users size={12} className="text-slate-500" /> Followers
                                    </span>
                                </div>
                                <div className="w-[1px] h-8 bg-white/10" />
                                <div className="flex flex-col">
                                    <span className="text-xl font-black text-white">{user.following.toLocaleString()}</span>
                                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-1">
                                        <Users size={12} className="text-slate-500" /> Following
                                    </span>
                                </div>
                            </div>

                            {/* ID Details Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Main Node Address</p>
                                    <div className="flex items-center justify-center md:justify-start">
                                        <code className="text-[11px] md:text-xs bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-blue-300 font-mono break-all max-w-full">
                                            {user.wallet}
                                        </code>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <button
                                onClick={() => {
                                    signOut();
                                }}
                                className="px-6 py-4 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
                            >
                                <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" /> TERMINATE SESSION
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fadeInUp delay-100">
                    {profileStats.map((stat, idx) => (
                        <div key={idx} className="glass p-8 rounded-[2.5rem] border border-white/5 hover-lift transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <stat.icon size={24} className={`${stat.color} group-hover:scale-110 transition-transform`} />
                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
                            </div>
                            <div className="text-4xl font-black text-white">{stat.value}</div>
                            <div className="h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                                <div className={`h-full opacity-30 bg-white w-0`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mission Log */}
                <div className="space-y-6 animate-fadeInUp delay-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            Mission Intelligence Log
                        </h3>
                        <div className="text-[9px] font-mono text-slate-500 p-2 bg-white/5 rounded-lg border border-white/5">
                            LAST_SCAN: {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                    <div className="glass rounded-[2.5rem] border border-white/5 p-12 md:p-20 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent opacity-50" />
                        <div className="relative z-10">
                            <div className="text-5xl md:text-7xl mb-8 opacity-20 filter grayscale group-hover:grayscale-0 transition-all duration-700">📡</div>
                            <p className="font-mono text-xs uppercase tracking-[0.4em] text-slate-300 mb-2">SCANNED BASE NETWORK FOR ACTIVITY...</p>
                            <p className="text-[10px] opacity-40 uppercase tracking-widest font-mono">No verified missions found for this identity</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
