"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

// A card that slides in from a side and drifts gently as you scroll.
// direction: -1 slides in from the left, 1 from the right, 0 straight up.
export function ScrollCard({
  children,
  direction = 0,
  className,
}: {
  children: ReactNode;
  direction?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 0.28, 1], [direction * 56, 0, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [26, -26]);
  const opacity = useTransform(scrollYProgress, [0, 0.18], [0, 1]);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ x, y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}
