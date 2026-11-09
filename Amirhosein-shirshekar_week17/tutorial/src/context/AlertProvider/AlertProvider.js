import { createContext, useCallback, useContext, useRef, useState } from "react";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export default function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);
  const timer = useRef(null);

  const showAlert = useCallback((type, message, ms = 3000) => {
    clearTimeout(timer.current);
    setAlert({ type, message });
    timer.current = setTimeout(() => setAlert(null), ms);
  }, []);

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      {children}
    </AlertContext.Provider>
  );
}
