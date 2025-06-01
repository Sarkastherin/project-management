import type { Route } from "./+types/home";
import { Input, Select } from "~/components/Forms/Inputs";
import { Button } from "~/components/Forms/Buttons";
import MyDataTable from "~/components/Generals/Tables";
import type { TableColumn } from "react-data-table-component";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Oportunidades" },
    { name: "Oportunidades", content: "Oportunidades" },
  ];
}
interface DataRow {
  title: string;
  director: string;
  year: string;
}
const columns: TableColumn<DataRow>[] = [
  //ID, FECHA, NOMBRE, CLIENTE, MONTO COTIZADO, STATUS, CREADOR POR
  {
    name: "Title",
    selector: (row) => row.title,
  },
  {
    name: "Director",
    selector: (row) => row.director,
  },
  {
    name: "Year",
    selector: (row) => row.year,
  },
];
const data = [
  {
    id: 1,
    title: "Beetlejuice",
    director: "Tim Burton",
    year: "1988",
  },
  {
    id: 2,
    title: "Ghostbusters",
    director: "Ivan Reitman",
    year: "1984",
  },
];
export default function Opportunities() {
  
  return (
    <main className="pt-12 p-4 container mx-auto">
     <h1 className="text-2xl font-bold">Oportunidades</h1>
      <form className="flex gap-4 mt-4 items-end">
        <Input placeholder="Buscar por nombre" />
        <Input placeholder="Buscar por cliente" />
        <Select selectText="Selecciona un status">
          {["Abierto", "Cerrado", "En Proceso"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
        <Button type="submit">Filtrar</Button>
      </form>
      <div className="mt-4">
        <MyDataTable columns={columns} data={data}/>
      </div>
    </main>
  );
}
