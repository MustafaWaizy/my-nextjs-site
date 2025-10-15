"use client";

import Link from "next/link";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="text-sm mb-6">
      <ol className="flex items-center space-x-2 text-gray-600">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-cyan-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-800 font-medium">{item.label}</span>
            )}
            {index < items.length - 1 && <span className="mx-2">›</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
