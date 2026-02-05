
import React, { useEffect, useRef } from 'react';
import { ActivityLog as LogType } from '../types';
import { Terminal } from 'lucide-react';

interface ActivityLogProps {
  logs: LogType[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass rounded-xl overflow-hidden border border-white/10 h-full flex flex-col">
      <div className="bg-white/5 p-3 flex items-center gap-2 border-b border-white/5">
        <Terminal size={14} className="text-blue-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Agent Execution Logs</span>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-2 font-mono text-[11px] bg-black/20"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 leading-relaxed">
            <span className="text-slate-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
            <div className="flex-1">
              <span className={`
                ${log.type === 'TRANSACTION' ? 'text-blue-400' : ''}
                ${log.type === 'VERIFICATION' ? 'text-emerald-400' : ''}
                ${log.type === 'ALERT' ? 'text-rose-400 font-bold' : ''}
                ${log.type === 'INFO' ? 'text-slate-400' : ''}
              `}>
                {log.message}
              </span>
              {log.txHash && (
                <a 
                  href={`https://basescan.org/tx/${log.txHash}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-slate-600 hover:text-blue-400 ml-2 underline decoration-dotted"
                >
                  view tx
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;
