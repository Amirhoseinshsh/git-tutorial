import { groups } from "../data/contacts";

function ContactToolbar({ search, onSearchChange, activeGroup, onGroupChange }) {
  return (
    <div className="toolbar">
      <div className="search-box">
        <span>⌕</span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="جست‌وجوی نام، ایمیل، تلفن یا شرکت..."
          aria-label="جست‌وجوی مخاطبان"
        />
        {search && <button onClick={() => onSearchChange("")}>×</button>}
      </div>
      <div className="filter-chip">
        <span>☷</span>
        <select value={activeGroup} onChange={(e) => onGroupChange(e.target.value)} aria-label="فیلتر گروه">
          {groups.map((group) => <option key={group}>{group}</option>)}
        </select>
      </div>
    </div>
  );
}

export default ContactToolbar;
