import React from 'react';
import { ArrowRight } from 'lucide-react';

interface BrandStoryProps {
  onExploreStory: () => void;
  onShopCoffee: () => void;
}

export const BrandStory: React.FC<BrandStoryProps> = ({ onExploreStory, onShopCoffee }) => {
  return (
    <div id="brand-story-and-culture-root">
      
      {/* ==================================================== */}
      {/* MOBILE: SHORT OUR STORY PREVIEW (lg:hidden) */}
      {/* Per P7.5B Requirement 6: Concise preview, not full story/impact */}
      {/* ==================================================== */}
      <section
        id="mobile-our-story-preview"
        className="lg:hidden py-10 px-5 bg-[#FAF6F0] border-b border-[#0E0C0B]/10 text-left"
      >
        <div className="max-w-md mx-auto space-y-3.5">
          <div className="flex items-center space-x-2 text-[10px] font-sans uppercase tracking-[0.2em] text-[#C88E38] font-bold">
            <span className="w-5 h-[1.5px] bg-[#C88E38]" />
            <span>THE TROSE ETHOS</span>
          </div>

          <h2 className="text-2xl font-display font-black text-[#0E0C0B] tracking-tight uppercase leading-tight">
            GOOD COFFEE.<br />
            <span className="text-[#C88E38]">BRIGHTER HUMANS.</span>
          </h2>

          <p className="text-sm text-[#0E0C0B]/80 font-sans leading-relaxed">
            Coffee is more than a morning habit—it is a shared ritual, a moment to reset, and a celebration of human craft. We calibrate every roast for sweetness, nuance, and clean energy.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={onExploreStory}
              className="py-3 px-5 bg-[#0E0C0B] text-white text-xs font-sans font-bold uppercase tracking-[0.16em] inline-flex items-center justify-center space-x-2 active:bg-[#221B16]"
            >
              <span>READ OUR FULL STORY</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C88E38]" />
            </button>

            <button
              onClick={onShopCoffee}
              className="py-3 px-5 border border-[#0E0C0B] text-[#0E0C0B] text-xs font-sans font-bold uppercase tracking-[0.16em] inline-flex items-center justify-center active:bg-[#0E0C0B]/5"
            >
              <span>EXPLORE ALL ROASTS →</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* DESKTOP: FULL EDITORIAL BRAND STORY COLLAGE (hidden lg:block) */}
      {/* ==================================================== */}
      <div className="hidden lg:block">
        <section
          id="brand-story-collage-section"
          className="py-16 sm:py-24 bg-[#FAF6F0] relative overflow-hidden border-b border-[#12100E]/10"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            
            {/* Top Editorial Kicker */}
            <div className="flex items-center space-x-3 text-xs font-sans uppercase tracking-[0.2em] text-[#C88E38] mb-8 font-semibold">
              <span className="w-6 h-[1.5px] bg-[#C88E38]" />
              <span>THE TROSE ETHOS</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* LEFT: Bauhaus Asymmetric Visual Storytelling Collage (6 cols) */}
              <div className="lg:col-span-6 relative">
                
                {/* Soft Bauhaus Geometry */}
                <div className="absolute -top-6 -left-6 w-56 h-56 rounded-full bg-[#D4B896]/30 -z-10" />
                <div className="absolute -bottom-6 -right-6 w-44 h-56 bg-[#8A2B2B]/15 rounded-t-[90px] -z-10" />

                <div className="grid grid-cols-12 gap-4 items-center">
                  
                  {/* Image 1: Main Coffee Pouring / Cup Ritual (7 cols) */}
                  <div className="col-span-7 relative border border-[#0E0C0B] bg-[#0E0C0B] shadow-md overflow-hidden aspect-[4/5] group">
                    <img
                      src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85"
                      alt="Precision brewed coffee ritual"
                      className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 opacity-90"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2.5 left-2.5 bg-[#F4EFEA] border border-[#0E0C0B] px-2.5 py-1 text-[9px] font-sans uppercase tracking-wider text-[#0E0C0B] font-semibold">
                      THE RITUAL
                    </div>
                  </div>

                  {/* Right Stack: Ripe Coffee Cherries & Origin Atmosphere (5 cols) */}
                  <div className="col-span-5 flex flex-col justify-between space-y-4">
                    {/* Photo 2: Coffee Cherries / Origin Landscape */}
                    <div className="relative border border-[#0E0C0B] bg-[#E8D8C3] overflow-hidden aspect-[4/3] group shadow-xs">
                      <img
                        src="https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=800&q=85"
                        alt="Ripe red coffee cherries on the branch"
                        className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 opacity-90"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 bg-[#F4EFEA]/90 px-2 py-0.5 text-[8px] font-sans font-semibold uppercase text-[#8A2B2B] border border-[#0E0C0B]/20">
                        ORIGIN
                      </div>
                    </div>

                    {/* Photo 3: Coffee Beans / Roasted Texture */}
                    <div className="relative border border-[#0E0C0B] bg-[#2A1D15] overflow-hidden aspect-[4/3] group shadow-xs">
                      <img
                        src="https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=85"
                        alt="Artisan roasted coffee beans"
                        className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 opacity-85"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Bauhaus Color Accent Block */}
                    <div className="bg-[#F4EFEA] text-[#0E0C0B] p-3.5 border border-[#0E0C0B] text-left">
                      <div className="text-[10px] font-sans uppercase tracking-[0.16em] text-[#C88E38] font-bold">
                        BALANCE
                      </div>
                      <div className="text-sm font-display font-black uppercase text-[#0E0C0B]">
                        BOLD & REFINED
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bauhaus Annotation Bar */}
                <div className="flex items-center justify-between text-[11px] font-sans uppercase tracking-[0.18em] text-[#0E0C0B]/60 mt-3 px-1">
                  <span>INTENTIONAL SENSORY EXPERIENCE</span>
                  <span className="text-[#8A2B2B] font-bold">TROSE COFFEE & MORE</span>
                </div>
              </div>

              {/* RIGHT: Visual Headline & Brand Narrative (6 cols) */}
              <div className="lg:col-span-6 space-y-6 text-left font-sans">
                
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-[#0E0C0B] tracking-tight uppercase leading-[0.96]">
                  <span className="block">GOOD COFFEE.</span>
                  <span className="block text-[#C88E38]">BRIGHTER HUMANS.</span>
                </h2>

                <p className="text-base sm:text-lg text-[#0E0C0B] font-normal leading-relaxed">
                  Coffee is more than an ordinary morning habit—it is a shared ritual, a moment to reset, and a celebration of human craft.
                </p>

                <div className="space-y-3.5 text-sm text-[#0E0C0B]/80 leading-relaxed font-normal">
                  <p>
                    At TROSE, we curate coffees that bring harmony between nuance and strength. Whether you seek the vibrant florals of a high-altitude single origin or the comforting richness of a smooth dark roast, each cup is an invitation to inhabit your day with purpose.
                  </p>
                  <p>
                    From the aroma blooming in your kitchen to the first sip, our coffees and wares are designed to inspire moments of stillness, focus, and joy.
                  </p>
                </div>

                {/* Brand Pillars */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#0E0C0B]/10">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#8A2B2B] font-bold">
                      <span className="w-1.5 h-1.5 bg-[#8A2B2B]" />
                      <span>BALANCE WITH BOLDNESS</span>
                    </div>
                    <p className="text-xs text-[#0E0C0B]/70 font-normal">
                      Roast profiles calibrated for depth, sweetness, and smooth finish.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#162820] font-bold">
                      <span className="w-1.5 h-1.5 bg-[#162820]" />
                      <span>MINDFUL RITUALS</span>
                    </div>
                    <p className="text-xs text-[#0E0C0B]/70 font-normal">
                      Transforming your everyday cup into a deliberate sensory pleasure.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    id="learn-about-trose-btn"
                    onClick={onExploreStory}
                    className="px-8 py-3.5 bg-[#0E0C0B] hover:bg-[#221B16] text-white text-xs uppercase tracking-[0.18em] font-sans font-bold transition-all flex items-center space-x-3 cursor-pointer group active:translate-y-0.5 border border-[#0E0C0B]"
                  >
                    <span>OUR PHILOSOPHY</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C88E38] group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={onShopCoffee}
                    className="px-7 py-3.5 bg-transparent hover:bg-[#F4EFEA] hover:text-[#8A2B2B] text-[#0E0C0B] text-xs uppercase tracking-[0.16em] font-sans font-bold border border-[#0E0C0B] transition-all cursor-pointer"
                  >
                    <span>EXPLORE ROASTS →</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* WHY TROSE VALUE PILLARS (Desktop only) */}
        <section id="why-trose-section" className="py-14 sm:py-20 bg-[#F4EFEA] border-b border-[#0E0C0B]/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left font-sans">
              
              <div className="p-6 bg-white border border-[#0E0C0B]/12 space-y-2.5 group hover:border-[#0E0C0B] transition-colors">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C88E38] font-bold block">
                  01 / SELECTION
                </span>
                <h3 className="text-base font-display font-black text-[#0E0C0B] uppercase">
                  Distinct Origins
                </h3>
                <p className="text-xs text-[#0E0C0B]/70 leading-relaxed font-normal">
                  Carefully selected coffees chosen for distinct terroir, natural sweetness, and vibrant aromatics.
                </p>
              </div>

              <div className="p-6 bg-white border border-[#0E0C0B]/12 space-y-2.5 group hover:border-[#0E0C0B] transition-colors">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8A2B2B] font-bold block">
                  02 / HARMONY
                </span>
                <h3 className="text-base font-display font-black text-[#0E0C0B] uppercase">
                  Balanced Roasting
                </h3>
                <p className="text-xs text-[#0E0C0B]/70 leading-relaxed font-normal">
                  Roast curves crafted to highlight origin complexity without excessive bitterness or acidity.
                </p>
              </div>

              <div className="p-6 bg-white border border-[#0E0C0B]/12 space-y-2.5 group hover:border-[#0E0C0B] transition-colors">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#162820] font-bold block">
                  03 / STEWARDSHIP
                </span>
                <h3 className="text-base font-display font-black text-[#0E0C0B] uppercase">
                  Organic Offerings
                </h3>
                <p className="text-xs text-[#0E0C0B]/70 leading-relaxed font-normal">
                  Certified organic selections cultivated with care for the earth, clean soil, and sustainable farming.
                </p>
              </div>

              <div className="p-6 bg-white border border-[#0E0C0B]/12 space-y-2.5 group hover:border-[#0E0C0B] transition-colors">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C88E38] font-bold block">
                  04 / LIFESTYLE
                </span>
                <h3 className="text-base font-display font-black text-[#0E0C0B] uppercase">
                  Complete Ritual
                </h3>
                <p className="text-xs text-[#0E0C0B]/70 leading-relaxed font-normal">
                  From precision espresso machines to ceramic mugs, everything you need for the perfect cup.
                </p>
              </div>

            </div>

          </div>
        </section>
      </div>

    </div>
  );
};
