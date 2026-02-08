import React from 'react';
import { useProfile } from "@farcaster/auth-kit";
import { Icons } from '../constants';
import { Twitter, MessageSquare, PlusCircle, X, ChevronRight } from 'lucide-react';
import { SignInButton } from "@farcaster/auth-kit";
import { Link } from 'react-router-dom';

interface HeaderProps {
  onOpenSubmit: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSubmit }) => {
  const { isAuthenticated, profile } = useProfile();
  const [isXModalOpen, setIsXModalOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isUserAuthenticated = isAuthenticated;

  return (
    <header className="py-6 relative z-50">
      <div className="flex justify-between items-center gap-4">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <Icons.BaseLogo />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black tracking-tighter flex items-center gap-2">
              OPENQUEST <span className="text-blue-500 text-[10px] font-mono tracking-normal px-1.5 py-0.5 bg-blue-500/10 rounded">v1.2</span>
            </h1>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Autonomous Onchain Agent</p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-lg font-black tracking-tighter">OPENQUEST</h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/submit-quest"
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
          >
            <PlusCircle size={14} /> Protocols
          </Link>

          <div className="h-4 w-[1px] bg-white/10" />

          <div className="flex items-center gap-4">
            {!isUserAuthenticated && (
              <button
                onClick={() => setIsXModalOpen(true)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 flex items-center justify-center transition-all group"
                title="Connect X"
              >
                <Twitter size={14} className="text-slate-400 group-hover:text-blue-400" />
              </button>
            )}

            {/* User Profile Hook (if authenticated, link to profile) */}
            {isUserAuthenticated ? (
              <Link to="/profile" className="flex items-center gap-3 p-1.5 pl-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black tracking-tighter text-white">
                    {profile?.displayName || profile?.username || 'Operative'}
                  </span>
                  <span className="text-[8px] text-blue-400 font-mono flex items-center gap-1">VIEW HUB <ChevronRight size={8} /></span>
                </div>
                {profile?.pfpUrl ? (
                  <img src={profile.pfpUrl} alt="PFP" className="w-8 h-8 rounded-lg border border-blue-500/20" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center border border-blue-500/20">
                    <Icons.BaseLogo />
                  </div>
                )}
              </Link>
            ) : (
              <div className="farcaster-native-button scale-95 origin-right">
                <SignInButton />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-4 p-6 glass rounded-2xl border-blue-500/20 shadow-3xl animate-fadeIn space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/submit-quest"
              onClick={() => setIsMenuOpen(false)}
              className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center gap-2"
            >
              <PlusCircle size={20} className="text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Submit</span>
            </Link>
            {!isUserAuthenticated && (
              <button
                onClick={() => { setIsXModalOpen(true); setIsMenuOpen(false); }}
                className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center gap-2"
              >
                <Twitter size={20} className="text-blue-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Link X</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {isUserAuthenticated ? (
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="w-full p-4 bg-blue-600/10 rounded-xl border border-blue-500/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                    {profile?.pfpUrl ? <img src={profile.pfpUrl} alt="PFP" className="w-full h-full rounded-lg" /> : <Icons.BaseLogo />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-white">{profile?.displayName || 'Operative'}</span>
                    <span className="text-[10px] text-blue-400 font-mono">SOCIAL HUB</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-500" />
              </Link>
            ) : (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
          </div>
        </div>
      )}

      {/* X Connection Modal */}
      {isXModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass max-w-sm w-full p-8 rounded-3xl border-2 border-blue-500/30 relative shadow-2xl">
            <button onClick={() => setIsXModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20} /></button>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400">
                <Twitter size={32} fill="currentColor" />
              </div>
              <h3 className="text-2xl font-bold mb-4 italic tracking-tighter">LINK YOUR X</h3>
              <p className="text-slate-400 text-xs mb-6">Synchronize your social intelligence. DM <span className="text-blue-400 font-bold">@openquestbot</span> with:</p>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 font-mono text-[11px] text-blue-300 mb-8 select-all cursor-copy break-all tracking-tight">
                link {profile?.custody || '0x...'}
              </div>
              <button onClick={() => setIsXModalOpen(false)} className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-black text-xs text-white transition-all uppercase tracking-widest">ACKNOWLEDGE</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
