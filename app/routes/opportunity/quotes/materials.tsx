import type { Route } from "../+types/conditions";
import { useForm, useFieldArray } from "react-hook-form";
import {
  details_materialsApi,
  type DetailsMaterialsType,
} from "~/backend/dataBase";
import { useUI } from "~/context/UIContext";
import FooterForms from "~/templates/FooterForms";
import { TableDetailsQuotes } from "~/templates/TableDetailsQuotes";
import { Input, Select } from "~/components/Forms/Inputs";
import { ButtonDeleteIcon, ButtonAdd } from "~/components/Specific/Buttons";
import React, { useEffect, useState } from "react";
import ModalMateriales from "~/components/Specific/ModalMateriales";
import ModalPrice from "~/components/Specific/ModalPrice";
import type { MaterialTypeDB } from "~/context/UIContext";
const roundToPrecision = (value: number, decimalCount: number) => {
  const pow = Math.pow(10, decimalCount);
  return Math.round((value + Number.EPSILON) * pow) / pow;
};
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Oportunidad [Cotización]" },
    { name: "description", content: "Oportunidad [Cotización]" },
  ];
}
type MaterialFormType = DetailsMaterialsType & {
  price: number;
  name_material?: string; // Solo para mostrar
  unit_material?: number; // Solo para mostrar
};
type DefaultValuesType = {
  materials: MaterialFormType[];
};
export default function Materials() {
  const {
    showModal,
    refreshOpportunity,
    selectedPhase,
    handleSetIsFieldsChanged,
    isModeEdit,
    selectedOpportunity,
    setOpenMaterialsModal,
    selectedMaterial,
    units,
    materials,
    getMaterials,
    getUnits,
    openPriceModal,
    setOpenPriceModal,
  } = useUI();
  const { details_materials, quotes } = selectedOpportunity || {};
  //const storageKey = "details_materials";
  //localStorage.setItem(storageKey, JSON.stringify(details_materials));
  const quoteActive = quotes?.find((quote) => quote.active);
  const { id: id_quote_active } = quoteActive || {};

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [enrichedMaterials, setEnrichedMaterials] = useState<
    MaterialFormType[]
  >([]);
  const [materialsToDelete, setMaterialsToDelete] = useState<
    Array<DetailsMaterialsType["id"]>
  >([]);
  const [activeMaterial, setActiveMaterial] = useState<MaterialTypeDB | null>(
    null
  );
  useEffect(() => {
    const fetchData = async () => {
      if (!materials) await getMaterials();
      if (!units) await getUnits();
    };
    fetchData();
  }, []);
  const enrichMaterials = async () => {
    if (!details_materials || !materials) return;

    const enriched = details_materials.map((item) => {
      const fullMaterial = materials.find((mat) => mat.id === item.id_material);
      const defaultPrice = fullMaterial?.prices?.find(
        (p) => p.id === item.id_price
      );

      return {
        ...item,
        name_material: fullMaterial?.description ?? "Sin nombre",
        unit_material: fullMaterial?.id_unit ?? undefined,
        price: defaultPrice?.price ?? 0,
        id_price: defaultPrice?.id ?? 0,
      };
    });
    setEnrichedMaterials([...enriched].sort((a, b) => a.id - b.id));
  };
  useEffect(() => {
    enrichMaterials();
  }, [details_materials, materials]);
  useEffect(() => {
    if (enrichedMaterials.length > 0) {
      reset({ materials: enrichedMaterials });
    }
  }, [enrichedMaterials]);

  const {
    register,
    formState: { errors, isSubmitSuccessful, isDirty, dirtyFields },
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
  } = useForm<DefaultValuesType>({
    defaultValues: { materials: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "materials",
  });
  const onSubmit = async (formData: DefaultValuesType): Promise<void> => {
    showModal({
      title: "⌛ Procesando...",
      message: `Procesando requerimiento`,
    });
    try {
      const cleanedMaterials = formData.materials.map(
        ({ name_material, unit_material, price, ...rest }) => rest
      );
      await Promise.all(
        cleanedMaterials.map(async (material, i) => {
          const hasId = "id" in material;
          if (hasId && dirtyFields.materials?.[i]) {
            const fieldsChanged = Object.keys(dirtyFields.materials[i]!);
            const updates: Partial<DetailsMaterialsType> = fieldsChanged.reduce(
              (acc, key) => {
                return {
                  ...acc,
                  [key]: material[key as keyof DetailsMaterialsType],
                };
              },
              {} as Partial<DetailsMaterialsType>
            );
            const { error: errorUpdate } = await details_materialsApi.update({
              id: material.id!,
              values: updates,
            });
            if (errorUpdate) throw new Error(errorUpdate.message);
          } else if (!hasId) {
            const { error: errorInsert } = await details_materialsApi.insertOne(
              material
            );
            if (errorInsert) throw new Error(errorInsert.message);
          }
        })
      );
      if (materialsToDelete.length > 0) {
        //Eliminar
        for (const id of materialsToDelete) {
          const { error: errorRemove } = await details_materialsApi.remove({
            id,
          });
          if (errorRemove) throw new Error(errorRemove.message);
        }
      }
      showModal({
        title: "¡Todo OK!",
        message: "Se han guardado los datos",
        variant: "success",
      });
    } catch (e) {
      showModal({
        title: "Error al actualizar",
        message: `No se pudo actualizar la oportunidad. Error:`,
        code: String(e),
        variant: "error",
      });
    } finally {
      refreshOpportunity();
    }
  };
  const handleRemove = (index: number) => {
    const materialItem = enrichedMaterials[index];
    remove(index);
    if (materialItem && "id" in materialItem && materialItem.id !== undefined) {
      setMaterialsToDelete((prev) => [...prev, materialItem.id as number]);
    }
  };
  const columnsMaterials = [
    { groupColsClass: "w-[1%]", label: "#" },
    { groupColsClass: "", label: "Elemento cotizado" },
    { groupColsClass: "w-[10%]", label: "Unidad" },
    { groupColsClass: "w-[10%]", label: "Cantidad" },
    { groupColsClass: "w-[10%]", label: "Costo unitario" },
    { groupColsClass: "w-[10%]", label: "Total" },
    { groupColsClass: "w-[1%]", label: "🗑️" },
  ];
  const handleAddMaterial = () => {
    if (selectedPhase && selectedPhase > 0) {
      append({
        id_quote: id_quote_active, // Este valor se asignará al guardar la cotización
        id_phase: selectedPhase,
        type: "materiales",
        id_material: 0,
        quantity: 0,
        id_price: 0,
        notes: "",
        observations: "",
      } as DetailsMaterialsType & {
        price: number;
        name_material: string;
        unit_material: number;
      });
    }
  };
  useEffect(() => {
    handleSetIsFieldsChanged(isSubmitSuccessful, isDirty);
  }, [isSubmitSuccessful, isDirty]);
  const handlerMaterials = (index: number) => {
    setActiveIndex(index);
    setOpenMaterialsModal(true);
  };
  useEffect(() => {
    if (selectedMaterial && activeIndex !== null) {
      setValue(`materials.${activeIndex}.id_material`, selectedMaterial.id, {
        shouldDirty: true,
      });
      setValue(
        `materials.${activeIndex}.name_material`,
        selectedMaterial.description,
        {
          shouldDirty: true,
        }
      );
      const defaultPrice = selectedMaterial.prices.find(
        (price) => price.default === true
      );
      if (defaultPrice) {
        setValue(`materials.${activeIndex}.id_price`, defaultPrice.id, {
          shouldDirty: true,
        });
        setValue(`materials.${activeIndex}.price`, defaultPrice.price, {
          shouldDirty: true,
        });
      } else {
        setValue(`materials.${activeIndex}.id_price`, 0, {
          shouldDirty: true,
        });
        setValue(`materials.${activeIndex}.price`, 0, {
          shouldDirty: true,
        });
      }
      if (
        selectedMaterial.id_unit !== undefined &&
        selectedMaterial.id_unit !== null
      ) {
        setValue(
          `materials.${activeIndex}.unit_material`,
          selectedMaterial.id_unit
        );
      }
    }
  }, [selectedMaterial]);
  const handleTotal = (index: number) => {
    const prod =
      roundToPrecision(
        watch(`materials.${index}.quantity`) *
          watch(`materials.${index}.price`),
        2
      ) || 0;
    return prod.toLocaleString("es-AR", {
      style: "currency",
      currency: "USD",
    });
  };
  const Cell = ({ children }: { children: React.ReactNode }) => {
    return <td className="px-1 py-2 whitespace-nowrap">{children}</td>;
  };
  const handleOpenPrices = (index: number) => {
    const id_material = watch(`materials.${index}.id_material`);
    const material = materials?.find((material) => material.id === id_material);
    if (material) {
      setActiveIndex(index); // <--- NUEVO
      setActiveMaterial(material);
    }
  };

  useEffect(() => {
    if (activeMaterial) {
      setOpenPriceModal(true);
    }
  }, [activeMaterial]);
  useEffect(() => {
    if (!openPriceModal) {
      setActiveMaterial(null);
    }
  }, [openPriceModal]);
  return (
    <>
      {selectedPhase && materials && units && (
        <>
          <form
            className=" flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset disabled={!isModeEdit}>
              <div className="overflow-x-auto">
                <TableDetailsQuotes
                  title="Tabla Materiales"
                  columns={columnsMaterials}
                >
                  {fields
                    .map((field, index) => ({ ...field, index }))
                    .filter((item) => item.id_phase === selectedPhase)
                    .map(({ index, id }) => (
                      <tr
                        key={id}
                        className="*:text-zinc-900 *:first:font-medium dark:*:text-white align-baseline"
                      >
                        <Cell>{index + 1}</Cell>

                        {/* ID (oculto) */}
                        <Cell>
                          <Input
                            {...register(`materials.${index}.id_material`, {
                              required: "Campo requerido",
                              validate: {
                                checkNumber: (value) => {
                                  return (
                                    value > 0 ||
                                    "No se ha seleccionado material"
                                  );
                                },
                              },
                            })}
                            className="sr-only"
                          />
                          <Input
                            value={
                              watch(`materials.${index}.name_material`) ?? ""
                            }
                            readOnly
                            placeholder="Material"
                            onClick={() => handlerMaterials(index)}
                            error={
                              errors.materials &&
                              errors.materials[index]?.id_material?.message
                            }
                          />
                        </Cell>
                        {/* Unidad (no registrada, solo visible) */}
                        <Cell>
                          <Select
                            disabled
                            value={watch(`materials.${index}.unit_material`)}
                          >
                            {units?.map((unit) => (
                              <option key={unit.id} value={unit.id}>
                                {unit.description}
                              </option>
                            ))}
                          </Select>
                        </Cell>

                        {/* Cantidad (registrada) */}
                        <Cell>
                          <Input
                            type="number"
                            step={0.01}
                            {...register(`materials.${index}.quantity`, {
                              valueAsNumber: true,
                              required: "Campo requerido",
                              validate: {
                                checkNumber: (value) => {
                                  return (
                                    value > 0 || "No se ha seleccionado precio"
                                  );
                                },
                              },
                            })}
                          />
                        </Cell>

                        {/* Precio (solo mostrar, no registrar) */}
                        <Cell>
                          <Input
                            className="sr-only"
                            {...register(`materials.${index}.id_price`, {
                              required: "Campo requerido",
                              validate: {
                                checkNumber: (value) => {
                                  return (
                                    value > 0 || "No se ha seleccionado precio"
                                  );
                                },
                              },
                            })}
                          />
                          <Input
                            value={(
                              watch(`materials.${index}.price`) ?? 0
                            ).toLocaleString("es-AR", {
                              style: "currency",
                              currency: "USD",
                            })}
                            readOnly
                            placeholder="$ 0.00"
                            onClick={() => handleOpenPrices(index)}
                          />
                        </Cell>

                        {/* Total (calculado) */}
                        <Cell>
                          <Input
                            readOnly
                            type="text"
                            value={handleTotal(index)}
                            placeholder="Total"
                          />
                        </Cell>

                        {/* Eliminar fila */}
                        <Cell>
                          <ButtonDeleteIcon
                            onClick={() => handleRemove(index)}
                          />
                        </Cell>
                      </tr>
                    ))}
                </TableDetailsQuotes>
                <ButtonAdd
                  title="Agregar Material"
                  onClick={handleAddMaterial}
                />
              </div>
            </fieldset>
            <FooterForms mode="view" />
          </form>
          <ModalMateriales />
          {activeMaterial && activeIndex !== null && (
            <ModalPrice
              modalMode={true}
              idMaterial={activeMaterial.id}
              defaultValues={{ prices: activeMaterial.prices }}
              onSelectPrice={(priceObj) => {
                // Este callback lo definís en el modal y lo usás al seleccionar un precio
                setValue(`materials.${activeIndex}.id_price`, priceObj.id, {
                  shouldDirty: true,
                });
                setValue(`materials.${activeIndex}.price`, priceObj.price, {
                  shouldDirty: true,
                });
                setOpenPriceModal(false);
              }}
            />
          )}
        </>
      )}
    </>
  );
}
