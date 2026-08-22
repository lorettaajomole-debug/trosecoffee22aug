import React from 'react';
import { ShieldCheck, Leaf, Sun, HeartHandshake, ArrowRight, CheckCircle2, Sprout } from 'lucide-react';
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
    <section id="organic-spotlight-section" className="py-16 sm:py-24 bg-[#1F1612] text-[#FAF6F0] relative overflow-hidden border-b border-[#2D1E18]">
      
      {/* Decorative Soft Olive Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#657953]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Fresh Organic Ethos */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#657953]/25 border border-[#657953]/40 text-[#EBF1E6]">
              <Sprout className="w-3.5 h-3.5 text-[#657953]" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                100% Bio Organic & Direct Trade
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-[0.95]">
              Pure High Mountain Soil. <br />
              <span className="font-serif font-normal italic lowercase text-[#E65F38]">zero chemical compromise.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#FAF6F0]/80 leading-relaxed font-normal">
              Grown under native cloud forest shade in high Andean and Ethiopian micro-climates. No synthetic pesticides, herbicides, or artificial enhancers — just clean, vibrant origin flavor.
            </p>

            {/* 4 Clean Value Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center space-x-2 text-[#657953]">
                  <ShieldCheck className="w-4 h-4 text-[#657953]" />
                  <h4 className="text-xs font-bold text-white uppercase">USDA Bio Certified</h4>
                </div>
                <p className="text-[11px] text-[#FAF6F0]/70">Purity tested with zero residue or synthetic inputs.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center space-x-2 text-[#657953]">
                  <Sun className="w-4 h-4 text-[#E65F38]" />
                  <h4 className="text-xs font-bold text-white uppercase">Shade Grown at 1,800m</h4>
                </div>
                <p className="text-[11px] text-[#FAF6F0]/70">Slow-ripened cherries with higher natural sweetness.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center space-x-2 text-[#657953]">
                  <HeartHandshake className="w-4 h-4 text-[#D63426]" />
                  <h4 className="text-xs font-bold text-white uppercase">Direct Trade Premiums</h4>
                </div>
                <p className="text-[11px] text-[#FAF6F0]/70">Paying over 300% above market prices directly to smallholders.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center space-x-2 text-[#657953]">
                  <CheckCircle2 className="w-4 h-4 text-[#657953]" />
                  <h4 className="text-xs font-bold text-white uppercase">Spring-Water Washed</h4>
                </div>
                <p className="text-[11px] text-[#FAF6F0]/70">Clean mountain stream washing and solar raised-bed drying.</p>
              </div>

            </div>

            {/* CTA */}
            <div className="pt-2">
              <button
                id="explore-organic-collection-btn"
                onClick={onShopOrganic}
                className="px-8 py-4 bg-[#D63426] hover:bg-[#BF2A1D] text-white text-xs uppercase tracking-widest font-black rounded-full transition-all duration-300 flex items-center space-x-2 cursor-pointer shadow-lg hover:shadow-xl group"
              >
                <span>Shop Organic Coffee</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          {/* Right Column: Featured Organic Lot Card */}
          <div className="lg:col-span-6">
            {featuredOrganic && (
              <div className="relative rounded-3xl overflow-hidden bg-[#2D1E18] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6">
                
                {/* Visual Header */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black/40">
                  <img
                    src={featuredOrganic.images[0]}
                    alt={featuredOrganic.name}
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 opacity-90"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#1F1612]/90 border border-[#657953]/40 px-3 py-1 rounded-full text-[#EBF1E6] text-[10px] font-mono font-bold uppercase tracking-wider">
                    Bio Harvest
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#1F1612]/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs font-mono font-bold border border-white/10">
                    ${featuredOrganic.price.toFixed(2)}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#E65F38] font-mono font-bold uppercase">
                    <span>{featuredOrganic.origin}</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded-full text-white text-[10px]">100% Organic</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    {featuredOrganic.name}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 py-1">
                    {featuredOrganic.tastingNotes?.map((note) => (
                      <span
                        key={note}
                        className="px-3 py-1 rounded-full bg-white/10 text-[11px] text-[#FAF6F0] font-medium"
                      >
                        {note}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-[#FAF6F0]/70 leading-relaxed font-normal">
                    {featuredOrganic.description}
                  </p>
                </div>

                {/* Card Button */}
                <div className="pt-2">
                  <button
                    id="spotlight-quickview-btn"
                    onClick={() => onQuickView(featuredOrganic)}
                    className="w-full py-3.5 bg-white hover:bg-[#FAF6F0] text-[#1F1612] text-xs uppercase tracking-widest font-black rounded-full transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                  >
                    <span>View Sourcing & Notes</span>
                    <ArrowRight className="w-4 h-4 text-[#D63426]" />
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};


