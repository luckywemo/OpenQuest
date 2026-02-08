import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'viem/chains';
import App from './App';

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
  </React.StrictMode>
);
