"use client";

import Link from "next/link";
import Image from "next/image";

export default function IntelligentAutomationPage() {
  return (
    <div className="py-16 px-6 max-w-5xl mx-auto font-orbitron">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider drop-shadow-lg">
        Intelligent Automation
      </h1>

      {/* Image Section */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/images/intelligent-automation.jpg"
          alt="Intelligent Automation"
          width={1200}
          height={600}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Description Section */}
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <p>
          Transform your operations with <strong className="text-cyan-500">intelligent automation</strong> solutions that combine AI, robotics, and workflow automation to streamline repetitive tasks and optimize business processes.
        </p>
        <p>
          Our systems integrate seamlessly into existing workflows, using <strong className="text-purple-500">machine learning models and AI decision-making</strong> to reduce errors, save time, and enhance productivity.
        </p>
        <p>
          Automate tasks such as data entry, customer support, reporting, and process monitoring, enabling your team to focus on <strong className="text-blue-500">high-value strategic initiatives</strong>.
        </p>
        <p>
          With scalability and adaptability at its core, our intelligent automation solutions continuously learn from interactions, providing insights and enhancing efficiency over time.
        </p>
        <p>
          Partner with us to deploy <strong className="text-cyan-400">AI-driven automation tools</strong> that increase operational efficiency, reduce costs, and drive measurable business outcomes.
        </p>
      </div>

      {/* Call-to-action Button */}
      <div className="mt-12 text-center">
        <Link href="/get-support/request-quote">
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
            Request a Demo
          </button>
        </Link>
      </div>
    </div>
  );
}
