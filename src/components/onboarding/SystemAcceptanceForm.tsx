"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { acceptSystemContract, declineSystemContract } from "@/app/auth/actions";
import { AlertCircle } from "lucide-react";

export function SystemAcceptanceForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleAccept = () => {
    setError("");
    startTransition(async () => {
      const result = await acceptSystemContract();
      // acceptSystemContract() now uses redirect() on success — this only runs on error
      if (result?.error) {
        setError(result.error);
      }
      // Success = server-side redirect, no client navigation needed
    });
  };

  const handleDecline = () => {
    startTransition(async () => {
      await declineSystemContract();
      // declineSystemContract signs out and redirects to "/" server-side
    });
  };

  return (
    <div className="space-y-6">
      {/* Dramatic heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h3 className="font-orbitron text-2xl sm:text-3xl font-black tracking-wider uppercase leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400">
          THE ARISE SYSTEM HAS SELECTED YOU
        </h3>
      </motion.div>

      {/* Contract text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="space-y-3"
      >
        <p className="font-sans text-sm text-neutral-400 leading-relaxed">
          By accepting this contract, you begin your journey of growth, discipline, and evolution.
        </p>
        <p className="font-sans text-sm text-neutral-400 leading-relaxed">
          Your life will now be{" "}
          <span className="text-cyan-400">tracked</span>,{" "}
          <span className="text-cyan-400">measured</span>, and{" "}
          <span className="text-cyan-400">improved</span>.
        </p>
      </motion.div>

      {/* Highlighted question */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="py-3 px-4 border border-cyan-500/20 bg-cyan-500/5 [clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]"
      >
        <p className="font-orbitron text-sm tracking-widest text-cyan-400 uppercase">
          Do you accept?
        </p>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            key="step-err"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-start gap-2.5 border border-red-500/30 bg-red-500/10 px-3 py-3 [clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]"
          >
            <AlertCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
            <span className="font-sans text-xs text-red-300">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 pt-2"
      >
        {/* ACCEPT */}
        <motion.button
          type="button"
          onClick={handleAccept}
          disabled={isPending}
          whileHover={isPending ? {} : { scale: 1.01 }}
          whileTap={isPending ? {} : { scale: 0.99 }}
          className="flex-1 relative flex items-center justify-center gap-2.5 font-orbitron text-[11px] tracking-widest uppercase font-bold py-3.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer [clip-path:polygon(0_6px,6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)]
            before:absolute before:inset-0 before:-z-10 before:[clip-path:polygon(0_6px,6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)]
            before:bg-cyan-500/30 hover:before:bg-cyan-400/40 before:transition-colors
            after:absolute after:inset-[1px] after:-z-10 after:[clip-path:polygon(0_5px,5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%)]
            after:bg-cyan-950/30 hover:after:bg-cyan-950/50 after:transition-colors
            text-cyan-400 hover:text-cyan-300"
        >
          {isPending ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border border-cyan-700 border-t-cyan-400 animate-spin" />
              Processing...
            </>
          ) : (
            "▶  ACCEPT"
          )}
        </motion.button>

        {/* DECLINE */}
        <motion.button
          type="button"
          onClick={handleDecline}
          disabled={isPending}
          whileHover={isPending ? {} : { scale: 1.01 }}
          whileTap={isPending ? {} : { scale: 0.99 }}
          className="flex-1 relative flex items-center justify-center gap-2.5 font-orbitron text-[11px] tracking-widest uppercase font-bold py-3.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer [clip-path:polygon(0_6px,6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)]
            before:absolute before:inset-0 before:-z-10 before:[clip-path:polygon(0_6px,6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)]
            before:bg-neutral-800 hover:before:bg-neutral-700 before:transition-colors
            after:absolute after:inset-[1px] after:-z-10 after:[clip-path:polygon(0_5px,5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%)]
            after:bg-black after:transition-colors
            text-neutral-500 hover:text-neutral-200"
        >
          DECLINE
        </motion.button>
      </motion.div>
    </div>
  );
}
