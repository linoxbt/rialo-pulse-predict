import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useCallback } from 'react';
import { formatUnits } from 'viem';

export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  const connect = useCallback(() => {
    openConnectModal?.();
  }, [openConnectModal]);

  const formatAddress = useCallback((addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  const balance = balanceData ? Number(formatUnits(balanceData.value, balanceData.decimals)) : 0;

  return {
    isConnected,
    isConnecting,
    address: address || null,
    balance,
    balanceSymbol: balanceData?.symbol || 'ETH',
    connect,
    disconnect,
    formatAddress,
  };
}
