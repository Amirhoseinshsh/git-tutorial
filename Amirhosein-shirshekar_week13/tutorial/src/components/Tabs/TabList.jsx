export default function TabList({ tabs, activeId, onChange }) {
  return (
    <nav className="tab-list" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={tab.id === activeId}
          className={`tab-list__item ${tab.id === activeId ? "is-active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.title}
        </button>
      ))}
    </nav>
  );
}
