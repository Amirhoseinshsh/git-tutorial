export default function TabPanel({ tab }) {
  // key forces remount so the fade animation plays on every tab change
  return (
    <main className="tab-panel" role="tabpanel" key={tab.id}>
      <h2>{tab.heading}</h2>
      <p>{tab.text}</p>
    </main>
  );
}
