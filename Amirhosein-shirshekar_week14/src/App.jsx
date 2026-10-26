import { useEffect, useMemo, useState } from "react";

const starterContacts = [
  { id: 1, firstName: "سارا", lastName: "احمدی", email: "sara.ahmadi@example.com", phone: "0912 123 4567", group: "دوستان", company: "استودیو آبی", note: "برای پروژه طراحی باهاش صحبت کنم.", favorite: true, followUp: "2026-11-02" },
  { id: 2, firstName: "آرمان", lastName: "کریمی", email: "arman.karimi@example.com", phone: "0935 222 7810", group: "کاری", company: "راهکار نو", note: "همکار تیم فرانت‌اند.", favorite: false, followUp: "2026-10-29" },
  { id: 3, firstName: "نیلوفر", lastName: "رضایی", email: "nilo.rezaei@example.com", phone: "0910 345 9087", group: "خانواده", company: "", note: "تولدش نزدیکه.", favorite: true, followUp: "" },
  { id: 4, firstName: "پارسا", lastName: "محمدی", email: "parsa.m@example.com", phone: "0990 111 2648", group: "کاری", company: "داده‌پرداز", note: "منتظر پاسخ درباره جلسه.", favorite: false, followUp: "2026-10-26" },
  { id: 5, firstName: "هستی", lastName: "صادقی", email: "hasti.sadeghi@example.com", phone: "0919 673 1200", group: "دوستان", company: "", note: "کتاب جدید رو بهش پیشنهاد بدم.", favorite: false, followUp: "" },
];

const emptyForm = { firstName: "", lastName: "", email: "", phone: "", group: "دوستان", company: "", note: "", followUp: "" };
const groups = ["همه", "دوستان", "خانواده", "کاری", "سایر"];

function initials(contact) {
  return `${contact.firstName?.[0] || ""}${contact.lastName?.[0] || ""}`;
}

