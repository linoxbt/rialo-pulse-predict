import { useState } from "react";
import { Market } from "@/types/market";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "@/hooks/use-toast";
import { Wallet, ArrowRight } from "lucide-react";

interface TradingPanelProps {
  market: Market;
}

export function TradingPanel({ market }: TradingPanelProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState<string>('');
  const { isConnected, balance, connect } = useWallet();

  const price = selectedOutcome === 'yes' ? market.yesPrice : market.noPrice;
  const shares = amount ? parseFloat(amount) / price : 0;
  const potentialReturn = shares * 1; // Each share pays $1 if correct
  const potentialProfit = potentialReturn - parseFloat(amount || '0');

  const handleTrade = () => {
    if (!isConnected) {
      connect();
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to trade.",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(amount) > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough RIA tokens for this trade.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Trade submitted!",
      description: `Buying ${shares.toFixed(2)} ${selectedOutcome.toUpperCase()} shares for ${amount} RIA on Rialo Testnet.`,
    });
    setAmount('');
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 p-5 card-gradient sticky top-24">
      <h3 className="font-display font-semibold text-lg mb-4">Trade</h3>

      {/* Outcome Selection */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelectedOutcome('yes')}
          className={cn(
            "flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all",
            selectedOutcome === 'yes'
              ? "bg-success text-success-foreground shadow-lg"
              : "bg-success/10 text-success border border-success/30 hover:bg-success/20"
          )}
        >
          Yes {(market.yesPrice * 100).toFixed(0)}¢
        </button>
        <button
          onClick={() => setSelectedOutcome('no')}
          className={cn(
            "flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all",
            selectedOutcome === 'no'
              ? "bg-danger text-danger-foreground shadow-lg"
              : "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20"
          )}
        >
          No {(market.noPrice * 100).toFixed(0)}¢
        </button>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="text-sm text-muted-foreground mb-2 block">Amount (RIA)</label>
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="text-lg font-semibold"
        />
        {isConnected && (
          <p className="text-xs text-muted-foreground mt-1">
            Balance: {balance.toLocaleString()} RIA
          </p>
        )}
      </div>

      {/* Quick Amounts */}
      <div className="flex gap-2 mb-4">
        {[10, 50, 100, 250].map((val) => (
          <button
            key={val}
            onClick={() => setAmount(val.toString())}
            className="flex-1 py-1.5 text-xs font-medium rounded bg-secondary hover:bg-secondary/80 transition-colors"
          >
            {val}
          </button>
        ))}
      </div>

      {/* Trade Summary */}
      {amount && parseFloat(amount) > 0 && (
        <div className="bg-secondary/50 rounded-lg p-4 mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shares</span>
            <span className="font-medium">{shares.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Avg Price</span>
            <span className="font-medium">{(price * 100).toFixed(1)}¢</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-border/50">
            <span className="text-muted-foreground">Potential Return</span>
            <span className="font-semibold text-success">
              ${potentialReturn.toFixed(2)} (+{((potentialProfit / parseFloat(amount)) * 100).toFixed(0)}%)
            </span>
          </div>
        </div>
      )}

      {/* Trade Button */}
      <Button
        onClick={handleTrade}
        className="w-full"
        variant={selectedOutcome === 'yes' ? 'yesActive' : 'noActive'}
        size="lg"
      >
        {!isConnected ? (
          <>
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </>
        ) : (
          <>
            Buy {selectedOutcome.toUpperCase()}
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      {/* Testnet Notice */}
      <p className="text-xs text-muted-foreground text-center mt-3">
        Trading on Rialo Testnet • No real funds required
      </p>
    </div>
  );
}
