import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useContacts, type ClientDataType } from "./ContactsContext";
import type { ModalBaseProps } from "~/components/Generals/Modals";
import type {
  OpportunityType,
  PhasesType,
  QuotesType,
  ProfitMarginType,
} from "~/backend/dataBase";
import {
  opportunityApi,
  phasesApi,
  quotesApi,
  profitMarginApi,
} from "~/backend/dataBase";

export type OpportunitiesWithClient = OpportunityType & {
  client: ClientDataType;
};
export type OpportunityAll = OpportunityType & {
  phases: PhasesType[];
  quotes: QuotesType[] | [];
  profitMargins: ProfitMarginType[] | [];
};
type DirtyFields = {
    [key: string]: boolean | object;
  }
type ModalProps = Omit<ModalBaseProps, "onClose">;
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
  setSelectedClient: React.Dispatch<
    React.SetStateAction<ClientDataType | null>
  >;
  selectedOpportunity: OpportunityAll | null;
  setSelectedOpportunity: React.Dispatch<
    React.SetStateAction<OpportunityAll | null>
  >;
  getOpportunity: (id: number) => Promise<void>;
  refreshOpportunity: () => Promise<void>;
  isModeEdit: boolean;
  setIsModeEdit: React.Dispatch<React.SetStateAction<boolean>>;
  isFieldsChanged: boolean;
  setIsFieldsChanged: React.Dispatch<React.SetStateAction<boolean>>;
  handleSetIsFieldsChanged: (dirtyFields: DirtyFields, isSubmitSuccessful: boolean) => void;
};


const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isFieldsChanged, setIsFieldsChanged] =
    useState<boolean>(false);
  const [isModeEdit, setIsModeEdit] = useState<boolean>(false);
  const { clients } = useContacts();
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
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<OpportunityAll | null>(null);
  const getOpportunity = async (id: number) => {
    if (!clients || clients.length === 0) {
      console.log("No hay clientes disponibles, obteniendo clientes...");
      return;
    }
    try {
      const { data, error } = await opportunityApi.getById({ id: id });
      if (error)
        throw new Error(
          `No se pudo obtener la información del id ${id} | Error message: ${error}`
        );
      if (!data || !("id_client" in data)) {
        throw new Error("No se pudo obtener el id del cliente");
      }
      const { id_client } = data;
      //obteniendo cliente
      const client = clients.find((itemClient) => itemClient.id === id_client);
      if (!client) throw new Error("Cliente no encontrado");
      setSelectedClient(client);
      //obteniendo etapas
      const { data: phases, error: errorPhases } =
        await phasesApi.getDataByAnyColumn({
          column: "id_opportunity",
          id: id,
        });
      if (errorPhases)
        throw new Error(
          `No se pudo obtener las etapas del id ${id} | Error message: ${error}`
        );
      if (!phases || phases.length === 0)
        throw new Error(
          "No se encontraron etapas relacionadas con esta oportunidad"
        );

      //obteniendo cotizacion
      const { data: quotes, error: errorQuotes } =
        await quotesApi.getDataByAnyColumn({
          column: "id_opportunity",
          id: id,
        });
      if (errorQuotes)
        throw new Error(
          `No se pudo obtener las cotizaciones del id ${id} | Error message: ${errorQuotes}`
        );
      if (!quotes || quotes.length === 0) {
        setSelectedOpportunity({
          ...data,
          phases: phases,
          quotes: quotes ?? [],
          profitMargins: [],
        });
        return;
      }
      // obteniendo margenes de ganancia
      const { data: profitMargins, error: errorProfitMargins } =
        await profitMarginApi.getDataByAnyColumn({
          column: "id_opportunity",
          id: id,
        });
      if (errorProfitMargins)
        throw new Error(
          `No se pudo obtener los margenes de ganancia del id ${id} | Error message: ${errorProfitMargins}`
        );
      const dataCompleted = {
        ...data,
        phases: phases,
        quotes: quotes ?? [],
        profitMargins: profitMargins ?? [],
      };
      setSelectedOpportunity(dataCompleted);
    } catch (e) {
      showModal({
        title: "Error",
        message: `No se pudo obtener la oportunidad`,
        variant: "error",
        code: String(e),
      });
      console.error(e);
    }
  };
  const refreshOpportunity = async () => {
    if (!selectedOpportunity) return;
    const { id } = selectedOpportunity;
    await getOpportunity(id);
  };
  const handleSetIsFieldsChanged = (dirtyFields: DirtyFields, isSubmitSuccessful: boolean): void => {
    const hasChange = Object.values(dirtyFields).some((value) => value === true) || false;
    setIsFieldsChanged?.(hasChange);
    if(isSubmitSuccessful) {
      setIsFieldsChanged(false);
    }
  }
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
        setSelectedClient,
        selectedOpportunity,
        setSelectedOpportunity,
        getOpportunity,
        refreshOpportunity,
        isModeEdit,
        setIsModeEdit,
        isFieldsChanged,
        setIsFieldsChanged,
        handleSetIsFieldsChanged
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
