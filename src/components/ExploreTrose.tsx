import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { ProductCategory } from '../types';

interface ExploreTroseProps {
  onShopCollection: (category: ProductCategory) => void;
}

export const ExploreTrose: React.FC<ExploreTroseProps> = ({ onShopCollection }) => {
  return (
    <section id="explore-trose-section" className="py-16 sm:py-24 bg-[#F7F3EB] border-b border-[#12100E]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Section Header: Quieter Editorial Hierarchy */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-2 max-w-xl text-left">
            <div className="flex items-center space-x-3 text-xs uppercase tracking-[0.2em] font-sans text-[#CCA347] font-semibold">
              <span className="w-5 h-[1.5px] bg-[#CCA347]" />
              <span>COLLECTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-editorial font-semibold text-[#12100E] tracking-tight uppercase leading-[1.05]">
              Explore The World Of{' '}
              <span className="text-[#5C151E] font-serif italic font-normal normal-case">
                TROSE
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#12100E]/75 font-sans font-normal leading-relaxed">
              Discover coffees and wares designed to bring warmth, balance, and luxury to your daily ritual.
            </p>
          </div>

          <button
            onClick={() => onShopCollection('all')}
            className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-[0.16em] font-semibold text-[#12100E] hover:text-[#5C151E] transition-colors cursor-pointer group self-start md:self-end border-b border-[#12100E]/30 pb-0.5 hover:border-[#5C151E]"
          >
            <span>VIEW ALL OFFERINGS</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#CCA347] group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* Editorial Collage Layout: Lifestyle Story + Geometric Collection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Human / Lifestyle Story Panel (5 cols) with Bauhaus Overlap */}
          <div className="lg:col-span-5 relative group overflow-hidden border border-[#12100E] bg-[#1E1712] flex flex-col justify-between min-h-[440px] sm:min-h-[500px] shadow-sm">
            {/* Lifestyle Image: People enjoying morning coffee ritual */}
            <img
              src="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=85"
              alt="Quiet morning coffee ritual"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 opacity-80"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            {/* Soft Warm Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-[#12100E]/40 to-transparent" />
            
            {/* Top Bauhaus Badge */}
            <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between text-white">
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-semibold bg-[#FAF6F0] text-[#12100E] px-3 py-1 border border-[#12100E]">
                RITUAL & LIVING
              </span>
              <div className="w-2.5 h-2.5 rounded-full bg-[#CCA347]" />
            </div>

            {/* Bottom Content: Refined Secondary Typography */}
            <div className="relative z-10 p-6 sm:p-8 space-y-3 text-left text-white">
              <div className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#CCA347] font-semibold">
                RISE. REFRESH. REIGN.
              </div>
              <h3 className="text-xl sm:text-2xl font-editorial font-semibold uppercase leading-snug text-white">
                Moments of stillness, clarity & bold flavor.
              </h3>
              <p className="text-xs sm:text-sm text-white/80 font-sans font-normal leading-relaxed max-w-sm">
                An invitation to pause, breathe, and elevate the morning cup into an art form.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onShopCollection('coffee')}
                  className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-[0.16em] text-[#CCA347] font-semibold hover:text-white transition-colors cursor-pointer"
                >
                  <span>EXPLORE COFFEES</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Geometric Bauhaus Collection Cards (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Card 1: Specialty Coffee with Burgundy Geometric Arch */}
            <div
              id="collection-coffee-card"
              onClick={() => onShopCollection('coffee')}
              className="relative p-6 sm:p-7 border border-[#12100E] bg-[#FAF6F0] overflow-hidden flex flex-col justify-between min-h-[250px] group cursor-pointer transition-all hover:shadow-md"
            >
              {/* Geometric Backdrop: Deep Burgundy Arch */}
              <div className="absolute top-0 right-0 w-32 h-44 bg-[#5C151E] rounded-bl-[80px] opacity-90 transition-transform duration-500 group-hover:scale-105 -z-0" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-[#12100E]">
                  COLLECTION 01
                </span>
                <span className="w-7 h-7 bg-white border border-[#12100E] flex items-center justify-center text-[#5C151E] group-hover:bg-[#5C151E] group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              <div className="relative z-10 pt-8 text-left">
                <h4 className="text-xl font-editorial font-semibold uppercase text-[#12100E] group-hover:text-[#5C151E] transition-colors">
                  Coffee Collections
                </h4>
                <p className="text-xs text-[#12100E]/70 font-sans font-normal mt-1 max-w-[200px]">
                  Signature roasts and single-origins with balanced aromatics.
                </p>
                <span className="inline-block mt-3 text-[10px] font-sans uppercase tracking-[0.16em] font-semibold text-[#5C151E]">
                  BROWSE COFFEE →
                </span>
              </div>
            </div>

            {/* Card 2: Organic Coffee with Forest Green Semicircle */}
            <div
              id="collection-organic-card"
              onClick={() => onShopCollection('organic')}
              className="relative p-6 sm:p-7 border border-[#12100E] bg-[#FAF6F0] overflow-hidden flex flex-col justify-between min-h-[250px] group cursor-pointer transition-all hover:shadow-md"
            >
              {/* Geometric Backdrop: Subtle Forest Green Semicircle */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#1C3328] rounded-full translate-x-8 -translate-y-8 opacity-85 transition-transform duration-500 group-hover:scale-105 -z-0" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-[#12100E]">
                  COLLECTION 02
                </span>
                <span className="w-7 h-7 bg-white border border-[#12100E] flex items-center justify-center text-[#1C3328] group-hover:bg-[#1C3328] group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              <div className="relative z-10 pt-8 text-left">
                <h4 className="text-xl font-editorial font-semibold uppercase text-[#12100E] group-hover:text-[#1C3328] transition-colors">
                  Organic Coffee
                </h4>
                <p className="text-xs text-[#12100E]/70 font-sans font-normal mt-1 max-w-[200px]">
                  Certified organic beans cultivated with respect for the land.
                </p>
                <span className="inline-block mt-3 text-[10px] font-sans uppercase tracking-[0.16em] font-semibold text-[#1C3328]">
                  BROWSE ORGANIC →
                </span>
              </div>
            </div>

            {/* Card 3: Espresso & Brewing Machines with Natural Kraft Field */}
            <div
              id="collection-machines-card"
              onClick={() => onShopCollection('machines')}
              className="relative p-6 sm:p-7 border border-[#12100E] bg-[#FAF6F0] overflow-hidden flex flex-col justify-between min-h-[250px] group cursor-pointer transition-all hover:shadow-md"
            >
              {/* Geometric Backdrop: Natural Kraft / Warm Tan Field */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#D4B896] rounded-tl-[70px] opacity-90 transition-transform duration-500 group-hover:scale-105 -z-0" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-[#12100E]">
                  COLLECTION 03
                </span>
                <span className="w-7 h-7 bg-white border border-[#12100E] flex items-center justify-center text-[#1E1712] group-hover:bg-[#1E1712] group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              <div className="relative z-10 pt-8 text-left">
                <h4 className="text-xl font-editorial font-semibold uppercase text-[#12100E] group-hover:text-[#1E1712] transition-colors">
                  Coffee Machines
                </h4>
                <p className="text-xs text-[#12100E]/70 font-sans font-normal mt-1 max-w-[200px]">
                  Precision espresso machines and high-performance coffee makers.
                </p>
                <span className="inline-block mt-3 text-[10px] font-sans uppercase tracking-[0.16em] font-semibold text-[#1E1712]">
                  DISCOVER GEAR →
                </span>
              </div>
            </div>

            {/* Card 4: Mugs & Barista Gear with Antique Champagne Gold Field */}
            <div
              id="collection-gear-card"
              onClick={() => onShopCollection('accessories')}
              className="relative p-6 sm:p-7 border border-[#12100E] bg-[#FAF6F0] overflow-hidden flex flex-col justify-between min-h-[250px] group cursor-pointer transition-all hover:shadow-md"
            >
              {/* Geometric Backdrop: Champagne Gold Quarter Circle */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#CCA347] rounded-bl-full opacity-90 transition-transform duration-500 group-hover:scale-105 -z-0" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-[#12100E]">
                  COLLECTION 04
                </span>
                <span className="w-7 h-7 bg-white border border-[#12100E] flex items-center justify-center text-[#CCA347] group-hover:bg-[#CCA347] group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              <div className="relative z-10 pt-8 text-left">
                <h4 className="text-xl font-editorial font-semibold uppercase text-[#12100E] group-hover:text-[#CCA347] transition-colors">
                  Mugs & Accessories
                </h4>
                <p className="text-xs text-[#12100E]/70 font-sans font-normal mt-1 max-w-[200px]">
                  Ceramic drinkware, travel flasks, and brew accessories.
                </p>
                <span className="inline-block mt-3 text-[10px] font-sans uppercase tracking-[0.16em] font-semibold text-[#CCA347]">
                  EXPLORE ACCESSORIES →
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
