import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Mail, Sparkles, Coffee, Calendar, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface SubscriptionClubProps {
  products?: Product[];
  onSubscribe?: (product: Product, plan: 'every-2-weeks' | 'every-4-weeks') => void;
}

export const SubscriptionClub: React.FC<SubscriptionClubProps> = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section id="subscription-club-section" className="py-16 sm:py-24 bg-[#F7F3EB] border-b border-[#12100E]/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Main Editorial Container: 20% Espresso Contrast with Warm Kraft & Champagne Gold */}
        <div className="bg-[#12100E] text-[#FAF6F0] border border-[#12100E] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          
          {/* Bauhaus Architectural Accents: Soft Kraft Disc & Antique Gold Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-bl-[160px] bg-[#D4B896]/10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-tr-full bg-[#CCA347]/10 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10 text-left font-sans">
            
            {/* Left Column: Editorial Vision & Overview (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans text-[#C88E38] font-bold">
                <span className="w-5 h-[1.5px] bg-[#C88E38]" />
                <span>COFFEE SUBSCRIPTION</span>
                <span>●</span>
                <span className="text-white/80">COMING SOON</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-white uppercase leading-[1.0]">
                <span>NEVER RUN OUT OF</span><br />
                <span className="text-[#C88E38]">
                  EXCEPTIONAL COFFEE.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal max-w-xl">
                We are developing our bespoke coffee subscription service. Enjoy freshly packaged whole bean and ground selections delivered seamlessly to your door on your preferred schedule.
              </p>

              {/* Editorial Features Preview (Neutral Brand Copy - No Invented Discounts or Terms) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="flex items-start space-x-3 text-xs text-white/90">
                  <div className="w-4 h-4 border border-[#C88E38] flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-2.5 h-2.5 text-[#C88E38]" />
                  </div>
                  <div>
                    <span className="font-bold block text-white">Custom Delivery Rhythm</span>
                    <span className="text-[11px] text-white/70">Scheduled around your brewing frequency.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs text-white/90">
                  <div className="w-4 h-4 border border-[#C88E38] flex items-center justify-center shrink-0 mt-0.5">
                    <Coffee className="w-2.5 h-2.5 text-[#C88E38]" />
                  </div>
                  <div>
                    <span className="font-bold block text-white">Curated Selection</span>
                    <span className="text-[11px] text-white/70">Signature blends and organic single-origins.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs text-white/90">
                  <div className="w-4 h-4 border border-[#C88E38] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-[#C88E38]" />
                  </div>
                  <div>
                    <span className="font-bold block text-white">Grind Preferences</span>
                    <span className="text-[11px] text-white/70">Whole bean or calibrated to your brew method.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs text-white/90">
                  <div className="w-4 h-4 border border-[#C88E38] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-2.5 h-2.5 text-[#C88E38]" />
                  </div>
                  <div>
                    <span className="font-bold block text-white">Seamless Management</span>
                    <span className="text-[11px] text-white/70">Pause, adjust, or update anytime.</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Early Access Invitation Card (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-[#F4EFEA] text-[#0E0C0B] border border-[#0E0C0B] p-6 sm:p-8 space-y-5 shadow-2xl">
                
                <div className="space-y-1.5 border-b border-[#0E0C0B]/12 pb-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-[#8A2B2B] block">
                    EARLY ACCESS
                  </span>
                  <h3 className="text-xl font-display font-black uppercase text-[#0E0C0B]">
                    Join The Subscription Waitlist
                  </h3>
                  <p className="text-xs text-[#0E0C0B]/75 leading-relaxed font-sans font-normal">
                    Be the first to know when subscription delivery launches. Receive exclusive preview access and early roast reserve updates.
                  </p>
                </div>

                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-3 font-sans">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#12100E]/70 font-semibold mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ENTER YOUR EMAIL"
                        className="w-full px-3.5 py-3 bg-white border border-[#0E0C0B]/20 focus:outline-none focus:border-[#0E0C0B] text-xs text-[#0E0C0B] placeholder-[#0E0C0B]/40"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#0E0C0B] hover:bg-[#8A2B2B] text-white text-xs uppercase tracking-[0.18em] font-sans font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs active:translate-y-0.5"
                    >
                      <span>GET EARLY ACCESS</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C88E38]" />
                    </button>
                  </form>
                ) : (
                  <div className="p-4 bg-[#F4EFEA] border border-[#C88E38] space-y-1 text-left font-sans">
                    <div className="flex items-center space-x-2 text-[#0E0C0B] text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-[#C88E38]" />
                      <span>You're on the list</span>
                    </div>
                    <p className="text-xs text-[#0E0C0B]/75">
                      We will notify you the moment the TROSE coffee subscription is live.
                    </p>
                  </div>
                )}

                <div className="pt-2 text-center text-[10px] uppercase tracking-[0.2em] text-[#0E0C0B]/50 font-sans font-bold">
                  TROSE COFFEE & MORE · COMING SOON
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
