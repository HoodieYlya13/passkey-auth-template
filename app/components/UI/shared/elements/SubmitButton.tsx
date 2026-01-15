import Button from "./Button";

interface SubmitButtonProps {
  label: string;
  error?: string;
  disabled?: boolean;
}

export default function SubmitButton({
  label,
  error,
  disabled,
}: SubmitButtonProps) {
  return (
    <>
      <Button
        type="submit"
        disabled={disabled}
        child={label}
        className="w-full"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </>
  );
}
