# تورینو (Torino)

وب‌سایت رزرو تور با Next.js 14 (App Router)، TypeScript، Tailwind، React Query، React Hook Form + Yup.

## اجرا

1. بک‌اند را در پوشه `travel-agency-api` اجرا کنید (پورت ۶۵۰۰): `npm i` و سپس `npm start`
2. در همین پوشه: `npm install`
3. فایل `.env.local` آماده است: `NEXT_PUBLIC_API_URL=http://localhost:6500`
4. حالت توسعه: `npm run dev`
5. بررسی Production (بعد از هر صفحه): `npm run build` و بعد `npm start`

## ورود
بک‌اند پیامک واقعی نمی‌فرستد. کد ۶ رقمی بعد از «ارسال کد تایید» در یک Toast نمایش داده می‌شود (و در ترمینال بک‌اند چاپ می‌شود).

## ساختار
- `src/app` صفحات: `/`، `/tours/[id]`، `/checkout`، `/profile` (و `my-tours`، `transactions`)، `not-found`، `error`
- `src/components` کامپوننت‌ها (layout، home، profile، auth، ui)
- `src/lib` تنظیمات Axios، کوکی‌ها و fetch سمت سرور
- `src/hooks`، `src/utils`، `src/types`
- `src/middleware.ts` محافظت از `/profile` و `/checkout`
