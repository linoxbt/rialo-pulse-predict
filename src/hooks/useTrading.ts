import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { buyShares, sellShares, generateTxHash } from '@/lib/blockchain';
import { Trade, Position } from '@/types/market';

export function useUserPositions(userId?: string) {
  return useQuery({
    queryKey: ['positions', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('positions')
        .select(`
          *,
          markets (id, title),
          market_outcomes (id, name, price)
        `)
        .eq('user_id', userId);

      if (error) throw error;

      return (data || []).map(pos => ({
        id: pos.id,
        marketId: pos.market_id,
        market_id: pos.market_id,
        marketTitle: pos.markets?.title || '',
        outcome: pos.market_outcomes?.name?.toLowerCase() as 'yes' | 'no',
        outcome_id: pos.outcome_id,
        shares: Number(pos.shares),
        avgPrice: Number(pos.avg_price),
        avg_price: Number(pos.avg_price),
        currentPrice: Number(pos.market_outcomes?.price || pos.avg_price),
        current_value: Number(pos.current_value),
        pnl: (Number(pos.market_outcomes?.price || pos.avg_price) - Number(pos.avg_price)) * Number(pos.shares),
        pnlPercent: ((Number(pos.market_outcomes?.price || pos.avg_price) - Number(pos.avg_price)) / Number(pos.avg_price)) * 100
      })) as Position[];
    },
    enabled: !!userId
  });
}

export function useUserTrades(userId?: string) {
  return useQuery({
    queryKey: ['trades', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('trades')
        .select(`
          *,
          markets (id, title),
          market_outcomes (id, name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return (data || []).map(trade => ({
        id: trade.id,
        marketId: trade.market_id,
        market_id: trade.market_id,
        marketTitle: trade.markets?.title || '',
        outcome: trade.market_outcomes?.name?.toLowerCase() as 'yes' | 'no',
        outcome_id: trade.outcome_id,
        type: trade.side as 'buy' | 'sell',
        side: trade.side,
        shares: Number(trade.shares),
        price: Number(trade.price),
        total: Number(trade.amount),
        amount: Number(trade.amount),
        timestamp: trade.created_at,
        created_at: trade.created_at,
        txHash: trade.tx_hash || '',
        tx_hash: trade.tx_hash,
        status: trade.status,
        user_id: trade.user_id
      })) as Trade[];
    },
    enabled: !!userId
  });
}

export function useExecuteTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tradeData: {
      userId: string;
      walletAddress: string;
      marketId: string;
      outcomeId: string;
      outcomeName: string;
      side: 'buy' | 'sell';
      amount: number;
      price: number;
      shares: number;
    }) => {
      // Execute blockchain transaction
      let txResult;
      if (tradeData.side === 'buy') {
        txResult = await buyShares(
          tradeData.walletAddress,
          tradeData.marketId,
          tradeData.outcomeId,
          tradeData.amount,
          tradeData.price
        );
      } else {
        txResult = await sellShares(
          tradeData.walletAddress,
          tradeData.marketId,
          tradeData.outcomeId,
          tradeData.shares,
          tradeData.price
        );
      }

      if (!txResult.success) {
        throw new Error(txResult.error || 'Transaction failed');
      }

      // Record trade in database
      const { data: trade, error: tradeError } = await supabase
        .from('trades')
        .insert({
          user_id: tradeData.userId,
          market_id: tradeData.marketId,
          outcome_id: tradeData.outcomeId,
          side: tradeData.side,
          shares: tradeData.shares,
          price: tradeData.price,
          amount: tradeData.amount,
          tx_hash: txResult.txHash,
          status: 'confirmed'
        })
        .select()
        .single();

      if (tradeError) throw tradeError;

      // Update or create position
      const { data: existingPosition } = await supabase
        .from('positions')
        .select('*')
        .eq('user_id', tradeData.userId)
        .eq('outcome_id', tradeData.outcomeId)
        .maybeSingle();

      if (existingPosition) {
        // Update existing position
        const newShares = tradeData.side === 'buy' 
          ? Number(existingPosition.shares) + tradeData.shares
          : Number(existingPosition.shares) - tradeData.shares;

        const newAvgPrice = tradeData.side === 'buy'
          ? (Number(existingPosition.shares) * Number(existingPosition.avg_price) + tradeData.shares * tradeData.price) / newShares
          : Number(existingPosition.avg_price);

        if (newShares <= 0) {
          // Delete position if no shares left
          await supabase
            .from('positions')
            .delete()
            .eq('id', existingPosition.id);
        } else {
          await supabase
            .from('positions')
            .update({
              shares: newShares,
              avg_price: newAvgPrice,
              current_value: newShares * tradeData.price
            })
            .eq('id', existingPosition.id);
        }
      } else if (tradeData.side === 'buy') {
        // Create new position
        await supabase
          .from('positions')
          .insert({
            user_id: tradeData.userId,
            market_id: tradeData.marketId,
            outcome_id: tradeData.outcomeId,
            shares: tradeData.shares,
            avg_price: tradeData.price,
            current_value: tradeData.shares * tradeData.price
          });
      }

      // Update market volume
      const { data: marketData } = await supabase
        .from('markets')
        .select('total_volume')
        .eq('id', tradeData.marketId)
        .single();
      
      if (marketData) {
        await supabase
          .from('markets')
          .update({ total_volume: Number(marketData.total_volume) + tradeData.amount })
          .eq('id', tradeData.marketId);
      }

      // Update outcome price based on trade
      const priceChange = tradeData.side === 'buy' ? 0.01 : -0.01;
      const { data: outcome } = await supabase
        .from('market_outcomes')
        .select('price')
        .eq('id', tradeData.outcomeId)
        .single();

      if (outcome) {
        const newPrice = Math.max(0.01, Math.min(0.99, Number(outcome.price) + priceChange));
        await supabase
          .from('market_outcomes')
          .update({ price: newPrice, total_shares: tradeData.shares })
          .eq('id', tradeData.outcomeId);

        // Record price history
        await supabase
          .from('price_history')
          .insert({
            outcome_id: tradeData.outcomeId,
            price: newPrice
          });
      }

      // Update user profile stats
      await supabase
        .from('profiles')
        .select('total_volume, total_trades')
        .eq('id', tradeData.userId)
        .single()
        .then(({ data: profile }) => {
          if (profile) {
            supabase
              .from('profiles')
              .update({
                total_volume: Number(profile.total_volume) + tradeData.amount,
                total_trades: profile.total_trades + 1
              })
              .eq('id', tradeData.userId);
          }
        });

      return { trade, txHash: txResult.txHash };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      queryClient.invalidateQueries({ queryKey: ['market'] });
      queryClient.invalidateQueries({ queryKey: ['marketStats'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    }
  });
}

// Real-time subscription for trades
export function useRealtimeTrades(marketId?: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['realtimeTrades', marketId],
    queryFn: async () => {
      // Set up real-time subscription
      const channel = supabase
        .channel('trades-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'trades',
            filter: marketId ? `market_id=eq.${marketId}` : undefined
          },
          (payload) => {
            queryClient.invalidateQueries({ queryKey: ['trades'] });
            queryClient.invalidateQueries({ queryKey: ['positions'] });
          }
        )
        .subscribe();

      return { channel };
    },
    enabled: true
  });
}
