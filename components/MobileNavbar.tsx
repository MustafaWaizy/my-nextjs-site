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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
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
      <div className="bg-white shadow-md py-4 px-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={140}
            height={70}
            className="object-contain cursor-pointer"
          />
        </Link>
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

      {/* --- SLIDE-IN SIDE DRAWER WITH SOFT NEON HOVER LINE --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed top-0 right-0 h-full w-4/5 z-50 p-6 bg-gradient-to-b from-cyan-100 via-blue-100 to-purple-100 text-gray-800 shadow-xl overflow-y-auto"
          >
            <button
              onClick={closeMenus}
              className="absolute top-4 right-4 text-gray-700 text-2xl hover:text-blue-600 transition"
            >
              ✕
            </button>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-10 space-y-4 text-gray-800"
            >
              {/* HOME */}
              <motion.div variants={itemVariants} className="relative group">
                <Link
                  href="/"
                  onClick={closeMenus}
                  className="block py-2 px-3 rounded hover:text-blue-600 transition relative"
                >
                  Home
                  {/* Soft glowing neon line */}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 group-hover:w-full transition-all duration-300 rounded-full blur-[2px] opacity-90" />
                </Link>
              </motion.div>

              {menuItems.map((menu) => (
                <motion.div key={menu.key} variants={itemVariants} className="relative group">
                  <button
                    onClick={() => toggleDropdown(menu.key)}
                    className="w-full text-left font-semibold py-2 px-3 rounded hover:text-blue-600 transition relative"
                  >
                    {menu.title}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 group-hover:w-full transition-all duration-300 rounded-full blur-[2px] opacity-90" />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === menu.key && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.25 }}
                        className="ml-4 space-y-1"
                      >
                        {menu.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMenus}
                            className="block py-2 px-3 rounded text-sm hover:text-blue-600 relative group"
                          >
                            {link.label}
                            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 group-hover:w-full transition-all duration-300 rounded-full blur-[2px] opacity-90" />
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </nav>
  );
}
