import { TrendingUp, Users, BarChart3, Zap } from "lucide-react";

interface StatItemProps {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  change?: string;
}

function StatItem({ icon: Icon, label, value, change }: StatItemProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/50">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{value}</span>
          {change && (
            <span className="text-xs text-success">{change}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <StatItem
        icon={BarChart3}
        label="Total Volume"
        value="$18.4M"
        change="+12.3%"
      />
      <StatItem
        icon={TrendingUp}
        label="Active Markets"
        value="142"
        change="+8"
      />
      <StatItem
        icon={Users}
        label="Traders"
        value="2,847"
        change="+156"
      />
      <StatItem
        icon={Zap}
        label="Trades (24h)"
        value="4,521"
      />
    </div>
  );
}
