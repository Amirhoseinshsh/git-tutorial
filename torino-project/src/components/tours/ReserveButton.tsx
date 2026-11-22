'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { api, getErrorMessage } from '@/lib/api';
import { useAuthStatus } from '@/hooks/useAuth';
import { useAuthModal } from '@/components/providers/AuthModalProvider';
import { ButtonSpinner } from '@/components/ui/Spinners';

export default function ReserveButton({
  tourId,
  soldOut,
}: {
  tourId: string;
  soldOut: boolean;
}) {
  const router = useRouter();
  const status = useAuthStatus();
  const { openLogin } = useAuthModal();

  const addToBasket = useMutation({
    mutationFn: () => api.put(`/basket/${tourId}`),
    onSuccess: () => router.push('/checkout'),
    onError: (error) => toast.error(getErrorMessage(error, 'افزودن تور به سبد خرید ناموفق بود.')),
  });

  const onClick = () => {
    if (status !== 'in') {
      toast.info('برای رزرو تور ابتدا وارد حساب کاربری شوید.');
      openLogin();
      return;
    }
    addToBasket.mutate();
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={soldOut || addToBasket.isPending}
      className="btn-primary w-full sm:w-auto sm:min-w-40"
    >
      {addToBasket.isPending ? <ButtonSpinner /> : soldOut ? 'ظرفیت تکمیل است' : 'رزرو و خرید'}
    </button>
  );
}
