# پنل مدیریت انبار (React + Vite)

پنل مدیریت محصولات انبار با React و Vite. بک‌اند پروژه در پوشه warehouse-api قرار دارد.

## اجرا

۱. ابتدا بک‌اند را اجرا کنید (پورت 3000):

bash
cd warehouse-api
npm install
node server.js


۲. سپس در ترمینال دوم، از پوشه اصلی پروژه، فرانت‌اند را اجرا کنید:

bash
npm install
npm run dev


آدرس فرانت‌اند همان است که Vite در ترمینال نشان می‌دهد (معمولاً http://localhost:5173).

مستندات Swagger: http://localhost:3000/api-docs

## ورود

۱. در Swagger درخواست POST /auth/register را با این بدنه اجرا کنید:

json
{
  "username": "admin",
  "password": "123456"
}


۲. در صفحه فرانت‌اند با همین نام کاربری و رمز وارد شوید.

## قابلیت‌ها

- ورود مدیر با JWT
- نمایش محصولات با صفحه‌بندی
- افزودن، ویرایش و حذف محصول