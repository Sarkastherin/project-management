import type { Route } from "./+types/home";
import { ContainerWithTitle } from "~/components/Generals/Containers";
import { MaterialForm } from "~/templates/MaterialForm";
import { useUI } from "~/context/UIContext";
import ModalPrice from "~/components/Specific/ModalPrice";
import { Button } from "~/components/Forms/Buttons";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nuevo Material" },
    { name: "description", content: "Nuevo Material" },
  ];
}

export default function Material() {
  const { selectedMaterial, setOpenPriceModal } = useUI();
  return (
    <>
      {selectedMaterial && (
        <>
          <ContainerWithTitle
            title={`Material: ${selectedMaterial.description}`}
          >
            <MaterialForm mode="view" defaultValues={selectedMaterial} />
            <Button
              title="Abrir precios"
              onClick={() => setOpenPriceModal(true)}
            >
              Abrir Precios
            </Button>
          </ContainerWithTitle>

          <ModalPrice
            idMaterial={selectedMaterial.id}
            defaultValues={{prices: selectedMaterial.prices}}
          />
        </>
      )}
    </>
  );
}
