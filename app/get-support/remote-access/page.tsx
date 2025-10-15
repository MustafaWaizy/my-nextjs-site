"use client";

import Image from "next/image";

export default function RemoteAccessPage() {
  return (
    <div className="py-16 px-6 max-w-5xl mx-auto font-orbitron">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider drop-shadow-lg">
        Remote Access
      </h1>

      {/* Image Section */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/images/remote-access.jpg"
          alt="Remote Access"
          width={1200}
          height={600}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Description Section */}
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <p>
          Enable seamless <strong className="text-cyan-500">remote access</strong> to your systems and applications, empowering teams to work securely from anywhere.
        </p>
        <p>
          Our solutions include <strong className="text-purple-500">VPNs, secure remote desktops, and cloud-based access platforms</strong> to maintain productivity without compromising security.
        </p>
        <p>
          AI-driven monitoring and analytics provide <strong className="text-blue-500">real-time access tracking, anomaly detection, and predictive alerts</strong>, keeping your systems safe and efficient.
        </p>
        <p>
          With robust <strong className="text-cyan-400">encryption and multi-factor authentication</strong>, we ensure that only authorized users can connect, reducing risk while maintaining operational continuity.
        </p>
        <p>
          Partner with us to implement <strong className="text-purple-400">intelligent remote access solutions</strong> that increase flexibility, enhance collaboration, and support your hybrid workforce securely.
        </p>
      </div>

      {/* Call-to-action Button */}
      <div className="mt-12 text-center">
        <button className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
          Enable Remote Access
        </button>
      </div>
    </div>
  );
}
