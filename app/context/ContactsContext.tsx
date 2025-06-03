import { createContext, useContext, useState, type ReactNode } from "react";
type ContactsContextType = {
  getClients: () => void;
};
type ContactsProviderProps = {
  children: ReactNode;
};
type ClientDataType = {
  cuenta_deud_venta2_id?: number;
  cuenta_deud_venta_id?: number;
  cuenta_proveedores2_id?: number;
  cuenta_proveedores_id?: number;
  cuit?: string;
  direccion?: string;
  email?: string;
  fecha_baja?: string;
  id: number;
  id_tributario_extranjero?: number;
  image?: string;
  is_disabled?: boolean
  nombre: string;
  nombre_fantasia?: string;
  observacion?: string;
  pais?: string;
  responsabilidad_afip?: string;
  telefono?: string;
  tipo?: string;
};
const ContactsContext = createContext<ContactsContextType | undefined>(
  undefined
);
export const useContacts = (): ContactsContextType => {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error("useContacts must be used within aun ContactsProvider");
  }
  return context;
};
export const ContactsProvider = ({ children }: ContactsProviderProps) => {
  const [clientes, setClientes] = useState<Array<ClientDataType>>([]);
  const getClients = async () => {
    const myClientData = [];
    try {
      let page = 1;
      const page_size = 100;
      let has_more = true;
      while (has_more) {
        const response = await fetch("/.netlify/functions/contactos", {
          method: "POST",
          body: JSON.stringify({ page, page_size }),
        });
        const data = await response.json();
        myClientData.push(...data.data);
        has_more = data.has_more;
        page++;
      }
      setClientes(myClientData);
    } catch (error) {
      console.error("Error al obtener clientes desde función:", error);
    }
  };
  return (
    <ContactsContext.Provider value={{ getClients }}>
      {children}
    </ContactsContext.Provider>
  );
};
