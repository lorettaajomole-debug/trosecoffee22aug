import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Truck, Mail, MapPin, Phone, CheckCircle2 } from 'lucide-react';

export type PolicyTab = 'privacy' | 'terms' | 'shipping' | 'contact';

interface PolicyModalProps {
  isOpen: boolean;
  initialTab?: PolicyTab;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#211C1A]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        id="policy-modal-container"
        className="relative w-full max-w-3xl bg-[#FDFBF7] rounded-2xl shadow-2xl border border-[#E5E5CB] overflow-hidden flex flex-col my-8 max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#E5E5CB] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#E5E5CB]/40 flex items-center justify-center text-[#3C2A21]">
              {activeTab === 'privacy' && <ShieldCheck className="w-5 h-5 text-[#C5A059]" />}
              {activeTab === 'terms' && <FileText className="w-5 h-5 text-[#C5A059]" />}
              {activeTab === 'shipping' && <Truck className="w-5 h-5 text-[#C5A059]" />}
              {activeTab === 'contact' && <Mail className="w-5 h-5 text-[#C5A059]" />}
            </div>
            <div>
              <h3 className="text-lg font-serif font-semibold text-[#3C2A21]">
                {activeTab === 'privacy' && 'Privacy Policy'}
                {activeTab === 'terms' && 'Terms of Service'}
                {activeTab === 'shipping' && 'Shipping & Freshness Standards'}
                {activeTab === 'contact' && 'Contact Concierge'}
              </h3>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#7E7067]">
                TROSE Coffee & More • Legal & Support
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#7E7067] hover:text-[#3C2A21] hover:bg-[#E5E5CB]/40 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#E5E5CB] bg-[#F5EBE0]/30 px-6 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 font-medium transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-[#3C2A21] text-[#3C2A21] font-semibold'
                : 'border-transparent text-[#7E7067] hover:text-[#3C2A21]'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-4 font-medium transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'terms'
                ? 'border-[#3C2A21] text-[#3C2A21] font-semibold'
                : 'border-transparent text-[#7E7067] hover:text-[#3C2A21]'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`py-3 px-4 font-medium transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'border-[#3C2A21] text-[#3C2A21] font-semibold'
                : 'border-transparent text-[#7E7067] hover:text-[#3C2A21]'
            }`}
          >
            Shipping Information
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`py-3 px-4 font-medium transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'contact'
                ? 'border-[#3C2A21] text-[#3C2A21] font-semibold'
                : 'border-transparent text-[#7E7067] hover:text-[#3C2A21]'
            }`}
          >
            Contact & Roastery
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-[#3C2A21]/80 font-light leading-relaxed">
          
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-[#E5E5CB] space-y-1.5">
                <h4 className="font-serif font-semibold text-sm text-[#3C2A21]">Data Protection Commitment</h4>
                <p className="text-xs text-[#7E7067]">
                  At TROSE, your privacy is fundamental to our craft. We do not sell or monetize personal customer records under any circumstances.
                </p>
              </div>

              <h5 className="font-serif font-semibold text-[#3C2A21] text-sm pt-2">1. Information We Collect</h5>
              <p>
                We collect information you explicitly provide when placing orders, subscribing to the Roaster's Club, or contacting our concierge. This includes your name, shipping address, email address, and order customization preferences (such as preferred grind size).
              </p>

              <h5 className="font-serif font-semibold text-[#3C2A21] text-sm pt-2">2. Payment Security</h5>
              <p>
                All credit card and payment processing is handled through PCI-DSS Level 1 certified gateways with 256-bit SSL encryption. TROSE never stores or has access to raw credit card numbers.
              </p>

              <h5 className="font-serif font-semibold text-[#3C2A21] text-sm pt-2">3. Cookies & Session Preferences</h5>
              <p>
                We use strictly functional cookies to preserve your cart items, roast quiz recommendations, and currency selection across browser sessions.
              </p>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-[#E5E5CB] space-y-1.5">
                <h4 className="font-serif font-semibold text-sm text-[#3C2A21]">Specialty Coffee Terms & Guarantees</h4>
                <p className="text-xs text-[#7E7067]">
                  By purchasing from TROSE Coffee & More, you agree to our terms governing artisan small-batch fulfillment and our Fresh Roast Guarantee.
                </p>
              </div>

              <h5 className="font-serif font-semibold text-[#3C2A21] text-sm pt-2">1. Fresh Roast Guarantee</h5>
              <p>
                All whole bean and pre-ground coffees are roasted in micro-batches and shipped within 48 hours of profiling. If your coffee fails to meet our strict sensory standards, contact our concierge within 30 days for a complimentary replacement roast.
              </p>

              <h5 className="font-serif font-semibold text-[#3C2A21] text-sm pt-2">2. Roaster’s Club Subscriptions</h5>
              <p>
                Subscriptions may be paused, adjusted for grind or quantity, or cancelled at any time without fees prior to the scheduled billing date.
              </p>

              <h5 className="font-serif font-semibold text-[#3C2A21] text-sm pt-2">3. Hardware & Machinery Warranty</h5>
              <p>
                All espresso machines, electric grinders, and smart scales carry a full 2-year manufacturer warranty supported by our certified technicians in Portland and Seattle.
              </p>
            </div>
          )}

          {/* TAB 3: SHIPPING INFORMATION */}
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-[#E5E5CB] space-y-1.5">
                <h4 className="font-serif font-semibold text-sm text-[#3C2A21]">Worldwide Express & Sustainable Packaging</h4>
                <p className="text-xs text-[#7E7067]">
                  Every order is packed in 100% recyclable boxes with plant-based cushioning and nitrogen-flushed, one-way degassing valved pouches.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-white rounded-xl border border-[#E5E5CB]">
                  <span className="text-[10px] uppercase font-mono text-[#C5A059] block font-bold">Domestic Shipping</span>
                  <p className="text-xs text-[#3C2A21] font-semibold mt-0.5">Complimentary over $65</p>
                  <p className="text-[11px] text-[#7E7067] font-light">2–4 Business Days via Priority Express</p>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-[#E5E5CB]">
                  <span className="text-[10px] uppercase font-mono text-[#C5A059] block font-bold">International Shipping</span>
                  <p className="text-xs text-[#3C2A21] font-semibold mt-0.5">Flat $14.50 Worldwide</p>
                  <p className="text-[11px] text-[#7E7067] font-light">4–7 Business Days with tracked customs clearance</p>
                </div>
              </div>

              <h5 className="font-serif font-semibold text-[#3C2A21] text-sm pt-2">Roast-to-Order Dispatch Cycle</h5>
              <p>
                To preserve delicate floral aromatics and fruit notes, we roast on Tuesdays and Thursdays. Orders received are queued for the nearest roast date to ensure zero staleness.
              </p>
            </div>
          )}

          {/* TAB 4: CONTACT CONCIERGE */}
          {activeTab === 'contact' && (
            <div className="space-y-5">
              <div className="p-4 bg-white rounded-xl border border-[#E5E5CB] space-y-1.5">
                <h4 className="font-serif font-semibold text-sm text-[#3C2A21]">We Are Here For Your Daily Ritual</h4>
                <p className="text-xs text-[#7E7067]">
                  Speak directly with our roasting team, certified Q-Graders, or prosumer equipment technicians.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-[#E5E5CB]">
                  <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#7E7067] block">Direct Concierge Email</span>
                    <a href="mailto:concierge@trosecoffee.com" className="text-xs font-semibold text-[#3C2A21] hover:text-[#C5A059] transition-colors">
                      concierge@trosecoffee.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-[#E5E5CB]">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#7E7067] block">Roastery & Tasting Room</span>
                    <span className="text-xs text-[#3C2A21] font-semibold">
                      742 Artisan Roastery Blvd, Portland, OR & Copenhagen K, Denmark
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-[#E5E5CB]">
                  <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#7E7067] block">Barista Support Line</span>
                    <span className="text-xs text-[#3C2A21] font-semibold">
                      +1 (800) 592-ROAST (Mon–Fri 8am–6pm PST)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Action */}
        <div className="p-4 bg-white border-t border-[#E5E5CB] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#3C2A21] hover:bg-[#211C1A] text-white text-xs uppercase tracking-widest font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
