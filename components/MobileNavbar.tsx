"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mail, Facebook, Linkedin, Phone, Clock, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const toggleDropdown = (menu: string) => setActiveDropdown(activeDropdown === menu ? null : menu);
  const closeMenus = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="md:hidden sticky top-0 z-50 w-full font-poppins">
      {/* --- TOP BLUE BAR --- */}
      <div className="flex justify-between items-center px-4 py-2 bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-700 text-white">
        <button
          onClick={() => setShowContactInfo(!showContactInfo)}
          className="text-sm font-medium px-4 py-2 rounded-full border border-white/30 hover:bg-white/10 transition"
        >
          Contact Info
        </button>
        <div className="flex items-center space-x-3">
          <Link href="https://facebook.com" target="_blank">
            <Facebook className="w-5 h-5 text-white" />
          </Link>
          <Link href="https://linkedin.com" target="_blank">
            <Linkedin className="w-5 h-5 text-white" />
          </Link>
          <Link href="mailto:info@linorai.com">
            <Mail className="w-5 h-5 text-white" />
          </Link>
          <button onClick={() => setShowSearch(!showSearch)}>
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* --- CONTACT INFO PANEL --- */}
      <AnimatePresence>
        {showContactInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-700 text-white text-sm rounded-lg px-4 py-3 space-y-2 mb-2 text-center"
          >
            <div className="flex justify-center items-center space-x-2">
              <Phone className="w-4 h-4" />
              <a href="tel:+16196223468">+1 (619) 622 3468</a>
            </div>
            <div className="flex justify-center items-center space-x-2">
              <Mail className="w-4 h-4" />
              <a href="mailto:info@linorai.com">info@LinorAI.com</a>
            </div>
            <div className="flex justify-center items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Mon - Fri 08 am - 10 pm</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- BOTTOM WHITE BAR WITH LOGO AND HAMBURGER --- */}
      <div className="bg-white shadow-md py-4 relative rounded-lg px-4 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={140}
            height={70}
            className="object-contain cursor-pointer"
          />
        </Link>

        {/* HAMBURGER MENU */}
        <button className="text-gray-700 text-3xl" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>

      {/* --- MOBILE SEARCH --- */}
      <AnimatePresence>
        {showSearch && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSearchSubmit}
            className="absolute top-full right-4 mt-2 w-64 bg-white shadow-md rounded-full flex items-center px-3 py-1 z-50"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full text-sm outline-none"
            />
            <button type="button" onClick={() => setShowSearch(false)}>
              <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* --- MOBILE DROPDOWN --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white px-4 py-4 space-y-3 shadow-md font-poppins text-[16px] rounded-lg"
          >
            <Link href="/" onClick={closeMenus} className="block py-2 px-3 rounded hover:bg-gray-100">
              Home
            </Link>

            {menuItems.map((menu) => (
              <div key={menu.key}>
                <button
                  onClick={() => toggleDropdown(menu.key)}
                  className="w-full text-left font-semibold py-2 px-3 rounded hover:bg-gray-100"
                >
                  {menu.title}
                </button>
                <AnimatePresence>
                  {activeDropdown === menu.key && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="ml-4 space-y-1"
                    >
                      {menu.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeMenus}
                          className="block py-2 px-3 rounded hover:bg-gray-100"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
