import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Coffee, 
  RotateCcw, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Share2
} from 'lucide-react';
import { 
  Product, 
  GrindOption, 
  CoffeeEnjoyment, 
  CoffeeFlavourOption, 
  CoffeeStrengthLevel, 
  CoffeeBrewingMethod, 
  CoffeeMoodType,
  CoffeeFinderAnswers,
  CoffeeFinderResult
} from '../types';
import { findPerfectCoffee } from '../services/coffeeFinderService';

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
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [showShareCard, setShowShareCard] = useState<boolean>(false);

  // User Quiz State
  const [enjoyment, setEnjoyment] = useState<CoffeeEnjoyment | undefined>(undefined);
  const [flavours, setFlavours] = useState<CoffeeFlavourOption[]>([]);
  const [strength, setStrength] = useState<CoffeeStrengthLevel>('Balanced');
  const [brewingMethod, setBrewingMethod] = useState<CoffeeBrewingMethod | undefined>(undefined);
  const [mood, setMood] = useState<CoffeeMoodType | undefined>(undefined);

  // Calculated Result
  const [result, setResult] = useState<CoffeeFinderResult | null>(null);

  if (!isOpen) return null;

  const totalSteps = 5;

  const handleReset = () => {
    setCurrentStep(1);
    setIsCalculating(false);
    setEnjoyment(undefined);
    setFlavours([]);
    setStrength('Balanced');
    setBrewingMethod(undefined);
    setMood(undefined);
    setResult(null);
    setCopiedShare(false);
    setShowShareCard(false);
  };

  const handleToggleFlavour = (item: CoffeeFlavourOption) => {
    setFlavours((prev) => 
      prev.includes(item) ? prev.filter((f) => f !== item) : [...prev, item]
    );
  };

  const handleFinishQuiz = (finalMood: CoffeeMoodType) => {
    setMood(finalMood);
    setIsCalculating(true);
    setCurrentStep(6); // Loading / Results state

    const userAnswers: CoffeeFinderAnswers = {
      enjoyment: enjoyment || 'black',
      flavours: flavours.length > 0 ? flavours : ['chocolate-rich', 'caramel-sweet'],
      strength: strength || 'Balanced',
      brewingMethod: brewingMethod || 'pour-over',
      mood: finalMood
    };

    // Calculate real live match with coffeeFinderService
    setTimeout(() => {
      const matchResult = findPerfectCoffee(products, userAnswers);
      setResult(matchResult);
      setIsCalculating(false);
    }, 700);
  };

  const handleShareResult = async () => {
    if (!result) return;
    const shareText = `☕ I took the TROSE Coffee Finder and found my match: ${result.perfectMatch.product.name} (${result.perfectMatch.score}% match)! "${result.perfectMatch.shareablePersona}" Find yours at TROSE Coffee & More.`;
    
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
      }
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    } catch (e) {
      setShowShareCard(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#12100E]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div 
        id="coffee-finder-modal"
        className="relative w-full max-w-2xl bg-[#FAF7F2] shadow-2xl border border-[#12100E] overflow-hidden flex flex-col my-4 sm:my-8 transition-all"
      >
        {/* Header Ribbon */}
        <div className="bg-[#12100E] text-[#FAF7F2] px-5 sm:px-8 py-3.5 flex items-center justify-between border-b border-[#12100E]">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/trose-logo.svg"
              alt="Official TROSE Seal"
              className="w-7 h-7 object-contain"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.endsWith('.png')) target.src = '/assets/trose-logo.png';
              }}
            />
            <div>
              <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-[#C5A059] font-bold block">
                TROSE TASTING SYSTEM
              </span>
              <h2 className="text-xs font-editorial font-bold uppercase tracking-wider text-[#FAF7F2]">
                Coffee Finder · Palate Matching
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {currentStep > 1 && currentStep <= totalSteps && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-[#FAF7F2]/70 hover:text-white flex items-center space-x-1 cursor-pointer transition-colors"
                aria-label="Previous question"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            <button
              id="close-coffee-finder-btn"
              onClick={onClose}
              className="w-7 h-7 border border-white/20 bg-white/10 hover:bg-[#D62828] text-[#FAF7F2] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Coffee Finder"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stepped Progress Bar */}
        {currentStep <= totalSteps && (
          <div className="w-full bg-[#12100E]/10 h-1 relative">
            <div
              className="bg-[#D62828] h-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-5 sm:p-8 md:p-10 max-h-[80vh] overflow-y-auto">
          
          {/* QUESTION 1 — HOW DO YOU LIKE YOUR COFFEE? */}
          {currentStep === 1 && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">
              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] font-bold px-2 py-0.5 border border-[#12100E]/20 bg-[#FDFBF7]">
                    STEP 01 / 05
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-bold uppercase tracking-tight text-[#12100E]">
                  How do you usually enjoy your coffee?
                </h3>
                <p className="text-xs sm:text-sm text-[#69574A] font-sans">
                  Select the ritual that starts your morning best.
                </p>
              </div>

              {/* 4 Selectable Cards (Zero pills, sharp Bauhaus boxes) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    id: 'black' as CoffeeEnjoyment,
                    emoji: '☕',
                    title: 'Black',
                    desc: 'Pure, clear origin notes with bright aroma and natural sweetness.'
                  },
                  {
                    id: 'milk' as CoffeeEnjoyment,
                    emoji: '🥛',
                    title: 'With milk',
                    desc: 'Lattes, flat whites, oat, or almond milk creamy pairing.'
                  },
                  {
                    id: 'iced' as CoffeeEnjoyment,
                    emoji: '🧊',
                    title: 'Iced',
                    desc: 'Cold brew, espresso over ice, or refreshing chilled pours.'
                  },
                  {
                    id: 'mood' as CoffeeEnjoyment,
                    emoji: '✨',
                    title: 'Depends on my mood',
                    desc: 'Versatile beans that taste sublime across multiple brew styles.'
                  }
                ].map((opt) => {
                  const isSelected = enjoyment === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setEnjoyment(opt.id);
                        setTimeout(() => setCurrentStep(2), 180);
                      }}
                      className={`p-5 border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'border-[#12100E] bg-[#12100E] text-white shadow-md'
                          : 'border-[#12100E]/15 bg-[#FDFBF7] hover:border-[#12100E] text-[#12100E]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <span className="text-3xl">
                          {opt.emoji}
                        </span>
                        <div className={`w-5 h-5 flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-[#D62828] border-[#D62828] text-white' : 'border-[#12100E]/20 bg-transparent'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base font-editorial font-bold uppercase tracking-tight mb-1">
                          {opt.title}
                        </h4>
                        <p className={`text-xs leading-relaxed font-sans ${
                          isSelected ? 'text-[#FAF7F2]/80' : 'text-[#69574A]'
                        }`}>
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUESTION 2 — FLAVOUR */}
          {currentStep === 2 && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">
              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] font-bold px-2 py-0.5 border border-[#12100E]/20 bg-[#FDFBF7]">
                    STEP 02 / 05
                  </span>
                  <span className="text-xs text-[#69574A] font-mono">Select one or more</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-bold uppercase tracking-tight text-[#12100E]">
                  What sounds delicious to you?
                </h3>
                <p className="text-xs sm:text-sm text-[#69574A] font-sans">
                  Pick the tasting notes your palate craves.
                </p>
              </div>

              {/* Multi-Select Flavour Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    id: 'chocolate-rich' as CoffeeFlavourOption,
                    emoji: '🍫',
                    title: 'Chocolatey & rich',
                    subtitle: 'Dark cocoa, fudge, molasses'
                  },
                  {
                    id: 'caramel-sweet' as CoffeeFlavourOption,
                    emoji: '🍯',
                    title: 'Caramel & sweet',
                    subtitle: 'Toffee, brown sugar, honeycomb'
                  },
                  {
                    id: 'fruity-bright' as CoffeeFlavourOption,
                    emoji: '🍓',
                    title: 'Fruity & bright',
                    subtitle: 'Blackcurrant, peach, red berries'
                  },
                  {
                    id: 'nutty-smooth' as CoffeeFlavourOption,
                    emoji: '🥜',
                    title: 'Nutty & smooth',
                    subtitle: 'Roasted hazelnut, almond praline'
                  },
                  {
                    id: 'bold-intense' as CoffeeFlavourOption,
                    emoji: '🔥',
                    title: 'Bold & intense',
                    subtitle: 'Smoky cedar, deep 72% cacao'
                  },
                  {
                    id: 'light-delicate' as CoffeeFlavourOption,
                    emoji: '🌿',
                    title: 'Light & delicate',
                    subtitle: 'Jasmine, bergamot, tea florals'
                  }
                ].map((item) => {
                  const isChecked = flavours.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleToggleFlavour(item.id)}
                      className={`p-4 sm:p-5 border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                        isChecked
                          ? 'border-[#12100E] bg-[#12100E] text-white shadow-md'
                          : 'border-[#12100E]/15 bg-[#FDFBF7] hover:border-[#12100E] text-[#12100E]'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <span className="text-2xl sm:text-3xl">
                          {item.emoji}
                        </span>
                        <div>
                          <h4 className="text-sm font-editorial font-bold uppercase tracking-tight">
                            {item.title}
                          </h4>
                          <span className={`text-[11px] font-mono block ${
                            isChecked ? 'text-[#FAF7F2]/75' : 'text-[#69574A]'
                          }`}>
                            {item.subtitle}
                          </span>
                        </div>
                      </div>

                      <div className={`w-5 h-5 flex items-center justify-center border transition-colors shrink-0 ml-2 ${
                        isChecked 
                          ? 'bg-[#D62828] border-[#D62828] text-white' 
                          : 'border-[#12100E]/20 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Continue Button */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-mono uppercase tracking-wider font-bold text-[#69574A] hover:text-[#12100E] flex items-center space-x-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>PREVIOUS</span>
                </button>

                <button
                  onClick={() => {
                    if (flavours.length === 0) {
                      setFlavours(['chocolate-rich', 'caramel-sweet']);
                    }
                    setCurrentStep(3);
                  }}
                  className="px-8 py-3.5 bg-[#12100E] hover:bg-[#D62828] text-white text-xs font-mono uppercase tracking-[0.2em] font-bold transition-all shadow-xs flex items-center space-x-2 cursor-pointer"
                >
                  <span>CONTINUE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* QUESTION 3 — STRENGTH */}
          {currentStep === 3 && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">
              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] font-bold px-2 py-0.5 border border-[#12100E]/20 bg-[#FDFBF7]">
                    STEP 03 / 05
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-bold uppercase tracking-tight text-[#12100E]">
                  How bold do you like it?
                </h3>
                <p className="text-xs sm:text-sm text-[#69574A] font-sans">
                  Select your preferred roast depth and intensity.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    level: 'Smooth' as CoffeeStrengthLevel,
                    roast: 'Light Roast',
                    beans: '🫘',
                    desc: 'Gentle, tea-like clarity with sparkling floral & fruit brightness.',
                    barWidth: '25%'
                  },
                  {
                    level: 'Balanced' as CoffeeStrengthLevel,
                    roast: 'Medium Roast',
                    beans: '🫘🫘',
                    desc: 'Crowd-pleaser equilibrium with golden toffee and milk chocolate.',
                    barWidth: '50%'
                  },
                  {
                    level: 'Bold' as CoffeeStrengthLevel,
                    roast: 'Medium-Dark',
                    beans: '🫘🫘🫘',
                    desc: 'Rich, syrupy mouthfeel with dark cacao and toasted hazelnut.',
                    barWidth: '75%'
                  },
                  {
                    level: 'Very Bold' as CoffeeStrengthLevel,
                    roast: 'Espresso Roast',
                    beans: '🫘🫘🫘🫘',
                    desc: 'Deepest intensity, heavy crema, zero sharpness, cuts through milk.',
                    barWidth: '100%'
                  }
                ].map((item) => {
                  const isSelected = strength === item.level;
                  return (
                    <button
                      key={item.level}
                      onClick={() => {
                        setStrength(item.level);
                        setTimeout(() => setCurrentStep(4), 180);
                      }}
                      className={`p-5 border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'border-[#12100E] bg-[#12100E] text-white shadow-md'
                          : 'border-[#12100E]/15 bg-[#FDFBF7] hover:border-[#12100E] text-[#12100E]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base tracking-widest font-mono">
                          {item.beans}
                        </span>
                        <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 border ${
                          isSelected ? 'border-white/30 text-[#FAF7F2]' : 'border-[#12100E]/20 text-[#69574A] bg-white'
                        }`}>
                          {item.roast}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-editorial font-bold uppercase tracking-tight mb-1">
                          {item.level}
                        </h4>
                        <p className={`text-xs leading-relaxed font-sans ${
                          isSelected ? 'text-[#FAF7F2]/80' : 'text-[#69574A]'
                        }`}>
                          {item.desc}
                        </p>
                      </div>

                      <div className="w-full bg-[#12100E]/10 h-1 mt-4 overflow-hidden">
                        <div
                          className={`h-full ${isSelected ? 'bg-[#D62828]' : 'bg-[#12100E]'}`}
                          style={{ width: item.barWidth }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUESTION 4 — BREWING METHOD */}
          {currentStep === 4 && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">
              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] font-bold px-2 py-0.5 border border-[#12100E]/20 bg-[#FDFBF7]">
                    STEP 04 / 05
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-bold uppercase tracking-tight text-[#12100E]">
                  How are you making your coffee?
                </h3>
                <p className="text-xs sm:text-sm text-[#69574A] font-sans">
                  We will pair you with beans dialed for your brewing equipment.
                </p>
              </div>

              {/* 8 Brew Methods (Bauhaus grid) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'espresso-machine' as CoffeeBrewingMethod, label: 'Espresso Machine', icon: '☕', sub: '9-bar pump' },
                  { id: 'coffee-machine' as CoffeeBrewingMethod, label: 'Coffee Machine', icon: '🫖', sub: 'Automatic drip' },
                  { id: 'french-press' as CoffeeBrewingMethod, label: 'French Press', icon: '⏱️', sub: 'Immersion steep' },
                  { id: 'pour-over' as CoffeeBrewingMethod, label: 'Pour Over', icon: '💧', sub: 'V60 / Chemex' },
                  { id: 'moka-pot' as CoffeeBrewingMethod, label: 'Moka Pot', icon: '🔥', sub: 'Stovetop' },
                  { id: 'capsules' as CoffeeBrewingMethod, label: 'Capsules', icon: '🔘', sub: 'Pod extraction' },
                  { id: 'instant-easy' as CoffeeBrewingMethod, label: 'Instant / Easy', icon: '⚡', sub: 'Cold brew & quick' },
                  { id: 'not-sure' as CoffeeBrewingMethod, label: "I'm not sure", icon: '✨', sub: 'All-round beans' }
                ].map((item) => {
                  const isSelected = brewingMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setBrewingMethod(item.id);
                        setTimeout(() => setCurrentStep(5), 180);
                      }}
                      className={`p-4 border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-between group ${
                        isSelected
                          ? 'border-[#12100E] bg-[#12100E] text-white shadow-md'
                          : 'border-[#12100E]/15 bg-[#FDFBF7] hover:border-[#12100E] text-[#12100E]'
                      }`}
                    >
                      <span className="text-3xl mb-2">
                        {item.icon}
                      </span>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-tight line-clamp-1">
                        {item.label}
                      </h4>
                      <span className={`text-[9px] font-mono mt-0.5 ${
                        isSelected ? 'text-[#FAF7F2]/70' : 'text-[#69574A]'
                      }`}>
                        {item.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUESTION 5 — YOUR COFFEE MOOD */}
          {currentStep === 5 && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">
              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] font-bold px-2 py-0.5 border border-[#12100E]/20 bg-[#FDFBF7]">
                    STEP 05 / 05 · FINAL STEP
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-bold uppercase tracking-tight text-[#12100E]">
                  What's your coffee moment?
                </h3>
                <p className="text-xs sm:text-sm text-[#69574A] font-sans">
                  What atmosphere surrounds your favorite cup?
                </p>
              </div>

              {/* 6 Mood Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    id: 'wake-up' as CoffeeMoodType,
                    emoji: '🌅',
                    title: 'Wake Me Up',
                    desc: 'High energy kickstart for sunrise momentum.'
                  },
                  {
                    id: 'work-mode' as CoffeeMoodType,
                    emoji: '💻',
                    title: 'Work Mode',
                    desc: 'Deep focus companion for creative desk sessions.'
                  },
                  {
                    id: 'slow-morning' as CoffeeMoodType,
                    emoji: '🧘',
                    title: 'Slow Morning',
                    desc: 'Mindful weekend ritual with zero rush.'
                  },
                  {
                    id: 'dessert' as CoffeeMoodType,
                    emoji: '🍰',
                    title: 'Coffee & Dessert',
                    desc: 'Silky pairing alongside artisan chocolate or pastries.'
                  },
                  {
                    id: 'friends' as CoffeeMoodType,
                    emoji: '🫶',
                    title: 'Catching Up With Friends',
                    desc: 'Warm hospitality and comforting conversations.'
                  },
                  {
                    id: 'gift' as CoffeeMoodType,
                    emoji: '🎁',
                    title: "I'm Buying A Gift",
                    desc: 'Premium presentation flight to impress someone special.'
                  }
                ].map((item) => {
                  const isSelected = mood === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleFinishQuiz(item.id)}
                      className={`p-4 border text-left transition-all duration-200 cursor-pointer flex items-center space-x-4 group ${
                        isSelected
                          ? 'border-[#12100E] bg-[#12100E] text-white shadow-md'
                          : 'border-[#12100E]/15 bg-[#FDFBF7] hover:border-[#12100E] text-[#12100E]'
                      }`}
                    >
                      <span className="text-3xl shrink-0">
                        {item.emoji}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-sm font-editorial font-bold uppercase tracking-tight mb-0.5">
                          {item.title}
                        </h4>
                        <p className={`text-xs leading-relaxed font-sans ${
                          isSelected ? 'text-[#FAF7F2]/80' : 'text-[#69574A]'
                        }`}>
                          {item.desc}
                        </p>
                      </div>
                      <ArrowRight className={`w-4 h-4 ${
                        isSelected ? 'text-[#C5A059]' : 'text-[#69574A]'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6 — LOADING / PROCESSING ANIMATION */}
          {currentStep === 6 && isCalculating && (
            <div className="py-14 sm:py-20 text-center space-y-6 animate-fadeIn flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 border border-[#12100E] bg-[#FAF7F2] flex items-center justify-center">
                <Coffee className="w-7 h-7 text-[#D62828] animate-bounce" />
              </div>

              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-xl font-editorial font-bold uppercase text-[#12100E]">
                  Matching Your Taste Profile...
                </h3>
                <p className="text-xs font-mono text-[#69574A]">
                  Comparing acidity, roast depth, and origin notes with our small-batch roastery lots.
                </p>
              </div>
            </div>
          )}

          {/* RESULTS PAGE — PERFECT MATCH + ALSO TRY */}
          {currentStep === 6 && !isCalculating && result && (
            <div className="space-y-8 animate-fadeIn text-left">
              
              {/* Results Hero Heading */}
              <div className="text-center space-y-2 border-b border-[#12100E]/15 pb-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#12100E] text-[#C5A059] border border-[#12100E] text-[10px] font-mono font-bold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{result.perfectMatch.score}% MATCH WITH YOUR PALATE</span>
                </div>

                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold uppercase tracking-tight text-[#12100E]">
                  WE FOUND YOUR COFFEE ☕
                </h3>
                
                <p className="text-xs sm:text-sm text-[#69574A] font-sans">
                  Based on your taste, we think you'll love...
                </p>
              </div>

              {/* PERFECT MATCH CARD (Bauhaus Packaging Layout) */}
              <div className="bg-[#D4B896] border border-[#12100E] p-6 sm:p-8 space-y-6 shadow-xl text-[#12100E]">
                
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#12100E] pb-3 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-[#D62828] text-white text-[10px] uppercase font-bold tracking-wider">
                      PERFECT MATCH
                    </span>
                    <span className="text-[#12100E] font-bold">
                      {result.perfectMatch.shareablePersona}
                    </span>
                  </div>

                  <span className="text-xl font-bold font-mono text-[#12100E]">
                    ${result.perfectMatch.product.price.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Left: Product Image */}
                  <div className="md:col-span-5 relative aspect-square bg-[#FAF7F2] border border-[#12100E] overflow-hidden">
                    <img
                      src={result.perfectMatch.product.images[0]}
                      alt={result.perfectMatch.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {result.perfectMatch.product.isOrganic && (
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#12100E] text-white text-[9px] font-mono font-bold uppercase">
                        BIO ORGANIC
                      </div>
                    )}
                  </div>

                  {/* Right: Info & Explanations */}
                  <div className="md:col-span-7 space-y-3.5">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#69574A] font-bold block">
                        {result.perfectMatch.product.origin || 'ARTISAN LOT'}
                      </span>
                      <h4 className="text-2xl font-editorial font-bold uppercase text-[#12100E] tracking-tight">
                        {result.perfectMatch.product.name}
                      </h4>
                      <p className="text-xs text-[#12100E]/80 mt-1 font-sans line-clamp-2">
                        {result.perfectMatch.product.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-mono uppercase text-[#12100E]">
                        ROAST: <strong>{result.perfectMatch.product.roastLevel || 'Artisan Medium'}</strong>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {result.perfectMatch.product.tastingNotes?.map((note) => (
                          <span 
                            key={note} 
                            className="px-2 py-0.5 bg-[#FAF7F2] text-[#12100E] text-[10px] font-mono uppercase border border-[#12100E]/20"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* "Why You'll Love It" */}
                    <div className="p-3 bg-[#FAF7F2] border border-[#12100E]/20 space-y-1 text-xs">
                      <div className="flex items-center space-x-1.5 text-[#D62828] font-mono text-[10px] font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Why you'll love it</span>
                      </div>
                      <p className="text-xs text-[#12100E]/90 italic font-sans">
                        "{result.perfectMatch.whyYoullLoveIt}"
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                      <button
                        id="coffee-finder-add-to-bag"
                        onClick={() => {
                          onAddToCart(
                            result.perfectMatch.product,
                            result.perfectMatch.product.availableGrinds ? result.perfectMatch.product.availableGrinds[0] : undefined,
                            1
                          );
                          onClose();
                        }}
                        className="w-full sm:flex-1 py-3.5 bg-[#12100E] hover:bg-[#261C14] text-white text-xs font-mono uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                        <span>ADD TO TASTING BAG</span>
                      </button>

                      <button
                        id="coffee-finder-view-product"
                        onClick={() => {
                          onClose();
                          onQuickView(result.perfectMatch.product);
                        }}
                        className="w-full sm:w-auto px-5 py-3.5 bg-white border border-[#12100E] text-[#12100E] text-xs font-mono uppercase tracking-wider font-bold hover:bg-[#FAF7F2] transition-colors cursor-pointer text-center"
                      >
                        DETAILS →
                      </button>
                    </div>

                  </div>

                </div>

              </div>

              {/* YOU MIGHT ALSO LOVE (Also Try) */}
              {result.alternatives.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b border-[#12100E]/15 pb-2">
                    <h4 className="text-lg font-editorial font-bold uppercase text-[#12100E]">
                      You Might Also Love
                    </h4>
                    <span className="text-[10px] text-[#69574A] font-mono uppercase">SECONDARY PAIRINGS</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.alternatives.map((alt) => (
                      <div
                        key={alt.product.id}
                        className="p-4 bg-[#FDFBF7] border border-[#12100E]/15 hover:border-[#12100E] transition-colors flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={alt.product.images[0]}
                            alt={alt.product.name}
                            className="w-16 h-16 object-cover bg-[#F2E8DC] shrink-0 border border-[#12100E]/15"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-mono font-bold uppercase text-[#C5A059] block">
                              {alt.score}% MATCH · {alt.product.roastLevel || 'Roast'}
                            </span>
                            <h5 className="text-xs font-editorial font-bold uppercase text-[#12100E] line-clamp-1">
                              {alt.product.name}
                            </h5>
                            <div className="text-xs font-mono font-bold text-[#12100E]">
                              ${alt.product.price.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2 border-t border-[#12100E]/10">
                          <button
                            onClick={() => {
                              onAddToCart(
                                alt.product,
                                alt.product.availableGrinds ? alt.product.availableGrinds[0] : undefined,
                                1
                              );
                              onClose();
                            }}
                            className="flex-1 py-2 bg-[#12100E] hover:bg-[#D62828] text-white text-[10px] font-mono uppercase font-bold tracking-wider transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            <ShoppingBag className="w-3 h-3 text-[#C5A059]" />
                            <span>Add</span>
                          </button>

                          <button
                            onClick={() => {
                              onClose();
                              onQuickView(alt.product);
                            }}
                            className="px-3 py-2 bg-white border border-[#12100E]/20 text-[#12100E] text-[10px] font-mono uppercase font-bold hover:border-[#12100E] transition-colors cursor-pointer"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FOOTER ACTIONS */}
              <div className="pt-4 border-t border-[#12100E]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  id="coffee-finder-share-btn"
                  onClick={handleShareResult}
                  className="w-full sm:w-auto px-5 py-3 border border-[#12100E] bg-white text-[#12100E] text-xs font-mono uppercase tracking-wider font-bold hover:bg-[#FAF7F2] transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#D62828]" />
                  <span>{copiedShare ? 'MATCH COPIED!' : 'SHARE MATCH'}</span>
                </button>

                <button
                  id="coffee-finder-retake-btn"
                  onClick={handleReset}
                  className="text-xs font-mono uppercase tracking-wider font-bold text-[#69574A] hover:text-[#12100E] flex items-center space-x-1.5 cursor-pointer py-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RETAKE COFFEE FINDER</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
};
