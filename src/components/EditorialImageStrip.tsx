import React from 'react';
import { ArrowRight } from 'lucide-react';

interface EditorialImageStripProps {
  onLearnMore?: () => void;
}

export const EditorialImageStrip: React.FC<EditorialImageStripProps> = ({ onLearnMore }) => {
  return (
    <section id="hero-editorial-image-strip" className="w-full bg-[#F4EFEA] border-b border-[#0E0C0B]/10 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[220px] sm:min-h-[260px] lg:min-h-[300px]">
        
        {/* Block 1 (Wide ~40%): Misty Mountain Landscape with Text Overlay */}
        <div className="md:col-span-5 relative group overflow-hidden bg-[#162820] min-h-[220px] sm:min-h-full">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85"
            alt="Misty highland coffee mountains at sunrise"
            className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 opacity-85"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          {/* Subtle dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C0B]/85 via-[#0E0C0B]/30 to-transparent" />

          {/* Bottom-left Typography: BEANS / PEOPLE / PLACES / POSSIBILITIES */}
          <div className="absolute bottom-6 left-6 sm:left-8 z-10 text-left">
            <div className="text-xs sm:text-sm font-sans font-bold uppercase tracking-[0.24em] text-white leading-relaxed">
              <span className="block">BEANS</span>
              <span className="block">PEOPLE</span>
              <span className="block">PLACES</span>
              <span className="block">POSSIBILITIES</span>
            </div>
            <div className="w-12 h-[2px] bg-[#C88E38] mt-2.5" />
          </div>
        </div>

        {/* Block 2 (~22%): Warm Ivory Editorial Text Block */}
        <div className="md:col-span-3 bg-[#F4EFEA] p-6 sm:p-8 flex flex-col justify-center items-start text-left border-l border-r border-[#0E0C0B]/10">
          <div className="space-y-3 font-sans max-w-xs">
            <div className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em] text-[#0E0C0B] leading-relaxed">
              <span className="block">ETHICALLY SOURCED.</span>
              <span className="block">GLOBALLY INSPIRED.</span>
              <span className="block">ROASTED FOR A</span>
              <span className="block text-[#C88E38]">BRIGHTER TOMORROW.</span>
            </div>

            <button
              onClick={onLearnMore}
              className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#0E0C0B] hover:text-[#C88E38] border-b border-[#0E0C0B] pb-0.5 hover:border-[#C88E38] transition-colors cursor-pointer pt-2"
            >
              <span>OUR IMPACT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Block 3 (~20%): Close-up Photography of Ripe Coffee Cherries */}
        <div className="md:col-span-2 relative group overflow-hidden bg-[#2A1D15] min-h-[180px] sm:min-h-full">
          <img
            src="https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=800&q=85"
            alt="Vibrant ripe red coffee cherries growing on the branch"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Block 4 (~18%): Deep Forest Green Arch with Typography */}
        <div className="md:col-span-2 bg-[#162820] p-6 sm:p-7 flex flex-col justify-center items-center text-center relative overflow-hidden">
          {/* Inner Geometric Arch matching reference */}
          <div className="w-full max-w-[150px] aspect-[3/4] rounded-t-full border border-white/20 bg-[#0E0C0B]/40 flex flex-col items-center justify-center p-4">
            <div className="text-[11px] sm:text-xs font-sans font-extrabold uppercase tracking-[0.2em] text-[#F4EFEA] leading-relaxed">
              <span className="block">A MORE</span>
              <span className="block">INCLUSIVE</span>
              <span className="block text-[#C88E38]">COFFEE</span>
              <span className="block">FUTURE.</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
