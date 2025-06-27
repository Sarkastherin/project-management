import type React from "react";
import { Button } from "../Forms/Buttons";
import { useState } from "react";
export type ModalBaseProps = {
  title: string;
  message: React.ReactNode;
  onClose: () => void;
  variant?: "information" | "warning" | "error" | "success";
  code?: string;
};
const variants = {
  default: { color: "text-indigo-600 dark:text-indigo-400", icon: "" },
  information: { color: "text-blue-600 dark:text-blue-400", icon: "ℹ️" },
  warning: { color: "text-yellow-600 dark:text-yellow-400", icon: "⚠️" },
  error: { color: "text-red-600 dark:text-red-400", icon: "❌" },
  success: { color: "text-green-600 dark:text-green-400", icon: "✅" },
};
export default function ModalBase({
  title,
  message,
  onClose,
  variant,
  code,
}: ModalBaseProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-content-center bg-white/10 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div
        className={`w-full max-w-lg min-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900 ${
          variants[variant || "default"].color
        }`}
      >
        <div className="flex items-start justify-between">
          <h2 id="modalTitle" className="text-xl font-bold sm:text-2xl">
            <span>{variants[variant || "default"].icon}</span>
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="-me-4 -mt-4 rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600 focus:outline-none dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4">
          <p className="text-pretty text-zinc-700 dark:text-zinc-200">
            {message}
          </p>
          {code && (
            <>
              <p className="mt-2 mb-1 text-sm text-zinc-500 dark:text-zinc-400">
                Código de error:
              </p>
              <code className="block bg-zinc-300 dark:bg-zinc-800  rounded p-2">
                {code}
              </code>
            </>
          )}
        </div>

        <footer className="mt-6 flex justify-end">
          <Button type="button" onClick={onClose} variant="secondary">
            Cerrar
          </Button>
        </footer>
      </div>
    </div>
  );
}

interface ModalProps {
  children: React.ReactNode;
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
  title: string
}

export const Modal: React.FC<ModalProps> = ({ children, hidden, setHidden, title }) => {
  const onClose = () => {
    setHidden(true);
  };
  return (
    <div
      className={`fixed inset-0 z-50 grid place-content-center bg-white/10 p-4 ${
        hidden && "hidden"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div
        className={`w-full max-w-lg min-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400`}
      >
        <div className="flex items-start justify-between">
          <h2 id="modalTitle" className="text-xl font-bold sm:text-2xl">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="-me-4 -mt-4 rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600 focus:outline-none dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4"></div>
        {children}
        <footer className="mt-6 flex justify-end">
          <Button type="button" onClick={onClose} variant="secondary">
            Cerrar
          </Button>
        </footer>
      </div>
    </div>
  );
};
