import React, { useState, useMemo, useEffect } from 'react';
import { ArrowDown, ArrowLeft, SlidersHorizontal, RotateCcw, Check, Sparkles, Filter, ChevronDown } from 'lucide-react';
import { Product, GrindOption } from '../types';
import { ProductCard } from './ProductCard';
import { Pagination } from './Pagination';
import { useResponsivePageSize } from '../hooks/useResponsivePageSize';
import {
  isCoffeeProduct,
  matchCoffeeSubcategory,
  getAvailableCoffeeSubcategories,
  CoffeeSubcategory
} from '../services/categoryManager';
import { isStorefrontEligibleProduct } from '../services/productClassification';

interface CoffeePageProps {
  products: Product[];
  initialPage?: number;
  initialSubcategory?: CoffeeSubcategory;
  onPageChange?: (newPage: number) => void;
  onSubcategoryChange?: (subcat: CoffeeSubcategory) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, grind?: GrindOption, quantity?: number) => void;
  onOpenQuiz?: () => void;
  onNavigateHome?: () => void;
  isLoading?: boolean;
}

const ROAST_OPTIONS = ['all', 'Light', 'Medium', 'Medium-Dark', 'Dark', 'Espresso Roast'] as const;

export const CoffeePage: React.FC<CoffeePageProps> = ({
  products,
  initialPage = 1,
  initialSubcategory = 'all',
  onPageChange,
  onSubcategoryChange,
  onSelectProduct,
  onAddToCart,
  onOpenQuiz,
  onNavigateHome,
  isLoading = false
}) => {
  // 12 products per page (Mobile = 2 columns × 6 rows = 12)
  const pageSize = useResponsivePageSize(12, 12);

  // Live coffee catalog filtered from master products
  const coffeeProducts = useMemo(() => {
    return products.filter((p) => isCoffeeProduct(p) && isStorefrontEligibleProduct(p));
  }, [products]);

  // Dynamic available subcategories based strictly on current catalog
  const subcategoryTabs = useMemo(() => {
    return getAvailableCoffeeSubcategories(coffeeProducts);
  }, [coffeeProducts]);

  // States
  const [selectedSubcategory, setSelectedSubcategory] = useState<CoffeeSubcategory>(initialSubcategory);
  const [selectedRoast, setSelectedRoast] = useState<string>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'best-selling'>('featured');
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Sync initialSubcategory if it changes externally
  useEffect(() => {
    if (initialSubcategory && initialSubcategory !== selectedSubcategory) {
      setSelectedSubcategory(initialSubcategory);
      setCurrentPage(1);
    }
  }, [initialSubcategory]);

  // Sync initialPage from URL if it changes
  useEffect(() => {
    if (initialPage && initialPage !== currentPage) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  // Available origins dynamically derived from live coffee items
  const availableOrigins = useMemo(() => {
    const set = new Set<string>();
    coffeeProducts.forEach((p) => {
      if (p.country) set.add(p.country);
      else if (p.origin) {
        const parts = p.origin.split(',');
        const country = parts[parts.length - 1].trim();
        if (country) set.add(country);
      }
    });
    return ['all', ...Array.from(set)];
  }, [coffeeProducts]);

  const handlePageSelect = (page: number) => {
    setCurrentPage(page);
    if (onPageChange) onPageChange(page);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    if (onPageChange) onPageChange(1);
  }, [selectedSubcategory, selectedRoast, selectedOrigin, inStockOnly, sortBy]);

  // Filtered and sorted coffee catalog
  const filteredCoffees = useMemo(() => {
    let list = coffeeProducts.filter((p) => {
      // 1. Subcategory filter
      if (selectedSubcategory !== 'all' && !matchCoffeeSubcategory(p, selectedSubcategory)) {
        return false;
      }
      // 2. Roast profile filter
      if (selectedRoast !== 'all' && p.roastLevel !== selectedRoast) {
        return false;
      }
      // 3. Origin filter
      if (selectedOrigin !== 'all') {
        const matchCountry = p.country?.toLowerCase() === selectedOrigin.toLowerCase();
        const matchOrigin = p.origin?.toLowerCase().includes(selectedOrigin.toLowerCase());
        if (!matchCountry && !matchOrigin) return false;
      }
      // 4. In Stock filter
      if (inStockOnly && !p.inStock) {
        return false;
      }
      return true;
    });

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'best-selling':
        list = [...list].sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
        break;
      case 'featured':
      default:
        list = [...list].sort((a, b) => {
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          return 0;
        });
        break;
    }

    return list;
  }, [coffeeProducts, selectedSubcategory, selectedRoast, selectedOrigin, inStockOnly, sortBy]);

  // Paginated slice using responsive page size (12 desktop, 6 mobile)
  const paginatedCoffees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCoffees.slice(start, start + pageSize);
  }, [filteredCoffees, currentPage, pageSize]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedSubcategory !== 'all') count++;
    if (selectedRoast !== 'all') count++;
    if (selectedOrigin !== 'all') count++;
    if (inStockOnly) count++;
    return count;
  }, [selectedSubcategory, selectedRoast, selectedOrigin, inStockOnly]);

  const resetAllFilters = () => {
    setSelectedSubcategory('all');
    setSelectedRoast('all');
    setSelectedOrigin('all');
    setInStockOnly(false);
    setSortBy('featured');
    setCurrentPage(1);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('coffee-catalogue');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="coffee-page-root" className="min-h-screen bg-[#FAF7F2] text-[#0E0C0B] flex flex-col">
      
      {/* ========================================================================= */}
      {/* 1. COMPACT VISUAL HERO: COFFEE FOR EVERY VERSION OF YOU.                  */}
      {/* ========================================================================= */}
      <section className="relative bg-[#F4EFEA] border-b border-[#0E0C0B]/10 overflow-hidden py-10 sm:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Bold Bauhaus Typography & Supporting Copy */}
            <div className="lg:col-span-7 space-y-5 text-left z-10">
              
              {/* Back Navigation Button */}
              <div>
                <button
                  id="coffee-back-btn"
                  onClick={() => {
                    if (window.history.length > 1) {
                      window.history.back();
                    } else if (onNavigateHome) {
                      onNavigateHome();
                    } else {
                      window.location.href = '/';
                    }
                  }}
                  className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#0E0C0B]/70 hover:text-[#0E0C0B] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>BACK</span>
                </button>
              </div>

              {/* Category Kicker */}
              <div className="flex items-center space-x-2 text-xs font-sans font-bold tracking-[0.22em] text-[#C88E38] uppercase">
                <span className="w-5 h-[1.5px] bg-[#C88E38]" />
                <span>PRIMARY ROASTER COLLECTION</span>
              </div>

              {/* Required Exact Headline */}
              <div className="font-display">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-[#0E0C0B] tracking-[-0.03em] leading-[0.94] uppercase">
                  <span className="block">COFFEE FOR</span>
                  <span className="block">EVERY VERSION</span>
                  <span className="block text-[#C88E38]">OF YOU.</span>
                </h1>
              </div>

              {/* Supporting Copy */}
              <p className="text-sm sm:text-base text-[#0E0C0B]/80 font-sans font-medium max-w-xl leading-relaxed">
                Different moods. Different moments. Find the TROSE coffee that fits yours.
              </p>

              {/* Action Buttons: SHOP COFFEE ↓ and Quiz */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={scrollToCatalog}
                  className="px-7 py-3.5 bg-[#0E0C0B] hover:bg-[#221B16] text-white text-xs uppercase tracking-[0.18em] font-sans font-bold inline-flex items-center space-x-2.5 transition-all shadow-md cursor-pointer active:translate-y-0.5"
                >
                  <span>SHOP COFFEE ↓</span>
                  <ArrowDown className="w-4 h-4 text-white" />
                </button>

                {onOpenQuiz && (
                  <button
                    onClick={onOpenQuiz}
                    className="px-6 py-3.5 border border-[#0E0C0B]/30 hover:border-[#0E0C0B] text-[#0E0C0B] hover:bg-[#0E0C0B]/5 text-xs uppercase tracking-[0.16em] font-sans font-semibold inline-flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C88E38]" />
                    <span>FIND YOUR TROSE</span>
                  </button>
                )}
              </div>

              {/* Canonical Coffee Taxonomy Badges */}
              <div className="pt-4 flex items-center space-x-6 text-[11px] font-mono uppercase tracking-wider text-[#0E0C0B]/70">
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C88E38]" />
                  <span>SIGNATURE BLENDS</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A2B2B]" />
                  <span>SINGLE ORIGIN & FLAVORED</span>
                </span>
                <span className="hidden sm:flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#162820]" />
                  <span>ORGANIC & CAPSULES</span>
                </span>
              </div>

            </div>

            {/* Right Column: Harvested Coffee Cherry Asset with Bauhaus Geometry */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0 flex justify-center">
              <div className="relative w-full max-w-[420px] aspect-[4/3] sm:aspect-square">
                
                {/* Background Bauhaus Circles */}
                <div className="absolute top-2 right-4 w-56 sm:w-64 h-56 sm:h-64 rounded-full bg-[#C88E38] -z-10 shadow-sm" />
                <div className="absolute bottom-2 left-2 w-44 sm:w-52 h-44 sm:h-52 rounded-full bg-[#8A2B2B] -z-10 opacity-90 shadow-sm" />

                {/* Primary Visual: Approved Harvested Coffee / Coffee-Cherry Photography */}
                <div className="relative w-[90%] h-[90%] mx-auto rounded-t-full overflow-hidden border-2 border-[#0E0C0B] shadow-2xl bg-[#12100E] z-10 group">
                  <img
                    src="https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=900&q=85"
                    alt="Luminous ripe red coffee cherries harvested at peak ripeness"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C0B]/80 via-transparent to-transparent pointer-events-none" />

                  {/* Editorial Seal Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between bg-[#0E0C0B]/90 backdrop-blur-xs px-3.5 py-2 border border-[#C88E38]">
                    <div className="flex items-center space-x-2">
                      <img
                        src="/assets/trose-logo.png"
                        alt="TROSE Seal"
                        className="w-5 h-5 object-contain"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (!target.src.endsWith('.svg')) target.src = '/assets/trose-logo.svg';
                        }}
                      />
                      <span className="text-[10px] font-sans font-bold tracking-widest text-white uppercase">
                        HARVEST DIRECT
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-[#C88E38] font-bold uppercase tracking-wider">
                      GRADE 1 ARABICA
                    </span>
                  </div>
                </div>

                {/* Overlapping Roasted Bean Accent */}
                <div className="absolute -bottom-3 -right-2 w-28 sm:w-32 h-14 rounded-full overflow-hidden border-2 border-[#0E0C0B] shadow-xl z-20 hidden sm:block">
                  <img
                    src="https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=400&q=85"
                    alt="Artisan roasted beans"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. COFFEE CATALOGUE: SUBCATEGORIES + FILTERS + LIVE PRODUCTS + PAGINATION */}
      {/* ========================================================================= */}
      <section id="coffee-catalogue" className="py-12 sm:py-16 max-w-7xl mx-auto px-6 sm:px-10 w-full flex-1">
        
        {/* Subcategory Horizontal Pills / Tabs */}
        <div className="border-b border-[#0E0C0B]/15 pb-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C88E38] font-bold">
              01 / BROWSE COFFEE SUBCATEGORIES
            </span>
            <span className="text-xs font-mono text-[#0E0C0B]/60">
              {filteredCoffees.length} {filteredCoffees.length === 1 ? 'Roast' : 'Roasts'} Available
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {subcategoryTabs.map((tab) => {
              const isActive = selectedSubcategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedSubcategory(tab.id);
                    if (onSubcategoryChange) onSubcategoryChange(tab.id);
                  }}
                  className={`px-4 py-2 text-xs font-sans uppercase tracking-[0.14em] font-bold transition-all whitespace-nowrap cursor-pointer border flex items-center space-x-2 ${
                    isActive
                      ? 'bg-[#0E0C0B] text-white border-[#0E0C0B] shadow-sm'
                      : 'bg-white text-[#0E0C0B]/80 border-[#0E0C0B]/15 hover:border-[#0E0C0B] hover:text-[#0E0C0B]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-[#C88E38] text-[#0E0C0B]' : 'bg-[#0E0C0B]/10 text-[#0E0C0B]/70'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filters Bar */}
        <div className="bg-[#F4EFEA] border border-[#0E0C0B]/15 p-4 sm:p-5 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Left: Quick Selectors (Roast Profile, Origin, In Stock) */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Roast Profile Dropdown */}
            <div className="relative">
              <select
                value={selectedRoast}
                onChange={(e) => setSelectedRoast(e.target.value)}
                className="appearance-none bg-white border border-[#0E0C0B]/20 text-[#0E0C0B] text-xs font-mono uppercase tracking-wider pl-3.5 pr-8 py-2.5 cursor-pointer focus:outline-none focus:border-[#C88E38]"
              >
                <option value="all">ALL ROAST LEVELS</option>
                {ROAST_OPTIONS.filter((r) => r !== 'all').map((roast) => (
                  <option key={roast} value={roast}>
                    {roast}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#0E0C0B]/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Origin Dropdown */}
            {availableOrigins.length > 2 && (
              <div className="relative">
                <select
                  value={selectedOrigin}
                  onChange={(e) => setSelectedOrigin(e.target.value)}
                  className="appearance-none bg-white border border-[#0E0C0B]/20 text-[#0E0C0B] text-xs font-mono uppercase tracking-wider pl-3.5 pr-8 py-2.5 cursor-pointer focus:outline-none focus:border-[#C88E38]"
                >
                  <option value="all">ALL ORIGINS</option>
                  {availableOrigins.filter((o) => o !== 'all').map((orig) => (
                    <option key={orig} value={orig}>
                      {orig}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#0E0C0B]/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}

            {/* In Stock Only Checkbox */}
            <label className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#0E0C0B] cursor-pointer select-none bg-white border border-[#0E0C0B]/20 px-3 py-2">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#0E0C0B] w-3.5 h-3.5"
              />
              <span>In Stock Only</span>
            </label>

            {/* Clear All Filters Button */}
            {activeFiltersCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-mono uppercase tracking-wider text-[#8A2B2B] hover:text-[#0E0C0B] flex items-center space-x-1 cursor-pointer underline underline-offset-4"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}

          </div>

          {/* Right: Sort By */}
          <div className="flex items-center justify-end space-x-2">
            <span className="text-[11px] font-mono uppercase text-[#0E0C0B]/60 hidden sm:inline">SORT BY:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white border border-[#0E0C0B]/20 text-[#0E0C0B] text-xs font-mono uppercase tracking-wider pl-3 pr-8 py-2.5 cursor-pointer focus:outline-none focus:border-[#C88E38]"
              >
                <option value="featured">Featured Roasts</option>
                <option value="best-selling">Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#0E0C0B]/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Live Products Grid */}
        <div id="coffee-product-grid-start">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-[#0E0C0B]/10 p-3 sm:p-4 space-y-4 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : filteredCoffees.length === 0 ? (
          <div className="bg-white border border-[#0E0C0B]/15 p-12 text-center space-y-4 max-w-lg mx-auto my-8">
            <h3 className="text-xl font-display font-extrabold uppercase text-[#0E0C0B]">No matching roasts found</h3>
            <p className="text-xs text-[#0E0C0B]/70 font-sans">
              There are currently no coffees matching your selected subcategory or filter combination.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-6 py-3 bg-[#0E0C0B] text-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-[#C88E38] transition-colors cursor-pointer"
            >
              RESET COFFEE FILTERS
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {paginatedCoffees.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredCoffees.length}
              pageSize={pageSize}
              onPageChange={handlePageSelect}
              scrollTargetId="coffee-product-grid-start"
              itemName="coffees"
            />
          </>
        )}
        </div>

      </section>

    </div>
  );
};
