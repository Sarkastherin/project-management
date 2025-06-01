import ModalBase from "./Modals";
import { useUI } from "~/context/UIContext";
type ModalState = {
  title: string;
  message: string;
} | null;
export default function MainLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { modal, closeModal } = useUI();
  return (
    <>
      <div className="h-screen flex flex-col bg-neutral-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
        {children}
        {modal && (
          <ModalBase
            title={modal.title}
            message={modal.message}
            onClose={closeModal}
          />
        )}
      </div>
    </>
  );
}
