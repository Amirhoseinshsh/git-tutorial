'use client';

import { useEffect, useState } from 'react';
import { AUTH_EVENT, hasSession } from '@/lib/auth';

export type AuthStatus = 'loading' | 'in' | 'out';

export function useAuthStatus(): AuthStatus {
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    const sync = () => setStatus(hasSession() ? 'in' : 'out');
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    return () => window.removeEventListener(AUTH_EVENT, sync);
  }, []);

  return status;
}
