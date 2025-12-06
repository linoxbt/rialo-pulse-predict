import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  Menu, 
  X, 
  TrendingUp, 
  LayoutGrid, 
  User,
  Trophy,
  Plus,
  LogOut
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Markets", icon: LayoutGrid },
  { path: "/portfolio", label: "Portfolio", icon: TrendingUp },
  { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isConnected, address, balance, isConnecting, connect, disconnect, formatAddress } = useWallet();
  const { isAuthenticated, signOut, profile } = useAuth();
  const location = useLocation();

  const handleDisconnect = async () => {
    disconnect();
    if (isAuthenticated) {
      await signOut();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transform group-hover:scale-105 transition-transform">
            <span className="font-display font-bold text-primary-foreground text-lg">R</span>
          </div>
          <span className="font-display font-bold text-xl hidden sm:block">
            Rialo<span className="text-primary">Predict</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                location.pathname === item.path
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Wallet & Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <Link to="/create" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Create
              </Button>
            </Link>
          )}

          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs text-muted-foreground">
                  {profile?.username || 'Testnet'}
                </span>
                <span className="text-sm font-semibold">{balance.toLocaleString()} RIA</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="gap-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{formatAddress(address!)}</span>
              </Button>
            </div>
          ) : isAuthenticated ? (
            <Button
              variant="wallet"
              size="sm"
              onClick={connect}
              disabled={isConnecting}
              className="gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </span>
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="wallet" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background animate-slide-up">
          <nav className="container flex flex-col p-4 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  location.pathname === item.path
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/create"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              >
                <Plus className="w-5 h-5" />
                Create Market
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
