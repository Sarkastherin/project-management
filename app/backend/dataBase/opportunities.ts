import { createCrud } from "../crudFactory";
export type StatusType = "Nuevo" | "Desestimada" | "En proceso" | "Enviada" | "Revisión" | "Ganada" | "Perdida"

export type OpportunityInput = {
  name: string;
  scope?: string;
  id_client: number | null;
  status: StatusType
  created_by: string;
  history_data?: {} | null;
  loss_reason?: string | null;
};

export type OpportunityType = OpportunityInput & {
  id: number;
  created_at: string;
};
export const opportunityApi = createCrud<OpportunityType, OpportunityInput>(
  "opportunities"
);

