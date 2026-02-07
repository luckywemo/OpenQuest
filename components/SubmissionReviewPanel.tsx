import React, { useState, useEffect } from 'react';

interface Submission {
    id: string;
    projectName: string;
    questTitle: string;
    contractAddress: string;
    rewardBudget: string;
    rewardType: string;
    contactEmail: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    submittedAt: number;
}

const SubmissionReviewPanel: React.FC = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = () => {
        const stored = localStorage.getItem('questSubmissions');
        if (stored) {
            setSubmissions(JSON.parse(stored));
        }
    };

    const updateStatus = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
        const updated = submissions.map(sub =>
            sub.id === id ? { ...sub, status: newStatus } : sub
        );
        setSubmissions(updated);
        localStorage.setItem('questSubmissions', JSON.stringify(updated));
    };

    const pending = submissions.filter(s => s.status === 'PENDING');

    if (pending.length === 0) {
        return (
            <div className="glass p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-4">Quest Submissions</h3>
                <p className="text-slate-400 text-center py-8">No pending submissions</p>
            </div>
        );
    }

    return (
        <div className="glass p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-6">Pending Quest Submissions ({pending.length})</h3>

            <div className="space-y-4">
                {pending.map((sub) => (
                    <div key={sub.id} className="bg-white/5 p-6 rounded-xl">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h4 className="text-lg font-bold">{sub.questTitle}</h4>
                                <p className="text-sm text-slate-400">by {sub.projectName}</p>
                            </div>
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs font-bold">
                                PENDING
                            </span>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-xs text-slate-500">Contract</p>
                                <code className="text-xs bg-slate-800 px-2 py-1 rounded">
                                    {sub.contractAddress.substring(0, 10)}...
                                </code>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Reward</p>
                                <p className="text-sm font-semibold">{sub.rewardType}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Budget</p>
                                <p className="text-sm font-semibold">{sub.rewardBudget}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Contact</p>
                                <p className="text-sm">{sub.contactEmail}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => updateStatus(sub.id, 'APPROVED')}
                                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition"
                            >
                                ✓ Approve
                            </button>
                            <button
                                onClick={() => updateStatus(sub.id, 'REJECTED')}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
                            >
                                ✗ Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubmissionReviewPanel;
