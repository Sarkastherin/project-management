import type { Route } from "./+types/home";
import { Input, Select } from "~/components/Forms/Inputs";
import MyDataTable from "~/components/Generals/Tables";
import type { TableColumn } from "react-data-table-component";
import { materialsApi, type MaterialsType } from "~/backend/dataBase";
import type { ListResponse } from "~/backend/crudFactory";
import { useForm } from "react-hook-form";
import type { FetchResponse } from "~/components/Generals/Tables";
import { ContainerWithTitle } from "~/components/Generals/Containers";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Materiales" },
    { name: "Materiales", content: "Materiales" },
  ];
}
const columns: TableColumn<MaterialsType>[] = [
  {
    name: "Id",
    selector: (row) => row.id,
    width: "80px",
  },
  {
    name: "Descripcion",
    selector: (row) => row.descripcion,
  },
  {
    name: "Material",
    selector: (row) => row.material || "",
    width: "150px",
  },
  {
    name: "Tipo",
    selector: (row) => row.tipo || "",
    width: "120px",
  },
];
export default function Materials() {
  const { register, watch } = useForm();
  const fetchData = async ({
    page,
    perPage,
  }: FetchResponse): Promise<ListResponse<MaterialsType>> => {
    const { data, error, count } = await materialsApi.getAll({
      page: page,
      pageSize: perPage,
    });
    return { data, error, count };
  };
  const onFilter = async (
    perPage: number
  ): Promise<ListResponse<MaterialsType>> => {
    const filterOptions = {
      searchText: watch("descripcion"),
      columnsToSearch: ["descripcion"],
      exactFilters: { material: watch("material"), tipo: watch("tipo") },
      pageSize: perPage,
    };
    const { data, error, count } = await materialsApi.filter(filterOptions);
    if (error) {
      alert(error);
    }
    return { data, error, count };
  };
  const FormInputs = () => {
    return (
      <div className="grid grid-cols-4 gap-2 w-full">
        <Select selectText="Selecciona una material" {...register("material")}>
          {["INOXIDABLE", "ACERO AL CARBONO", "GALVANIZADO"].map((family) => (
            <option key={family} value={family}>
              {family}
            </option>
          ))}
        </Select>
        <Select selectText="Selecciona un tipo" {...register("tipo")}>
          {["Caño", "Chapa", "Rubro C"].map((rubro) => (
            <option key={rubro} value={rubro}>
              {rubro}
            </option>
          ))}
        </Select>
        <Select selectText="Selecciona un subrubro">
          {["Sub-rubro A", "Sub-rubro B", "Sub-rubro C"].map((subrubro) => (
            <option key={subrubro} value={subrubro}>
              {subrubro}
            </option>
          ))}
        </Select>
        <Input
          type="search"
          placeholder="Buscar por descripcion"
          {...register("descripcion")}
        />
      </div>
    );
  };
  return (
    <>
      <ContainerWithTitle title="Materiales">
        <MyDataTable
          columns={columns}
          fetchData={fetchData}
          formFilters={<FormInputs />}
          onFilter={onFilter}
          onRowClicked={(data) => console.log(data)}
        />
      </ContainerWithTitle>
    </>
  );
}
