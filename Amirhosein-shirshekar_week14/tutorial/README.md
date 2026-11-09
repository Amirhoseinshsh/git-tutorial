# دفتر من — مدیریت مخاطبان

پروژه آموزشی React (با Vite) برای مدیریت مخاطبان؛ رابط فارسی و راست‌چین، بدون هیچ کتابخانه جانبی برای رابط کاربری یا آیکون.

## امکانات
- افزودن و ویرایش مخاطب با اعتبارسنجی فرم
- جست‌وجو بر اساس نام، نام خانوادگی، ایمیل، تلفن و شرکت
- فیلتر گروه‌ها و علاقه‌مندی‌ها
- انتخاب چند مخاطب و حذف گروهی با تأیید
- حذف تکی با پنجره تأیید
- یادداشت و تاریخ پیگیری برای هر مخاطب
- شمارنده‌های داشبورد
- ذخیره خودکار داده‌ها در `localStorage`
- خروجی پشتیبان JSON

## اجرا
```bash
npm install
npm run dev
```
آدرسی که Vite در ترمینال نشان می‌دهد را در مرورگر باز کن.

## ساختار پوشه‌ها
```
contact-app/
├── index.html              ← صفحه اصلی (فقط <div id="root">)
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx            ← نقطه ورود React
    ├── App.jsx             ← stateهای اصلی و اتصال کامپوننت‌ها
    ├── components/         ← کامپوننت‌های رابط کاربری
    │   ├── Sidebar.jsx
    │   ├── PageHeader.jsx
    │   ├── StatsGrid.jsx
    │   ├── ContactToolbar.jsx
    │   ├── BulkBar.jsx
    │   ├── ContactTable.jsx
    │   ├── ContactRow.jsx
    │   ├── ContactFormModal.jsx
    │   ├── ConfirmModal.jsx
    │   ├── Modal.jsx
    │   └── Toast.jsx
    ├── hooks/              ← هوک‌های سفارشی
    │   ├── useLocalStorage.js
    │   └── useNotice.js
    ├── utils/              ← توابع کمکی (فیلتر، اعتبارسنجی، خروجی JSON)
    │   └── contacts.js
    ├── data/               ← داده‌ها و ثابت‌ها
    │   └── contacts.js
    └── styles/
        └── styles.css
```
