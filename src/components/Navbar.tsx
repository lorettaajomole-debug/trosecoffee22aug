import React, { useState } from 'react';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { ProductCategory, AppView } from '../types';

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
  cartCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      id="main-navigation-bar"
      className="bg-[#F4EFEA] border-b border-[#0E0C0B]/10 py-4 sm:py-5 sticky top-0 z-40 transition-all backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex items-center justify-between">
          
          {/* LEFT: TROSE COFFEE Brand Wordmark & Seal (matching reference exactly) */}
          <div className="flex items-center space-x-3">
            <a
              id="brand-logo-link"
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center space-x-2.5 focus:outline-none cursor-pointer group text-left"
              aria-label="TROSE Coffee — Home"
            >
              {/* Circular TROSE Logo */}
              <img
                src="/assets/trose-logo.png"
                alt="TROSE"
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.src.endsWith('.svg')) {
                    target.src = '/assets/trose-logo.svg';
                  }
                }}
              />
              {/* Bold Geometric Wordmark matching reference */}
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-display font-extrabold tracking-[0.16em] text-[#0E0C0B] leading-none">
                  TROSE
                </span>
                <span className="text-[9px] font-sans font-semibold tracking-[0.38em] text-[#0E0C0B] mt-0.5 uppercase">
                  COFFEE
                </span>
              </div>
            </a>
          </div>

          {/* CENTER: Clean Reference Navigation */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-10 text-xs uppercase tracking-[0.18em] font-sans font-semibold text-[#0E0C0B]">
            <button
              onClick={() => onNavigate('shop', 'all')}
              className={`hover:text-[#C88E38] transition-colors cursor-pointer py-1 ${
                currentView === 'shop' && activeCategory === 'all' ? 'text-[#C88E38] font-bold' : ''
              }`}
            >
              SHOP
            </button>
            <button
              onClick={() => {
                if (onOpenQuiz) onOpenQuiz();
              }}
              className="hover:text-[#C88E38] transition-colors cursor-pointer py-1"
            >
              FIND YOUR TROSE
            </button>
            <button
              onClick={onOpenAbout}
              className="hover:text-[#C88E38] transition-colors cursor-pointer py-1"
            >
              OUR STORY
            </button>
            <button
              onClick={() => onNavigate('shop', 'coffee')}
              className="hover:text-[#C88E38] transition-colors cursor-pointer py-1"
            >
              JOURNAL
            </button>
          </nav>

          {/* RIGHT: Action Icons matching reference (Search, Account, Cart, Menu) */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-[#0E0C0B]">
            
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

            {/* Cart */}
            <button
              id="cart-trigger-btn"
              onClick={onOpenCart}
              className="flex items-center space-x-1 p-1.5 hover:text-[#C88E38] transition-colors cursor-pointer relative"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="text-[11px] font-sans font-bold text-[#0E0C0B]">
                  ({cartCount})
                </span>
              )}
            </button>

            {/* Menu Hamburger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 hover:text-[#C88E38] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[2]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[2]" />
              )}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="bg-[#F4EFEA] border-b border-[#0E0C0B]/15 shadow-xl animate-fadeIn">
          <div className="max-w-7xl mx-auto px-6 py-6 space-y-4 text-left font-sans">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('shop', 'all');
              }}
              className="block w-full text-xs uppercase tracking-widest font-semibold py-2 border-b border-[#0E0C0B]/10"
            >
              SHOP ALL COLLECTIONS
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('shop', 'coffee');
              }}
              className="block w-full text-xs uppercase tracking-widest font-semibold py-2 border-b border-[#0E0C0B]/10"
            >
              COFFEE ROASTS
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('shop', 'organic');
              }}
              className="block w-full text-xs uppercase tracking-widest font-semibold py-2 border-b border-[#0E0C0B]/10"
            >
              ORGANIC COFFEE
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('shop', 'machines');
              }}
              className="block w-full text-xs uppercase tracking-widest font-semibold py-2 border-b border-[#0E0C0B]/10"
            >
              MACHINES & GEAR
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenQuiz) onOpenQuiz();
              }}
              className="block w-full text-xs uppercase tracking-widest font-bold py-2 text-[#C88E38] border-b border-[#0E0C0B]/10"
            >
              FIND YOUR TROSE →
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAbout();
              }}
              className="block w-full text-xs uppercase tracking-widest font-semibold py-2"
            >
              OUR STORY
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
