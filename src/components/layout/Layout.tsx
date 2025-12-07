import { Header } from "./Header";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-6">{children}</main>
      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="container px-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-3 h-3"
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
            <span>Predictix — v1.0</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Docs</a>
            <span>•</span>
            <span>Decentralized Predictions</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
