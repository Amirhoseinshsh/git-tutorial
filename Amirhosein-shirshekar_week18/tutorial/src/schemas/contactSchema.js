import * as yup from "yup";

// قوانین اعتبارسنجی فرم با yup
export const contactSchema = yup.object({
  // نام: الزامی و حداقل ۳ حرف
  name: yup
    .string()
    .trim()
    .required("نام الزامی است")
    .min(3, "نام باید حداقل ۳ حرف باشد"),

  // شماره: الزامی و به شکل 09xxxxxxxxx (۱۱ رقم)
  phone: yup
    .string()
    .required("شماره الزامی است")
    .matches(/^09\d{9}$/, "شماره معتبر نیست (مثال: 09121234567)"),

  // ایمیل: اختیاری، ولی اگر نوشته شد باید معتبر باشد
  email: yup.string().email("ایمیل معتبر نیست"),
});
