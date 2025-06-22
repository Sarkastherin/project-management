import { supabase } from "./supabaseClient";

import { useEffect } from "react";
import { useUI } from "~/context/UIContext";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import type { MaterialTypeDB } from "~/context/UIContext";
import type { PricesType } from "./dataBase";
export function useMaterialsRealtime() {
  const { materials, setMaterials, selectedMaterial, setSelectedMaterial } =
    useUI();
  useEffect(() => {
    const channel = supabase
      .channel("realtime:materials")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "materials" },
        (payload: RealtimePostgresChangesPayload<MaterialTypeDB>) => {
          const { eventType, new: newItem, old: oldItem } = payload;

          setMaterials((prev) => {
            if (!prev) return [];

            switch (eventType) {
              case "INSERT":
                return [newItem, ...prev];
              case "UPDATE":
                return prev.map((item) =>
                  item.id === newItem.id ? { ...item, ...newItem } : item
                );
              case "DELETE":
                return prev.filter((item) => item.id !== oldItem.id);
              default:
                return prev;
            }
          });
          // Si el material afectado es el que está abierto, actualizalo
          if (
            selectedMaterial?.id &&
            ((newItem &&
              "id" in newItem &&
              selectedMaterial.id === newItem.id) ||
              (oldItem &&
                "id" in oldItem &&
                selectedMaterial.id === oldItem.id))
          ) {
            setSelectedMaterial(
              eventType === "DELETE" ? null : (newItem as MaterialTypeDB)
            );
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [materials, selectedMaterial]);
}

export function usePricesRealtime() {
  const { materials, setMaterials, selectedMaterial, setSelectedMaterial } =
    useUI();

  useEffect(() => {
    const channel = supabase
      .channel("realtime:prices")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "prices" },
        (payload: RealtimePostgresChangesPayload<PricesType>) => {
          const { eventType, new: newItem, old: oldItem } = payload;
          const getIdPrice = () => {
            if (newItem && typeof newItem === "object" && "id" in newItem && newItem.id) {
              return newItem.id;
            } else if (oldItem && typeof oldItem === "object" && "id" in oldItem) {
              return oldItem.id;
            }
            return undefined;
          }
          const idPrice = getIdPrice()
          const prices = materials?.map(item =>item.prices);
          const price = prices?.flat().find(item => item.id === idPrice)
          const idMaterial = price?.id_material
          if (!idMaterial) return;

          setMaterials((prev) => {
            if (!prev) return null;
            return prev.map((material) => {
              if (material.id !== idMaterial) return material;

              const currentPrices = material.prices ?? [];

              let updatedPrices = currentPrices;

              switch (eventType) {
                case "INSERT":
                  updatedPrices = [newItem, ...currentPrices];
                  break;
                case "UPDATE":
                  updatedPrices = currentPrices.map((p) =>
                    p.id === newItem.id ? { ...p, ...newItem } : p
                  );
                  break;
                case "DELETE":
                  updatedPrices = currentPrices.filter(
                    (p) => p.id !== oldItem.id
                  );
                  break;
              }
              return { ...material, prices: updatedPrices };
            });
          });

          // También actualizá selectedMaterial si está activo
          if (selectedMaterial && selectedMaterial?.id === idMaterial) {
            const currentPrices = selectedMaterial.prices ?? [];

            let updatedPrices = currentPrices;
            switch (eventType) {
              case "INSERT":
                updatedPrices = [newItem, ...currentPrices];
                break;
              case "UPDATE":
                updatedPrices = currentPrices.map((p) =>
                  p.id === newItem.id ? { ...p, ...newItem } : p
                );
                break;
              case "DELETE":
                updatedPrices = currentPrices.filter(
                  (p) => p.id !== oldItem.id
                );
                break;
            }
            setSelectedMaterial({ ...selectedMaterial, prices: updatedPrices });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [materials, selectedMaterial]);
}
