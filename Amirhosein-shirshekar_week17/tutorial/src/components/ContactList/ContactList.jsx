import ContactItem from "../ContactItem/ContactItem";
import styles from "./ContactList.module.scss";

export default function ContactList({ contacts, selected, onSelect, onDelete }) {
  if (!contacts.length) return <p className={styles.empty}>مخاطبی پیدا نشد</p>;
  return (
    <ul className={styles.list}>
      {contacts.map((contact) => (
        <ContactItem
          key={contact.id}
          contact={contact}
          selected={selected.includes(contact.id)}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
