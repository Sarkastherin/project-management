import { Outlet } from "react-router";
import ModalBase from "~/components/Generals/Modals";
import { useUI } from "~/context/UIContext";
import Header from "~/components/Generals/Header";
import { ContactsProvider } from "~/context/ContactsContext";
export default function MainLayout() {
  const { modal, closeModal } = useUI();
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
