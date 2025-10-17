"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CloudServicesPage() {
  const router = useRouter();

  const handleRequestQuoteClick = () => {
    router.push("/get-support/request-quote"); // internal route
  };

  return (
    <div className="py-16 px-6 max-w-5xl mx-auto font-orbitron">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider drop-shadow-lg">
        Cloud Services
      </h1>

      {/* Image Section */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/images/cloud-services.jpg"
          alt="Cloud Services"
          width={1200}
          height={600}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Description Section */}
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <p>
          Transform your business with our <strong className="text-cyan-500">scalable and secure cloud services</strong>, enabling seamless collaboration, data storage, and remote accessibility.
        </p>
        <p>
          We offer <strong className="text-purple-500">cloud migration, hybrid cloud architecture, and cloud management solutions</strong> to optimize performance and reduce operational costs.
        </p>
        <p>
          Leverage <strong className="text-blue-500">AI-powered automation and analytics</strong> to enhance resource allocation, monitor workloads, and ensure high availability of your critical systems.
        </p>
        <p>
          Our cloud solutions prioritize <strong className="text-cyan-400">security, compliance, and disaster recovery</strong> to protect your data and maintain business continuity.
        </p>
        <p>
          Partner with us to deploy <strong className="text-purple-400">intelligent, scalable cloud infrastructures</strong> that improve agility, empower remote teams, and drive innovation across your organization.
        </p>
      </div>

      {/* Call-to-action Button */}
      <div className="mt-12 text-center">
        <button
          onClick={handleRequestQuoteClick}
          className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
        >
          Explore Cloud Solutions
        </button>
      </div>
    </div>
  );
}
