"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // State untuk visibilitas header
  const [lastScrollY, setLastScrollY] = useState(0); // Simpan posisi scroll terakhir
  const pathname = usePathname();

  const navigationLinks = [
    { href: "/", label: "Beranda" },
    { href: "/portofolio", label: "Portofolio" },
    { href: "/hubungi-kami", label: "Mulai Konsultasi" },
  ];

  // Logika untuk deteksi arah scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scroll ke bawah dan melewati 50px
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scroll ke atas
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const NavLink = ({ href, children, type }) => {
    const isActive = pathname === href;
    const isConsultation = href === "/hubungi-kami";

    return (
      <Link
        href={href}
        className={`font-plus-jakarta-sans text-[18px] 
          ${
            type === "desktop" && isConsultation
              ? "bg-secondary hover:text-white px-6 py-3 rounded-[6px] font-semibold hover:bg-primary transition-colors duration-300"
              : `hover:text-primary py-2 ${
                  isActive ? " font-extrabold underline underline-offset-3" : ""
                }`
          }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 bg-background backdrop-blur-md ${
        isMenuOpen ? "" : "border-b"
      }`}
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }} // Animasi hide/show
      transition={{ duration: 0.3, ease: "easeInOut" }} // Smooth transition
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="Mangala Dipa Lokatara Logo"
              width={33}
              height={36}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <NavLink key={link.href} href={link.href} type="desktop">
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-8 h-8 flex items-center justify-center transition-all duration-300 ease-in-out rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 transition-transform duration-300 rotate-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* Mobile Navigation */}
          <div
            className={`absolute top-20 left-0 right-0 bg-background md:hidden border-b transform transition-all duration-300 ease-in-out ${
              isMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            <nav className="flex flex-col px-4 py-2">
              {navigationLinks.map((link) => (
                <NavLink key={link.href} href={link.href} type="mobile">
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
