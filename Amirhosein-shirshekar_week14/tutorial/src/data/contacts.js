export const STORAGE_KEY = "daftar-man-contacts";

// تاریخ مرجع برای تشخیص «نیازمند پیگیری»
export const TODAY = "2026-10-26";

export const groups = ["همه", "دوستان", "خانواده", "کاری", "سایر"];

export const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  group: "دوستان",
  company: "",
  note: "",
  followUp: "",
};

export const starterContacts = [
  { id: 1, firstName: "سارا", lastName: "احمدی", email: "sara.ahmadi@example.com", phone: "0912 123 4567", group: "دوستان", company: "استودیو آبی", note: "برای پروژه طراحی باهاش صحبت کنم.", favorite: true, followUp: "2026-11-02" },
  { id: 2, firstName: "آرمان", lastName: "کریمی", email: "arman.karimi@example.com", phone: "0935 222 7810", group: "کاری", company: "راهکار نو", note: "همکار تیم فرانت‌اند.", favorite: false, followUp: "2026-10-29" },
  { id: 3, firstName: "نیلوفر", lastName: "رضایی", email: "nilo.rezaei@example.com", phone: "0910 345 9087", group: "خانواده", company: "", note: "تولدش نزدیکه.", favorite: true, followUp: "" },
  { id: 4, firstName: "پارسا", lastName: "محمدی", email: "parsa.m@example.com", phone: "0990 111 2648", group: "کاری", company: "داده‌پرداز", note: "منتظر پاسخ درباره جلسه.", favorite: false, followUp: "2026-10-26" },
  { id: 5, firstName: "هستی", lastName: "صادقی", email: "hasti.sadeghi@example.com", phone: "0919 673 1200", group: "دوستان", company: "", note: "کتاب جدید رو بهش پیشنهاد بدم.", favorite: false, followUp: "" },
];
