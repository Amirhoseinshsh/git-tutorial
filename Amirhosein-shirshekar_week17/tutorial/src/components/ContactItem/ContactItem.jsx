import { Link } from "react-router-dom";
import styles from "./ContactItem.module.scss";

export default function ContactItem({ contact, selected, onSelect, onDelete }) {
  const { id, name, lastName, email, phone } = contact;
  return (
    <li className={`${styles.item} ${selected ? styles.selected : ""}`}>
      <input type="checkbox" checked={selected} onChange={() => onSelect(id)} />
      <div className={styles.avatar}>{name.charAt(0)}</div>
      <div className={styles.info}>
        <h3>{name} {lastName}</h3>
        <p>📧 {email}</p>
        <p>📞 {phone}</p>
      </div>
      <div className={styles.actions}>
        <Link to={`/edit/${id}`}>ویرایش</Link>
        <button onClick={() => onDelete(id)}>حذف</button>
      </div>
    </li>
  );
}
