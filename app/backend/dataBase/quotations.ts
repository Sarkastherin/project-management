import { createCrud } from "../crudFactory";
type QuotationsInput = {
  id_opportunity: number;
  method_payment?: string;
  validity?: string;
  delivery_time?: string;
  guarantee?: string;
  status: "Abierta" | "Cerrada";
  active: boolean;
  estimated_start_date: string;
  history_data?: object
};

export type Quotations = QuotationsInput & {
  id: number;
  created_at: string;
};
export const quotationsApi = createCrud<Quotations, QuotationsInput>(
  "quotations"
);