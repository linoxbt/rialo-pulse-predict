export interface Market {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  endDate: string;
  volume: number;
  liquidity: number;
  yesPrice: number;
  noPrice: number;
  outcomes: Outcome[];
  status: 'active' | 'resolved' | 'pending';
  resolution?: 'yes' | 'no';
  createdAt: string;
}

export interface Outcome {
  id: string;
  name: string;
  price: number;
  change24h: number;
}

export interface Position {
  marketId: string;
  marketTitle: string;
  outcome: 'yes' | 'no';
  shares: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

export interface Trade {
  id: string;
  marketId: string;
  marketTitle: string;
  outcome: 'yes' | 'no';
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
  timestamp: string;
  txHash: string;
}

export type Category = 
  | 'all'
  | 'crypto'
  | 'politics'
  | 'sports'
  | 'entertainment'
  | 'tech'
  | 'science'
  | 'economics';
