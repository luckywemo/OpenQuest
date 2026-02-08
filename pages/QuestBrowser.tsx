import React, { useState, useEffect } from 'react';
import { Quest } from '../types';
import { Link } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useProfile } from "@farcaster/auth-kit";
import Header from '../components/Header';

const QuestBrowser: React.FC = () => {
    const { isAuthenticated } = useProfile();
    const isUserAuthenticated = isAuthenticated;
    const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
    const [quests, setQuests] = useState<Quest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuests = async () => {
            try {
                const response = await fetch('/api/quests');
                const data = await response.json();
                setQuests(data);
            } catch (error) {
                console.error('Failed to fetch quests:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuests();
    }, []);

    // Fee Configuration for Monetization
    const feeRecipient = import.meta.env.VITE_FEE_RECIPIENT_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
    const feeAmount = '1'; // 1%

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'EASY': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'MEDIUM': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'HARD': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="min-h-screen py-6">
            <div className="max-w-7xl mx-auto px-4">
                <Header onOpenSubmit={() => { }} />

                <div className="mt-12">
                    <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight text-white">Quest Browser</h2>
                    <p className="text-slate-400 mb-8 md:mb-12 text-sm md:text-base">Discover and complete onchain tasks to earn rewards</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass p-8 rounded-3xl border border-white/5 animate-pulse min-h-[300px]"></div>
                        ))}
                    </div>
                ) : quests.length === 0 ? (
                    <div className="text-center py-20 glass rounded-3xl border border-white/5">
                        <div className="text-6xl mb-6 opacity-30">🎯</div>
                        <h3 className="text-2xl font-bold text-slate-400">No active quests found</h3>
                        <p className="text-slate-500 mt-2">Check back later for new autonomous quests!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {quests.map((quest) => (
                            <div key={quest.id} className="glass p-6 md:p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group flex flex-col justify-between h-full hover-lift">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getDifficultyColor(quest.difficulty)}`}>
                                            {quest.difficulty}
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter">[{quest.category}]</span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors line-clamp-2">{quest.title}</h3>
                                    <p className="text-slate-400 text-xs md:text-sm mb-8 line-clamp-3 leading-relaxed">{quest.description}</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div>
                                            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Reward</p>
                                            <p className="text-base md:text-lg font-black text-emerald-400 tracking-tight">{quest.rewardAmount}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Protocol</p>
                                            <p className="text-xs md:text-sm font-bold text-white uppercase">{quest.protocol}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedQuest(quest)}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] uppercase tracking-widest"
                                    >
                                        Initiate Mission
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quest Detail Modal */}
                {selectedQuest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                        <div className="glass max-w-2xl w-full p-8 rounded-3xl border-2 border-blue-500/20 relative animate-scaleIn">
                            <button onClick={() => setSelectedQuest(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                                <span className="text-2xl">×</span>
                            </button>
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1">
                                    <div className="flex gap-3 mb-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getDifficultyColor(selectedQuest.difficulty)}`}>
                                            {selectedQuest.difficulty}
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center">{selectedQuest.protocol} / {selectedQuest.category}</span>
                                    </div>
                                    <h2 className="text-3xl font-black mb-4">{selectedQuest.title}</h2>
                                    <p className="text-slate-400 mb-8 leading-relaxed italic border-l-2 border-blue-500/30 pl-4">"{selectedQuest.description}"</p>

                                    <div className="space-y-4 mb-8">
                                        <div>
                                            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Primary Objective</h4>
                                            <p className="text-white text-sm bg-white/5 p-4 rounded-xl border border-white/10">{selectedQuest.actionRequired}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Automated Verification</h4>
                                            <p className="text-slate-400 text-xs font-mono">{selectedQuest.verificationLogic}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-64 space-y-4">
                                    <div className="glass p-6 rounded-2xl border-white/5 text-center">
                                        <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-2">Verified Bounty</p>
                                        <p className="text-3xl font-black text-emerald-400">{selectedQuest.rewardAmount}</p>
                                        <p className="text-[8px] text-slate-600 mt-2 font-mono">AUTOMATIC PAYOUT ON COMPLETION</p>
                                    </div>
                                    <a
                                        href={selectedQuest.protocolUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 bg-white/10 hover:bg-white/15 text-white rounded-xl font-bold text-center block transition-all"
                                    >
                                        Launch Protocol
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default QuestBrowser;
