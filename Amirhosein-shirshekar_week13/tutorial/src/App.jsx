import Tabs from "./components/Tabs";

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla venenatis ante augue. Phasellus volutpat neque ac dui mattis vulputate. Etiam consequat aliquam cursus. In sodales pretium ultrices. Maecenas lectus est, sollicitudin consectetur felis nec, feugiat ultricies mi.";

const TABS = [1, 2, 3, 4].map((n) => ({
  id: n,
  title: `Tab ${n}`,
  heading: `Content ${n}`,
  text: LOREM,
}));

function App() {
  return <Tabs tabs={TABS} />;
}

export default App;
