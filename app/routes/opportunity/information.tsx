import type { Route } from "../../+types/root";
import OpportunityForm from "~/templates/OpportunityForm";
import { useUI } from "~/context/UIContext";
import { ContainerToForms } from "~/components/Generals/Containers";
import type { OpportunityFormType } from "~/templates/OpportunityForm";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Oportunidad [Información]" },
    { name: "description", content: "Oportunidad" },
  ];
}
export default function Information() {
  const { selectedOpportunity } = useUI();

  let data: OpportunityFormType | null = null;
  if (selectedOpportunity) {
    const { phases, quotes, ...rest } = selectedOpportunity;
    data = { phases, ...rest };
  }

  return (
    <ContainerToForms>
      {data && (
        <OpportunityForm mode="view" defaultValues={data} />
      )}
    </ContainerToForms>
  );
}
