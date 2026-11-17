# Warehouse Admin — Next.js

پنل مدیریت انبار که از React (Vite) به Next.js 15 (App Router) منتقل شده است. این پروژه برای کار کردن به بک‌اند warehouse-api نیاز دارد.

## مسیرها

- / : هدایت به پنل مدیریت
- /login : صفحه ورود مدیر
- /admin : پنل مدیریت محصولات (نمایش، افزودن، ویرایش، حذف)

## اجرا

۱. ابتدا بک‌اند را اجرا کنید (پورت 3000):

bash
cd ../warehouse-api
npm install
node server.js


۲. سپس در ترمینال دوم فرانت‌اند را اجرا کنید (پورت 3001):

bash
npm install
npm run dev -- -p 3001


آدرس بک‌اند از متغیر NEXT_PUBLIC_API_URL خوانده می‌شود و در صورت تنظیم‌نشدن، http://localhost:3000 است (نمونه در .env.example).

## ورود

۱. در Swagger به آدرس http://localhost:3000/api-docs بروید و POST /auth/register را با این بدنه اجرا کنید:

json
{
  "username": "admin",
  "password": "123456"
}


۲. به http://localhost:3001/login بروید و با همین اطلاعات وارد شوید.

## ساخت نسخه production

bash
npm run build
npm start


## نکات فنی

- احراز هویت با JWT است و توکن در localStorage ذخیره می‌شود.
- صفحات /login و /admin به API و localStorage وابسته‌اند، پس Client Component هستند و با noindex از موتورهای جست‌وجو خارج شده‌اند.
- پروژه صفحه عمومی فروشگاه ندارد، بنابراین از SSG/ISR در آن استفاده نشده است.s