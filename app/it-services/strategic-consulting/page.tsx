"use client";

import Image from "next/image";
import Link from "next/link"; // ✅ Added for routing

export default function ITConsultingPage() {
  return (
    <div className="py-16 px-6 max-w-5xl mx-auto font-orbitron">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider drop-shadow-lg">
        Strategic IT Consulting
      </h1>

      {/* Image Section */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/images/it-consulting.jpg"
          alt="Strategic IT Consulting"
          width={1200}
          height={600}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Description Section */}
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <p>
          Drive digital transformation with our{" "}
          <strong className="text-cyan-500">
            strategic IT consulting services
          </strong>
          , designed to align technology with your business goals.
        </p>
        <p>
          We provide{" "}
          <strong className="text-purple-500">
            IT strategy planning, infrastructure optimization, and technology
            roadmap development
          </strong>{" "}
          to maximize efficiency and competitive advantage.
        </p>
        <p>
          Our consultants leverage{" "}
          <strong className="text-blue-500">
            AI-driven insights, predictive analytics, and industry best
            practices
          </strong>{" "}
          to identify opportunities, mitigate risks, and optimize IT
          investments.
        </p>
        <p>
          From digital transformation initiatives to operational improvements,
          we deliver{" "}
          <strong className="text-cyan-400">tailored strategies</strong> that
          enhance productivity, reduce costs, and accelerate innovation.
        </p>
        <p>
          Partner with us to implement{" "}
          <strong className="text-purple-400">
            intelligent IT strategies
          </strong>{" "}
          that empower your organization, improve decision-making, and drive
          long-term growth.
        </p>
      </div>

      {/* Call-to-action Button */}
      <div className="mt-12 text-center">
        <Link
          href="/get-support/contact" // ✅ Updated link
          className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
        >
          Schedule a Consultation
        </Link>
      </div>
    </div>
  );
}
