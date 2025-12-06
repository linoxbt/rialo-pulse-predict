import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/market';

export interface LeaderboardEntry extends Profile {
  rank: number;
  winRate?: number;
}

export function useLeaderboard(limit: number = 10) {
  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('total_profit', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((profile, index) => ({
        ...profile,
        rank: index + 1,
        winRate: profile.total_trades > 0 
          ? Math.min(100, Math.max(0, 50 + (profile.total_profit / (profile.total_volume || 1)) * 100))
          : 0
      })) as LeaderboardEntry[];
    }
  });
}

export function useTopTraders() {
  return useQuery({
    queryKey: ['topTraders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('total_volume', { ascending: false })
        .limit(5);

      if (error) throw error;

      return (data || []).map((profile, index) => ({
        ...profile,
        rank: index + 1
      })) as LeaderboardEntry[];
    }
  });
}
