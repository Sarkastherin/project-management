import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { ClientDataType } from "./ContactsContext";

type ModalProps = {
  title: string;
  message: React.ReactNode;
};
type ThemeProps = "dark" | "light";
type UIContextType = {
  showModal: (modal: ModalProps) => void;
  closeModal: () => void;
  modal: ModalProps | null;
  toggleTheme: () => void;
  theme: ThemeProps;
  openClientModal: boolean;
  setOpenClientModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedClient: ClientDataType | null;
  setSelectedClient: React.Dispatch<React.SetStateAction<ClientDataType | null>>;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalProps | null>(null);
  const [theme, setTheme] = useState<ThemeProps>("dark");
  const [openClientModal, setOpenClientModal] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<ClientDataType | null>(
    null
  );

  const showModal = (modal: ModalProps) => setModal(modal);
  const closeModal = () => setModal(null);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    document.documentElement.setAttribute(
      "data-theme",
      theme === "dark" ? "light" : "dark"
    );
  };
  return (
    <UIContext.Provider
      value={{
        showModal,
        closeModal,
        modal,
        toggleTheme,
        theme,
        openClientModal,
        setOpenClientModal,
        selectedClient,
        setSelectedClient
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI debe usarse dentro de <UIProvider>");
  return context;
}
