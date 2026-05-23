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
    "rounded-xl liquid-glass py-2.5 px-4 font-semibold transition-all duration-300 ease-in-out outline-none shadow-sm focus:ring focus:ring-white/20 focus:shadow-white/10 hover:ring hover:ring-white/20 hover:shadow-white/10 text-sm sm:text-base text-center",
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
