import type { Route } from "./+types/home";
import { Input, Select } from "~/components/Forms/Inputs";
import type { TableColumn } from "react-data-table-component";
import { useForm } from "react-hook-form";
import { useContacts } from "~/context/ContactsContext";
import BadgeStatus from "~/components/Specific/Badge";
import { ButtonNavigate } from "~/components/Specific/Buttons";
import { ContainerWithTitle } from "~/components/Generals/Containers";
import { StatusOptions } from "~/components/Specific/StatusOptions";
import { useNavigate } from "react-router";
import type { OpportunitiesWithClient } from "~/context/UIContext";
import { useUI } from "~/context/UIContext";
import DataTable from "react-data-table-component";
import type { OpportunitiesTypeDB } from "~/context/UIContext";
import { useState, useEffect } from "react";
import { customStyles } from "~/components/Generals/Tables";
import { Button } from "~/components/Forms/Buttons";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Oportunidades" },
    { name: "description", content: "Oportunidades" },
  ];
}
const columns: TableColumn<OpportunitiesWithClient>[] = [
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
    selector: (row) => row.client?.nombre || "",
    width: "270px",
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
type FilterOpportunityType = {
  name_oportunity: string;
  name_client: string;
  status_opportunity: string;
};
export default function Opportunities() {
  const [filterData, setFilterData] = useState<OpportunitiesTypeDB[] | null>(
    null
  );
  const { getOpportunities, opportunities, theme, setSelectedOpportunity } =
    useUI();

  const navigate = useNavigate();
  const { clients } = useContacts();
  const { register, watch, handleSubmit } = useForm<FilterOpportunityType>();
  useEffect(() => {
    if (!opportunities) getOpportunities();
  }, []);
  interface HandleRowClicked {
    (data: OpportunitiesWithClient): void;
  }
  const onFilter = (data: FilterOpportunityType) => {
    const search = opportunities?.filter((item) => {
      return (
        item.name.toLocaleLowerCase().includes(data.name_oportunity.toLocaleLowerCase()) &&
        item.client.nombre.toLocaleLowerCase().includes(data.name_client.toLocaleLowerCase()) &&
        item.status.toLocaleLowerCase().includes(data.status_opportunity.toLocaleLowerCase())
      );
    });
    setFilterData(search || [])
  };
  const handleRowClicked: HandleRowClicked = (data) => {
    setSelectedOpportunity(null);
    navigate(`/opportunity/${data.id}/resumen`);
  };
  useEffect(() => {
    if (opportunities) {
      setFilterData(opportunities);
    }
  }, [opportunities]);
  if (filterData)
    return (
      <>
        <ContainerWithTitle title="Oportunidades">
          <form className="flex gap-2 items-baseline" onSubmit={handleSubmit(onFilter)}>
            <div className="w-full">
              <Input
                type="search"
                placeholder="Buscar por descripcion"
                {...register("name_oportunity")}
              />
            </div>
            <div className="w-full">
              <Input
                type="search"
                placeholder="Buscar por cliente"
                {...register("name_client")}
              />
            </div>
            <div className="w-180">
              <Select {...register("status_opportunity")}>
                <StatusOptions />
              </Select>
            </div>
            <Button variant="yellow" type="submit">
              Filtrar
            </Button>
          </form>

          <DataTable
            columns={columns}
            data={filterData}
            customStyles={customStyles}
            theme={theme}
            pagination
            paginationPerPage={30}
            onRowClicked={handleRowClicked}
            pointerOnHover
            highlightOnHover
          />
        </ContainerWithTitle>
        <span className="absolute bottom-8 right-8">
          <ButtonNavigate variant="yellow" route="/new-opportunity">
            Nueva Oportunidad
          </ButtonNavigate>
        </span>
      </>
    );
  return <p>Cargando datos</p>;
}
