import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatWrapper from "../components/ChatWrapper";
import Preloader from "../components/Preloader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Website",
  description: "Modern frontend built with Next.js + Tailwind + Framer Motion",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 relative`}>
        {/* Preloader overlays everything for 5–8s */}
        <Preloader />

        {/* Main site content */}
        <div className="relative z-0">
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ChatWrapper />
        </div>
      </body>
    </html>
  );
}
