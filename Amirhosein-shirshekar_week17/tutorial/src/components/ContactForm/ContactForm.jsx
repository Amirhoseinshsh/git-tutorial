import { useState } from "react";
import { useContacts } from "../../context/contactProvider/contactProvider";
import styles from "./ContactForm.module.scss";

const emptyValues = { name: "", lastName: "", email: "", phone: "" };
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+98|0)?9\d{9}$/;

export default function ContactForm({ initialValues = emptyValues, onSubmit, submitLabel }) {
  const { contacts } = useContacts();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (values.name.trim().length < 2) e.name = "نام باید حداقل ۲ حرف باشد";
    if (values.lastName.trim().length < 2) e.lastName = "نام خانوادگی باید حداقل ۲ حرف باشد";
    if (!emailRegex.test(values.email)) e.email = "ایمیل معتبر نیست";
    else if (
      contacts.some(
        (c) => c.email === values.email && c.id !== initialValues.id
      )
    )
      e.email = "این ایمیل قبلاً ثبت شده است";
    if (!phoneRegex.test(values.phone)) e.phone = "شماره موبایل معتبر نیست (مثال: 09121234567)";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;
    setSubmitting(true);
    await onSubmit(values);
    setSubmitting(false);
  };

  const fields = [
    { name: "name", label: "نام", type: "text" },
    { name: "lastName", label: "نام خانوادگی", type: "text" },
    { name: "email", label: "ایمیل", type: "email" },
    { name: "phone", label: "شماره تلفن", type: "tel" },
  ];

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {fields.map((f) => (
        <label key={f.name}>
          {f.label}
          <input
            name={f.name}
            type={f.type}
            value={values[f.name]}
            onChange={handleChange}
            className={errors[f.name] ? styles.invalid : ""}
          />
          {errors[f.name] && <span className={styles.error}>{errors[f.name]}</span>}
        </label>
      ))}
      <button type="submit" disabled={submitting}>{submitLabel}</button>
    </form>
  );
}
