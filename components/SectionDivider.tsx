"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DividerVariant = "wave" | "pulse" | "circuit" | "dots" | "layered";

interface SectionDividerProps {
  variant?: DividerVariant | "random";
  autoCycle?: boolean;
  cycleInterval?: number;
  className?: string;
}

export default function SectionDivider({
  variant = "random",
  autoCycle = false,
  cycleInterval = 8000,
  className = "w-full h-32",
}: SectionDividerProps) {
  const variants: DividerVariant[] = ["wave", "pulse", "circuit", "dots", "layered"];
  const [current, setCurrent] = useState<DividerVariant | null>(null);

  // pick initial variant
  useEffect(() => {
    if (variant === "random") {
      setCurrent(variants[Math.floor(Math.random() * variants.length)]);
    } else {
      setCurrent(variant);
    }
  }, [variant]);

  // auto-cycle variant
  useEffect(() => {
    if (!autoCycle || !current) return;
    const interval = setInterval(() => {
      setCurrent(variants[Math.floor(Math.random() * variants.length)]);
    }, cycleInterval);
    return () => clearInterval(interval);
  }, [autoCycle, current, cycleInterval]);

  if (!current) return null;

  const renderDivider = () => {
    switch (current) {
      case "wave":
        return (
          <motion.svg
            className={className}
            viewBox="0 0 1440 120"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <path
              d="M0 40 C 360 80 1080 0 1440 40 L1440 120 L0 120 Z"
              fill="url(#waveGradient)"
            />
            <defs>
              <linearGradient id="waveGradient" x1="0" y1="0" x2="1440" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </motion.svg>
        );
      case "pulse":
        return (
          <motion.svg
            className={className}
            viewBox="0 0 1440 120"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
          >
            <path
              d="M0 60 Q 120 20 240 60 T 480 60 T 720 60 T 960 60 T 1200 60 T 1440 60 L1440 120 L0 120 Z"
              fill="url(#pulseGradient)"
            />
            <defs>
              <linearGradient id="pulseGradient" x1="0" y1="0" x2="1440" y2="0">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </motion.svg>
        );
      case "circuit":
        return (
          <motion.svg
            className={className}
            viewBox="0 0 1440 120"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <path
              d="M0 40 L 360 80 L 720 40 L 1080 80 L 1440 40 L1440 120 L0 120 Z"
              fill="url(#circuitGradient)"
            />
            <defs>
              <linearGradient id="circuitGradient" x1="0" y1="0" x2="1440" y2="0">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </motion.svg>
        );
      case "dots":
        const circles = Array.from({ length: 20 }).map((_, i) => (
          <circle
            key={i}
            cx={(i + 0.5) * 72}
            cy={Math.random() * 60 + 30}
            r={Math.random() * 5 + 3}
            fill={`rgba(59,130,246, ${Math.random() * 0.6 + 0.2})`}
          />
        ));
        return (
          <motion.svg
            className={className}
            viewBox="0 0 1440 120"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
          >
            {circles}
          </motion.svg>
        );
      case "layered":
        return (
          <motion.svg
            className={className}
            viewBox="0 0 1440 120"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 40 }}
          >
            <path d="M0 50 C 360 90 1080 10 1440 50 L1440 120 L0 120 Z" fill="#3b82f6" opacity={0.6} />
            <path d="M0 60 C 360 100 1080 20 1440 60 L1440 120 L0 120 Z" fill="#06b6d4" opacity={0.5} />
            <path d="M0 70 C 360 120 1080 30 1440 70 L1440 120 L0 120 Z" fill="#8b5cf6" opacity={0.4} />
          </motion.svg>
        );
      default:
        return null;
    }
  };

  return <AnimatePresence>{renderDivider()}</AnimatePresence>;
}
