"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";

export default function Hero() {
  const [currentWord, setCurrentWord] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const words = ["Anılarınızı", "Sevdiklerinizi", "Mutlu Anlarınızı", "Özel Günlerinizi"];
  const fadeTimeoutRef = useRef(null);
  const fadeDuration = 500;
  const intervalDuration = 3000;
  const gridBackground = "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"grid\" width=\"60\" height=\"60\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M 60 0 L 0 0 0 60\" fill=\"none\" stroke=\"rgba(255,255,255,0.03)\" stroke-width=\"1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grid)\"/%3E%3C/svg%3E')";

  const floatingIcons = useMemo(() => {
    const symbols = ["🎨", "🎭", "🗿", "🎪"];
    return Array.from({ length: 20 }, (_, index) => {
      const left = (index * 37 + 13) % 100;
      const top = (index * 29 + 7) % 100;
      const delay = ((index * 173) % 1000) / 100;
      const duration = 10 + ((index * 59) % 200) / 10;

      return {
        left: `${left}%`,
        top: `${top}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        symbol: symbols[index % symbols.length],
      };
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);

      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }

      fadeTimeoutRef.current = setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % words.length);
        setIsFading(false);
      }, fadeDuration);
    }, intervalDuration);

    return () => {
      clearInterval(interval);
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, [fadeDuration, intervalDuration, words.length]);

  return (
    <section className="relative min-h-screen flex mt-10 items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-teal-900/20 to-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-50"
          style={{ backgroundImage: gridBackground, backgroundRepeat: "repeat" }}
        ></div>
        
        {/* Floating 3D Icons */}
        <div className="absolute inset-0">
          {floatingIcons.map((icon, idx) => (
            <div
              key={idx}
              className="absolute animate-float"
              style={{
                left: icon.left,
                top: icon.top,
                animationDelay: icon.animationDelay,
                animationDuration: icon.animationDuration,
              }}
            >
              <span className="text-4xl opacity-20">{icon.symbol}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="bg-gradient-to-r from-teal-900 to-slate-800 text-white text-sm font-bold px-4 py-2 rounded-full">
                  ✨ SLA 3D Baskı Teknolojisi 2
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                <span
                  className={`bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400 transition-opacity duration-500 ease-in-out ${
                    isFading ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {words[currentWord]}
                </span>
                <br />
                <span>Ölümsüzleştirin</span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed">
                Görselinizi yükleyin, boyut seçin ve premium kalitede kişiye özel figürünüzü alın. 
                <span className="text-teal-400 font-semibold"> SLA baskı teknolojisiyle</span> yapılan 
                her figür, mükemmel detay ve dayanıklılığı garanti eder.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="#siparis"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-teal-600 to-slate-700 rounded-full hover:shadow-2xl hover:shadow-teal-500/30 hover:scale-105"
              >
                <span className="relative">Hemen Sipariş Ver</span>
                <svg
                  className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>

              <Link
                href="#products"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold transition-all duration-200 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-white/20 hover:scale-105"
              >
                <span className="relative">Ürünlerimizi İncele</span>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">Kişiye Özel</p>
                  <p className="text-gray-400 text-sm">Tasarım</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">3-5 Gün</p>
                  <p className="text-gray-400 text-sm">Hızlı Teslimat</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">%100 Güvenli</p>
                  <p className="text-gray-400 text-sm">Kargo</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">Premium</p>
                  <p className="text-gray-400 text-sm">Kalite</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - 3D Visual */}
          <div className="relative lg:block hidden">
            <div className="relative w-full h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-slate-700 rounded-3xl opacity-20 blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
                <div className="text-center space-y-6">
                  <div className="text-9xl animate-bounce-slow">🎨</div>
                  <h3 className="text-2xl font-bold text-white">Kişiye Özel 3D Figürler</h3>
                  <div className="flex justify-center space-x-4">
                    <div className="text-6xl animate-pulse">🗿</div>
                    <div className="text-6xl animate-pulse animation-delay-200">🎭</div>
                    <div className="text-6xl animate-pulse animation-delay-400">🎪</div>
                  </div>
                  <p className="text-gray-300">Hayal et, biz basalım!</p>
                  <div className="grid grid-cols-2 gap-4 pt-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-3xl font-bold text-teal-400">2K+</p>
                      <p className="text-gray-400">Mutlu Müşteri</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-3xl font-bold text-cyan-400">4.9★</p>
                      <p className="text-gray-400">Müşteri Puanı</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
