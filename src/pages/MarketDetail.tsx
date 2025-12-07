import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { TradingPanel } from "@/components/trading/TradingPanel";
import { PriceChart } from "@/components/charts/PriceChart";
import { MarketComments } from "@/components/markets/MarketComments";
import { useMarket, usePriceHistory } from "@/hooks/useMarkets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Clock, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Share2,
  Bookmark
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(2)}M`;
  }
  if (volume >= 1000) {
    return `$${(volume / 1000).toFixed(1)}K`;
  }
  return `$${volume.toFixed(0)}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

export default function MarketDetail() {
  const { id } = useParams();
  const { data: market, isLoading, error } = useMarket(id || '');
  
  // Get price history for both outcomes
  const yesOutcome = market?.outcomes.find(o => o.name.toLowerCase() === 'yes');
  const noOutcome = market?.outcomes.find(o => o.name.toLowerCase() === 'no');
  
  const { data: yesHistory = [], isLoading: yesLoading } = usePriceHistory(yesOutcome?.id || '');
  const { data: noHistory = [], isLoading: noLoading } = usePriceHistory(noOutcome?.id || '');

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !market) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Market not found</h1>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Markets
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const yesChange = yesOutcome?.change24h || 0;
  const isPositive = yesChange >= 0;

  return (
    <Layout>
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Markets</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market Header */}
          <div className="bg-card rounded-xl border border-border/50 p-6 card-gradient">
            <div className="flex items-start gap-4 mb-4">
              {market.imageUrl ? (
                <img
                  src={market.imageUrl}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover bg-secondary"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {market.category}
                  </Badge>
                  <Badge variant="outline" className="text-primary border-primary/30">
                    {market.status === 'active' ? 'Active' : market.status}
                  </Badge>
                </div>
                <h1 className="font-display text-2xl font-bold mb-2">{market.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Ends {formatDate(market.endDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Watchlist
              </Button>
            </div>
          </div>

          {/* Price Chart */}
          <div className="bg-card rounded-xl border border-border/50 p-6 card-gradient">
            <h2 className="font-semibold mb-4">Price History</h2>
            
            {/* Current Prices */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-success/10 rounded-lg p-4 border border-success/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Yes</span>
                  <span className={cn(
                    "flex items-center gap-1 text-xs",
                    isPositive ? "text-success" : "text-danger"
                  )}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(yesChange).toFixed(1)}%
                  </span>
                </div>
                <span className="text-3xl font-bold text-success">
                  {(market.yesPrice * 100).toFixed(0)}¢
                </span>
              </div>
              <div className="bg-danger/10 rounded-lg p-4 border border-danger/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">No</span>
                  <span className={cn(
                    "flex items-center gap-1 text-xs",
                    !isPositive ? "text-success" : "text-danger"
                  )}>
                    {!isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(yesChange).toFixed(1)}%
                  </span>
                </div>
                <span className="text-3xl font-bold text-danger">
                  {(market.noPrice * 100).toFixed(0)}¢
                </span>
              </div>
            </div>

            {/* Chart with realtime updates */}
            <PriceChart 
              yesHistory={yesHistory} 
              noHistory={noHistory}
              yesOutcomeId={yesOutcome?.id}
              noOutcomeId={noOutcome?.id}
              isLoading={yesLoading || noLoading}
            />
          </div>

          {/* Description */}
          <div className="bg-card rounded-xl border border-border/50 p-6 card-gradient">
            <h2 className="font-semibold mb-4">Resolution Criteria</h2>
            <p className="text-muted-foreground leading-relaxed">
              {market.description}
            </p>
            {market.resolution_source && (
              <p className="text-sm text-muted-foreground mt-4">
                <span className="font-medium">Resolution source:</span> {market.resolution_source}
              </p>
            )}
          </div>

          {/* Market Stats */}
          <div className="bg-card rounded-xl border border-border/50 p-6 card-gradient">
            <h2 className="font-semibold mb-4">Market Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Volume</p>
                <p className="font-semibold">{formatVolume(market.volume)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Liquidity</p>
                <p className="font-semibold">{formatVolume(market.liquidity)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Created</p>
                <p className="font-semibold">{formatDate(market.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">End Date</p>
                <p className="font-semibold">{formatDate(market.endDate)}</p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <MarketComments marketId={market.id} />
        </div>

        {/* Trading Panel */}
        <div className="lg:col-span-1">
          <TradingPanel market={market} />
        </div>
      </div>
    </Layout>
  );
}
