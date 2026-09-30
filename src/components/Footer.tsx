import React, { useState } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Mail, Globe, CheckCircle2, Truck, Lock, Instagram, Youtube, Music, Compass } from 'lucide-react';
import { ProductCategory } from '../types';
import { PolicyTab } from './PolicyModal';

interface FooterProps {
  onSelectCategory: (category: ProductCategory) => void;
  onOpenAbout: () => void;
  onOpenQuiz: () => void;
  onOpenPolicy: (tab: PolicyTab) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAbout,
  onOpenQuiz,
  onOpenPolicy
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer id="main-footer" className="bg-[#1F1612] text-[#FAF6F0] pt-16 sm:pt-24 pb-12 border-t border-[#2D1E18]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* NEWSLETTER SECTION: STAY CLOSE TO THE RITUAL */}
        <div id="newsletter-section" className="bg-[#2D1E18] border border-white/10 rounded-3xl p-8 sm:p-12 mb-16 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            <div className="lg:col-span-6 space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E65F38]/20 border border-[#E65F38]/30 text-[#FAF6F0]">
                <Sparkles className="w-3.5 h-3.5 text-[#E65F38]" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  The Daily Dispatch
                </span>
              </div>
              
              <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-[0.95]">
                Stay Close To <br />
                <span className="font-serif font-normal italic lowercase text-[#D63426]">the morning ritual</span>
              </h3>
              
              <p className="text-xs sm:text-sm text-[#FAF6F0]/80 leading-relaxed font-normal max-w-lg">
                Receive private drops for limited-harvest micro-lot releases, monthly barista brew dial-ins, and an instant 10% welcome discount.
              </p>
            </div>

            <div className="lg:col-span-6">
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-white/40 absolute left-4 top-3.5" />
                      <input
                        type="email"
                        required
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full pl-11 pr-4 py-3 bg-[#1F1612] border border-white/15 rounded-full text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#D63426] transition-colors"
                      />
                    </div>
                    
                    <button
                      id="join-trose-newsletter-btn"
                      type="submit"
                      className="px-8 py-3 bg-[#D63426] hover:bg-[#BF2A1D] text-white text-xs uppercase tracking-widest font-black rounded-full transition-all duration-300 shrink-0 flex items-center justify-center space-x-2 cursor-pointer shadow-md group"
                    >
                      <span>Join TROSE</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <p className="text-[11px] text-[#FAF6F0]/60 font-normal pl-3">
                    By joining, you agree to receive sensory notes. Unsubscribe anytime.
                  </p>
                </form>
              ) : (
                <div className="p-5 bg-[#1F1612] rounded-2xl border border-[#D63426]/50 text-center sm:text-left space-y-1 animate-fadeIn">
                  <div className="flex items-center space-x-2 text-white text-sm font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#D63426]" />
                    <span>Welcome to the TROSE Community!</span>
                  </div>
                  <p className="text-xs text-[#FAF6F0]/80 font-normal">
                    Your 10% welcome discount code is <strong className="text-[#E65F38] font-mono tracking-wider">TROSE10</strong>.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* SHIPPING INFORMATION BANNER */}
        <div className="mb-14 p-5 sm:p-6 bg-[#2D1E18] border border-white/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#D63426]/20 text-[#D63426] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Complimentary Shipping Over $65</h4>
              <p className="text-[#FAF6F0]/70 font-normal text-[11px]">
                Roasted fresh to order and dispatched in eco-friendly valved degassing pouches.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenPolicy('shipping')}
            className="text-[11px] uppercase tracking-wider text-[#E65F38] hover:text-white font-mono font-bold underline underline-offset-4 cursor-pointer shrink-0 transition-colors"
          >
            View Shipping Guide
          </button>
        </div>

        {/* FOOTER NAVIGATION: SHOP | ABOUT | HELP | SOCIAL */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-14 text-xs">
          
          {/* Brand Philosophy Col */}
          <div className="col-span-2 space-y-4">
            <div className="space-y-1">
              <span className="tracking-tight text-2xl font-black text-white uppercase block">
                TROSE
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#E65F38] uppercase font-mono font-bold block">
                Coffee & More
              </span>
            </div>
            
            <p className="text-[#FAF6F0]/70 leading-relaxed max-w-sm font-normal text-xs sm:text-sm">
              Artisan specialty coffee roasters and coffee lifestyle studio. Dedicated to extraordinary single-origin micro-lots, organic harvests, design drinkware, and prosumer equipment.
            </p>

            <div className="flex items-center space-x-2 text-[#657953] text-[11px] font-mono font-bold pt-1">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#657953]" />
              <span>Direct Farm Partnerships • 100% Specialty Grade</span>
            </div>
          </div>

          {/* Column 1: SHOP */}
          <div className="space-y-3">
            <h4 className="text-white uppercase tracking-widest font-black font-mono text-[11px] border-b border-white/10 pb-1.5 inline-block">
              SHOP
            </h4>
            <ul className="space-y-2.5 text-[#FAF6F0]/75 font-normal">
              <li>
                <button onClick={() => onSelectCategory('coffee')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Single-Origin Coffee
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('organic')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Organic Specialty Roasts
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('machines')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Espresso Machines
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('accessories')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Precision Accessories
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('mugs-flasks')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Mugs & Travel Flasks
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('bundles')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Bundles & Tasting Sets
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: ABOUT */}
          <div className="space-y-3">
            <h4 className="text-white uppercase tracking-widest font-black font-mono text-[11px] border-b border-white/10 pb-1.5 inline-block">
              ABOUT
            </h4>
            <ul className="space-y-2.5 text-[#FAF6F0]/75 font-normal">
              <li>
                <button onClick={onOpenAbout} className="hover:text-white transition-colors cursor-pointer text-left">
                  The TROSE Story
                </button>
              </li>
              <li>
                <button onClick={onOpenAbout} className="hover:text-white transition-colors cursor-pointer text-left">
                  Direct Sourcing
                </button>
              </li>
              <li>
                <button onClick={onOpenAbout} className="hover:text-white transition-colors cursor-pointer text-left">
                  Small-Batch Roasting
                </button>
              </li>
              <li>
                <button onClick={onOpenQuiz} className="hover:text-[#E65F38] transition-colors cursor-pointer flex items-center space-x-1.5 text-left font-semibold">
                  <span>Find Your Coffee</span>
                  <Sparkles className="w-3 h-3 text-[#E65F38]" />
                </button>
              </li>
              <li>
                <a href="#subscription-club-section" className="hover:text-white transition-colors block text-left">
                  The TROSE Club
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: HELP */}
          <div className="space-y-3">
            <h4 className="text-white uppercase tracking-widest font-black font-mono text-[11px] border-b border-white/10 pb-1.5 inline-block">
              HELP
            </h4>
            <ul className="space-y-2.5 text-[#FAF6F0]/75 font-normal">
              <li>
                <button onClick={() => onOpenPolicy('shipping')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Shipping & Delivery Info
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('terms')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Fresh Roast Guarantee
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('contact')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('privacy')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('terms')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* SOCIAL LINKS & PAYMENT ICONS ROW */}
        <div className="pt-8 pb-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-between">
          
          {/* SOCIAL CHANNELS */}
          <div className="space-y-3">
            <h5 className="text-[11px] uppercase font-mono tracking-widest text-white/60 font-bold">
              SOCIAL
            </h5>
            <div className="flex items-center space-x-2.5 text-xs">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-full bg-white/5 hover:bg-[#D63426] text-white transition-all flex items-center space-x-2 cursor-pointer border border-white/10"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>

              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-full bg-white/5 hover:bg-[#D63426] text-white transition-all flex items-center space-x-2 cursor-pointer border border-white/10"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Pinterest</span>
              </a>

              <a
                href="https://spotify.com"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-full bg-white/5 hover:bg-[#D63426] text-white transition-all flex items-center space-x-2 cursor-pointer border border-white/10"
              >
                <Music className="w-3.5 h-3.5" />
                <span>Spotify</span>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-full bg-white/5 hover:bg-[#D63426] text-white transition-all flex items-center space-x-2 cursor-pointer border border-white/10"
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>YouTube</span>
              </a>
            </div>
          </div>

          {/* PAYMENT ICONS */}
          <div className="space-y-3 md:text-right">
            <h5 className="text-[11px] uppercase font-mono tracking-widest text-white/60 font-bold">
              ACCEPTED PAYMENTS
            </h5>
            <div className="flex items-center md:justify-end flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-white rounded-md text-[#1A1F71] font-bold text-[10px] font-sans tracking-tight shadow-xs">
                VISA
              </span>

              <span className="px-2.5 py-1 bg-white rounded-md text-[#EB001B] font-bold text-[10px] font-sans tracking-tight shadow-xs">
                Mastercard
              </span>

              <span className="px-2.5 py-1 bg-[#006FCF] rounded-md text-white font-bold text-[10px] font-sans tracking-tight shadow-xs">
                AMEX
              </span>

              <span className="px-2.5 py-1 bg-black rounded-md text-white font-medium text-[10px] font-sans tracking-tight shadow-xs border border-white/20">
                 Pay
              </span>

              <span className="px-2.5 py-1 bg-white rounded-md text-[#5F6368] font-bold text-[10px] font-sans tracking-tight shadow-xs">
                G Pay
              </span>

              <span className="px-2.5 py-1 bg-[#5A31F4] rounded-md text-white font-bold text-[10px] font-sans tracking-tight shadow-xs">
                Shop Pay
              </span>

              <span className="px-2.5 py-1 bg-white rounded-md text-[#003087] font-bold text-[10px] font-sans tracking-tight shadow-xs">
                PayPal
              </span>
            </div>
          </div>

        </div>

        {/* BOTTOM LEGAL & COPYRIGHT STRIP */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#FAF6F0]/60 gap-4 font-normal">
          <div className="flex items-center space-x-2">
            <span>© 2026 TROSE Coffee & More. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-6">
            <button 
              onClick={() => onOpenPolicy('privacy')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => onOpenPolicy('terms')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button 
              onClick={() => onOpenPolicy('shipping')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Shipping
            </button>
            <button 
              onClick={() => onOpenPolicy('contact')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>

          <div className="flex items-center space-x-2 text-[#E65F38]">
            <Globe className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px]">USD ($) • Global Dispatch</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

