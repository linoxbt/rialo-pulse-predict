-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create markets table
CREATE TABLE public.markets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  resolution_source TEXT NOT NULL,
  total_volume DECIMAL(20, 8) NOT NULL DEFAULT 0,
  liquidity DECIMAL(20, 8) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'cancelled')),
  resolved_outcome TEXT,
  creator_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create market outcomes table
CREATE TABLE public.market_outcomes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id UUID NOT NULL REFERENCES public.markets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 4) NOT NULL DEFAULT 0.5,
  total_shares DECIMAL(20, 8) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  total_volume DECIMAL(20, 8) NOT NULL DEFAULT 0,
  total_profit DECIMAL(20, 8) NOT NULL DEFAULT 0,
  total_trades INTEGER NOT NULL DEFAULT 0,
  wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create positions table
CREATE TABLE public.positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  market_id UUID NOT NULL REFERENCES public.markets(id) ON DELETE CASCADE,
  outcome_id UUID NOT NULL REFERENCES public.market_outcomes(id) ON DELETE CASCADE,
  shares DECIMAL(20, 8) NOT NULL,
  avg_price DECIMAL(10, 4) NOT NULL,
  current_value DECIMAL(20, 8) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, outcome_id)
);

-- Create trades table
CREATE TABLE public.trades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  market_id UUID NOT NULL REFERENCES public.markets(id) ON DELETE CASCADE,
  outcome_id UUID NOT NULL REFERENCES public.market_outcomes(id) ON DELETE CASCADE,
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  shares DECIMAL(20, 8) NOT NULL,
  price DECIMAL(10, 4) NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  tx_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create price history table for charts
CREATE TABLE public.price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  outcome_id UUID NOT NULL REFERENCES public.market_outcomes(id) ON DELETE CASCADE,
  price DECIMAL(10, 4) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table for markets
CREATE TABLE public.market_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id UUID NOT NULL REFERENCES public.markets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_comments ENABLE ROW LEVEL SECURITY;

-- Categories are public read
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Markets are public read
CREATE POLICY "Markets are viewable by everyone" ON public.markets FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create markets" ON public.markets FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Market creators can update their markets" ON public.markets FOR UPDATE TO authenticated USING (auth.uid() = creator_id);

-- Market outcomes are public read
CREATE POLICY "Outcomes are viewable by everyone" ON public.market_outcomes FOR SELECT USING (true);
CREATE POLICY "Outcomes can be inserted" ON public.market_outcomes FOR INSERT WITH CHECK (true);
CREATE POLICY "Outcomes can be updated" ON public.market_outcomes FOR UPDATE USING (true);

-- Profiles are public read, owners can update
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Positions - users see their own, can manage their own
CREATE POLICY "Users can view their own positions" ON public.positions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own positions" ON public.positions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own positions" ON public.positions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own positions" ON public.positions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trades - public read for transparency, users create their own
CREATE POLICY "Trades are viewable by everyone" ON public.trades FOR SELECT USING (true);
CREATE POLICY "Users can create their own trades" ON public.trades FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own trades" ON public.trades FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Price history is public read
CREATE POLICY "Price history is viewable by everyone" ON public.price_history FOR SELECT USING (true);
CREATE POLICY "Price history can be inserted" ON public.price_history FOR INSERT WITH CHECK (true);

-- Comments - public read, authenticated write
CREATE POLICY "Comments are viewable by everyone" ON public.market_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.market_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.market_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_markets_updated_at BEFORE UPDATE ON public.markets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON public.positions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data ->> 'username');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default categories
INSERT INTO public.categories (name, icon) VALUES
  ('Politics', '🏛️'),
  ('Crypto', '₿'),
  ('Sports', '⚽'),
  ('Entertainment', '🎬'),
  ('Science', '🔬'),
  ('Economics', '📈');

-- Enable realtime for trades and positions
ALTER PUBLICATION supabase_realtime ADD TABLE public.trades;
ALTER PUBLICATION supabase_realtime ADD TABLE public.positions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.price_history;