"use client";

import Image from "next/image";

export default function AIStrategyConsultingPage() {
  return (
    <div className="py-16 px-6 max-w-5xl mx-auto font-orbitron">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider drop-shadow-lg">
        AI Strategy Consulting
      </h1>

      {/* Image Section */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/images/ai-strategy.jpg"
          alt="AI Strategy Consulting"
          width={1200}
          height={600}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Description Section */}
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <p>
          Unlock your business potential with <strong className="text-cyan-500">AI strategy consulting</strong> that aligns technology with business goals. We help organizations identify AI opportunities, optimize workflows, and drive measurable results.
        </p>
        <p>
          Our consultants provide <strong className="text-purple-500">tailored AI roadmaps</strong> to integrate machine learning, automation, and analytics into your operations, ensuring sustainable growth and competitive advantage.
        </p>
        <p>
          From feasibility studies to deployment plans, we guide your team in leveraging <strong className="text-blue-500">cutting-edge AI tools</strong> to improve efficiency, customer satisfaction, and revenue growth.
        </p>
        <p>
          Partner with us to implement <strong className="text-cyan-400">data-driven strategies</strong> that transform your business and prepare you for the AI-powered future.
        </p>
      </div>

      {/* Call-to-action Button */}
      <div className="mt-12 text-center">
        <button className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
          Request a Demo
        </button>
      </div>
    </div>
  );
}
