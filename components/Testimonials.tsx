"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { Quote } from "lucide-react";

// helper: generate initials from name
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function Testimonials() {
  const testimonials = [
    { name: "Alice Johnson", role: "CEO, TechCorp", text: "AI solutions helped us increase efficiency by 40%!" },
    { name: "Mark Lee", role: "CTO, InnovateX", text: "Seamless integration and modern UI—our team loves it." },
    { name: "Sophia Kim", role: "Product Manager, WebSolutions", text: "The predictive analytics changed our decision-making." },
  ];

  // Repeat testimonials 4 times → 12 cards
  const repeatedTestimonials = Array(4).fill(testimonials).flat();

  const controls = useAnimation();
  const tickerRef = useRef<HTMLDivElement>(null);

  const startAnimation = () => {
    controls.start({
      x: ["0%", "-50%"], // scroll half the row, then loop seamlessly
      transition: {
        repeat: Infinity,
        ease: "linear",
        duration: 40, // slower, elegant
      },
    });
  };

  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <h2 className="text-5xl font-extrabold text-gray-900 drop-shadow-md">
          What Our Clients Say
        </h2>
        <p className="text-gray-600 mt-4 text-xl">
          Real stories from industry leaders using our{" "}
          <span className="text-indigo-600 font-semibold">AI-powered solutions</span>.
        </p>
      </div>

      {/* gradient fade masks */}
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-gray-100 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-gray-100 to-transparent z-10 pointer-events-none" />

      {/* ticker wrapper */}
      <div
        className="relative overflow-hidden min-h-[380px] pt-8" // ✅ taller + top padding for quote bubble
        onMouseEnter={() => controls.stop()} // pause on hover
        onMouseLeave={startAnimation} // resume on leave
      >
        <motion.div
          ref={tickerRef}
          className="flex gap-8 w-max items-stretch"
          animate={controls}
        >
          {repeatedTestimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="relative bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl p-8 shadow-xl w-80 flex-shrink-0 transition"
            >
              {/* Quote icon */}
              <div className="absolute -top-6 -left-5 bg-indigo-600 text-white p-3 rounded-full shadow-lg">
                <Quote size={20} />
              </div>

              {/* Testimonial text */}
              <p className="text-gray-800 mb-6 text-lg italic leading-relaxed">
                “{t.text}”
              </p>

              {/* Avatar + Name + Role */}
              <div className="flex items-center gap-4 mt-6">
                {/* Avatar circle with initials */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {getInitials(t.name)}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-900 text-lg">{t.name}</h4>
                  <span className="text-gray-500 text-sm">{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
