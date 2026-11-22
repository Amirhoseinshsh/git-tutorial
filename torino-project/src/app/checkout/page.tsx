'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import AuthGuard from '@/components/auth/AuthGuard';
import JalaliDatePicker from '@/components/ui/JalaliDatePicker';
import { ButtonSpinner, PageSpinner } from '@/components/ui/Spinners';
import { useProfile } from '@/hooks/useProfile';
import { api, getErrorMessage } from '@/lib/api';
import type { Tour } from '@/types';
import { cleanDigits, formatPrice, getTourDuration, toPersianDigits } from '@/utils/format';

const schema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required('نام و نام خانوادگی را وارد کنید')
    .min(3, 'نام و نام خانوادگی کوتاه است'),
  nationalCode: yup
    .string()
    .transform(cleanDigits)
    .required('کد ملی را وارد کنید')
    .matches(/^\d{10}$/, 'کد ملی باید ۱۰ رقم باشد'),
  gender: yup
    .string()
    .oneOf(['male', 'female'] as const, 'جنسیت را انتخاب کنید')
    .required('جنسیت را انتخاب کنید'),
  birthDate: yup.string().required('تاریخ تولد را انتخاب کنید'),
});

type CheckoutForm = yup.InferType<typeof schema>;

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs text-red-600">{message}</p> : null;
}

function CheckoutContent() {
  const queryClient = useQueryClient();
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const basket = useQuery({
    queryKey: ['basket'],
    queryFn: async () => (await api.get<Tour>('/basket')).data,
    gcTime: 0,
  });
  const profile = useProfile();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: yupResolver(schema),
    defaultValues: { fullName: '', nationalCode: '', birthDate: '' },
  });

  useEffect(() => {
    const user = profile.data;
    if (!user) return;
    reset({
      fullName: [user.firstName, user.lastName].filter(Boolean).join(' '),
      nationalCode: user.nationalCode ? String(user.nationalCode) : '',
      gender: user.gender,
      birthDate: user.birthDate ? user.birthDate.slice(0, 10) : '',
    });
  }, [profile.data, reset]);

  const order = useMutation({
    mutationFn: (values: CheckoutForm) => api.post('/order', values),
    onSuccess: async () => {
      setSubmitError('');
      setDone(true);
      toast.success('تور با موفقیت خریداری شد.');
      queryClient.removeQueries({ queryKey: ['basket'] });
      await queryClient.invalidateQueries({ queryKey: ['user-tours'] });
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error, 'ثبت سفارش با خطا مواجه شد.');
      setSubmitError(message);
      toast.error(message);
    },
  });

  if (done) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <p className="text-5xl" aria-hidden="true">
          ✅
        </p>
        <h1 className="mt-4 text-xl font-bold">خرید شما با موفقیت انجام شد</h1>
        <p className="mt-2 text-sm text-slate-500">
          جزئیات سفر را از بخش «تورهای من» در پروفایل ببینید.
        </p>
        <Link href="/profile/my-tours" className="btn-primary mt-6">
          مشاهده تورهای من
        </Link>
      </div>
    );
  }

  if (basket.isPending) return <PageSpinner />;

  if (basket.isError || !basket.data?.id) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <h1 className="text-lg font-bold">سبد خرید شما خالی است</h1>
        <p className="mt-2 text-sm text-slate-500">ابتدا یک تور را انتخاب و رزرو کنید.</p>
        <Link href="/#tours" className="btn-primary mt-6">
          مشاهده تورها
        </Link>
      </div>
    );
  }

  const tour = basket.data;
  const { days, nights } = getTourDuration(tour.startDate, tour.endDate);

  return (
    <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
      <form
        id="passenger-form"
        onSubmit={handleSubmit((values) => order.mutate(values))}
        noValidate
        className="card space-y-4 p-5"
      >
        <h1 className="text-lg font-bold">مشخصات مسافر</h1>

        <div>
          <label htmlFor="fullName" className="mb-1 block text-sm">
            نام و نام خانوادگی
          </label>
          <input
            id="fullName"
            className={`field ${errors.fullName ? 'field-error' : ''}`}
            {...register('fullName')}
          />
          <FieldError message={errors.fullName?.message} />
        </div>

        <div>
          <label htmlFor="nationalCode" className="mb-1 block text-sm">
            کد ملی
          </label>
          <input
            id="nationalCode"
            inputMode="numeric"
            dir="ltr"
            className={`field text-right ${errors.nationalCode ? 'field-error' : ''}`}
            {...register('nationalCode')}
          />
          <FieldError message={errors.nationalCode?.message} />
        </div>

        <div>
          <label htmlFor="gender" className="mb-1 block text-sm">
            جنسیت
          </label>
          <select
            id="gender"
            defaultValue=""
            className={`field ${errors.gender ? 'field-error' : ''}`}
            {...register('gender')}
          >
            <option value="">انتخاب کنید</option>
            <option value="male">مرد</option>
            <option value="female">زن</option>
          </select>
          <FieldError message={errors.gender?.message} />
        </div>

        <div>
          <label htmlFor="birthDate" className="mb-1 block text-sm">
            تاریخ تولد
          </label>
          <Controller
            control={control}
            name="birthDate"
            render={({ field }) => (
              <JalaliDatePicker
                id="birthDate"
                value={field.value ?? ''}
                onChange={field.onChange}
                invalid={Boolean(errors.birthDate)}
                placeholder="تاریخ تولد"
              />
            )}
          />
          <FieldError message={errors.birthDate?.message} />
        </div>

        {submitError && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </p>
        )}
      </form>

      <aside className="card h-fit space-y-4 p-5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-bold">{tour.title}</h2>
          <p className="text-xs text-slate-500">
            {toPersianDigits(days)} روز و {toPersianDigits(nights)} شب
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-dashed border-slate-300 pt-4">
          <span className="text-sm text-slate-500">قیمت نهایی</span>
          <span className="text-xl font-extrabold text-sky-600">
            {formatPrice(tour.price)} <span className="text-sm font-normal">تومان</span>
          </span>
        </div>
        <button
          type="submit"
          form="passenger-form"
          disabled={order.isPending}
          className="btn-primary w-full"
        >
          {order.isPending ? <ButtonSpinner /> : 'ثبت و خرید نهایی'}
        </button>
      </aside>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="container-page py-8">
      <AuthGuard>
        <CheckoutContent />
      </AuthGuard>
    </div>
  );
}
