import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Instagram, Youtube, Mail } from 'lucide-react';
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
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer id="main-footer" className="bg-[#0E0C0B] text-[#F4EFEA]">
      
      {/* 1. STRONG NEWSLETTER BAND: JOIN THE TROSE CIRCLE */}
      <div className="border-b border-white/10 bg-[#161210] py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 text-center space-y-6 font-sans">
          
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C88E38] font-bold">
              NEWSLETTER
            </span>
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight uppercase">
              Join The TROSE Circle
            </h3>
            <p className="text-xs sm:text-sm text-white/75 max-w-md mx-auto font-normal leading-relaxed">
              Receive private invitations, new roast arrivals, and brewing stories directly to your inbox.
            </p>
          </div>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row border border-white/20 focus-within:border-[#C88E38] transition-colors bg-white/5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL"
                  className="w-full px-4 py-3 bg-transparent text-xs text-white placeholder-white/40 font-sans focus:outline-none uppercase tracking-wider text-left"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#F4EFEA] hover:bg-[#C88E38] hover:text-[#0E0C0B] text-[#0E0C0B] text-xs uppercase tracking-[0.16em] font-sans font-bold transition-colors shrink-0 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>SUBSCRIBE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 bg-white/5 border border-[#C88E38] max-w-md mx-auto flex items-center justify-center space-x-2 text-white text-xs font-sans">
              <CheckCircle2 className="w-4 h-4 text-[#C88E38]" />
              <span>Thank you for joining the TROSE circle.</span>
            </div>
          )}

        </div>
      </div>

      {/* 2. COMPACT & ELEGANT FOOTER */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 sm:py-16 font-sans">
        
        {/* Top Tier: Official Brand Signature + Essential Navigation */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pb-10 border-b border-white/10">
          
          {/* Official TROSE Branding */}
          <div className="flex flex-col items-center md:items-start space-y-2.5 text-center md:text-left">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/trose-logo.png"
                alt="TROSE Coffee & More"
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.src.endsWith('.svg')) target.src = '/assets/trose-logo.svg';
                }}
              />
              <div>
                <span className="font-display text-lg tracking-wider font-extrabold block text-white uppercase">
                  TROSE
                </span>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#C88E38] block font-bold">
                  COFFEE & MORE
                </span>
              </div>
            </div>

            <p className="text-xs uppercase tracking-[0.2em] text-white/60">
              RISE. REFRESH. REIGN.
            </p>
          </div>

          {/* Essential Navigation Links */}
          <nav className="flex flex-wrap justify-center md:justify-end items-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.14em] font-sans font-medium text-white/80">
            <button
              onClick={() => onSelectCategory('all')}
              className="hover:text-[#C88E38] transition-colors cursor-pointer"
            >
              Shop
            </button>
            <button
              onClick={() => onSelectCategory('coffee')}
              className="hover:text-[#C88E38] transition-colors cursor-pointer"
            >
              Coffee
            </button>
            <button
              onClick={() => onSelectCategory('organic')}
              className="hover:text-[#C88E38] transition-colors cursor-pointer"
            >
              Organic
            </button>
            <button
              onClick={() => onSelectCategory('machines')}
              className="hover:text-[#C88E38] transition-colors cursor-pointer"
            >
              Machines
            </button>
            <button
              onClick={() => onSelectCategory('accessories')}
              className="hover:text-[#C88E38] transition-colors cursor-pointer"
            >
              Mugs & Gear
            </button>
            <button
              onClick={onOpenQuiz}
              className="text-[#C88E38] hover:text-white transition-colors cursor-pointer font-bold"
            >
              Find Your TROSE
            </button>
            <button
              onClick={onOpenAbout}
              className="hover:text-[#C88E38] transition-colors cursor-pointer"
            >
              About
            </button>
          </nav>

        </div>

        {/* Bottom Tier: Policies, Socials, and Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-white/50">
          
          {/* Policy Links */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenPolicy('shipping')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Shipping Policy
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenPolicy('contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>

          {/* Social Icons & Copyright */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 text-white/70">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hover:text-[#C88E38] transition-colors p-1"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="hover:text-[#C88E38] transition-colors p-1"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            <span>
              © {new Date().getFullYear()} TROSE Coffee & More.
            </span>
          </div>

        </div>

      </div>

    </footer>
  );
};
