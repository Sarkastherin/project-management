import { Input, Select, Textarea } from "~/components/Forms/Inputs";
import { CardToggle } from "~/components/Generals/Cards";
import { useForm } from "react-hook-form";
import { useUI } from "~/context/UIContext";
import ModalClientes from "~/components/Specific/ModalClientes";
import {
  quotesApi,
  type QuotesType,
} from "~/backend/dataBase";
import FooterForms from "./FooterForms";
import { useEffect } from "react";

type QuotesTypesFormProps = {
  defaultValues: QuotesType
};
export default function ConditionsForm({
  defaultValues,
}: QuotesTypesFormProps) {
  const { showModal, refreshOpportunity, isModeEdit, handleSetIsFieldsChanged } = useUI();
  const {
    register,
    formState: { dirtyFields, isSubmitting, isSubmitSuccessful },
    handleSubmit,
  } = useForm<QuotesType>({
    defaultValues: defaultValues ?? {},
  });
  const onSubmit = async (formData: QuotesType): Promise<void> => {
    showModal({
      title: "⌛ Procesando...",
      message: `Procesando requerimiento`,
    });
    try {
      const updatePayload: Partial<Record<keyof QuotesType, QuotesType[keyof QuotesType]>> = {};
      (Object.keys(dirtyFields) as Array<keyof QuotesType>).forEach((key) => {
        if (dirtyFields[key] === false) return;
        updatePayload[key] = formData[key];
      });
      const {id: id_quote} = formData
      const {error: errorUpdate} = await quotesApi.update({id: id_quote, values: updatePayload as Partial<QuotesType>});
      if(errorUpdate) throw new Error(String(errorUpdate));
      showModal({
        title: "¡Todo OK!",
        message: `Oportunidad actualizada correctamente`,
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
  const formaPago = [
    { description: "15 días fecha de factura por transferencia bancaria" },
    { description: "15 días fecha de factura por e-cheq a 15 días" },
    { description: "30 días fecha de factura por transferencia bancaria" },
    { description: "30 días fecha de factura por e-cheq a 15 días" },
    { description: "contra envio de factura por transferencia bancaria" },
    { description: "contra envio de factura por e-cheq a 15 días" },
    { description: "contra envio de factura por e-cheq a 30 días" },
    { description: "Otro" },
  ];
  useEffect(() => {
    handleSetIsFieldsChanged(dirtyFields, isSubmitSuccessful);
  }, [dirtyFields, isSubmitSuccessful]);
  return (
    <>
      <form className=" flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={!isModeEdit}>
          <CardToggle title="Formas y metodos de pago">
            <div className="flex flex-col gap-4">
              <Select
                label="Forma de pago"
                {...register("method_payment", {
                  required: true,
                })}
              >
                {formaPago.map((item) => (
                  <option key={item["description"]} value={item["description"]}>
                    {item["description"]}
                  </option>
                ))}
              </Select>
              <Input
                placeholder="Plazo de ejecución"
                label="Plazo de ejecución"
                {...register("delivery_time")}
              />
              <Input
                placeholder="Garantía"
                label="Garantía"
                {...register("guarantee")}
              />
              <Input
                type="date"
                placeholder="Vigencia"
                label="Vigencia"
                {...register("validity")}
              />
              <Input
                type="date"
                placeholder="Fecha probable de inicio"
                label="Fecha probable de inicio"
                {...register("estimated_start_date")}
              />
              <Select
                label="Status"
                {...register("status", {
                  required: true,
                })}
              >
                <option value="">Seleccione un status</option>
                {[{ description: "Abierta" }, { description: "Cerrada" }].map(
                  (item) => (
                    <option
                      key={item["description"]}
                      value={item["description"]}
                    >
                      {item["description"]}
                    </option>
                  )
                )}
              </Select>
              <Textarea
                label="Notas de Cotización"
                placeholder="Notas de Cotización"
                rows={2}
                {...register("notes")}
              />
            </div>
          </CardToggle>
        </fieldset>
        <FooterForms mode="view"/>
      </form>
      <ModalClientes />
    </>
  );
}
