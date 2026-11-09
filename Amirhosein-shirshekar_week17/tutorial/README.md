# Contact App (React + Context API + useReducer + json-server)

## اجرا
```
npm install
npm run server   # API: http://localhost:3001
npm start        # App: http://localhost:3000
```

## قابلیت‌ها
- افزودن / ویرایش / حذف مخاطب
- حذف گروهی (انتخاب چندتایی + انتخاب همه)
- اعتبارسنجی فرم (نام، نام خانوادگی، ایمیل، شماره تلفن، ایمیل تکراری)
- جستجو و مرتب‌سازی
- Modal تأیید حذف
- Alert برای موفقیت/خطا
- Loader هنگام دریافت اطلاعات
- مدیریت state با Context API + useReducer (معماری شبیه Flux)

## ساختار
- `src/components/<Name>/` – کامپوننت‌ها (هرکدام با `.module.scss`)
- `src/context/` – Providerها (Alert, contact, Option) + reducer
- `src/Pages/` – صفحات
- `src/services/` – لایه‌ی HTTP (axios)
- `src/utility/` – فونت‌ها و استایل‌های مشترک
- `server/db.json` – دیتابیس json-server
