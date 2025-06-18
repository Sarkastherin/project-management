import type { Route } from "../+types/conditions";
import { useForm, useFieldArray } from "react-hook-form";
import type { DetailsMaterialsType } from "~/backend/dataBase";
import { useUI } from "~/context/UIContext";
import FooterForms from "~/templates/FooterForms";
import { TableDetailsQuotes } from "~/templates/TableDetailsQuotes";
import { Input, Select } from "~/components/Forms/Inputs";
import { ButtonDeleteIcon, ButtonAdd } from "~/components/Specific/Buttons";
import React, { useEffect, useState } from "react";
import ModalMateriales from "~/components/Specific/ModalMateriales";
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const {
    showModal,
    refreshOpportunity,
    selectedPhase,
    handleSetIsFieldsChanged,
    isModeEdit,
    selectedOpportunity,
    setOpenMaterialsModal,
    selectedMaterial,
    categorizations,
  } = useUI();
  const { detailsMaterials, quotes } = selectedOpportunity || {};
  const quoteActive = quotes?.find((quote) => quote.active);
  const { id: id_quote_active } = quoteActive || {};
  const {
    register,
    formState: { errors, isSubmitSuccessful, isDirty },
    handleSubmit,
    control,
    watch,
    setValue,
  } = useForm<DefaultValuesType>({
    defaultValues: { materials: detailsMaterials },
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
        ({ name_material, unit_material, ...rest }) => rest
      );
      console.log(cleanedMaterials);
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
      setValue(`materials.${activeIndex}.id_material`, selectedMaterial.id);
      setValue(
        `materials.${activeIndex}.name_material`,
        selectedMaterial.description
      );
      const defaultPrice = selectedMaterial.prices.find(
        (price) => price.default === true
      );
      if (defaultPrice) {
        setValue(`materials.${activeIndex}.id_price`, defaultPrice.id);
        setValue(`materials.${activeIndex}.price`, defaultPrice.price);
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
  return (
    <>
      {selectedPhase && (
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
                  {fields.map((item, index) => (
                    <tr
                      key={item.id}
                      className="*:text-zinc-900 *:first:font-medium dark:*:text-white"
                    >
                      <Cell>{index + 1}</Cell>

                      {/* ID (oculto) */}
                      <Cell>
                        <Input
                          {...register(`materials.${index}.id_material`)}
                          className="sr-only"
                        />
                        <Input
                          value={
                            watch(`materials.${index}.name_material`) ?? ""
                          }
                          readOnly
                          placeholder="Material"
                          onClick={() => handlerMaterials(index)}
                        />
                      </Cell>

                      {/* Unidad (no registrada, solo visible) */}
                      <Cell>
                        <Select
                          disabled
                          value={watch(`materials.${index}.unit_material`)}
                        >
                          {categorizations?.units?.map((unit) => (
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
                          {...register(`materials.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                        />
                      </Cell>

                      {/* Precio (solo mostrar, no registrar) */}
                      <Cell>
                        <Input
                          className="sr-only"
                          {...register(`materials.${index}.id_price`)}
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
                        <ButtonDeleteIcon onClick={() => remove(index)} />
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
        </>
      )}
    </>
  );
}
