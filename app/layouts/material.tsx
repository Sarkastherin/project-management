/* Dependencies*/
import { useEffect } from "react";
import { Outlet, useParams } from "react-router";
/* Contexts */
import { useUI } from "~/context/UIContext";

export default function OpportunityLayout() {
  const {
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
