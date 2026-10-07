import React, { useState, useRef, useEffect } from 'react';
import { Search, User, ShoppingBag, Menu, X, Sparkles, ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';
import { ProductCategory, AppView } from '../types';
import { CategoryInfo } from '../services/categoryManager';

interface NavbarProps {
  activeCategory: ProductCategory;
  currentView?: AppView;
  onNavigate: (view: AppView, category?: ProductCategory) => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenCart: () => void;
  onOpenAbout: () => void;
  onOpenQuiz?: () => void;
  cartCount: number;
  availableCategories?: CategoryInfo[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  currentView = 'home',
  onNavigate,
  onOpenSearch,
  onOpenAccount,
  onOpenCart,
  onOpenAbout,
  onOpenQuiz,
  cartCount,
  availableCategories = []
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (catId: string) => {
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);
    if (catId === 'coffee') {
      onNavigate('coffee');
    } else if (catId === 'tea') {
      onNavigate('tea');
    } else if (catId === 'mugs' || catId === 'mugs-drinkware' || catId === 'mugs-flasks') {
      onNavigate('mugs');
    } else if (catId === 'accessories') {
      onNavigate('accessories');
    } else if (catId === 'clothing' || catId === 'apparel') {
      onNavigate('apparel');
    } else if (catId === 'candles') {
      onNavigate('candles');
    } else if (catId === 'machines') {
      onNavigate('machines');
    } else if (catId === 'home-lifestyle') {
      onNavigate('home-lifestyle');
    } else {
      onNavigate('shop', catId as ProductCategory);
    }
  };

  return (
    <header
      id="main-navigation-bar"
      className="bg-[#F4EFEA] border-b border-[#0E0C0B]/10 py-2 sm:py-3.5 sticky top-0 z-40 transition-all backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between">
          
          {/* LEFT: Mobile Hamburger + Brand Wordmark & Seal */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Menu Hamburger Trigger for Mobile / Tablet (Left-aligned) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 sm:p-1.5 hover:text-[#C88E38] transition-colors cursor-pointer lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[2]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[2]" />
              )}
            </button>

            <a
              id="brand-logo-link"
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                setShopDropdownOpen(false);
                onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center space-x-2.5 focus:outline-none cursor-pointer group text-left"
              aria-label="TROSE Coffee — Home"
            >
              <img
                src="/assets/trose-logo.png"
                alt="TROSE"
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.src.endsWith('.svg')) {
                    target.src = '/assets/trose-logo.svg';
                  }
                }}
              />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-display font-extrabold tracking-[0.16em] text-[#0E0C0B] leading-none">
                  TROSE
                </span>
                <span className="text-[8px] sm:text-[9px] font-sans font-bold tracking-[0.36em] text-[#0E0C0B] mt-0.5 uppercase">
                  COFFEE & MORE
                </span>
              </div>
            </a>
          </div>

          {/* ==================================================== */}
          {/* CENTER: P7.5 PART B — STREAMLINED DESKTOP NAVIGATION */}
          {/* Required order: SHOP | COFFEE | TEA | MUGS & GEAR | FIND YOUR TROSE | OUR STORY */}
          {/* Secondary departments placed inside SHOP dropdown */}
          {/* ==================================================== */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7 text-xs uppercase tracking-[0.16em] font-sans font-bold text-[#0E0C0B]">
            
            {/* 1. SHOP (With Dropdown for Secondary Departments) */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <button
                onClick={() => {
                  setShopDropdownOpen(!shopDropdownOpen);
                }}
                className={`relative px-2 py-1.5 transition-all cursor-pointer inline-flex items-center space-x-1 whitespace-nowrap ${
                  currentView === 'shop' || shopDropdownOpen
                    ? 'text-[#C88E38] font-black'
                    : 'hover:text-[#C88E38]'
                }`}
                aria-expanded={shopDropdownOpen}
                aria-haspopup="true"
              >
                <span>SHOP</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${shopDropdownOpen ? 'rotate-180 text-[#C88E38]' : ''}`} />
                {currentView === 'shop' && (
                  <span className="absolute bottom-0 inset-x-2 h-[2px] bg-[#C88E38]" />
                )}
              </button>

              {/* Luxury SHOP Dropdown Menu */}
              {shopDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-[#FAF7F2] border border-[#0E0C0B]/15 shadow-2xl rounded-sm p-3 z-50 animate-fadeIn">
                  <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C88E38] font-bold px-3 pt-2 pb-1.5 border-b border-[#0E0C0B]/10">
                    DEPARTMENTS & GEAR
                  </div>

                  <div className="py-1 space-y-0.5">
                    {/* View All Products */}
                    <button
                      onClick={() => {
                        setShopDropdownOpen(false);
                        onNavigate('shop', 'all');
                      }}
                      className="w-full text-left px-3 py-2 text-[11px] uppercase tracking-wider font-extrabold text-[#0E0C0B] hover:bg-[#0E0C0B] hover:text-[#FAF7F2] transition-colors rounded-sm flex items-center justify-between"
                    >
                      <span>ALL PRODUCTS</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                    </button>

                    <div className="h-[1px] bg-[#0E0C0B]/10 my-1" />

                    {/* Secondary Department: Apparel */}
                    <button
                      onClick={() => handleCategoryClick('apparel')}
                      className={`w-full text-left px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold transition-colors rounded-sm flex items-center justify-between ${
                        currentView === 'apparel' || currentView === 'clothing'
                          ? 'text-[#C88E38] font-black'
                          : 'text-[#0E0C0B]/80 hover:text-[#0E0C0B] hover:bg-[#0E0C0B]/5'
                      }`}
                    >
                      <span>APPAREL</span>
                    </button>

                    {/* Secondary Department: Machines */}
                    <button
                      onClick={() => handleCategoryClick('machines')}
                      className={`w-full text-left px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold transition-colors rounded-sm flex items-center justify-between ${
                        currentView === 'machines'
                          ? 'text-[#C88E38] font-black'
                          : 'text-[#0E0C0B]/80 hover:text-[#0E0C0B] hover:bg-[#0E0C0B]/5'
                      }`}
                    >
                      <span>MACHINES</span>
                    </button>

                    {/* Secondary Department: Candles */}
                    <button
                      onClick={() => handleCategoryClick('candles')}
                      className={`w-full text-left px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold transition-colors rounded-sm flex items-center justify-between ${
                        currentView === 'candles'
                          ? 'text-[#C88E38] font-black'
                          : 'text-[#0E0C0B]/80 hover:text-[#0E0C0B] hover:bg-[#0E0C0B]/5'
                      }`}
                    >
                      <span>CANDLES</span>
                    </button>

                    {/* Secondary Department: Home & Living */}
                    <button
                      onClick={() => handleCategoryClick('home-lifestyle')}
                      className={`w-full text-left px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold transition-colors rounded-sm flex items-center justify-between ${
                        currentView === 'home-lifestyle'
                          ? 'text-[#C88E38] font-black'
                          : 'text-[#0E0C0B]/80 hover:text-[#0E0C0B] hover:bg-[#0E0C0B]/5'
                      }`}
                    >
                      <span>HOME & LIVING</span>
                    </button>

                    {/* Secondary Department: Accessories */}
                    <button
                      onClick={() => handleCategoryClick('accessories')}
                      className={`w-full text-left px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold transition-colors rounded-sm flex items-center justify-between ${
                        currentView === 'accessories'
                          ? 'text-[#C88E38] font-black'
                          : 'text-[#0E0C0B]/80 hover:text-[#0E0C0B] hover:bg-[#0E0C0B]/5'
                      }`}
                    >
                      <span>ACCESSORIES</span>
                    </button>

                  </div>
                </div>
              )}
            </div>

            {/* 2. COFFEE (Primary Product Department) */}
            <button
              onClick={() => onNavigate('coffee')}
              className={`relative px-2 py-1.5 transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'coffee'
                  ? 'text-[#C88E38] font-black'
                  : 'hover:text-[#C88E38]'
              }`}
            >
              <span>COFFEE</span>
              {currentView === 'coffee' ? (
                <span className="absolute bottom-0 inset-x-2 h-[2px] bg-[#C88E38]" />
              ) : (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#C88E38]" />
              )}
            </button>

            {/* 3. TEA */}
            <button
              onClick={() => onNavigate('tea')}
              className={`relative px-2 py-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                currentView === 'tea' ? 'text-[#C88E38] font-black' : 'hover:text-[#C88E38]'
              }`}
            >
              <span>TEA</span>
              {currentView === 'tea' && <span className="absolute bottom-0 inset-x-1 h-[2px] bg-[#C88E38]" />}
            </button>

            {/* 4. MUGS & GEAR */}
            <button
              onClick={() => onNavigate('mugs')}
              className={`relative px-2 py-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                currentView === 'mugs' ? 'text-[#C88E38] font-black' : 'hover:text-[#C88E38]'
              }`}
            >
              <span>MUGS & GEAR</span>
              {currentView === 'mugs' && <span className="absolute bottom-0 inset-x-1 h-[2px] bg-[#C88E38]" />}
            </button>

            {/* Divider */}
            <span className="w-[1px] h-4 bg-[#0E0C0B]/20" />

            {/* 5. FIND YOUR TROSE */}
            <button
              onClick={() => {
                if (onOpenQuiz) onOpenQuiz();
              }}
              className="hover:text-[#C88E38] transition-colors cursor-pointer flex items-center space-x-1 text-[11px] text-[#C88E38] font-bold whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>FIND YOUR TROSE</span>
            </button>

            {/* 6. OUR STORY */}
            <button
              onClick={() => onNavigate('our-story')}
              className={`hover:text-[#C88E38] transition-colors cursor-pointer text-[11px] font-bold whitespace-nowrap ${
                currentView === 'our-story' ? 'text-[#C88E38] font-black' : 'text-[#0E0C0B]/80'
              }`}
            >
              <span>OUR STORY</span>
            </button>

          </nav>

          {/* RIGHT: Action Icons (Search, Account, Cart) */}
          <div className="flex items-center space-x-2.5 sm:space-x-4 text-[#0E0C0B]">
            
            {/* Search */}
            <button
              id="search-trigger-btn"
              onClick={onOpenSearch}
              className="p-1.5 hover:text-[#C88E38] transition-colors cursor-pointer"
              aria-label="Search catalogue"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.8]" />
            </button>

            {/* Account */}
            <button
              id="account-trigger-btn"
              onClick={onOpenAccount}
              className="p-1.5 hover:text-[#C88E38] transition-colors cursor-pointer"
              aria-label="Account"
            >
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.8]" />
            </button>

            {/* Cart Button with Count Badge */}
            <button
              id="cart-trigger-btn"
              onClick={onOpenCart}
              className="flex items-center space-x-1.5 px-2 sm:px-2.5 py-1.5 border border-[#0E0C0B]/20 hover:border-[#0E0C0B] bg-white transition-colors cursor-pointer relative"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8] text-[#0E0C0B]" />
              <span className="text-[11px] sm:text-xs font-mono font-bold text-[#0E0C0B]">
                {cartCount}
              </span>
            </button>

          </div>

        </div>
      </div>

      {/* MOBILE DRAWER: Clean, Priority Ordered Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#0E0C0B]/15 shadow-2xl animate-fadeIn">
          <div className="max-w-7xl mx-auto px-5 py-5 space-y-2.5 text-left font-sans">
            
            {/* Primary Navigation Links */}
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C88E38] font-bold pb-1">
              STORE NAVIGATION
            </div>

            {/* 1. COFFEE (Primary) */}
            <button
              onClick={() => handleCategoryClick('coffee')}
              className={`w-full flex items-center justify-between p-3 text-xs uppercase tracking-wider font-extrabold border transition-colors cursor-pointer ${
                currentView === 'coffee'
                  ? 'bg-[#0E0C0B] text-white border-[#0E0C0B]'
                  : 'bg-white border-[#0E0C0B]/15 text-[#0E0C0B]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#C88E38]" />
                <span>COFFEE (PRIMARY)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C88E38]" />
            </button>

            {/* 2. TEA */}
            <button
              onClick={() => handleCategoryClick('tea')}
              className={`w-full flex items-center justify-between p-3 text-xs uppercase tracking-wider font-bold border transition-colors cursor-pointer ${
                currentView === 'tea'
                  ? 'bg-[#0E0C0B] text-white border-[#0E0C0B]'
                  : 'bg-white border-[#0E0C0B]/15 text-[#0E0C0B]'
              }`}
            >
              <span>TEA & BOTANICALS</span>
              <ChevronRight className="w-4 h-4 text-[#0E0C0B]/40" />
            </button>

            {/* 3. MUGS & GEAR */}
            <button
              onClick={() => handleCategoryClick('mugs')}
              className={`w-full flex items-center justify-between p-3 text-xs uppercase tracking-wider font-bold border transition-colors cursor-pointer ${
                currentView === 'mugs'
                  ? 'bg-[#0E0C0B] text-white border-[#0E0C0B]'
                  : 'bg-white border-[#0E0C0B]/15 text-[#0E0C0B]'
              }`}
            >
              <span>MUGS & GEAR</span>
              <ChevronRight className="w-4 h-4 text-[#0E0C0B]/40" />
            </button>

            {/* 4. SHOP ALL PRODUCTS */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('shop', 'all');
              }}
              className="w-full flex items-center justify-between p-3 text-xs uppercase tracking-wider font-bold bg-white border border-[#0E0C0B]/15 text-[#0E0C0B]"
            >
              <span>SHOP ALL PRODUCTS</span>
              <ChevronRight className="w-4 h-4 text-[#0E0C0B]/40" />
            </button>

            {/* Secondary Departments Section */}
            <div className="pt-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#0E0C0B]/60 font-bold">
              OTHER DEPARTMENTS
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleCategoryClick('apparel')}
                className="p-2.5 bg-white border border-[#0E0C0B]/10 text-left text-[11px] font-bold uppercase tracking-wider text-[#0E0C0B] hover:border-[#0E0C0B]"
              >
                APPAREL
              </button>
              <button
                onClick={() => handleCategoryClick('machines')}
                className="p-2.5 bg-white border border-[#0E0C0B]/10 text-left text-[11px] font-bold uppercase tracking-wider text-[#0E0C0B] hover:border-[#0E0C0B]"
              >
                MACHINES
              </button>
              <button
                onClick={() => handleCategoryClick('candles')}
                className="p-2.5 bg-white border border-[#0E0C0B]/10 text-left text-[11px] font-bold uppercase tracking-wider text-[#0E0C0B] hover:border-[#0E0C0B]"
              >
                CANDLES
              </button>
              <button
                onClick={() => handleCategoryClick('home-lifestyle')}
                className="p-2.5 bg-white border border-[#0E0C0B]/10 text-left text-[11px] font-bold uppercase tracking-wider text-[#0E0C0B] hover:border-[#0E0C0B]"
              >
                HOME & LIVING
              </button>
            </div>

            {/* Additional Brand Actions */}
            <div className="pt-3 border-t border-[#0E0C0B]/15 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenQuiz) onOpenQuiz();
                }}
                className="w-full py-3 bg-[#0E0C0B] text-white text-xs uppercase tracking-widest font-black flex items-center justify-center space-x-2 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C88E38]" />
                <span>FIND YOUR TROSE</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('our-story');
                }}
                className="w-full py-2.5 text-center text-xs uppercase tracking-wider font-bold text-[#0E0C0B]/80 hover:text-[#0E0C0B]"
              >
                OUR STORY
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
