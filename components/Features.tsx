"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { FaRobot, FaLaptopCode, FaHeadset, FaClock } from "react-icons/fa";

interface Node {
  x: number;
  y: number;
  size: number;
}

export default function Features() {
  const features = [
    { 
      title: "AI Solutions", 
      desc: "Cutting-edge artificial intelligence solutions designed to power chatbots, automate tasks, analyze data, and enhance business efficiency.",
      icon: <FaRobot className="text-purple-600" />
    },
    { 
      title: "Web Development", 
      desc: "Modern, responsive and user-friendly websites built to showcase your brand and drive growth.",
      icon: <FaLaptopCode className="text-blue-600" />
    },
    { 
      title: "IT Support", 
      desc: "Fast, reliable and proactive technical assistance to keep your business systems running smoothly, onsite and remotely.",
      icon: <FaHeadset className="text-green-600" />
    },
    { 
      title: "24/7 Support", 
      desc: "Round-the-clock IT support to keep your business running smoothly.",
      icon: <FaClock className="text-red-600" />
    },
  ];

  // ===== Manual size & position controls =====
  const frontTitleSize = "text-2xl sm:text-3xl";    
  const backTitleSize = "text-lg sm:text-xl";      
  const backDescSize = "text-xs sm:text-sm md:text-base"; 
  const frontStickerSize = "text-5xl sm:text-6xl";  
  const backStickerSize = "text-3xl sm:text-4xl";   
  const backStickerPosition = "mt-2";   
  // ==========================================

  const glowVariants = {
    pulse: {
      boxShadow: [
        "0 0 5px 2px rgba(255,255,255,0.2)",
        "0 0 15px 5px rgba(255,255,255,0.7)",
        "0 0 5px 2px rgba(255,255,255,0.2)",
      ],
      transition: { duration: 2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
    },
  };

  const [nodes, setNodes] = useState<Node[]>([]);
  const generateNodes = () => {
    const newNodes: Node[] = Array.from({ length: 18 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 3,
    }));
    setNodes(newNodes);
  };
  useEffect(() => {
    generateNodes();
    const interval = setInterval(generateNodes, 10000);
    return () => clearInterval(interval);
  }, []);

  // ==================== Mobile detection ====================
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-white font-[Orbitron]">
      {/* Neural Network Background */}
      {nodes.length > 0 && (
        <svg className="absolute top-0 left-0 w-full h-full z-0">
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
                    transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
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
              transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
            />
          ))}
        </svg>
      )}

      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 drop-shadow-lg">
            Transformative AI & Technology Features
          </h2>
          <p className="mt-2 text-gray-700 text-sm sm:text-lg">
            AI-driven solutions, seamless web experiences, and proactive IT support
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12">
          {features.map((f, i) => {
            const [isFlipped, setIsFlipped] = useState(false);
            const mouseX = useMotionValue(0);
            const mouseY = useMotionValue(0);
            const rotateX = useTransform(mouseY, [0, 240], [15, -15]);
            const rotateY = useTransform(mouseX, [0, 240], [-15, 15]);

            return (
              <div
                key={i}
                className="perspective w-full max-w-[280px] sm:w-[220px] sm:h-[220px] md:w-[260px] md:h-[260px] flex-shrink-0"
                style={{
                  perspective: 1200,
                  zIndex: isMobile && selectedCard === i ? 50 : undefined,
                }}
                onMouseEnter={() => !isMobile && setIsFlipped(true)}
                onMouseLeave={() => !isMobile && setIsFlipped(false)}
                onMouseMove={(e) => {
                  if (!isMobile) {
                    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                    mouseX.set(e.clientX - rect.left);
                    mouseY.set(e.clientY - rect.top);
                  }
                }}
                onClick={() => isMobile && setSelectedCard(selectedCard === i ? null : i)}
              >
                <motion.div
                  className="relative w-full h-[220px] sm:h-full"
                  animate={{
                    rotateY:
                      isMobile && selectedCard === i
                        ? 180
                        : isFlipped
                        ? 180
                        : 0,
                    scale:
                      isMobile && selectedCard === i
                        ? 1.25
                        : 1,
                  }}
                  transition={{
                    rotateY: { type: "spring", stiffness: 90, damping: 18 },
                    scale: { type: "spring", stiffness: 90, damping: 18 },
                  }}
                  style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
                  drag={isMobile && selectedCard === i ? false : undefined}
                  onPan={() => {
                    if (isMobile && selectedCard === i) {
                      setSelectedCard(null);
                    }
                  }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 flex flex-col justify-start rounded-3xl text-gray-900 backface-hidden bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 shadow-[0_10px_40px_rgba(0,0,0,0.2)] z-10">
                    <motion.div
                      className="h-3 sm:h-4 w-1/2 bg-white rounded-t-full mb-2 sm:mb-4 mx-auto"
                      variants={glowVariants}
                      animate="pulse"
                    />
                    <div className={`mx-auto mb-2 sm:mb-4 ${frontStickerSize}`}>
                      {f.icon}
                    </div>
                    <div className={`flex-1 flex justify-center items-center text-center font-semibold ${frontTitleSize}`}>
                      {f.title}
                    </div>
                  </div>

                  {/* Back */}
                  <div className={`absolute inset-0 flex flex-col justify-start rounded-3xl text-gray-900 rotate-y-180 backface-hidden
                    bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 p-3 sm:p-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)] z-10 text-left`}>
                    <motion.div
                      className="h-3 sm:h-4 w-1/2 bg-white rounded-t-full mb-2 sm:mb-4 mx-auto"
                      variants={glowVariants}
                      animate="pulse"
                    />
                    <div className={`flex justify-center items-center ${backStickerPosition} mb-1 sm:mb-2`}>
                      <div className={`${backStickerSize}`}>
                        {f.icon}
                      </div>
                    </div>
                    <h3 className={`font-bold mb-1 sm:mb-2 ${backTitleSize}`}>{f.title}</h3>
                    <p className={`${backDescSize} leading-relaxed`}>{f.desc}</p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
