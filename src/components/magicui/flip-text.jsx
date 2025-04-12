"use client";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

const defaultVariants = {
  hidden: { translateY: "2lh", opacity: 0 },
  visible: { translateY: "0", opacity: 1 },
  exit: { translateY: "-2lh", opacity: 0 },
};

export function FlipText({
  words = [],
  duration = 0.325,
  delayMultiple = 0.08,
  className,
  as: Component = "span",
  variants,
  ...props
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [words]);

  const displayWord = words.length > 0 ? words[currentWordIndex] : "";

  return (
    <div className="relative inline-block overflow-y-clip">
      <AnimatePresence mode="wait">
        <motion.span
          key={displayWord}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants || defaultVariants}
          transition={{
            duration,
            ease: [0.66, 0, 0.34, 1],
            translate: {
              duration: 0,
              delay: duration / 2,
            },
          }}
          className={cn("inline-block", className)}
          {...props}
        >
          {displayWord}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