function App() {
  const [contacts, setContacts] = useState(() => {
    try {
      const saved = localStorage.getItem("daftar-man-contacts");
      return saved ? JSON.parse(saved) : starterContacts;
    } catch {
      return starterContacts;
    }
  });
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("همه");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem("daftar-man-contacts", JSON.stringify(contacts));
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return contacts.filter((contact) => {
      const searchable = [contact.firstName, contact.lastName, contact.email, contact.phone, contact.company]
        .join(" ").toLowerCase();
      const matchesSearch = searchable.includes(term);
      const matchesGroup = activeGroup === "همه" || contact.group === activeGroup;
      const matchesFavorite = !favoritesOnly || contact.favorite;
      return matchesSearch && matchesGroup && matchesFavorite;
    });
  }, [contacts, search, activeGroup, favoritesOnly]);

  const favoriteCount = contacts.filter((contact) => contact.favorite).length;
  const dueCount = contacts.filter((contact) => contact.followUp && contact.followUp <= "2026-10-26").length;

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setModal("form");
  }

  function openEdit(contact) {
    setEditingId(contact.id);
    setForm({ ...emptyForm, ...contact });
    setErrors({});
    setModal("form");
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function validateForm() {
    const nextErrors = {};
    if (!form.firstName.trim()) nextErrors.firstName = "نام را وارد کن.";
    if (!form.lastName.trim()) nextErrors.lastName = "نام خانوادگی را وارد کن.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = "ایمیل معتبر وارد کن.";
    if (form.phone.trim() && !/^[0-9۰-۹+\-\s()]{7,20}$/.test(form.phone.trim())) nextErrors.phone = "شماره تلفن را بررسی کن.";
    const duplicate = contacts.some((c) => c.email.toLowerCase() === form.email.trim().toLowerCase() && c.id !== editingId);
    if (duplicate) nextErrors.email = "این ایمیل قبلاً ثبت شده است.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function saveContact(event) {
    event.preventDefault();
    if (!validateForm()) return;
    const cleaned = {
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
    if (editingId) {
      setContacts((current) => current.map((c) => c.id === editingId ? cleaned : c));
      showNotice("مخاطب با موفقیت ویرایش شد.");
    } else {
      setContacts((current) => [cleaned, ...current]);
      showNotice("مخاطب جدید اضافه شد.");
    }
    setModal(null);
  }

  function toggleFavorite(id) {
    setContacts((current) => current.map((c) => c.id === id ? { ...c, favorite: !c.favorite } : c));
  }

  function toggleSelected(id) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function toggleAllVisible() {
    const visibleIds = filteredContacts.map((c) => c.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));
    setSelected((current) => allSelected ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])]);
  }

  function confirmDelete() {
    if (modal?.type === "single") {
      setContacts((current) => current.filter((c) => c.id !== modal.id));
      setSelected((current) => current.filter((id) => id !== modal.id));
      showNotice("مخاطب حذف شد.");
    } else if (modal?.type === "bulk") {
      setContacts((current) => current.filter((c) => !selected.includes(c.id)));
      setSelected([]);
      showNotice("مخاطبان انتخاب‌شده حذف شدند.");
    }
    setModal(null);
  }

  function exportContacts() {
    const blob = new Blob([JSON.stringify(contacts, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contactflow-backup.json";
    link.click();
    URL.revokeObjectURL(url);
    showNotice("فایل پشتیبان آماده شد.");
  }

  const allVisibleSelected = filteredContacts.length > 0 && filteredContacts.every((c) => selected.includes(c.id));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">C<span>+</span></div>
          <div><strong>دفتر من</strong><small>فضای مدیریت ارتباطات</small></div>
        </div>
        <div className="side-label">فضای کاری</div>
        <button className={`nav-item ${activeGroup === "همه" && !favoritesOnly ? "active" : ""}`} onClick={() => { setActiveGroup("همه"); setFavoritesOnly(false); }}>
          <span className="nav-icon">▦</span> همه مخاطبان <span className="nav-count">{contacts.length}</span>
        </button>
        <button className={`nav-item ${favoritesOnly ? "active" : ""}`} onClick={() => setFavoritesOnly((value) => !value)}>
          <span className="nav-icon">☆</span> علاقه‌مندی‌ها <span className="nav-count">{favoriteCount}</span>
        </button>
        <div className="side-label">گروه‌ها</div>
        {groups.slice(1).map((group) => (
          <button key={group} className={`nav-item ${activeGroup === group ? "active" : ""}`} onClick={() => { setActiveGroup(activeGroup === group ? "همه" : group); setFavoritesOnly(false); }}>
            <span className={`group-dot ${group === "کاری" ? "blue" : group === "خانواده" ? "orange" : group === "سایر" ? "gray" : ""}`}></span>
            {group}
            <span className="nav-count">{contacts.filter((c) => c.group === group).length}</span>
          </button>
        ))}
        <div className="sidebar-bottom">
          <div className="tip-card"><div className="tip-icon">✦</div><strong>نکته‌ی کوچک</strong><p>برای پیدا کردن سریع‌تر افراد، از جست‌وجوی نام، ایمیل یا شرکت استفاده کن.</p></div>
          <div className="profile"><div className="profile-avatar">م</div><div><strong>مدیر فضای کار</strong><small>حساب شخصی</small></div><span className="more">•••</span></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">فضای کاری <span>/</span> <b>{favoritesOnly ? "علاقه‌مندی‌ها" : activeGroup === "همه" ? "مخاطبان" : activeGroup}</b></div>
          <div className="top-actions"><span className="today-pill"><i></i> فضای شخصی</span><button className="avatar-small">م</button></div>
        </header>

        <section className="welcome-row">
          <div><div className="eyebrow">مرکز ارتباطات تو</div><h1>ارتباطاتت، <span>مرتب و آماده.</span></h1><p className="subtitle">آدم‌های مهمت را یک‌جا نگه دار و پیگیری‌های بعدی را از دست نده.</p></div>
          <button className="primary-button" onClick={openAdd}><span>＋</span> افزودن مخاطب</button>
        </section>

        <section className="stats-grid">
          <div className="stat-card"><div className="stat-top"><span>کل مخاطبان</span><span className="stat-icon violet">▦</span></div><div className="stat-number">{contacts.length}<small>نفر</small></div><div className="stat-foot">همه ارتباطات ذخیره‌شده</div></div>
          <div className="stat-card"><div className="stat-top"><span>علاقه‌مندی‌ها</span><span className="stat-icon amber">☆</span></div><div className="stat-number">{favoriteCount}<small>نفر</small></div><div className="stat-foot">دسترسی سریع به افراد مهم</div></div>
          <div className="stat-card"><div className="stat-top"><span>نیازمند پیگیری</span><span className="stat-icon mint">↗</span></div><div className="stat-number">{dueCount}<small>مورد</small></div><div className="stat-foot">تاریخ پیگیری امروز یا قبل‌تر</div></div>
        </section>

        <section className="contacts-section">
          <div className="section-heading"><div><h2>دفترچه مخاطبان</h2><p>اطلاعات را ببین، دسته‌بندی کن و به‌روز نگه دار.</p></div><button className="text-button" onClick={exportContacts}>↓ خروجی پشتیبان</button></div>
          <div className="toolbar">
            <div className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جست‌وجوی نام، ایمیل، تلفن یا شرکت..." aria-label="جست‌وجوی مخاطبان" />{search && <button onClick={() => setSearch("")}>×</button>}</div>
            <div className="filter-chip"><span>☷</span><select value={activeGroup} onChange={(e) => { setActiveGroup(e.target.value); setFavoritesOnly(false); }} aria-label="فیلتر گروه">{groups.map((group) => <option key={group}>{group}</option>)}</select></div>
          </div>

          {selected.length > 0 && <div className="bulk-bar"><span>{selected.length} مخاطب انتخاب شده</span><button onClick={() => setModal({ type: "bulk" })}>حذف انتخاب‌شده‌ها</button><button className="cancel-selection" onClick={() => setSelected([])}>لغو انتخاب</button></div>}

          <div className="table-wrap">
            <table>
              <thead><tr><th className="check-col"><input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} aria-label="انتخاب همه مخاطبان قابل مشاهده" /></th><th>مخاطب</th><th>گروه</th><th>اطلاعات تماس</th><th>پیگیری بعدی</th><th className="actions-head">عملیات</th></tr></thead>
              <tbody>
                {filteredContacts.map((contact, index) => (
                  <tr key={contact.id}>
                    <td><input type="checkbox" checked={selected.includes(contact.id)} onChange={() => toggleSelected(contact.id)} aria-label={`انتخاب ${contact.firstName}`} /></td>
                    <td><div className="person-cell"><div className={`person-avatar avatar-${index % 5}`}>{initials(contact)}</div><div><strong>{contact.firstName} {contact.lastName}</strong><small>{contact.company || "شرکت ثبت نشده"}</small></div></div></td>
                    <td><span className={`tag tag-${contact.group === "کاری" ? "work" : contact.group === "خانواده" ? "family" : contact.group === "سایر" ? "other" : "friends"}`}>{contact.group}</span></td>
                    <td><div className="contact-info"><span>{contact.email}</span><small>{contact.phone || "تلفن ثبت نشده"}</small></div></td>
                    <td>{contact.followUp ? <span className={`date-label ${contact.followUp <= "2026-10-26" ? "date-due" : ""}`}>{contact.followUp}{contact.followUp <= "2026-10-26" ? " · پیگیری" : ""}</span> : <span className="muted">تنظیم نشده</span>}</td>
                    <td><div className="row-actions"><button className={`icon-button favorite-button ${contact.favorite ? "is-favorite" : ""}`} title="تغییر علاقه‌مندی" onClick={() => toggleFavorite(contact.id)}>{contact.favorite ? "★" : "☆"}</button><button className="icon-button" title="ویرایش مخاطب" onClick={() => openEdit(contact)}>✎</button><button className="icon-button danger-icon" title="حذف مخاطب" onClick={() => setModal({ type: "single", id: contact.id, name: `${contact.firstName} ${contact.lastName}` })}>⌫</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredContacts.length === 0 && <div className="empty-state"><div>⌕</div><strong>مخاطبی پیدا نشد</strong><p>عبارت جست‌وجو یا فیلتر گروه را تغییر بده.</p><button className="secondary-button" onClick={() => { setSearch(""); setActiveGroup("همه"); setFavoritesOnly(false); }}>پاک کردن فیلترها</button></div>}
          </div>
          <div className="table-footer"><span>نمایش {filteredContacts.length} از {contacts.length} مخاطب</span><span>ذخیره‌سازی خودکار روی همین مرورگر <i className="saved-dot"></i></span></div>
        </section>
        <footer className="footer"><span>دفتر من</span><span>ساده، مرتب، قابل اعتماد.</span></footer>
      </main>

      {notice && <div className="toast"><span>✓</span>{notice}</div>}

      {modal === "form" && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setModal(null); }}><div className="modal form-modal">
        <div className="modal-heading"><div><div className="modal-kicker">{editingId ? "ویرایش اطلاعات" : "ارتباط جدید"}</div><h3>{editingId ? "ویرایش مخاطب" : "افزودن مخاطب جدید"}</h3><p>اطلاعات اصلی را وارد کن؛ فیلدهای ستاره‌دار ضروری‌اند.</p></div><button className="close-button" onClick={() => setModal(null)}>×</button></div>
        <form onSubmit={saveContact} noValidate>
          <div className="form-grid">
            <label>نام *<input name="firstName" value={form.firstName} onChange={updateField} placeholder="مثلاً سارا" />{errors.firstName && <small className="error">{errors.firstName}</small>}</label>
            <label>نام خانوادگی *<input name="lastName" value={form.lastName} onChange={updateField} placeholder="مثلاً احمدی" />{errors.lastName && <small className="error">{errors.lastName}</small>}</label>
            <label className="full-field">ایمیل *<input name="email" type="email" value={form.email} onChange={updateField} placeholder="name@example.com" dir="ltr" />{errors.email && <small className="error">{errors.email}</small>}</label>
            <label>شماره تماس<input name="phone" value={form.phone} onChange={updateField} placeholder="09..." />{errors.phone && <small className="error">{errors.phone}</small>}</label>
            <label>گروه<select name="group" value={form.group} onChange={updateField}><option>دوستان</option><option>خانواده</option><option>کاری</option><option>سایر</option></select></label>
            <label className="full-field">شرکت یا محل کار<input name="company" value={form.company} onChange={updateField} placeholder="اختیاری" /></label>
            <label className="full-field">یادداشت<textarea name="note" value={form.note} onChange={updateField} placeholder="نکته‌ای که دوست داری درباره این مخاطب یادت بماند..." rows="3" /></label>
            <label className="full-field">تاریخ پیگیری بعدی<input name="followUp" type="date" value={form.followUp || ""} onChange={updateField} /></label>
            <label className="favorite-check"><input type="checkbox" checked={Boolean(form.favorite)} onChange={(e) => setForm((current) => ({ ...current, favorite: e.target.checked }))} /> افزودن به علاقه‌مندی‌ها</label>
          </div>
          <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModal(null)}>انصراف</button><button type="submit" className="primary-button">{editingId ? "ذخیره تغییرات" : "ثبت مخاطب"}</button></div>
        </form>
      </div></div>}

      {modal && modal !== "form" && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setModal(null); }}><div className="modal confirm-modal">
        <div className="confirm-symbol">!</div><button className="close-button confirm-close" onClick={() => setModal(null)}>×</button>
        <h3>{modal.type === "bulk" ? "حذف مخاطبان انتخاب‌شده؟" : "حذف این مخاطب؟"}</h3>
        <p>{modal.type === "bulk" ? `قرار است ${selected.length} مخاطب حذف شوند. این کار قابل بازگشت نیست.` : `مخاطب «${modal.name}» حذف خواهد شد. این کار قابل بازگشت نیست.`}</p>
        <div className="modal-actions"><button className="secondary-button" onClick={() => setModal(null)}>نه، منصرف شدم</button><button className="delete-button" onClick={confirmDelete}>بله، حذف شود</button></div>
      </div></div>}
    </div>
  );
}

export default App;