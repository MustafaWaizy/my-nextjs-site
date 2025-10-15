"use client";

import { useState, useEffect } from "react";

type Node = { x: number; y: number; vx: number; vy: number; size: number };
type Spark = { x1: number; y1: number; x2: number; y2: number; progress: number; speed: number };

export default function NeuralNetworkBackground() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);

  // Initialize random nodes
  useEffect(() => {
    const newNodes = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 3 + 2,
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
          if (nx > window.innerWidth || nx < 0) n.vx *= -1;
          if (ny > window.innerHeight || ny < 0) n.vy *= -1;
          return { ...n, x: nx, y: ny };
        })
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Generate sparks randomly between nodes
  useEffect(() => {
    const interval = setInterval(() => {
      if (nodes.length > 0) {
        const a = nodes[Math.floor(Math.random() * nodes.length)];
        const b = nodes[Math.floor(Math.random() * nodes.length)];
        if (a !== b) {
          setSparks((prev) => [
            ...prev,
            {
              x1: a.x,
              y1: a.y,
              x2: b.x,
              y2: b.y,
              progress: 0,
              speed: Math.random() * 0.02 + 0.01,
            },
          ]);
        }
      }
    }, 500); // every 0.5s a spark is created
    return () => clearInterval(interval);
  }, [nodes]);

  // Animate sparks
  useEffect(() => {
    const interval = setInterval(() => {
      setSparks((prev) =>
        prev
          .map((s) => ({ ...s, progress: s.progress + s.speed }))
          .filter((s) => s.progress < 1)
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-transparent overflow-hidden">
      <svg className="absolute inset-0 w-full h-full">
        {/* Shimmering connections */}
        {nodes.map((a, i) =>
          nodes.map((b, j) => {
            if (i >= j) return null;
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
              return (
                <line
                  key={`${i}-${j}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="url(#shimmerGradient)"
                  strokeWidth={0.9}
                  opacity={0.7}
                />
              );
            }
            return null;
          })
        )}

        {/* Glowing nodes */}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.size} fill="url(#nodeGlow)">
            <animate
              attributeName="r"
              values={`${n.size};${n.size + 2};${n.size}`}
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Sparks moving across connections */}
        {sparks.map((s, i) => {
          const x = s.x1 + (s.x2 - s.x1) * s.progress;
          const y = s.y1 + (s.y2 - s.y1) * s.progress;
          return <circle key={`spark-${i}`} cx={x} cy={y} r={2} fill="white" opacity={0.9} />;
        })}

        <defs>
          {/* Node Glow */}
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="cyan" stopOpacity="1" />
            <stop offset="100%" stopColor="purple" stopOpacity="0.6" />
          </radialGradient>

          {/* Animated shimmer for lines */}
          <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="cyan">
              <animate attributeName="offset" values="-1;1" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="purple">
              <animate attributeName="offset" values="0;2" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="cyan">
              <animate attributeName="offset" values="1;3" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
