import { Input, Select, Textarea } from "~/components/Forms/Inputs";
import { StatusOptions } from "~/components/Specific/StatusOptions";
import { CardToggle } from "~/components/Generals/Cards";
import { useForm, useFieldArray } from "react-hook-form";
import { ButtonDeleteIcon, ButtonAdd } from "~/components/Specific/Buttons";
import { useUI } from "~/context/UIContext";
import ModalClientes from "~/components/Specific/ModalClientes";
import { useEffect, useState, useRef } from "react";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { useParams } from "react-router";
import {
  opportunityApi,
  phasesApi,
  type OpportunityInput,
  type PhasesType,
} from "~/backend/dataBase";
import FooterForms from "./FooterForms";
// Ensure OpportunityType includes phases as an array
type PhasesCreateType = { id?: number; name: string; id_opportunity?: number };
export type OpportunityFormType = OpportunityInput & {
  phases: PhasesCreateType[];
};
type OpportunityFormProps = {
  defaultValues: OpportunityFormType;
  mode: "create" |"view";
};
export default function OpportunityForm({
  defaultValues,
  mode,
}: OpportunityFormProps) {
  const { id } = useParams();
  const [phasesToDelete, setPhasesToDelete] = useState<Array<PhasesType["id"]>>(
    []
  );
  const {
    setOpenClientModal,
    selectedClient,
    showModal,
    refreshOpportunity,
    isModeEdit,
    handleSetIsFieldsChanged,
  } = useUI();
  const {
    register,
    watch,
    formState: { errors, dirtyFields, isSubmitSuccessful },
    control,
    setValue,
    handleSubmit,
  } = useForm<OpportunityFormType>({
    defaultValues: defaultValues ?? {
      name: "",
      id_client: undefined,
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
    if (selectedClient && selectedClient.id !== watch("id_client")) {
      setValue("id_client", selectedClient.id, { shouldDirty: true });
    }
  }, [selectedClient]);
  const onSubmit = async (formData: OpportunityFormType) => {
    showModal({
      title: "⌛ Procesando...",
      message: `Procesando requerimiento`,
    });
    if (mode === "create") {
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
          phases.length > 0 ? phases : [{ name: data.name }];
        const phasesPayload = phasesToInsert.map((phase) => ({
          name: phase.name,
          id_opportunity: id,
        }));
        const { error: phasesError } = await phasesApi.insert(phasesPayload);
        if (phasesError) throw new Error(String(phasesError));
        showModal({
          title: "Guardado con exito",
          message: `Se ha guardado la oportunidad`,
          variant: "success",
        });
      } catch (e) {
        showModal({
          title: "Error al guardar",
          message: "No se pudo guardar la oportunidad. Error:",
          code: String(e),
          variant: "error",
        });
      }
    }
    if (mode === "view" && isModeEdit) {
      try {
        const updatePayload: Record<string, string | number | object | null> =
          {};
        const { phases, ...simple_values } = formData;
        (Object.keys(dirtyFields) as Array<keyof typeof simple_values>).forEach(
          (field) => {
            if (
              dirtyFields[field] &&
              simple_values[field] !== undefined &&
              simple_values[field] !== null
            ) {
              updatePayload[field as keyof typeof simple_values] =
                simple_values[field];
            }
          }
        );
        const { error } = await opportunityApi.update({
          id: Number(id),
          values: updatePayload,
        });
        if (error)
          throw new Error(
            `No se pudo actualizar la oportunidad. Error: ${String(error)}`
          );
        const { error: savePhasesError } = await savePhases(
          phases,
          Number(id),
          phasesToDelete
        );
        if (savePhasesError) throw new Error(savePhasesError.message);
        showModal({
          title: "Actualizado con exito",
          message: `Se ha actualizado la oportunidad`,
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
    }
  };
  const savePhases = async (
    phases: PhasesType[] | PhasesCreateType[],
    id_opportunity: number,
    phasesToDelete: number[] // <- lo agregás acá
  ): Promise<{ error: Error | null }> => {
    try {
      // Crear o actualizar
      for (const phase of phases) {
        const hasId = phase.hasOwnProperty("id");

        if (hasId) {
          const { error: updatePhaseError } = await phasesApi.update({
            id: phase.id!,
            values: { name: phase.name },
          });
          if (updatePhaseError) throw new Error(updatePhaseError.message);
        }
        if (!hasId) {
          const insertPhase = {
            ...phase,
            id_opportunity,
          };
          const { error: insertPhaseError } = await phasesApi.insertOne(
            insertPhase
          );
          if (insertPhaseError) throw new Error(insertPhaseError.message);
        }
      }
      // Eliminar
      if (phasesToDelete.length > 0) {
        for (const id of phasesToDelete) {
          const { error: errorRemovePhase } = await phasesApi.remove({ id });
          if (errorRemovePhase) throw new Error(errorRemovePhase.message);
        }
      }

      return { error: null };
    } catch (e) {
      return { error: e as Error };
    }
  };
  const isLost = watch("status") === "Perdida";
  useEffect(() => {
    handleSetIsFieldsChanged(dirtyFields, isSubmitSuccessful);
  }, [dirtyFields, isSubmitSuccessful]);
  return (
    <>
      <form className=" flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={!isModeEdit}>
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
                    value: isLost,
                    message: "Campo requerido",
                  },
                })}
                error={errors.loss_reason?.message}
              />
            </div>
          </CardToggle>
        </fieldset>
        <fieldset disabled={!isModeEdit}>
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
                      key={item.id ?? index}
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
                        <ButtonDeleteIcon
                          onClick={() => {
                            const itemId = defaultValues.phases[index]?.id;
                            if (itemId)
                              setPhasesToDelete((prev) => [...prev, itemId]);
                            remove(index);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4">
                <ButtonAdd
                  aria-label="Agregar nueva etapa"
                  onClick={() => {
                    append({ name: "" });
                  }}
                />
              </div>
            </div>
          </CardToggle>
        </fieldset>
        <FooterForms mode={mode}/>
      </form>
      <ModalClientes />
    </>
  );
}
