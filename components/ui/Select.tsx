"use client";

import { useEffect, useRef, useState } from "react";

export type SelectOption = { value: string; label: string };

// A custom dropdown that replaces the native <select>. The option list is
// regular DOM styled with explicit theme colors, so it stays readable under OS
// dark mode, browser force-dark, or extensions — unlike native <select> popups,
// which the browser draws and can leave unthemed. Submits its value via a
// hidden input when `name` is set, so it works inside plain <form> actions.
export default function Select({
  name,
  defaultValue,
  options,
  onChange,
  ariaLabel,
  className = "",
  compact = false,
}: {
  name?: string;
  defaultValue?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  ariaLabel?: string;
  className?: string;
  compact?: boolean;
}) {
  const [value, setValue] = useState(defaultValue ?? options[0]?.value ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    function onDocPointer(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocPointer);
    return () => document.removeEventListener("mousedown", onDocPointer);
  }, [open]);

  function commit(next: string) {
    setValue(next);
    onChange?.(next);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function openList() {
    const idx = options.findIndex((o) => o.value === value);
    setActiveIndex(idx < 0 ? 0 : idx);
    setOpen(true);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(options[activeIndex].value);
    }
  }

  const sizeClass = compact ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm";

  return (
    <div ref={rootRef} className="relative">
      {name && <input type="hidden" name={name} value={value} />}
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`flex items-center justify-between gap-2 rounded-md border border-black/15 bg-transparent outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/40 ${sizeClass} ${className}`}
      >
        <span className="truncate">{selected?.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
          className="shrink-0 opacity-60"
        >
          <path d="M2 4.5L6 8.5L10 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1 max-h-60 min-w-full overflow-auto rounded-md border border-black/15 bg-white py-1 text-black shadow-lg dark:border-white/20 dark:bg-neutral-900 dark:text-white"
        >
          {options.map((opt, i) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => commit(opt.value)}
              className={`cursor-pointer whitespace-nowrap px-3 py-2 text-sm ${
                i === activeIndex ? "bg-black/5 dark:bg-white/10" : ""
              } ${opt.value === value ? "font-medium" : ""}`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
