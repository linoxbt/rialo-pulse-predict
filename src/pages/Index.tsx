import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { CategoryTabs } from "@/components/markets/CategoryTabs";
import { MarketGrid } from "@/components/markets/MarketGrid";
import { StatsBar } from "@/components/markets/StatsBar";
import { useMarkets } from "@/hooks/useMarkets";
import { Category } from "@/types/market";
import { Sparkles, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const { data: markets, isLoading } = useMarkets(activeCategory);

  const filteredMarkets = useMemo(() => {
    if (!markets) return [];
    if (activeCategory === 'all') return markets;
    return markets.filter(market => market.category === activeCategory);
  }, [activeCategory, markets]);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Rialo Testnet</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Prediction Markets
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Trade on real-world events with Rialo's event-driven blockchain. 
            Fast, transparent, and decentralized.
          </p>
        </div>
        <Link to="/create">
          <Button variant="wallet" className="hidden md:flex gap-2">
            <Plus className="w-4 h-4" />
            Create Market
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Categories */}
      <div className="mb-6">
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* Markets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : (
        <MarketGrid markets={filteredMarkets} />
      )}
    </Layout>
  );
};

export default Index;
