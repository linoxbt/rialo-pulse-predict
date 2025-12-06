import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { CategoryTabs } from "@/components/markets/CategoryTabs";
import { MarketGrid } from "@/components/markets/MarketGrid";
import { StatsBar } from "@/components/markets/StatsBar";
import { mockMarkets } from "@/data/mockMarkets";
import { Category } from "@/types/market";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filteredMarkets = useMemo(() => {
    if (activeCategory === 'all') return mockMarkets;
    return mockMarkets.filter(market => market.category === activeCategory);
  }, [activeCategory]);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="mb-8">
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
      <MarketGrid markets={filteredMarkets} />
    </Layout>
  );
};

export default Index;
