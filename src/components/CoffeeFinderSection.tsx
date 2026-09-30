import React from 'react';
import { ArrowRight, Sparkles, Coffee, Heart, Sliders, CheckCircle2 } from 'lucide-react';

interface CoffeeFinderSectionProps {
  onOpenFinder: () => void;
}

export const CoffeeFinderSection: React.FC<CoffeeFinderSectionProps> = ({ onOpenFinder }) => {
  return (
    <section 
      id="coffee-finder-homepage-section" 
      className="py-16 sm:py-24 bg-[#FAF6F0] relative overflow-hidden border-b border-[#E8DFD5]"
    >
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#E65F38]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#D63426]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        
        {/* Main Interactive Feature Container */}
        <div className="bg-[#241712] rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden border border-[#3A271E]">
          
          {/* Subtle Background Pattern Elements */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute -right-32 -bottom-32 w-[420px] h-[420px] rounded-full border border-[#D63426]/10 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
              
              {/* Playful Eyebrow Pill */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-[#E65F38]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#FAF6F0]/90 font-mono">
                  TROSE Interactive Tasting Matcher
                </span>
              </div>

              {/* Exact Requested Headline */}
              <div className="space-y-2">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.02] uppercase text-[#FAF6F0]">
                  Not Sure What Coffee Is Yours?
                </h2>
                
                {/* Exact Requested Supporting Text */}
                <p className="text-lg sm:text-xl text-[#FAF6F0]/80 font-normal leading-relaxed max-w-xl">
                  Tell us what you like. We'll find your perfect cup.
                </p>
              </div>

              {/* Feature Highlights Pills */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#FAF6F0]/75">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#657953]" />
                  <span>5 Quick Questions</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E65F38]" />
                  <span>Personalized Palate Score</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D63426]" />
                  <span>Tailored Brewing Recipe</span>
                </span>
              </div>

              {/* Exact Requested Primary Button */}
              <div className="pt-2">
                <button
                  id="homepage-find-my-coffee-btn"
                  onClick={onOpenFinder}
                  className="w-full sm:w-auto px-10 py-4.5 bg-[#D63426] hover:bg-[#BF2A1D] active:scale-[0.98] text-white text-xs uppercase tracking-widest font-black rounded-full transition-all duration-300 shadow-xl hover:shadow-[#D63426]/30 flex items-center justify-center space-x-3 cursor-pointer group"
                >
                  <span>Find My Coffee</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
              </div>

            </div>

            {/* Right Visual Column: Fun, Playful Coffee Palette Preview Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              {/* Central Card */}
              <div className="relative w-full max-w-sm bg-[#FAF6F0] rounded-3xl p-6 sm:p-7 text-[#241712] shadow-2xl border border-[#E8DFD5] space-y-5 transform sm:rotate-1 hover:rotate-0 transition-transform duration-500">
                
                {/* Header of Preview Card */}
                <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-[#D63426] text-white flex items-center justify-center shadow-sm">
                      <Coffee className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A6C63] font-bold block">
                        Signature Quiz
                      </span>
                      <span className="text-xs font-bold uppercase text-[#241712]">
                        Taste Profile Match
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-[#EBF1E6] text-[#657953] text-[10px] font-mono font-bold tracking-wider uppercase border border-[#657953]/20">
                    98% Match
                  </span>
                </div>

                {/* Playful Interactive Option Simulation */}
                <div className="space-y-2.5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#7A6C63] font-bold">
                    What sounds delicious?
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-[#241712] text-white flex items-center space-x-2 text-xs font-semibold shadow-xs">
                      <span>🍫</span>
                      <span className="text-[11px]">Chocolatey</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#E8DFD5] text-[#241712] flex items-center space-x-2 text-xs font-semibold">
                      <span>🍓</span>
                      <span className="text-[11px]">Fruity & Bright</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#E8DFD5] text-[#241712] flex items-center space-x-2 text-xs font-semibold">
                      <span>🍯</span>
                      <span className="text-[11px]">Caramel</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#E65F38]/15 border border-[#E65F38]/30 text-[#E65F38] flex items-center space-x-2 text-xs font-bold">
                      <span>🔥</span>
                      <span className="text-[11px]">Bold Roast</span>
                    </div>
                  </div>
                </div>

                {/* Strength Meter Preview */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#7A6C63]">
                    <span>Roast Strength</span>
                    <span className="font-bold text-[#D63426]">Very Bold</span>
                  </div>
                  <div className="w-full bg-[#E8DFD5] h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#E65F38] to-[#D63426] rounded-full w-4/5"></div>
                  </div>
                </div>

                {/* Quick Callout Footer */}
                <button
                  onClick={onOpenFinder}
                  className="w-full py-2.5 bg-[#241712] hover:bg-[#D63426] text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3 h-3 text-[#E65F38]" />
                  <span>Start 60-Second Quiz</span>
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
