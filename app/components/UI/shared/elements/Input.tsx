import React, { forwardRef, useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface VisibilityButtonProps {
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

function VisibilityButton({
  showPassword,
  setShowPassword,
  inputRef,
}: VisibilityButtonProps) {
  const restoreCursorPosition = () => {
    const input = inputRef.current;
    if (!input) return setShowPassword(false);

    const position = input.selectionStart;

    setShowPassword(false);
    setTimeout(() => {
      try {
        if (position !== null) input.setSelectionRange(position, position);
        input.focus();
      } catch (e) {
        console.error(e);
      }
    }, 0);
  };

  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        setShowPassword(true);
        inputRef.current?.focus();
      }}
      onMouseUp={restoreCursorPosition}
      onTouchStart={() => {
        setShowPassword(true);
        inputRef.current?.focus();
      }}
      onTouchEnd={restoreCursorPosition}
      onContextMenu={(e) => e.preventDefault()}
      className="absolute right-2 sm:right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white opacity-80 hover:opacity-100 transition-all duration-300 ease-in-out hover:scale-110 cursor-pointer"
      tabIndex={-1}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-5 sm:size-6 md:size-7"
        viewBox="0 -960 960 960"
        fill="currentColor"
      >
        {showPassword ? (
          <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
        ) : (
          <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
        )}
      </svg>
    </button>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  type: string;
  error?: string;
  focusOnMount?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, type, error, focusOnMount = false, ...rest },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setRefs = (node: HTMLInputElement) => {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref)
      (ref as React.RefObject<HTMLInputElement | null>).current = node;
  };

  useEffect(() => {
    if (focusOnMount && inputRef.current) inputRef.current.focus();
  }, [focusOnMount]);

  return (
    <>
      <div className="relative input-focus-glow">
        <input
          {...rest}
          id={id}
          ref={setRefs}
          type={type !== "password" ? type : showPassword ? "text" : "password"}
          placeholder={label}
          className={clsx(
            "liquid-glass-backdrop liquid-glass-background border block w-full rounded-2xl sm:rounded-3xl md:rounded-[1.75rem] shadow-sm placeholder-gray-400 outline-none p-2 sm:p-3 md:p-4 transition-all duration-300 ease-in-out focus:ring focus:ring-white focus:shadow-white hover:ring hover:ring-white hover:shadow-white custom-shadow custom-shadow-hover",
            error ? "border-red-500" : "liquid-glass-border-color",
            { "pr-10": type === "password" }
          )}
        />
        {type === "password" && (
          <VisibilityButton
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            inputRef={inputRef}
          />
        )}
      </div>
      {error && (
        <p className="ml-1 sm:ml-2 mt-1 text-xs sm:text-sm md:text-base text-red-500">
          {error}
        </p>
      )}
    </>
  );
});
export default Input;