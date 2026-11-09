import { useState } from "react";
import Modal from "./Modal";
import { emptyForm } from "../data/contacts";
import { cleanContact, validateContact } from "../utils/contacts";

// contact = null  → افزودن مخاطب جدید
// contact = {...} → ویرایش مخاطب
function ContactFormModal({ contact, contacts, onSave, onClose }) {
  const isEditing = Boolean(contact);
  const [form, setForm] = useState(isEditing ? { ...emptyForm, ...contact } : emptyForm);
  const [errors, setErrors] = useState({});

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateContact(form, contacts, contact?.id);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSave(cleanContact(form, contact?.id), isEditing);
  }

  return (
    <Modal className="form-modal" onClose={onClose}>
      <div className="modal-heading">
        <div>
          <div className="modal-kicker">{isEditing ? "ویرایش اطلاعات" : "ارتباط جدید"}</div>
          <h3>{isEditing ? "ویرایش مخاطب" : "افزودن مخاطب جدید"}</h3>
          <p>اطلاعات اصلی را وارد کن؛ فیلدهای ستاره‌دار ضروری‌اند.</p>
        </div>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label>نام *
            <input name="firstName" value={form.firstName} onChange={updateField} placeholder="مثلاً سارا" />
            {errors.firstName && <small className="error">{errors.firstName}</small>}
          </label>
          <label>نام خانوادگی *
            <input name="lastName" value={form.lastName} onChange={updateField} placeholder="مثلاً احمدی" />
            {errors.lastName && <small className="error">{errors.lastName}</small>}
          </label>
          <label className="full-field">ایمیل *
            <input name="email" type="email" value={form.email} onChange={updateField} placeholder="name@example.com" dir="ltr" />
            {errors.email && <small className="error">{errors.email}</small>}
          </label>
          <label>شماره تماس
            <input name="phone" value={form.phone} onChange={updateField} placeholder="09..." />
            {errors.phone && <small className="error">{errors.phone}</small>}
          </label>
          <label>گروه
            <select name="group" value={form.group} onChange={updateField}>
              <option>دوستان</option>
              <option>خانواده</option>
              <option>کاری</option>
              <option>سایر</option>
            </select>
          </label>
          <label className="full-field">شرکت یا محل کار
            <input name="company" value={form.company} onChange={updateField} placeholder="اختیاری" />
          </label>
          <label className="full-field">یادداشت
            <textarea name="note" value={form.note} onChange={updateField} placeholder="نکته‌ای که دوست داری درباره این مخاطب یادت بماند..." rows="3" />
          </label>
          <label className="full-field">تاریخ پیگیری بعدی
            <input name="followUp" type="date" value={form.followUp || ""} onChange={updateField} />
          </label>
          <label className="favorite-check">
            <input type="checkbox" checked={Boolean(form.favorite)} onChange={(e) => setForm((current) => ({ ...current, favorite: e.target.checked }))} />
            افزودن به علاقه‌مندی‌ها
          </label>
        </div>

        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onClose}>انصراف</button>
          <button type="submit" className="primary-button">{isEditing ? "ذخیره تغییرات" : "ثبت مخاطب"}</button>
        </div>
      </form>
    </Modal>
  );
}

export default ContactFormModal;
