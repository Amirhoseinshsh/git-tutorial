import axios from "axios";

const http = axios.create({ baseURL: "http://localhost:3001" });

export const getContacts = () => http.get("/contacts");
export const createContact = (data) => http.post("/contacts", data);
export const updateContact = (id, data) => http.put(`/contacts/${id}`, data);
export const deleteContact = (id) => http.delete(`/contacts/${id}`);

export default http;
