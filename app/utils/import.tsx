import Papa from "papaparse";
import { supabase } from "~/backend/supabaseClient";
type Props<T> = {
  table: string;
  label?: string;
  transform?: (row: any) => T;
  onSuccess?: () => void;
  className?: string;
};

export function ImportCsvInput<T>({ table, transform, onSuccess, className }: Props<T>) {
  const handleFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async ({ data }) => {
        try {
          const finalData = transform ? data.map(transform) : data;
          const { error } = await supabase.from(table).insert(finalData);
          if (error) throw error;

          alert("Importación exitosa ✅");
          onSuccess?.();
        } catch (e) {
          alert("Error al importar: " + String(e));
        }
      },
      error: (err) => {
        alert("Error leyendo CSV: " + err.message);
      },
    });
  };

  return (
    <input
      type="file"
      accept=".csv"
      className={className ?? "sr-only"}
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
      }}
    />
  );
}