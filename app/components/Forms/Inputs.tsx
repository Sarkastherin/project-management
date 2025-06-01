import type { InputHTMLAttributes, SelectHTMLAttributes, JSX } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
const basesClass = (error: string) => {
  return `mt-0.5 w-full rounded border py-2 px-2 shadow-sm sm:text-sm
          ${error ? "border-red-500" : "border-zinc-300 dark:border-zinc-600"}
          dark:text-zinc-200`;
};
type InputProps = {
  label?: string;
  register?: UseFormRegisterReturn;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;
//type InputNativeProps = InputHTMLAttributes<HTMLInputElement>;
//type Props = InputProps & InputNativeProps;
export const Input = ({
  label,
  id,
  register,
  error,
  ...inputProps
}: InputProps): JSX.Element => {
  return (
    <label htmlFor={id}>
      <span
        className={`text-sm font-medium text-zinc-700 dark:text-zinc-200 ${
          !label && "sr-only"
        }`}
      >
        {label}
      </span>

      <input
        id={id}
        className={basesClass(error ?? "")}
        {...inputProps}
        {...register}
      />
    </label>
  );
};
type SelectProps = {
  label?: string;
  register?: UseFormRegisterReturn;
  error?: string;
  selectText?: string;
  children?: React.ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>;
export const Select = ({
  label,
  id,
  register,
  error,
  selectText ="Seleccione una opción",
  children,
  ...selectProps
}: SelectProps): JSX.Element => {
  return (
    <div>
      <label htmlFor={id}>
        <span
          className={`text-sm font-medium text-zinc-700 dark:text-zinc-200 ${
            !label && "sr-only"
          }`}
        >
          {label}
        </span>
        <div className="relative">
          <select
            name={id}
            id={id}
            className={`${basesClass(
              error ?? ""
            )}  dark:bg-zinc-800 dark:text-white appearance-none`}
            {...selectProps}
            {...register}
          >
            <option value="">{selectText}</option>
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            <svg
              className="h-4 w-4 text-gray-500 dark:text-zinc-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 12a1 1 0 0 1-.707-.293l-3-3a1 1 0 1 1 1.414-1.414L10 9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3A1 1 0 0 1 10 12z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </label>
    </div>
  );
};
