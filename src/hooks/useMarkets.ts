import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Market, Outcome, PriceHistory, CategoryDB } from '@/types/market';

// Transform database market to frontend market
function transformMarket(dbMarket: any, outcomes: any[]): Market {
  const yesOutcome = outcomes.find(o => o.name.toLowerCase() === 'yes');
  const noOutcome = outcomes.find(o => o.name.toLowerCase() === 'no');
  
  return {
    id: dbMarket.id,
    title: dbMarket.title,
    description: dbMarket.description,
    category: dbMarket.categories?.name?.toLowerCase() || 'other',
    category_id: dbMarket.category_id,
    imageUrl: dbMarket.image_url,
    image_url: dbMarket.image_url,
    endDate: dbMarket.end_date,
    end_date: dbMarket.end_date,
    volume: Number(dbMarket.total_volume) || 0,
    total_volume: Number(dbMarket.total_volume) || 0,
    liquidity: Number(dbMarket.liquidity) || 0,
    yesPrice: yesOutcome ? Number(yesOutcome.price) : 0.5,
    noPrice: noOutcome ? Number(noOutcome.price) : 0.5,
    outcomes: outcomes.map(o => ({
      id: o.id,
      name: o.name,
      price: Number(o.price),
      change24h: 0, // Would calculate from price history
      total_shares: Number(o.total_shares) || 0
    })),
    status: dbMarket.status,
    resolved_outcome: dbMarket.resolved_outcome,
    createdAt: dbMarket.created_at,
    created_at: dbMarket.created_at,
    creator_id: dbMarket.creator_id,
    resolution_source: dbMarket.resolution_source
  };
}

export function useMarkets(categoryFilter?: string) {
  return useQuery({
    queryKey: ['markets', categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('markets')
        .select(`
          *,
          categories (id, name, icon),
          market_outcomes (*)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (categoryFilter && categoryFilter !== 'all') {
        query = query.eq('categories.name', categoryFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(market => 
        transformMarket(market, market.market_outcomes || [])
      );
    }
  });
}

export function useMarket(id: string) {
  return useQuery({
    queryKey: ['market', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('markets')
        .select(`
          *,
          categories (id, name, icon),
          market_outcomes (*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return transformMarket(data, data.market_outcomes || []);
    },
    enabled: !!id
  });
}

export function usePriceHistory(outcomeId: string) {
  return useQuery({
    queryKey: ['priceHistory', outcomeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('price_history')
        .select('*')
        .eq('outcome_id', outcomeId)
        .order('timestamp', { ascending: true })
        .limit(100);

      if (error) throw error;
      return data as PriceHistory[];
    },
    enabled: !!outcomeId
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as CategoryDB[];
    }
  });
}

export function useCreateMarket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (marketData: {
      title: string;
      description: string;
      category_id: string;
      end_date: string;
      resolution_source: string;
      image_url?: string;
      creator_id: string;
      initialLiquidity: number;
    }) => {
      // Create market
      const { data: market, error: marketError } = await supabase
        .from('markets')
        .insert({
          title: marketData.title,
          description: marketData.description,
          category_id: marketData.category_id,
          end_date: marketData.end_date,
          resolution_source: marketData.resolution_source,
          image_url: marketData.image_url,
          creator_id: marketData.creator_id,
          liquidity: marketData.initialLiquidity,
          total_volume: 0
        })
        .select()
        .single();

      if (marketError) throw marketError;

      // Create Yes/No outcomes
      const { error: outcomesError } = await supabase
        .from('market_outcomes')
        .insert([
          { market_id: market.id, name: 'Yes', price: 0.5, total_shares: 0 },
          { market_id: market.id, name: 'No', price: 0.5, total_shares: 0 }
        ]);

      if (outcomesError) throw outcomesError;

      return market;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
    }
  });
}

export function useMarketStats() {
  return useQuery({
    queryKey: ['marketStats'],
    queryFn: async () => {
      // Get total volume
      const { data: markets } = await supabase
        .from('markets')
        .select('total_volume');

      const totalVolume = markets?.reduce((sum, m) => sum + Number(m.total_volume || 0), 0) || 0;

      // Get active markets count
      const { count: activeMarkets } = await supabase
        .from('markets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get traders count
      const { count: traders } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get 24h trades
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { count: trades24h } = await supabase
        .from('trades')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday.toISOString());

      return {
        totalVolume,
        activeMarkets: activeMarkets || 0,
        traders: traders || 0,
        trades24h: trades24h || 0
      };
    }
  });
}
