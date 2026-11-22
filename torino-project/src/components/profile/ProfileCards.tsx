'use client';

import { useState, type ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import JalaliDatePicker from '@/components/ui/JalaliDatePicker';
import { ButtonSpinner, PageSpinner } from '@/components/ui/Spinners';
import { useProfile } from '@/hooks/useProfile';
import { api, getErrorMessage } from '@/lib/api';
import type { UserProfile } from '@/types';
import { cleanDigits, formatJalaliDate, toPersianDigits } from '@/utils/format';

const GENDER_LABEL = { male: 'مرد', female: 'زن' } as const;

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value || '—'}</span>
    </div>
  );
}

function Section({
  title,
  editing,
  onEdit,
  editLabel = 'ویرایش اطلاعات',
  children,
}: {
  title: string;
  editing: boolean;
  onEdit: () => void;
  editLabel?: string;
  children: ReactNode;
}) {
  return (
    <section className="card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-bold">{title}</h2>
        {!editing && (
          <button type="button" onClick={onEdit} className="text-sm text-sky-600 hover:underline">
            {editLabel}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs text-red-600">{message}</p> : null;
}

function FormActions({ pending, onCancel }: { pending: boolean; onCancel: () => void }) {
  return (
    <div className="flex gap-2 pt-2">
      <button type="submit" disabled={pending} className="btn-primary flex-1">
        {pending ? <ButtonSpinner /> : 'تایید'}
      </button>
      <button type="button" onClick={onCancel} className="btn-outline flex-1">
        انصراف
      </button>
    </div>
  );
}

function useUpdateProfile(onDone: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: Partial<UserProfile>) =>
      (await api.put('/user/profile', body)).data,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('تغییرات با موفقیت ذخیره شد.');
      onDone();
    },
    onError: (error) => toast.error(getErrorMessage(error, 'ذخیره تغییرات با خطا مواجه شد.')),
  });
}

/* ------------------------------ account info ------------------------------ */

const emailSchema = yup.object({
  email: yup.string().trim().required('ایمیل را وارد کنید').email('ایمیل معتبر نیست'),
});
type EmailForm = yup.InferType<typeof emailSchema>;

function AccountCard({ profile }: { profile: UserProfile }) {
  const [editing, setEditing] = useState(false);
  const update = useUpdateProfile(() => setEditing(false));
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailForm>({
    resolver: yupResolver(emailSchema),
    defaultValues: { email: profile.email ?? '' },
  });

  return (
    <Section
      title="اطلاعات حساب کاربری"
      editing={editing}
      onEdit={() => setEditing(true)}
      editLabel={profile.email ? 'ویرایش' : 'افزودن'}
    >
      <Row label="شماره موبایل" value={toPersianDigits(profile.mobile)} />
      {editing ? (
        <form
          onSubmit={handleSubmit((values) => update.mutate(values))}
          noValidate
          className="space-y-2"
        >
          <label htmlFor="email" className="block text-sm text-slate-500">
            ایمیل
          </label>
          <input
            id="email"
            type="email"
            dir="ltr"
            placeholder="آدرس ایمیل"
            className={`field ${errors.email ? 'field-error' : ''}`}
            {...register('email')}
          />
          <FieldError message={errors.email?.message} />
          <FormActions pending={update.isPending} onCancel={() => setEditing(false)} />
        </form>
      ) : (
        <Row label="ایمیل" value={profile.email} />
      )}
    </Section>
  );
}

/* ----------------------------- personal info ------------------------------ */

