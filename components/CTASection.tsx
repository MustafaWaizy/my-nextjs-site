"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link"; // ✅ Import Link from Next.js

interface Node {
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  size: number;
}

export default function CTASection() {
  const [nodes, setNodes] = useState<Node[]>([]);

  // Initialize nodes
  useEffect(() => {
    const newNodes: Node[] = Array.from({ length: 30 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      size: Math.random() * 6 + 3,
    }));
    setNodes(newNodes);
  }, []);

  // Animate nodes
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prev) =>
        prev.map((n) => {
          let nx = n.x + n.vx;
          let ny = n.y + n.vy;

          if (nx > 100 || nx < 0) n.vx *= -1;
          if (ny > 100 || ny < 0) n.vy *= -1;

          return { ...n, x: nx, y: ny };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-24 text-center bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-700 overflow-hidden">
      {/* Neural Web Background */}
      <svg className="absolute inset-0 w-full h-full z-0">
        {nodes.map((a, i) =>
          nodes.map((b, j) => {
            if (i >= j) return null;
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 20) {
              return (
                <motion.line
                  key={`${i}-${j}`}
                  x1={`${a.x}%`}
                  y1={`${a.y}%`}
                  x2={`${b.x}%`}
                  y2={`${b.y}%`}
                  stroke="url(#neuralGradient)"
                  strokeWidth="0.8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.1, 0.5, 0.1] }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                  }}
                />
              );
            }
            return null;
          })
        )}

        {nodes.map((n, i) => (
          <motion.circle
            key={i}
            cx={`${n.x}%`}
            cy={`${n.y}%`}
            r={n.size / 2}
            fill="url(#neuralGradient)"
            animate={{ r: [n.size / 2, n.size, n.size / 2] }}
            transition={{ duration: Math.random() * 2 + 1.5, repeat: Infinity }}
          />
        ))}

        <defs>
          <linearGradient id="neuralGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Main CTA Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-3xl mx-auto px-6"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-6">
          Transform Your Business with AI 🚀
        </h2>
        <p className="text-lg md:text-xl text-white/80 mb-8">
          Discover intelligent solutions that streamline operations, enhance UX, and grow your impact.
        </p>

        {/* ✅ Updated Get Started button using Next.js Link */}
        <Link
          href="/get-support/request-quote"
          className="inline-block bg-gradient-to-r from-blue-400 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:scale-105 transition-transform duration-300"
        >
          Get Started
        </Link>
      </motion.div>
    </section>
  );
}
