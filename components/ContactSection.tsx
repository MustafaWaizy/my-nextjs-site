"use client";

import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <section className="py-24 bg-gray-50 relative">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-4xl font-extrabold text-gray-900 mb-6"
        >
          Stay Updated
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-gray-700 mb-8"
        >
          Subscribe to our newsletter for the latest AI insights and updates.
        </motion.p>

        <motion.form
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <input
            type="email"
            placeholder="Your email"
            className="flex-1 px-6 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Subscribe
          </button>
        </motion.form>
      </div>
    </section>
  );
}
