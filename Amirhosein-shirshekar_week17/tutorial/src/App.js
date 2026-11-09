import { Link, useRoutes } from "react-router-dom";
import routes from "./routes";
import Alert from "./components/Alert/Alert";
import "./App.scss";

function App() {
  const element = useRoutes(routes);
  return (
    <div className="app">
      <header className="app__header">
        <Link to="/"><h1>📒 لیست مخاطبین</h1></Link>
      </header>
      <main className="app__main">{element}</main>
      <Alert />
    </div>
  );
}

export default App;
