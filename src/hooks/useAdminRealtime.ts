import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useAdminRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Listen to all relevant tables for admin dashboard
    const channel = supabase.channel('admin_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payment_proofs' }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
