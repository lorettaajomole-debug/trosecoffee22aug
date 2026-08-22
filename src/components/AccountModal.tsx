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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#211C1A]/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      <div 
        id="account-modal-container"
        className="relative w-full max-w-2xl bg-[#FDFBF7] rounded-2xl shadow-2xl border border-[#E5E5CB] overflow-hidden flex flex-col my-8"
      >
        {/* Header */}
        <div className="bg-[#3C2A21] text-[#FDFBF7] p-6 sm:p-8 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-[#C5A059] text-[#211C1A] flex items-center justify-center font-serif text-xl font-bold border-2 border-white/20">
              JS
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-serif font-normal">Julian Sterling</h3>
                <span className="px-2 py-0.5 bg-[#C5A059] text-[#211C1A] text-[9px] font-mono font-bold uppercase tracking-wider rounded">
                  VIP Roaster Tier
                </span>
              </div>
              <p className="text-xs text-[#FDFBF7]/75 font-light">Member since 2024 • lorettaajomole@gmail.com</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#FDFBF7]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E5E5CB] bg-white text-xs font-semibold uppercase tracking-wider">
          {[
            { id: 'profile', label: 'Roaster Profile', icon: User },
            { id: 'orders', label: 'Order History', icon: Package },
            { id: 'subscription', label: 'Active Club', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3.5 flex items-center justify-center space-x-2 border-b-2 transition-colors cursor-pointer text-xs font-medium ${
                  activeTab === tab.id
                    ? 'border-[#C5A059] text-[#3C2A21] bg-[#FDFBF7]'
                    : 'border-transparent text-[#7E7067] hover:text-[#3C2A21]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#C5A059]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {activeTab === 'profile' && (
            <div className="space-y-5">
              
              {/* Points Banner */}
              <div className="p-4 rounded-xl bg-[#E5E5CB]/30 border border-[#E5E5CB] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-[#C5A059]" />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#7E7067] font-mono block">Tasting Loyalty Points</span>
                    <span className="text-xl font-serif font-medium text-[#3C2A21]">520 Points Available</span>
                  </div>
                </div>
                <span className="text-xs bg-[#3C2A21] text-white px-3 py-1.5 rounded-lg font-mono">
                  Redeem $25 Reward
                </span>
              </div>

              {/* Saved Palate Preferences */}
              <div className="space-y-2">
                <h4 className="text-sm font-serif font-semibold text-[#3C2A21]">Saved Palate Profile</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-[#E5E5CB]">
                    <span className="text-[#7E7067] block font-light">Preferred Method:</span>
                    <strong className="text-[#3C2A21] font-medium">Pour-Over (Chemex / V60)</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#E5E5CB]">
                    <span className="text-[#7E7067] block font-light">Preferred Grind:</span>
                    <strong className="text-[#3C2A21] font-medium">Medium-Fine (Whole Bean)</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#E5E5CB]">
                    <span className="text-[#7E7067] block font-light">Aromatic Notes:</span>
                    <strong className="text-[#3C2A21] font-medium">Floral, Jasmine, Stonefruit</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#E5E5CB]">
                    <span className="text-[#7E7067] block font-light">Organic Lots:</span>
                    <strong className="text-[#3C2A21] font-medium">Preferred (USDA Certified)</strong>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              <div className="p-4 bg-white rounded-xl border border-[#E5E5CB] space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-[#E5E5CB] pb-2">
                  <div>
                    <span className="font-mono font-semibold text-[#3C2A21]">#TR-893041</span>
                    <span className="text-[#7E7067] ml-2 font-light">• August 12, 2026</span>
                  </div>
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded font-mono text-[9px] uppercase">
                    Delivered
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <img
                    src="https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=200&q=80"
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover bg-[#211C1A]"
                  />
                  <div className="flex-1">
                    <h5 className="font-serif font-medium text-[#3C2A21]">TROSE Grand Reserve Yirgacheffe</h5>
                    <span className="text-[#7E7067] font-light">Whole Bean • 12 oz (340g) x 2</span>
                  </div>
                  <span className="font-serif font-semibold text-[#3C2A21]">$49.00</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#E5E5CB] space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-[#E5E5CB] pb-2">
                  <div>
                    <span className="font-mono font-semibold text-[#3C2A21]">#TR-744192</span>
                    <span className="text-[#7E7067] ml-2 font-light">• July 18, 2026</span>
                  </div>
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded font-mono text-[9px] uppercase">
                    Delivered
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <img
                    src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=200&q=80"
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover bg-[#211C1A]"
                  />
                  <div className="flex-1">
                    <h5 className="font-serif font-medium text-[#3C2A21]">TROSE Organic Marcala Reserve</h5>
                    <span className="text-[#7E7067] font-light">Pour Over Grind • 12 oz (340g)</span>
                  </div>
                  <span className="font-serif font-semibold text-[#3C2A21]">$25.00</span>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="space-y-4">
              
              <div className="p-5 bg-white rounded-xl border border-[#C5A059]/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-[#C5A059]" />
                    <h4 className="text-base font-serif font-medium text-[#3C2A21]">Active Roaster’s Concierge Club</h4>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#E5E5CB]/40 text-[#C5A059] font-mono text-[10px] uppercase font-bold rounded">
                    Every 2 Weeks
                  </span>
                </div>

                <p className="text-xs text-[#3C2A21]/75 font-light">
                  Next roast scheduled: <strong className="text-[#3C2A21] font-medium">September 01, 2026</strong>. Free climate-neutral priority shipment.
                </p>

                <div className="pt-2 border-t border-[#E5E5CB] flex items-center justify-between text-xs">
                  <button className="text-[#C5A059] font-medium hover:underline cursor-pointer">
                    Change Frequency / Swap Beans
                  </button>
                  <button className="text-[#7E7067] hover:text-red-600 font-light cursor-pointer">
                    Pause Subscription
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

