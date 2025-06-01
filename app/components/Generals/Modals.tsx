import { Button } from "../Forms/Buttons";
type ModalBaseProps = {
  title: string;
  message: string;
  onClose: () => void;
};

export default function ModalBase({ title, message, onClose }: ModalBaseProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-content-center bg-white/10 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
        <div className="flex items-start justify-between">
          <h2
            id="modalTitle"
            className="text-xl font-bold text-zinc-900 sm:text-2xl dark:text-white"
          >
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
        </div>

        <footer className="mt-6 flex justify-end">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
          >
            Cerrar
          </Button>
        </footer>
      </div>
    </div>
  );
}
