import { TODAY } from "../data/contacts";

export function initials(contact) {
  return `${contact.firstName?.[0] || ""}${contact.lastName?.[0] || ""}`;
}

export function fullName(contact) {
  return `${contact.firstName} ${contact.lastName}`;
}

export function isDue(contact) {
  return Boolean(contact.followUp) && contact.followUp <= TODAY;
}

export function groupDotClass(group) {
  if (group === "کاری") return "blue";
  if (group === "خانواده") return "orange";
  if (group === "سایر") return "gray";
  return "";
}

export function groupTagClass(group) {
  if (group === "کاری") return "work";
  if (group === "خانواده") return "family";
  if (group === "سایر") return "other";
  return "friends";
}

export function filterContacts(contacts, search, activeGroup, favoritesOnly) {
  const term = search.trim().toLowerCase();
  return contacts.filter((contact) => {
    const searchable = [contact.firstName, contact.lastName, contact.email, contact.phone, contact.company]
      .join(" ")
      .toLowerCase();
    const matchesSearch = searchable.includes(term);
    const matchesGroup = activeGroup === "همه" || contact.group === activeGroup;
    const matchesFavorite = !favoritesOnly || contact.favorite;
    return matchesSearch && matchesGroup && matchesFavorite;
  });
}

export function validateContact(form, contacts, editingId) {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = "نام را وارد کن.";
  if (!form.lastName.trim()) errors.lastName = "نام خانوادگی را وارد کن.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "ایمیل معتبر وارد کن.";
  if (form.phone.trim() && !/^[0-9۰-۹+\-\s()]{7,20}$/.test(form.phone.trim())) errors.phone = "شماره تلفن را بررسی کن.";
  const duplicate = contacts.some(
    (c) => c.email.toLowerCase() === form.email.trim().toLowerCase() && c.id !== editingId
  );
  if (duplicate) errors.email = "این ایمیل قبلاً ثبت شده است.";
  return errors;
}

export function cleanContact(form, editingId) {
  return {
    ...form,
    id: editingId ?? Date.now(),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim().toLowerCase(),
    phone: form.phone.trim(),
    company: form.company.trim(),
    note: form.note.trim(),
    favorite: Boolean(form.favorite),
  };
}

export function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
