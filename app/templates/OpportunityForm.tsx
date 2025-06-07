import { Input, Select, Textarea } from "~/components/Forms/Inputs";
import { StatusOptions } from "~/components/Specific/StatusOptions";
import { CardToggle } from "~/components/Generals/Cards";
import { useForm, useFieldArray } from "react-hook-form";
import { ButtonDeleteIcon } from "~/components/Specific/Buttons";
import { Button } from "~/components/Forms/Buttons";
import type { OpportunityInput } from "~/backend/dataBase/opportunities";
import { useUI } from "~/context/UIContext";
import ModalClientes from "~/components/Specific/ModalClientes";
import { useEffect } from "react";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { opportunityApi } from "~/backend/dataBase/opportunities";
import { phasesApi } from "~/backend/dataBase/phases";

// Ensure OpportunityType includes phases as an array
type OpportunityFormType = OpportunityInput & {
  phases: { index: number; name: string }[];
};
type OpportunityFormProps = {
  defaultValues: OpportunityFormType;
  mode: "create" | "edit" | "view";
};
export default function OpportunityForm({
  defaultValues,
  mode,
}: OpportunityFormProps) {
  const { setOpenClientModal, selectedClient, showModal } = useUI();
  const {
    register,
    watch,
    formState: { errors },
    control,
    setValue,
    handleSubmit,
  } = useForm<OpportunityFormType>({
    defaultValues: defaultValues ?? {
      name: "",
      id_client: null,
      status: "",
      created_by: "",
      phases: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "phases",
  });
  useEffect(() => {
    if (selectedClient) {
      setValue("id_client", selectedClient.id);
    }
  }, [selectedClient]);
  const onSubmit = async (formData: OpportunityFormType) => {
    switch (mode) {
      case "create": {
        const { phases, ...formDataWithoutPhases } = formData;
        try {
          const { data, error } = await opportunityApi.insertOne(
            formDataWithoutPhases
          );
          if (error) throw new Error(String(error));
          
          if (!data || !("id" in data)) {
            throw new Error("No se pudo obtener el id de la oportunidad creada");
          }
          const { id } = data;
          const phasesToInsert =
            phases.length > 0 ? phases : [{ index: 1, name: data.name }];
          const phasesPayload = phasesToInsert.map((phase) => ({
            name: phase.name,
            id_opportunity: id,
          }));
          const { error: phasesError } = await phasesApi.insert(phasesPayload);
          if (phasesError) throw new Error(String(phasesError))
          showModal({
            title: "✔️ Guardado con exito",
            message: `Se ha guardado la oportunidad`,
          });
        } catch (e) {
          showModal({
            title: "❌ Error al guardar",
            message: (
              <code className="text-red-600 dark:text-red-400">
                {String(e)}
              </code>
            ),
          });
        }
        break;
      }
      case "edit":
        //Enviar modificaciones
        break;
    }
  };
  return (
    <>
      <form className=" flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={mode === "view"}>
          <CardToggle title="Datos de la Oportunidad">
            <div className="flex flex-col gap-4">
              <Input
                label="Nombre de Oportunidad"
                placeholder="Ingresa un nombre para la oportunidad"
                {...register("name", { required: "Campo requerido" })}
                error={errors.name?.message}
              />
              <Input
                label="Cliente"
                placeholder="Seleccione un cliente"
                readOnly
                value={selectedClient?.nombre || ""}
                onClick={() => setOpenClientModal(true)}
                error={errors.id_client?.message}
              />
              <Input
                type="hidden"
                {...register("id_client", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
              <Textarea label="Alcance" {...register("scope")} />
              <Select
                label="Status"
                selectText="Selecciona un status"
                defaultValue={"Nuevo"}
                {...register("status", { required: true })}
                error={errors.status?.message}
              >
                <StatusOptions />
              </Select>
              <Textarea
                disabled={watch("status") !== "Perdida"}
                label="Razón de pérdida"
                {...register("loss_reason", {
                  required: {
                    value: watch("status") === "Perdida",
                    message: "Campo requerido",
                  },
                })}
                error={errors.loss_reason?.message}
              />
            </div>
          </CardToggle>
        </fieldset>
        <fieldset>
          <CardToggle title="Etapas">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto divide-y-2 divide-zinc-200 dark:divide-zinc-700">
                <colgroup>
                  <col className="w-[1%]" />
                  <col />
                  <col className="w-[1%]" />
                </colgroup>

                <thead className="ltr:text-left rtl:text-right">
                  <tr className="*:font-medium *:text-zinc-900 dark:*:text-white">
                    <th className="px-3 py-2 whitespace-nowrap">#</th>
                    <th className="px-3 py-2 whitespace-nowrap">Etapas</th>
                    <th className="px-3 py-2 whitespace-nowrap">🗑️</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {fields.map((item, index) => (
                    <tr
                      key={index}
                      className="*:text-zinc-900 *:first:font-medium dark:*:text-white"
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Input
                          placeholder="Nombre de la etapa"
                          {...register(`phases.${index}.name`, {
                            required: "Campo requerido",
                          })}
                          error={
                            errors.phases && errors.phases[index]?.name?.message
                          }
                        />
                      </td>

                      <td className="px-3 py-2 whitespace-nowrap">
                        <ButtonDeleteIcon onClick={() => remove(index)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4">
                <button
                  className="cursor-pointer text-sm font-semibold border rounded-full py-2 px-4 text-indigo-500  border-indigo-400 hover:bg-zinc-200 hover:border-zinc-200 dark:text-indigo-300  darkborder-indigo-300 dark:hover:bg-zinc-700 dark:hover:border-zinc-700"
                  type="button"
                  onClick={() => {
                    const ids = watch("phases").map((item) => item.index);
                    const id = ids.length > 0 ? Math.max(...ids) + 1 : 1;
                    append({ index: id, name: "" });
                  }}
                >
                  <div className="flex gap-2">
                    <PlusCircleIcon className="w-4" /> Agregar
                  </div>
                </button>
              </div>
            </div>
          </CardToggle>
        </fieldset>
        {
          <div className="">
            <Button type="submit" variant="primary">
              Enviar
            </Button>
          </div>
        }
      </form>
      <ModalClientes />
    </>
  );
}
