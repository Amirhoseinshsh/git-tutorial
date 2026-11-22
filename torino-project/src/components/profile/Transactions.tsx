'use client';

import { useQuery } from '@tanstack/react-query';
import { PageSpinner } from '@/components/ui/Spinners';
import { api } from '@/lib/api';
import type { Transaction } from '@/types';
import { formatJalaliDateTime, formatPrice, toPersianDigits } from '@/utils/format';

const TYPE_LABEL: Record<string, string> = { Purchase: 'خرید تور' };

export default function Transactions() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => (await api.get<Transaction[]>('/user/transactions')).data,
  });

  if (isPending) return <PageSpinner />;
  if (isError) {
    return (
      <p role="alert" className="card p-6 text-center text-sm text-red-600">
        دریافت تراکنش‌ها ناموفق بود.
      </p>
    );
  }

  if (data.length === 0) {
    return <p className="card p-8 text-center text-sm text-slate-500">تراکنشی ثبت نشده است.</p>;
  }

  const rows = [...data].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[32rem] text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 text-right font-medium">تاریخ و ساعت</th>
            <th className="px-4 py-3 text-right font-medium">مبلغ (تومان)</th>
            <th className="px-4 py-3 text-right font-medium">نوع تراکنش</th>
            <th className="px-4 py-3 text-right font-medium">شماره سفارش</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{formatJalaliDateTime(row.createdAt)}</td>
              <td className="px-4 py-3">{formatPrice(row.amount)}</td>
              <td className="px-4 py-3">{TYPE_LABEL[row.type] ?? row.type}</td>
              <td className="px-4 py-3" dir="ltr">
                {toPersianDigits(row.id.slice(0, 8))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
