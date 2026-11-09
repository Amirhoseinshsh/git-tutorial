import { useNavigate } from "react-router-dom";
import ContactForm from "../../components/ContactForm/ContactForm";
import { useContacts } from "../../context/contactProvider/contactProvider";

export default function AddContact() {
  const { addContact } = useContacts();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    if (await addContact(values)) navigate("/");
  };

  return (
    <section>
      <h2 style={{ marginBottom: 16 }}>افزودن مخاطب</h2>
      <ContactForm onSubmit={handleSubmit} submitLabel="افزودن" />
    </section>
  );
}
