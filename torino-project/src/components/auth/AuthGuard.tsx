'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStatus } from '@/hooks/useAuth';
import { useAuthModal } from '@/components/providers/AuthModalProvider';
import { PageSpinner } from '@/components/ui/Spinners';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const status = useAuthStatus();
  const router = useRouter();
  const pathname = usePathname();
  const { openLogin } = useAuthModal();

  useEffect(() => {
    if (status === 'out') {
      openLogin(pathname);
      router.replace('/');
    }
  }, [status, pathname, openLogin, router]);

  if (status !== 'in') return <PageSpinner />;
  return <>{children}</>;
}
