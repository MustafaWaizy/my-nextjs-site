"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link"; // ✅ Added for client-side routing

const slides = [
  {
    subtitle: "AI-Driven Efficiency",
    title: "Provide AI-Powered Innovation",
    description:
      "Transform your operations with intelligent AI solutions. From chatbots to predictive analytics, we help you automate tasks and make data-driven decisions effortlessly.",
    cta: "Get Started",
    href: "/get-support/request-quote", // ✅ updated
    image: "/slide1.jpg",
  },
  {
    subtitle: "Reliable IT Solutions",
    title: "IT Support & Services",
    description:
      "We deliver IT services both onsite and remotely to ensure seamless business operations. From proactive help desk support and scalable cloud solutions to backup management and strategic IT consulting, we keep your technology efficient, reliable, and running smoothly.",
    cta: "Explore Features",
    href: "/get-support/contact", // ✅ updated
    image: "/slide3.jpg",
  },
  {
    subtitle: "Custom Digital Experiences",
    title: "Web Development Solutions",
    description:
      "Build modern, responsive websites and custom web applications tailored to your business. From e-commerce solutions to seamless API integrations, we help you streamline operations and engage users effectively.",
    cta: "Learn More",
    href: "/get-support/request-quote", // ✅ updated
    image: "/slide2.jpg",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-screen w-full overflow-hidden text-white font-[Orbitron]">
      {/* Background Slides */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              opacity: i === index ? 1 : 0,
              scale: i === index ? 1.15 : 1,
            }}
            transition={{
              opacity: { duration: 1.8, ease: "easeInOut" },
              scale: { duration: 10, ease: "linear" },
            }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
      </div>

      {/* Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-lg uppercase tracking-wider underline mb-2 sm:mb-3 text-white/90">
              {slides[index].subtitle}
            </p>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 sm:mb-6 text-white drop-shadow-lg leading-tight">
              {slides[index].title}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-2xl font-bold max-w-md sm:max-w-2xl md:max-w-5xl w-full mx-auto px-2 sm:px-4 md:px-8 mb-6 sm:mb-8 text-white/90 drop-shadow-md leading-relaxed">
              {slides[index].description}
            </p>

            {/* CTA Button using Next.js Link */}
            <Link
              href={slides[index].href}
              className="block sm:inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:opacity-90 transition w-full sm:w-auto"
            >
              {slides[index].cta}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-white/20 p-2 sm:p-3 rounded-full hover:bg-white/40 transition z-20"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-white/20 p-2 sm:p-3 rounded-full hover:bg-white/40 transition z-20"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 sm:bottom-6 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-6 flex space-x-2 sm:space-x-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full transition ${
              i === index
                ? "bg-cyan-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.8)]"
                : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
