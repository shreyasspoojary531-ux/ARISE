"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitPlayerRegistration } from "@/app/auth/actions";
import { AlertCircle } from "lucide-react";
import { OnboardingInput } from "./OnboardingInput";
import { cn } from "@/lib/utils";

const SUGGESTED_GOALS = [
  "Build Muscle",
  "Lose Weight",
  "Learn Programming",
  "Improve Discipline",
  "Become Financially Independent",
];

export function PlayerRegistrationForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("");
  const [errors, setErrors] = useState<{ name?: string; age?: string; goal?: string }>({});
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Full name is required.";
    if (!age.trim()) errs.age = "Age is required.";
    else {
      const ageNum = Number(age);
      if (!Number.isInteger(ageNum) || ageNum < 13 || ageNum > 120)
        errs.age = "Enter a valid age (13–120).";
    }
    if (!goal.trim()) errs.goal = "Primary goal is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    startTransition(async () => {
      const fd = new FormData();
      fd.set("name", name);
      fd.set("age", age);
      fd.set("goal", goal);
      const result = await submitPlayerRegistration(fd);
      // submitPlayerRegistration() now uses redirect() on success — this only runs on error
      if (result?.error) {
        setFormError(result.error);
      }
      // Success = server-side redirect, no client navigation needed
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

      {/* Full Name */}
      <OnboardingInput
        id="name"
        label="Full Name"
        value={name}
        onChange={(v) => {
          setName(v);
          setErrors((e) => ({ ...e, name: undefined }));
        }}
        placeholder="Enter your full name"
        error={errors.name}
        autoComplete="name"
      />

      {/* Age */}
      <OnboardingInput
        id="age"
        label="Age"
        value={age}
        onChange={(v) => {
          setAge(v);
          setErrors((e) => ({ ...e, age: undefined }));
        }}
        placeholder="e.g. 25"
        type="number"
        inputMode="numeric"
        error={errors.age}
        autoComplete="off"
      />

      {/* Primary Goal */}
      <div className="space-y-2">
        <OnboardingInput
          id="goal"
          label="Primary Goal"
          value={goal}
          onChange={(v) => {
            setGoal(v);
            setErrors((e) => ({ ...e, goal: undefined }));
          }}
          placeholder="Enter your primary goal"
          error={errors.goal}
          autoComplete="off"
        />
        {/* Suggested goals */}
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_GOALS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                setGoal(g);
                setErrors((e) => ({ ...e, goal: undefined }));
              }}
              className={cn(
                "font-orbitron text-[8px] tracking-widest uppercase px-2 py-1 transition-all duration-150 cursor-pointer border",
                "[clip-path:polygon(0_2px,2px_0,100%_0,100%_calc(100%-2px),calc(100%-2px)_100%,0_100%)]",
                goal === g
                  ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400"
                  : "bg-neutral-900/60 border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-700"
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Continue button */}
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
            Processing...
          </>
        ) : (
          "▶  CONTINUE"
        )}
      </motion.button>
    </form>
  );
}
