'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import OtpInput from 'react18-input-otp';
import { toast } from 'react-toastify';
import { api, getErrorMessage } from '@/lib/api';
import { saveTokens } from '@/lib/auth';
import type { LoginResponse } from '@/types';
import { toEnglishDigits, toPersianDigits } from '@/utils/format';
import Modal from '@/components/ui/Modal';
import { ButtonSpinner } from '@/components/ui/Spinners';
import { useAuthModal } from '@/components/providers/AuthModalProvider';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 120;

const mobileSchema = yup.object({
  mobile: yup
    .string()
    .transform((value) => (typeof value === 'string' ? toEnglishDigits(value.trim()) : value))
    .required('شماره موبایل را وارد کنید')
    .matches(/^09\d{9}$/, 'شماره موبایل معتبر نیست'),
});

type MobileForm = yup.InferType<typeof mobileSchema>;

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, '0');
  return toPersianDigits(`${minutes}:${rest}`);
}

export default function LoginModal() {
  const { isOpen, redirectTo, closeLogin } = useAuthModal();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MobileForm>({ resolver: yupResolver(mobileSchema) });

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  useEffect(() => {
    if (!isOpen) {
      setStep('mobile');
      setOtp('');
      setSecondsLeft(0);
      reset();
    }
  }, [isOpen, reset]);

  const sendOtp = useMutation({
    mutationFn: async (value: string) =>
      (await api.post<{ message: string; code?: string }>('/auth/send-otp', { mobile: value }))
        .data,
    onSuccess: (data, value) => {
      setMobile(value);
      setOtp('');
      setStep('otp');
      setSecondsLeft(RESEND_SECONDS);
      toast.success('کد تایید ارسال شد.');
      // The practice API does not send a real SMS and returns the code instead.
      if (data.code) {
        toast.info(`کد تایید (نسخه آزمایشی): ${toPersianDigits(data.code)}`, {
          autoClose: 20000,
        });
      }
    },
    onError: (error) => toast.error(getErrorMessage(error, 'ارسال کد تایید با خطا مواجه شد.')),
  });

  const verify = useMutation({
    mutationFn: async (vars: { mobile: string; code: string }) =>
      (await api.post<LoginResponse>('/auth/check-otp', vars)).data,
    onSuccess: async (data) => {
      saveTokens(data.accessToken, data.refreshToken);
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('با موفقیت وارد شدید.');
      closeLogin();
      if (redirectTo) {
        router.replace(redirectTo);
      } else if (window.location.search) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    },
    onError: (error) => {
      setOtp('');
      toast.error(getErrorMessage(error, 'کد وارد شده معتبر نیست.'));
    },
  });

  return (
    <Modal
      open={isOpen}
      title="ورود به تورینو"
      onClose={closeLogin}
      onBack={step === 'otp' ? () => setStep('mobile') : undefined}
    >
      {step === 'mobile' ? (
        <form
          onSubmit={handleSubmit(({ mobile: value }) => sendOtp.mutate(value))}
          noValidate
          className="space-y-4"
        >
          <h2 className="text-center text-lg font-bold">ورود به تورینو</h2>
          <div>
            <label htmlFor="login-mobile" className="mb-2 block text-sm">
              شماره موبایل خود را وارد کنید
            </label>
            <input
              id="login-mobile"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              dir="ltr"
              placeholder="09120000000"
              className={`field text-center ${errors.mobile ? 'field-error' : ''}`}
              {...register('mobile')}
            />
            {errors.mobile && (
              <p className="mt-1 text-xs text-red-600">{errors.mobile.message}</p>
            )}
          </div>
          <button type="submit" disabled={sendOtp.isPending} className="btn-primary w-full">
            {sendOtp.isPending ? <ButtonSpinner /> : 'ارسال کد تایید'}
          </button>
        </form>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (otp.length === OTP_LENGTH) verify.mutate({ mobile, code: otp });
          }}
          className="space-y-4"
        >
          <h2 className="text-center text-lg font-bold">کد تایید را وارد کنید.</h2>
          <p className="text-center text-sm text-slate-500">
            کد تایید به شماره {toPersianDigits(mobile)} ارسال شد
          </p>
          <OtpInput
            value={otp}
            onChange={(value) => setOtp(toEnglishDigits(value).replace(/\D/g, ''))}
            numInputs={OTP_LENGTH}
            isInputNum
            shouldAutoFocus
            containerStyle={{ direction: 'ltr', justifyContent: 'center', gap: '0.4rem' }}
            inputStyle={{
              width: '2.5rem',
              height: '3rem',
              borderRadius: '0.5rem',
              border: '1px solid #cbd5e1',
              fontSize: '1.1rem',
              outline: 'none',
            }}
            focusStyle={{ border: '1px solid #28a745', outline: 'none' }}
          />
          <div className="text-center text-xs text-slate-500">
            {secondsLeft > 0 ? (
              <span>{formatTimer(secondsLeft)} تا ارسال مجدد کد</span>
            ) : (
              <button
                type="button"
                onClick={() => sendOtp.mutate(mobile)}
                disabled={sendOtp.isPending}
                className="text-brand-600 hover:underline"
              >
                ارسال مجدد کد
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={verify.isPending || otp.length !== OTP_LENGTH}
            className="btn-primary w-full"
          >
            {verify.isPending ? <ButtonSpinner /> : 'ورود به تورینو'}
          </button>
        </form>
      )}
    </Modal>
  );
}
