import React from 'react';
import { X, Award, ShieldCheck, Heart, Coffee, ArrowRight } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShopCoffee: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onShopCoffee }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#12100E]/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      
      <div 
        id="about-modal-container"
        className="relative w-full max-w-3xl bg-[#FAF7F2] border border-[#12100E] shadow-2xl overflow-hidden flex flex-col my-8 text-left"
      >
        {/* Visual Hero Header */}
        <div className="relative h-64 sm:h-72 bg-[#12100E] overflow-hidden border-b border-[#12100E]">
          <img
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85"
            alt="TROSE Coffee Origin and Roasting Ritual"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-[#12100E]/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 border border-white/30 bg-black/40 hover:bg-white text-white hover:text-[#12100E] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-6 left-6 sm:left-8 right-6 text-white space-y-1.5">
            <div className="flex items-center space-x-2 text-[10px] uppercase font-mono tracking-[0.28em] text-[#C2873F] font-bold">
              <span>OUR STORY</span>
              <span>·</span>
              <span>RISE. REFRESH. REIGN.</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-editorial font-bold uppercase tracking-tight">
              Good Coffee. Brighter Humans.
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8 max-h-[60vh] overflow-y-auto">
          
          {/* Mission */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#5C121E] font-bold block">
              01 / THE TROSE VISION
            </span>
            <h3 className="text-xl font-editorial font-bold uppercase text-[#12100E]">
              Balance With Boldness
            </h3>
            <p className="text-sm text-[#12100E]/80 leading-relaxed font-normal">
              TROSE Coffee & More was created to bring exceptional coffee, intentional design, and elevated daily rituals to your morning. We believe coffee is more than caffeine—it is an art form, a moment of stillness, and a shared passion that brings people together.
            </p>
          </div>

          {/* Pillars (Bauhaus Structural Boxes) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 bg-[#F7F3EB] border border-[#12100E] space-y-2">
              <Coffee className="w-5 h-5 text-[#5C121E]" />
              <h4 className="text-xs font-mono font-bold uppercase text-[#12100E]">Curated Roasts</h4>
              <p className="text-xs text-[#12100E]/70 leading-relaxed font-normal">
                Signature blends and single origins chosen for natural sweetness, deep aromatics, and clean balance.
              </p>
            </div>

            <div className="p-5 bg-[#F7F3EB] border border-[#12100E] space-y-2">
              <ShieldCheck className="w-5 h-5 text-[#1E3A2F]" />
              <h4 className="text-xs font-mono font-bold uppercase text-[#12100E]">Organic Focus</h4>
              <p className="text-xs text-[#12100E]/70 leading-relaxed font-normal">
                Organic selections chosen for clean character and rich, ethical quality.
              </p>
            </div>

            <div className="p-5 bg-[#F7F3EB] border border-[#12100E] space-y-2">
              <Heart className="w-5 h-5 text-[#C2873F]" />
              <h4 className="text-xs font-mono font-bold uppercase text-[#12100E]">Daily Ritual</h4>
              <p className="text-xs text-[#12100E]/70 leading-relaxed font-normal">
                Designed to make every morning feel intentional, inspiring, and deeply satisfying.
              </p>
            </div>
          </div>

          {/* Roasting Philosophy */}
          <div className="space-y-2 bg-[#F7F3EB] p-6 border border-[#12100E]">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C2873F] font-bold block">
              02 / ROASTING PHILOSOPHY
            </span>
            <h4 className="text-sm font-editorial font-bold uppercase text-[#12100E]">
              Harmonious Roasting Profiles
            </h4>
            <p className="text-xs text-[#12100E]/75 leading-relaxed font-normal">
              Every coffee is roasted to showcase balanced flavor characteristics, seeking the sweet spot where brightness, rich body, and smooth finish unite.
            </p>
          </div>

          {/* CTA */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                onClose();
                onShopCoffee();
              }}
              className="px-6 py-3 bg-[#12100E] hover:bg-[#5C121E] text-white text-xs font-mono uppercase tracking-[0.2em] font-bold transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <span>EXPLORE THE ROASTS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
