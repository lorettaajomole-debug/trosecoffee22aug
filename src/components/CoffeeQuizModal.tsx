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
  Flame, 
  Share2, 
  Heart, 
  Info,
  Gift,
  Sun,
  Laptop,
  Smile,
  CupSoda,
  Sliders,
  CheckCircle2,
  Copy
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

    // Simulate sensory calculation animation
    setTimeout(() => {
      const matchResult = findPerfectCoffee(products, userAnswers);
      setResult(matchResult);
      setIsCalculating(false);
    }, 700);
  };

  const handleShareResult = async () => {
    if (!result) return;
    const shareText = `Apparently I'm a "${result.perfectMatch.shareablePersona}"! My perfect cup is TROSE ${result.perfectMatch.product.name} (${result.perfectMatch.score}% Match ☕). Find yours at TROSE Coffee & More!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My TROSE Coffee Match',
          text: shareText,
          url: window.location.href
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    } catch (e) {
      setShowShareCard(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div 
        id="coffee-finder-modal"
        className="relative w-full max-w-2xl bg-[#FAF6F0] rounded-3xl shadow-2xl border border-[#E8DFD5] overflow-hidden flex flex-col my-4 sm:my-8 transition-all"
      >
        {/* Header Ribbon */}
        <div className="bg-[#241712] text-[#FAF6F0] px-5 sm:px-8 py-4 flex items-center justify-between border-b border-[#3A271E]">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#D63426] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#E65F38] font-bold block">
                TROSE Signature
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#FAF6F0]">
                Find Your Perfect Coffee
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {currentStep > 1 && currentStep <= totalSteps && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="text-[11px] font-bold uppercase tracking-wider text-[#FAF6F0]/70 hover:text-white flex items-center space-x-1 cursor-pointer transition-colors"
                aria-label="Previous question"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            <button
              id="close-coffee-finder-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF6F0] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Coffee Finder"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar (Visible during questions) */}
        {currentStep <= totalSteps && (
          <div className="w-full bg-[#E8DFD5] h-1.5 relative">
            <div
              className="bg-gradient-to-r from-[#E65F38] to-[#D63426] h-full transition-all duration-400 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-5 sm:p-8 md:p-10 max-h-[80vh] overflow-y-auto">
          
          {/* ============================================================ */}
          {/* QUESTION 1 — HOW DO YOU LIKE YOUR COFFEE? */}
          {/* ============================================================ */}
          {currentStep === 1 && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">
              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] uppercase font-mono tracking-widest text-[#D63426] font-bold px-2.5 py-0.5 rounded-full bg-[#D63426]/10">
                    Question 1 of 5
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#241712]">
                  How do you usually enjoy your coffee?
                </h3>
                <p className="text-sm text-[#7A6C63]">
                  Select the ritual that starts your morning best.
                </p>
              </div>

              {/* 4 Selectable Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    id: 'black' as CoffeeEnjoyment,
                    emoji: '☕',
                    title: 'Black',
                    desc: 'Pure, clear origin notes with bright aroma and sweetness.'
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
                    desc: 'Versatile beans that taste sublime in every single cup.'
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
                      className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'border-[#241712] bg-[#241712] text-white shadow-lg scale-[1.01]'
                          : 'border-[#E8DFD5] bg-white hover:border-[#D63426] hover:bg-[#FAF6F0] hover:shadow-md text-[#241712]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                          {opt.emoji}
                        </span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-[#D63426] border-[#D63426] text-white' : 'border-[#E8DFD5] bg-transparent'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base font-bold uppercase tracking-tight mb-1">
                          {opt.title}
                        </h4>
                        <p className={`text-xs leading-relaxed ${
                          isSelected ? 'text-[#FAF6F0]/80' : 'text-[#7A6C63]'
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

          {/* ============================================================ */}
          {/* QUESTION 2 — FLAVOUR */}
          {/* ============================================================ */}
          {currentStep === 2 && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">
              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] uppercase font-mono tracking-widest text-[#D63426] font-bold px-2.5 py-0.5 rounded-full bg-[#D63426]/10">
                    Question 2 of 5
                  </span>
                  <span className="text-xs text-[#7A6C63] font-medium">Select one or more</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#241712]">
                  What sounds delicious to you?
                </h3>
                <p className="text-sm text-[#7A6C63]">
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
                      className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                        isChecked
                          ? 'border-[#241712] bg-[#241712] text-white shadow-md'
                          : 'border-[#E8DFD5] bg-white hover:border-[#D63426] hover:bg-[#FAF6F0] text-[#241712]'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                          {item.emoji}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-tight">
                            {item.title}
                          </h4>
                          <span className={`text-[11px] block ${
                            isChecked ? 'text-[#FAF6F0]/75' : 'text-[#7A6C63]'
                          }`}>
                            {item.subtitle}
                          </span>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors shrink-0 ml-2 ${
                        isChecked 
                          ? 'bg-[#D63426] border-[#D63426] text-white' 
                          : 'border-[#E8DFD5] bg-[#FAF6F0]'
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
                  className="text-xs uppercase tracking-wider font-bold text-[#7A6C63] hover:text-[#241712] flex items-center space-x-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => {
                    if (flavours.length === 0) {
                      setFlavours(['chocolate-rich', 'caramel-sweet']);
                    }
                    setCurrentStep(3);
                  }}
                  className="px-8 py-3.5 bg-[#D63426] hover:bg-[#BF2A1D] text-white text-xs uppercase tracking-widest font-black rounded-full transition-all shadow-md flex items-center space-x-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* QUESTION 3 — STRENGTH */}
          {/* ============================================================ */}
          {currentStep === 3 && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">
              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] uppercase font-mono tracking-widest text-[#D63426] font-bold px-2.5 py-0.5 rounded-full bg-[#D63426]/10">
                    Question 3 of 5
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#241712]">
                  How bold do you like it?
                </h3>
                <p className="text-sm text-[#7A6C63]">
                  Select your preferred roast depth and intensity.
                </p>
              </div>

              {/* Playful Strength Visual Selector */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    {
                      level: 'Smooth' as CoffeeStrengthLevel,
                      roast: 'Light Roast',
                      beans: '🫘',
                      desc: 'Gentle, tea-like clarity with sparkling floral & fruit brightness.',
                      barWidth: '25%',
                      color: 'text-[#657953]'
                    },
                    {
                      level: 'Balanced' as CoffeeStrengthLevel,
                      roast: 'Medium Roast',
                      beans: '🫘🫘',
                      desc: 'Crowd-pleaser equilibrium with golden toffee and milk chocolate.',
                      barWidth: '50%',
                      color: 'text-[#E65F38]'
                    },
                    {
                      level: 'Bold' as CoffeeStrengthLevel,
                      roast: 'Medium-Dark',
                      beans: '🫘🫘🫘',
                      desc: 'Rich, syrupy mouthfeel with dark cacao and toasted hazelnut.',
                      barWidth: '75%',
                      color: 'text-[#D63426]'
                    },
                    {
                      level: 'Very Bold' as CoffeeStrengthLevel,
                      roast: 'Espresso Roast',
                      beans: '🫘🫘🫘🫘',
                      desc: 'Deepest intensity, heavy crema, zero sharpness, cuts through milk.',
                      barWidth: '100%',
                      color: 'text-[#241712]'
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
                        className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                          isSelected
                            ? 'border-[#241712] bg-[#241712] text-white shadow-lg scale-[1.01]'
                            : 'border-[#E8DFD5] bg-white hover:border-[#D63426] hover:bg-[#FAF6F0] text-[#241712]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base tracking-widest font-mono">
                            {item.beans}
                          </span>
                          <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-white/20 text-[#FAF6F0]' : 'bg-[#FAF6F0] text-[#7A6C63] border border-[#E8DFD5]'
                          }`}>
                            {item.roast}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-lg font-black uppercase tracking-tight mb-1">
                            {item.level}
                          </h4>
                          <p className={`text-xs leading-relaxed ${
                            isSelected ? 'text-[#FAF6F0]/80' : 'text-[#7A6C63]'
                          }`}>
                            {item.desc}
                          </p>
                        </div>

                        {/* Interactive bean intensity bar */}
                        <div className="w-full bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isSelected ? 'bg-[#D63426]' : 'bg-[#241712]'}`}
                            style={{ width: item.barWidth }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* QUESTION 4 — BREWING METHOD */}
          {/* ============================================================ */}
          {currentStep === 4 && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">
              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] uppercase font-mono tracking-widest text-[#D63426] font-bold px-2.5 py-0.5 rounded-full bg-[#D63426]/10">
                    Question 4 of 5
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#241712]">
                  How are you making your coffee?
                </h3>
                <p className="text-sm text-[#7A6C63]">
                  We will pair you with beans dialed for your brewing equipment.
                </p>
              </div>

              {/* 8 Brew Methods */}
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
                      className={`p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-between group ${
                        isSelected
                          ? 'border-[#241712] bg-[#241712] text-white shadow-md scale-[1.02]'
                          : 'border-[#E8DFD5] bg-white hover:border-[#D63426] hover:bg-[#FAF6F0] text-[#241712]'
                      }`}
                    >
                      <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <h4 className="text-xs font-bold uppercase tracking-tight line-clamp-1">
                        {item.label}
                      </h4>
                      <span className={`text-[10px] ${
                        isSelected ? 'text-[#FAF6F0]/70' : 'text-[#7A6C63]'
                      }`}>
                        {item.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* QUESTION 5 — YOUR COFFEE MOOD */}
          {/* ============================================================ */}
          {currentStep === 5 && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">
              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] uppercase font-mono tracking-widest text-[#D63426] font-bold px-2.5 py-0.5 rounded-full bg-[#D63426]/10">
                    Question 5 of 5
                  </span>
                  <span className="text-xs text-[#E65F38] font-bold uppercase tracking-wider font-mono">Final Step</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#241712]">
                  What's your coffee moment?
                </h3>
                <p className="text-sm text-[#7A6C63]">
                  What atmosphere surrounds your favorite cup?
                </p>
              </div>

              {/* 6 Playful Mood Cards */}
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
                    desc: 'Deep focus companion for long creative desk sessions.'
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
                      className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center space-x-4 group ${
                        isSelected
                          ? 'border-[#241712] bg-[#241712] text-white shadow-lg'
                          : 'border-[#E8DFD5] bg-white hover:border-[#D63426] hover:bg-[#FAF6F0] text-[#241712]'
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform shrink-0">
                        {item.emoji}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold uppercase tracking-tight mb-0.5">
                          {item.title}
                        </h4>
                        <p className={`text-xs leading-relaxed ${
                          isSelected ? 'text-[#FAF6F0]/80' : 'text-[#7A6C63]'
                        }`}>
                          {item.desc}
                        </p>
                      </div>
                      <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                        isSelected ? 'text-[#D63426]' : 'text-[#7A6C63]'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 6 — LOADING / PROCESSING ANIMATION */}
          {/* ============================================================ */}
          {currentStep === 6 && isCalculating && (
            <div className="py-14 sm:py-20 text-center space-y-6 animate-fadeIn flex flex-col items-center justify-center">
              <div className="relative w-20 h-20 rounded-full bg-[#FAF6F0] border-2 border-[#D63426] flex items-center justify-center shadow-lg">
                <Coffee className="w-8 h-8 text-[#D63426] animate-bounce" />
                <div className="absolute inset-0 rounded-full border-2 border-t-[#D63426] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              </div>

              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-2xl font-black uppercase text-[#241712]">
                  Matching Your Taste Profile...
                </h3>
                <p className="text-xs text-[#7A6C63]">
                  Comparing acidity, roast depth, and origin notes with our small-batch roastery lots.
                </p>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* RESULTS PAGE — PERFECT MATCH + ALSO TRY */}
          {/* ============================================================ */}
          {currentStep === 6 && !isCalculating && result && (
            <div className="space-y-8 animate-fadeIn text-left">
              
              {/* Results Hero Heading */}
              <div className="text-center space-y-2 border-b border-[#E8DFD5] pb-6">
                
                {/* Match Score Badge */}
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#EBF1E6] border border-[#657953]/30 text-[#657953] shadow-xs">
                  <Sparkles className="w-4 h-4 text-[#D63426]" />
                  <span className="text-xs font-mono font-black uppercase tracking-wider">
                    {result.perfectMatch.score}% YOUR CUP ☕
                  </span>
                </div>

                {/* Exact Requested Headline */}
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#241712]">
                  WE FOUND YOUR COFFEE ☕
                </h3>
                
                {/* Exact Requested Supporting Line */}
                <p className="text-sm sm:text-base text-[#7A6C63] font-normal">
                  Based on your taste, we think you'll love...
                </p>
              </div>

              {/* ======================================================== */}
              {/* FEATURED: PERFECT MATCH CARD */}
              {/* ======================================================== */}
              <div className="bg-white rounded-3xl border-2 border-[#241712] p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6">
                
                {/* Top Badge Stamp */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8DFD5] pb-4">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-[#D63426] text-white text-[11px] font-mono font-black uppercase tracking-widest rounded-full shadow-xs">
                      PERFECT MATCH
                    </span>
                    <span className="text-xs font-mono text-[#7A6C63]">
                      {result.perfectMatch.shareablePersona}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-[#241712]">
                      ${result.perfectMatch.product.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
                  
                  {/* Left: Product Image */}
                  <div className="md:col-span-5 relative aspect-square rounded-2xl overflow-hidden bg-[#241712] shadow-md border border-[#E8DFD5] group">
                    <img
                      src={result.perfectMatch.product.images[0]}
                      alt={result.perfectMatch.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {result.perfectMatch.product.isOrganic && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#657953] text-white text-[10px] font-mono font-bold uppercase rounded-md shadow-xs">
                        USDA Organic
                      </div>
                    )}
                  </div>

                  {/* Right: Info & Explanations */}
                  <div className="md:col-span-7 space-y-4">
                    
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#E65F38] font-bold">
                        {result.perfectMatch.product.country || result.perfectMatch.product.origin}
                      </span>
                      <h4 className="text-2xl sm:text-3xl font-black uppercase text-[#241712] tracking-tight leading-snug">
                        {result.perfectMatch.product.name}
                      </h4>
                      <p className="text-xs text-[#7A6C63] mt-1 font-normal line-clamp-2">
                        {result.perfectMatch.product.description}
                      </p>
                    </div>

                    {/* Roast & Flavour Notes */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center space-x-2 text-xs font-semibold text-[#241712]">
                        <span className="text-[#7A6C63] font-mono text-[11px] uppercase">Roast Level:</span>
                        <span className="px-2.5 py-0.5 bg-[#FAF6F0] rounded-md border border-[#E8DFD5]">
                          {result.perfectMatch.product.roastLevel || 'Artisan Roast'}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {result.perfectMatch.product.tastingNotes?.map((note) => (
                          <span 
                            key={note} 
                            className="px-2.5 py-1 bg-[#FAF6F0] text-[#241712] text-xs font-medium rounded-lg border border-[#E8DFD5]"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic "Why You'll Love It" Explanation Section */}
                    <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD5] space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-[#D63426] font-mono text-[11px] font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Why you'll love it</span>
                      </div>
                      <p className="text-xs text-[#241712]/90 leading-relaxed font-normal italic">
                        "{result.perfectMatch.whyYoullLoveIt}"
                      </p>
                    </div>

                    {/* Actions: Add to Bag & View Coffee */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
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
                        className="w-full sm:flex-1 py-4 bg-[#D63426] hover:bg-[#BF2A1D] active:scale-[0.98] text-white text-xs uppercase tracking-widest font-black rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag • ${result.perfectMatch.product.price.toFixed(2)}</span>
                      </button>

                      <button
                        id="coffee-finder-view-product"
                        onClick={() => {
                          onClose();
                          onQuickView(result.perfectMatch.product);
                        }}
                        className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-[#FAF6F0] border border-[#241712] text-[#241712] text-xs uppercase tracking-widest font-bold rounded-full transition-colors cursor-pointer text-center"
                      >
                        View Coffee
                      </button>
                    </div>

                  </div>

                </div>

              </div>

              {/* ======================================================== */}
              {/* YOU MIGHT ALSO LOVE (Also Try) */}
              {/* ======================================================== */}
              {result.alternatives.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-black uppercase tracking-tight text-[#241712]">
                      You Might Also Love
                    </h4>
                    <span className="text-xs text-[#7A6C63] font-mono">Secondary Roaster Picks</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.alternatives.map((alt) => (
                      <div
                        key={alt.product.id}
                        className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DFD5] hover:border-[#241712] transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="flex items-start space-x-4">
                          <img
                            src={alt.product.images[0]}
                            alt={alt.product.name}
                            className="w-20 h-20 rounded-xl object-cover bg-[#241712] shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-mono font-bold uppercase text-[#657953] px-2 py-0.5 bg-[#EBF1E6] rounded">
                                {alt.score}% Match
                              </span>
                              {alt.product.roastLevel && (
                                <span className="text-[11px] text-[#7A6C63] font-mono">
                                  {alt.product.roastLevel}
                                </span>
                              )}
                            </div>

                            <h5 className="text-sm font-bold uppercase text-[#241712] line-clamp-1">
                              {alt.product.name}
                            </h5>
                            
                            <p className="text-[11px] text-[#7A6C63] line-clamp-1">
                              {alt.product.tastingNotes?.slice(0, 3).join(' • ')}
                            </p>

                            <div className="text-xs font-bold text-[#241712] pt-0.5">
                              ${alt.product.price.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2 border-t border-[#E8DFD5]">
                          <button
                            onClick={() => {
                              onAddToCart(
                                alt.product,
                                alt.product.availableGrinds ? alt.product.availableGrinds[0] : undefined,
                                1
                              );
                              onClose();
                            }}
                            className="flex-1 py-2.5 bg-[#241712] hover:bg-[#D63426] text-white text-[11px] uppercase font-bold tracking-wider rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Bag</span>
                          </button>

                          <button
                            onClick={() => {
                              onClose();
                              onQuickView(alt.product);
                            }}
                            className="px-3 py-2.5 bg-[#FAF6F0] hover:bg-[#E8DFD5] text-[#241712] text-[11px] uppercase font-bold rounded-xl transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* FOOTER ACTIONS: RETAKE & SHARE */}
              {/* ======================================================== */}
              <div className="pt-4 border-t border-[#E8DFD5] flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Share Button */}
                <button
                  id="coffee-finder-share-btn"
                  onClick={handleShareResult}
                  className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#FAF6F0] hover:bg-white border border-[#E8DFD5] text-[#241712] text-xs uppercase font-bold tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#E65F38]" />
                  <span>{copiedShare ? 'Match Copied to Clipboard!' : 'Share My Coffee Match'}</span>
                </button>

                {/* Retake Button */}
                <button
                  id="coffee-finder-retake-btn"
                  onClick={handleReset}
                  className="text-xs uppercase tracking-wider font-bold text-[#7A6C63] hover:text-[#D63426] flex items-center space-x-1.5 cursor-pointer transition-colors py-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake the Coffee Finder</span>
                </button>

              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
};
