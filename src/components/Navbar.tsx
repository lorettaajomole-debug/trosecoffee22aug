import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, Menu, X, Coffee } from 'lucide-react';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; view?: AppView; category?: ProductCategory; isAbout?: boolean; isHome?: boolean; badge?: string }[] = [
    { label: 'Home', isHome: true, view: 'home' },
    { label: 'Shop', view: 'shop', category: 'all' },
    { label: 'Coffee', view: 'shop', category: 'coffee' },
    { label: 'Organic Coffee', view: 'shop', category: 'organic', badge: 'Bio' },
    { label: 'Machines', view: 'shop', category: 'machines' },
    { label: 'Mugs & Gear', view: 'shop', category: 'accessories' },
    { label: 'About', isAbout: true }
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setMobileMenuOpen(false);
    if (item.isAbout) {
      onOpenAbout();
    } else if (item.isHome) {
      onNavigate('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.view) {
      onNavigate(item.view, item.category || 'all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navigation-bar"
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E8DFD5] py-3.5 shadow-xs'
          : 'bg-[#FAF6F0] border-b border-[#E8DFD5] py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex items-center justify-between">
          
          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden space-x-1">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-[#241712] hover:text-[#D63426] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              id="mobile-search-btn"
              onClick={onOpenSearch}
              className="p-2 text-[#241712] hover:text-[#D63426] transition-colors cursor-pointer"
              aria-label="Open search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Left / Brand Area: Modern, Playful TROSE Wordmark */}
          <div className="flex items-center space-x-10">
            <a
              id="brand-logo-link"
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-baseline space-x-1 focus:outline-none cursor-pointer group"
            >
              <span className="text-2xl sm:text-[26px] font-sans font-black tracking-tight text-[#241712] uppercase transition-transform group-hover:scale-[1.02]">
                TROSE
              </span>
              <span className="w-2 h-2 rounded-full bg-[#D63426] inline-block transition-transform group-hover:scale-125"></span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs uppercase tracking-[0.14em] font-semibold text-[#241712]/75">
              {navItems.map((item) => {
                const isActive =
                  (item.isHome && currentView === 'home') ||
                  (!item.isHome && !item.isAbout && currentView === 'shop' && activeCategory === item.category);

                return (
                  <button
                    key={item.label}
                    id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleNavClick(item)}
                    className={`transition-all duration-200 cursor-pointer relative py-1 hover:text-[#D63426] ${
                      isActive
                        ? 'text-[#D63426] font-bold'
                        : 'text-[#241712]/80'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#D63426] rounded-full" />
                    )}
                    {item.badge && (
                      <span className="ml-1.5 px-1.5 py-0.5 bg-[#EBF1E6] text-[#657953] text-[9px] font-bold rounded-full normal-case tracking-normal">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Action Icons: Search, Account, Cart */}
          <div className="flex items-center space-x-3 sm:space-x-4 text-[#241712]">
            <button
              id="desktop-search-btn"
              onClick={onOpenSearch}
              className="hidden lg:flex items-center justify-center p-2 text-[#241712]/80 hover:text-[#D63426] hover:bg-[#F4EFEB] rounded-full transition-all cursor-pointer"
              aria-label="Search products"
              title="Search"
            >
              <Search className="w-4 h-4 stroke-[2]" />
            </button>

            <button
              id="account-profile-btn"
              onClick={onOpenAccount}
              className="flex items-center justify-center p-2 text-[#241712]/80 hover:text-[#D63426] hover:bg-[#F4EFEB] rounded-full transition-all cursor-pointer"
              aria-label="Account & Orders"
              title="Account"
            >
              <User className="w-4 h-4 stroke-[2]" />
            </button>

            <button
              id="cart-drawer-trigger-btn"
              onClick={onOpenCart}
              className="flex items-center space-x-2 px-3 py-2 bg-[#241712] hover:bg-[#1F1612] text-white rounded-full transition-transform active:scale-95 cursor-pointer group shadow-xs"
              aria-label={`Shopping bag with ${cartCount} items`}
              title="Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="text-xs font-bold tracking-wider font-mono">
                {cartCount}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[61px] bg-[#FAF6F0] border-b border-[#E8DFD5] shadow-xl z-50 animate-fadeIn">
          <div className="px-6 py-6 space-y-4 max-h-[80vh] overflow-y-auto font-sans">
            <div className="border-b border-[#E8DFD5] pb-3 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#7A6C63]">Menu</span>
              <span className="text-xs text-[#D63426] font-semibold">Coffee Culture</span>
            </div>

            {navItems.map((item) => (
              <button
                key={item.label}
                id={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleNavClick(item)}
                className="w-full text-left py-2.5 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-[#241712] hover:text-[#D63426] font-bold transition-colors cursor-pointer"
              >
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="px-2 py-0.5 bg-[#EBF1E6] text-[#657953] text-[10px] font-bold rounded-full">
                    {item.badge}
                  </span>
                ) : item.category ? (
                  <Coffee className="w-3.5 h-3.5 text-[#7A6C63]" />
                ) : null}
              </button>
            ))}

            <div className="pt-4 border-t border-[#E8DFD5] space-y-3">
              {onOpenQuiz && (
                <button
                  id="mobile-drawer-quiz-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuiz();
                  }}
                  className="w-full py-3 bg-[#D63426] text-white text-xs uppercase tracking-wider font-bold rounded-xl flex items-center justify-center space-x-2 shadow-xs"
                >
                  <Coffee className="w-4 h-4 text-white" />
                  <span>Find Your Perfect Coffee →</span>
                </button>
              )}

              <button
                id="mobile-drawer-account-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAccount();
                }}
                className="w-full py-3 bg-[#F4EFEB] text-[#241712] text-xs uppercase tracking-wider font-bold rounded-xl flex items-center justify-center space-x-2"
              >
                <User className="w-4 h-4 text-[#D63426]" />
                <span>Account & Order History</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};


