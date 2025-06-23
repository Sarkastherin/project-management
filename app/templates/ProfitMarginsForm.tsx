import { Input } from "~/components/Forms/Inputs";
import { CardToggle, Card } from "~/components/Generals/Cards";
import { useForm } from "react-hook-form";
import { useUI } from "~/context/UIContext";
import ModalClientes from "~/components/Specific/ModalClientes";
import { useEffect} from "react";
import  FooterForms from "./FooterForms";
import {
  type ProfitMarginType,
} from "~/backend/dataBase";

export default function ProfitMarginsForm({
  quoteActive,
}: {quoteActive: number}) {
  const { isModeEdit, handleSetIsFieldsChanged, selectedOpportunity  } = useUI();
  const { profit_margins} = selectedOpportunity || {}
  const {
    register,
    formState: { dirtyFields, isSubmitSuccessful, isDirty },
    handleSubmit,
    reset
  } = useForm<ProfitMarginType>({
    defaultValues: {},
  });
  const onSubmit = async (formData: ProfitMarginType) => {

    console.log("formData", formData);
  };
 useEffect(() => {
    handleSetIsFieldsChanged(isSubmitSuccessful, isDirty);
  }, [isSubmitSuccessful, isDirty]);
  useEffect(() => {
    if(selectedOpportunity) {
      reset(profit_margins?.find(margins => margins.id_quote === quoteActive))
    }
  },[selectedOpportunity, quoteActive])
  return (
    <>
      <form className=" flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={!isModeEdit}>
          <CardToggle title="Margenes de Ganancias">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto divide-y-2 divide-zinc-200 dark:divide-zinc-700">
                <colgroup>
                  <col />
                  <col className="w-[1%]" />
                  <col className="w-[1%]" />
                  <col className="w-[20%]" />
                  <col className="w-[1%]" />
                </colgroup>
                <thead className="ltr:text-left rtl:text-right">
                  <tr className="*:font-medium *:text-zinc-900 dark:*:text-white">
                    <th className="px-3 py-2 whitespace-nowrap">
                      Categoria de Cotización
                    </th>
                    <th className="px-3 py-2 whitespace-nowrap">Total</th>
                    <th className="px-3 py-2 whitespace-nowrap">INC %</th>
                    <th className="px-3 py-2 whitespace-nowrap">Márgen/Comp</th>
                    <th className="px-3 py-2 whitespace-nowrap">
                      Total con M/S
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  <tr className="*:text-zinc-900 *:first:font-medium dark:*:text-white">
                    <td className="px-3 py-2 whitespace-nowrap">Materiales</td>
                    <td className="px-3 py-2 whitespace-nowrap">US$ 0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap">0 %</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <Input placeholder="0%" {...register('materials')} />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">US$ 0.00</td>
                  </tr>
                  <tr className="*:text-zinc-900 *:first:font-medium dark:*:text-white">
                    <td className="px-3 py-2 whitespace-nowrap">
                      Mano de obra
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">US$ 0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap">0 %</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <Input placeholder="0%" {...register('labor')} />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">US$ 0.00</td>
                  </tr>
                  <tr className="*:text-zinc-900 *:first:font-medium dark:*:text-white">
                    <td className="px-3 py-2 whitespace-nowrap">
                      Subcontratos
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">US$ 0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap">0 %</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <Input placeholder="0%" {...register('subcontracting')} />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">US$ 0.00</td>
                  </tr>
                  <tr className="*:text-zinc-900 *:first:font-medium dark:*:text-white">
                    <td className="px-3 py-2 whitespace-nowrap">Otros</td>
                    <td className="px-3 py-2 whitespace-nowrap">US$ 0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap">0 %</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <Input placeholder="0%" {...register('others')} />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">US$ 0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardToggle>
        </fieldset>
        <fieldset disabled={!isModeEdit}>
          <Card>
            <table className="min-w-full table-auto ">
              <colgroup>
                <col className="w-[1%]" />
                <col className="w-[20%]" />
                <col className="w-[1%]" />
              </colgroup>
              <thead className="ltr:text-left rtl:text-right">
                <tr className="*:font-medium *:text-zinc-900 dark:*:text-white">
                  <th className="px-3 py-2 whitespace-nowrap">Total</th>
                  <th className="px-3 py-2 whitespace-nowrap">Márgen final</th>
                  <th className="px-3 py-2 whitespace-nowrap">Precio final</th>
                </tr>
              </thead>
              <tbody className="">
                <tr className="*:text-zinc-900 *:first:font-medium dark:*:text-white">
                  <td className="px-3 py-2 whitespace-nowrap">US$ 0.00</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <Input placeholder="0%" {...register('general')} />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">US$ 0.00</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </fieldset>
        <FooterForms mode="view"/>
      </form>
      <ModalClientes />
    </>
  );
}
