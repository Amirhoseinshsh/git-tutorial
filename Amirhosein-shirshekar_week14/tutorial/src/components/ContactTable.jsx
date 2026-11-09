import ContactRow from "./ContactRow";

function ContactTable({ contacts, selected, allVisibleSelected, onToggleAll, onToggleSelected, onToggleFavorite, onEdit, onDelete, onClearFilters }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th className="check-col">
              <input type="checkbox" checked={allVisibleSelected} onChange={onToggleAll} aria-label="انتخاب همه مخاطبان قابل مشاهده" />
            </th>
            <th>مخاطب</th>
            <th>گروه</th>
            <th>اطلاعات تماس</th>
            <th>پیگیری بعدی</th>
            <th className="actions-head">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <ContactRow
              key={contact.id}
              contact={contact}
              index={index}
              isSelected={selected.includes(contact.id)}
              onToggleSelected={onToggleSelected}
              onToggleFavorite={onToggleFavorite}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>

      {contacts.length === 0 && (
        <div className="empty-state">
          <div>⌕</div>
          <strong>مخاطبی پیدا نشد</strong>
          <p>عبارت جست‌وجو یا فیلتر گروه را تغییر بده.</p>
          <button className="secondary-button" onClick={onClearFilters}>پاک کردن فیلترها</button>
        </div>
      )}
    </div>
  );
}

export default ContactTable;
