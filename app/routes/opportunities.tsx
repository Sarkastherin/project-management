import type { Route } from "./+types/home";
import { Input, Select } from "~/components/Forms/Inputs";
import MyDataTable from "~/components/Generals/Tables";
import type { TableColumn } from "react-data-table-component";
import { opportunityApi } from "~/backend/dataBase/opportunities";
import type { OpportunityType } from "~/backend/dataBase/opportunities";
import type { ListResponse } from "~/backend/crudFactory";
import { useForm } from "react-hook-form";
import type { FetchResponse } from "~/components/Generals/Tables";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Oportunidades" },
    { name: "Oportunidades", content: "Oportunidades" },
  ];
}
const columns: TableColumn<OpportunityType>[] = [
  {
    name: "Id",
    selector: (row) => row.id,
    width: "80px",
  },
  {
    name: "Fecha",
    selector: (row) => {
      const dateString = row.created_at;
      const date = new Date(dateString);
      const options = {
        year: "numeric" as const,
        day: "numeric" as const,
        month: "long" as const,
      };
      return date.toLocaleString("es-AR", options);
    },
    width: "170px",
  },
  {
    name: "Nombre de la Oportunidad",
    selector: (row) => row.name,
  },
  {
    name: "Id Cliente",
    selector: (row) => row.id_client || "",
    width: "150px",
  },
  {
    name: "Status",
    selector: (row) => row.status || "",
    width: "120px",
  },
  {
    name: "Creado por",
    selector: (row) => row.created_by || "",
    width: "120px",
  },
];
export default function Opportunities() {
  const { register, watch } = useForm();
  const fetchData = async ({
    page,
    perPage,
  }: FetchResponse): Promise<ListResponse<OpportunityType>> => {
    const { data, error, count } = await opportunityApi.getAll({
      page: page,
      pageSize: perPage,
    });
    return { data, error, count };
  };
  const onFilter = async (
    perPage: number
  ): Promise<ListResponse<OpportunityType>> => {
    const filterOptions = {
      searchText: watch("descripcion"),
      columnsToSearch: ["nombre", "cliente"],
      exactFilters: { material: watch("material"), tipo: watch("tipo") },
      pageSize: perPage,
    };
    const { data, error, count } = await opportunityApi.filter(filterOptions);
    if (error) {
      alert(error);
    }
    return { data, error, count };
  };
  const FormInputs = () => {
    return (
      <div className="grid grid-cols-4 gap-2 w-full">
        <div className="col-span-2">
          <Input
            type="search"
            placeholder="Buscar por nombre oportunidad"
            {...register("opportunity")}
          />
        </div>
        <Input
          type="search"
          placeholder="Buscar por cliente"
          {...register("client")}
        />
        <Select selectText="Selecciona un status">
          <option value={"Nuevo"}>🆕 Nuevo </option>
          <option value={"Desestimada"}>🗑️ Desestimada</option>
          <option value={"En proceso"}>⏳ En proceso</option>
          <option value={"Enviada"}>📧 Enviada</option>
          <option value={"Revisión"}>⚠️ Revisión</option>
          <option value={"Ganada"}>✅ Ganada</option>
          <option value={"Perdida"}>❌ Perdida</option>
        </Select>
      </div>
    );
  };
  return (
    <div className={`w-full mx-auto overflow-y-auto`}>
      <main className="pt-12 p-4 container mx-auto">
        <h1 className="text-2xl font-bold">Oportunidades</h1>

        <div className="mt-4">
          <MyDataTable
            columns={columns}
            fetchData={fetchData}
            formFilters={<FormInputs />}
            onFilter={onFilter}
          />
        </div>
      </main>
    </div>
  );
}
