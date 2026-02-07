import React from 'react';
import { Icons } from '../constants';
import { Twitter, MessageSquare, ExternalLink, PlusCircle, X } from 'lucide-react';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
  WalletDropdownLink
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import { NeynarAuthButton } from "@neynar/react";

interface HeaderProps {
  onOpenSubmit: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSubmit }) => {
  const [isXModalOpen, setIsXModalOpen] = React.useState(false);

  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-6 py-4 relative">
      {/* X Connection Modal */}
      {isXModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass max-w-sm w-full p-8 rounded-3xl border-2 border-blue-500/30 relative overflow-hidden shadow-2xl shadow-blue-600/20">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            <button
              onClick={() => setIsXModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400">
                <Twitter size={32} fill="currentColor" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Link Your X / Twitter</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                To link your X account, please DM our bot <span className="text-blue-400 font-bold">@bosibibai</span> with your wallet address:
              </p>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 font-mono text-xs text-blue-300 mb-8 select-all cursor-copy">
                link [your-address]
              </div>
              <button
                onClick={() => setIsXModalOpen(false)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white transition-all hover-lift active:scale-95"
              >
                GOT IT
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
          <Icons.BaseLogo />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
            OPENQUEST <span className="text-blue-500 text-sm font-mono tracking-normal">v1.2-ALPHA</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">Autonomous Onchain Quest Agent</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Social Links / Branding */}
        <div className="hidden lg:flex items-center gap-3 mr-4">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#050a14] bg-slate-800 flex items-center justify-center">
              <Twitter size={14} className="text-slate-400" />
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-[#050a14] bg-slate-800 flex items-center justify-center text-[10px] font-bold">
              F
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-[#050a14] bg-blue-900 flex items-center justify-center text-[10px] font-bold">
              OC
            </div>
          </div>
        </div>

        <button
          onClick={onOpenSubmit}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all border border-white/10 flex items-center gap-2"
        >
          <PlusCircle size={14} className="text-blue-400" /> SUBMIT PROJECT
        </button>

        {/* Unified Authentication */}
        <div className="flex items-center gap-2">
          {/* X Connection Button */}
          <button
            onClick={() => setIsXModalOpen(true)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 flex items-center justify-center transition-all group"
            title="Connect X"
          >
            <Twitter size={14} className="text-slate-400 group-hover:text-blue-400" />
          </button>

          {/* Farcaster Button (Neynar Integration) */}
          <div className="neynar-custom-button relative">
            <style dangerouslySetInnerHTML={{
              __html: `
              .neynar-custom-button button {
                position: relative !important;
                color: transparent !important;
              }
              .neynar-custom-button button::after {
                content: 'Sign in with Farcaster' !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                height: 100% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                color: white !important;
                font-weight: bold !important;
                font-size: 14px !important;
                pointer-events: none !important;
              }
            `}} />
            <NeynarAuthButton
              label="Sign in with Farcaster"
              variant="farcaster"
            />
          </div>

          {/* Wallet & Social (OnchainKit) */}
          <Wallet>
            <ConnectWallet className="!bg-blue-600 hover:!bg-blue-500 !text-white !rounded-lg !text-xs !font-bold !py-2 !px-4 !transition-all !shadow-lg !shadow-blue-600/20 !border-0 font-sans">
              CONNECT WALLET
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com">
                Wallet
              </WalletDropdownLink>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
      </div>
    </header>
  );
};

export default Header;
