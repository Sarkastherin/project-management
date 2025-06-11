import { createCrud } from "./crudFactory";
type CommonTypesDataBase = {
  id: number;
  created_at: string;
};
export type StatusType =
  | "Nuevo"
  | "Desestimada"
  | "En proceso"
  | "Enviada"
  | "Revisión"
  | "Ganada"
  | "Perdida"
  | "No status";

export type OpportunityType = OpportunityInput & CommonTypesDataBase;
export type OpportunityInput = {
  name: string;
  scope?: string;
  id_client: number;
  status: StatusType;
  created_by: string;
  history_data?: {} | null;
  loss_reason?: string | null;
};
export type PhasesInput = {
  name: string;
  id_opportunity: number;
  history_data?: object;
};
export type PhasesType = PhasesInput & CommonTypesDataBase;
export type QuotesInput = {
  id_opportunity: number;
  method_payment?: string;
  validity?: string;
  delivery_time?: string;
  guarantee?: string;
  status: "Abierta" | "Cerrada";
  active: boolean;
  estimated_start_date?: string;
  notes?: string;
  history_data?: object;
};
export type QuotesType = QuotesInput & CommonTypesDataBase;
type DetailsItemsInput = {
  id_quote: number;
  id_phase: number;
  type: "mano de obra" | "subcontratos" | "otros";
  item: string;
  quantity: number;
  unit_cost: number;
  notes?: string;
  observations?: string;
};
export type DetailsItems = DetailsItemsInput & CommonTypesDataBase;
type DetailsMaterialsInput = {
  id_quote: number;
  id_phase: number;
  type: "materiales";
  id_material: number;
  quantity: number;
  id_price: number;
  notes?: string;
  observations?: string;
};
export type DetailsMaterials = DetailsMaterialsInput & CommonTypesDataBase;
export type PricesInput = {
  id_material: number;
  id_supplier: number;
  price: number;
  default: boolean;
  history_data?: object;
};
export type PricesType = PricesInput & {
  id: number;
  created_at: string;
};
type MaterialsInput = {
  espesor?: string;
  medida?: string;
  codigo: string;
  descripcion: string;
  tipo_union?: string;
  caracteristica?: string;
  precios?: object;
  sequence: number;
  material?: string;
  tipo?: string;
  cod_material: string;
  cod_tipo: string;
  norma?: string;
  usuario?: string;
  unidad?: string;
  peso?: number;
};
export type MaterialsType = MaterialsInput & {
  id: number;
  created_at: string;
};
export type ProfitMarginInput = {
  id_opportunity: number;
  id_quote: number;
  materials: number;
  labor: number;
  subcontracting: number;
  others: number;
  general: number;
}
export type ProfitMarginType = ProfitMarginInput & CommonTypesDataBase;
export const opportunityApi = createCrud<OpportunityType, OpportunityInput>(
  "opportunities"
);
export const phasesApi = createCrud<PhasesType, PhasesInput>("phases");
export const quotesApi = createCrud<QuotesType, QuotesInput>(
  "quotes"
);
export const detailsItemsApi = createCrud<DetailsItems, DetailsItemsInput>(
  "details_items"
);
export const detailsMaterialsApi = createCrud<
  DetailsMaterials,
  DetailsMaterialsInput
>("details_materials");
export const pricesApi = createCrud<PricesType, PricesInput>("prices");
export const materialsApi = createCrud<MaterialsType, MaterialsInput>(
  "materiales"
);
export const profitMarginApi = createCrud<ProfitMarginType, ProfitMarginInput>(
  "profit_margins"
);
