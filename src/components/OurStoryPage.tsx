import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Globe, Heart, Sparkles, Compass } from 'lucide-react';

interface OurStoryPageProps {
  onBack: () => void;
  onShopCoffee: () => void;
}

export const OurStoryPage: React.FC<OurStoryPageProps> = ({ onBack, onShopCoffee }) => {
  return (
    <div id="our-story-page-view" className="bg-[#FAF7F2] min-h-screen text-[#0E0C0B] flex flex-col text-left">
      {/* Top Header / Breadcrumbs with Back Navigation */}
      <div className="border-b border-[#0E0C0B]/10 bg-[#F4EFEA] py-4 sm:py-6">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <button
            id="our-story-back-btn"
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#0E0C0B]/70 hover:text-[#0E0C0B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK</span>
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 sm:px-10 py-10 sm:py-16 space-y-16 sm:space-y-24">
        
        {/* ========================================================================= */}
        {/* 1. BALANCE WITH BOLDNESS                                                  */}
        {/* ========================================================================= */}
        <section id="story-balance-with-boldness" className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-sans font-bold tracking-[0.22em] text-[#C88E38] uppercase">
              <span className="w-5 h-[1.5px] bg-[#C88E38]" />
              <span>THE TROSE PHILOSOPHY</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-[#0E0C0B] tracking-tight uppercase leading-[0.96]">
              BALANCE WITH BOLDNESS
            </h1>
          </div>

          <p className="text-base sm:text-xl text-[#0E0C0B]/85 font-sans leading-relaxed max-w-3xl font-medium">
            When a coffee bean is in boiling water, the bean doesn’t soften or wilt; the bean doesn’t harden or stiffen. Moreover, as a coffee bean meets boiling water, the water begins to release the aroma and flavor of the beans. It changes the status of the water, as opposed to the boiling water altering its state. This very sentiment is the foundation of TROSE.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 font-sans">
            <div className="p-6 bg-white border border-[#0E0C0B]/15 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C88E38] font-bold block">
                01 · COURAGE
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0E0C0B]">
                Courage
              </h3>
              <p className="text-xs text-[#0E0C0B]/70 leading-relaxed">
                Embodying the timeless flower, the rose influences courage, beauty, and love in every cup we share.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#0E0C0B]/15 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A2B2B] font-bold block">
                02 · BEAUTY
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0E0C0B]">
                Beauty
              </h3>
              <p className="text-xs text-[#0E0C0B]/70 leading-relaxed">
                Our rich taste reminds you to be like the rose while also being fragrant and flavorful throughout life, like the coffee bean.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#0E0C0B]/15 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#162820] font-bold block">
                03 · LOVE
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0E0C0B]">
                Love
              </h3>
              <p className="text-xs text-[#0E0C0B]/70 leading-relaxed">
                Delight and comfort through quality ethical products—from coffee and coffee ware to tea, spices, snacks, and drinks machinery.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. THE TROSE STORY                                                        */}
        {/* ========================================================================= */}
        <section id="story-the-trose-story" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center border-t border-[#0E0C0B]/10 pt-12 sm:pt-16">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center space-x-2 text-xs font-sans font-bold tracking-[0.22em] text-[#8A2B2B] uppercase">
              <span className="w-5 h-[1.5px] bg-[#8A2B2B]" />
              <span>ORIGINS & INSPIRATION</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-display font-black text-[#0E0C0B] tracking-tight uppercase">
              THE TROSE STORY
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#0E0C0B]/80 font-sans leading-relaxed">
              <p>
                TROSE is an international coffee supplier that provides quality ethical products—delight and comfort embodying the timeless flower, the rose.
              </p>
              <p>
                In 2012, while stationed in Guatemala serving the U.S. embassy as a Marine, founder Trokon Borbor took a tour of a coffee orchard in Filadelfia, Guatemala, where he was able to learn firsthand the production process of manufacturing coffee.
              </p>
              <p>
                This excursion sparked the inception of TROSE. Years later, Trokon went on to expand in agriculture in his home country, Liberia, West Africa. On a two-hundred-acre farmstead in Liberia, Trokon began cultivating coffee to further distribute throughout the world. True to his name—Trokon: a Bassa Liberian name which means <em>The World</em>—he has curated this exceptional collection from around the world to impact the world.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#F4EFEA] p-6 sm:p-8 border border-[#0E0C0B] space-y-4 font-sans">
            <div className="flex items-center space-x-3 pb-3 border-b border-[#0E0C0B]/15">
              <img
                src="/assets/trose-logo.png"
                alt="Official TROSE Seal"
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.src.endsWith('.svg')) target.src = '/assets/trose-logo.svg';
                }}
              />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C88E38] font-bold block">
                  PROVENANCE MILESTONES
                </span>
                <span className="text-xs font-bold text-[#0E0C0B] uppercase">
                  Filadelfia · Liberia · Global
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#0E0C0B]/75 leading-relaxed font-mono">
              <div className="p-3 bg-white border border-[#0E0C0B]/10">
                <strong className="text-[#0E0C0B] block mb-1">2012 · Filadelfia, Guatemala</strong>
                Stationed in Guatemala serving the U.S. embassy as a Marine. A tour of a coffee orchard in Filadelfia sparked the inception of TROSE.
              </div>
              <div className="p-3 bg-white border border-[#0E0C0B]/10">
                <strong className="text-[#0E0C0B] block mb-1">Liberia Farmstead</strong>
                Cultivating coffee on a two-hundred-acre farmstead in Liberia, West Africa, for global distribution.
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. FOUNDER & CEO — TROKON BORBOR                                          */}
        {/* ========================================================================= */}
        <section id="story-founder-trokon-borbor" className="border-t border-[#0E0C0B]/10 pt-12 sm:pt-16">
          <div className="bg-[#0E0C0B] text-white p-8 sm:p-12 lg:p-16 border border-[#0E0C0B]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4 font-sans">
                <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.22em] text-[#C88E38] font-bold">
                  <span className="w-5 h-[1.5px] bg-[#C88E38]" />
                  <span>LEADERSHIP</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight uppercase text-white">
                  FOUNDER & CEO — TROKON BORBOR
                </h2>

                <div className="space-y-3.5 text-sm sm:text-base text-white/80 leading-relaxed">
                  <p>
                    Trokon Borbor, a Liberian American, U.S. Marine, and health and nutrition enthusiast, frequently indulged in coffee while intermediate fasting. His appreciation for coffee grew into a passion during his service in Guatemala.
                  </p>
                  <p>
                    His name, <span className="text-[#C88E38] font-bold font-mono">“Trokon”</span>, is of Bassa Liberian origin, translating to <span className="text-white font-bold italic">“The World.”</span> True to his name, he has curated this exceptional collection from around the world to impact the world.
                  </p>
                  <p>
                    TROSE provides quality ethical products—delight and comfort across coffee, coffee ware, tea, spices, snacks, and drinks machinery.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 border border-white/20 bg-white/5 space-y-3 text-center">
                <img
                  src="/assets/trose-logo.png"
                  alt="TROSE Emblem"
                  className="w-20 h-20 object-contain invert"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.endsWith('.svg')) target.src = '/assets/trose-logo.svg';
                  }}
                />
                <div className="space-y-1">
                  <div className="text-sm font-display font-bold uppercase tracking-wider text-white">
                    TROKON BORBOR
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#C88E38]">
                    Founder & CEO · U.S. Marine
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. OUR MISSION                                                            */}
        {/* ========================================================================= */}
        <section id="story-our-mission" className="border-t border-[#0E0C0B]/10 pt-12 sm:pt-16 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center space-x-2 text-xs font-sans font-bold tracking-[0.22em] text-[#C88E38] uppercase">
              <span className="w-5 h-[1.5px] bg-[#C88E38]" />
              <span>THE PURPOSE</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-[#0E0C0B] tracking-tight uppercase">
              OUR MISSION
            </h2>

            <blockquote className="text-lg sm:text-2xl font-serif italic text-[#0E0C0B] border-l-4 border-[#C88E38] pl-5 py-2 leading-snug">
              “Through a cup of coffee, our mission is to galvanize the world to be like a rose; graceful, courageous, and pungent while being bold and balanced like coffee.”
            </blockquote>

            <p className="text-sm sm:text-base text-[#0E0C0B]/80 font-sans leading-relaxed">
              TROSE is an international coffee supplier that provides quality ethical products—delight and comfort embodying the timeless flower, the rose. The rose influences courage, beauty, and love, reminding us to be like the rose while also being fragrant and flavorful throughout life, like the coffee bean.
            </p>
          </div>

          {/* Commerce Action Footer */}
          <div className="pt-6 border-t border-[#0E0C0B]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs font-mono uppercase tracking-wider text-[#0E0C0B]/70">
              EXPLORE OUR CANONICAL ROASTER PORTFOLIO
            </div>

            <button
              id="our-story-shop-coffee-btn"
              onClick={onShopCoffee}
              className="px-8 py-4 bg-[#0E0C0B] hover:bg-[#221B16] text-white text-xs font-sans font-bold uppercase tracking-[0.2em] inline-flex items-center space-x-2.5 transition-all shadow-md cursor-pointer active:translate-y-0.5"
            >
              <span>SHOP COFFEE →</span>
            </button>
          </div>
        </section>

      </main>
    </div>
  );
};
