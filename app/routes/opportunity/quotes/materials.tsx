import type { Route } from "../+types/conditions";
import { useForm, useFieldArray } from "react-hook-form";
import {
  details_materialsApi,
  type DetailsMaterialsType,
  type DetailsItemsInput,
} from "~/backend/dataBase";
import { useUI } from "~/context/UIContext";
import FooterForms from "~/templates/FooterForms";
import { TableDetailsQuotes } from "~/templates/TableDetailsQuotes";
import { Input, Select } from "~/components/Forms/Inputs";
import { ButtonDeleteIcon, ButtonAdd } from "~/components/Specific/Buttons";
import React, { useEffect, useState } from "react";
import ModalMateriales from "~/components/Specific/ModalMateriales";
import { useOutletContext } from "react-router";
import { updatesArrayFields, type DirtyMap } from "~/utils/updatesArraysFields";
type DetailsMaterialFormType = {
  materials: Array<DetailsMaterialsType | DetailsItemsInput>;
};
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
export default function Materials() {
  const { selectedQuoteId } = useOutletContext<{
    selectedQuoteId: number | null;
  }>();
  const [materialsToDelete, setMaterialsToDelete] = useState<
    Array<DetailsMaterialsType["id"]>
  >([]);
  const {
    showModal,
    selectedPhase,
    handleSetIsFieldsChanged,
    isModeEdit,
    selectedOpportunity,
    units,
    materials,
  } = useUI();
  const {
    register,
    formState: { isSubmitSuccessful, isDirty, dirtyFields },
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
  } = useForm<DetailsMaterialFormType>({
    defaultValues: { materials: [] },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "materials",
  });

  const onSubmit = async (formData: DetailsMaterialFormType): Promise<void> => {
    if (!isDirty) {
      showModal({
        title: "Formulario sin cambios",
        message: "No hay cambios para actualizar'",
        variant: "information",
      });
      return;
    }
    showModal({
      title: "⌛ Procesando...",
      message: `Procesando requerimiento`,
    });
    try {
      const { materials } = formData;
      const newData = await updatesArrayFields({
        fieldName: "materials",
        fieldsArray: materials as DetailsMaterialsType[],
        dirtyFields: dirtyFields as Record<
          string,
          Partial<Record<keyof DetailsMaterialsType, boolean>>[]
        >,
        fieldsDelete: materialsToDelete,
        onInsert: details_materialsApi.insertOne,
        onRemove: (id: number) => details_materialsApi.remove({ id }),
        onUpdate: details_materialsApi.update,
      });
      const oldData = materials.filter(
        (item): item is DetailsMaterialsType =>
          "id" in item && typeof item.id === "number"
      );
      reset({
        materials: [...oldData, ...(Array.isArray(newData) ? newData : [])],
      });
      setMaterialsToDelete([]);
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
    }
  };
  const handleAdd = () => {
    if (selectedPhase && selectedPhase > 0) {
      append({
        id_quote: selectedQuoteId, // Este valor se asignará al guardar la cotización
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
  const handleRemove = (index: number) => {
    //const materialItem = enrichedMaterials[index];
    remove(index);
    /* if (materialItem && "id" in materialItem && materialItem.id !== undefined) {
      setMaterialsToDelete((prev) => [...prev, materialItem.id as number]);
    } */
  };
  const { details_materials } = selectedOpportunity || {};
  useEffect(() => {
    const details = details_materials?.filter(
      (q) => q.id_quote === selectedQuoteId
    );
    if (details) reset({materials: details});
  }, [details_materials, selectedQuoteId]);

  
  const columnsMaterials = [
    { groupColsClass: "w-[1%]", label: "#" },
    { groupColsClass: "", label: "Elemento cotizado" },
    { groupColsClass: "w-[10%]", label: "Unidad" },
    { groupColsClass: "w-[10%]", label: "Cantidad" },
    { groupColsClass: "w-[10%]", label: "Costo unitario" },
    { groupColsClass: "w-[10%]", label: "Total" },
    { groupColsClass: "w-[1%]", label: "🗑️" },
  ];
  
  useEffect(() => {
    handleSetIsFieldsChanged(isSubmitSuccessful, isDirty);
  }, [isSubmitSuccessful, isDirty]);
  const Cell = ({ children }: { children: React.ReactNode }) => {
    return <td className="px-1 py-2 whitespace-nowrap">{children}</td>;
  };
  const handleOpenPrices = (index: number) => {
    const id_material = watch(`materials.${index}.id_material`);
    const material = materials?.find((material) => material.id === id_material);
  };
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
                            readOnly
                            placeholder="Material"
                          />
                        </Cell>
                        {/* Unidad (no registrada, solo visible) */}
                        <Cell>
                          <Select
                            disabled
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
                  onClick={handleAdd}
                />
              </div>
            </fieldset>
            <FooterForms mode="view" />
          </form>
          <ModalMateriales />
          {/* {activeMaterial && activeIndex !== null && (
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
          )} */}
        </>
      )}
    </>
  );
}
