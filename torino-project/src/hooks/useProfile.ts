'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { UserProfile } from '@/types';
import { useAuthStatus } from './useAuth';

export function useProfile() {
  const status = useAuthStatus();
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => (await api.get<UserProfile>('/user/profile')).data,
    enabled: status === 'in',
  });
}
