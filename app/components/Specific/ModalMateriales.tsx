import { Button } from "../Forms/Buttons";
import { useUI } from "~/context/UIContext";
import { MaterialTable } from "~/templates/MaterialTable";
import type { HandleRowClicked } from "~/templates/MaterialTable";
import type { PricesType } from "~/backend/dataBase";
import type { MaterialTypeDB } from "~/context/UIContext";
type ModalPriceProps = {
  activeIndex: number | null;
  onSelectMaterial: (index: number, material: MaterialTypeDB) => void;
};
export default function ModalMateriales({
  activeIndex,
  onSelectMaterial,
}: ModalPriceProps) {
  const { openMaterialsModal, setOpenMaterialsModal } = useUI();
  const handleRowClicked: HandleRowClicked = (data) => {
    if (activeIndex !== null) {
      onSelectMaterial(activeIndex, data);
      setOpenMaterialsModal(false);
    }
  };
  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-start bg-white/10 p-4 ${
        !openMaterialsModal && "hidden"
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
            Listado de Materiales
          </h2>

          <button
            type="button"
            onClick={() => setOpenMaterialsModal(false)}
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
          <MaterialTable
            handleRowClicked={handleRowClicked}
            paginationPerPage={10}
          />
        </div>

        <footer className="mt-6 flex justify-end">
          <Button
            type="button"
            onClick={() => setOpenMaterialsModal(false)}
            variant="secondary"
          >
            Cerrar
          </Button>
        </footer>
      </div>
    </div>
  );
}
