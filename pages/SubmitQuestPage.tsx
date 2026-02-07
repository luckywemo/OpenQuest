import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface QuestSubmission {
    projectName: string;
    contractAddress: string;
    questTitle: string;
    questDescription: string;
    questAction: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    category: 'DEFI' | 'NFT' | 'SOCIAL' | 'GOVERNANCE';
    rewardBudget: string;
    rewardType: string;
    contactEmail: string;
    website: string;
}

const SubmitQuestPage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState<QuestSubmission>({
        projectName: '',
        contractAddress: '',
        questTitle: '',
        questDescription: '',
        questAction: '',
        difficulty: 'MEDIUM',
        category: 'DEFI',
        rewardBudget: '',
        rewardType: '',
        contactEmail: '',
        website: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Save to localStorage (in production, POST to /api/submit-quest)
            const submissions = JSON.parse(localStorage.getItem('questSubmissions') || '[]');
            const newSubmission = {
                ...formData,
                id: `sub-${Date.now()}`,
                status: 'PENDING',
                submittedAt: Date.now()
            };
            submissions.push(newSubmission);
            localStorage.setItem('questSubmissions', JSON.stringify(submissions));

            console.log('📧 Quest submission saved:', newSubmission);
            setSubmitted(true);
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit. Please try again.');
        }
    };

    const handleChange = (field: keyof QuestSubmission, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-6">✅</div>
                    <h1 className="text-4xl font-bold mb-4">Submission Received!</h1>
                    <p className="text-slate-400 mb-8">
                        Thank you for your interest in partnering with OpenQuest. Our team will review your quest proposal within 24-48 hours.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => setSubmitted(false)}
                            className="px-6 py-3 glass hover:bg-white/10 rounded-lg font-semibold transition"
                        >
                            Submit Another
                        </button>
                        <Link
                            to="/"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-12">
                    <Link to="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-5xl font-bold mb-4">Submit a Sponsored Quest</h1>
                    <p className="text-xl text-slate-400">
                        Partner with OpenQuest to promote your protocol on Base
                    </p>
                </div>

                {/* Benefits */}
                <div className="glass p-8 rounded-2xl mb-12">
                    <h2 className="text-2xl font-bold mb-6">Why Sponsor a Quest?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <div className="text-4xl mb-3">🎯</div>
                            <h3 className="font-bold mb-2">Direct Users</h3>
                            <p className="text-sm text-slate-400">Get qualified users to interact with your protocol</p>
                        </div>
                        <div>
                            <div className="text-4xl mb-3">📢</div>
                            <h3 className="font-bold mb-2">Multi-Channel Reach</h3>
                            <p className="text-sm text-slate-400">Announced on Twitter, Farcaster, and messaging platforms</p>
                        </div>
                        <div>
                            <div className="text-4xl mb-3">🤖</div>
                            <h3 className="font-bold mb-2">Auto-Verified</h3>
                            <p className="text-sm text-slate-400">Our AI verifies completions onchain automatically</p>
                        </div>
                    </div>
                </div>

                {/* Submission Form */}
                <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl space-y-6">
                    <h2 className="text-2xl font-bold mb-6">Quest Details</h2>

                    {/* Project Info */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Project Name *</label>
                        <input
                            type="text"
                            value={formData.projectName}
                            onChange={(e) => handleChange('projectName', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-white/10 focus:border-blue-500 outline-none"
                            placeholder="e.g., Uniswap, Aerodrome, BasePaint"
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Contract Address *</label>
                            <input
                                type="text"
                                value={formData.contractAddress}
                                onChange={(e) => handleChange('contractAddress', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-white/10 focus:border-blue-500 outline-none font-mono text-sm"
                                placeholder="0x..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Website *</label>
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => handleChange('website', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-white/10 focus:border-blue-500 outline-none"
                                placeholder="https://yourproject.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Quest Details */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Quest Title *</label>
                        <input
                            type="text"
                            value={formData.questTitle}
                            onChange={(e) => handleChange('questTitle', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-white/10 focus:border-blue-500 outline-none"
                            placeholder="e.g., Swap on Uniswap V3"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Quest Description *</label>
                        <textarea
                            value={formData.questDescription}
                            onChange={(e) => handleChange('questDescription', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-white/10 focus:border-blue-500 outline-none h-24"
                            placeholder="Describe what users will learn or achieve..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Specific Action to Verify *</label>
                        <input
                            type="text"
                            value={formData.questAction}
                            onChange={(e) => handleChange('questAction', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-white/10 focus:border-blue-500 outline-none"
                            placeholder="e.g., Execute a swap, Mint an NFT, Provide liquidity"
                            required
                        />
                        <p className="text-xs text-slate-500 mt-2">This helps our AI verify completion onchain</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Difficulty *</label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => handleChange('difficulty', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-white/10 focus:border-blue-500 outline-none"
                                required
                            >
                                <option value="EASY">Easy (Beginner)</option>
                                <option value="MEDIUM">Medium (Intermediate)</option>
                                <option value="HARD">Hard (Advanced)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Category *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-white/10 focus:border-blue-500 outline-none"
                                required
                            >
                                <option value="DEFI">DeFi</option>
                                <option value="NFT">NFT</option>
                                <option value="SOCIAL">Social</option>
                                <option value="GOVERNANCE">Governance</option>
                            </select>
                        </div>
                    </div>

                    {/* Reward Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Reward Type *</label>
                            <input
                                type="text"
                                value={formData.rewardType}
                                onChange={(e) => handleChange('rewardType', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-white/10 focus:border-blue-500 outline-none"
                                placeholder="e.g., 50 $TOKEN, NFT Badge, Points"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Total Budget (USD) *</label>
                            <input
                                type="text"
                                value={formData.rewardBudget}
                                onChange={(e) => handleChange('rewardBudget', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-white/10 focus:border-blue-500 outline-none"
                                placeholder="e.g., $500"
                                required
                            />
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Contact Email *</label>
                        <input
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) => handleChange('contactEmail', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-white/10 focus:border-blue-500 outline-none"
                            placeholder="partnerships@yourproject.com"
                            required
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold text-lg transition shadow-lg"
                    >
                        Submit Quest Proposal
                    </button>

                    <p className="text-xs text-slate-500 text-center">
                        By submitting, you agree to our partnership terms and understand that quest approval is at OpenQuest's discretion.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SubmitQuestPage;
