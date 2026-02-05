
import React from 'react';
import { Icons } from '../constants';
import { Twitter, MessageSquare, ExternalLink, PlusCircle } from 'lucide-react';

interface HeaderProps {
  onOpenSubmit: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSubmit }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-6 py-4">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
          <Icons.BaseLogo />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
            BASEQUEST <span className="text-blue-500 text-sm font-mono tracking-normal">v1.2-ALPHA</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">Autonomous Onchain Quest Agent</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex -space-x-2 mr-4">
          <div className="w-8 h-8 rounded-full border-2 border-[#050a14] bg-slate-800 flex items-center justify-center">
            <Twitter size={14} className="text-slate-400" />
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-[#050a14] bg-slate-800 flex items-center justify-center">
            <MessageSquare size={14} className="text-slate-400" />
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-[#050a14] bg-blue-900 flex items-center justify-center text-[10px] font-bold">
            OC
          </div>
        </div>

        <button 
          onClick={onOpenSubmit}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all border border-white/10 flex items-center gap-2"
        >
          <PlusCircle size={14} className="text-blue-400" /> SUBMIT PROJECT
        </button>

        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
          EXPLORE BASE <ExternalLink size={14} />
        </button>
      </div>
    </header>
  );
};

export default Header;
