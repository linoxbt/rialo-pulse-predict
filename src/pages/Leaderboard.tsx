import { Layout } from '@/components/layout/Layout';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Trophy, TrendingUp, BarChart3, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatAddress } from '@/lib/blockchain';
import { Skeleton } from '@/components/ui/skeleton';

function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(2)}M`;
  }
  if (volume >= 1000) {
    return `$${(volume / 1000).toFixed(1)}K`;
  }
  return `$${volume.toFixed(0)}`;
}

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useLeaderboard(50);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm text-muted-foreground">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 2:
        return 'bg-gray-400/10 border-gray-400/30';
      case 3:
        return 'bg-amber-600/10 border-amber-600/30';
      default:
        return 'bg-card border-border/50';
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-6 h-6 text-primary" />
          <h1 className="font-display text-3xl md:text-4xl font-bold">Leaderboard</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Top traders on RialoPredict ranked by profit
        </p>
      </div>

      {/* Top 3 Podium */}
      {!isLoading && leaderboard && leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Second Place */}
          <div className="bg-card rounded-xl border border-gray-400/30 p-6 text-center card-gradient order-1">
            <div className="w-16 h-16 rounded-full bg-gray-400/20 flex items-center justify-center mx-auto mb-3">
              <Medal className="w-8 h-8 text-gray-400" />
            </div>
            <p className="font-semibold truncate">
              {leaderboard[1]?.username || formatAddress(leaderboard[1]?.wallet_address || '0x...')}
            </p>
            <p className="text-success font-bold text-lg">
              +{formatVolume(leaderboard[1]?.total_profit || 0)}
            </p>
            <p className="text-xs text-muted-foreground">
              {leaderboard[1]?.total_trades || 0} trades
            </p>
          </div>

          {/* First Place */}
          <div className="bg-card rounded-xl border border-yellow-500/30 p-6 text-center card-gradient order-0 md:order-1 -mt-4">
            <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-10 h-10 text-yellow-500" />
            </div>
            <p className="font-semibold truncate text-lg">
              {leaderboard[0]?.username || formatAddress(leaderboard[0]?.wallet_address || '0x...')}
            </p>
            <p className="text-success font-bold text-2xl">
              +{formatVolume(leaderboard[0]?.total_profit || 0)}
            </p>
            <p className="text-sm text-muted-foreground">
              {leaderboard[0]?.total_trades || 0} trades
            </p>
          </div>

          {/* Third Place */}
          <div className="bg-card rounded-xl border border-amber-600/30 p-6 text-center card-gradient order-2">
            <div className="w-16 h-16 rounded-full bg-amber-600/20 flex items-center justify-center mx-auto mb-3">
              <Medal className="w-8 h-8 text-amber-600" />
            </div>
            <p className="font-semibold truncate">
              {leaderboard[2]?.username || formatAddress(leaderboard[2]?.wallet_address || '0x...')}
            </p>
            <p className="text-success font-bold text-lg">
              +{formatVolume(leaderboard[2]?.total_profit || 0)}
            </p>
            <p className="text-xs text-muted-foreground">
              {leaderboard[2]?.total_trades || 0} trades
            </p>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden card-gradient">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border/50 text-sm font-medium text-muted-foreground">
          <div className="col-span-1">Rank</div>
          <div className="col-span-4">Trader</div>
          <div className="col-span-2 text-right">Volume</div>
          <div className="col-span-2 text-right">Profit</div>
          <div className="col-span-2 text-right">Trades</div>
          <div className="col-span-1 text-right">Win Rate</div>
        </div>

        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : leaderboard && leaderboard.length > 0 ? (
          <div className="divide-y divide-border/30">
            {leaderboard.map((trader) => (
              <div 
                key={trader.id}
                className={cn(
                  "grid grid-cols-12 gap-4 p-4 items-center hover:bg-secondary/30 transition-colors",
                  getRankStyle(trader.rank)
                )}
              >
                <div className="col-span-1">
                  {getRankIcon(trader.rank)}
                </div>
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {(trader.username || 'A')[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {trader.username || formatAddress(trader.wallet_address || '0x0000')}
                    </p>
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <BarChart3 className="w-3 h-3 text-muted-foreground" />
                    <span>{formatVolume(trader.total_volume)}</span>
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <span className={cn(
                    "font-semibold",
                    trader.total_profit >= 0 ? "text-success" : "text-danger"
                  )}>
                    {trader.total_profit >= 0 ? '+' : ''}{formatVolume(trader.total_profit)}
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  {trader.total_trades}
                </div>
                <div className="col-span-1 text-right">
                  <span className={cn(
                    "text-sm",
                    (trader.winRate || 0) >= 50 ? "text-success" : "text-muted-foreground"
                  )}>
                    {(trader.winRate || 0).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No traders yet. Be the first to trade!</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
