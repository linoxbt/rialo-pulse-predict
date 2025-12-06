export interface Market {
  id: string;
  title: string;
  description: string;
  category: string;
  category_id?: string;
  imageUrl?: string;
  image_url?: string;
  endDate: string;
  end_date?: string;
  volume: number;
  total_volume?: number;
  liquidity: number;
  yesPrice: number;
  noPrice: number;
  outcomes: Outcome[];
  status: 'active' | 'resolved' | 'cancelled';
  resolution?: 'yes' | 'no';
  resolved_outcome?: string;
  createdAt: string;
  created_at?: string;
  creator_id?: string;
  resolution_source?: string;
}

export interface Outcome {
  id: string;
  name: string;
  price: number;
  change24h: number;
  total_shares?: number;
}

export interface Position {
  id: string;
  marketId: string;
  market_id?: string;
  marketTitle: string;
  outcome: 'yes' | 'no';
  outcome_id?: string;
  shares: number;
  avgPrice: number;
  avg_price?: number;
  currentPrice: number;
  current_value?: number;
  pnl: number;
  pnlPercent: number;
}

export interface Trade {
  id: string;
  marketId: string;
  market_id?: string;
  marketTitle: string;
  outcome: 'yes' | 'no';
  outcome_id?: string;
  type: 'buy' | 'sell';
  side?: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
  amount?: number;
  timestamp: string;
  created_at?: string;
  txHash: string;
  tx_hash?: string;
  status?: 'pending' | 'confirmed' | 'failed';
  user_id?: string;
}

export interface Profile {
  id: string;
  username?: string;
  avatar_url?: string;
  total_volume: number;
  total_profit: number;
  total_trades: number;
  wallet_address?: string;
  created_at: string;
  updated_at: string;
}

export interface PriceHistory {
  id: string;
  outcome_id: string;
  price: number;
  timestamp: string;
}

export interface CategoryDB {
  id: string;
  name: string;
  icon: string;
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
