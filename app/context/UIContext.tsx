import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useContacts, type ClientDataType } from "./ContactsContext";
import type { ModalBaseProps } from "~/components/Generals/Modals";
import type {
  OpportunityType,
  PhasesType,
  QuotesType,
  ProfitMarginType,
  DetailsItemsType,
  DetailsMaterialsType,
  FamilyType,
  CategoryType,
  SubCategoryType,
  UnitsType,
  MaterialsType,
  PricesType
} from "~/backend/dataBase";
import {
  opportunityApi,
  phasesApi,
  quotesApi,
  profitMarginApi,
  detailsItemsApi,
  detailsMaterialsApi,
  familyApi,
  categoryApi,
  subcategoryApi,
  unitsApi,
} from "~/backend/dataBase";

export type OpportunitiesWithClient = OpportunityType & {
  client: ClientDataType;
};
export type OpportunityAll = OpportunityType & {
  phases: PhasesType[];
  quotes: QuotesType[] | [];
  profitMargins: ProfitMarginType[] | [];
  detailsItems: DetailsItemsType[] | [];
  detailsMaterials: DetailsMaterialsType[] | [];
};
type DirtyFields = {
  [key: string]: boolean | object;
};
type ModalProps = Omit<ModalBaseProps, "onClose">;
type ThemeProps = "dark" | "light";
type CategorizationsProps = {
  families: FamilyType[] | null;
  categories: CategoryType[] | null;
  subcategories: SubCategoryType[] | null;
  units: UnitsType[] | null;
};
type SelectedMaterialType = MaterialsType & {
  prices: PricesType[] | [] 
}
type UIContextType = {
  showModal: (modal: ModalProps) => void;
  closeModal: () => void;
  modal: ModalProps | null;
  toggleTheme: () => void;
  theme: ThemeProps;
  openClientModal: boolean;
  openSupplierModal: boolean;
  openPriceModal: boolean;
  setOpenPriceModal:React.Dispatch<React.SetStateAction<boolean>>;
  setOpenClientModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSupplierModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedClient: ClientDataType | null;
  setSelectedClient: React.Dispatch<
    React.SetStateAction<ClientDataType | null>
  >;
  selectedSupplier: ClientDataType | null;
  setSelectedSupplier: React.Dispatch<
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
  handleSetIsFieldsChanged: (
    dirtyFields: DirtyFields,
    isSubmitSuccessful: boolean
  ) => void;
  categorizations: CategorizationsProps | null;
  setCategorizations: React.Dispatch<
    React.SetStateAction<CategorizationsProps | null>
  >;
  getCategorizations: () => Promise<void>;
  selectedMaterial: SelectedMaterialType | null;
  setSelectedMaterial: React.Dispatch<React.SetStateAction<SelectedMaterialType | null>>
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [selectedSupplier, setSelectedSupplier] = useState<ClientDataType | null>(
    null
  );
  const [openSupplierModal, setOpenSupplierModal] =useState<boolean>(false);
  const [categorizations, setCategorizations] =
    useState<CategorizationsProps | null>(null);
  const [isFieldsChanged, setIsFieldsChanged] = useState<boolean>(false);
  const [isModeEdit, setIsModeEdit] = useState<boolean>(false);
  const { clients } = useContacts();
  const [modal, setModal] = useState<ModalProps | null>(null);
  const [theme, setTheme] = useState<ThemeProps>("dark");
  const [openClientModal, setOpenClientModal] = useState<boolean>(false);
  const [openPriceModal, setOpenPriceModal] = useState<boolean>(false)
  const [selectedClient, setSelectedClient] = useState<ClientDataType | null>(
    null
  );
  const showModal = (modal: ModalProps) => setModal(modal);
  const closeModal = () => setModal(null);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<OpportunityAll | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<SelectedMaterialType | null>(null)
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    document.documentElement.setAttribute(
      "data-theme",
      theme === "dark" ? "light" : "dark"
    );
  };

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

      //obteniendo cotizaciones
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
          detailsItems: [],
          detailsMaterials: [],
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
      // obteniendo detalles de cotizaciones
      const idsQuotes = quotes.map((quote) => quote.id);
      const { data: detailsItems, error: errorDetailsItems } =
        await detailsItemsApi.getDataByEveryIds(idsQuotes, "id_quote");
      if (errorDetailsItems) {
        throw new Error(
          `No se pudo obtener los detalles de las cotizaciones del id ${id} | Error message: ${errorDetailsItems}`
        );
      }
      const { data: detailsMaterials, error: errorDetailsMaterials } =
        await detailsMaterialsApi.getDataByEveryIds(idsQuotes, "id_quote");
      if (errorDetailsMaterials) {
        throw new Error(
          `No se pudo obtener los detalles de los materiales del id ${id} | Error message: ${errorDetailsMaterials}`
        );
      }
      const dataCompleted = {
        ...data,
        phases: phases,
        quotes: quotes ?? [],
        profitMargins: profitMargins ?? [],
        detailsItems: detailsItems ?? [],
        detailsMaterials: detailsMaterials ?? [],
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
  const handleSetIsFieldsChanged = (
    dirtyFields: DirtyFields,
    isSubmitSuccessful: boolean
  ): void => {
    const hasChange =
      Object.values(dirtyFields).some((value) => value === true) || false;
    setIsFieldsChanged?.(hasChange);
    if (isSubmitSuccessful) {
      setIsFieldsChanged(false);
    }
  };
  const getCategorizations = async () => {
    try {
      const { data: dataFamily, error: errorFamily } = await familyApi.getAll(
        {}
      );
      if (errorFamily)
        throw new Error(
          `No se pudo obtener la familia | Error: ${errorFamily}`
        );

      const { data: dataCategory, error: errorCategory } =
        await categoryApi.getAll({});
      if (errorCategory)
        throw new Error(
          `No se pudo obtener los rubros | Error: ${errorCategory}`
        );

      const { data: dataSucategory, error: errorSucategory } =
        await subcategoryApi.getAll({});
      if (errorSucategory)
        throw new Error(
          `No se pudo obtener los sub-rubros | Error: ${errorSucategory}`
        );
      const { data: dataUnits, error: errorUnits } = await unitsApi.getAll({});
      if (errorUnits)
        throw new Error(
          `No se pudo obtener las unidades | Error: ${errorUnits}`
        );
      setCategorizations({
        families: dataFamily,
        categories: dataCategory,
        subcategories: dataSucategory,
        units: dataUnits,
      });
    } catch (e) {
      showModal({
        title: "Error",
        message: "Problemas al obtener datos",
        code: String(e),
        variant: "error",
      });
    }
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
        setSelectedClient,
        selectedOpportunity,
        setSelectedOpportunity,
        getOpportunity,
        refreshOpportunity,
        isModeEdit,
        setIsModeEdit,
        isFieldsChanged,
        setIsFieldsChanged,
        handleSetIsFieldsChanged,
        categorizations,
        setCategorizations,
        getCategorizations,
        selectedMaterial,
        setSelectedMaterial,
        openPriceModal,
        setOpenPriceModal,
        openSupplierModal,
        setOpenSupplierModal,
        selectedSupplier,
        setSelectedSupplier
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
