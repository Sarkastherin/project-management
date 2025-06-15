import type { Route } from "../../+types/root";
import { ContainerToForms } from "~/components/Generals/Containers";
import QuotesForm from "~/templates/QuotesForm";
import { useUI } from "~/context/UIContext";
import { ButtonCreateQuote } from "~/components/Specific/ButtonCreateQuote";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Oportunidad [Cotizaciones]" },
    { name: "description", content: "Oportunidad [Cotizaciones]" },
  ];
}
export default function Quotes() {
  const { selectedOpportunity } = useUI();
  const { phases, quotes, detailsItems, detailsMaterials } =
    selectedOpportunity || {};
  if (quotes?.length === 0) return <ButtonCreateQuote />;
  const quoteActive = quotes?.find((quote) => quote.active);
  const { id: id_quote_active } = quoteActive || {};
  const valuesForm = {
    id_phase: phases && phases.length > 0 ? phases[0].id : 0,
    items: detailsItems,
    materials: detailsMaterials,
  };
  return (
    <>
      {quoteActive && phases && (
        <div className="w-full px-8 mt-8 mx-auto pb-18">
          <QuotesForm phases={phases} defaultValues={valuesForm} />
        </div>
      )}
    </>
  );
}
