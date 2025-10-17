"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ECommerceSolutionPage() {
  const router = useRouter();

  const handleRequestClick = () => {
    router.push("/get-support/request-quote");
  };

  return (
    <div className="py-16 px-6 max-w-5xl mx-auto font-orbitron">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider drop-shadow-lg">
        E-Commerce Solution
      </h1>

      {/* Image Section */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/images/e-commerce.jpg"
          alt="E-Commerce Solution"
          width={1200}
          height={600}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Description Section */}
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <p>
          Launch a <strong className="text-cyan-500">powerful and scalable e-commerce platform</strong> that drives sales, enhances user experience, and integrates seamlessly with your business ecosystem.
        </p>
        <p>
          Our solutions leverage{" "}
          <strong className="text-purple-500">AI-driven product recommendations, inventory management, and secure payment processing</strong>{" "}
          to maximize conversions and customer satisfaction.
        </p>
        <p>
          We design responsive, mobile-friendly stores with{" "}
          <strong className="text-blue-500">intuitive navigation, fast performance, and optimized checkout flows</strong>{" "}
          for a smooth shopping experience.
        </p>
        <p>
          Integrate your e-commerce solution with CRM, ERP, and analytics systems to enable{" "}
          <strong className="text-cyan-400">data-driven decisions, automated marketing, and real-time insights</strong>.
        </p>
        <p>
          Partner with us to create{" "}
          <strong className="text-purple-400">AI-powered, full-featured e-commerce solutions</strong>{" "}
          that boost sales, enhance customer loyalty, and scale with your business growth.
        </p>
      </div>

      {/* Call-to-action Button */}
      <div className="mt-12 text-center">
        <button
          onClick={handleRequestClick}
          className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
        >
          Request a Demo
        </button>
      </div>
    </div>
  );
}
