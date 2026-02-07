import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';

export const config = createConfig({
    chains: [base],
    connectors: [
        injected(),
        coinbaseWallet({
            appName: 'OpenQuest',
        }),
    ],
    transports: {
        [base.id]: http(),
    },
});
