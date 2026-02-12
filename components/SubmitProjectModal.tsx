
import React, { useState } from 'react';
import { X, Send, Globe, Cpu, Coins, Sparkles } from 'lucide-react';
import { ProjectSubmission } from '../types';

interface SubmitProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (submission: ProjectSubmission) => void;
}

const SubmitProjectModal: React.FC<SubmitProjectModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<ProjectSubmission>({
    name: '',
    website: '',
    contract: '',
    questAction: '',
    rewardBudget: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({ name: '', website: '', contract: '', questAction: '', rewardBudget: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass w-full max-w-xl rounded-3xl border border-blue-500/30 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Modal Header */}
        <div className="bg-blue-600/10 p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="text-blue-400" size={20} />
              SUBMIT PROJECT
            </h2>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">Autonomous Agent Evaluation Queue</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Project Name</label>
              <div className="relative">
                <input
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all pl-10"
                  placeholder="BaseSwap"
                />
                <Cpu size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Website / Docs</label>
              <div className="relative">
                <input
                  required
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all pl-10"
                  placeholder="https://docs.yours.ai"
                />
                <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Base Contract Address</label>
            <input
              required
              value={formData.contract}
              onChange={e => setFormData({ ...formData, contract: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-blue-500/50 outline-none transition-all"
              placeholder="0x..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Quest Action Description</label>
            <textarea
              required
              value={formData.questAction}
              onChange={e => setFormData({ ...formData, questAction: e.target.value })}
              rows={3}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none transition-all resize-none"
              placeholder="e.g., Mint 'Golden Ticket' NFT or Swap > 0.1 ETH for PROJECT_TOKEN"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Reward Budget (ETH or ERC20)</label>
            <div className="relative">
              <input
                required
                value={formData.rewardBudget}
                onChange={e => setFormData({ ...formData, rewardBudget: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none transition-all pl-10"
                placeholder="1000 P-TOKENS or 0.05 ETH"
              />
              <Coins size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              INITIATE AGENT EVALUATION <Send size={18} />
            </button>
            <p className="text-[9px] text-slate-500 text-center mt-4 font-medium uppercase tracking-widest">
              Processing via OpenQuest Autonomous Engine • 12-24h ETA
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitProjectModal;
