import type { Route } from "./+types/home";
import { Input, Select } from "~/components/Forms/Inputs";
import MyDataTable from "~/components/Generals/Tables";
import type { TableColumn } from "react-data-table-component";
import { opportunityApi } from "~/backend/dataBase/opportunities";
import type { OpportunityType } from "~/backend/dataBase/opportunities";
import type { ListResponse } from "~/backend/crudFactory";
import { useForm } from "react-hook-form";
import type { FetchResponse } from "~/components/Generals/Tables";
import { useContacts } from "~/context/ContactsContext";
import { useEffect } from "react";
import type { ClientDataType } from "~/context/ContactsContext";
import BadgeStatus from "~/components/Specific/Badge";
import { ButtonNavigate } from "~/components/Specific/Buttons";
import { ContainerScrolling } from "~/components/Generals/Containers";
import { StatusOptions } from "~/components/Specific/StatusOptions";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Oportunidades" },
    { name: "description", content: "Oportunidades" },
  ];
}
type MyOpportunityType = OpportunityType & {
  client: ClientDataType;
};
const columns: TableColumn<MyOpportunityType>[] = [
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
    name: "Cliente",
    selector: (row) => row.client.nombre || "",
    width: "210px",
  },
  {
    name: "Status",
    cell: (row) => <BadgeStatus variant={row.status}>{row.status}</BadgeStatus>,
    width: "120px",
  },
  {
    name: "Creado por",
    selector: (row) => row.created_by || "",
    width: "120px",
  },
];
export default function Opportunities() {
  const { getClients, clients } = useContacts();
  const { register, watch } = useForm();
  function mapOpportunitiesWithClients(
    opportunities: OpportunityType[],
    clients: ClientDataType[]
  ): MyOpportunityType[] {
    return opportunities.map((opportunity) => {
      const client = clients.find((c) => c.id === opportunity.id_client);
      return { ...opportunity, client: client ?? ({} as ClientDataType) };
    });
  }

  const fetchData = async ({
    page,
    perPage,
  }: FetchResponse): Promise<ListResponse<MyOpportunityType>> => {
    if (clients.length > 0) {
      const {
        data: opportunities,
        error,
        count,
      } = await opportunityApi.getAll({
        page: page,
        pageSize: perPage,
      });
      const myNewData = opportunities
        ? mapOpportunitiesWithClients(opportunities, clients)
        : [];
      return { data: myNewData, error, count };
    }
    return { data: null, error: null, count: null };
  };
  const onFilter = async (
    perPage: number
  ): Promise<ListResponse<MyOpportunityType>> => {
    const filterOptions = {
      searchText: watch("descripcion"),
      columnsToSearch: ["nombre", "cliente"],
      exactFilters: { material: watch("material"), tipo: watch("tipo") },
      pageSize: perPage,
    };
    if (clients.length > 0) {
      const {
        data: opportunities,
        error,
        count,
      } = await opportunityApi.filter(filterOptions);
      const myNewData = opportunities
        ? mapOpportunitiesWithClients(opportunities, clients)
        : [];
      return { data: myNewData, error, count };
    }
    return { data: null, error: null, count: null };
  };
  useEffect(() => {
    getClients();
  }, []);
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
          <StatusOptions/>
        </Select>
      </div>
    );
  };
  return (
    <>
      <ContainerScrolling title="Oportunidades">
        {clients.length > 0 && (
          <MyDataTable
            columns={columns}
            fetchData={fetchData}
            formFilters={<FormInputs />}
            onFilter={onFilter}
          />
        )}
      </ContainerScrolling>
      <span className="absolute bottom-8 right-8">
        <ButtonNavigate variant="yellow" route="/new-opportunity">
          Nueva Oportunidad
        </ButtonNavigate>
      </span>
    </>
  );
}
