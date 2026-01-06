"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Carousel from "./Carousel";
import OrderForm3D from "./OrderForm3D";
import { getPricing } from "@/lib/adminStorage";

export default function Products() {
  const [pricing, setPricing] = useState(null);
  
  const bibloImages = [
    require("../assets/biblo.jpg"),
    require("../assets/biblo2.jpg"),
    require("../assets/biblo3.jpg"),
    require("../assets/biblo4.jpg"),
    require("../assets/biblo5.jpg"),
    require("../assets/biblo6.jpg"),
  ];

  useEffect(() => {
    const loadPricing = async () => {
      try {
        const pricingData = await getPricing();
        setPricing(pricingData);
      } catch (error) {
        console.error("Error loading pricing:", error);
      }
    };

    loadPricing();
  }, []);

  return (
    <section id="3d-figur" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            3D Figür Çalışmalarımız
          </h2>
          <p className="text-xl text-gray-400">
            Müşterilerimiz için özel olarak ürettiğimiz eserler
          </p>
        </div>

        <div className="space-y-20">
          {/* 3D Figür Carousel */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-600/20 to-slate-700/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
              <Carousel images={bibloImages} title="3D Figür Çalışmalarımız" />
            </div>
          </div>

          {/* 3D Figure Info */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-white">
                  Kişiye Özel 3D Figürler
                </h3>
                <p className="text-gray-300 leading-relaxed">
                Biblo 3D Studio olarak, sevdiklerinizle paylaştığınız özel anları 3D baskı figürlere dönüştürüyoruz 🎨
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Ailenizi, dostlarınızı ya da en sevdiğiniz kareyi ölümsüzleştirin 👨‍👩‍👧‍👦
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📦</span>
                    <span className="text-white">Kişiye özel tasarım</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🧩</span>
                    <span className="text-white">Gerçek boyutlu modelleme</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">✨</span>
                    <span className="text-white">SLA baskı teknolojisi</span>
                  </div>
                </div>

                <Link
                  href="#siparis-3d"
                  className="inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-gradient-to-r from-teal-600 to-slate-700 rounded-full hover:shadow-2xl hover:shadow-teal-500/30 hover:scale-105 transition-all duration-300"
                >
                  Hemen Sipariş Ver
                </Link>
              </div>

              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                <h4 className="text-xl font-bold text-white mb-4">
                  🎨 Özel Tasarım Fiyat Listesi
                </h4>
                {pricing && (
                  <>
                    <p className="text-sm text-gray-400 mb-4">
                      (Bir görselde Max {pricing.maxPersonsIncluded} kişi - {pricing.maxPersonsIncluded}'ten fazla kişi için +{pricing.extraPersonFee})
                    </p>
                    <div className="space-y-3">
                      {pricing.sizes.slice(0, 4).map((sizeItem, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                          <span className="text-white font-medium">{sizeItem.size}</span>
                          <span className="text-teal-400 font-bold">{sizeItem.price}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {!pricing && (
                  <div className="text-center text-gray-400 py-4">
                    Fiyat bilgileri yükleniyor...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Form */}
          <OrderForm3D />
        </div>
      </div>
    </section>
  );
}
