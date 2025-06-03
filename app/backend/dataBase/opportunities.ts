import { createCrud } from "../crudFactory";
type OpportunityInput = {
  name: string;
  scope?: string;
  id_client: number;
  status: "Nuevo" | "En progreso" | "Desestimada";
  created_by: string;
  history_data: {} | null;
  loss_reason: string | null;
};

export type Opportunity = OpportunityInput & {
  id: number;
  created_at: string;
};
export const opportunityApi = createCrud<Opportunity, OpportunityInput>(
  "opportunities"
);

