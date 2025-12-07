import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PositionCardProps {
  position: {
    id: string;
    marketId: string;
    marketTitle: string;
    outcome: 'yes' | 'no';
    shares: number;
    avgPrice: number;
    currentPrice: number;
    pnl: number;
    pnlPercent: number;
  };
}

export function PositionCard({ position }: PositionCardProps) {
  const isProfit = position.pnl >= 0;

  return (
    <Link to={`/market/${position.marketId}`}>
      <div className="bg-card rounded-xl border border-border/50 p-5 hover:border-primary/30 transition-all card-gradient">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground leading-tight mb-2 line-clamp-2">
              {position.marketTitle}
            </h3>
            <div className={cn(
              "inline-flex items-center px-2 py-1 rounded text-xs font-semibold",
              position.outcome === 'yes' 
                ? "bg-success/20 text-success" 
                : "bg-danger/20 text-danger"
            )}>
              {position.outcome.toUpperCase()}
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold",
            isProfit ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
          )}>
            {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {isProfit ? '+' : ''}{position.pnlPercent.toFixed(1)}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Shares</p>
            <p className="font-semibold">{position.shares.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Avg Price</p>
            <p className="font-semibold">{(position.avgPrice * 100).toFixed(1)}¢</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current Price</p>
            <p className="font-semibold">{(position.currentPrice * 100).toFixed(1)}¢</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">P&L</p>
            <p className={cn("font-semibold", isProfit ? "text-success" : "text-danger")}>
              {isProfit ? '+' : ''}${position.pnl.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
