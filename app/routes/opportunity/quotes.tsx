import type { Route } from "../../+types/root";
import { ContainerToForms } from "~/components/Generals/Containers";
import QuotesForm from "~/templates/QuotesForm";
import { useUI } from "~/context/UIContext";
import { SectionCreateQuote } from "~/components/Specific/SectionCreateQuote";
import { Outlet } from "react-router";
import { Select } from "~/components/Forms/Inputs";
import { Button } from "~/components/Forms/Buttons";
import { useEffect, useState } from "react";
import { ButtonNavigate } from "~/components/Specific/Buttons";
import { useParams, useNavigate } from "react-router";
import type { MouseEventHandler } from "react";
import { useOutletContext } from "react-router";
import type { ChangeEventHandler } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Oportunidad [Cotizaciones]" },
    { name: "description", content: "Oportunidad [Cotizaciones]" },
  ];
}
type PropsType = {
  key: "materiales" | "mano de obra" | "subcontratos" | "otros";
  label: string;
};
export default function Quotes() {
  const { selectedQuoteId } = useOutletContext<{
    selectedQuoteId: number | null;
  }>();
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    selectedOpportunity,
    selectedPhase,
    setSelectedPhase,
    activeType,
    setActiveType,
    isFieldsChanged,
    setIsFieldsChanged,
  } = useUI();
  const { phases, quotes, details_items, details_materials } =
    selectedOpportunity || {};
  if (quotes?.length === 0) return <SectionCreateQuote />;
  const quoteActive = quotes?.find((quote) => quote.active);
  const { id: id_quote_active } = quoteActive || {};
  const valuesForm = {
    //id_phase: phases && phases.length > 0 ? phases[0].id : 0,
    items: details_items,
    materials: details_materials,
  };
  const handleNavigate = (t: PropsType) => {
    const href = `opportunity/${id}/quotes/${
      t.key === "materiales" ? "materials" : "items"
    }`;
    if (isFieldsChanged) {
      if (confirm("Tienes cambios sin guardar, ¿deseas continuar?")) {
        setIsFieldsChanged(false);
        navigate(href);
        setActiveType(t.key)
      }
    } else {
      navigate(href);
      setActiveType(t.key)
    }
  };
  const types: PropsType[] = [
    { key: "materiales", label: "Materiales" },
    { key: "mano de obra", label: "Mano de Obra" },
    { key: "subcontratos", label: "Subcontratos" },
    { key: "otros", label: "Otros" },
  ];
  const handleChangePhases: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const target = e.target;
    const value = target.value;
    setSelectedPhase(Number(value));
  };
  useEffect(() => {
    if (phases) setSelectedPhase(phases[0].id);
  }, [phases]);
  return (
    <>
      {quoteActive && selectedPhase && (
        <div className="w-full px-8 mt-8 mx-auto pb-18">
          <section className="flex gap-4">
            {/* Selector de fase */}
            <div className="w-2/3">
              <Select
                defaultValue={String(selectedPhase)}
                id="id_phase"
                onChange={(e) => handleChangePhases(e)}
                disabled={isFieldsChanged}
              >
                {phases?.map((phase) => (
                  <option key={phase.id} value={phase.id}>
                    {phase.name}
                  </option>
                ))}
              </Select>
            </div>
            {/* Tabs por tipo */}
            <div className="w-full flex gap-2">
              {types.map((t) => (
                <div className="w-1/4" key={t.key}>
                  <Button
                    type="button"
                    onClick={() => handleNavigate(t)}
                    variant={activeType === t.key ? "primary" : "secondary"}
                    className="w-full"
                  >
                    {t.label}
                  </Button>
                </div>
              ))}
            </div>
          </section>
          <Outlet context={{selectedQuoteId}}/>
        </div>
      )}
    </>
  );
}
