import React from 'react';
import { ArrowRight, Leaf, Flame, Sparkles, Heart } from 'lucide-react';
import { Product, ProductCategory } from '../types';

interface HeroProps {
  onShopClick: (category?: ProductCategory) => void;
  onDiscoverClick: () => void;
  onOpenQuiz: () => void;
  featuredProduct?: Product;
}

export const Hero: React.FC<HeroProps> = ({
  onShopClick,
  onDiscoverClick,
  onOpenQuiz,
  featuredProduct
}) => {
  return (
    <section
      id="homepage-hero-section"
      className="relative bg-[#F4EFEA] overflow-hidden pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 border-b border-[#0E0C0B]/10"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Main 2-Column Grid matching Master Reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT COLUMN: Bold Typography, Statement & Value Badges (6 cols) */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-left z-20">
            
            {/* Small Kicker */}
            <div className="text-xs sm:text-sm font-sans font-semibold tracking-[0.25em] text-[#0E0C0B] uppercase">
              RISE. REFRESH. REIGN.
            </div>

            {/* Exact Bold Grotesk Headline matching Reference Line Breaks */}
            <div className="space-y-1 font-display">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[72px] xl:text-[82px] font-black text-[#0E0C0B] tracking-[-0.03em] leading-[0.92] uppercase">
                <span className="block">THERE’S A</span>
                <span className="block">TROSE COFFEE</span>
                <span className="block">IN EVERY</span>
                <span className="block">VERSION OF</span>
                <span className="block text-[#C88E38]">YOU.</span>
              </h1>
            </div>

            {/* Supporting Copy */}
            <div className="space-y-1 text-base sm:text-lg text-[#0E0C0B]/85 font-sans font-medium leading-snug">
              <p>Different moods. Different moments.</p>
              <p>Same exceptional coffee.</p>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                id="hero-quiz-cta"
                onClick={onOpenQuiz}
                className="px-8 py-4 bg-[#0E0C0B] hover:bg-[#221B16] text-white text-xs sm:text-sm uppercase tracking-[0.18em] font-sans font-bold transition-all duration-200 inline-flex items-center justify-center space-x-3 cursor-pointer shadow-md active:translate-y-0.5"
              >
                <span>FIND YOUR TROSE</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* 4 Circular Value Icons matching Reference */}
            <div className="pt-6 sm:pt-8 grid grid-cols-4 gap-3 sm:gap-4 max-w-lg">
              
              {/* Badge 1: Premium Beans */}
              <div className="flex flex-col items-center text-center space-y-1.5 group">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#0E0C0B] bg-[#F4EFEA] flex items-center justify-center text-[#0E0C0B] group-hover:border-[#C88E38] transition-colors">
                  <Leaf className="w-5 h-5 stroke-[1.7] text-[#0E0C0B]" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-sans font-bold tracking-wider uppercase text-[#0E0C0B] leading-tight">
                  <span>PREMIUM</span><br />
                  <span>BEANS</span>
                </div>
              </div>

              {/* Badge 2: Expertly Roasted */}
              <div className="flex flex-col items-center text-center space-y-1.5 group">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#0E0C0B] bg-[#F4EFEA] flex items-center justify-center text-[#0E0C0B] group-hover:border-[#C88E38] transition-colors">
                  <Flame className="w-5 h-5 stroke-[1.7] text-[#0E0C0B]" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-sans font-bold tracking-wider uppercase text-[#0E0C0B] leading-tight">
                  <span>EXPERTLY</span><br />
                  <span>ROASTED</span>
                </div>
              </div>

              {/* Badge 3: Fresh & Pure */}
              <div className="flex flex-col items-center text-center space-y-1.5 group">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#0E0C0B] bg-[#F4EFEA] flex items-center justify-center text-[#0E0C0B] group-hover:border-[#C88E38] transition-colors">
                  <Sparkles className="w-5 h-5 stroke-[1.7] text-[#0E0C0B]" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-sans font-bold tracking-wider uppercase text-[#0E0C0B] leading-tight">
                  <span>FRESH</span><br />
                  <span>& PURE</span>
                </div>
              </div>

              {/* Badge 4: Made With Care */}
              <div className="flex flex-col items-center text-center space-y-1.5 group">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#0E0C0B] bg-[#F4EFEA] flex items-center justify-center text-[#0E0C0B] group-hover:border-[#C88E38] transition-colors">
                  <Heart className="w-5 h-5 stroke-[1.7] text-[#0E0C0B]" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-sans font-bold tracking-wider uppercase text-[#0E0C0B] leading-tight">
                  <span>MADE</span><br />
                  <span>WITH CARE</span>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Layered Bauhaus Editorial Composition (6 cols) */}
          <div className="lg:col-span-6 relative mt-8 lg:mt-0">
            <div className="relative w-full max-w-[540px] mx-auto h-[480px] sm:h-[560px] lg:h-[620px]">
              
              {/* Layer 1: Large Mustard/Gold Circle in Background */}
              <div className="absolute top-2 left-6 sm:left-12 w-[280px] sm:w-[340px] lg:w-[380px] h-[280px] sm:h-[340px] lg:h-[380px] rounded-full bg-[#C88E38] -z-10 shadow-sm" />

              {/* Layer 2: Burnt-Red / Terracotta Circle overlapping */}
              <div className="absolute top-8 right-4 sm:right-10 w-[200px] sm:w-[260px] lg:w-[300px] h-[200px] sm:h-[260px] lg:h-[300px] rounded-full bg-[#8A2B2B] -z-10 opacity-95" />

              {/* Layer 3: Dark Marble / Architectural Texture Field on Far Right */}
              <div className="absolute top-0 right-0 w-24 sm:w-28 h-full bg-[#12100E] -z-20 hidden sm:block border-l border-[#0E0C0B]" />

              {/* Layer 4: Portrait Photography (Black woman enjoying coffee in black turtleneck) */}
              <div className="absolute top-6 left-10 sm:left-16 w-[260px] sm:w-[320px] lg:w-[360px] h-[320px] sm:h-[390px] lg:h-[440px] rounded-t-[140px] overflow-hidden shadow-lg border border-[#0E0C0B]/10 z-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85"
                  alt="An elegant woman savoring TROSE coffee in warm golden light"
                  className="w-full h-full object-cover object-top hover:scale-103 transition-transform duration-700"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                
                {/* Ceramic Mug Overlay with Official TROSE Seal */}
                <div className="absolute bottom-6 left-6 z-10 flex items-center space-x-2 bg-[#0E0C0B]/90 backdrop-blur-xs px-3 py-1.5 border border-[#C88E38]">
                  <img
                    src="/assets/trose-logo.png"
                    alt="TROSE Mug"
                    className="w-5 h-5 object-contain"
                  />
                  <span className="text-[10px] font-sans font-bold tracking-widest text-[#F4EFEA] uppercase">
                    TROSE COFFEE
                  </span>
                </div>
              </div>

              {/* Layer 5: Kraft Paper Coffee Packaging Pouch overlapping in foreground */}
              <div 
                onClick={() => onShopClick('coffee')}
                className="absolute -bottom-2 right-2 sm:right-6 lg:right-4 w-[210px] sm:w-[260px] lg:w-[290px] z-20 cursor-pointer group transition-transform duration-300 hover:scale-[1.02]"
              >
                {/* Kraft Bag Realistic Card */}
                <div className="relative bg-[#D4B896] text-[#0E0C0B] p-4 sm:p-5 border border-[#0E0C0B] shadow-2xl space-y-2.5">
                  
                  {/* Top Seal & Crown */}
                  <div className="flex items-center justify-between border-b border-[#0E0C0B]/30 pb-2">
                    <span className="text-[8px] font-sans font-bold uppercase tracking-widest">
                      AUTHENTIC SPECIALTY
                    </span>
                    <span className="w-2.5 h-2.5 bg-[#8A2B2B] rounded-full" />
                  </div>

                  {/* Official Circular TROSE Logo Seal */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto my-1 flex items-center justify-center">
                    <img
                      src="/assets/trose-logo.png"
                      alt="Official TROSE Brand Seal"
                      className="w-full h-full object-contain drop-shadow-md"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (!target.src.endsWith('.svg')) target.src = '/assets/trose-logo.svg';
                      }}
                    />
                  </div>

                  {/* Technical Packaging Grid Label matching reference */}
                  <div className="bg-[#F4EFEA] border border-[#0E0C0B] p-2.5 space-y-1.5 text-left font-sans">
                    <div className="flex items-center justify-between text-[8px] font-bold tracking-wider border-b border-[#0E0C0B]/20 pb-1">
                      <span className="bg-[#0E0C0B] text-white px-1.5 py-0.5">ORIGIN</span>
                      <span className="uppercase text-[#0E0C0B]">
                        {featuredProduct?.origin ? featuredProduct.origin.slice(0, 20) : 'Single Origin Reserve'}
                      </span>
                    </div>

                    <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-tight text-[#0E0C0B] leading-tight">
                      {featuredProduct?.name || 'FRESH ROASTED COFFEE'}
                    </h4>

                    <div className="flex items-center justify-between text-[9px] font-medium text-[#0E0C0B]/80 pt-0.5 border-t border-[#0E0C0B]/10">
                      <span>ROAST: MEDIUM DARK</span>
                      <span className="font-bold text-[#C88E38]">
                        ${(featuredProduct?.price || 24.5).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Scattered Beans Decorative Footer Base */}
                  <div className="flex items-center justify-between text-[8px] font-sans uppercase tracking-widest text-[#0E0C0B]/70 pt-1">
                    <span>12 OZ (340G)</span>
                    <span className="text-[#8A2B2B] font-bold">ROASTED WITH PURPOSE</span>
                  </div>

                </div>
              </div>

              {/* Layer 6: Side Text Statements on Far Right Edge matching reference */}
              {/* Upper Text: MORE THAN COFFEE */}
              <div className="absolute top-4 -right-4 sm:-right-8 lg:-right-12 z-30 hidden sm:block text-right">
                <div className="text-[11px] font-display font-extrabold uppercase tracking-[0.2em] text-[#0E0C0B] leading-tight">
                  <span className="block">MORE</span>
                  <span className="block">THAN</span>
                  <span className="block">COFFEE.</span>
                </div>
              </div>

              {/* Lower Text Block: GOOD COFFEE / BRIGHTER HUMANS with gold line */}
              <div className="absolute bottom-24 -right-4 sm:-right-8 lg:-right-12 z-30 hidden sm:block text-right">
                <div className="text-[11px] font-sans font-bold uppercase tracking-[0.18em] text-[#0E0C0B] leading-tight">
                  <span className="block">GOOD</span>
                  <span className="block">COFFEE</span>
                  <span className="block">BRIGHTER</span>
                  <span className="block">HUMANS</span>
                </div>
                <div className="w-8 h-[2px] bg-[#C88E38] mt-1 ml-auto" />
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
