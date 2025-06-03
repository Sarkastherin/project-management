import { createCrud } from "../crudFactory";
type PhasesInput = {
  name: string;
  id_opportunity: number;
  history_data?: object
};

export type Phases = PhasesInput & {
  id: number;
  created_at: string;
};
export const phasesApi = createCrud<Phases, PhasesInput>(
  "phases"
);

