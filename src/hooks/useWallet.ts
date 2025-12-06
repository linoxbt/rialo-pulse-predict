import { useState, useCallback } from 'react';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
  network: string;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: 0,
    network: 'rialo-testnet'
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock wallet connection for testnet
    const mockAddress = '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    setWallet({
      isConnected: true,
      address: mockAddress,
      balance: 1000, // Mock RIA testnet tokens
      network: 'rialo-testnet'
    });
    
    setIsConnecting(false);
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      isConnected: false,
      address: null,
      balance: 0,
      network: 'rialo-testnet'
    });
  }, []);

  const formatAddress = useCallback((address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  return {
    ...wallet,
    isConnecting,
    connect,
    disconnect,
    formatAddress
  };
}
