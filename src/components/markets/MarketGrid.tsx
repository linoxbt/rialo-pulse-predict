import { Market } from "@/types/market";
import { MarketCard } from "./MarketCard";

interface MarketGridProps {
  markets: Market[];
}

export function MarketGrid({ markets }: MarketGridProps) {
  if (markets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <span className="text-3xl">🔮</span>
        </div>
        <h3 className="font-semibold text-lg mb-2">No markets found</h3>
        <p className="text-muted-foreground text-sm">
          Try selecting a different category or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {markets.map((market, index) => (
        <div 
          key={market.id} 
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <MarketCard market={market} />
        </div>
      ))}
    </div>
  );
}
