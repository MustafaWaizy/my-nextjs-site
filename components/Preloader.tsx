"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Node {
  x: number;
  y: number;
  size: number;
}

interface CircleParticle {
  offsetAngle: number;
  size: number;
  radius: number;
  opacity: number;
}

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [circleParticles, setCircleParticles] = useState<CircleParticle[]>([]);

  const title = "LinorAI Technology";

  useEffect(() => {
    // Hide preloader after 6 seconds
    const timer = setTimeout(() => setIsLoading(false), 6000);

    // Generate nodes for neural network
    const generatedNodes: Node[] = Array.from({ length: 18 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 3,
    }));
    setNodes(generatedNodes);

    // Generate circle trail particles
    const generatedCircle: CircleParticle[] = Array.from({ length: 16 }).map(
      () => ({
        offsetAngle: Math.random() * 360,
        size: Math.random() * 4 + 2,
        radius: 64,
        opacity: Math.random() * 0.7 + 0.3,
      })
    );
    setCircleParticles(generatedCircle);

    return () => clearTimeout(timer);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const letter = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12 } },
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Neural Network Background */}
          <svg className="absolute inset-0 w-full h-full">
            {nodes.map((a, i) =>
              nodes.map((b, j) => {
                if (i >= j) return null;
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 22) {
                  return (
                    <motion.line
                      key={`${i}-${j}`}
                      x1={`${a.x}%`}
                      y1={`${a.y}%`}
                      x2={`${b.x}%`}
                      y2={`${b.y}%`}
                      stroke="url(#lineGradient)"
                      strokeWidth="1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.2, 0.6, 0.2] }}
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
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            {nodes.map((n, i) => (
              <motion.circle
                key={i}
                cx={`${n.x}%`}
                cy={`${n.y}%`}
                r={n.size / 2}
                fill="url(#lineGradient)"
                animate={{ r: [n.size / 2, n.size, n.size / 2] }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                }}
              />
            ))}
          </svg>

          <div className="flex flex-col items-center space-y-6 z-10 relative">
            {/* Rotating Circle with Particle Trails */}
            <motion.div
              className="relative w-32 h-32"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <div className="absolute w-32 h-32 border-4 border-t-4 border-blue-500 border-t-pink-500 rounded-full" />
              {circleParticles.map((cp, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 blur-sm"
                  style={{
                    width: cp.size,
                    height: cp.size,
                    top: "50%",
                    left: "50%",
                    translateX: -cp.size / 2,
                    translateY: -cp.size / 2,
                  }}
                  animate={{
                    x: cp.radius * Math.cos((cp.offsetAngle * Math.PI) / 180),
                    y: cp.radius * Math.sin((cp.offsetAngle * Math.PI) / 180),
                    opacity: [0, cp.opacity, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "linear",
                    repeatType: "loop",
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>

            {/* Neon Title */}
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold flex bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(128,0,255,0.8)]"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {title.split("").map((char, i) => (
                <motion.span key={i} variants={letter}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>

            {/* Animated underline */}
            <motion.div
              className="h-1 w-52 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: [0, 1, 0.8, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Loading text */}
            <motion.p
              className="text-gray-600 text-xl font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
