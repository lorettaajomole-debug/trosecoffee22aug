import React, { useState } from 'react';
import { X, Sparkles, Coffee, RotateCcw, ShoppingBag } from 'lucide-react';
import { Product, GrindOption } from '../types';

interface CoffeeQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product, grind?: GrindOption, quantity?: number) => void;
  onQuickView: (product: Product) => void;
}

export const CoffeeQuizModal: React.FC<CoffeeQuizModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddToCart,
  onQuickView
}) => {
  const [step, setStep] = useState<number>(1);
  const [brewMethod, setBrewMethod] = useState<string>('');
  const [flavorProfile, setFlavorProfile] = useState<string>('');
  const [organicPreference, setOrganicPreference] = useState<string>('');

  if (!isOpen) return null;

  const handleReset = () => {
    setStep(1);
    setBrewMethod('');
    setFlavorProfile('');
    setOrganicPreference('');
  };

  // Determine recommendation based on choices
  const getRecommendation = (): Product => {
    const coffeeOnly = products.filter((p) => p.category === 'coffee' || p.category === 'organic');

    if (organicPreference === 'organic-only') {
      if (flavorProfile === 'floral-citrus' || flavorProfile === 'fruity') {
        return products.find((p) => p.id === 'trose-organic-peru-cajamarca') || coffeeOnly[0];
      }
      if (flavorProfile === 'smoky-dark') {
        return products.find((p) => p.id === 'trose-organic-sumatra-gayo-dark') || coffeeOnly[0];
      }
      return products.find((p) => p.id === 'trose-organic-honduras-marcala') || coffeeOnly[0];
    }

    if (brewMethod === 'espresso') {
      return products.find((p) => p.id === 'trose-velvet-noir-espresso') || coffeeOnly[0];
    }

    if (flavorProfile === 'floral-citrus') {
      return products.find((p) => p.id === 'trose-reserve-ethiopia-yirgacheffe') || coffeeOnly[0];
    }

    if (flavorProfile === 'chocolate-toffee') {
      return products.find((p) => p.id === 'trose-guatemala-antigua-estate') || coffeeOnly[0];
    }

    return products.find((p) => p.id === 'trose-connoisseur-gift-flight') || coffeeOnly[0];
  };

  const matchedProduct = getRecommendation();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#211C1A]/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      <div 
        id="coffee-quiz-container"
        className="relative w-full max-w-xl bg-[#FDFBF7] rounded-2xl shadow-2xl border border-[#E5E5CB] overflow-hidden flex flex-col my-8"
      >
        {/* Header Ribbon */}
        <div className="bg-[#3C2A21] text-[#FDFBF7] px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span className="font-serif tracking-widest text-xs uppercase text-[#E5C378]">TROSE Flavor Matcher</span>
          </div>

          <button
            id="close-quiz-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-[#FDFBF7]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close quiz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E5E5CB] h-1">
          <div
            className="bg-[#C5A059] h-1 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-mono font-bold">Step 1 of 3</span>
                <h3 className="text-2xl font-serif font-normal text-[#3C2A21]">How do you prepare your coffee ritual?</h3>
                <p className="text-xs text-[#7E7067] font-light">Select your primary morning extraction technique.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'espresso', label: 'Espresso / Lever Machine', desc: 'Concentrated 9-bar extraction' },
                  { id: 'pour-over', label: 'Pour-Over / Chemex / V60', desc: 'Delicate, clear floral clarity' },
                  { id: 'french-press', label: 'French Press / Immersion', desc: 'Heavy, syrupy full-body' },
                  { id: 'drip-moka', label: 'Drip Maker / Moka Pot', desc: 'Classic comfort daily brew' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setBrewMethod(item.id);
                      setStep(2);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      brewMethod === item.id
                        ? 'border-[#3C2A21] bg-[#3C2A21] text-white shadow-xs'
                        : 'border-[#E5E5CB] bg-white hover:border-[#C5A059] hover:bg-[#E5E5CB]/20'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-semibold">{item.label}</span>
                      <Coffee className="w-3.5 h-3.5 opacity-70" />
                    </div>
                    <span className={`text-[11px] font-light ${brewMethod === item.id ? 'text-[#FDFBF7]/80' : 'text-[#7E7067]'}`}>
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-mono font-bold">Step 2 of 3</span>
                <h3 className="text-2xl font-serif font-normal text-[#3C2A21]">What flavor profiles resonate with your palate?</h3>
                <p className="text-xs text-[#7E7067] font-light">Select the dominant aromatic notes you crave.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'floral-citrus', label: 'Floral, Jasmine & Stonefruit', desc: 'Bright, tea-like, elegant acidity' },
                  { id: 'chocolate-toffee', label: 'Milk Chocolate & Sweet Toffee', desc: 'Balanced, caramel sweetness' },
                  { id: 'smoky-dark', label: 'Dark Cacao & Smoky Cedar', desc: 'Deep, heavy, zero bitterness' },
                  { id: 'fruity', label: 'Berry, Fig & Salted Caramel', desc: 'Complex, dense sweetness' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setFlavorProfile(item.id);
                      setStep(3);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      flavorProfile === item.id
                        ? 'border-[#3C2A21] bg-[#3C2A21] text-white shadow-xs'
                        : 'border-[#E5E5CB] bg-white hover:border-[#C5A059] hover:bg-[#E5E5CB]/20'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-semibold">{item.label}</span>
                    </div>
                    <span className={`text-[11px] font-light ${flavorProfile === item.id ? 'text-[#FDFBF7]/80' : 'text-[#7E7067]'}`}>
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(1)}
                className="text-xs text-[#7E7067] hover:text-[#3C2A21] underline flex items-center space-x-1 cursor-pointer font-light"
              >
                <span>Back to Step 1</span>
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-mono font-bold">Step 3 of 3</span>
                <h3 className="text-2xl font-serif font-normal text-[#3C2A21]">Do you prefer 100% Certified Organic roasts?</h3>
                <p className="text-xs text-[#7E7067] font-light">USDA certified shade-grown micro-lots or general specialty lots.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'organic-only', label: '100% USDA Organic Only', desc: 'Fair Trade & zero synthetic fertilizers' },
                  { id: 'any-specialty', label: 'Open to All Specialty Lots', desc: 'Highest SCAA 88+ cupping score focus' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setOrganicPreference(item.id);
                      setStep(4);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      organicPreference === item.id
                        ? 'border-[#3C2A21] bg-[#3C2A21] text-white shadow-xs'
                        : 'border-[#E5E5CB] bg-white hover:border-[#C5A059] hover:bg-[#E5E5CB]/20'
                    }`}
                  >
                    <span className="text-xs font-semibold mb-1">{item.label}</span>
                    <span className={`text-[11px] font-light ${organicPreference === item.id ? 'text-[#FDFBF7]/80' : 'text-[#7E7067]'}`}>
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="text-xs text-[#7E7067] hover:text-[#3C2A21] underline flex items-center space-x-1 cursor-pointer font-light"
              >
                <span>Back to Step 2</span>
              </button>
            </div>
          )}

          {step === 4 && matchedProduct && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-[#E5E5CB]/40 text-[#C5A059] rounded text-[10px] font-mono font-bold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Your Bespoke Roast Match</span>
                </div>
                <h3 className="text-3xl font-serif font-normal text-[#3C2A21]">
                  {matchedProduct.name}
                </h3>
                <p className="text-xs text-[#7E7067] font-mono">{matchedProduct.origin || matchedProduct.subtitle}</p>
              </div>

              {/* Matched Card Preview */}
              <div className="p-4 bg-white rounded-xl border border-[#E5E5CB] shadow-xs flex items-center space-x-4">
                <img
                  src={matchedProduct.images[0]}
                  alt={matchedProduct.name}
                  className="w-24 h-24 rounded-lg object-cover bg-[#211C1A]"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    {matchedProduct.isOrganic && (
                      <span className="px-2 py-0.5 bg-[#3C2A21] text-[#E5C378] text-[9px] font-mono font-bold uppercase rounded">
                        USDA Organic
                      </span>
                    )}
                    {matchedProduct.roastLevel && (
                      <span className="text-xs font-medium text-[#C5A059]">{matchedProduct.roastLevel}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {matchedProduct.tastingNotes?.slice(0, 3).map((note) => (
                      <span key={note} className="px-2 py-0.5 bg-[#E5E5CB]/40 text-[#3C2A21] text-[10px] rounded">
                        {note}
                      </span>
                    ))}
                  </div>
                  <div className="text-base font-serif font-semibold text-[#3C2A21] pt-1">
                    ${matchedProduct.price.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  id="quiz-add-match-btn"
                  onClick={() => {
                    onAddToCart(matchedProduct, matchedProduct.availableGrinds ? matchedProduct.availableGrinds[0] : undefined, 1);
                    onClose();
                  }}
                  className="w-full py-3.5 bg-[#3C2A21] hover:bg-[#211C1A] text-white text-xs uppercase tracking-widest font-bold rounded-lg shadow-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                  <span>Add Match to Bag • ${matchedProduct.price.toFixed(2)}</span>
                </button>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <button
                    onClick={() => {
                      onClose();
                      onQuickView(matchedProduct);
                    }}
                    className="text-[#3C2A21] hover:text-[#C5A059] underline font-medium cursor-pointer"
                  >
                    View Full Tasting Profile
                  </button>

                  <button
                    onClick={handleReset}
                    className="text-[#7E7067] hover:text-[#3C2A21] flex items-center space-x-1 cursor-pointer font-light"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Retake Quiz</span>
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

