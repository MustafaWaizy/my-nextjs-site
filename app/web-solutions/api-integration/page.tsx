"use client";

import Image from "next/image";

export default function APIIntegrationPage() {
  return (
    <div className="py-16 px-6 max-w-5xl mx-auto font-orbitron">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider drop-shadow-lg">
        API & System Integration
      </h1>

      {/* Image Section */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/images/api-integration.jpg"
          alt="API & System Integration"
          width={1200}
          height={600}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Description Section */}
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <p>
          Seamlessly connect your applications, databases, and third-party services with our <strong className="text-cyan-500">API and system integration solutions</strong>, enabling efficient workflows and real-time data sharing.
        </p>
        <p>
          Our experts design <strong className="text-purple-500">secure, scalable, and reliable integration architectures</strong> that reduce manual effort, eliminate data silos, and improve operational efficiency.
        </p>
        <p>
          We implement <strong className="text-blue-500">custom APIs, middleware solutions, and automated connectors</strong> to ensure smooth communication between systems, enabling smarter business processes and faster decision-making.
        </p>
        <p>
          Monitor, manage, and optimize integrations to provide <strong className="text-cyan-400">real-time insights and data-driven automation</strong>, empowering your business with seamless technology adoption.
        </p>
        <p>
          Partner with us to create <strong className="text-purple-400">AI-enabled integrated systems</strong> that enhance productivity, scalability, and the overall efficiency of your enterprise operations.
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
