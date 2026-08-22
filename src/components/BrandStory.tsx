import React from 'react';
import { ArrowRight, Sparkles, Award, ShieldCheck, Globe, Headphones, Lock, CheckCircle2, Heart } from 'lucide-react';

interface BrandStoryProps {
  onExploreStory: () => void;
  onShopCoffee: () => void;
}

export const BrandStory: React.FC<BrandStoryProps> = ({ onExploreStory, onShopCoffee }) => {
  return (
    <div id="brand-story-and-trust-root">
      
      {/* SECTION 1: COFFEE WITH A STORY */}
      <section id="coffee-with-a-story-section" className="py-16 sm:py-24 bg-[#FAF6F0] relative overflow-hidden border-b border-[#E8DFD5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Editorial Image Side */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E8DFD5] bg-[#1F1612] group">
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85"
                  alt="TROSE coffee culture, connection and morning rituals"
                  className="w-full h-[440px] sm:h-[500px] object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-95"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating Stamp / Badge */}
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-[#E8DFD5] shadow-xs flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D63426]"></span>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#241712] font-bold">
                    The Daily Ritual
                  </span>
                </div>

                {/* Bottom Story Caption */}
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1 bg-[#1F1612]/70 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#E65F38] font-bold block">
                    Portland & Copenhagen
                  </span>
                  <h4 className="text-lg sm:text-xl font-black uppercase tracking-tight">
                    Where Flavor Meets Human Connection
                  </h4>
                  <p className="text-xs text-white/80 font-normal">
                    "A thoughtful cup turns an ordinary morning into an intentional moment of pause."
                  </p>
                </div>
              </div>

              {/* Decorative Inset Frame */}
              <div className="absolute -bottom-5 -right-3 sm:-right-5 w-40 sm:w-48 h-40 sm:h-48 rounded-2xl overflow-hidden border-4 border-[#FAF6F0] shadow-lg hidden sm:block bg-[#1F1612]">
                <img
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=85"
                  alt="Artisanal pour over dripping in ceramic dripper"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Storytelling Copy Side */}
            <div className="lg:col-span-6 space-y-6">
              
              <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-[#D63426] font-bold block">
                Heritage & Everyday Rituals
              </span>

              <h2 className="text-4xl sm:text-6xl font-black text-[#241712] tracking-tight uppercase leading-[0.95]">
                Coffee With <br />
                <span className="font-serif font-normal italic lowercase text-[#E65F38]">a true story</span>
              </h2>

              <p className="text-base sm:text-lg text-[#241712] font-medium leading-relaxed">
                TROSE is a coffee and lifestyle brand dedicated to the intersection of flavor, culture, connection, and everyday rituals.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-[#7A6C63] leading-relaxed font-normal">
                <p>
                  We believe coffee is far more than a morning caffeine habit—it is a shared cultural language and a sensory moment of pause. From smallholder cloud-forest micro-lots in Yirgacheffe and Marcala to your kitchen counter, every bean carries the terroir of its origin.
                </p>
                <p>
                  Our roast profiles are crafted in small drum batches to celebrate natural sweetness, clean acidity, and chocolate undertones. Designed to look gorgeous on your counter and taste unforgettable in your cup.
                </p>
              </div>

              {/* Core Values Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {[
                  'Distinct Origin Terroir Flavor',
                  'Direct Generational Farm Trade',
                  'Mindful Morning Rituals',
                  'Timeless Scandinavian Aesthetic'
                ].map((val) => (
                  <div key={val} className="flex items-center space-x-2.5 text-xs text-[#241712] font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-[#D63426] shrink-0" />
                    <span>{val}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  id="learn-about-trose-btn"
                  onClick={onExploreStory}
                  className="px-8 py-3.5 bg-[#241712] hover:bg-[#D63426] text-white text-xs uppercase tracking-widest font-black rounded-full transition-all duration-300 shadow-md flex items-center space-x-2.5 cursor-pointer group"
                >
                  <span>Learn About TROSE</span>
                  <ArrowRight className="w-4 h-4 text-[#FAF6F0] group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onShopCoffee}
                  className="px-7 py-3.5 bg-white hover:bg-[#241712] hover:text-white text-[#241712] text-xs uppercase tracking-widest font-black rounded-full border border-[#E8DFD5] transition-all cursor-pointer shadow-xs"
                >
                  <span>Shop Roasts</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: WHY TROSE (4 Trust Cards) */}
      <section id="why-trose-section" className="py-16 sm:py-24 bg-white border-b border-[#E8DFD5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          {/* Section Header */}
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-[#D63426] font-bold">
              The TROSE Standard
            </span>
            
            <h2 className="text-3xl sm:text-5xl font-black text-[#241712] uppercase tracking-tight">
              Why TROSE
            </h2>

            <p className="text-xs sm:text-sm text-[#7A6C63] font-normal leading-relaxed">
              Built on transparency, roasting precision, and a genuine obsession with better coffee.
            </p>
          </div>

          {/* 4 Trust Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Premium Quality */}
            <div 
              id="trust-card-premium-quality"
              className="p-6 sm:p-7 rounded-3xl bg-[#FAF6F0] border border-[#E8DFD5] hover:border-[#D63426] transition-all duration-300 space-y-4 group shadow-xs"
            >
              <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-[#D63426] flex items-center justify-center text-[#D63426] group-hover:text-white transition-colors duration-300 shadow-xs">
                <Award className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#241712] uppercase">
                  Premium Quality
                </h3>
                <p className="text-xs text-[#7A6C63] leading-relaxed font-normal">
                  Top 1% specialty-grade micro-lots, small-batch roasted and nitrogen-sealed for peak aromatics.
                </p>
              </div>
            </div>

            {/* 2. Secure Checkout */}
            <div 
              id="trust-card-secure-checkout"
              className="p-6 sm:p-7 rounded-3xl bg-[#FAF6F0] border border-[#E8DFD5] hover:border-[#D63426] transition-all duration-300 space-y-4 group shadow-xs"
            >
              <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-[#D63426] flex items-center justify-center text-[#241712] group-hover:text-white transition-colors duration-300 shadow-xs">
                <Lock className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#241712] uppercase">
                  Secure Checkout
                </h3>
                <p className="text-xs text-[#7A6C63] leading-relaxed font-normal">
                  Bank-grade 256-bit encrypted checkout with Apple Pay, Google Pay, Visa, Mastercard, and Shop Pay.
                </p>
              </div>
            </div>

            {/* 3. Worldwide Shipping */}
            <div 
              id="trust-card-worldwide-shipping"
              className="p-6 sm:p-7 rounded-3xl bg-[#FAF6F0] border border-[#E8DFD5] hover:border-[#D63426] transition-all duration-300 space-y-4 group shadow-xs"
            >
              <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-[#D63426] flex items-center justify-center text-[#E65F38] group-hover:text-white transition-colors duration-300 shadow-xs">
                <Globe className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#241712] uppercase">
                  Worldwide Shipping
                </h3>
                <p className="text-xs text-[#7A6C63] leading-relaxed font-normal">
                  Direct express shipping from our roastery in recyclable, one-way valved degassing pouches.
                </p>
              </div>
            </div>

            {/* 4. Customer Support */}
            <div 
              id="trust-card-customer-support"
              className="p-6 sm:p-7 rounded-3xl bg-[#FAF6F0] border border-[#E8DFD5] hover:border-[#D63426] transition-all duration-300 space-y-4 group shadow-xs"
            >
              <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-[#D63426] flex items-center justify-center text-[#657953] group-hover:text-white transition-colors duration-300 shadow-xs">
                <Headphones className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#241712] uppercase">
                  Customer Support
                </h3>
                <p className="text-xs text-[#7A6C63] leading-relaxed font-normal">
                  Real coffee professionals ready to help with recipe dial-ins, brew methods, and equipment setup.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

