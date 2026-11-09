import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ContactList from "../../components/ContactList/ContactList";
import Loader from "../../components/Loader/Loader";
import Modal from "../../components/Modal/Modal";
import Option from "../../components/options/Option";
import { useContacts } from "../../context/contactProvider/contactProvider";
import { useOption } from "../../context/OptionProvider/OptionProvider";
import styles from "./HomePage.module.scss";

export default function HomePage() {
  const { contacts, loading, selected, toggleSelect, selectAll, clearSelect, removeContact, removeMany } =
    useContacts();
  const { state } = useOption();
  const [confirm, setConfirm] = useState(null); // array of ids to delete

  const visible = useMemo(() => {
    const q = state.search.trim().toLowerCase();
    const filtered = contacts.filter((c) =>
      `${c.name} ${c.lastName} ${c.email} ${c.phone}`.toLowerCase().includes(q)
    );
    const sorted = [...filtered];
    if (state.sort === "newest") sorted.sort((a, b) => b.createdAt - a.createdAt);
    if (state.sort === "oldest") sorted.sort((a, b) => a.createdAt - b.createdAt);
    if (state.sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name, "fa"));
    return sorted;
  }, [contacts, state]);

  const allSelected = visible.length > 0 && visible.every((c) => selected.includes(c.id));

  const handleConfirm = async () => {
    if (confirm.length === 1) await removeContact(confirm[0]);
    else await removeMany(confirm);
    setConfirm(null);
  };

  return (
    <section>
      <div className={styles.top}>
        <h2>مخاطبین ({contacts.length})</h2>
        <Link to="/add" className={styles.add}>+ مخاطب جدید</Link>
      </div>

      <Option />

      {selected.length > 0 && (
        <div className={styles.bulk}>
          <span>{selected.length} مورد انتخاب شده</span>
          <button onClick={() => setConfirm(selected)}>حذف انتخاب‌شده‌ها</button>
          <button onClick={clearSelect}>لغو انتخاب</button>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <>
          {visible.length > 0 && (
            <label className={styles.selectAll}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => (allSelected ? clearSelect() : selectAll(visible.map((c) => c.id)))}
              />
              انتخاب همه
            </label>
          )}
          <ContactList
            contacts={visible}
            selected={selected}
            onSelect={toggleSelect}
            onDelete={(id) => setConfirm([id])}
          />
        </>
      )}

      {confirm && (
        <Modal
          title="حذف مخاطب"
          message={`آیا از حذف ${confirm.length} مخاطب مطمئن هستید؟`}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </section>
  );
}
