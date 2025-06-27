import type { Route } from "./+types/home";
import { Button } from "~/components/Forms/Buttons";
import { useUI } from "~/context/UIContext";
import ModalProveedores from "~/components/Specific/ModalProveedores";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bienvenido" },
    { name: "description", content: "Bienvenido" },
  ];
}

export default function Home() {
  const { setOpenSupplierModal } = useUI();
  return (
    <>
      <div className="mt-20 grid place-content-center">
        <p className="font-bold text-xl">Dashboard</p>
      </div>
      <ModalProveedores />
    </>
  );
}
