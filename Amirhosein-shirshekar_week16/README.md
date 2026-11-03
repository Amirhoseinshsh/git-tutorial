# 🏙️ City Suggest

یک input که با تایپ هر حرف، نزدیک‌ترین شهر به املای کاربر را پیشنهاد می‌دهد (حساس به حروف کوچک و بزرگ).

## ✨ قابلیت‌ها
- پیشنهاد حداکثر ۳ شهر نزدیک با الگوریتم فاصله ویرایش (Levenshtein)
- انتخاب با کلیک یا کلیدهای ↑ ↓ و Enter / Tab
- پیام «شهری پیدا نشد»

## 🚀 اجرا
```bash
npm install
npm run dev
```

## 📁 ساختار
```
src/
├── components/CityInput.jsx
├── utils/suggest.js     # الگوریتم پیشنهاد
├── data/cities.js       # لیست شهرها
├── App.jsx
└── main.jsx
```

## 👤 سازنده
نام شما — [GitHub](https://github.com/USERNAME)
