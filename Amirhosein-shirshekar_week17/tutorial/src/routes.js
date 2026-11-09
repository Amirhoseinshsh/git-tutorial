import HomePage from "./Pages/HomePage/HomePage";
import AddContact from "./Pages/AddContact/AddContact";
import EditContact from "./Pages/EditContact/EditContact";
import NotFound from "./Pages/NotFound/NotFound";

const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/add", element: <AddContact /> },
  { path: "/edit/:id", element: <EditContact /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
