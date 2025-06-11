import { Button } from "../Forms/Buttons";
import { useState, useEffect } from "react";
import type { ClientDataType } from "~/context/ContactsContext";
import type { TableColumn } from "react-data-table-component";
import { useContacts } from "~/context/ContactsContext";
import DataTable from "react-data-table-component";
import { customStyles } from "../Generals/Tables";
import { useUI } from "~/context/UIContext";
import { Input } from "../Forms/Inputs";
const columns: TableColumn<ClientDataType>[] = [
  {
    name: "Id",
    selector: (row) => row.id,
    width: "80px",
  },
  {
    name: "Cliente",
    selector: (row) => row.nombre,
    wrap: true,
  },
  {
    name: "CUIT",
    selector: (row) => row.cuit || "",
    width: "150px",
  },
];

export default function ModalClientes() {
  const [clientsData, setClientsData] = useState<ClientDataType[]>([]);
  const { theme,openClientModal, setOpenClientModal, setSelectedClient } = useUI();
  const { clients } = useContacts();
  const onFilter = () => {
    const inputElement = document.getElementById("searchText") as HTMLInputElement | null;
    const searchText = inputElement ? inputElement.value.toLocaleLowerCase() : "";
    const filterData = clients.filter((client) => {
      const nombres = client.nombre.toLocaleLowerCase().includes(searchText);
      const cuit = client.cuit?.toLocaleLowerCase().includes(searchText);
      return nombres || cuit;
    });
    setClientsData(filterData);
  };
  useEffect(() => {
    if (clients.length > 0) {
      setClientsData(clients);
    }
  }, [clients]);
  const handleRowClicked = (data:ClientDataType) => {
     setSelectedClient(data);
     setOpenClientModal(false)
  }
  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-start bg-white/10 p-4 ${
        !openClientModal && "hidden"
      }`}
      role="dialog"
      aria-modal="false"
      aria-labelledby="modalTitle"
    >
      <div className="w-full lg:w-4xl  rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
        <div className="flex items-start justify-between">
          <h2
            id="modalTitle"
            className="text-xl font-bold text-zinc-900 sm:text-2xl dark:text-white"
          >
            Listado de Clientes
          </h2>

          <button
            type="button"
            onClick={()=>setOpenClientModal(false)}
            className="-me-4 -mt-4 rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600 focus:outline-none dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mt-4">
          <Input
            type="search"
            placeholder="Buscar por nombre o CUIT"
            id="searchText"
            onChange={onFilter}
          />
          {clientsData.length > 0 && (
            <>
              <DataTable
                columns={columns}
                data={clientsData}
                pagination
                customStyles={customStyles}
                theme={theme}
                onRowClicked={handleRowClicked}
                pointerOnHover
                highlightOnHover
              />
            </>
          )}
        </div>

        <footer className="mt-6 flex justify-end">
          <Button type="button" onClick={()=>setOpenClientModal(false)} variant="secondary">
            Cerrar
          </Button>
        </footer>
      </div>
    </div>
  );
}
