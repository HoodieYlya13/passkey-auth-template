"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SwitcherProps {
  currentElement: React.ReactNode;
  elements: {
    key: string;
    content: React.ReactNode;
    onClick: () => void;
  }[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Switcher({
  currentElement,
  elements,
  isOpen,
  setIsOpen,
}: SwitcherProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <motion.div
      className="space-x-2 flex overflow-hidden"
      ref={wrapperRef}
      layout
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="trigger"
            initial={{ x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(true)}
          >
            {currentElement}
          </motion.button>
        ) : (
          <motion.div
            key="options"
            className="flex space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {elements.map(({ key, content, onClick }) => (
              <button
                key={key}
                onClick={() => {
                  onClick();
                  setIsOpen(false);
                }}
              >
                {content}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
