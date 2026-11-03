// نمایش لیست مخاطبین با دکمه‌های ویرایش و حذف
export default function ContactList({ contacts, onEdit, onDelete }) {
  if (contacts.length === 0) {
    return <p className="empty">مخاطبی وجود ندارد.</p>;
  }

  return (
    <ul>
      {contacts.map((contact) => (
        <li key={contact.id}>
          <div>
            <strong>{contact.name}</strong>
            <div>{contact.phone}</div>
            {contact.email && <div>{contact.email}</div>}
          </div>
          <div>
            <button onClick={() => onEdit(contact)}>ویرایش</button>
            <button className="red" onClick={() => onDelete(contact.id)}>
              حذف
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
