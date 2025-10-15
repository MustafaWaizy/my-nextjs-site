"use client";

import Image from "next/image";

export default function WebsiteDesignPage() {
  return (
    <div className="py-16 px-6 max-w-5xl mx-auto font-orbitron">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider drop-shadow-lg">
        Website Design & Development
      </h1>

      {/* Image Section */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/images/website-design.jpg"
          alt="Website Design & Development"
          width={1200}
          height={600}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Description Section */}
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <p>
          Deliver visually stunning, highly functional websites with our <strong className="text-cyan-500">website design & development</strong> services. We combine creativity, usability, and technology to create an engaging user experience.
        </p>
        <p>
          Our team leverages <strong className="text-purple-500">modern UI/UX principles</strong> and responsive design frameworks to ensure your website performs flawlessly across all devices and platforms.
        </p>
        <p>
          We integrate interactive features, custom graphics, and intuitive navigation to make your website not just attractive but <strong className="text-blue-500">highly user-friendly and conversion-oriented</strong>.
        </p>
        <p>
          With seamless back-end development, content management system integration, and optimized workflows, your website will be <strong className="text-cyan-400">efficient, scalable, and secure</strong>.
        </p>
        <p>
          Partner with us to create websites that are <strong className="text-purple-400">AI-ready, engaging, and built to grow with your business</strong>.
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
