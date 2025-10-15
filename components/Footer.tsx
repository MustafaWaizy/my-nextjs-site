"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Facebook, Linkedin, Mail, Phone, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function Footer() {
  // Particle positions and sizes
  const particles = [
    { size: 8, top: "10%", left: "5%", color: "bg-cyan-400/40" },
    { size: 10, top: "20%", left: "80%", color: "bg-purple-400/30" },
    { size: 6, top: "70%", left: "15%", color: "bg-blue-400/30" },
    { size: 12, top: "60%", left: "70%", color: "bg-pink-400/30" },
    { size: 5, top: "40%", left: "50%", color: "bg-white/20" },
  ];

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-700 text-white py-16 overflow-hidden">
      {/* Animated floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className={`absolute ${p.color} rounded-full`}
          style={{ width: p.size, height: p.size, top: p.top, left: p.left }}
          animate={{
            y: ["0%", "20%", "0%"],
            x: ["0%", "15%", "0%"],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 relative z-10">
        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-bold mb-4">LinorAI</h3>
          <p className="text-white/80 mb-4">
            Innovating the future with AI-powered solutions, web technology, and intelligent automation.
          </p>
          <div className="flex space-x-4">
            <a href="tel:+16196223468">
              <Phone className="w-5 h-5 hover:text-cyan-300 transition" />
            </a>
            <a href="mailto:info@linorai.ai">
              <Mail className="w-5 h-5 hover:text-cyan-300 transition" />
            </a>
            <a href="https://facebook.com" target="_blank">
              <Facebook className="w-5 h-5 hover:text-cyan-300 transition" />
            </a>
            <a href="https://linkedin.com" target="_blank">
              <Linkedin className="w-5 h-5 hover:text-cyan-300 transition" />
            </a>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-cyan-300 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-cyan-300 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/solutions" className="hover:text-cyan-300 transition">
                AI Solutions
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-cyan-300 transition">
                Contact
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Newsletter / Subscribe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold mb-4">Subscribe</h3>
          <p className="text-white/80 mb-4">
            Get the latest AI insights and updates directly in your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 rounded-xl border border-white/30 bg-white/10 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 text-center text-white/70 text-sm relative z-10">
        &copy; {new Date().getFullYear()} LinorAI. All rights reserved.
      </div>

      {/* Scroll-to-top button (bottom-left) */}
      {showButton && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 0px rgba(0,0,0,0.2)",
              "0 0 20px rgba(34,211,238,0.6)",
              "0 0 0px rgba(0,0,0,0.2)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="fixed bottom-6 left-6 p-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-lg hover:scale-110 transition"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </footer>
  );
}
