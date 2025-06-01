import type { Route } from "./+types/home";
import MainLayout from "~/components/Generals/MainLayout";
import { useNavigate } from "react-router";
import { useAuth } from "~/context/AuthContext";
import { useEffect } from "react";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bienvenido" },
    { name: "description", content: "Bienvenido" },
  ];
}

export default function Home() {
  const { auth, session } = useAuth();
  const navigate = useNavigate();
  /* useEffect(() => {
    auth();
    if (!session) navigate("/login");
  }, []); */
  return (
    <h1>Home</h1>
  );
}
