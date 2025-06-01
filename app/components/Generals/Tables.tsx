import DataTable, { createTheme } from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import type { JSX } from "react";
import { useUI } from "~/context/UIContext";


const customStyles = {
  headCells: {
    style: {
      fontFamily: "sans-serif",
      fontWeight: "bold",
      fontSize: "15px",
    },
  },
  cells: {
    style: {
      fontFamily: "sans-serif",
      fontSize: "14px",
    },
  },
};
createTheme('dark', {
  background: {
    default: 'transparent',
  },
});
createTheme('light', {
  background: {
    default: 'transparent',
  },
});


const options = {
  rowsPerPageText: "Filas por página",
  rangeSeparatorText: "de",
};
type MyDataTableProps = {
     columns: TableColumn<any>[];
     data: Array<any>;
}
export default function MyDataTable({columns, data}: MyDataTableProps): JSX.Element {
  const { theme } = useUI();
  return (
    <DataTable
      columns={columns}
      data={data}
      customStyles={customStyles}
      theme={theme}
      pagination
      paginationPerPage={30}
      paginationComponentOptions={options}

    />
  );
}
