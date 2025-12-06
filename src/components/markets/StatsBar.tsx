import { TrendingUp, Users, BarChart3, Zap } from "lucide-react";
import { useMarketStats } from "@/hooks/useMarkets";
import { Skeleton } from "@/components/ui/skeleton";

interface StatItemProps {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  change?: string;
  isLoading?: boolean;
}

function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(1)}M`;
  }
  if (volume >= 1000) {
    return `$${(volume / 1000).toFixed(0)}K`;
  }
  return `$${volume.toFixed(0)}`;
}

function StatItem({ icon: Icon, label, value, change, isLoading }: StatItemProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/50">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="h-5 w-16" />
          ) : (
            <>
              <span className="font-semibold">{value}</span>
              {change && <span className="text-xs text-success">{change}</span>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function StatsBar() {
  const { data: stats, isLoading } = useMarketStats();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <StatItem
        icon={BarChart3}
        label="Total Volume"
        value={formatVolume(stats?.totalVolume || 0)}
        isLoading={isLoading}
      />
      <StatItem
        icon={TrendingUp}
        label="Active Markets"
        value={String(stats?.activeMarkets || 0)}
        isLoading={isLoading}
      />
      <StatItem
        icon={Users}
        label="Traders"
        value={String(stats?.traders || 0)}
        isLoading={isLoading}
      />
      <StatItem
        icon={Zap}
        label="Trades (24h)"
        value={String(stats?.trades24h || 0)}
        isLoading={isLoading}
      />
    </div>
  );
}
