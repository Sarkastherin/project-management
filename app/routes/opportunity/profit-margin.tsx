import type { Route } from "../../+types/root";
import { useUI } from "~/context/UIContext";
import { ContainerToForms } from "~/components/Generals/Containers";
import ProfitMarginsForm from "~/templates/ProfitMarginsForm";
import type { ProfitMarginType } from "~/backend/dataBase";
import {
  ButtonCreateQuote,
  ButtonNavigateDetails,
} from "~/components/Specific/ButtonCreateQuote";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Oportunidad [Cotizaciones]" },
    { name: "description", content: "Oportunidad [Cotizaciones]" },
  ];
}

export default function ProfitMargins() {
  const { selectedOpportunity } = useUI();
  const { quotes, profit_margins } = selectedOpportunity || {};
  if (quotes?.length === 0) return <ButtonCreateQuote />;
  else if (profit_margins?.length === 0) {
    return <ButtonNavigateDetails />;
  }
  const { id } = quotes?.find((quote) => quote.active) || {};
  const profitMargin = profit_margins?.find(
    (margin: ProfitMarginType) => margin.id_quote === id
  );
  return (
    <ContainerToForms>
      {profitMargin && (
        <ProfitMarginsForm defaultValues={profitMargin} />
      )}
    </ContainerToForms>
  );
}
