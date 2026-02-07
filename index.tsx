import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import App from './App';
import { config } from './wagmi';

import '@coinbase/onchainkit/styles.css';
import { AuthKitProvider } from '@farcaster/auth-kit';
import '@farcaster/auth-kit/styles.css';

const queryClient = new QueryClient();

const farcasterConfig = {
  rpcUrl: 'https://mainnet.optimism.io', // Farcaster is on Optimism
  domain: window.location.host,
  siweUri: `${window.location.origin}/login`,
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={import.meta.env.VITE_CDP_API_KEY}
          chain={base}
        >
          <AuthKitProvider config={farcasterConfig}>
            <App />
          </AuthKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
