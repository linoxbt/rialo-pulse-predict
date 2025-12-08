import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Define Rialo Testnet chain
export const rialoTestnet = defineChain({
  id: 1992,
  name: 'Rialo Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Rialo',
    symbol: 'RIA',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.rialo.network'],
    },
  },
  blockExplorers: {
    default: { name: 'Rialo Explorer', url: 'https://testnet-explorer.rialo.network' },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'Predictix',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Get from https://cloud.walletconnect.com
  chains: [rialoTestnet],
  ssr: false,
});
