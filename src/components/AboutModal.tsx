import React from 'react';
import { X, Sparkles, Award, ShieldCheck, HeartHandshake, MapPin, ArrowRight } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShopCoffee: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onShopCoffee }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      <div 
        id="about-modal-container"
        className="relative w-full max-w-3xl bg-[#FAF6F0] rounded-3xl shadow-2xl border border-[#E8DFD5] overflow-hidden flex flex-col my-8"
      >
        {/* Visual Hero Header */}
        <div className="relative h-64 sm:h-72 bg-[#241712] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85"
            alt="TROSE Roasting Master & Coffee Farm"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241712] via-[#241712]/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-[#241712] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-6 left-6 sm:left-8 right-6 text-white space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#E65F38] font-bold">The TROSE Story</span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Great Coffee. Real Culture.</h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8 max-h-[60vh] overflow-y-auto">
          
          {/* Mission */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold uppercase text-[#241712]">Our Origin</h3>
            <p className="text-sm text-[#7A6C63] leading-relaxed font-normal">
              TROSE Coffee & More was created to bring high-elevation micro-lots and vibrant coffee culture straight to your everyday kitchen ritual. We believe coffee should taste extraordinary, feel warm, and spark connection without the stuffy attitude.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 bg-white rounded-2xl border border-[#E8DFD5] space-y-2">
              <Award className="w-5 h-5 text-[#D63426]" />
              <h4 className="text-sm font-bold uppercase text-[#241712]">Top 1% Micro-Lots</h4>
              <p className="text-xs text-[#7A6C63] leading-relaxed font-normal">
                We cup seasonal coffees year-round, roasting only sweet, fruit-forward lots with vibrant flavor clarity.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#E8DFD5] space-y-2">
              <ShieldCheck className="w-5 h-5 text-[#657953]" />
              <h4 className="text-sm font-bold uppercase text-[#241712]">100% Organic</h4>
              <p className="text-xs text-[#7A6C63] leading-relaxed font-normal">
                Zero synthetics or pesticides. Shade grown beneath canopies for rich biodiversity and soil health.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#E8DFD5] space-y-2">
              <HeartHandshake className="w-5 h-5 text-[#E65F38]" />
              <h4 className="text-sm font-bold uppercase text-[#241712]">Direct Trade</h4>
              <p className="text-xs text-[#7A6C63] leading-relaxed font-normal">
                Transparent long-term partnerships with generational farming families that pay well above fair-trade.
              </p>
            </div>
          </div>

          {/* The Roasting Process */}
          <div className="space-y-3 bg-white p-6 rounded-2xl border border-[#E8DFD5]">
            <div className="flex items-center space-x-2 text-[#D63426]">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-widest font-mono font-bold">Small-Batch Drum Roasting</span>
            </div>
            <p className="text-xs text-[#7A6C63] leading-relaxed font-normal">
              Every single batch is profiled on custom cast-iron drum roasters. We highlight origin sweetness, fruit esters, and balanced acidity, packing within hours of roast in nitrogen-sealed valved pouches.
            </p>
          </div>

          {/* Tasting Room & Boutique */}
          <div className="flex items-start space-x-4 p-5 bg-white rounded-2xl border border-[#E8DFD5]">
            <MapPin className="w-5 h-5 text-[#E65F38] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold uppercase text-[#241712]">Visit The TROSE Roastery Bar</h4>
              <p className="text-xs text-[#7A6C63] font-normal">
                Join us for weekend public cupping sessions, espresso flight pairings, and gear walkthroughs at our flagship roastery.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                onClose();
                onShopCoffee();
              }}
              className="px-8 py-3.5 bg-[#D63426] hover:bg-[#BF2A1D] text-white text-xs uppercase tracking-widest font-black rounded-full transition-colors flex items-center space-x-2 cursor-pointer shadow-md"
            >
              <span>Explore All Roasts</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};


