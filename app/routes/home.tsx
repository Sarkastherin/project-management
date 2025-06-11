import type { Route } from "./+types/home";
import { ButtonNavigate } from "~/components/Specific/Buttons";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bienvenido" },
    { name: "description", content: "Bienvenido" },
  ];
}

export default function Home() {
  return (
    <div className="mt-20 grid place-content-center">
      <ButtonNavigate route={"/opportunity/6"}>Go to opportunity</ButtonNavigate>
    </div>
  );
}
