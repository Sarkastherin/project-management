import { Outlet } from "react-router";
import ModalBase from "~/components/Generals/Modals";
import { useUI } from "~/context/UIContext";
import Header from "~/components/Generals/Header";
export default function MainLayout() {
  const { modal, closeModal } = useUI();
  return (
    <>
      <Header />
      <Outlet />
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
