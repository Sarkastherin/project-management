import type { Route } from "../+types/conditions";
import { useForm, useFieldArray } from "react-hook-form";
import type { DetailsMaterialsType, DetailsItemsType } from "~/backend/dataBase";
import { useUI } from "~/context/UIContext";
import FooterForms from "~/templates/FooterForms";
import { TableDetailsQuotes } from "~/templates/TableDetailsQuotes";
import { Input } from "~/components/Forms/Inputs";
import { ButtonDeleteIcon } from "~/components/Specific/Buttons";
import { ButtonAdd } from "~/components/Specific/Buttons";
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
type DefaultValuesType = {
  items: DetailsItemsType[];
};
export default function Items() {
  const { showModal, refreshOpportunity, selectedPhase,activeType } = useUI();
  const {
    register,
    formState: { errors, dirtyFields, isSubmitSuccessful },
    handleSubmit,
    control,
    watch,
  } = useForm<DefaultValuesType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const onSubmit = async (formData: DefaultValuesType): Promise<void> => {
    showModal({
      title: "⌛ Procesando...",
      message: `Procesando requerimiento`,
    });
    try {
      console.log(formData);
    } catch (e) {
      showModal({
        title: "Error al actualizar",
        message: `No se pudo actualizar la oportunidad. Error:`,
        code: String(e),
        variant: "error",
      });
    } 
  };
  const columnsItems = [
    { groupColsClass: "w-[1%]", label: "#" },
    { groupColsClass: "", label: "Elemento cotizado" },
    { groupColsClass: "w-[10%]", label: "Cantidad" },
    { groupColsClass: "w-[10%]", label: "Costo unitario" },
    { groupColsClass: "w-[10%]", label: "Total" },
    { groupColsClass: "w-[1%]", label: "🗑️" },
  ];
  const handleAddItem = () => {
    if (selectedPhase && selectedPhase > 0) {
      append({
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
  return (
    <>
      {selectedPhase && (
        <form
          className=" flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="overflow-x-auto">
            <TableDetailsQuotes title="Tabla Items" columns={columnsItems}>
              {fields
                .map((field, index) => ({ ...field, index }))
                .filter(
                  (item) =>
                    item.type === activeType && item.id_phase === selectedPhase
                )
                .map(({ index, id }) => (
                  <tr
                    key={id}
                    className="*:text-zinc-900 *:first:font-medium dark:*:text-white"
                  >
                    <td className="px-3 py-2 whitespace-nowrap">{index + 1}</td>
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
                      <ButtonDeleteIcon onClick={() => remove(index)} />
                    </td>
                  </tr>
                ))}
            </TableDetailsQuotes>
            <ButtonAdd title="Agregar Item" onClick={handleAddItem} />
          </div>
          <FooterForms mode="view" />
        </form>
      )}
    </>
  );
}
