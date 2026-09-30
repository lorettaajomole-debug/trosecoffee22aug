import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CoffeeFinderSectionProps {
  onOpenFinder: () => void;
}

export const CoffeeFinderSection: React.FC<CoffeeFinderSectionProps> = ({ onOpenFinder }) => {
  return (
    <section id="coffee-finder-homepage-section" className="w-full bg-[#0E0C0B] text-white relative overflow-hidden border-b border-[#0E0C0B]">
      
      {/* 3-Column Asymmetric Layout matching Master Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[440px] sm:min-h-[480px]">
        
        {/* Left Side: Solid Black Block with Typography & CTA (5 cols) */}
        <div className="lg:col-span-5 bg-[#0E0C0B] p-8 sm:p-12 lg:p-16 flex flex-col justify-center text-left z-20 font-sans space-y-6">
          
          <div className="space-y-1 font-display">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.95] uppercase">
              <span className="block">FIND YOUR</span>
              <span className="block text-[#C88E38]">TROSE</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed max-w-sm">
            Take our quick coffee quiz and discover the blends that match your taste, lifestyle and every version of you.
          </p>

          <div className="pt-2">
            <button
              id="homepage-find-my-coffee-btn"
              onClick={onOpenFinder}
              className="px-7 py-3.5 border border-white hover:border-[#C88E38] hover:text-[#C88E38] text-white text-xs uppercase tracking-[0.2em] font-sans font-bold transition-all duration-200 inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>TAKE THE QUIZ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Center: Overhead Circular Coffee Mug on Warm Stone (3 cols) */}
        <div className="lg:col-span-3 relative flex items-center justify-center bg-[#E5DDD2] overflow-hidden p-6">
          
          {/* Diagonal Split Texture in Background */}
          <div className="absolute inset-0 bg-[#0E0C0B] clip-diagonal -z-0 lg:block hidden w-1/3" />

          {/* Large Round Overhead Coffee Cup Photo */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden shadow-2xl border-4 border-[#0E0C0B] z-10">
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=85"
              alt="Freshly brewed artisanal coffee with rich golden crema"
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>

        </div>

        {/* Right Side: Burnt-Red Terracotta Panel & Geometric Arch (4 cols) */}
        <div className="lg:col-span-4 bg-[#7B2424] relative p-8 sm:p-10 flex flex-col justify-between overflow-hidden">
          
          {/* Subtle Geometric Circle in Background */}
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#8A2B2B] pointer-events-none -z-0" />

          {/* Left Text in Burnt-Red Panel: COFFEE / PEOPLE / A BRIGHTER / TOMORROW */}
          <div className="text-left font-sans z-10">
            <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-white/90 leading-relaxed">
              <span className="block">COFFEE</span>
              <span className="block">PEOPLE</span>
              <span className="block">A BRIGHTER</span>
              <span className="block">TOMORROW</span>
            </div>
            <div className="w-12 h-[2px] bg-[#C88E38] mt-2.5" />
          </div>

          {/* Right Dark Arch with Gold Script/Serif Text matching Reference */}
          <div className="mt-8 self-end w-48 sm:w-56 aspect-[3/4] rounded-t-full bg-[#1E120D] border border-white/10 p-6 flex flex-col items-center justify-center text-center z-10 shadow-lg">
            <div className="font-serif italic text-lg sm:text-xl text-[#C88E38] leading-tight">
              <span>Same Great Coffee.</span><br />
              <span className="mt-1 block">A Brighter Tomorrow.</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
