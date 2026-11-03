import { useEffect, useState } from "react";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";

export default function App() {
  // لیست مخاطبین (از localStorage خوانده می‌شود تا با رفرش پاک نشود)
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem("contacts");
    return saved ? JSON.parse(saved) : [];
  });
  const [editingContact, setEditingContact] = useState(null); // مخاطبی که در حال ویرایش است
  const [search, setSearch] = useState("");

  // هر بار لیست عوض شد، در localStorage ذخیره کن
  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  // افزودن یا ویرایش
  const handleSubmit = (data) => {
    if (editingContact) {
      setContacts(
        contacts.map((c) => (c.id === editingContact.id ? { ...c, ...data } : c))
      );
      setEditingContact(null);
    } else {
      setContacts([...contacts, { id: Date.now(), ...data }]);
    }
  };

  // حذف
  const handleDelete = (id) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  // جستجو بر اساس نام یا شماره
  const filteredContacts = contacts.filter(
    (c) => c.name.includes(search) || c.phone.includes(search)
  );

  return (
    <div className="container">
      <h1>📇 لیست مخاطبین</h1>

      <ContactForm
        onSubmit={handleSubmit}
        editingContact={editingContact}
        onCancel={() => setEditingContact(null)}
      />

      <input
        className="search"
        placeholder="جستجو..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ContactList
        contacts={filteredContacts}
        onEdit={setEditingContact}
        onDelete={handleDelete}
      />
    </div>
  );
}
