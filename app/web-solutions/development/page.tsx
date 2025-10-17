"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function WebDevelopmentPage() {
  const router = useRouter();

  const handleRequestClick = () => {
    router.push("/get-support/request-quote");
  };

  return (
    <div className="py-16 px-6 max-w-5xl mx-auto font-orbitron">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider drop-shadow-lg">
        Web Development
      </h1>

      {/* Image Section */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/images/web-development.jpg"
          alt="Web Development"
          width={1200}
          height={600}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Description Section */}
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <p>
          Build high-performance, modern websites with our{" "}
          <strong className="text-cyan-500">full-stack web development</strong>{" "}
          services. We specialize in creating responsive, scalable, and secure web applications tailored to your business needs.
        </p>
        <p>
          Our development team leverages the latest{" "}
          <strong className="text-purple-500">technologies and frameworks</strong>{" "}
          to deliver fast-loading, SEO-friendly websites that enhance user experience and maximize engagement.
        </p>
        <p>
          From front-end design to back-end integration, we provide end-to-end solutions that ensure your website is{" "}
          <strong className="text-blue-500">robust, reliable, and adaptable</strong>{" "}
          for future growth.
        </p>
        <p>
          We also integrate APIs, content management systems, and third-party services seamlessly to automate workflows and provide a{" "}
          <strong className="text-cyan-400">data-driven, connected web experience</strong>.
        </p>
        <p>
          Partner with us to create websites that are not just visually appealing but also{" "}
          <strong className="text-purple-400">AI-ready, user-centric, and optimized for conversions</strong>.
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
