import type { Route } from "../../+types/root";
import { useUI } from "~/context/UIContext";
import { ContainerToForms } from "~/components/Generals/Containers";
import ConditionsForm from "~/templates/ConditionsForm";
import { ButtonCreateQuote } from "~/components/Specific/ButtonCreateQuote";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Oportunidad [Condiciones]" },
    { name: "description", content: "Oportunidad [Condiciones]" },
  ];
}

export default function Conditions() {
  const { selectedOpportunity } = useUI();
  const { quotes } = selectedOpportunity || {};
  if (quotes?.length === 0) return <ButtonCreateQuote />;
  const quoteActive = quotes?.find((quote) => quote.active);

  return (
    <>
      {quoteActive && (
        <ContainerToForms>
          <ConditionsForm defaultValues={quoteActive} />
        </ContainerToForms>
      )}
    </>
  );
}
