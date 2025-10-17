"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TroubleshootingGuidesPage() {
  const router = useRouter();

  const handleViewGuidesClick = () => {
    router.push("/get-support/contact"); // internal route
  };

  return (
    <div className="py-16 px-6 max-w-5xl mx-auto font-orbitron">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider drop-shadow-lg">
        Troubleshooting Guides
      </h1>

      {/* Image Section */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/images/troubleshooting-guides.jpg"
          alt="Troubleshooting Guides"
          width={1200}
          height={600}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Description Section */}
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <p>
          Access our comprehensive <strong className="text-cyan-500">troubleshooting guides</strong> to quickly resolve common IT and technical issues on your own.
        </p>
        <p>
          Our guides are <strong className="text-purple-500">structured, step-by-step, and AI-assisted</strong> to make troubleshooting faster, easier, and more effective.
        </p>
        <p>
          Leveraging <strong className="text-blue-500">AI-powered search and diagnostics</strong>, users can quickly find relevant solutions and preventative measures for recurring problems.
        </p>
        <p>
          Each guide includes <strong className="text-cyan-400">illustrations, screenshots, and actionable tips</strong> to simplify complex issues and reduce downtime.
        </p>
        <p>
          Partner with us to utilize <strong className="text-purple-400">smart troubleshooting resources</strong> that empower your team, enhance self-service support, and maintain operational efficiency.
        </p>
      </div>

      {/* Call-to-action Button */}
      <div className="mt-12 text-center">
        <button
          onClick={handleViewGuidesClick}
          className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
        >
          View Guides
        </button>
      </div>
    </div>
  );
}
