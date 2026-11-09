import { fullName, groupTagClass, initials, isDue } from "../utils/contacts";

function ContactRow({ contact, index, isSelected, onToggleSelected, onToggleFavorite, onEdit, onDelete }) {
  const due = isDue(contact);

  return (
    <tr>
      <td>
        <input type="checkbox" checked={isSelected} onChange={() => onToggleSelected(contact.id)} aria-label={`انتخاب ${contact.firstName}`} />
      </td>
      <td>
        <div className="person-cell">
          <div className={`person-avatar avatar-${index % 5}`}>{initials(contact)}</div>
          <div>
            <strong>{fullName(contact)}</strong>
            <small>{contact.company || "شرکت ثبت نشده"}</small>
          </div>
        </div>
      </td>
      <td><span className={`tag tag-${groupTagClass(contact.group)}`}>{contact.group}</span></td>
      <td>
        <div className="contact-info">
          <span>{contact.email}</span>
          <small>{contact.phone || "تلفن ثبت نشده"}</small>
        </div>
      </td>
      <td>
        {contact.followUp
          ? <span className={`date-label ${due ? "date-due" : ""}`}>{contact.followUp}{due ? " · پیگیری" : ""}</span>
          : <span className="muted">تنظیم نشده</span>}
      </td>
      <td>
        <div className="row-actions">
          <button className={`icon-button favorite-button ${contact.favorite ? "is-favorite" : ""}`} title="تغییر علاقه‌مندی" onClick={() => onToggleFavorite(contact.id)}>
            {contact.favorite ? "★" : "☆"}
          </button>
          <button className="icon-button" title="ویرایش مخاطب" onClick={() => onEdit(contact)}>✎</button>
          <button className="icon-button danger-icon" title="حذف مخاطب" onClick={() => onDelete(contact)}>⌫</button>
        </div>
      </td>
    </tr>
  );
}

export default ContactRow;
