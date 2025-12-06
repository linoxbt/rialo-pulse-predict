import { Market, Position, Trade } from "@/types/market";

export const mockMarkets: Market[] = [
  {
    id: "1",
    title: "Will Bitcoin reach $150K by end of 2025?",
    description: "This market will resolve to Yes if the price of Bitcoin (BTC) reaches or exceeds $150,000 USD on any major exchange before December 31, 2025 11:59 PM UTC.",
    category: "crypto",
    imageUrl: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    endDate: "2025-12-31",
    volume: 2450000,
    liquidity: 890000,
    yesPrice: 0.42,
    noPrice: 0.58,
    outcomes: [
      { id: "1-yes", name: "Yes", price: 0.42, change24h: 3.2 },
      { id: "1-no", name: "No", price: 0.58, change24h: -3.2 }
    ],
    status: "active",
    createdAt: "2024-06-15"
  },
  {
    id: "2",
    title: "Will Rialo mainnet launch in Q1 2026?",
    description: "This market resolves Yes if Rialo blockchain mainnet goes live before April 1, 2026.",
    category: "crypto",
    imageUrl: "",
    endDate: "2026-03-31",
    volume: 1250000,
    liquidity: 450000,
    yesPrice: 0.67,
    noPrice: 0.33,
    outcomes: [
      { id: "2-yes", name: "Yes", price: 0.67, change24h: 5.8 },
      { id: "2-no", name: "No", price: 0.33, change24h: -5.8 }
    ],
    status: "active",
    createdAt: "2024-09-01"
  },
  {
    id: "3",
    title: "Will AI pass the Turing Test by 2026?",
    description: "Resolves Yes if a publicly demonstrated AI system passes a standardized Turing Test judged by independent experts before January 1, 2027.",
    category: "tech",
    endDate: "2026-12-31",
    volume: 3200000,
    liquidity: 1200000,
    yesPrice: 0.55,
    noPrice: 0.45,
    outcomes: [
      { id: "3-yes", name: "Yes", price: 0.55, change24h: 1.2 },
      { id: "3-no", name: "No", price: 0.45, change24h: -1.2 }
    ],
    status: "active",
    createdAt: "2024-08-20"
  },
  {
    id: "4",
    title: "Fed rate cut in December 2025?",
    description: "Will the Federal Reserve cut interest rates at the December 2025 FOMC meeting?",
    category: "economics",
    endDate: "2025-12-18",
    volume: 5800000,
    liquidity: 2100000,
    yesPrice: 0.73,
    noPrice: 0.27,
    outcomes: [
      { id: "4-yes", name: "Yes", price: 0.73, change24h: 2.1 },
      { id: "4-no", name: "No", price: 0.27, change24h: -2.1 }
    ],
    status: "active",
    createdAt: "2024-10-01"
  },
  {
    id: "5",
    title: "SpaceX Starship orbital success in 2025?",
    description: "Will SpaceX achieve a fully successful Starship orbital flight including controlled ocean landing by end of 2025?",
    category: "science",
    endDate: "2025-12-31",
    volume: 1800000,
    liquidity: 650000,
    yesPrice: 0.81,
    noPrice: 0.19,
    outcomes: [
      { id: "5-yes", name: "Yes", price: 0.81, change24h: 0.5 },
      { id: "5-no", name: "No", price: 0.19, change24h: -0.5 }
    ],
    status: "active",
    createdAt: "2024-07-10"
  },
  {
    id: "6",
    title: "Ethereum ETF AUM over $50B by mid-2025?",
    description: "Will Ethereum spot ETFs have over $50 billion in total assets under management by July 1, 2025?",
    category: "crypto",
    endDate: "2025-07-01",
    volume: 4100000,
    liquidity: 1500000,
    yesPrice: 0.38,
    noPrice: 0.62,
    outcomes: [
      { id: "6-yes", name: "Yes", price: 0.38, change24h: -1.8 },
      { id: "6-no", name: "No", price: 0.62, change24h: 1.8 }
    ],
    status: "active",
    createdAt: "2024-09-15"
  },
  {
    id: "7",
    title: "Apple Vision Pro 2 release in 2025?",
    description: "Will Apple release a second-generation Vision Pro headset before December 31, 2025?",
    category: "tech",
    endDate: "2025-12-31",
    volume: 920000,
    liquidity: 340000,
    yesPrice: 0.45,
    noPrice: 0.55,
    outcomes: [
      { id: "7-yes", name: "Yes", price: 0.45, change24h: 4.2 },
      { id: "7-no", name: "No", price: 0.55, change24h: -4.2 }
    ],
    status: "active",
    createdAt: "2024-11-01"
  },
  {
    id: "8",
    title: "Will Taylor Swift tour in Asia 2025?",
    description: "Will Taylor Swift announce or perform tour dates in Asia during 2025?",
    category: "entertainment",
    endDate: "2025-12-31",
    volume: 680000,
    liquidity: 250000,
    yesPrice: 0.72,
    noPrice: 0.28,
    outcomes: [
      { id: "8-yes", name: "Yes", price: 0.72, change24h: 0.9 },
      { id: "8-no", name: "No", price: 0.28, change24h: -0.9 }
    ],
    status: "active",
    createdAt: "2024-10-20"
  }
];

export const mockPositions: Position[] = [
  {
    id: "pos-1",
    marketId: "1",
    marketTitle: "Will Bitcoin reach $150K by end of 2025?",
    outcome: "yes",
    shares: 150,
    avgPrice: 0.35,
    currentPrice: 0.42,
    pnl: 10.5,
    pnlPercent: 20
  },
  {
    id: "pos-2",
    marketId: "2",
    marketTitle: "Will Rialo mainnet launch in Q1 2026?",
    outcome: "yes",
    shares: 200,
    avgPrice: 0.55,
    currentPrice: 0.67,
    pnl: 24,
    pnlPercent: 21.8
  }
];

export const mockTrades: Trade[] = [
  {
    id: "t1",
    marketId: "1",
    marketTitle: "Will Bitcoin reach $150K by end of 2025?",
    outcome: "yes",
    type: "buy",
    shares: 100,
    price: 0.35,
    total: 35,
    timestamp: "2024-11-15T14:32:00Z",
    txHash: "0x8f3a...4b2c"
  },
  {
    id: "t2",
    marketId: "2",
    marketTitle: "Will Rialo mainnet launch in Q1 2026?",
    outcome: "yes",
    type: "buy",
    shares: 200,
    price: 0.55,
    total: 110,
    timestamp: "2024-11-20T09:15:00Z",
    txHash: "0x2c7f...9a1e"
  }
];
