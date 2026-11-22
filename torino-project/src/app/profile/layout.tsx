import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import ProfileShell from '@/components/profile/ProfileShell';

export const metadata: Metadata = { title: 'حساب کاربری' };

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <ProfileShell>{children}</ProfileShell>;
}
