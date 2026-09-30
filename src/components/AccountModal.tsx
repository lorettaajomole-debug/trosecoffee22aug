import React, { useState } from 'react';
import { X, User, Package, Award, Sparkles } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'subscription'>('profile');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#12100E]/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 text-left">
      
      <div 
        id="account-modal-container"
        className="relative w-full max-w-2xl bg-[#FAF7F2] border border-[#12100E] shadow-2xl overflow-hidden flex flex-col my-8"
      >
        {/* Header */}
        <div className="bg-[#12100E] text-white p-6 sm:p-8 flex items-center justify-between border-b border-white/15">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 border border-[#C5A059] bg-[#12100E] text-[#C5A059] flex items-center justify-center font-mono text-lg font-bold">
              TR
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-editorial font-bold uppercase tracking-wide">Client Portal</h3>
                <span className="px-2 py-0.5 bg-[#C5A059] text-[#12100E] text-[9px] font-mono font-bold uppercase tracking-wider">
                  MEMBER
                </span>
              </div>
              <p className="text-xs text-white/70 font-mono mt-0.5">Member since 2026 · lorettaajomole@gmail.com</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-white/20 text-white hover:border-[#D62828] hover:text-[#D62828] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher (Zero pills) */}
        <div className="flex border-b border-[#12100E]/15 bg-white text-[10px] font-mono uppercase tracking-wider">
          {[
            { id: 'profile', label: '01 / Profile', icon: User },
            { id: 'orders', label: '02 / Orders', icon: Package },
            { id: 'subscription', label: '03 / Club Cadence', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 border-b-2 transition-colors cursor-pointer font-bold ${
                  activeTab === tab.id
                    ? 'border-[#12100E] text-[#12100E] bg-[#FAF7F2]'
                    : 'border-transparent text-[#69574A] hover:text-[#12100E]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="p-4 bg-white border border-[#12100E]/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] font-bold block">
                    TASTING REWARDS
                  </span>
                  <span className="text-lg font-mono font-bold text-[#12100E]">420 Points Available</span>
                  <p className="text-xs text-[#69574A] font-sans">Equivalent to $15 off your next micro-lot order.</p>
                </div>
                <Award className="w-6 h-6 text-[#C5A059]" />
              </div>

              <div className="p-4 bg-white border border-[#12100E]/15 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#69574A] font-bold block">
                  SAVED ADDRESSES
                </span>
                <p className="text-xs font-mono text-[#12100E]">742 Artisan Roastery Blvd, Portland, OR</p>
                <span className="text-[10px] font-mono text-[#C5A059] uppercase">Default Shipping Destination</span>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-3">
              <div className="p-4 bg-white border border-[#12100E]/15 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#12100E]">ORDER #TR-894212</span>
                  <span className="text-[#C5A059] font-bold">DISPATCHED</span>
                </div>
                <p className="text-xs text-[#69574A] font-sans">
                  Fair Trade Organic Bali Blue · Whole Bean (12 oz)
                </p>
                <span className="text-[10px] font-mono text-[#69574A] block">Sept 28, 2026 · $19.99</span>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="space-y-4">
              <div className="p-5 bg-white border border-[#12100E]/15 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#12100E] uppercase">The Roaster's Club</span>
                  <span className="px-2 py-0.5 bg-[#12100E] text-[#C5A059] text-[9px] font-mono font-bold uppercase">
                    ACTIVE · 15% OFF
                  </span>
                </div>
                <p className="text-xs text-[#69574A] leading-relaxed">
                  Cadence: Bi-weekly fresh coffee delivery (2 bags). Next dispatch scheduled for Friday.
                </p>
                <div className="flex gap-2 pt-2">
                  <button className="px-3 py-1.5 border border-[#12100E] text-[10px] font-mono uppercase font-bold hover:bg-[#12100E] hover:text-white transition-colors cursor-pointer">
                    PAUSE SHIPMENT
                  </button>
                  <button className="px-3 py-1.5 border border-[#12100E] text-[10px] font-mono uppercase font-bold hover:bg-[#12100E] hover:text-white transition-colors cursor-pointer">
                    SWAP LOT
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
