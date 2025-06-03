import { createCrud } from "../crudFactory";
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

export type Materials = MaterialsInput & {
  id: number;
  created_at: string;
};
export const materialsApi = createCrud<Materials, MaterialsInput>(
  "materiales"
);
