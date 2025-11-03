"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mail, Facebook, Linkedin, Phone, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import MobileNavbar from "./MobileNavbar";

export default function DesktopNavbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const closeMenus = () => setActiveDropdown(null);

  const menuItems = [
    {
      title: "About Us", key: "about-us", links: [
        { href: "/about-us/company-overview", label: "Company Overview" },
        { href: "/about-us/leadership-team", label: "Leadership Team" },
        { href: "/about-us/careers", label: "Careers" },
      ]
    },
    {
      title: "AI-Powered Solutions", key: "ai-powered-solutions", links: [
        { href: "/ai-powered-solutions/chatbots", label: "AI Chatbots & Virtual Assistant" },
        { href: "/ai-powered-solutions/strategy-consulting", label: "AI Strategy Consulting" },
        { href: "/ai-powered-solutions/predictive-analytics", label: "Predictive Analytics" },
        { href: "/ai-powered-solutions/intelligent-automation", label: "Intelligent Automation" },
      ]
    },
    {
      title: "Web Solutions", key: "web-solutions", links: [
        { href: "/web-solutions/development", label: "Web Development" },
        { href: "/web-solutions/design", label: "Website Design & Development" },
        { href: "/web-solutions/custom-web-app", label: "Custom Web Application" },
        { href: "/web-solutions/ecommerce", label: "E-Commerce Solution" },
        { href: "/web-solutions/api-integration", label: "API & System Integration" },
      ]
    },
    {
      title: "IT Services", key: "it-services", links: [
        { href: "/it-services/help-desk", label: "IT Help Desk Support" },
        { href: "/it-services/security", label: "IT Security Services" },
        { href: "/it-services/cloud", label: "Cloud Services" },
        { href: "/it-services/backup-recovery", label: "Backup & Disaster Recovery" },
        { href: "/it-services/strategic-consulting", label: "Strategic IT Consulting" },
      ]
    },
    {
      title: "Get Support", key: "get-support", links: [
        { href: "/get-support/client-portal", label: "Client Portal" },
        { href: "/get-support/remote-access", label: "Remote Access" },
        { href: "/get-support/onsite-troubleshooting", label: "Onsite Troubleshooting" },
        { href: "/get-support/troubleshooting-guides", label: "Troubleshooting Guides" },
        { href: "/get-support/request-quote", label: "Request A Quote" },
        { href: "/get-support/contact", label: "Contact Us" },
      ]
    },
  ];

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="hidden md:block sticky top-0 z-50 w-full font-poppins backdrop-blur-sm bg-white/80 shadow-lg">
      {/* Top Info Bar */}
      <div className="flex bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-700 h-12 items-center justify-center space-x-12 text-sm text-white rounded-full mb-1 px-2">
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-white" />
          <span>Call Anytime:</span>
          <a href="tel:+16196223468" className="hover:text-cyan-100 transition-colors duration-300 font-medium">
            +1 (619) 622 3468
          </a>
        </div>
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-white" />
          <span>Get an Estimate:</span>
          <a href="mailto:info@linirAI.com" className="hover:text-cyan-100 transition-colors duration-300 font-medium">
            info@LinorAI.com
          </a>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-white" />
          <span className="font-medium">Monday - Friday 08 am - 10 pm</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-md py-4 relative rounded-full px-20">
        <div className="flex items-center justify-between w-full">
          {/* LEFT: Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Logo"
                width={140}
                height={70}
                className="object-contain cursor-pointer"
                priority
              />
            </Link>
          </motion.div>

          {/* CENTER: Menu Items */}
          <div className="flex space-x-8 text-[18px] font-poppins whitespace-nowrap">
            <Link href="/" className="hover:text-cyan-600 transition-colors duration-300 font-medium">
              Home
            </Link>

            {menuItems.map((menu) => (
              <div
                key={menu.key}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(menu.key)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="hover:text-cyan-600 font-medium transition-colors duration-300">
                  {menu.title}
                </button>

                <AnimatePresence>
                  {activeDropdown === menu.key && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-72 bg-white shadow-lg rounded-xl py-2 z-50"
                    >
                      {menu.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-cyan-400 hover:to-purple-500 hover:text-white transition-all duration-300"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* RIGHT: Search + Social Icons */}
          <div className="flex items-center space-x-5">
            <motion.div whileHover={{ scale: 1.3 }} className="cursor-pointer" onClick={() => setShowSearch(!showSearch)}>
              <Search className="w-5 h-5 text-cyan-600" />
            </motion.div>

            {[
              { icon: <Mail className="w-5 h-5 text-cyan-600" />, href: "mailto:info@linorai.com" },
              { icon: <Facebook className="w-5 h-5 text-cyan-600" />, href: "https://facebook.com" },
              { icon: <Linkedin className="w-5 h-5 text-cyan-600" />, href: "https://linkedin.com" },
            ].map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.3 }}>
                <Link href={item.href} target="_blank">
                  {item.icon}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
