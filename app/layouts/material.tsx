/* Dependencies*/
import { useEffect } from "react";
import { Outlet, useParams } from "react-router";
/* Contexts */
import { useUI } from "~/context/UIContext";
import { materialsApi, pricesApi } from "~/backend/dataBase";

export default function OpportunityLayout() {
  const {
    setSelectedMaterial,
    showModal,
    categorizations,
    getCategorizations,
    getMaterial
  } = useUI();
  const { id } = useParams();
  useEffect(() => {
    getMaterial(Number(id));
  }, []);
  return (
    <>
      <Outlet />
    </>
  );
}
