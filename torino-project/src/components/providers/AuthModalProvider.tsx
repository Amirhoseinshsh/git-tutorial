'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface AuthModalContextValue {
  isOpen: boolean;
  redirectTo: string | null;
  openLogin: (redirectTo?: string) => void;
  closeLogin: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // The middleware redirects here with ?login=1&next=/path
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === '1') {
      const next = params.get('next');
      setRedirectTo(next && next.startsWith('/') ? next : null);
      setIsOpen(true);
    }
  }, []);

  const openLogin = useCallback((target?: string) => {
    setRedirectTo(target ?? null);
    setIsOpen(true);
  }, []);

  const closeLogin = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, redirectTo, openLogin, closeLogin }),
    [isOpen, redirectTo, openLogin, closeLogin],
  );

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}

export function useAuthModal(): AuthModalContextValue {
  const context = useContext(AuthModalContext);
  if (!context) throw new Error('useAuthModal must be used inside AuthModalProvider');
  return context;
}
