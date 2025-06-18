/* Dependencies*/
import { useEffect } from "react";
import {
  Outlet,
  NavLink,
  useParams,
  useNavigate,
  useLocation,
} from "react-router";
import {
  BanknotesIcon,
  PresentationChartBarIcon,
  InboxIcon,
  ReceiptPercentIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/16/solid";
/* Contexts */
import { useUI } from "~/context/UIContext";
import type { JSX } from "react";

const menuItems = (id: number) => {
  return [
    {
      title: "Resumen",
      href: `/opportunity/${id}/resumen`,
      icon: <PresentationChartBarIcon className="w-4" />,
    },
    {
      title: "Información",
      href: `/opportunity/${id}/information`,
      icon: <InboxIcon className="w-4" />,
    },
    {
      title: "Cotización",
      href: `/opportunity/${id}/quotes/materials`,
      icon: <BanknotesIcon className="w-4" />,
    },
    {
      title: "Margenes",
      href: `/opportunity/${id}/profit-margin`,
      icon: <ReceiptPercentIcon className="w-4" />,
    },

    {
      title: "Condiciones",
      href: `/opportunity/${id}/conditions`,
      icon: <ExclamationCircleIcon className="w-4" />,
    },
  ];
};
export default function OpportunityLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    selectedOpportunity,
    getOpportunity,
    isFieldsChanged,
    setIsFieldsChanged,
  } = useUI();
  const { id } = useParams();
  const menu = menuItems(Number(id));
  useEffect(() => {
    getOpportunity(Number(id));
  }, []);
  const handleNavigate = (href: string) => {
    if (isFieldsChanged) {
      if (confirm("Tienes cambios sin guardar, ¿deseas continuar?")) {
        setIsFieldsChanged(false);
        navigate(href);
      }
    } else {
      navigate(href);
    }
  };
  const MyNavLink = ({
    href,
    icon,
    title,
  }: {
    href: string;
    icon: JSX.Element;
    title: string;
  }) => {
    const isActive = location.pathname === href;
    return (
      <button
        type="button"
        className={`cursor-pointer ${isActive ? "font-semibold text-indigo-600 dark:text-indigo-400" : "text-zinc-500 hover:text-indigo-500 dark:hover:text-indigo-400"}`}
        onClick={() => handleNavigate(href)}
      >
        <div className="flex gap-2 ">
          {icon}
          <p>{title}</p>
        </div>
      </button>
    );
  };
  return (
    <>
      <div className="px-10 pb-2 border-b border-zinc-100 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-zinc-700/25">
        <div className="flex gap-4 items-center py-4">
          <span className="rounded-sm p-1.5 bg-blue-500">
            {<BanknotesIcon className="w-5 text-white dark:text-zinc-900" />}
          </span>
          <h3 className="text-lg font-medium">{selectedOpportunity?.name}</h3>
        </div>
        <div title="menu bar" className="flex gap-10">
          {menu.map((item, index) => (
              <MyNavLink
                key={index}
                href={item.href}
                icon={item.icon}
                title={item.title}
              />
          ))}
        </div>
      </div>
      {selectedOpportunity ? (
        <Outlet />
      ) : (
        <p className="text-center mt-10">Cargando Oportunidad...</p>
      )}
    </>
  );
}