const personalSchema = yup.object({
  firstName: yup.string().trim().required('نام را وارد کنید'),
  lastName: yup.string().trim().required('نام خانوادگی را وارد کنید'),
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
type PersonalForm = yup.InferType<typeof personalSchema>;

function PersonalCard({ profile }: { profile: UserProfile }) {
  const [editing, setEditing] = useState(false);
  const update = useUpdateProfile(() => setEditing(false));
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PersonalForm>({
    resolver: yupResolver(personalSchema),
    defaultValues: {
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      nationalCode: profile.nationalCode ? String(profile.nationalCode) : '',
      gender: profile.gender,
      birthDate: profile.birthDate ? profile.birthDate.slice(0, 10) : '',
    },
  });

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');

  return (
    <Section title="اطلاعات شخصی" editing={editing} onEdit={() => setEditing(true)}>
      {editing ? (
        <form
          onSubmit={handleSubmit((values) => update.mutate(values))}
          noValidate
          className="space-y-3"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="mb-1 block text-sm text-slate-500">
                نام
              </label>
              <input
                id="firstName"
                className={`field ${errors.firstName ? 'field-error' : ''}`}
                {...register('firstName')}
              />
              <FieldError message={errors.firstName?.message} />
            </div>
            <div>
              <label htmlFor="lastName" className="mb-1 block text-sm text-slate-500">
                نام خانوادگی
              </label>
              <input
                id="lastName"
                className={`field ${errors.lastName ? 'field-error' : ''}`}
                {...register('lastName')}
              />
              <FieldError message={errors.lastName?.message} />
            </div>
          </div>

          <div>
            <label htmlFor="nationalCode" className="mb-1 block text-sm text-slate-500">
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

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="gender" className="mb-1 block text-sm text-slate-500">
                جنسیت
              </label>
              <select
                id="gender"
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
              <label htmlFor="birthDate" className="mb-1 block text-sm text-slate-500">
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
          </div>

          <FormActions pending={update.isPending} onCancel={() => setEditing(false)} />
        </form>
      ) : (
        <>
          <Row label="نام و نام خانوادگی" value={fullName} />
          <Row
            label="کد ملی"
            value={profile.nationalCode ? toPersianDigits(profile.nationalCode) : undefined}
          />
          <Row label="جنسیت" value={profile.gender ? GENDER_LABEL[profile.gender] : undefined} />
          <Row
            label="تاریخ تولد"
            value={profile.birthDate ? formatJalaliDate(profile.birthDate) : undefined}
          />
        </>
      )}
    </Section>
  );
}

/* ------------------------------- bank info -------------------------------- */

const bankSchema = yup.object({
  debitCard_code: yup
    .string()
    .transform(cleanDigits)
    .matches(/^\d{16}$/, { message: 'شماره کارت باید ۱۶ رقم باشد', excludeEmptyString: true })
    .default(''),
  shaba_code: yup
    .string()
    .transform((value) => (typeof value === 'string' ? cleanDigits(value.toUpperCase()) : value))
    .matches(/^(IR)?\d{24}$/, {
      message: 'شماره شبا باید ۲۴ رقم باشد (با یا بدون IR)',
      excludeEmptyString: true,
    })
    .default(''),
  accountIdentifier: yup
    .string()
    .transform(cleanDigits)
    .matches(/^\d{6,20}$/, { message: 'شماره حساب معتبر نیست', excludeEmptyString: true })
    .default(''),
});
type BankForm = yup.InferType<typeof bankSchema>;

function BankCard({ profile }: { profile: UserProfile }) {
  const [editing, setEditing] = useState(false);
  const update = useUpdateProfile(() => setEditing(false));
  const payment = profile.payment;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BankForm>({
    resolver: yupResolver(bankSchema),
    defaultValues: {
      debitCard_code: payment?.debitCard_code ?? '',
      shaba_code: payment?.shaba_code ?? '',
      accountIdentifier: payment?.accountIdentifier ?? '',
    },
  });

  const fields = [
    { name: 'debitCard_code', label: 'شماره کارت' },
    { name: 'shaba_code', label: 'شماره شبا' },
    { name: 'accountIdentifier', label: 'شماره حساب' },
  ] as const;

  return (
    <Section title="اطلاعات حساب بانکی" editing={editing} onEdit={() => setEditing(true)}>
      {editing ? (
        <form
          onSubmit={handleSubmit((values) => update.mutate({ payment: values }))}
          noValidate
          className="space-y-3"
        >
          {fields.map(({ name, label }) => (
            <div key={name}>
              <label htmlFor={name} className="mb-1 block text-sm text-slate-500">
                {label}
              </label>
              <input
                id={name}
                dir="ltr"
                inputMode={name === 'shaba_code' ? 'text' : 'numeric'}
                className={`field text-right ${errors[name] ? 'field-error' : ''}`}
                {...register(name)}
              />
              <FieldError message={errors[name]?.message} />
            </div>
          ))}
          <FormActions pending={update.isPending} onCancel={() => setEditing(false)} />
        </form>
      ) : (
        <>
          <Row
            label="شماره کارت"
            value={payment?.debitCard_code ? toPersianDigits(payment.debitCard_code) : undefined}
          />
          <Row label="شماره شبا" value={payment?.shaba_code} />
          <Row
            label="شماره حساب"
            value={
              payment?.accountIdentifier ? toPersianDigits(payment.accountIdentifier) : undefined
            }
          />
        </>
      )}
    </Section>
  );
}

export default function ProfileCards() {
  const { data: profile, isPending, isError } = useProfile();

  if (isPending) return <PageSpinner />;
  if (isError || !profile) {
    return (
      <p role="alert" className="card p-6 text-center text-sm text-red-600">
        دریافت اطلاعات حساب کاربری ناموفق بود. صفحه را دوباره بارگذاری کنید.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <AccountCard profile={profile} />
      <PersonalCard profile={profile} />
      <BankCard profile={profile} />
    </div>
  );
}
