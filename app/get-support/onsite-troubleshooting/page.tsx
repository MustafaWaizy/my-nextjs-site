"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OnsiteTroubleshootingPage() {
  const router = useRouter();

  const handleScheduleClick = () => {
    router.push("/get-support/contact"); // internal route
  };

  return (
    <div className="py-16 px-6 max-w-5xl mx-auto font-orbitron">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider drop-shadow-lg">
        Onsite Troubleshooting
      </h1>

      {/* Image Section */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/images/onsite-troubleshooting.jpg"
          alt="Onsite Troubleshooting"
          width={1200}
          height={600}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Description Section */}
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <p>
          Resolve complex technical issues efficiently with our{" "}
          <strong className="text-cyan-500">professional onsite troubleshooting services</strong>, ensuring minimal disruption to your operations.
        </p>
        <p>
          Our team provides{" "}
          <strong className="text-purple-500">hands-on support, hardware diagnostics, and system repairs</strong> with AI-assisted tools that quickly identify root causes and optimal solutions.
        </p>
        <p>
          Leveraging AI-powered monitoring, we offer{" "}
          <strong className="text-blue-500">predictive maintenance insights, automated diagnostics, and faster resolution</strong> to reduce downtime.
        </p>
        <p>
          Our technicians are equipped to handle a wide range of IT and network challenges, delivering{" "}
          <strong className="text-cyan-400">efficient, accurate, and secure onsite support</strong>.
        </p>
        <p>
          Partner with us to implement{" "}
          <strong className="text-purple-400">smart troubleshooting strategies</strong> that keep your systems operational, reduce costs, and improve overall productivity.
        </p>
      </div>

      {/* Call-to-action Button */}
      <div className="mt-12 text-center">
        <button
          onClick={handleScheduleClick}
          className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
        >
          Schedule Onsite Support
        </button>
      </div>
    </div>
  );
}
