"use client";

import type { InputHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
}

export function OnboardingInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  autoComplete,
  inputMode,
}: OnboardingInputProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block font-orbitron text-[9px] tracking-widest text-neutral-500 uppercase">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={cn(
          "w-full bg-neutral-900/60 px-4 py-3 text-sm font-sans text-white outline-none transition-colors duration-200 placeholder:text-neutral-700",
          "border [clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]",
          error ? "border-red-500/50 focus:border-red-400/70" : "border-neutral-800 focus:border-cyan-500/50"
        )}
      />
      {error ? (
        <p className="flex items-center gap-1.5 font-sans text-xs text-red-400">
          <AlertCircle size={10} className="shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
