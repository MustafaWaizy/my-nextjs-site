"use client";

import Link from "next/link";
import Image from "next/image";

export default function AIChatbotsPage() {
  return (
    <div className="py-16 px-6 max-w-5xl mx-auto font-orbitron">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider drop-shadow-lg">
        AI Chatbots & Virtual Assistants
      </h1>

      {/* Image Section */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/images/ai-chatbot.jpg" // Place your image in /public/images/
          alt="AI Chatbots and Virtual Assistants"
          width={1200}
          height={600}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Description Section */}
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <p>
          Enhance your business with <strong className="text-cyan-500">intelligent AI chatbots and virtual assistants</strong> that automate conversations, handle routine queries, and deliver instant support <strong>24/7</strong>. Improve customer satisfaction while reducing operational costs.
        </p>
        <p>
          Our <strong className="text-purple-500">AI-powered solutions</strong> integrate seamlessly with websites, messaging platforms, and CRM systems to provide a <strong>human-like conversational experience</strong>. Engage your customers effectively and provide instant assistance whenever needed.
        </p>
        <p>
          From lead qualification and appointment scheduling to personalized guidance, our virtual assistants help streamline operations, allowing your team to focus on <strong>high-value tasks</strong> and strategic initiatives.
        </p>
        <p>
          Designed for <strong className="text-blue-500">scalability and adaptability</strong>, our chatbots continuously improve with machine learning, providing valuable insights from customer interactions and enabling <strong>data-driven business decisions</strong>.
        </p>
        <p>
          Partner with us to deploy <strong className="text-cyan-400">AI-driven conversational tools</strong> that enhance engagement, boost efficiency, and drive measurable results for your business.
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
