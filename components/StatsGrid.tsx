
import React from 'react';
import { AgentStats } from '../types';
import { Activity, Users, Award, Wallet, ShieldCheck } from 'lucide-react';

interface StatsGridProps {
  stats: AgentStats;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const statItems = [
    { label: 'Active Quests', value: stats.questsDeployed, icon: '🎯' },
    { label: 'Participants', value: stats.totalParticipants.toLocaleString(), icon: '👥' },
    { label: 'Treasury Balance', value: stats.walletBalance, icon: '💎' },
    { label: 'Distributed', value: stats.rewardsDistributed.toLocaleString(), icon: '🎁' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statItems.map((item, idx) => (
        <div key={idx} className="glass p-6 md:p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group hover-lift transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:opacity-20 transition-opacity">
            {item.icon}
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{item.label}</p>
          <p className="text-2xl md:text-3xl font-black text-white tracking-tighter">{item.value}</p>

          <div className="mt-4 flex items-center gap-2">
            <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[60%] rounded-full opacity-50" />
            </div>
            <span className="text-[9px] font-mono text-slate-600">+12%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
