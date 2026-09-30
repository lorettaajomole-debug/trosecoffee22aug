import React from 'react';
import { ArrowRight, Leaf, Shield, Sun, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface OrganicSpotlightProps {
  onShopOrganic: () => void;
  onQuickView: (product: Product) => void;
  organicProducts: Product[];
}

export const OrganicSpotlight: React.FC<OrganicSpotlightProps> = ({
  onShopOrganic,
  onQuickView,
  organicProducts
}) => {
  const featuredOrganic = organicProducts[0];

  return (
    <section id="organic-spotlight-section" className="py-16 sm:py-24 bg-[#F7F3EB] text-[#12100E] relative overflow-hidden border-b border-[#12100E]/10">
      
      {/* Bauhaus Architectural Accents: Soft Cream & Subtle Green Field (3%) */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-bl-[140px] bg-[#1C3328]/10 pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-60 rounded-tr-full bg-[#D4B896]/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        
        {/* Section Header: Quieter Editorial Secondary */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6 border-b border-[#12100E]/10 pb-6">
          <div className="space-y-2 max-w-xl text-left font-sans">
            <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#1C3328] font-semibold">
              <span className="w-5 h-[1.5px] bg-[#1C3328]" />
              <span>ORGANIC COFFEE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-editorial font-semibold text-[#12100E] tracking-tight uppercase leading-[1.05]">
              Pure Terroir. <br />
              <span className="font-serif font-normal italic lowercase text-[#5C151E]">
                nurtured by nature.
              </span>
            </h2>
          </div>

          <button
            onClick={onShopOrganic}
            className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-[0.16em] font-semibold text-[#12100E] hover:text-[#5C151E] transition-colors cursor-pointer group self-start md:self-end border-b border-[#12100E]/30 pb-0.5 hover:border-[#5C151E]"
          >
            <span>EXPLORE ORGANIC SELECTIONS</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#CCA347] group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Brand Story & Values (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left font-sans">
            <p className="text-sm sm:text-base text-[#12100E]/80 leading-relaxed font-normal max-w-xl">
              Organic cultivation honors natural agricultural cycles and living soil. Our organic coffee selections deliver clean, vibrant cups with natural sweetness and smooth finish.
            </p>

            {/* 4 Bauhaus Structural Blocks (Zero pills, clean typography) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              <div className="p-4 border border-[#12100E]/12 bg-[#FAF6F0] space-y-1 text-left">
                <div className="flex items-center space-x-2 text-[#1C3328]">
                  <Leaf className="w-4 h-4 text-[#1C3328]" />
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#12100E]">Organic Cultivation</h4>
                </div>
                <p className="text-xs text-[#12100E]/70 leading-relaxed">
                  Beans certified organic, honoring both the grower and the drinker.
                </p>
              </div>

              <div className="p-4 border border-[#12100E]/12 bg-[#FAF6F0] space-y-1 text-left">
                <div className="flex items-center space-x-2 text-[#CCA347]">
                  <Sun className="w-4 h-4 text-[#CCA347]" />
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#12100E]">Shade Grown</h4>
                </div>
                <p className="text-xs text-[#12100E]/70 leading-relaxed">
                  Slow-maturing coffee cherries under natural tree canopies for developed sugars.
                </p>
              </div>

              <div className="p-4 border border-[#12100E]/12 bg-[#FAF6F0] space-y-1 text-left">
                <div className="flex items-center space-x-2 text-[#5C151E]">
                  <Shield className="w-4 h-4 text-[#5C151E]" />
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#12100E]">Clean Character</h4>
                </div>
                <p className="text-xs text-[#12100E]/70 leading-relaxed">
                  Carefully preserved origin profile with clean, sweet cup clarity.
                </p>
              </div>

              <div className="p-4 border border-[#12100E]/12 bg-[#FAF6F0] space-y-1 text-left">
                <div className="flex items-center space-x-2 text-[#CCA347]">
                  <Sparkles className="w-4 h-4 text-[#CCA347]" />
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#12100E]">Balanced Roast</h4>
                </div>
                <p className="text-xs text-[#12100E]/70 leading-relaxed">
                  Calibrated to highlight origin notes without excessive bitterness.
                </p>
              </div>

            </div>

            {/* Sourcing Callout: Functional & Neutral */}
            <div className="pt-3 border-t border-[#12100E]/10 flex items-center space-x-3 text-xs uppercase tracking-[0.16em] text-[#12100E]/60">
              <span>CERTIFIED ORGANIC</span>
              <span>·</span>
              <span>BALANCED PROFILES</span>
              <span>·</span>
              <span className="text-[#1C3328] font-semibold">TROSE COFFEE</span>
            </div>

          </div>

          {/* Right Column: Featured Organic Coffee Spotlight Card (5 cols) */}
          <div className="lg:col-span-5">
            {featuredOrganic ? (
              <div 
                onClick={() => onQuickView(featuredOrganic)}
                className="bg-[#FAF6F0] p-6 sm:p-7 text-[#12100E] border border-[#12100E] shadow-xl space-y-4 cursor-pointer group text-left transition-all hover:shadow-2xl"
              >
                {/* Packaging Header Bar */}
                <div className="flex items-center justify-between border-b border-[#12100E]/15 pb-3 text-xs font-sans">
                  <span className="bg-[#1C3328] text-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                    ORGANIC SPOTLIGHT
                  </span>
                  <span className="font-bold text-base text-[#12100E]">
                    ${featuredOrganic.price.toFixed(2)}
                  </span>
                </div>

                {/* Product Photo Container */}
                <div className="aspect-[4/3] bg-[#E8D8C3] border border-[#12100E]/15 overflow-hidden relative flex items-center justify-center p-4">
                  <img
                    src={featuredOrganic.images[0]}
                    alt={featuredOrganic.name}
                    className="w-full h-full object-contain group-hover:scale-104 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 bg-white/95 px-2 py-0.5 text-[9px] font-sans font-semibold uppercase text-[#1C3328] border border-[#1C3328]/30">
                    CERTIFIED ORGANIC
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-semibold uppercase tracking-tight text-[#12100E] group-hover:text-[#5C151E] transition-colors">
                    {featuredOrganic.name}
                  </h3>
                  <p className="text-xs text-[#12100E]/75 line-clamp-2 font-sans">
                    {featuredOrganic.description}
                  </p>
                </div>

                {/* Tasting Notes */}
                {featuredOrganic.tastingNotes && featuredOrganic.tastingNotes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {featuredOrganic.tastingNotes.slice(0, 3).map((note) => (
                      <span
                        key={note}
                        className="px-2 py-0.5 bg-[#E8D8C3] text-[#12100E] text-[10px] font-sans uppercase tracking-wider font-semibold"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-[#12100E]/10 text-xs font-sans">
                  <span className="uppercase tracking-wider text-[#12100E]/60 text-[11px]">
                    {featuredOrganic.origin || 'Organic Roast'}
                  </span>
                  <span className="font-semibold text-[#1C3328] group-hover:translate-x-1 transition-transform inline-flex items-center">
                    VIEW DETAILS →
                  </span>
                </div>
              </div>
            ) : null}
          </div>

        </div>

      </div>
    </section>
  );
};
