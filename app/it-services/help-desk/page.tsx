"use client";

import Image from "next/image";

export default function ITHelpDeskPage() {
  return (
    <div className="py-16 px-6 max-w-5xl mx-auto font-orbitron">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider drop-shadow-lg">
        IT Help Desk Support
      </h1>

      {/* Image Section */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/images/it-helpdesk.jpg"
          alt="IT Help Desk Support"
          width={1200}
          height={600}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Description Section */}
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <p>
          Ensure uninterrupted operations with our <strong className="text-cyan-500">24/7 IT Help Desk Support</strong>, designed to resolve technical issues quickly and efficiently.
        </p>
        <p>
          Our team of experts provides <strong className="text-purple-500">remote troubleshooting, user assistance, and proactive monitoring</strong> to minimize downtime and maintain business continuity.
        </p>
        <p>
          We leverage <strong className="text-blue-500">AI-driven ticketing systems and knowledge bases</strong> to rapidly diagnose issues, prioritize requests, and deliver accurate solutions.
        </p>
        <p>
          With scalable support plans, we can handle everything from routine user inquiries to complex technical challenges, ensuring <strong className="text-cyan-400">reliable, fast, and professional service</strong>.
        </p>
        <p>
          Partner with us to implement <strong className="text-purple-400">intelligent IT support solutions</strong> that enhance productivity, improve employee satisfaction, and reduce operational disruptions.
        </p>
      </div>

      {/* Call-to-action Button */}
      <div className="mt-12 text-center">
        <button className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
          Request Support
        </button>
      </div>
    </div>
  );
}
