"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mail, Facebook, Linkedin, Phone, Clock, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const closeMenus = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
  };

  const menuItems = [
    {
      title: "About Us",
      key: "about-us",
      links: [
        { href: "/about-us/company-overview", label: "Company Overview" },
        { href: "/about-us/leadership-team", label: "Leadership Team" },
        { href: "/about-us/careers", label: "Careers" },
      ],
    },
    {
      title: "AI-Powered Solutions",
      key: "ai-powered-solutions",
      links: [
        { href: "/ai-powered-solutions/chatbots", label: "AI Chatbots & Virtual Assistant" },
        { href: "/ai-powered-solutions/strategy-consulting", label: "AI Strategy Consulting" },
        { href: "/ai-powered-solutions/predictive-analytics", label: "Predictive Analytics" },
        { href: "/ai-powered-solutions/intelligent-automation", label: "Intelligent Automation" },
      ],
    },
    {
      title: "Web Solutions",
      key: "web-solutions",
      links: [
        { href: "/web-solutions/development", label: "Web Development" },
        { href: "/web-solutions/design", label: "Website Design & Development" },
        { href: "/web-solutions/custom-web-app", label: "Custom Web Application" },
        { href: "/web-solutions/ecommerce", label: "E-Commerce Solution" },
        { href: "/web-solutions/api-integration", label: "API & System Integration" },
      ],
    },
    {
      title: "IT Services",
      key: "it-services",
      links: [
        { href: "/it-services/help-desk", label: "IT Help Desk Support" },
        { href: "/it-services/security", label: "IT Security Services" },
        { href: "/it-services/cloud", label: "Cloud Services" },
        { href: "/it-services/backup-recovery", label: "Backup & Disaster Recovery" },
        { href: "/it-services/strategic-consulting", label: "Strategic IT Consulting" },
      ],
    },
    {
      title: "Get Support",
      key: "get-support",
      links: [
        { href: "/get-support/client-portal", label: "Client Portal" },
        { href: "/get-support/remote-access", label: "Remote Access" },
        { href: "/get-support/onsite-troubleshooting", label: "Onsite Troubleshooting" },
        { href: "/get-support/troubleshooting-guides", label: "Troubleshooting Guides" },
        { href: "/get-support/request-quote", label: "Request A Quote" },
        { href: "/get-support/contact", label: "Contact Us" },
      ],
    },
  ];

  useEffect(() => {
    const handleChange = () => closeMenus();
    router.prefetch("/");
    window.addEventListener("popstate", handleChange);
    return () => window.removeEventListener("popstate", handleChange);
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
    <nav className="sticky top-0 z-50 w-full font-poppins backdrop-blur-sm bg-white/80 shadow-lg">

      {/* Top Gradient Info Bar - Desktop Only */}
      <div className="hidden md:flex bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-700 h-12 flex-col sm:flex-row items-center justify-center sm:space-x-12 text-sm text-white rounded-full mb-1 px-2 sm:px-0">
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

      {/* Mobile Top Bar - Sticky */}
      <div className="flex md:hidden justify-between items-center px-4 py-2 bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-700 text-white sticky top-0 z-50">
        {/* Contact Info Button - Left */}
        <button
          onClick={() => setShowContactInfo(!showContactInfo)}
          className="text-sm font-medium px-4 py-2 rounded-full border border-white/30 hover:bg-white/10 transition"
        >
          Contact Info
        </button>

        {/* Top Right Icons */}
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

      {/* Mobile Contact Info Panel */}
      <AnimatePresence>
        {showContactInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-700 text-white text-sm rounded-lg px-4 py-3 space-y-2 mb-2 text-center"
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

      {/* Main Header */}
      <div className="bg-white shadow-md py-4 relative rounded-full px-4 sm:px-6 lg:px-20">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,255,255,0.5), 0 0 40px rgba(128,0,255,0.3)" }}
            className="flex items-center relative"
          >
            <Link href="/" onClick={closeMenus}>
              <Image src="/logo.png" alt="Logo" width={180} height={60} className="object-contain" />
            </Link>
          </motion.div>

          {/* Mobile Search Input */}
          <AnimatePresence>
            {showSearch && (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSearchSubmit}
                className="md:hidden absolute top-full right-4 mt-2 w-64 bg-white shadow-md rounded-full flex items-center px-3 py-1 z-50"
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

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700 text-3xl ml-4" onClick={() => setIsOpen(!isOpen)}>
            ☰
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center ml-[80px]">
            <div className="flex space-x-[25px] text-[18px]">
              <Link
                href="/"
                onClick={closeMenus}
                className="relative hover:text-cyan-500 transition-colors duration-300
                           after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-cyan-400 after:to-purple-500
                           after:left-0 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full"
              >
                Home
              </Link>

              {menuItems.map((menu) => (
                <div
                  key={menu.key}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(menu.key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="relative hover:text-cyan-500 transition-colors duration-300
                    after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-cyan-400 after:to-purple-500
                    after:left-0 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {menu.title}
                  </button>

                  <AnimatePresence>
                    {activeDropdown === menu.key && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2
                                   w-72 bg-white shadow-xl rounded-xl py-2 z-50"
                      >
                        {menu.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMenus}
                            className="block px-4 py-2 rounded-lg transition-all duration-300
                                       hover:bg-gradient-to-r hover:from-cyan-400 hover:to-purple-500
                                       hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]
                                       font-poppins text-[16px]"
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

            {/* Search & Social Icons (Desktop Only) */}
            <div className="flex items-center ml-[180px] space-x-[20px] relative">
              {/* Search Icon */}
              <motion.div
                whileHover={{ scale: 1.3 }}
                className="rounded-full p-2 cursor-pointer transition"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="w-5 h-5 text-cyan-500" />
              </motion.div>

              {/* Animated Search Input (Responsive) */}
              <AnimatePresence>
                {showSearch && (
                  <motion.form
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "100%" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSearchSubmit}
                    className="absolute top-full mt-2 md:mt-0 md:right-[120px] right-0 md:w-[220px] w-full flex items-center bg-white shadow-md rounded-full border border-cyan-300 overflow-hidden px-2 z-50"
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="outline-none text-sm px-2 py-2 w-full"
                    />
                    <button type="button" onClick={() => setShowSearch(false)}>
                      <X className="w-5 h-5 text-gray-500 hover:text-red-500" />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Other Icons */}
              {[ 
                { icon: <Mail className="w-5 h-5 text-cyan-500" />, href: "mailto:info@linorai.com" },
                { icon: <Facebook className="w-5 h-5 text-cyan-500" />, href: "https://facebook.com" },
                { icon: <Linkedin className="w-5 h-5 text-cyan-500" />, href: "https://linkedin.com" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.3 }}
                  className="rounded-full p-2 cursor-pointer transition"
                >
                  <Link href={item.href} target="_blank">{item.icon}</Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden bg-white px-4 py-4 space-y-3 shadow-md font-poppins text-[16px] rounded-lg"
            >
              <Link href="/" onClick={closeMenus} className="block py-2 px-3 rounded hover:bg-gray-100">Home</Link>

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
      </div>
    </nav>
  );
}
