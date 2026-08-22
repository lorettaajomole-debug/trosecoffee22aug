import React, { useState } from 'react';
import { Check, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface SubscriptionClubProps {
  products: Product[];
  onSubscribe: (product: Product, plan: 'every-2-weeks' | 'every-4-weeks') => void;
}

export const SubscriptionClub: React.FC<SubscriptionClubProps> = ({
  products,
  onSubscribe
}) => {
  const [selectedFrequency, setSelectedFrequency] = useState<'every-2-weeks' | 'every-4-weeks'>('every-2-weeks');
  const [selectedBagCount, setSelectedBagCount] = useState<number>(2);

  const featuredCoffee = products.find((p) => p.id === 'trose-reserve-ethiopia-yirgacheffe') || products[0];

  const pricePerBag = featuredCoffee.price * 0.85; // 15% off
  const totalPrice = pricePerBag * selectedBagCount;

  return (
    <section id="subscription-club-section" className="py-16 sm:py-24 bg-[#FAF6F0] border-b border-[#E8DFD5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        <div className="bg-[#1F1612] text-[#FAF6F0] rounded-3xl p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-xl border border-[#2D1E18]">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
            
            {/* Left Column: Club Description & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E65F38]/20 border border-[#E65F38]/30 text-[#FAF6F0]">
                <Sparkles className="w-3.5 h-3.5 text-[#E65F38]" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  The TROSE Club
                </span>
              </div>

              <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-[0.95]">
                Never Run Out of <br />
                <span className="font-serif font-normal italic lowercase text-[#D63426]">freshly roasted beans.</span>
              </h2>

              <p className="text-sm sm:text-base text-[#FAF6F0]/80 leading-relaxed font-normal max-w-xl">
                Set your cadence and enjoy peak-fresh micro-lot coffee delivered straight to your door. Save 15% on every bag, swap roasts anytime, and pause with one click.
              </p>

              {/* Perks List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  '15% Off Every Shipment For Life',
                  'Free Carbon-Neutral Shipping',
                  'Early Drop Access to Micro-Lots',
                  'Free TROSE Enamel Pin in 1st Box',
                  'Pause, Swap or Cancel Anytime',
                  'Custom Ground for Your Method'
                ].map((perk) => (
                  <div key={perk} className="flex items-center space-x-2.5 text-xs text-[#FAF6F0]">
                    <div className="w-4 h-4 rounded-full bg-[#D63426]/20 border border-[#D63426] flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-[#D63426]" />
                    </div>
                    <span className="font-medium">{perk}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column: Interactive Subscription Configurator Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#2D1E18] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
                
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-base font-black uppercase text-white">Your Club Plan</h3>
                    <span className="text-xs text-[#FAF6F0]/60">Curated weekly by our roasters</span>
                  </div>
                  <span className="px-3 py-1 bg-[#D63426] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
                    Save 15%
                  </span>
                </div>

                {/* Bag Count Selector */}
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-wider text-[#FAF6F0]/80 font-mono font-bold block">
                    Bags Per Shipment:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { count: 1, label: '1 Bag', desc: '1-2 cups/day' },
                      { count: 2, label: '2 Bags', desc: 'Popular' },
                      { count: 3, label: '3 Bags', desc: 'Daily Brewer' }
                    ].map((b) => (
                      <button
                        key={b.count}
                        onClick={() => setSelectedBagCount(b.count)}
                        className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          selectedBagCount === b.count
                            ? 'border-[#D63426] bg-[#D63426]/15 text-white ring-1 ring-[#D63426]'
                            : 'border-white/10 bg-white/5 text-[#FAF6F0]/70 hover:border-white/30'
                        }`}
                      >
                        <span className="text-xs font-bold block">{b.label}</span>
                        <span className="text-[10px] text-[#E65F38] block mt-0.5">{b.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Frequency Selector */}
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-wider text-[#FAF6F0]/80 font-mono font-bold block">
                    Frequency:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'every-2-weeks' as const, label: 'Every 2 Weeks', badge: 'Recommended' },
                      { id: 'every-4-weeks' as const, label: 'Every 4 Weeks', badge: 'Monthly' }
                    ].map((freq) => (
                      <button
                        key={freq.id}
                        onClick={() => setSelectedFrequency(freq.id)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          selectedFrequency === freq.id
                            ? 'border-[#D63426] bg-[#D63426]/15 text-white ring-1 ring-[#D63426]'
                            : 'border-white/10 bg-white/5 text-[#FAF6F0]/70 hover:border-white/30'
                        }`}
                      >
                        <span className="text-xs font-bold block">{freq.label}</span>
                        <span className="text-[10px] uppercase font-mono text-[#E65F38] block mt-0.5">
                          {freq.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total & Action */}
                <div className="pt-3 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#FAF6F0]/60 block font-normal">Total per box:</span>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-black text-white">
                          ${totalPrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-[#FAF6F0]/40 line-through font-mono">
                          ${(featuredCoffee.price * selectedBagCount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-[#657953] font-bold">
                      + Free Shipping
                    </span>
                  </div>

                  <button
                    id="join-roasters-club-btn"
                    onClick={() => onSubscribe(featuredCoffee, selectedFrequency)}
                    className="w-full py-4 bg-[#D63426] hover:bg-[#BF2A1D] text-white text-xs uppercase tracking-widest font-black rounded-full transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg cursor-pointer group"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Join TROSE Club</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};


