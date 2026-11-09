import { useMemo, useState } from "react";

import Sidebar from "./components/Sidebar";
import PageHeader from "./components/PageHeader";
import StatsGrid from "./components/StatsGrid";
import ContactToolbar from "./components/ContactToolbar";
import BulkBar from "./components/BulkBar";
import ContactTable from "./components/ContactTable";
import ContactFormModal from "./components/ContactFormModal";
import ConfirmModal from "./components/ConfirmModal";
import Toast from "./components/Toast";

import { STORAGE_KEY, starterContacts } from "./data/contacts";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useNotice } from "./hooks/useNotice";
import { downloadJson, filterContacts, fullName, isDue } from "./utils/contacts";

function App() {
  const [contacts, setContacts] = useLocalStorage(STORAGE_KEY, starterContacts);
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("همه");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState([]);
  // فرم افزودن/ویرایش: null | { contact }  (contact = null یعنی افزودن)
  const [formModal, setFormModal] = useState(null);
  // مودال تأیید: null | { type: "single" | "bulk" | "save" | "export", ... }
  const [confirm, setConfirm] = useState(null);
  const [notice, showNotice] = useNotice();

  const filteredContacts = useMemo(
    () => filterContacts(contacts, search, activeGroup, favoritesOnly),
    [contacts, search, activeGroup, favoritesOnly]
  );

  const favoriteCount = contacts.filter((c) => c.favorite).length;
  const dueCount = contacts.filter(isDue).length;
  const allVisibleSelected = filteredContacts.length > 0 && filteredContacts.every((c) => selected.includes(c.id));
  const pageTitle = favoritesOnly ? "علاقه‌مندی‌ها" : activeGroup === "همه" ? "مخاطبان" : activeGroup;

  function closeConfirm() {
    setConfirm(null);
  }

  // فرم معتبر است؛ قبل از ذخیره از کاربر تأیید می‌گیریم (فرم باز می‌ماند)
  function requestSave(cleaned, isEditing) {
    setConfirm({ type: "save", contact: cleaned, isEditing, name: fullName(cleaned) });
  }

  function performAction() {
    if (!confirm) return;

    if (confirm.type === "save") {
      if (confirm.isEditing) {
        setContacts((current) => current.map((c) => (c.id === confirm.contact.id ? confirm.contact : c)));
        showNotice("مخاطب با موفقیت ویرایش شد.");
      } else {
        setContacts((current) => [confirm.contact, ...current]);
        showNotice("مخاطب جدید اضافه شد.");
      }
      setFormModal(null);
    } else if (confirm.type === "single") {
      setContacts((current) => current.filter((c) => c.id !== confirm.id));
      setSelected((current) => current.filter((id) => id !== confirm.id));
      showNotice("مخاطب حذف شد.");
    } else if (confirm.type === "bulk") {
      setContacts((current) => current.filter((c) => !selected.includes(c.id)));
      setSelected([]);
      showNotice("مخاطبان انتخاب‌شده حذف شدند.");
    } else if (confirm.type === "export") {
      downloadJson(contacts, "contactflow-backup.json");
      showNotice("فایل پشتیبان آماده شد.");
    }

    setConfirm(null);
  }

  function toggleFavorite(id) {
    setContacts((current) => current.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c)));
  }

  function toggleSelected(id) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function toggleAllVisible() {
    const visibleIds = filteredContacts.map((c) => c.id);
    setSelected((current) =>
      allVisibleSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : [...new Set([...current, ...visibleIds])]
    );
  }

  function showAllContacts() {
    setActiveGroup("همه");
    setFavoritesOnly(false);
  }

  function toggleGroup(group) {
    setActiveGroup(activeGroup === group ? "همه" : group);
    setFavoritesOnly(false);
  }

  function changeGroup(group) {
    setActiveGroup(group);
    setFavoritesOnly(false);
  }

  function clearFilters() {
    setSearch("");
    showAllContacts();
  }

  return (
    <div className="app-shell">
      <Sidebar
        contacts={contacts}
        activeGroup={activeGroup}
        favoritesOnly={favoritesOnly}
        favoriteCount={favoriteCount}
        onShowAll={showAllContacts}
        onToggleFavorites={() => setFavoritesOnly((value) => !value)}
        onToggleGroup={toggleGroup}
      />

      <main className="main-content">
        <PageHeader title={pageTitle} onAdd={() => setFormModal({ contact: null })} />
        <StatsGrid total={contacts.length} favoriteCount={favoriteCount} dueCount={dueCount} />

        <section className="contacts-section">
          <div className="section-heading">
            <div>
              <h2>دفترچه مخاطبان</h2>
              <p>اطلاعات را ببین، دسته‌بندی کن و به‌روز نگه دار.</p>
            </div>
            <button className="text-button" onClick={() => setConfirm({ type: "export" })}>↓ خروجی پشتیبان</button>
          </div>

          <ContactToolbar search={search} onSearchChange={setSearch} activeGroup={activeGroup} onGroupChange={changeGroup} />

          <BulkBar count={selected.length} onDelete={() => setConfirm({ type: "bulk" })} onCancel={() => setSelected([])} />

          <ContactTable
            contacts={filteredContacts}
            selected={selected}
            allVisibleSelected={allVisibleSelected}
            onToggleAll={toggleAllVisible}
            onToggleSelected={toggleSelected}
            onToggleFavorite={toggleFavorite}
            onEdit={(contact) => setFormModal({ contact })}
            onDelete={(contact) => setConfirm({ type: "single", id: contact.id, name: fullName(contact) })}
            onClearFilters={clearFilters}
          />

          <div className="table-footer">
            <span>نمایش {filteredContacts.length} از {contacts.length} مخاطب</span>
            <span>ذخیره‌سازی خودکار روی همین مرورگر <i className="saved-dot"></i></span>
          </div>
        </section>

        <footer className="footer"><span>دفتر من</span><span>ساده، مرتب، قابل اعتماد.</span></footer>
      </main>

      <Toast message={notice} />

      {formModal && (
        <ContactFormModal
          contact={formModal.contact}
          contacts={contacts}
          onSave={requestSave}
          onClose={() => setFormModal(null)}
        />
      )}

      {/* بعد از فرم رندر می‌شود تا روی آن نمایش داده شود */}
      {confirm && (
        <ConfirmModal confirm={confirm} selectedCount={selected.length} onConfirm={performAction} onClose={closeConfirm} />
      )}
    </div>
  );
}

export default App;
