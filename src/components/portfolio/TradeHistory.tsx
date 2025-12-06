import { Trade } from "@/types/market";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface TradeHistoryProps {
  trades: Trade[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function TradeHistory({ trades }: TradeHistoryProps) {
  if (trades.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No trades yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {trades.map((trade) => (
        <div 
          key={trade.id}
          className="bg-card rounded-lg border border-border/50 p-4 hover:border-primary/30 transition-all"
        >
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm line-clamp-1">{trade.marketTitle}</p>
              <p className="text-xs text-muted-foreground">{formatDate(trade.timestamp)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-2 py-0.5 rounded text-xs font-semibold",
                trade.type === 'buy' ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
              )}>
                {trade.type.toUpperCase()}
              </span>
              <span className={cn(
                "px-2 py-0.5 rounded text-xs font-semibold",
                trade.outcome === 'yes' ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
              )}>
                {trade.outcome.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                {trade.shares} shares @ {(trade.price * 100).toFixed(1)}¢
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">${trade.total.toFixed(2)}</span>
              <a 
                href={`https://testnet.rialo.io/tx/${trade.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
