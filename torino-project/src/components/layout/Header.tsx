'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { clearTokens } from '@/lib/auth';
import { useAuthStatus } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toPersianDigits } from '@/utils/format';
import { useAuthModal } from '@/components/providers/AuthModalProvider';

const NAV_LINKS = [
  { href: '/', label: 'صفحه اصلی' },
  { href: '/#tours', label: 'تورهای گردشگری' },
  { href: '/#why', label: 'چرا تورینو؟' },
  { href: '/#contact', label: 'تماس با ما' },
];

export default function Header() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const status = useAuthStatus();
  const { data: profile } = useProfile();
  const { openLogin } = useAuthModal();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [userMenuOpen]);

  const logout = () => {
    clearTokens();
    queryClient.clear();
    setUserMenuOpen(false);
    toast.info('از حساب کاربری خارج شدید.');
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-md p-2 text-2xl leading-none md:hidden"
            aria-label="منو"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            ☰
          </button>

          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-brand-600">
            <span aria-hidden="true">✈</span>
            تورینو
          </Link>

          <nav className="hidden items-center gap-6 text-sm md:flex" aria-label="منوی اصلی">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-brand-600">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="min-w-[7rem]">
          {status === 'loading' && <div className="h-10 w-28" />}

          {status === 'out' && (
            <button type="button" onClick={() => openLogin()} className="btn-outline h-10 gap-2">
              ورود به حساب
            </button>
          )}

          {status === 'in' && (
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-brand-700 hover:bg-brand-50"
              >
                <span dir="ltr">{profile ? toPersianDigits(profile.mobile) : '...'}</span>
                <span aria-hidden="true">▾</span>
              </button>

              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute end-0 mt-1 w-56 rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
                >
                  <div className="px-4 py-2 text-sm text-slate-500" dir="ltr">
                    {profile ? toPersianDigits(profile.mobile) : ''}
                  </div>
                  <Link
                    role="menuitem"
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-slate-50"
                  >
                    اطلاعات حساب کاربری
                  </Link>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={logout}
                    className="block w-full px-4 py-2 text-right text-sm text-red-600 hover:bg-red-50"
                  >
                    خروج از حساب کاربری
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-slate-100 bg-white md:hidden" aria-label="منوی موبایل">
          <ul className="container-page py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
