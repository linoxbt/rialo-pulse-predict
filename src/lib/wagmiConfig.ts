import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, optimism, base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Predictix',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Get from https://cloud.walletconnect.com
  chains: [mainnet, polygon, arbitrum, optimism, base],
  ssr: false,
});
