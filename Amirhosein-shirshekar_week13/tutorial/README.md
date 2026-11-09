# Tabs Component with React

Week 13 mini-project: a Tabs component built with React only (no extra packages).

## Run
```bash
npm install
npm run dev
```

## Structure
```
src/
├── main.jsx                 # entry point
├── App.jsx                  # composes Header + Tabs
├── App.css
├── index.css                # global styles
├── data/tabs.js             # tabs data
├── hooks/useLocalStorage.js # remembers the last active tab
└── components/
    ├── Header/              # blue title bar
    └── Tabs/                # Tabs, TabList, TabPanel
```
