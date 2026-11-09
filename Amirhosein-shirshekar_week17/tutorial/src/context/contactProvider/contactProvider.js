import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact,
} from "../../services/httpRequest";
import { useAlert } from "../AlertProvider/AlertProvider";

const ContactContext = createContext();

export const useContacts = () => useContext(ContactContext);

/* ---------- Flux-like: state + reducer + actions ---------- */
const initialState = { contacts: [], loading: true, selected: [] };

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, contacts: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false };
    case "ADD":
      return { ...state, contacts: [...state.contacts, action.payload] };
    case "UPDATE":
      return {
        ...state,
        contacts: state.contacts.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case "DELETE":
      return {
        ...state,
        contacts: state.contacts.filter((c) => c.id !== action.payload),
        selected: state.selected.filter((id) => id !== action.payload),
      };
    case "DELETE_MANY":
      return {
        ...state,
        contacts: state.contacts.filter((c) => !action.payload.includes(c.id)),
        selected: [],
      };
    case "TOGGLE_SELECT":
      return {
        ...state,
        selected: state.selected.includes(action.payload)
          ? state.selected.filter((id) => id !== action.payload)
          : [...state.selected, action.payload],
      };
    case "SELECT_ALL":
      return { ...state, selected: action.payload };
    case "CLEAR_SELECT":
      return { ...state, selected: [] };
    default:
      return state;
  }
}

export default function ContactProvider({ children }) {
  const { showAlert } = useAlert();
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchContacts = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const { data } = await getContacts();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch {
      dispatch({ type: "FETCH_ERROR" });
      showAlert("error", "خطا در دریافت مخاطبین. آیا json-server روشن است؟");
    }
  }, [showAlert]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const addContact = async (contact) => {
    try {
      const { data } = await createContact({ ...contact, createdAt: Date.now() });
      dispatch({ type: "ADD", payload: data });
      showAlert("success", "مخاطب با موفقیت اضافه شد");
      return true;
    } catch {
      showAlert("error", "خطا در افزودن مخاطب");
      return false;
    }
  };

  const editContact = async (id, contact) => {
    try {
      const { data } = await updateContact(id, contact);
      dispatch({ type: "UPDATE", payload: data });
      showAlert("success", "مخاطب با موفقیت ویرایش شد");
      return true;
    } catch {
      showAlert("error", "خطا در ویرایش مخاطب");
      return false;
    }
  };

  const removeContact = async (id) => {
    try {
      await deleteContact(id);
      dispatch({ type: "DELETE", payload: id });
      showAlert("success", "مخاطب حذف شد");
    } catch {
      showAlert("error", "خطا در حذف مخاطب");
    }
  };

  const removeMany = async (ids) => {
    try {
      await Promise.all(ids.map((id) => deleteContact(id)));
      dispatch({ type: "DELETE_MANY", payload: ids });
      showAlert("success", `${ids.length} مخاطب حذف شد`);
    } catch {
      showAlert("error", "خطا در حذف گروهی");
      fetchContacts();
    }
  };

  const toggleSelect = (id) => dispatch({ type: "TOGGLE_SELECT", payload: id });
  const selectAll = (ids) => dispatch({ type: "SELECT_ALL", payload: ids });
  const clearSelect = () => dispatch({ type: "CLEAR_SELECT" });

  return (
    <ContactContext.Provider
      value={{
        ...state,
        addContact,
        editContact,
        removeContact,
        removeMany,
        toggleSelect,
        selectAll,
        clearSelect,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}
