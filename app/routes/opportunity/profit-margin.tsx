import type { Route } from "../../+types/root";
import { useUI } from "~/context/UIContext";
import { ContainerToForms } from "~/components/Generals/Containers";
import ProfitMarginsForm from "~/templates/ProfitMarginsForm";
import {
  SectionCreateQuote,
  ButtonNavigateDetails,
} from "~/components/Specific/SectionCreateQuote";
import { useOutletContext } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Oportunidad [Márgenes]" },
    { name: "description", content: "Oportunidad [Márgenes]" },
  ];
}

export default function ProfitMargins() {
  const { selectedOpportunity } = useUI();
  const { details_items = [], details_materials = [] } = selectedOpportunity || {};
  const { selectedQuoteId } = useOutletContext<{
    selectedQuoteId: number | null;
  }>();
  if (!selectedQuoteId) return <SectionCreateQuote />;
  if (details_items?.length < 1 || details_materials?.length < 1) {
    return <ButtonNavigateDetails />;
  }

  return (
    <ContainerToForms>
      <ProfitMarginsForm quoteActive={selectedQuoteId} />
    </ContainerToForms>
  );
}
