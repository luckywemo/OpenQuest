import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../constants';
import { useAccount } from 'wagmi';
import { useProfile } from "@farcaster/auth-kit";

const HomePage: React.FC = () => {
    const { isConnected } = useAccount();
    const { isAuthenticated } = useProfile();
    const isUserAuthenticated = isConnected || isAuthenticated;
    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <header className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />

                {/* Animated background particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-float"></div>
                    <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-float stagger-2"></div>
                    <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-blue-300 rounded-full animate-float stagger-3"></div>
                    <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-purple-300 rounded-full animate-float stagger-4"></div>
                </div>

                <nav className="relative max-w-7xl mx-auto px-4 py-6 flex justify-between items-center animate-fadeIn">
                    <div className="flex items-center gap-3">
                        <Icons.BaseLogo />
                        <h1 className="text-2xl font-bold">OpenQuest</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/quests" className="text-slate-300 hover:text-white transition-all duration-300">
                            Browse Quests
                        </Link>
                        <Link to="/submit-quest" className="text-slate-300 hover:text-white transition-all duration-300">
                            For Protocols
                        </Link>
                        <Link
                            to="/profile"
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all duration-300 hover-lift"
                        >
                            {isUserAuthenticated ? 'View Profile' : 'Login with Farcaster'}
                        </Link>
                    </div>
                </nav>

                <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
                    <h1 className="text-6xl font-bold mb-6 animate-fadeInUp gradient-text">
                        Earn Rewards on Base
                    </h1>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto animate-fadeInUp stagger-2">
                        Complete onchain quests, earn XP, and claim exclusive rewards from the best protocols on Base.
                    </p>

                    <div className="flex gap-4 justify-center animate-fadeInUp stagger-3">
                        <Link
                            to="/quests"
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-blue-600/50 hover-lift interactive-button"
                        >
                            Start Questing
                        </Link>
                        <a
                            href="#how-it-works"
                            className="px-8 py-4 glass rounded-xl font-bold text-lg transition-all duration-300 hover:bg-white/10 hover-lift"
                        >
                            How It Works
                        </a>
                    </div>
                </div>
            </header>

            {/* Stats Section */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="glass p-8 rounded-2xl text-center hover-lift card-entrance">
                        <div className="text-4xl font-bold text-blue-400 mb-2">1,452</div>
                        <div className="text-slate-400 uppercase text-sm tracking-wider">Active Questers</div>
                    </div>
                    <div className="glass p-8 rounded-2xl text-center hover-lift card-entrance stagger-2">
                        <div className="text-4xl font-bold text-purple-400 mb-2">842</div>
                        <div className="text-slate-400 uppercase text-sm tracking-wider">Rewards Claimed</div>
                    </div>
                    <div className="glass p-8 rounded-2xl text-center hover-lift card-entrance stagger-3">
                        <div className="text-4xl font-bold text-emerald-400 mb-2">12+</div>
                        <div className="text-slate-400 uppercase text-sm tracking-wider">Partner Protocols</div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-4xl font-bold text-center mb-16 animate-fadeInUp">How It Works</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center animate-fadeInUp stagger-1">
                        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 hover-glow transition-all duration-300">
                            <span className="text-3xl">🎯</span>
                        </div>
                        <h3 className="text-xl font-bold mb-4">1. Choose a Quest</h3>
                        <p className="text-slate-400">Browse quests from top Base protocols. Find one that matches your skill level.</p>
                    </div>

                    <div className="text-center animate-fadeInUp stagger-2">
                        <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 hover-glow transition-all duration-300">
                            <span className="text-3xl">✅</span>
                        </div>
                        <h3 className="text-xl font-bold mb-4">2. Complete Onchain</h3>
                        <p className="text-slate-400">Execute the transaction. Our AI verifies completion automatically.</p>
                    </div>

                    <div className="text-center animate-fadeInUp stagger-3">
                        <div className="w-16 h-16 bg-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 hover-glow transition-all duration-300">
                            <span className="text-3xl">🎁</span>
                        </div>
                        <h3 className="text-xl font-bold mb-4">3. Claim Rewards</h3>
                        <p className="text-slate-400">Get tokens, NFTs, or XP. All rewards distributed onchain.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 py-24">
                <div className="glass p-16 rounded-3xl text-center border-2 border-blue-600/30">
                    <h2 className="text-4xl font-bold mb-6">Ready to Start?</h2>
                    <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of questers earning rewards on Base. No whitelist, no waitlist—just start!
                    </p>
                    <Link
                        to="/profile"
                        className="inline-block px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold text-lg transition shadow-lg"
                    >
                        {isUserAuthenticated ? 'Go to Profile' : 'Connect & Start Questing'}
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto border-t border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
                    <div>© 2026 OpenQuest. Powered by Base & Gemini AI.</div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-blue-400">Documentation</a>
                        <a href="#" className="hover:text-blue-400">Twitter</a>
                        <a href="#" className="hover:text-blue-400">Farcaster</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
