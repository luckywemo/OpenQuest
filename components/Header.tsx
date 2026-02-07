import React from 'react';
import { Icons } from '../constants';
import { Twitter, MessageSquare, ExternalLink, PlusCircle } from 'lucide-react';
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
          {/* Farcaster Button (Neynar Integration) */}
          <button className="px-4 py-2 bg-[#855DCD] hover:bg-[#744ebc] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2">
            SIGN IN WITH FARCASTER
          </button>

          {/* Wallet & Social (OnchainKit) */}
          <Wallet>
            <ConnectWallet className="!bg-blue-600 hover:!bg-blue-500 !text-white !rounded-lg !text-xs !font-bold !py-2 !px-4 !transition-all !shadow-lg !shadow-blue-600/20 !border-0 font-sans">
              CONNECT WALLET / X
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
