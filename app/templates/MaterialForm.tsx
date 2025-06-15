import type {
  MaterialsInput,
  CategoryType,
  SubCategoryType,
} from "~/backend/dataBase";
import { materialsApi } from "~/backend/dataBase";
import { useForm } from "react-hook-form";
import { useUI } from "~/context/UIContext";
import { CardToggle } from "~/components/Generals/Cards";
import { Input, Select } from "~/components/Forms/Inputs";
import FooterForms from "./FooterForms";
import { useEffect, useState } from "react";
import type { ChangeEventHandler } from "react";
import { useNavigate } from "react-router";
export type MaterialFormType = MaterialsInput;
type MaterialFormProps = {
  defaultValues: MaterialFormType;
  mode: "create" | "view";
};

export const MaterialForm = ({ defaultValues, mode }: MaterialFormProps) => {
     const navigate = useNavigate()
  const [filterCategories, setFilterCategories] = useState<CategoryType[]>([]);
  const [filterSubCategories, setFilterSubCategories] = useState<
    SubCategoryType[]
  >([]);
  const { isModeEdit, showModal, getCategorizations, categorizations, setSelectedMaterial } =
    useUI();
  const {
    register,
    watch,
    formState: { errors, dirtyFields, isSubmitSuccessful },
    control,
    setValue,
    handleSubmit,
  } = useForm<MaterialFormType>({
    defaultValues: defaultValues ?? {
      id_subcategory: null,
      description: "",
      id_unit: null,
    },
  });
  const onSubmit = async (formData: MaterialFormType) => {
    showModal({
      title: "⌛ Procesando...",
      message: `Procesando requerimiento`,
    });
    if (mode === "create") {
      try {
        const { data, error } = await materialsApi.insertOne(formData);
        if (error) throw new Error(String(error));
        setSelectedMaterial(null)
        navigate(`/material/${data?.id}`)
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
        //refreshMaterial()
      }
    }
  };
  useEffect(() => {
    getCategorizations();
  }, []);
  const loadCategorysByFamily = (id_family: number) => {
    if (!categorizations) return;
    const { categories } = categorizations;
    setFilterCategories(
      categories?.filter(
        (category) => category.id_family === Number(id_family)
      ) || []
    );
  };
  const loadSubcategoryByCategory = (id_category: number) => {
     if (!categorizations) return;
    const { subcategories } = categorizations;
    setFilterSubCategories(
      subcategories?.filter(
        (subcategory) => subcategory.id_category === Number(id_category)
      ) || []
    );
  }
  const handleChangeFamily: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const target = e.target;
    const value: string = target.value;
    if (value === "") return;
    loadCategorysByFamily(Number(value));
  };
  const handleChangeCategory: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const target = e.target;
    const value: string = target.value;
    if (value === "") return;
    loadSubcategoryByCategory(Number(value))
  };
  useEffect(() => {
    if (mode === "view") {
      const id_subcategory = watch("id_subcategory");
      const id_category = categorizations?.subcategories
        ? categorizations.subcategories.find(
            (subcategory) => subcategory.id === id_subcategory
          )?.id_category
        : undefined;
      if (!id_category) {console.error("no hay id_category"); return};
      const id_family = categorizations?.categories?.find(
        (category) => category.id === id_category
      )?.id_family;
      const familyElement = document.getElementById(
        "id_family"
      ) as HTMLSelectElement | null;
      const categoryElement = document.getElementById(
        "id_category"
      ) as HTMLSelectElement | null;
      if (familyElement && id_family !== undefined) {
        familyElement.value = String(id_family);
        loadCategorysByFamily(id_family);
        if(categoryElement && id_category !== undefined) {
          categoryElement.value = String(id_category)
          loadSubcategoryByCategory(id_category);
          setValue("id_subcategory", id_subcategory)
        }
      }
    }
  }, [defaultValues, categorizations]);
  return (
    <>
      {categorizations && (
        <form
          className=" flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset disabled={!isModeEdit}>
            <CardToggle title="Datos del material">
              <div className="flex flex-col gap-4">
                <Select
                  id="id_family"
                  label="Familia"
                  selectText="Selecciona familia"
                  onChange={handleChangeFamily}
                  error={errors.id_subcategory?.message}
                >
                  {categorizations.families?.map((family) => (
                    <option key={family.id} value={family.id}>
                      {family.description}
                    </option>
                  ))}
                </Select>
                <Select
                  id="id_category"
                  label="Rubro"
                  selectText="Seleccion rubro"
                  onChange={handleChangeCategory}
                  error={errors.id_subcategory?.message}
                >
                  {filterCategories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.description}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Sub-rubro"
                  selectText="Seleccion sub-rubro"
                  {...register("id_subcategory", {
                    required: "Campo requerido",
                    valueAsNumber: true,
                  })}
                  error={errors.id_subcategory?.message}
                >
                  {filterSubCategories?.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.description}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Descripción"
                  placeholder="Descripción del material"
                  {...register("description", { required: "Campo requerido" })}
                  error={errors.description?.message}
                />
                <Select
                  label="Unidad"
                  selectText="Selecciona unidad"
                  {...register("id_unit", {
                    required: "Campo requerido",
                    valueAsNumber: true,
                  })}
                  error={errors.id_unit?.message}
                >
                  {categorizations.units?.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.description}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Peso"
                  type="number"
                  placeholder="Peso en gramos"
                  defaultValue={0}
                  {...register("weight", { valueAsNumber: true })}
                />
                <Input
                  label="Aplicación"
                  placeholder="Aplicación"
                  {...register("applycation")}
                />
              </div>
            </CardToggle>
          </fieldset>
          <FooterForms mode={mode} />
        </form>
      )}
    </>
  );
};
