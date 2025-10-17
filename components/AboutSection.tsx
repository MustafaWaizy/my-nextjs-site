"use client";

import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "900"],
});

interface Node {
  x: number;
  y: number;
  size: number;
}

export default function AboutSection() {
  const screens = [
    { id: 1, heading: "Smart Workflows, Automated", description: "Streamline operations with AI-powered automation that saves time and reduces errors.", bg: "/bg1.jpg" },
    { id: 2, heading: "Data that Foresees", description: "Transform raw data into actionable insights with AI-driven predictions and analytics.", bg: "/bg2.jpg" },
    { id: 3, heading: "Human-like Interactions", description: "Engage users with AI chatbots and virtual assistants that understand and respond naturally.", bg: "/bg3.jpg" },
    { id: 4, heading: "Tailored for Every User", description: "Deliver customized recommendations and experiences powered by intelligent algorithms.", bg: "/bg4.jpg" },
    { id: 5, heading: "Innovate Without Limits", description: "Boost content creation, design, and strategy with AI-driven creative tools.", bg: "/bg5.jpg" },
  ];

  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const floatControls = useAnimation();
  useEffect(() => {
    floatControls.start({
      y: [0, -10, 0],
      rotateZ: [0, 2, -2, 0],
      transition: { repeat: Infinity, duration: 6, ease: "easeInOut" },
    });
  }, [floatControls]);

  const getPosition = (index: number) => {
    const screenWidth = 200; // smaller for mobile scaling
    const halfWidth = screenWidth / 2;
    const offsets = [-halfWidth * 2, -halfWidth, 0, halfWidth, halfWidth * 2];
    const scales = [0.75, 0.9, 1, 0.9, 0.75];
    const rotations = [-20, -10, 0, 10, 20];
    const zIndexes = [1, 2, 5, 2, 1];

    if (selected !== null) {
      const diff = index - selected;
      if (diff === 0) return { x: 0, scale: 1.3, rotateY: 0, zIndex: 50 };
      if (Math.abs(diff) === 1) return { x: diff * 150, scale: 0.95, rotateY: diff * 15, zIndex: 10 };
      return { x: diff * 180, scale: 0.85, rotateY: diff * 20, zIndex: 5 };
    }

    if (hovered !== null) {
      const diff = index - hovered;
      if (diff === 0) return { x: 0, scale: 1.3, rotateY: 0, zIndex: 50 };
      if (Math.abs(diff) === 1) return { x: diff * 150, scale: 0.95, rotateY: diff * 15, zIndex: 10 };
      return { x: diff * 180, scale: 0.85, rotateY: diff * 20, zIndex: 5 };
    }

    return { x: offsets[index], scale: scales[index], rotateY: rotations[index], zIndex: zIndexes[index] };
  };

  const [nodes, setNodes] = useState<Node[]>([]);
  useEffect(() => {
    const generateNodes = () => {
      const newNodes: Node[] = Array.from({ length: 18 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 3,
      }));
      setNodes(newNodes);
    };
    generateNodes();
    const interval = setInterval(generateNodes, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-white">
      {/* Neural Network Background */}
      {nodes.length > 0 && (
        <svg className="absolute inset-0 w-full h-full z-0">
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
              animate={{ r: [n.size / 2, n.size, n.size / 2], rotate: [0, 360] }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
              }}
            />
          ))}
        </svg>
      )}

      <div
        ref={containerRef}
        className="max-w-full md:max-w-[75%] mx-auto flex justify-center items-center relative min-h-[650px] perspective-1000 px-4 md:px-0"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {screens.map((screen, i) => {
          const pos = getPosition(i);
          const tiltX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
          const tiltY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);
          const sideShadow =
            (hovered !== null && i !== hovered) || (selected !== null && i !== selected)
              ? `0 25px 50px rgba(0,0,0,${0.05 + Math.abs(i - (hovered ?? selected!)) * 0.05})`
              : "0 15px 30px rgba(0,0,0,0.05)";

          return (
            <motion.div
              key={screen.id}
              className="absolute w-52 md:w-64 h-[500px] md:h-[600px] rounded-3xl flex flex-col overflow-hidden cursor-pointer shadow-lg border border-black"
              animate={{
                x: pos.x,
                scale: pos.scale,
                rotateY: pos.rotateY,
              }}
              transition={{ type: "spring", stiffness: 70, damping: 20 }}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              onClick={() => setSelected(selected === i ? null : i)}
              style={{
                rotateX: hovered === i ? tiltX : 0,
                rotateY: hovered === i ? tiltY : pos.rotateY,
                boxShadow: sideShadow,
                zIndex: pos.zIndex,
              }}
            >
              {/* Top bar */}
              <div className="h-6 bg-purple-300 flex items-center px-3">
                <div className="w-16 h-2 rounded-full bg-purple-400" />
              </div>

              {/* Screen area with background */}
              <div className="relative flex-1 w-full overflow-hidden">
                <div
                  className="absolute inset-0 w-full h-full z-0 bg-cover bg-center rounded-none"
                  style={{ backgroundImage: `url('${screen.bg}')` }}
                />

                <div className="absolute inset-0 flex flex-col justify-center items-center opacity-40 z-10">
                  {Array(3)
                    .fill(0)
                    .map((_, j) => (
                      <motion.div
                        key={j}
                        className="h-2 w-4/5 rounded-full bg-cyan-400/40 mb-3"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{
                          repeat: Infinity,
                          duration: 3 + j * 0.7,
                          ease: "linear",
                        }}
                      />
                    ))}
                </div>

                <div className={`relative z-20 text-center flex flex-col justify-center items-center h-full px-4 ${montserrat.className}`}>
                  <div>
                    <span
                      className="bg-purple-100 rounded-sm text-2xl font-extrabold text-blue-600"
                      style={{
                        display: "inline",
                        padding: "0.06rem 0.28rem",
                        WebkitBoxDecorationBreak: "clone",
                        boxDecorationBreak: "clone",
                      }}
                    >
                      {screen.heading}
                    </span>
                  </div>

                  <div className="mt-6">
                    <span
                      className="bg-purple-100 rounded-sm text-sm font-bold text-blue-600"
                      style={{
                        display: "inline",
                        padding: "0.04rem 0.24rem",
                        WebkitBoxDecorationBreak: "clone",
                        boxDecorationBreak: "clone",
                      }}
                    >
                      {screen.description}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-14 bg-purple-400 flex items-center justify-center">
                <div className="w-12 h-2 rounded-full bg-purple-400" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
