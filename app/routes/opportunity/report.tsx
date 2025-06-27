import type { Route } from "../../+types/root";
import { useAuth } from "~/context/AuthContext";
import { Card } from "~/components/Generals/Cards";
import { useUI } from "~/context/UIContext";
import BadgeStatus from "~/components/Specific/Badge";
import { ContainerToForms } from "~/components/Generals/Containers";
import { useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import PDFQuote from "~/PDF/Quote";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Oportunidad [Informes]" },
    { name: "description", content: "Oportunidad [Informes]" },
  ];
}
export default function Report() {
  const [totalQuote, setTotalQuote] = useState<number>(0);
  const { selectedQuoteId } = useOutletContext<{
    selectedQuoteId: number | null;
  }>();
  console.log(selectedQuoteId)
  const { selectedOpportunity, selectedClient } = useUI();

  useEffect(() => {
    const { quotes } = selectedOpportunity || {};
    const quote = quotes?.find((q) => q.id === selectedQuoteId);
    if (!quote) return;
    setTotalQuote(quote.t_mg_total);
  }, [selectedQuoteId]);

  return (
    <div className="w-full max-w-7xl mt-8 mx-auto">
      <h2 className="text-2xl font-bold">Informe Oportunidad Id:</h2>
        {selectedQuoteId && (
          <PDFQuote quoteActive={selectedQuoteId}/>
        )}
    </div>
  );
}
