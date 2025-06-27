import { Input } from "~/components/Forms/Inputs";
import {
  pricesApi,
  type PricesInput,
  type PricesType,
} from "~/backend/dataBase";
import { useForm, useFieldArray } from "react-hook-form";
import { ButtonDeleteIcon, ButtonAdd } from "~/components/Specific/Buttons";
import { useUI } from "~/context/UIContext";
import ModalProveedores from "~/components/Specific/ModalProveedores";
import { useEffect, useState } from "react";
import { useContacts } from "~/context/ContactsContext";
import FooterForms from "./FooterForms";
import { Button } from "~/components/Forms/Buttons";
import { usePricesRealtime } from "~/backend/realTime";
import { updatesArrayFields } from "~/utils/updatesArraysFields";
import { useNavigate } from "react-router";
export type PricesFormType = {
  prices: Array<PricesType | PricesInput>;
};

export default function PricesForm({
  defaultValues,
  idMaterial,
  modalMode,
  onSelectPrice, // <- NUEVO
}: {
  defaultValues: PricesFormType;
  idMaterial: number | undefined;
  modalMode: boolean;
  onSelectPrice?: (price: { id: number; price: PricesType }) => void;
}) {
  usePricesRealtime(idMaterial);
  const { suppliers } = useContacts();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [pricesToDelete, setPricesToDelete] = useState<Array<PricesType["id"]>>(
    []
  );
  const { setOpenSupplierModal, selectedSupplier, showModal, isModeEdit } =
    useUI();
  const {
    register,
    watch,
    formState: { errors, dirtyFields, isSubmitSuccessful, isDirty },
    control,
    setValue,
    handleSubmit,
    reset,
  } = useForm<PricesFormType>({
    defaultValues: defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "prices",
  });
  const handleAddPrice = () => {
    append({
      id_material: idMaterial ?? null,
      id_supplier: null,
      price: 0,
      default: fields.length === 0,
      date: "",
    });
  };
  const onSubmit = async (data: PricesFormType) => {
    const defaultPrices = data.prices.filter((p) => p.default);
    if (defaultPrices.length !== 1) {
      showModal({
        title: "Formulario inválido",
        message: "Debe haber al menos un precio marcado como 'default'",
        variant: "warning",
      });
      return;
    }
    if (!isDirty) {
      showModal({
        title: "Formulario sin cambios",
        message: "No hay cambios para actualizar'",
        variant: "information",
      });
      return;
    }
    try {
      const { prices } = data;
      const newData = await updatesArrayFields({
        fieldsArray: prices,
        dirtyFields: dirtyFields as Record<
          string,
          Partial<Record<keyof PricesType, boolean>>[]
        >,
        fieldName: "prices",
        fieldsDelete: pricesToDelete,
        onUpdate: pricesApi.update,
        onInsert: pricesApi.insertOne,
        onRemove: (id: number) => pricesApi.remove({ id }),
      });
      showModal({
        title: "¡Todo OK!",
        message: "Se han guardado los datos",
        variant: "success",
      });
      const oldData = prices.filter(
        (item): item is PricesType =>
          "id" in item && typeof item.id === "number"
      );
      reset({
        prices: [...oldData, ...(Array.isArray(newData) ? newData : [])],
      });
      setPricesToDelete([]);
    } catch (e) {
      showModal({
        title: "Error en envío de formulario",
        message:
          "Hubieron algunos problemas al intentar procesar la información",
        variant: "error",
        code: String(e),
      });
    }
  };
  const handlerSupplier = (index: number) => {
    setActiveIndex(index);
    setOpenSupplierModal(true);
  };

  useEffect(() => {
    if (selectedSupplier && activeIndex !== null) {
      setValue(`prices.${activeIndex}.id_supplier`, selectedSupplier.id, {
        shouldDirty: true,
      });
      const supplierInput = document.getElementById(
        `prices.${activeIndex}.name_supplier`
      ) as HTMLInputElement | null;
      if (supplierInput) {
        supplierInput.value = selectedSupplier.nombre;
      }
    }
  }, [selectedSupplier]);
  useEffect(() => {
    reset(defaultValues);
  }, []);
  useEffect(() => {
    if (fields.length > 0) {
      fields.map((field, index) => {
        const supplierInput = document.getElementById(
          `prices.${index}.name_supplier`
        ) as HTMLInputElement | null;
        if (supplierInput) {
          const supplier = suppliers.find((s) => s.id === field.id_supplier);
          supplierInput.value = supplier ? supplier.nombre : "";
        }
      });
    }
  }, [fields]);
  const handleRemove = (index: number) => {
    const priceItem = defaultValues.prices[index];
    remove(index);
    if (priceItem && "id" in priceItem && priceItem.id !== undefined) {
      setPricesToDelete((prev) => [...prev, priceItem.id as number]);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={!isModeEdit}>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto divide-y-2 divide-zinc-200 dark:divide-zinc-700">
              <colgroup>
                <col className="w-[1%]" />
                <col className="w-[1%]" />
                <col className="w-[1%]" />
                <col />
                <col className="w-[15%]" />
                <col className="w-[1%]" />
                <col className="w-[1%]" />
              </colgroup>
              <thead className="ltr:text-left rtl:text-right">
                <tr className="*:font-medium *:text-zinc-900 dark:*:text-white">
                  <th className="px-1 py-2 whitespace-nowrap">#</th>
                  <th className="px-1 py-2 whitespace-nowrap">Fecha</th>
                  <th className="px-1 py-2 whitespace-nowrap">Id Prov.</th>
                  <th className="px-1 py-2 whitespace-nowrap">Proveedor</th>
                  <th className="px-1 py-2 whitespace-nowrap">Precio</th>
                  <th className="px-1 py-2 whitespace-nowrap">Default</th>
                  <th className="px-1 py-2 whitespace-nowrap">🗑️</th>
                  {onSelectPrice && (
                    <th className="px-1 py-2 whitespace-nowrap">Seleccionar</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {fields.map((item, index) => (
                  <tr
                    key={item.id ?? index}
                    className="*:text-zinc-900 *:first:font-medium dark:*:text-white"
                  >
                    <td className="px-1 py-2 whitespace-nowrap">{index + 1}</td>
                    <td className="px-1 py-2 whitespace-nowrap">
                      <Input
                        placeholder="Fecha"
                        type="date"
                        {...register(`prices.${index}.date`, {
                          required: "Campo requerido",
                        })}
                        error={
                          errors.prices && errors.prices[index]?.date?.message
                        }
                      />
                    </td>
                    <td className="px-1 py-2 whitespace-nowrap">
                      <Input
                        placeholder="ID"
                        {...register(`prices.${index}.id_supplier`, {
                          required: "Campo requerido",
                        })}
                        readOnly
                        error={
                          errors.prices &&
                          errors.prices[index]?.id_supplier?.message
                        }
                      />
                    </td>
                    <td className="px-1 py-2 whitespace-nowrap">
                      <Input
                        id={`prices.${index}.name_supplier`}
                        placeholder="Proveedor"
                        onClick={() => handlerSupplier(index)}
                        readOnly
                      />
                    </td>
                    <td className="px-1 py-2 whitespace-nowrap">
                      <Input
                        placeholder="$ 0.00"
                        {...register(`prices.${index}.price`, {
                          required: "Campo requerido",
                        })}
                      />
                    </td>
                    <td className="px-1 py-2 whitespace-nowrap">
                      <label
                        htmlFor={`prices.${index}.default`}
                        className="relative block h-8 w-14 rounded-full bg-gray-300 transition-colors [-webkit-tap-highlight-color:_transparent] has-checked:bg-blue-500 dark:bg-gray-600 dark:has-checked:bg-blue-600"
                      >
                        <input
                          type="checkbox"
                          id={`prices.${index}.default`}
                          className="peer sr-only"
                          checked={watch(`prices.${index}.default`)}
                          onChange={() => {
                            fields.forEach((_, i) => {
                              setValue(`prices.${i}.default`, i === index, {
                                shouldDirty: true,
                              });
                            });
                          }}
                        />
                        <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-300 ring-[6px] ring-white transition-all ring-inset peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent dark:bg-gray-600 dark:ring-gray-900 dark:peer-checked:bg-gray-900"></span>
                      </label>
                    </td>
                    <td className="px-1 py-2 whitespace-nowrap">
                      <ButtonDeleteIcon onClick={() => handleRemove(index)} />
                    </td>
                    {onSelectPrice && (
                      <td className="px-1 py-2 whitespace-nowrap">
                        <button
                          type="button"
                          className={`text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed`}
                          disabled={!watch(`prices.${index}.id`)}
                          onClick={() => {
                            const priceId = Number(watch(`prices.${index}.id`));
                            const price = watch(`prices.${index}`) as PricesType;
                            if (priceId > 0) {
                              onSelectPrice({ id: priceId, price: price });
                            }
                          }}
                        >
                          Usar
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <ButtonAdd
                aria-label="Agregar nuevo precio"
                onClick={handleAddPrice}
              />
            </div>
          </div>
        </fieldset>
        {modalMode ? (
          <div className="mt-4 text-end">
            <Button type="submit" variant="yellow">
              Guardar
            </Button>
          </div>
        ) : (
          <FooterForms mode={"view"} />
        )}
      </form>
      <ModalProveedores />
    </>
  );
}
