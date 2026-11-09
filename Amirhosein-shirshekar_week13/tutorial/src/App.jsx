import Tabs from "./components/Tabs/Tabs";
import { TABS } from "./data/tabs";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Tabs title="Tabs Component with React" tabs={TABS} />
    </div>
  );
}
