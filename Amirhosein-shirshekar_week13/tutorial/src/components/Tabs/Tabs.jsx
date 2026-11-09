import Header from "../Header/Header";
import TabList from "./TabList";
import TabPanel from "./TabPanel";
import useLocalStorage from "../../hooks/useLocalStorage";
import "./Tabs.css";

export default function Tabs({ title, tabs }) {
  const [savedId, setActiveId] = useLocalStorage("last-active-tab", tabs[0].id);

  // fall back to the first tab if the saved id no longer exists
  const activeTab = tabs.find((t) => t.id === savedId) ?? tabs[0];

  return (
    <>
      <Header title={title}>
        <TabList tabs={tabs} activeId={activeTab.id} onChange={setActiveId} />
      </Header>
      <TabPanel tab={activeTab} />
    </>
  );
}
