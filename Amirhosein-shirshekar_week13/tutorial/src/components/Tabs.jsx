import { useState, useEffect } from "react";
import "./Tabs.css";

const STORAGE_KEY = "lastActiveTab";

function getInitialTab(tabs) {
  try {
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    if (tabs.some((t) => t.id === saved)) return saved;
  } catch (e) {}
  return tabs[0].id;
}

function Tabs({ tabs }) {
  const [activeId, setActiveId] = useState(() => getInitialTab(tabs));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(activeId));
    } catch (e) {}
  }, [activeId]);

  const active = tabs.find((t) => t.id === activeId);

  return (
    <>
      <header className="header">
        <h1>Tabs Component with React</h1>
        <nav className="tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={"tab" + (t.id === activeId ? " active" : "")}
              onClick={() => setActiveId(t.id)}
            >
              {t.title}
            </button>
          ))}
        </nav>
      </header>
      <main className="content" key={active.id}>
        <h2>{active.heading}</h2>
        <p>{active.text}</p>
      </main>
    </>
  );
}

export default Tabs;
