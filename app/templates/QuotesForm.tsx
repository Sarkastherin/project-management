import { Input, Select, Textarea } from "~/components/Forms/Inputs";
import { Button } from "~/components/Forms/Buttons";
import { CardToggle } from "~/components/Generals/Cards";
import { useForm, useFieldArray } from "react-hook-form";
import { useUI } from "~/context/UIContext";
import ModalClientes from "~/components/Specific/ModalClientes";
import { quotesApi, type QuotesType } from "~/backend/dataBase";
import FooterForms from "./FooterForms";
import { useEffect, useState } from "react";
import {
  detailsItemsApi,
  type DetailsItemsType,
  type DetailsMaterialsType,
  type PhasesType,
} from "~/backend/dataBase";
import { ButtonAdd, ButtonDeleteIcon } from "~/components/Specific/Buttons";
import { TableDetailsQuotes } from "./TableDetailsQuotes";
const roundToPrecision = (value: number, decimalCount: number) => {
  const pow = Math.pow(10, decimalCount);
  return Math.round((value + Number.EPSILON) * pow) / pow;
};
type DefaultValuesType = {
  //id_phase: number;
  items?: DetailsItemsType[];
  materials?: DetailsMaterialsType[];
};
type QuotesTypesFormProps = {
  defaultValues: DefaultValuesType;
  phases: PhasesType[];
};
export default function QuotesForm({
  defaultValues,
  phases,
}: QuotesTypesFormProps) {
  const [activeType, setActiveType] = useState<
    "materiales" | "mano de obra" | "subcontratos" | "otros"
  >("materiales");
  const {
    showModal,
    refreshOpportunity,
    isModeEdit,
    handleSetIsFieldsChanged,
  } = useUI();
  const {
    register,
    formState: { errors, dirtyFields, isSubmitSuccessful, isDirty },
    handleSubmit,
    control,
    watch,
  } = useForm<DefaultValuesType>({
    defaultValues: defaultValues ?? {},
  });
  const {
    fields: fieldsItem,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: "items",
  });
  const {
    fields: fieldsMaterial,
    append: appendMaterial,
    remove: removeMaterial,
  } = useFieldArray({
    control,
    name: "materials",
  });
  const onSubmit = async (formData: DefaultValuesType): Promise<void> => {
    if (formData.items?.length === 0 && formData.materials?.length === 0)
      return;
    showModal({
      title: "⌛ Procesando...",
      message: `Procesando requerimiento`,
    });
    try {
      if (activeType === "materiales") {
        console.log("submt materiales");
      } else {
        console.log("submit items", formData);
      }
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

    /*  
    try {
      console.log("formData", formData);
      showModal({
        title: "¡Todo OK!",
        message: `Oportunidad actualizada correctamente`,
        variant: "success",
      });
    }  */
  };
  useEffect(() => {
    handleSetIsFieldsChanged(isSubmitSuccessful, isDirty);
  }, [isSubmitSuccessful, isDirty]);
  const types: {
    key: "mano de obra" | "subcontratos" | "otros";
    label: string;
  }[] = [
    { key: "mano de obra", label: "Mano de Obra" },
    { key: "subcontratos", label: "Subcontratos" },
    { key: "otros", label: "Otros" },
  ];
  const inputElement = document.getElementById("id_phase") as HTMLInputElement | null;
  const selectedPhase = inputElement ? Number(inputElement.value) : 0; //watch("id_phase");
  const handleAddItem = () => {
    if (selectedPhase > 0) {
      appendItem({
        id_quote: 0, // Este valor se asignará al guardar la cotización
        id_phase: selectedPhase,
        type: activeType,
        item: "",
        quantity: 0,
        unit_cost: 0,
        notes: "",
        observations: "",
      } as DetailsItemsType);
    }
  };
  const handleAddMaterial = () => {
    if (selectedPhase > 0) {
      appendMaterial({
        id_quote: 0, // Este valor se asignará al guardar la cotización
        id_phase: selectedPhase,
        type: "materiales",
        id_material: 0,
        quantity: 0,
        id_price: 0,
        notes: "",
        observations: "",
      } as DetailsMaterialsType);
    }
  };
  const handleShowMaterials = () => {
    setActiveType("materiales");
  };
  const columnsItems = [
    { groupColsClass: "w-[1%]", label: "#" },
    { groupColsClass: "", label: "Elemento cotizado" },
    { groupColsClass: "w-[10%]", label: "Cantidad" },
    { groupColsClass: "w-[10%]", label: "Costo unitario" },
    { groupColsClass: "w-[10%]", label: "Total" },
    { groupColsClass: "w-[1%]", label: "🗑️" },
  ];
  const columnsMaterials = [
    { groupColsClass: "w-[1%]", label: "#" },
    { groupColsClass: "", label: "Elemento cotizado" },
    { groupColsClass: "w-[10%]", label: "Unidad" },
    { groupColsClass: "w-[10%]", label: "Cantidad" },
    { groupColsClass: "w-[10%]", label: "Costo unitario" },
    { groupColsClass: "w-[10%]", label: "Total" },
    { groupColsClass: "w-[1%]", label: "🗑️" },
  ];
  return (
    <>
      <form className=" flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <section className="flex gap-4">
          {/* Selector de fase */}
          <div className="w-2/3">
            <Select defaultValue={phases[0].id} id="id_phase" /* {...register("id_phase", { valueAsNumber: true })} */>
              {phases.map((phase) => (
                <option key={phase.id} value={phase.id}>
                  {phase.name}
                </option>
              ))}
            </Select>
          </div>
          {/* Tabs por tipo */}
          <div className="w-full flex gap-2">
            <div className="w-1/4">
              <Button
                type="button"
                variant={activeType === "materiales" ? "primary" : "secondary"}
                className="w-full"
                onClick={handleShowMaterials}
              >
                {"Materiales"}
              </Button>
            </div>
            {types.map((t) => (
              <div className="w-1/4" key={t.key}>
                <Button
                  type="button"
                  onClick={() => setActiveType(t.key)}
                  variant={activeType === t.key ? "primary" : "secondary"}
                  className="w-full"
                >
                  {t.label}
                </Button>
              </div>
            ))}
          </div>
        </section>
        {/* Lista de ítems por tipo y fase */}
        <fieldset disabled={!isModeEdit}>
          <div className="overflow-x-auto">
            {activeType === "materiales" ? (
              <TableDetailsQuotes
                title="Tabla Materiales"
                columns={columnsMaterials}
              >
                {fieldsMaterial.map((item, index) => (
                  <tr
                    key={item.id}
                    className="*:text-zinc-900 *:first:font-medium dark:*:text-white"
                  >
                    <td className="px-3 py-2 whitespace-nowrap">{index + 1}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <Input
                        {...register(`materials.${index}.id_material`)}
                        placeholder="Id"
                        className="sr-only"
                      />
                      <Input placeholder="Material" />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <Input placeholder="Unidad" />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <Input
                        type="number"
                        {...register(`materials.${index}.quantity`)}
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <Input
                        type="number"
                        {...register(`materials.${index}.id_price`)}
                        className="sr-only"
                      />
                      <Input placeholder="$ 0.00" />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <Input
                        type="number"
                        placeholder="Total"
                        readOnly
                        value={
                          roundToPrecision(
                            watch(`materials.${index}.quantity`) *
                              watch(`materials.${index}.id_price`),
                            2
                          ) || 0
                        }
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <ButtonDeleteIcon onClick={() => removeMaterial(index)} />
                    </td>
                  </tr>
                ))}
              </TableDetailsQuotes>
            ) : (
              <TableDetailsQuotes title="Tabla Items" columns={columnsItems}>
                {fieldsItem
                  .map((field, index) => ({ ...field, index }))
                  .filter(
                    (item) =>
                      item.type === activeType &&
                      item.id_phase === selectedPhase
                  )
                  .map(({ index, id }) => (
                    <tr
                      key={id}
                      className="*:text-zinc-900 *:first:font-medium dark:*:text-white"
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Input
                          {...register(`items.${index}.item`)}
                          placeholder="Ítem"
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Input
                          type="number"
                          step={0.01}
                          {...register(`items.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Input
                          type="number"
                          {...register(`items.${index}.unit_cost`, {
                            valueAsNumber: true,
                          })}
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Input
                          type="number"
                          placeholder="Total"
                          readOnly
                          value={
                            roundToPrecision(
                              watch(`items.${index}.quantity`) *
                                watch(`items.${index}.unit_cost`),
                              2
                            ) || 0
                          }
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <ButtonDeleteIcon onClick={() => removeItem(index)} />
                      </td>
                    </tr>
                  ))}
              </TableDetailsQuotes>
            )}
          </div>
          {activeType === "materiales" ? (
            <ButtonAdd title="Agregar Material" onClick={handleAddMaterial} />
          ) : (
            <ButtonAdd title="Agregar Item" onClick={handleAddItem} />
          )}
        </fieldset>
        <FooterForms mode="view" />
      </form>
      <ModalClientes />
    </>
  );
}
