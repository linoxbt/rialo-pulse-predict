import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { PriceHistory } from '@/types/market';

interface PriceChartProps {
  yesHistory: PriceHistory[];
  noHistory: PriceHistory[];
  isLoading?: boolean;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function PriceChart({ yesHistory, noHistory, isLoading }: PriceChartProps) {
  const chartData = useMemo(() => {
    // Combine yes and no price history into a single array
    const allPoints = new Map<string, { timestamp: string; yesPrice?: number; noPrice?: number }>();
    
    yesHistory.forEach((point) => {
      const key = point.timestamp;
      if (!allPoints.has(key)) {
        allPoints.set(key, { timestamp: key, yesPrice: Number(point.price) * 100 });
      } else {
        allPoints.get(key)!.yesPrice = Number(point.price) * 100;
      }
    });

    noHistory.forEach((point) => {
      const key = point.timestamp;
      if (!allPoints.has(key)) {
        allPoints.set(key, { timestamp: key, noPrice: Number(point.price) * 100 });
      } else {
        allPoints.get(key)!.noPrice = Number(point.price) * 100;
      }
    });

    // Sort by timestamp and fill gaps
    const sorted = Array.from(allPoints.values())
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Fill missing values with previous value
    let lastYes = 50;
    let lastNo = 50;
    return sorted.map((point) => {
      if (point.yesPrice !== undefined) lastYes = point.yesPrice;
      if (point.noPrice !== undefined) lastNo = point.noPrice;
      return {
        ...point,
        yesPrice: point.yesPrice ?? lastYes,
        noPrice: point.noPrice ?? lastNo,
        time: formatTime(point.timestamp),
      };
    });
  }, [yesHistory, noHistory]);

  // Generate mock data if no history exists
  const displayData = useMemo(() => {
    if (chartData.length > 0) return chartData;

    // Generate sample data points for visualization
    const now = new Date();
    return Array.from({ length: 24 }, (_, i) => {
      const time = new Date(now.getTime() - (23 - i) * 3600000);
      const yesBase = 50 + Math.sin(i * 0.3) * 10 + Math.random() * 5;
      return {
        timestamp: time.toISOString(),
        time: formatTime(time.toISOString()),
        yesPrice: Math.max(1, Math.min(99, yesBase)),
        noPrice: Math.max(1, Math.min(99, 100 - yesBase)),
      };
    });
  }, [chartData]);

  if (isLoading) {
    return (
      <div className="h-64 bg-secondary/30 rounded-lg flex items-center justify-center border border-border/50 animate-pulse">
        <span className="text-muted-foreground text-sm">Loading chart...</span>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={displayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="yesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="noGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--danger))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--danger))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickFormatter={(value) => `${value}¢`}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
            itemStyle={{ padding: '2px 0' }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)}¢`,
              name === 'yesPrice' ? 'Yes' : 'No',
            ]}
          />
          <Area
            type="monotone"
            dataKey="yesPrice"
            stroke="hsl(var(--success))"
            strokeWidth={2}
            fill="url(#yesGradient)"
            dot={false}
            activeDot={{ r: 4, fill: 'hsl(var(--success))' }}
          />
          <Area
            type="monotone"
            dataKey="noPrice"
            stroke="hsl(var(--danger))"
            strokeWidth={2}
            fill="url(#noGradient)"
            dot={false}
            activeDot={{ r: 4, fill: 'hsl(var(--danger))' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
