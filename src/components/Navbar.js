"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed z-50  transition-all duration-500 ease-in-out ${
        scrolled
          ? "top-5 left-1/2 -translate-x-1/2 w-[90%] md:w-3/4 lg:w-2/3 h-16 rounded-2xl backdrop-blur-lg bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 shadow-2xl border-gray-700/50"
          : "top-0 left-0 w-full h-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl"
      }`}
    >
      <div className="h-full w-full max-w-6xl mx-auto px-6 md:px-12 flex items-center justify-between gap-10">
        {/* Logo and Brand Name */}
        <div className="flex items-center gap-3">
          <Image 
            src={logo} 
            alt="Logo" 
            width={scrolled ? 60 : 80} 
            height={scrolled ? 60 : 80}
            className="transition-all duration-500 ease-in-out"
          />
          <span className="text-base md:text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Craft Maket 3D
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10 text-sm">
          <Link
            href="#3d-figur"
            className="text-gray-300 hover:text-white transition-all duration-300 font-medium hover:scale-105 flex items-center space-x-1"
          >
            <span className="text-xl">🎨</span>
            <span>3D Figür</span>
          </Link>
          <Link
            href="#production-process"
            className="text-gray-300 hover:text-white transition-all duration-300 font-medium hover:scale-105"
          >
            Üretim Süreci
          </Link>
          <Link
            href="#testimonials"
            className="text-gray-300 hover:text-white transition-all duration-300 font-medium hover:scale-105"
          >
            Yorumlar
          </Link>
          <a
            href="https://wa.me/905513481332"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-full flex items-center space-x-2 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm5.472 12.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span className="font-medium">7/24 Canlı Destek</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? "max-h-96 opacity-100 translate-y-0" 
            : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="p-4">
          <Link
            href="#3d-figur"
            className="block text-gray-300 hover:text-white py-2 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            🎨 3D Figür
          </Link>
          <Link
            href="#production-process"
            className="block text-gray-300 hover:text-white py-2 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Üretim Süreci
          </Link>
          <Link
            href="#testimonials"
            className="block text-gray-300 hover:text-white py-2 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Yorumlar
          </Link>
          <a
            href="https://wa.me/905513481332"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-center mt-3"
          >
            7/24 Canlı Destek
          </a>
        </div>
      </div>
    </nav>
  );
}
