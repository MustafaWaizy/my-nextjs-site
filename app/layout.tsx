import "./globals.css";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

import Navbar from "../components/NavbarWrapper";
import Footer from "../components/Footer";
import ChatWrapper from "../components/ChatWrapper";
import Preloader from "../components/Preloader";

// Load Inter (existing)
const inter = Inter({ subsets: ["latin"] });

// Load Poppins (new)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LinorAI - AI & Technology Solutions Company",
  description: "LinorAI delivers cutting-edge AI, IT, and digital solutions to help businesses innovate, automate, and grow in the modern era.",
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
    <html lang="en" className={poppins.variable}>
      <body
        className={`${poppins.variable} font-poppins bg-gray-50 text-gray-900 relative antialiased`}
      >
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
