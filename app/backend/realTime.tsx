import { supabase } from "./supabaseClient";
import { useEffect, useRef } from "react";
import { useUI } from "~/context/UIContext";

export function useMaterialsRealtime() {
  const { materials, selectedMaterial, refreshMaterial } = useUI();
  useEffect(() => {
    const channel = supabase
      .channel("realtime:materials")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "materials" },
        (payload) => {
          refreshMaterial();
          console.log("Change received!", payload);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [materials, selectedMaterial]);
}


export function usePricesRealtime() {
  const { refreshMaterial } = useUI();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceDelay = 500; // ajustar según el ritmo de tus eventos

  useEffect(() => {
    const channel = supabase
      .channel("realtime:prices")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "prices" },
        () => {
          // Reiniciar el timer con cada evento
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            refreshMaterial();
            timeoutRef.current = null;
          }, debounceDelay);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
}


export function useOpportunityRealtime() {
  const { selectedOpportunity, refreshOpportunity } = useUI();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!selectedOpportunity) return;

    const channel = supabase.channel("realtime:opportunity_realtime");

    const tablesToListen = [
      "opportunities",
      "quotes",
      "profit_margins",
      "details_items",
      "details_materials",
      "phases"
    ];

    tablesToListen.forEach((table) => {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload) => {
          console.log(`[${table.toUpperCase()}] Evento recibido:`, payload);

          // Reiniciamos el timer
          if (timeoutRef.current) clearTimeout(timeoutRef.current);

          timeoutRef.current = setTimeout(() => {
            console.log('refrescando oportunidad')
            refreshOpportunity();
            timeoutRef.current = null;
          }, 500);
        }
      );
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [selectedOpportunity]);
}

