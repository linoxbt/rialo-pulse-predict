import { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-6 md:py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground text-xs">R</span>
              </div>
              <span className="text-sm text-muted-foreground">
                RialoPredict — Testnet v0.1
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="https://rialo.io" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                Rialo.io
              </a>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>Built on Rialo Blockchain</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
