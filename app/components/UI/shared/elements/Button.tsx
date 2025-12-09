import clsx from "clsx";

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  child: React.ReactNode;
  errorMessage?: string;
  successMessage?: string;
  disabled?: boolean;
};

export default function Button({ type, onClick, className, child, errorMessage, successMessage, disabled = false }: SubmitButtonProps) {
  const baseClassName = clsx(
    "rounded-2xl sm:rounded-3xl md:rounded-[1.75rem] liquid-glass py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 font-semibold transition-all duration-300 ease-in-out outline-none shadow-sm focus:ring focus:ring-white focus:shadow-white hover:ring hover:ring-white hover:shadow-white text-foreground text-lg sm:text-xl md:text-2xl text-center",
    disabled
      ? "opacity-30 cursor-not-allowed inset-shadow-sm inset-shadow-black"
      : "cursor-pointer custom-shadow custom-shadow-hover"
  );
  return (
    <>
      <button
        type={type}
        disabled={disabled}
        className={clsx(baseClassName, className)}
        onClick={onClick}
      >
        {child}
      </button>
      {successMessage && <p className="text-green-400">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </>
  );
}