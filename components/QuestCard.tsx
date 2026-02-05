
import React, { useMemo } from 'react';
import { Quest } from '../types';
import { Clock, ExternalLink, ShieldCheck, Target, Award, BarChart3, TrendingUp, Users, CheckCircle2, Zap, Gift, Calendar, Link2, Radio } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface QuestCardProps {
  quest: Quest;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  const timeLeft = Math.max(0, quest.endTime - Date.now());
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  const timeSinceDeployment = useMemo(() => {
    const diff = Date.now() - quest.startTime;
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }, [quest.startTime]);

  // Generate mock historical participation data for this specific quest
  const participationData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      time: `${i * 2}h`,
      participants: Math.floor(Math.random() * 50) + (i * 15) + (quest.completedCount * 2)
    }));
  }, [quest.id, quest.completedCount]);

  const impactMetrics = useMemo(() => [
    { label: 'Verified Solvers', value: quest.completedCount.toString(), icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Estimated TVL Delta', value: `+$${(quest.completedCount * 120 + 14200).toLocaleString()}`, icon: TrendingUp, color: 'text-blue-400' },
    { label: 'Network Gas Contribution', value: `${(quest.completedCount * 0.001 + 0.82).toFixed(3)} ETH`, icon: BarChart3, color: 'text-purple-400' },
  ], [quest.id, quest.completedCount]);

  const rewardLabel = quest.rewardType === 'SOULBOUND' ? 'Soulbound NFT Achievement' : 'ERC-20 QuestPoints';

  return (
    <div className="glass rounded-2xl overflow-hidden border border-blue-500/20 shadow-2xl shadow-blue-900/10 transition-all hover:border-blue-500/40">
      {/* Header Section */}
      <div className="bg-blue-600/10 p-6 border-b border-blue-500/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 text-[10px] font-black rounded shadow-sm shadow-blue-600/20 uppercase tracking-wider text-white">
                <Radio size={12} className="animate-pulse" /> Live Mission
              </div>

              {/* DIFFICULTY BADGE */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black rounded shadow-sm uppercase tracking-wider ${quest.difficulty === 'EASY' ? 'bg-emerald-600 text-white shadow-emerald-600/20' :
                  quest.difficulty === 'MEDIUM' ? 'bg-amber-600 text-white shadow-amber-600/20' :
                    'bg-rose-600 text-white shadow-rose-600/20'
                }`}>
                <Zap size={12} />
                {quest.difficulty}
              </div>

              {/* CATEGORY BADGE */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-700 text-slate-200 text-[10px] font-black rounded shadow-sm uppercase tracking-wider">
                {quest.category}
              </div>

              <span className="text-xs text-slate-500 font-mono tracking-widest">{quest.id}</span>

              {/* PROMINENT PARTICIPANT BADGE */}
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[11px] font-black rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <Users size={12} />
                <span className="uppercase tracking-tighter">Verified Participants:</span>
                <span className="text-white text-xs font-mono">{quest.completedCount}</span>
              </div>
            </div>

            <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-3">
              {quest.title}
            </h2>

            <div className="flex items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800/50 border border-white/5">
                <Clock size={14} className="text-amber-400" />
                <span className="text-amber-400 font-mono font-bold uppercase tracking-tight">{hours}h {minutes}m Remaining</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest opacity-60">
                <Calendar size={14} />
                Deployed {timeSinceDeployment}
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end gap-2">
            <div className="text-right p-4 bg-black/30 rounded-2xl border border-white/5 backdrop-blur-md">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] block mb-1">Global Traction</span>
              <div className="text-5xl font-black text-emerald-400 font-mono leading-none tracking-tighter flex items-baseline gap-1">
                {quest.completedCount.toString().padStart(3, '0')}
                <span className="text-lg text-emerald-600/50">/ ∞</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Mission Details (7/12) */}
        <div className="xl:col-span-7 space-y-8">
          <section>
            <h3 className="text-xs font-black text-slate-500 mb-3 flex items-center gap-2 uppercase tracking-[0.2em]">
              <Target size={14} /> Mission Objective
            </h3>
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-600 rounded-full opacity-50"></div>
              <p className="text-slate-200 text-xl leading-relaxed font-semibold">
                {quest.description}
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/80 rounded-xl border border-white/5 flex flex-col justify-between h-24 hover:bg-slate-800/80 transition-colors">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Protocol Venue</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{quest.protocol}</span>
                <ExternalLink size={14} className="text-blue-500" />
              </div>
            </div>
            <div className="p-4 bg-slate-900/80 rounded-xl border border-white/5 flex flex-col justify-between h-24 hover:bg-slate-800/80 transition-colors">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Primary Action</span>
              <span className="text-sm font-bold text-white uppercase tracking-tight">{quest.actionRequired}</span>
            </div>
          </div>

          <section className="p-4 bg-blue-950/30 border border-blue-500/20 rounded-xl">
            <h4 className="text-[10px] font-black text-blue-400 mb-2 uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck size={14} /> Autonomous Verification Logic
            </h4>
            <div className="bg-black/40 p-4 rounded-lg border border-white/5 shadow-inner">
              <code className="text-[11px] font-mono text-blue-200/80 block whitespace-pre-wrap leading-tight">
                {quest.verificationLogic}
              </code>
            </div>
          </section>
        </div>

        {/* Right Column: Analytics & Rewards (5/12) */}
        <div className="xl:col-span-5 space-y-6">
          {/* Enhanced Reward Block */}
          <section className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative p-6 bg-slate-900/90 border border-emerald-500/30 rounded-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Award size={120} className="text-emerald-400 -mr-4 -mt-4 rotate-12" />
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Gift size={18} className="text-emerald-400" />
                </div>
                <h3 className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.25em]">Reward Distribution</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block mb-1">Asset Identifier</span>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-white tracking-tighter leading-none">
                      {quest.rewardAmount || 'Badge #102'}
                    </span>
                    <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-[9px] font-black uppercase">
                      SECURED
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block mb-1">Type</span>
                    <div className="flex items-center gap-1.5">
                      <Award size={12} className="text-emerald-500" />
                      <span className="text-[11px] font-bold text-slate-200 uppercase">{quest.rewardType}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block mb-1">Category</span>
                    <span className="text-[11px] font-medium text-slate-400 truncate block">
                      {rewardLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Project Contribution Section */}
          <div className="p-4 bg-slate-900/60 border border-white/10 rounded-2xl flex items-center justify-between group/contrib hover:bg-slate-800/60 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
                <Link2 size={16} />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">Project Contribution</h3>
                <p className="text-xs font-bold text-slate-200">{quest.protocol}</p>
              </div>
            </div>
            <a
              href={quest.protocolUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-lg transition-all border border-blue-500/20 uppercase tracking-wider"
            >
              Learn More <ExternalLink size={10} />
            </a>
          </div>

          {/* Historical Trend Chart */}
          <div className="p-5 bg-slate-900/40 border border-white/5 rounded-2xl">
            <h3 className="text-[10px] font-black text-slate-500 mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
              <TrendingUp size={14} /> Participation Velocity
            </h3>
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={participationData}>
                  <Tooltip
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Bar
                    dataKey="participants"
                    fill="#3b82f6"
                    radius={[2, 2, 0, 0]}
                    animationDuration={1500}
                  >
                    {participationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fillOpacity={0.3 + (index / participationData.length) * 0.7} />
                    ))}
                  </Bar>
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 'dataMax + 20']} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Impact Metrics Grid */}
          <div className="grid grid-cols-1 gap-3">
            {impactMetrics.map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-slate-800 ${metric.color}`}>
                    <metric.icon size={14} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{metric.label}</span>
                </div>
                <span className="text-sm font-black text-white font-mono">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestCard;
