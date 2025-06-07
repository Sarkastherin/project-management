import type React from "react";
import { Button } from "../Forms/Buttons";
import { useNavigate } from "react-router";
import { variants } from "../Forms/Buttons";
import { TrashIcon } from "@heroicons/react/16/solid";
import type { ButtonHTMLAttributes } from "react";
type ButtonProps = {}
export const ButtonNavigate = ({
  route,
  variant,
  children,
}: {
  route: string;
  variant?: keyof typeof variants;
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  return (
    <Button type="button" variant={variant} onClick={() => navigate(route)}>
      {children}
    </Button>
  );
};
export const ButtonDeleteIcon = ({...buttonProps}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      type="button"
      title="Eliminar"
      className="cursor-pointer rounded-full border border-gray-300 p-2 text-gray-300 
             hover:text-red-500 hover:border-red-500 
             focus:outline-none focus:ring-0 
             focus:text-white focus:border-red-500 focus:bg-red-500 
             transition-colors duration-400 ease-in-out 
             dark:border-gray-500 dark:text-gray-500 
             dark:hover:text-red-400 dark:hover:border-red-400 
             dark:focus:text-zinc-700 dark:focus:bg-red-400 dark:focus:border-red-400"
             {...buttonProps}
    >
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-4" />
    </button>
  );
};
