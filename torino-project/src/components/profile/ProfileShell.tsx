'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';

const TABS = [
  { href: '/profile', label: 'پروفایل' },
  { href: '/profile/my-tours', label: 'تور های من' },
  { href: '/profile/transactions', label: 'تراکنش ها' },
];

export default function ProfileShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="container-page max-w-3xl py-6">
      <AuthGuard>
        <nav className="mb-6 flex border-b border-slate-200" aria-label="بخش‌های پروفایل">
          {TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={`flex-1 border-b-2 px-2 py-3 text-center text-sm transition ${
                  active
                    ? 'border-brand-500 font-bold text-brand-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
        {children}
      </AuthGuard>
    </div>
  );
}
