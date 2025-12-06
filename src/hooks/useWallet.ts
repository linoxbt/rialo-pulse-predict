import { useState, useCallback, useEffect } from 'react';
import { generateWalletAddress, formatAddress as formatAddr } from '@/lib/blockchain';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
  network: string;
}

const STORAGE_KEY = 'rialo_wallet';

export function useWallet() {
  const { profile, updateProfile, isAuthenticated } = useAuth();
  const [wallet, setWallet] = useState<WalletState>(() => {
    // Try to restore from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Ignore parse errors
      }
    }
    return {
      isConnected: false,
      address: null,
      balance: 0,
      network: 'rialo-testnet'
    };
  });
  const [isConnecting, setIsConnecting] = useState(false);

  // Sync wallet state with localStorage
  useEffect(() => {
    if (wallet.isConnected) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [wallet]);

  // Update balance from profile
  useEffect(() => {
    if (profile?.wallet_address && wallet.address === profile.wallet_address) {
      // Could fetch balance from blockchain here
    }
  }, [profile, wallet.address]);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if user has existing wallet address in profile
    let walletAddress = profile?.wallet_address;
    
    if (!walletAddress) {
      // Generate new wallet address
      walletAddress = generateWalletAddress();
      
      // Save to profile if authenticated
      if (isAuthenticated) {
        await updateProfile({ wallet_address: walletAddress });
      }
    }
    
    const newWallet = {
      isConnected: true,
      address: walletAddress,
      balance: 1000, // Mock RIA testnet tokens
      network: 'rialo-testnet'
    };
    
    setWallet(newWallet);
    setIsConnecting(false);
    
    return newWallet;
  }, [profile, isAuthenticated, updateProfile]);

  const disconnect = useCallback(() => {
    setWallet({
      isConnected: false,
      address: null,
      balance: 0,
      network: 'rialo-testnet'
    });
  }, []);

  const updateBalance = useCallback((newBalance: number) => {
    setWallet(prev => ({
      ...prev,
      balance: newBalance
    }));
  }, []);

  const formatAddress = useCallback((address: string) => {
    return formatAddr(address);
  }, []);

  return {
    ...wallet,
    isConnecting,
    connect,
    disconnect,
    updateBalance,
    formatAddress
  };
}
