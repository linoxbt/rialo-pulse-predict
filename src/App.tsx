import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/providers/Web3Provider";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import MarketDetail from "./pages/MarketDetail";
import Auth from "./pages/Auth";
import CreateMarket from "./pages/CreateMarket";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";

const App = () => (
  <Web3Provider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/market/:id" element={<MarketDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/create" element={<CreateMarket />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Web3Provider>
);

export default App;
