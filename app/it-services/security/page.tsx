"use client";

import Image from "next/image";

export default function ITSecurityPage() {
  return (
    <div className="py-16 px-6 max-w-5xl mx-auto font-orbitron">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider drop-shadow-lg">
        IT Security Services
      </h1>

      {/* Image Section */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/images/it-security.jpg"
          alt="IT Security Services"
          width={1200}
          height={600}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Description Section */}
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <p>
          Protect your digital assets with our <strong className="text-cyan-500">comprehensive IT security services</strong>, designed to safeguard your organization from evolving cyber threats.
        </p>
        <p>
          We provide <strong className="text-purple-500">network security, endpoint protection, threat detection, and vulnerability assessments</strong> to ensure your systems remain secure and resilient.
        </p>
        <p>
          Our solutions leverage <strong className="text-blue-500">AI-driven monitoring and predictive analytics</strong> to detect anomalies, prevent breaches, and respond proactively to potential risks.
        </p>
        <p>
          From small businesses to large enterprises, we implement <strong className="text-cyan-400">custom security strategies</strong> that meet compliance standards and reduce exposure to cyber threats.
        </p>
        <p>
          Partner with us to deploy <strong className="text-purple-400">modern, AI-powered security solutions</strong> that safeguard your business, protect customer data, and maintain trust in your brand.
        </p>
      </div>

      {/* Call-to-action Button */}
      <div className="mt-12 text-center">
        <button className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
          Learn More
        </button>
      </div>
    </div>
  );
}
