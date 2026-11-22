'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthModalProvider } from './AuthModalProvider';
import LoginModal from '@/components/auth/LoginModal';

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false, staleTime: 30_000 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthModalProvider>
        {children}
        <LoginModal />
        <ToastContainer rtl position="top-center" autoClose={4000} theme="light" />
      </AuthModalProvider>
    </QueryClientProvider>
  );
}
