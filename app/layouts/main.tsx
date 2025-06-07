import { Outlet } from "react-router";
import ModalBase from "~/components/Generals/Modals";
import { useUI } from "~/context/UIContext";
import Header from "~/components/Generals/Header";
import { ContactsProvider } from "~/context/ContactsContext";
import { useAuth } from "~/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";
export default function MainLayout() {
  const { modal, closeModal } = useUI();
  const { auth, session } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
      auth();
      if (!session) navigate("/login");
    }, []);
  return (
    <>
      <Header />
      <ContactsProvider>
        <Outlet />
      </ContactsProvider>
      {modal && (
        <ModalBase
          title={modal.title}
          message={modal.message}
          onClose={closeModal}
        />
      )}
    </>
  );
}
