import { groups } from "../data/contacts";
import { groupDotClass } from "../utils/contacts";

function Sidebar({ contacts, activeGroup, favoritesOnly, favoriteCount, onShowAll, onToggleFavorites, onToggleGroup }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">C<span>+</span></div>
        <div><strong>دفتر من</strong><small>فضای مدیریت ارتباطات</small></div>
      </div>

      <div className="side-label">فضای کاری</div>
      <button className={`nav-item ${activeGroup === "همه" && !favoritesOnly ? "active" : ""}`} onClick={onShowAll}>
        <span className="nav-icon">▦</span> همه مخاطبان <span className="nav-count">{contacts.length}</span>
      </button>
      <button className={`nav-item ${favoritesOnly ? "active" : ""}`} onClick={onToggleFavorites}>
        <span className="nav-icon">☆</span> علاقه‌مندی‌ها <span className="nav-count">{favoriteCount}</span>
      </button>

      <div className="side-label">گروه‌ها</div>
      {groups.slice(1).map((group) => (
        <button key={group} className={`nav-item ${activeGroup === group ? "active" : ""}`} onClick={() => onToggleGroup(group)}>
          <span className={`group-dot ${groupDotClass(group)}`}></span>
          {group}
          <span className="nav-count">{contacts.filter((c) => c.group === group).length}</span>
        </button>
      ))}

      <div className="sidebar-bottom">
        <div className="tip-card">
          <div className="tip-icon">✦</div>
          <strong>نکته‌ی کوچک</strong>
          <p>برای پیدا کردن سریع‌تر افراد، از جست‌وجوی نام، ایمیل یا شرکت استفاده کن.</p>
        </div>
        <div className="profile">
          <div className="profile-avatar">م</div>
          <div><strong>مدیر فضای کار</strong><small>حساب شخصی</small></div>
          <span className="more">•••</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
