import React from 'react';
import { ArrowRight, Sparkles, Coffee } from 'lucide-react';
import { ProductCategory } from '../types';

interface HeroProps {
  onShopClick: (category?: ProductCategory) => void;
  onDiscoverClick: () => void;
  onOpenQuiz: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onShopClick,
  onDiscoverClick,
  onOpenQuiz
}) => {
  return (
    <section id="homepage-hero-section" className="relative bg-[#FAF6F0] overflow-hidden pt-8 sm:pt-14 pb-16 lg:pb-24 border-b border-[#E8DFD5]">
      
      {/* Decorative Warm Organic Blur in background */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#E65F38]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#D63426]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Bold, Playful, Confident Typography */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            
            {/* Playful Tag Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#EBF1E6] border border-[#657953]/20">
              <span className="w-2 h-2 rounded-full bg-[#657953] animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#657953]">
                Specialty Coffee & Modern Rituals
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-7xl lg:text-[78px] xl:text-[86px] font-black text-[#241712] tracking-tight leading-[0.94] uppercase">
                A Fresh Start <br />
                <span className="font-serif font-normal italic lowercase text-[#D63426]">to your day</span>
              </h1>
            </div>

            {/* Concise, Fresh Description */}
            <p className="text-base sm:text-lg text-[#241712]/75 max-w-lg font-normal leading-relaxed">
              Carefully curated single-origin beans, certified organic roasts, and precision brewing gear designed to make your morning coffee feel like the best part of the day.
            </p>

            {/* ONE Dominant CTA & Simple Text Link */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2">
              
              {/* Dominant Cherry Red CTA */}
              <button
                id="hero-shop-coffee-btn"
                onClick={() => onShopClick('coffee')}
                className="w-full sm:w-auto px-9 py-4 bg-[#D63426] hover:bg-[#BF2A1D] text-white text-xs uppercase tracking-widest font-black rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-3 cursor-pointer group"
              >
                <span>Shop Coffee</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Simple Secondary Text Link */}
              <button
                id="hero-quiz-link"
                onClick={onOpenQuiz}
                className="text-xs uppercase tracking-widest font-bold text-[#241712] hover:text-[#D63426] transition-colors flex items-center space-x-1.5 py-2 px-1 cursor-pointer group"
              >
                <span>Find Your Coffee</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D63426] group-hover:translate-x-1 transition-transform" />
              </button>

            </div>

            {/* Minimal Playful Trust Badges */}
            <div className="pt-6 border-t border-[#E8DFD5] flex flex-wrap items-center gap-6 text-xs text-[#241712]/80 font-medium">
              <div className="flex items-center space-x-2">
                <span className="text-[#D63426] font-black font-mono">100%</span>
                <span>Specialty Arabica</span>
              </div>
              <span className="text-[#E8DFD5]">•</span>
              <div className="flex items-center space-x-2">
                <span className="text-[#657953] font-black font-mono">BIO</span>
                <span>USDA Organic Lots</span>
              </div>
              <span className="text-[#E8DFD5]">•</span>
              <div className="flex items-center space-x-2">
                <span className="text-[#E65F38] font-black font-mono">48H</span>
                <span>Fresh Drum Roast</span>
              </div>
            </div>

          </div>

          {/* Right Column: One Strong Hero Visual with Playful Rotating Stamp */}
          <div className="lg:col-span-5 relative">
            
            {/* Playful Rotating Stamp Detail */}
            <div className="absolute -top-6 -right-3 sm:-right-6 z-20 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#FAF6F0] p-1.5 shadow-xl border border-[#E8DFD5] hidden sm:flex items-center justify-center">
              <div className="relative w-full h-full rounded-full bg-[#1F1612] text-white flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                  <path
                    id="stamp-circle-path"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[9px] font-mono uppercase tracking-[0.16em] fill-[#FAF6F0] font-bold">
                    <textPath href="#stamp-circle-path" startOffset="0%">
                      • ROASTED FRESH • 100% ARABICA •
                    </textPath>
                  </text>
                </svg>
                <Coffee className="w-5 h-5 text-[#D63426] absolute" />
              </div>
            </div>

            {/* Main Lifestyle Hero Photo */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#1F1612] shadow-xl border border-[#E8DFD5] group">
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85"
                alt="Fresh specialty coffee pour over morning ritual"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-95"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              
              {/* Clean bottom highlight card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#FAF6F0]/95 backdrop-blur-md border border-[#E8DFD5] flex items-center justify-between shadow-md">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#D63426] font-bold block">
                    Featured Micro-Lot
                  </span>
                  <h3 className="text-sm font-bold text-[#241712] font-sans">
                    Ethiopia Grand Reserve
                  </h3>
                  <span className="text-[11px] text-[#7A6C63]">Bergamot • Jasmine Honey</span>
                </div>
                <button
                  onClick={() => onShopClick('coffee')}
                  className="px-3.5 py-2 bg-[#241712] hover:bg-[#D63426] text-white text-[10px] uppercase font-bold tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  $24.50
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};


