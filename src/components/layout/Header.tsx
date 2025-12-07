import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { 
  Menu, 
  X, 
  TrendingUp, 
  LayoutGrid, 
  Trophy,
  Plus
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Markets", icon: LayoutGrid },
  { path: "/portfolio", label: "Portfolio", icon: TrendingUp },
  { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" className="fill-primary-foreground/20" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-display font-bold text-xl hidden sm:block">
            Predict<span className="text-primary">ix</span>
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

          {/* RainbowKit Connect Button */}
          <ConnectButton 
            chainStatus="icon"
            showBalance={false}
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
          />

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
