import { createContext, useContext, useReducer } from "react";
import reducer from "./reducer";
import initStat from "./initStat";

const OptionContext = createContext();

export const useOption = () => useContext(OptionContext);

export default function OptionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initStat);
  return (
    <OptionContext.Provider value={{ state, dispatch }}>
      {children}
    </OptionContext.Provider>
  );
}
