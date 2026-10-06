import React from 'react';
import { ArrowRight, Leaf, Flame, Sparkles, Heart } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { HeroAdvertisingComposition } from './hero/HeroAdvertisingComposition';

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
      className="relative bg-[#F4EFEA] overflow-hidden pt-3.5 min-[360px]:pt-4 sm:pt-10 lg:pt-14 pb-5 min-[360px]:pb-6 sm:pb-12 lg:pb-16 border-b border-[#0E0C0B]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        
        {/* ==================================================== */}
        {/* DESKTOP HERO LAYOUT (lg:grid - LOCKED & UNCHANGED) */}
        {/* ==================================================== */}
        <div className="hidden lg:grid grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          
          {/* LEFT COLUMN: Typography, Supporting Copy, Dual CTAs, Value Badges (6 cols) */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-left z-20">
            
            {/* Small Kicker */}
            <div className="text-xs sm:text-sm font-sans font-semibold tracking-[0.25em] text-[#0E0C0B] uppercase">
              RISE. REFRESH. REIGN.
            </div>

            {/* Exact Bold Grotesk Headline */}
            <div className="space-y-1 font-display">
              <h1 className="text-6xl md:text-7xl lg:text-[72px] xl:text-[80px] font-black text-[#0E0C0B] tracking-[-0.03em] leading-[0.92] uppercase">
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

            {/* Dual Action Buttons: FIND YOUR TROSE + SHOP COFFEE → */}
            <div className="pt-2 flex items-center space-x-4">
              <button
                id="hero-quiz-cta"
                onClick={onOpenQuiz}
                className="px-7 xl:px-8 py-3.5 xl:py-4 bg-[#0E0C0B] hover:bg-[#221B16] text-white text-xs sm:text-sm uppercase tracking-[0.18em] font-sans font-bold transition-all duration-200 inline-flex items-center justify-center space-x-3 cursor-pointer shadow-sm active:translate-y-0.5"
              >
                <span>FIND YOUR TROSE</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                id="hero-shop-coffee-cta"
                onClick={() => onShopClick('coffee')}
                className="px-7 xl:px-8 py-3.5 xl:py-4 border-2 border-[#0E0C0B] hover:bg-[#0E0C0B] hover:text-white text-[#0E0C0B] text-xs sm:text-sm uppercase tracking-[0.18em] font-sans font-bold transition-all duration-200 inline-flex items-center justify-center space-x-2 cursor-pointer active:translate-y-0.5"
              >
                <span>SHOP COFFEE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Circular Value Icons */}
            <div className="pt-6 sm:pt-8 grid grid-cols-4 gap-3 sm:gap-4 max-w-lg">
              
              {/* Badge 1 */}
              <div className="flex flex-col items-center text-center space-y-1.5 group">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#0E0C0B] bg-[#F4EFEA] flex items-center justify-center text-[#0E0C0B] group-hover:border-[#C88E38] transition-colors">
                  <Leaf className="w-5 h-5 stroke-[1.7] text-[#0E0C0B]" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-sans font-bold tracking-wider uppercase text-[#0E0C0B] leading-tight">
                  <span>PREMIUM</span><br />
                  <span>BEANS</span>
                </div>
              </div>

              {/* Badge 2 */}
              <div className="flex flex-col items-center text-center space-y-1.5 group">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#0E0C0B] bg-[#F4EFEA] flex items-center justify-center text-[#0E0C0B] group-hover:border-[#C88E38] transition-colors">
                  <Flame className="w-5 h-5 stroke-[1.7] text-[#0E0C0B]" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-sans font-bold tracking-wider uppercase text-[#0E0C0B] leading-tight">
                  <span>EXPERTLY</span><br />
                  <span>ROASTED</span>
                </div>
              </div>

              {/* Badge 3 */}
              <div className="flex flex-col items-center text-center space-y-1.5 group">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#0E0C0B] bg-[#F4EFEA] flex items-center justify-center text-[#0E0C0B] group-hover:border-[#C88E38] transition-colors">
                  <Sparkles className="w-5 h-5 stroke-[1.7] text-[#0E0C0B]" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-sans font-bold tracking-wider uppercase text-[#0E0C0B] leading-tight">
                  <span>FRESH</span><br />
                  <span>& PURE</span>
                </div>
              </div>

              {/* Badge 4 */}
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

          {/* RIGHT COLUMN: Polished Bauhaus Hero Composition (6 cols) */}
          <div className="lg:col-span-6 relative flex items-center justify-center w-full">
            <HeroAdvertisingComposition
              onPouchClick={(variant) => {
                onShopClick('coffee');
              }}
            />
          </div>

        </div>

        {/* ==================================================== */}
        {/* COMPACT MOBILE HERO LAYOUT (lg:hidden) */}
        {/* P7.5D Requirements: */}
        {/* 1. Compressed headline area (reduced spacing & font scale) */}
        {/* 2. Compact 25-30% reduced product composition */}
        {/* 3. Supporting copy + SHOP COFFEE → & FIND YOUR TROSE → within 1-1.5 viewports */}
        {/* ==================================================== */}
        <div className="lg:hidden flex flex-col text-left space-y-2.5">
          
          {/* Compressed Kicker */}
          <div className="text-[10px] min-[360px]:text-[11px] font-sans font-semibold tracking-[0.22em] text-[#0E0C0B] uppercase">
            RISE. REFRESH. REIGN.
          </div>

          {/* 1. Compressed Mobile Headline */}
          <div className="space-y-0.5 font-display">
            <h1 className="text-[26px] min-[360px]:text-[28px] min-[390px]:text-[30px] font-black text-[#0E0C0B] tracking-[-0.03em] leading-[0.93] uppercase">
              <span className="block">THERE’S A</span>
              <span className="block">TROSE COFFEE</span>
              <span className="block">IN EVERY</span>
              <span className="block">VERSION OF</span>
              <span className="block text-[#C88E38]">YOU.</span>
            </h1>
          </div>

          {/* 2. Compact Product Composition (reduced 25-30%) */}
          <div className="w-full flex justify-center py-0.5">
            <HeroAdvertisingComposition
              isMobileCompact={true}
              onPouchClick={(variant) => {
                onShopClick('coffee');
              }}
            />
          </div>

          {/* 3. Short Supporting Copy */}
          <div className="text-xs min-[360px]:text-[13px] text-[#0E0C0B]/85 font-sans font-medium leading-snug">
            <p>Different moods. Different moments. Same exceptional coffee.</p>
          </div>

          {/* 4. Commerce CTAs: SHOP COFFEE → & FIND YOUR TROSE → */}
          <div className="space-y-2 pt-0.5 w-full">
            {/* Primary Action on Mobile: SHOP COFFEE → */}
            <button
              id="mobile-hero-shop-coffee-cta"
              onClick={() => onShopClick('coffee')}
              className="w-full py-3 bg-[#0E0C0B] active:bg-[#221B16] text-white text-xs uppercase tracking-[0.18em] font-sans font-bold flex items-center justify-center space-x-2 shadow-sm active:translate-y-0.5 cursor-pointer"
            >
              <span>SHOP COFFEE</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            {/* Secondary Action on Mobile: FIND YOUR TROSE → */}
            <button
              id="mobile-hero-quiz-cta"
              onClick={onOpenQuiz}
              className="w-full py-2.5 border border-[#0E0C0B] bg-transparent text-[#0E0C0B] text-xs uppercase tracking-[0.18em] font-sans font-bold flex items-center justify-center space-x-2 active:bg-[#0E0C0B]/5 active:translate-y-0.5 cursor-pointer"
            >
              <span>FIND YOUR TROSE</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C88E38]" />
            </button>
          </div>

          {/* Value Icons (Subtle compact strip beneath CTAs) */}
          <div className="pt-3 grid grid-cols-4 gap-1.5 border-t border-[#0E0C0B]/10">
            {/* Badge 1 */}
            <div className="flex flex-col items-center text-center space-y-1">
              <div className="w-8 h-8 rounded-full border border-[#0E0C0B] bg-[#F4EFEA] flex items-center justify-center text-[#0E0C0B]">
                <Leaf className="w-3.5 h-3.5 stroke-[1.7] text-[#0E0C0B]" />
              </div>
              <div className="text-[8px] font-sans font-bold tracking-wider uppercase text-[#0E0C0B] leading-tight">
                <span>PREMIUM</span><br />
                <span>BEANS</span>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex flex-col items-center text-center space-y-1">
              <div className="w-8 h-8 rounded-full border border-[#0E0C0B] bg-[#F4EFEA] flex items-center justify-center text-[#0E0C0B]">
                <Flame className="w-3.5 h-3.5 stroke-[1.7] text-[#0E0C0B]" />
              </div>
              <div className="text-[8px] font-sans font-bold tracking-wider uppercase text-[#0E0C0B] leading-tight">
                <span>EXPERTLY</span><br />
                <span>ROASTED</span>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex flex-col items-center text-center space-y-1">
              <div className="w-8 h-8 rounded-full border border-[#0E0C0B] bg-[#F4EFEA] flex items-center justify-center text-[#0E0C0B]">
                <Sparkles className="w-3.5 h-3.5 stroke-[1.7] text-[#0E0C0B]" />
              </div>
              <div className="text-[8px] font-sans font-bold tracking-wider uppercase text-[#0E0C0B] leading-tight">
                <span>FRESH</span><br />
                <span>& PURE</span>
              </div>
            </div>

            {/* Badge 4 */}
            <div className="flex flex-col items-center text-center space-y-1">
              <div className="w-8 h-8 rounded-full border border-[#0E0C0B] bg-[#F4EFEA] flex items-center justify-center text-[#0E0C0B]">
                <Heart className="w-3.5 h-3.5 stroke-[1.7] text-[#0E0C0B]" />
              </div>
              <div className="text-[8px] font-sans font-bold tracking-wider uppercase text-[#0E0C0B] leading-tight">
                <span>MADE</span><br />
                <span>WITH CARE</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
