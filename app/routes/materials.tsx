import type { Route } from "./+types/home";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Materiales" },
    { name: "Materiales", content: "Materiales" },
  ];
}
export default function Materials() {
  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1 className="text-2xl font-bold">Materiales</h1>
      <p className="mt-2 text-gray-600">
        Aquí puedes gestionar tus materiales.
      </p>
      {/* Aquí puedes agregar más contenido relacionado con las materiales */}
    </main>
  );
}
