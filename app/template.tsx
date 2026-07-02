"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Next.js re-mounts template.tsx on every route change, so this gives each
// page a smooth enter transition while keeping real multi-page routing.
// The nav and footer live in layout.tsx, outside this, so they stay put.
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
