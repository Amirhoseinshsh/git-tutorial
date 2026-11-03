import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { contactSchema } from "../schemas/contactSchema";
import FormInput from "./FormInput";

const emptyValues = { name: "", phone: "", email: "" };

// این فرم هم برای «افزودن» و هم برای «ویرایش» استفاده می‌شود
export default function ContactForm({ onSubmit, editingContact, onCancel }) {
  const {
    register,       // وصل کردن input ها به فرم
    handleSubmit,   // اجرای validation قبل از ارسال
    reset,          // پر یا خالی کردن فرم
    formState: { errors },
  } = useForm({
    resolver: yupResolver(contactSchema), // وصل کردن yup به فرم
    defaultValues: emptyValues,
  });

  // وقتی روی «ویرایش» کلیک شد، فرم با اطلاعات آن مخاطب پر می‌شود
  useEffect(() => {
    reset(editingContact || emptyValues);
  }, [editingContact, reset]);

  const submit = (data) => {
    onSubmit(data);
    reset(emptyValues); // بعد از ثبت، فرم خالی شود
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <h2>{editingContact ? "ویرایش مخاطب" : "افزودن مخاطب"}</h2>

      <FormInput label="نام" name="name" register={register} error={errors.name} />
      <FormInput label="شماره تلفن" name="phone" register={register} error={errors.phone} />
      <FormInput label="ایمیل (اختیاری)" name="email" type="email" register={register} error={errors.email} />

      <button type="submit">{editingContact ? "ذخیره تغییرات" : "افزودن"}</button>
      {editingContact && (
        <button type="button" className="gray" onClick={onCancel}>
          انصراف
        </button>
      )}
    </form>
  );
}
