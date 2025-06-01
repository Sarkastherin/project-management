import type { Route } from "./+types/home";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Configuraciones" },
    { name: "Configuraciones", content: "Configuraciones" },
  ];
}
export default function Settings() {
  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1 className="text-2xl font-bold">Configuraciones</h1>
      <p className="mt-2 text-gray-600">
        Aquí puedes gestionar tus configuraciones.
      </p>
      {/* Aquí puedes agregar más contenido relacionado con las configuraciones */}
    </main>
  );
}
