import { useNavigate, useParams } from "react-router-dom";
import ContactForm from "../../components/ContactForm/ContactForm";
import Loader from "../../components/Loader/Loader";
import { useContacts } from "../../context/contactProvider/contactProvider";

export default function EditContact() {
  const { id } = useParams();
  const { contacts, loading, editContact } = useContacts();
  const navigate = useNavigate();

  if (loading) return <Loader />;
  const contact = contacts.find((c) => String(c.id) === id);
  if (!contact) return <p>مخاطب پیدا نشد</p>;

  const handleSubmit = async (values) => {
    if (await editContact(contact.id, { ...contact, ...values })) navigate("/");
  };

  return (
    <section>
      <h2 style={{ marginBottom: 16 }}>ویرایش مخاطب</h2>
      <ContactForm initialValues={contact} onSubmit={handleSubmit} submitLabel="ذخیره تغییرات" />
    </section>
  );
}
