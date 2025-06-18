import type { TableColumn } from "react-data-table-component";
import type { MaterialsType } from "~/backend/dataBase";
import MyDataTable from "~/components/Generals/Tables";
import type { FetchResponse } from "~/components/Generals/Tables";
import type { ListResponse } from "~/backend/crudFactory";
import { materialsApi } from "~/backend/dataBase";
import { useUI } from "~/context/UIContext";
import { useEffect, useRef } from "react";
import { Input } from "~/components/Forms/Inputs";
import type { SelectedMaterialType } from "~/context/UIContext";
export type HandleRowClicked = {
  (data: MaterialsType ): void;
};
type MaterialTableProps = MaterialsType & {
  name_subcategory: string;
  name_category: string;
  name_family: string;
};
const columns: TableColumn<MaterialTableProps>[] = [
  {
    name: "Id",
    selector: (row) => row.id,
    width: "80px",
  },
  {
    name: "Descripcion",
    selector: (row) => row.description,
  },
  {
    name: "Sub-rubro",
    selector: (row) => row.name_subcategory,
    width: "250px",
  },
  {
    name: "Rubro",
    selector: (row) => row.name_category,
    width: "250px",
  },
  {
    name: "Familia",
    selector: (row) => row.name_family,
    width: "250px",
  },
];
export const MaterialTable = ({
  handleRowClicked,
  initialPerPage
}: {
  handleRowClicked: HandleRowClicked;
  initialPerPage?: number
}) => {
  const inputFilterText = useRef<HTMLInputElement>(null);
  const { categorizations, getCategorizations } = useUI();
  useEffect(() => {
    if (!categorizations) {
      getCategorizations();
    }
  }, []);
  const mapMaterialWithCategories = (
    data: MaterialsType[]
  ): MaterialTableProps[] => {
    const { families, categories, subcategories } = categorizations || {};
    const newData: MaterialTableProps[] =
      data?.map((material) => {
        const id_subcategory = material.id_subcategory;
        const subcategory = subcategories?.find(
          (subcategory) => subcategory.id === id_subcategory
        );
        const id_category = subcategory?.id_category;
        const category = categories?.find(
          (category) => category.id === id_category
        );
        const id_family = category?.id_family;
        const family = families?.find((family) => family.id === id_family);
        return {
          ...material,
          name_subcategory: subcategory?.description || "",
          name_category: category?.description || "",
          name_family: family?.description || "",
        };
      }) || [];
    return newData;
  };
  const fetchData = async ({
    page,
    perPage,
  }: FetchResponse): Promise<ListResponse<MaterialTableProps>> => {
    const { data, error, count } = await materialsApi.getAll({
      page: page,
      pageSize: perPage,
    });
    const { families, categories, subcategories } = categorizations || {};
    const newData = mapMaterialWithCategories(data ?? []);
    return { data: newData, error, count };
  };
  const onFilter = async (
    perPage: number
  ): Promise<ListResponse<MaterialTableProps>> => {
    //const inputElement = document.
    const filterOptions = {
      searchText: inputFilterText.current ? inputFilterText.current.value : "", //watch("description"),
      columnsToSearch: ["description"],
      pageSize: perPage,
    };
    const { data, error, count } = await materialsApi.filter(filterOptions);
    if (error) {
      alert(error);
    }
    const newData = mapMaterialWithCategories(data ?? []);
    return { data: newData, error, count };
  };
  const FormInputs = () => {
    return (
      <div className="w-full">
        <Input
          ref={inputFilterText}
          id="description"
          type="search"
          placeholder="Buscar por descripcion"
        />
      </div>
    );
  };
  return (
    <MyDataTable
      columns={columns}
      fetchData={fetchData}
      formFilters={<FormInputs />}
      onFilter={onFilter}
      onRowClicked={handleRowClicked}
      initialPerPage={initialPerPage}
    />
  );
};
