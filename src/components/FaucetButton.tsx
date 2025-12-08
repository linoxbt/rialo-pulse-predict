import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Droplets, Loader2, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';

export function FaucetButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const { address, isConnected } = useAccount();

  const handleClaimFaucet = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate faucet claim - in production, this would call the Rialo faucet API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setClaimed(true);
      toast({
        title: "Faucet claimed!",
        description: "100 RIA has been sent to your wallet. It may take a few moments to arrive.",
      });

      // Reset after 24 hours (just visual, server should handle actual cooldown)
      setTimeout(() => setClaimed(false), 24 * 60 * 60 * 1000);
    } catch (error: any) {
      toast({
        title: "Claim failed",
        description: error.message || "Failed to claim from faucet. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClaimFaucet}
      disabled={isLoading || claimed}
      className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Claiming...
        </>
      ) : claimed ? (
        <>
          <Check className="w-4 h-4" />
          Claimed
        </>
      ) : (
        <>
          <Droplets className="w-4 h-4" />
          Daily Faucet
        </>
      )}
    </Button>
  );
}