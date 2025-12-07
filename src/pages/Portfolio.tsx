import { Layout } from "@/components/layout/Layout";
import { PositionCard } from "@/components/portfolio/PositionCard";
import { TradeHistory } from "@/components/portfolio/TradeHistory";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { useUserPositions, useUserTrades } from "@/hooks/useTrading";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, TrendingUp, TrendingDown, History, PieChart, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function Portfolio() {
  const { isConnected, balance, connect } = useWallet();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const { data: positions = [], isLoading: positionsLoading } = useUserPositions(user?.id);
  const { data: trades = [], isLoading: tradesLoading } = useUserTrades(user?.id);

  const totalValue = positions.reduce((sum, pos) => sum + (pos.shares * pos.currentPrice), 0);
  const totalPnl = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const pnlPercent = totalValue > 0 ? (totalPnl / (totalValue - totalPnl)) * 100 : 0;
  const isProfitable = totalPnl >= 0;

  if (authLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
            <LogIn className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Sign In Required</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Sign in to view your portfolio, track positions, and see your trading history.
          </p>
          <Link to="/auth">
            <Button variant="wallet" size="lg">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (!isConnected) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
            <Wallet className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Connect your wallet to view your portfolio, track positions, and see your trading history.
          </p>
          <Button variant="wallet" size="lg" onClick={connect}>
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Portfolio</h1>
        <p className="text-muted-foreground">Track your positions and trading activity</p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border/50 p-6 card-gradient">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Available Balance</span>
          </div>
          <p className="text-3xl font-bold">{balance.toLocaleString()} RIA</p>
        </div>
        
        <div className="bg-card rounded-xl border border-border/50 p-6 card-gradient">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <PieChart className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Portfolio Value</span>
          </div>
          <p className="text-3xl font-bold">${totalValue.toFixed(2)}</p>
        </div>
        
        <div className="bg-card rounded-xl border border-border/50 p-6 card-gradient">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isProfitable ? 'bg-success/10' : 'bg-danger/10'}`}>
              {isProfitable ? (
                <TrendingUp className="w-5 h-5 text-success" />
              ) : (
                <TrendingDown className="w-5 h-5 text-danger" />
              )}
            </div>
            <span className="text-sm text-muted-foreground">Total P&L</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className={`text-3xl font-bold ${isProfitable ? 'text-success' : 'text-danger'}`}>
              {isProfitable ? '+' : ''}${totalPnl.toFixed(2)}
            </p>
            {totalValue > 0 && (
              <span className={`text-sm ${isProfitable ? 'text-success' : 'text-danger'}`}>
                {isProfitable ? '+' : ''}{pnlPercent.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="positions" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="positions" className="gap-2">
            <PieChart className="w-4 h-4" />
            Positions
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="positions">
          {positionsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          ) : positions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No open positions yet</p>
              <Link to="/" className="text-primary hover:underline text-sm mt-2 inline-block">
                Browse markets to start trading
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {positions.map((position) => (
                <PositionCard key={position.id} position={position} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          {tradesLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          ) : (
            <TradeHistory trades={trades} />
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
