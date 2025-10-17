"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CustomWebAppPage() {
  const router = useRouter();

  const handleRequestClick = () => {
    router.push("/get-support/request-quote");
  };

  return (
    <div className="py-16 px-6 max-w-5xl mx-auto font-orbitron">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider drop-shadow-lg">
        Custom Web Application
      </h1>

      {/* Image Section */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/images/custom-web-app.jpg"
          alt="Custom Web Application"
          width={1200}
          height={600}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Description Section */}
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <p>
          Develop <strong className="text-cyan-500">custom web applications</strong> tailored specifically to your business processes, enabling automation, efficiency, and scalability.
        </p>
        <p>
          Our team uses <strong className="text-purple-500">modern web technologies and frameworks</strong> to create robust applications that meet your unique requirements, ensuring high performance, security, and reliability.
        </p>
        <p>
          From workflow automation to real-time analytics, we design solutions that enhance productivity and deliver a <strong className="text-blue-500">seamless user experience</strong> across devices.
        </p>
        <p>
          We also integrate APIs, databases, and third-party services to provide a connected ecosystem for your business, making data management and operations smarter and more efficient.
        </p>
        <p>
          Partner with us to create <strong className="text-cyan-400">AI-ready, fully customized web applications</strong> that evolve with your business and provide measurable results.
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
