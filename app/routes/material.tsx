import type { Route } from "./+types/home";
import { ContainerWithTitle } from "~/components/Generals/Containers";
import { useAuth } from "~/context/AuthContext";
import { MaterialForm } from "~/templates/MaterialForm";
import { useUI } from "~/context/UIContext";
import PricesForm from "~/templates/PricesForm";
import { CardToggle } from "~/components/Generals/Cards";
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
  //console.log(selectedMaterial.prices)
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
