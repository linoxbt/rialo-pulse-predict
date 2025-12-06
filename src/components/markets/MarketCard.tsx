import { Link } from "react-router-dom";
import { Market } from "@/types/market";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketCardProps {
  market: Market;
}

function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(1)}M`;
  }
  if (volume >= 1000) {
    return `$${(volume / 1000).toFixed(0)}K`;
  }
  return `$${volume}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function MarketCard({ market }: MarketCardProps) {
  const yesChange = market.outcomes[0]?.change24h || 0;
  const isPositive = yesChange >= 0;

  return (
    <Link to={`/market/${market.id}`}>
      <div className="group bg-card rounded-xl border border-border/50 p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300 card-gradient">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {market.imageUrl ? (
            <img
              src={market.imageUrl}
              alt=""
              className="w-12 h-12 rounded-lg object-cover bg-secondary"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
              {market.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="capitalize">
                {market.category}
              </Badge>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(market.endDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Price Bars */}
        <div className="space-y-3 mb-4">
          {/* Yes Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Yes</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-success">{(market.yesPrice * 100).toFixed(0)}¢</span>
                <span className={cn(
                  "flex items-center gap-0.5 text-xs",
                  isPositive ? "text-success" : "text-danger"
                )}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(yesChange).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-success rounded-full transition-all duration-500"
                style={{ width: `${market.yesPrice * 100}%` }}
              />
            </div>
          </div>

          {/* No Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">No</span>
              <span className="font-semibold text-danger">{(market.noPrice * 100).toFixed(0)}¢</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-danger rounded-full transition-all duration-500"
                style={{ width: `${market.noPrice * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="yes" className="flex-1" size="sm">
            Buy Yes
          </Button>
          <Button variant="no" className="flex-1" size="sm">
            Buy No
          </Button>
        </div>

        {/* Volume */}
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            {formatVolume(market.volume)} Vol
          </span>
          <span>{formatVolume(market.liquidity)} Liq</span>
        </div>
      </div>
    </Link>
  );
}
