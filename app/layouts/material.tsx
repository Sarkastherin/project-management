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
  } = useUI();
  const { id } = useParams();
  const getMaterial = async (id: number) => {
    if (!categorizations) {
      getCategorizations();
      return;
    }
    const { data: dataMaterial, error: errorMaterial } =
      await materialsApi.getById({ id });
    if (errorMaterial)
      showModal({
        title: "Error",
        message: "No se pudo acceder al material",
        code: String(errorMaterial),
        variant: "error",
      });
    const { data: dataPrices, error: errorPrices } =
      await pricesApi.getDataByAnyColumn({
        column: "id_material",
        id: Number(id),
      });
      if (errorPrices)
      showModal({
        title: "Error",
        message: "No se pudo acceder a los precios",
        code: String(errorMaterial),
        variant: "error",
      });
    if(!dataPrices || !dataMaterial) return;
    const dataWithPrices = {...dataMaterial, prices: dataPrices}
    setSelectedMaterial(dataWithPrices);
  };
  useEffect(() => {
    getMaterial(Number(id));
  }, []);
  return (
    <>
      <Outlet />
    </>
  );
}
