"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { submitBodyMetrics } from "@/app/auth/actions";
import { AlertCircle } from "lucide-react";
import { OnboardingInput } from "./OnboardingInput";

export function BodyMetricsForm() {
  const router = useRouter();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [errors, setErrors] = useState<{ height?: string; weight?: string }>({});
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();

  const validate = () => {
    const errs: typeof errors = {};
    if (!height.trim()) errs.height = "Height is required.";
    else {
      const h = Number(height);
      if (!Number.isFinite(h) || h <= 0 || h > 300)
        errs.height = "Enter a valid height (1–300 cm).";
    }
    if (!weight.trim()) errs.weight = "Weight is required.";
    else {
      const w = Number(weight);
      if (!Number.isFinite(w) || w <= 0 || w > 500)
        errs.weight = "Enter a valid weight (1–500 kg).";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    startTransition(async () => {
      const fd = new FormData();
      fd.set("height", height);
      fd.set("weight", weight);
      const result = await submitBodyMetrics(fd);
      if (result?.error) {
        setFormError(result.error);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Form-level error */}
      <AnimatePresence>
        {formError && (
          <motion.div
            key="form-err"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-start gap-2.5 border border-red-500/30 bg-red-500/10 px-3 py-3 [clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]"
          >
            <AlertCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
            <span className="font-sans text-xs text-red-300">{formError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Height */}
      <OnboardingInput
        id="height"
        label="Height (cm)"
        value={height}
        onChange={(v) => {
          setHeight(v);
          setErrors((e) => ({ ...e, height: undefined }));
        }}
        placeholder="e.g. 175"
        type="number"
        inputMode="decimal"
        error={errors.height}
        autoComplete="off"
      />

      {/* Weight */}
      <OnboardingInput
        id="weight"
        label="Weight (kg)"
        value={weight}
        onChange={(v) => {
          setWeight(v);
          setErrors((e) => ({ ...e, weight: undefined }));
        }}
        placeholder="e.g. 70"
        type="number"
        inputMode="decimal"
        error={errors.weight}
        autoComplete="off"
      />

      {/* Unit note */}
      <p className="font-mono text-[9px] text-neutral-700 tracking-wider">
        METRIC UNITS ONLY // SI STANDARD
      </p>

      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={isPending}
        whileHover={isPending ? {} : { scale: 1.01 }}
        whileTap={isPending ? {} : { scale: 0.99 }}
        className="w-full relative flex items-center justify-center gap-2.5 font-orbitron text-[11px] tracking-widest uppercase font-bold mt-2 py-3.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer [clip-path:polygon(0_6px,6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)]
          before:absolute before:inset-0 before:-z-10 before:[clip-path:polygon(0_6px,6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%))]
          before:bg-cyan-500/30 hover:before:bg-cyan-400/40 before:transition-colors
          after:absolute after:inset-[1px] after:-z-10 after:[clip-path:polygon(0_5px,5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%))]
          after:bg-cyan-950/30 hover:after:bg-cyan-950/50 after:transition-colors
          text-cyan-400 hover:text-cyan-300"
      >
        {isPending ? (
          <>
            <div className="w-3.5 h-3.5 rounded-full border border-cyan-700 border-t-cyan-400 animate-spin" />
            Initializing...
          </>
        ) : (
          "▶  COMPLETE INITIALIZATION"
        )}
      </motion.button>
    </form>
  );
}
