import type { Route } from "./+types/home";
import { ContainerScrolling } from "~/components/Generals/Containers";
import OpportunityForm from "~/templates/OpportunityForm";
import { useAuth } from "~/context/AuthContext";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nueva Oportunidad" },
    { name: "description", content: "Nueva Oportunidad" },
  ];
}

export default function NewOpportunity() {
  const { user } = useAuth();
  return (
    <>
      <ContainerScrolling title="NewOpportunity">
        <OpportunityForm
          mode="create"
          defaultValues={{
            name: "",
            id_client: null,
            status: "Nuevo",
            created_by: user?.user_name || "",
            phases: [],
          }}
        />
      </ContainerScrolling>
    </>
  );
}
