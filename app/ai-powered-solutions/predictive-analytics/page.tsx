"use client";

import Image from "next/image";

export default function PredictiveAnalyticsPage() {
  return (
    <div className="py-16 px-6 max-w-5xl mx-auto font-orbitron">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider drop-shadow-lg">
        Predictive Analytics
      </h1>

      {/* Image Section */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/images/predictive-analytics.jpg"
          alt="Predictive Analytics"
          width={1200}
          height={600}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Description Section */}
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <p>
          Harness the power of <strong className="text-cyan-500">predictive analytics</strong> to anticipate trends, understand customer behavior, and optimize business decisions before they happen. Reduce risks and uncover opportunities with advanced data insights.
        </p>
        <p>
          Our solutions integrate <strong className="text-purple-500">machine learning models and AI algorithms</strong> to analyze historical data and provide actionable forecasts for sales, operations, and customer engagement.
        </p>
        <p>
          From demand forecasting to predictive maintenance, we deliver <strong className="text-blue-500">data-driven strategies</strong> that empower organizations to make smarter, faster decisions.
        </p>
        <p>
          Collaborate with us to deploy <strong className="text-cyan-400">intelligent analytics systems</strong> that continuously improve and adapt, giving your business a competitive edge.
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
