"use client";

import Image from "next/image";

export default function ClientPortalPage() {
  return (
    <div className="py-16 px-6 max-w-5xl mx-auto font-orbitron">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider drop-shadow-lg">
        Client Portal
      </h1>

      {/* Image Section */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/images/client-portal.jpg"
          alt="Client Portal"
          width={1200}
          height={600}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Description Section */}
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <p>
          Access all your services and resources in one place with our <strong className="text-cyan-500">secure and intuitive client portal</strong>, designed for efficiency and ease-of-use.
        </p>
        <p>
          The portal provides <strong className="text-purple-500">real-time updates, project tracking, document management, and support ticket submission</strong> so you can stay fully informed and in control.
        </p>
        <p>
          Our AI-driven interface offers <strong className="text-blue-500">personalized dashboards, smart notifications, and actionable insights</strong> to help you make informed decisions quickly.
        </p>
        <p>
          With enterprise-grade <strong className="text-cyan-400">security and encryption</strong>, you can safely manage sensitive information, collaborate with teams, and monitor progress anytime, anywhere.
        </p>
        <p>
          Partner with us to leverage our <strong className="text-purple-400">advanced client portal solutions</strong> that enhance transparency, streamline communication, and optimize your workflow.
        </p>
      </div>

      {/* Call-to-action Button */}
      <div className="mt-12 text-center">
        <button className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
          Access Your Portal
        </button>
      </div>
    </div>
  );
}
