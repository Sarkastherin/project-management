import type { Route } from "./+types/home";
import { Input, Select } from "~/components/Forms/Inputs";
import MyDataTable from "~/components/Generals/Tables";
import type { TableColumn } from "react-data-table-component";
import { materialsApi, type MaterialsType } from "~/backend/dataBase";
import type { ListResponse } from "~/backend/crudFactory";
import { useForm } from "react-hook-form";
import type { FetchResponse } from "~/components/Generals/Tables";
import { ContainerWithTitle } from "~/components/Generals/Containers";
import { ButtonNavigate } from "~/components/Specific/Buttons";
import { useNavigate } from "react-router";
import { useUI } from "~/context/UIContext";
import { useEffect } from "react";
import { MaterialTable } from "~/templates/MaterialTable";
import type { HandleRowClicked } from "~/templates/MaterialTable";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Materiales" },
    { name: "Materiales", content: "Materiales" },
  ];
}

export default function Materials() {
  const { setSelectedMaterial, categorizations, getCategorizations } = useUI();
  const navigate = useNavigate();
  useEffect(() => {
    if (!categorizations) {
      getCategorizations();
    }
  }, []);
  const handleRowClicked: HandleRowClicked = (data) => {
    setSelectedMaterial(null);
    navigate(`/material/${data.id}`);
  };
  return (
    <>
      <ContainerWithTitle title="Materiales" width="w-full">
        {categorizations ? (
          <MaterialTable handleRowClicked={handleRowClicked} paginationPerPage={30}/>
        ) : (
          <p className="text-center font-medium text-2xl">Cargando Datos</p>
        )}
      </ContainerWithTitle>
      <span className="absolute bottom-8 right-8">
        <ButtonNavigate variant="yellow" route="/new-material">
          Nuevo Material
        </ButtonNavigate>
      </span>
    </>
  );
}
