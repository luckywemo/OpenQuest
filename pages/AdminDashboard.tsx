
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

const INITIAL_LOGS: LogType[] = [
  { id: '1', timestamp: Date.now() - 5000, type: 'INFO', message: 'BaseQuest autonomous loop initialized.' },
  { id: '2', timestamp: Date.now() - 4000, type: 'INFO', message: 'Checking wallet balance on Base: 1.42 ETH.' },
  { id: '3', timestamp: Date.now() - 3000, type: 'VERIFICATION', message: 'Scanning recent events for Aerodrome LP interactions...' },
];

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
  const [logs, setLogs] = useState<LogType[]>(INITIAL_LOGS);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [stats, setStats] = useState<AgentStats>({
    questsDeployed: 12,
    totalParticipants: 1452,
    rewardsDistributed: 842,
    walletBalance: '1.42 ETH',
    dailyBudgetUsed: '0.04 / 0.1 ETH'
  });

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

  const archiveQuest = useCallback(() => {
    if (activeQuest) {
      setQuestHistory(prev => [activeQuest, ...prev].slice(0, 10)); // Keep last 10
      addLog(`Quest "${activeQuest.title}" archived. ${activeQuest.completedCount} participants verified.`, 'INFO');
    }
  }, [activeQuest, addLog]);

  const initQuestCycle = async () => {
    try {
      // Archive current quest before generating new one
      if (activeQuest) {
        archiveQuest();
      }

      addLog('Triggering simulation for next quest cycle...', 'INFO');

      // Mock quest generation for UI simulation
      // Real generation happens via Vercel Cron
      const newQuest: Quest = {
        id: `q-sim-${Math.random().toString(36).substr(2, 9)}`,
        title: "Standardized Base Quest",
        description: "A placeholder quest for the simulation UI",
        protocol: "BaseProtocol",
        protocolUrl: "https://base.org",
        actionRequired: "Perform a standard action",
        targetContract: "0x0000000000000000000000000000000000000000",
        rewardType: "ERC20",
        rewardAmount: "10 QUEST",
        difficulty: "EASY",
        category: "DEFI",
        startTime: Date.now(),
        endTime: Date.now() + 24 * 60 * 60 * 1000,
        status: QuestStatus.ACTIVE,
        verificationLogic: "Mock verification",
        completedCount: 0
      };

      setActiveQuest(newQuest);
      addLog(`New Quest Deployed: "${newQuest.title}" [${newQuest.difficulty} - ${newQuest.category}]`, 'TRANSACTION', '0x' + Math.random().toString(16).substr(2, 64));

      setStats(prev => ({
        ...prev,
        questsDeployed: prev.questsDeployed + 1
      }));
    } catch (error) {
      addLog('Critical error in quest cycle: ' + (error as Error).message, 'ALERT');
    }
  };

  const handleProjectSubmit = (submission: ProjectSubmission) => {
    addLog(`New Project Proposal Received: ${submission.name}`, 'INFO');
    addLog(`Agent "Gemini" starting evaluation of ${submission.contract.substr(0, 10)}...`, 'INFO');

    // Simulate approval process
    setTimeout(() => {
      addLog(`Evaluation Complete. Project ${submission.name} approved for future quest slot.`, 'VERIFICATION');
      addLog(`Staging reward treasury for ${submission.name}...`, 'INFO');
    }, 5000);
  };

  useEffect(() => {
    initQuestCycle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulate verification cycle
  useEffect(() => {
    const interval = setInterval(() => {
      if (!activeQuest) return;

      const luckyAddress = '0x' + Math.random().toString(16).substr(2, 40);
      addLog(`Monitoring Base logs... Found activity for ${luckyAddress.substr(0, 6)}...`, 'INFO');

      // 30% chance of a "completion" in simulation
      if (Math.random() > 0.7) {
        addLog(`Verified completion for ${luckyAddress.substr(0, 6)}...`, 'VERIFICATION');
        addLog(`Reward distribution transaction sent.`, 'TRANSACTION', '0x' + Math.random().toString(16).substr(2, 64));

        // Update both global stats and specific quest count
        setStats(prev => ({
          ...prev,
          totalParticipants: prev.totalParticipants + 1,
          rewardsDistributed: prev.rewardsDistributed + 1
        }));

        setActiveQuest(prev => {
          if (!prev) return null;
          return {
            ...prev,
            completedCount: prev.completedCount + 1
          };
        });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [addLog, activeQuest]);

  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto px-4 py-8 space-y-8">
      <Header onOpenSubmit={() => setIsSubmitModalOpen(true)} />

      <StatsGrid stats={stats} />

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Left Column: Submissions & Active Quest */}
        <div className="lg:col-span-2 space-y-8">
          <SubmissionReviewPanel />

          {activeQuest ? (
            <QuestCard quest={activeQuest} />
          ) : (
            <div className="glass p-12 rounded-2xl animate-pulse flex flex-col items-center justify-center text-slate-500 min-h-[400px]">
              <div className="animate-spin mb-4">
                <Icons.BaseLogo />
              </div>
              <p className="mt-4 font-mono text-sm uppercase tracking-widest">Generating Autonomous Quest...</p>
            </div>
          )}

          <div className="glass p-6 rounded-2xl border border-white/5">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Icons.BaseLogo /> Protocol Engagement (7d)
            </h3>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0052FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0052FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', borderRadius: '8px' }}
                    itemStyle={{ color: '#0052FF' }}
                  />
                  <Area type="monotone" dataKey="active" stroke="#0052FF" fillOpacity={1} fill="url(#colorActive)" />
                  <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="rgba(16, 185, 129, 0.1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Logs */}
        <div className="lg:col-span-1 h-[600px] lg:h-auto">
          <ActivityLog logs={logs} />
        </div>
      </main>

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
