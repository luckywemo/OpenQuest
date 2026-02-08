
import React, { useState, useEffect, useCallback } from 'react';
import {
  Quest,
  QuestStatus,
  ActivityLog as LogType,
  AgentStats,
  ProjectSubmission
} from '../types';
import Header from '../components/Header';
import StatsGrid from '../components/StatsGrid';
import QuestCard from '../components/QuestCard';
import ActivityLog from '../components/ActivityLog';
import SubmitProjectModal from '../components/SubmitProjectModal';
import { Icons } from '../constants';
import SubmissionReviewPanel from '../components/SubmissionReviewPanel';
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const CHART_DATA = [
  { name: 'Mon', active: 400, completed: 240 },
  { name: 'Tue', active: 300, completed: 139 },
  { name: 'Wed', active: 200, completed: 980 },
  { name: 'Thu', active: 278, completed: 390 },
  { name: 'Fri', active: 189, completed: 480 },
  { name: 'Sat', active: 239, completed: 380 },
  { name: 'Sun', active: 349, completed: 430 },
];

const App: React.FC = () => {
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [questHistory, setQuestHistory] = useState<Quest[]>([]);
  const [logs, setLogs] = useState<LogType[]>([
    { id: '1', timestamp: Date.now() - 5000, type: 'INFO', message: 'OpenQuest autonomous loop initialized.' }
  ]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [stats, setStats] = useState<AgentStats>({
    questsDeployed: 0,
    totalParticipants: 0,
    rewardsDistributed: 0,
    walletBalance: '0.00 ETH',
    dailyBudgetUsed: '0.00 / 0.1 ETH'
  });
  const [loading, setLoading] = useState(true);

  const addLog = useCallback((message: string, type: LogType['type'] = 'INFO', txHash?: string) => {
    setLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(36),
        timestamp: Date.now(),
        message,
        type,
        txHash
      }
    ].slice(-100)); // Keep last 100 logs
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, questsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/quests')
      ]);

      const statsData = await statsRes.json();
      const questsData = await questsRes.json();

      setStats(statsData);
      if (questsData.length > 0) {
        setActiveQuest(questsData[0]);
        setQuestHistory(questsData.slice(1));
      }

      addLog('Backend data synchronized successfully', 'INFO');
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      addLog('Sync failed: ' + (error as Error).message, 'ALERT');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (submission: ProjectSubmission) => {
    addLog(`New Project Proposal Received: ${submission.name}`, 'INFO');
    try {
      const response = await fetch('/api/submit-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });
      if (response.ok) {
        addLog(`Evaluation Complete. Project ${submission.name} approved for future quest slot.`, 'VERIFICATION');
      }
    } catch (err) {
      addLog('Failed to submit project: ' + (err as Error).message, 'ALERT');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Sync every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto px-4 py-4 md:py-8 space-y-6 md:space-y-8">
      <Header onOpenSubmit={() => setIsSubmitModalOpen(true)} />

      <div className="space-y-8 animate-fadeIn">
        <StatsGrid stats={stats} />

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 flex-1">
          {/* Left Column: Main Controls */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8 order-2 lg:order-1">
            <SubmissionReviewPanel />

            {activeQuest ? (
              <QuestCard quest={activeQuest} />
            ) : (
              <div className="glass p-12 rounded-[2.5rem] animate-pulse flex flex-col items-center justify-center text-slate-500 min-h-[400px] border-blue-500/10">
                <div className="animate-spin mb-6 text-blue-500">
                  <Icons.BaseLogo />
                </div>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-blue-400">GENERATING AUTONOMOUNS MISSION...</p>
              </div>
            )}

            <div className="glass p-6 md:p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-blue-600/10" />

              <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(0,82,255,0.8)]" />
                  Protocol Engagement (7d)
                </h3>
              </div>

              <div className="h-[240px] md:h-[300px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0052FF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0052FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis
                      dataKey="name"
                      stroke="#475569"
                      fontSize={10}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke="#475569"
                      fontSize={10}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '11px',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)'
                      }}
                      itemStyle={{ color: '#0052FF', fontWeight: 'bold' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="active"
                      stroke="#0052FF"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorActive)"
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={0}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column: Execution Logs */}
          <div className="lg:col-span-1 h-[500px] lg:h-auto order-1 lg:order-2">
            <ActivityLog logs={logs} />
          </div>
        </main>
      </div>

      <SubmitProjectModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleProjectSubmit}
      />

      {/* Footer Branding */}
      <footer className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-mono uppercase tracking-widest">Autonomous Loop Active</span>
        </div>
        <div className="flex gap-6 text-[10px] font-mono uppercase tracking-widest">
          <a href="#" className="hover:text-blue-400">Documentation</a>
          <a href="#" className="hover:text-blue-400">Security Policy</a>
          <a href="#" className="hover:text-blue-400">Agent Source</a>
        </div>
        <div className="text-[10px] font-mono opacity-50">
          POWERED BY GEMINI & OPENCLAW
        </div>
      </footer>
    </div>
  );
};

export default App;
