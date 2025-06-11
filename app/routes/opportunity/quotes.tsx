import type { Route } from "../../+types/root";
import { ContainerToForms } from "~/components/Generals/Containers";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Oportunidad [Cotizaciones]" },
    { name: "description", content: "Oportunidad [Cotizaciones]" },
  ];
}
export default function Quotes() {
  return (
      <ContainerToForms>
        <h2 className="text-2xl font-bold">Cotizacion Oportunidad Id:</h2>
        <div className="flex flex-col gap-4 mt-4">
        
        </div>
      </ContainerToForms>
  );
}
