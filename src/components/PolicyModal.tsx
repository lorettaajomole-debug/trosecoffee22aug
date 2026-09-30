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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#12100E]/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 text-left">
      <div 
        id="policy-modal-container"
        className="relative w-full max-w-3xl bg-[#FAF7F2] border border-[#12100E] shadow-2xl overflow-hidden flex flex-col my-8 max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#FDFBF7] border-b border-[#12100E]/15 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 border border-[#12100E] flex items-center justify-center text-[#12100E] bg-white">
              {activeTab === 'privacy' && <ShieldCheck className="w-4 h-4 text-[#C5A059]" />}
              {activeTab === 'terms' && <FileText className="w-4 h-4 text-[#C5A059]" />}
              {activeTab === 'shipping' && <Truck className="w-4 h-4 text-[#C5A059]" />}
              {activeTab === 'contact' && <Mail className="w-4 h-4 text-[#C5A059]" />}
            </div>
            <div>
              <h3 className="text-lg font-editorial font-bold text-[#12100E] uppercase">
                {activeTab === 'privacy' && 'Privacy Policy'}
                {activeTab === 'terms' && 'Terms of Service'}
                {activeTab === 'shipping' && 'Shipping & Freshness Standards'}
                {activeTab === 'contact' && 'Client Support'}
              </h3>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#69574A]">
                TROSE ROASTERY & MORE · LEGAL DISCLOSURES
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-[#12100E]/20 text-[#12100E] hover:border-[#12100E] hover:text-[#D62828] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation (Zero pills) */}
        <div className="flex border-b border-[#12100E]/15 bg-white text-[10px] font-mono uppercase tracking-wider overflow-x-auto">
          {[
            { id: 'privacy' as PolicyTab, label: '01 / Privacy' },
            { id: 'terms' as PolicyTab, label: '02 / Terms' },
            { id: 'shipping' as PolicyTab, label: '03 / Shipping & Returns' },
            { id: 'contact' as PolicyTab, label: '04 / Support' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-5 transition-colors cursor-pointer whitespace-nowrap border-b-2 font-bold ${
                activeTab === tab.id
                  ? 'border-[#12100E] bg-[#FAF7F2] text-[#12100E]'
                  : 'border-transparent text-[#69574A] hover:text-[#12100E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-[#12100E]/80 leading-relaxed font-normal">
          
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h4 className="text-base font-editorial font-bold uppercase text-[#12100E]">1. Information Collection & Use</h4>
              <p>
                TROSE Coffee & More respects your privacy. We collect customer information solely to fulfill orders, facilitate deliveries, and communicate relevant small-batch roast drops. We do not sell, rent, or monetize your personal details to third-party brokers.
              </p>
              <h4 className="text-base font-editorial font-bold uppercase text-[#12100E]">2. Encrypted Payments</h4>
              <p>
                All transactions are encrypted with 256-bit TLS protocol. We partner with PCI-DSS compliant gateways including Shopify Payments, Stripe, and Apple Pay. Sensitive payment numbers never touch our servers.
              </p>
              <h4 className="text-base font-editorial font-bold uppercase text-[#12100E]">3. Data Rights</h4>
              <p>
                You may request full erasure of your account and personal history at any time by contacting support@trosecoffee.com.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h4 className="text-base font-editorial font-bold uppercase text-[#12100E]">1. Roastery Terms</h4>
              <p>
                By placing an order on TROSE Coffee & More, you agree to our terms of fulfillment and roasting cycles. Because our coffee is roasted fresh to order, orders entered into the production schedule cannot be cancelled once beans enter the drum.
              </p>
              <h4 className="text-base font-editorial font-bold uppercase text-[#12100E]">2. Fresh Roast Guarantee</h4>
              <p>
                If your coffee bag arrives damaged, compromised, or you feel the roast profile does not meet our high standards, please notify us within 30 days of delivery. We will immediately replace your bag or issue a full refund.
              </p>
              <h4 className="text-base font-editorial font-bold uppercase text-[#12100E]">3. Subscription Flexibility</h4>
              <p>
                Subscriptions may be paused, adjusted, or cancelled anytime before the scheduled weekly/monthly billing cycle.
              </p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h4 className="text-base font-editorial font-bold uppercase text-[#12100E]">1. Small-Batch Roast & Dispatch</h4>
              <p>
                We roast three days a week. Coffees ordered by 1:00 PM PST are packaged in valved one-way degassing pouches and dispatched within 24 to 48 hours for maximum flavor preservation.
              </p>
              <h4 className="text-base font-editorial font-bold uppercase text-[#12100E]">2. Complimentary Threshold</h4>
              <p>
                Domestic orders over $65 qualify for complimentary expedited shipping. Standard shipping is a flat rate of $7.50 for all other orders.
              </p>
              <h4 className="text-base font-editorial font-bold uppercase text-[#12100E]">3. Global Sourcing & Distribution</h4>
              <p>
                We ship worldwide with tracked air delivery. International transit typically takes 5–9 business days depending on customs clearance.
              </p>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-[#12100E]/15 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] font-bold">EMAIL SUPPORT</span>
                  <p className="font-mono text-xs font-bold text-[#12100E]">support@trosecoffee.com</p>
                  <p className="text-[11px] text-[#69574A]">Response within 24 hours</p>
                </div>

                <div className="p-4 bg-white border border-[#12100E]/15 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] font-bold">ROASTERY PHONE</span>
                  <p className="font-mono text-xs font-bold text-[#12100E]">+1 (503) 892-4112</p>
                  <p className="text-[11px] text-[#69574A]">Mon–Fri: 8:00 AM – 5:00 PM PST</p>
                </div>
              </div>

              <div className="p-4 bg-white border border-[#12100E]/15 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C2873F] font-bold">TROSE COFFEE & MORE</span>
                <p className="font-mono text-xs font-bold text-[#12100E]">
                  Customer Care & Inquiries
                </p>
                <p className="text-[11px] text-[#69574A]">
                  For corporate gifting, bulk roasts, and wholesale inquiries, contact support@trosecoffee.com.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FDFBF7] border-t border-[#12100E]/15 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#12100E] text-white text-[10px] font-mono uppercase tracking-wider font-bold hover:bg-[#D62828] transition-colors cursor-pointer"
          >
            DISMISS
          </button>
        </div>

      </div>
    </div>
  );
};
