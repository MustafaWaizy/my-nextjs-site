"use client";

import Image from "next/image";

export default function BackupRecoveryPage() {
  return (
    <div className="py-16 px-6 max-w-5xl mx-auto font-orbitron">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider drop-shadow-lg">
        Backup & Disaster Recovery
      </h1>

      {/* Image Section */}
      <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/images/backup-recovery.jpg"
          alt="Backup & Disaster Recovery"
          width={1200}
          height={600}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Description Section */}
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <p>
          Protect your business-critical data with our <strong className="text-cyan-500">comprehensive backup and disaster recovery solutions</strong>, ensuring business continuity in any scenario.
        </p>
        <p>
          We provide <strong className="text-purple-500">automated backups, offsite storage, and redundant systems</strong> to safeguard your data against accidental loss, hardware failures, or cyber threats.
        </p>
        <p>
          Our solutions leverage <strong className="text-blue-500">AI-driven monitoring and predictive analytics</strong> to detect potential risks, minimize downtime, and optimize recovery processes.
        </p>
        <p>
          From data protection to rapid system restoration, we design <strong className="text-cyan-400">tailored disaster recovery plans</strong> to meet your organization's unique requirements.
        </p>
        <p>
          Partner with us to implement <strong className="text-purple-400">resilient, intelligent backup and recovery strategies</strong> that protect your operations, ensure compliance, and provide peace of mind.
        </p>
      </div>

      {/* Call-to-action Button */}
      <div className="mt-12 text-center">
        <button className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
          Request a Backup Solution
        </button>
      </div>
    </div>
  );
}
