import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  message: string;
};
type ThemeProps = "dark" | "light";
type UIContextType = {
  showModal: (modal: ModalProps) => void;
  closeModal: () => void;
  modal: ModalProps | null;
  toggleTheme: () => void;
  theme: ThemeProps;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalProps | null>(null);
  const [theme, setTheme] = useState<ThemeProps>("dark");

  const showModal = (modal: ModalProps) => setModal(modal);
  const closeModal = () => setModal(null);
const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "light" : "dark");
}
  return (
    <UIContext.Provider value={{ showModal, closeModal, modal, toggleTheme, theme }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI debe usarse dentro de <UIProvider>");
  return context;
}
