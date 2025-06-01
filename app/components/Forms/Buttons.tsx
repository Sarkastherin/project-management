import type { JSX, ButtonHTMLAttributes } from "react";
const variants = {
  primary: "border-indigo-600 bg-indigo-600 text-white hover:text-indigo-600 hover:border-indigo-600 dark:border-indigo-400 dark:bg-indigo-400 dark:text-zinc-800 dark:hover:text-indigo-400 dark:hover:border-indigo-400",
  secondary: "border-gray-600 bg-gray-600 text-white hover:text-gray-600 hover:border-gray-600 dark:border-gray-400 dark:bg-gray-400 dark:text-zinc-800 dark:hover:text-gray-400 dark:hover:border-gray-400",
  danger: "bg-red-500 border-red-500 text-white",
  indigo: "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-500",
  danger_outline:
    "border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
  green_outline:
    "border-lime-600 text-lime-600 hover:bg-lime-600 hover:text-white",
  secondary_outline:
    "border-zinc-400 text-zinc-400 hover:bg-zinc-400 hover:text-white",
};
const basesClass = "border cursor-pointer font-medium hover:bg-transparent";
const sizes = {
  sm: "text-xs h-8 px-4 rounded-sm",
  md: "text-sm py-2 px-4 rounded-md",
  lg: "h-13 px-6 rounded-md",
};

type ButtonProps = {
  children?: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};
type ButtonNativeProps = ButtonHTMLAttributes<HTMLButtonElement>;
type Props = ButtonProps & ButtonNativeProps;
export const Button = ({
  variant = "primary",
  size = "md",
  children,
  ...buttonProps
}: Props): JSX.Element => {
  return (
    <button
      className={`${basesClass} ${sizes[size]} ${variants[variant]}`}
      {...buttonProps}
    >
      {children}
    </button>
  );
};
