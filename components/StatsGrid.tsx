
import React from 'react';
import { AgentStats } from '../types';
import { Activity, Users, Award, Wallet, ShieldCheck } from 'lucide-react';

interface StatsGridProps {
  stats: AgentStats;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const items = [
    { label: 'Quests Deployed', value: stats.questsDeployed, icon: Activity, color: 'text-blue-400' },
    { label: 'Total Participants', value: stats.totalParticipants, icon: Users, color: 'text-purple-400' },
    { label: 'Rewards Sent', value: stats.rewardsDistributed, icon: Award, color: 'text-emerald-400' },
    { label: 'Wallet Balance', value: stats.walletBalance, icon: Wallet, color: 'text-amber-400' },
    { label: 'Daily Budget', value: stats.dailyBudgetUsed, icon: ShieldCheck, color: 'text-rose-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {items.map((item, idx) => (
        <div key={idx} className="glass p-4 rounded-xl flex flex-col items-center text-center">
          <item.icon size={20} className={`${item.color} mb-2`} />
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{item.label}</span>
          <span className="text-xl font-bold mt-1">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
