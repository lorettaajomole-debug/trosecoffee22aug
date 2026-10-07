import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  X, 
  ChevronDown, 
  Search, 
  Check, 
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import { Product, ProductCategory, SortOption, ShopFiltersState, GrindOption } from '../types';
import { ProductCard } from './ProductCard';
import { Pagination } from './Pagination';
import { useResponsivePageSize } from '../hooks/useResponsivePageSize';
import { TROSE_CATEGORY_ORDER } from '../services/shopify';
import { isStorefrontEligibleProduct } from '../services/productClassification';

interface ShopPageProps {
  products: Product[];
  initialCategory?: ProductCategory;
  initialPage?: number;
  onPageChange?: (newPage: number) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, grind?: GrindOption, quantity?: number) => void;
  onNavigateHome: () => void;
  isLoading?: boolean;
  isShopifyLive?: boolean;
}

const CATEGORY_TABS: { id: ProductCategory; label: string }[] = [
  { id: 'all', label: 'All Products' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'tea', label: 'Tea' },
  { id: 'mugs-drinkware', label: 'Mugs & Drinkware' },
  { id: 'machines', label: 'Machines' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'home-lifestyle', label: 'Home & Lifestyle' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'other', label: 'Other Collections' },
];

const ROAST_OPTIONS = ['all', 'Light', 'Medium', 'Medium-Dark', 'Dark', 'Espresso Roast'] as const;

const ORIGIN_OPTIONS = [
  'all',
  'Ethiopia',
  'Colombia',
  'Honduras',
  'Guatemala',
  'Peru',
  'Indonesia',
  'Italy',
  'Germany',
  'Japan',
  'USA'
];

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-25', label: 'Under $25' },
  { id: '25-50', label: '$25 – $50' },
  { id: '50-100', label: '$50 – $100' },
  { id: '100-300', label: '$100 – $300' },
  { id: 'over-300', label: '$300+' }
];

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  initialCategory = 'all',
  initialPage = 1,
  onPageChange,
  onSelectProduct,
  onAddToCart,
  onNavigateHome,
  isLoading = false,
  isShopifyLive = false,
}) => {
  // 12 products per page (Mobile = 2 columns × 6 rows = 12)
  const pageSize = useResponsivePageSize(12, 12);

  const [filters, setFilters] = useState<ShopFiltersState>({
    category: initialCategory,
    priceRange: 'all',
    roast: 'all',
    origin: 'all',
    availability: 'all',
    format: 'all',
    sortBy: 'featured'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Sync initialPage if changed from outside
  React.useEffect(() => {
    if (initialPage && initialPage !== currentPage) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  // Sync category if passed from outside
  React.useEffect(() => {
    if (initialCategory) {
      setFilters(prev => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  // Compute active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.priceRange !== 'all') count++;
    if (filters.roast !== 'all') count++;
    if (filters.origin !== 'all') count++;
    if (filters.availability !== 'all') count++;
    if (filters.format !== 'all') count++;
    if (searchQuery.trim().length > 0) count++;
    return count;
  }, [filters, searchQuery]);

  const resetFilters = () => {
    setFilters({
      category: 'all',
      priceRange: 'all',
      roast: 'all',
      origin: 'all',
      availability: 'all',
      format: 'all',
      sortBy: 'featured'
    });
    setSearchQuery('');
  };

  // Safe storefront eligible products (excludes placeholder records)
  const eligibleProducts = useMemo(() => {
    return products.filter(isStorefrontEligibleProduct);
  }, [products]);

  // Compute live product counts per department
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: eligibleProducts.length };
    eligibleProducts.forEach((p) => {
      const dept = p.department || p.category;
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return counts;
  }, [eligibleProducts]);

  const getCategoryCount = (tabId: ProductCategory) => {
    if (tabId === 'all') return eligibleProducts.length;
    if (tabId === 'coffee') return (categoryCounts['coffee'] || 0);
    if (tabId === 'tea') return (categoryCounts['tea'] || 0);
    if (tabId === 'mugs-drinkware') return (categoryCounts['mugs-drinkware'] || 0) + (categoryCounts['mugs-flasks'] || 0);
    if (tabId === 'machines') return (categoryCounts['machines'] || 0);
    if (tabId === 'accessories') return (categoryCounts['accessories'] || 0);
    if (tabId === 'home-lifestyle') return (categoryCounts['home-lifestyle'] || 0);
    if (tabId === 'apparel') return (categoryCounts['apparel'] || 0) + (categoryCounts['clothing'] || 0);
    if (tabId === 'other') return (categoryCounts['other'] || 0);
    return categoryCounts[tabId] || 0;
  };

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    return eligibleProducts.filter((p) => {
      // 1. Category / Department Filter
      if (filters.category !== 'all') {
        const matchesDept = p.department === filters.category;
        const matchesLegacyCat = p.category === filters.category;
        const matchesMugs = (filters.category === 'mugs-drinkware' || filters.category === 'mugs-flasks') && (p.department === 'mugs-drinkware' || p.category === 'mugs-flasks');
        const matchesApparel = (filters.category === 'apparel' || filters.category === 'clothing') && (p.department === 'apparel' || p.category === 'clothing');
        const matchesHome = (filters.category === 'home-lifestyle' || filters.category === 'tables' || filters.category === 'candles') && (p.department === 'home-lifestyle' || p.category === 'tables' || p.category === 'candles');
        const matchesTea = (filters.category === 'tea' || filters.category === 'beverages') && (p.department === 'tea' || p.category === 'tea' || p.category === 'beverages');
        const matchesCoffee = (filters.category === 'coffee' || filters.category === 'organic') && (p.department === 'coffee' || p.category === 'coffee' || p.category === 'organic');
        const matchesOther = (filters.category === 'other' || filters.category === 'snacks' || filters.category === 'bundles') && (p.department === 'other' || p.category === 'snacks' || p.category === 'bundles');

        if (!matchesDept && !matchesLegacyCat && !matchesMugs && !matchesApparel && !matchesHome && !matchesTea && !matchesCoffee && !matchesOther) {
          return false;
        }
      }

      // 2. Price Filter
      if (filters.priceRange === 'under-25' && p.price >= 25) return false;
      if (filters.priceRange === '25-50' && (p.price < 25 || p.price > 50)) return false;
      if (filters.priceRange === '50-100' && (p.price < 50 || p.price > 100)) return false;
      if (filters.priceRange === '100-300' && (p.price < 100 || p.price > 300)) return false;
      if (filters.priceRange === 'over-300' && p.price <= 300) return false;

      // 3. Roast Level Filter
      if (filters.roast !== 'all') {
        if (!p.roastLevel || p.roastLevel.toLowerCase() !== filters.roast.toLowerCase()) {
          return false;
        }
      }

      // 4. Origin Filter
      if (filters.origin !== 'all') {
        if (!p.origin || !p.origin.toLowerCase().includes(filters.origin.toLowerCase())) {
          return false;
        }
      }

      // 5. Availability Filter
      if (filters.availability === 'in-stock' && !p.inStock) return false;
      if (filters.availability === 'sold-out' && p.inStock) return false;

      // 6. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesNotes = p.tastingNotes?.some(n => n.toLowerCase().includes(query));
        const matchesOrigin = p.origin?.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesNotes && !matchesOrigin && !matchesCategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Search Relevance Priority
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const aTitle = a.name.toLowerCase();
        const bTitle = b.name.toLowerCase();

        const aExact = aTitle === query;
        const bExact = bTitle === query;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        const aStarts = aTitle.startsWith(query);
        const bStarts = bTitle.startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        const aIncludes = aTitle.includes(query);
        const bIncludes = bTitle.includes(query);
        if (aIncludes && !bIncludes) return -1;
        if (!aIncludes && bIncludes) return 1;

        if (a.inStock !== b.inStock) {
          return a.inStock ? -1 : 1;
        }
        return 0;
      }

      // Explicit Sorts
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'best-selling') {
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        return b.reviewsCount - a.reviewsCount;
      }
      if (filters.sortBy === 'newest') {
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return 0;
      }

      // Default Featured Order: TROSE Merchandising Order
      const priorityA = TROSE_CATEGORY_ORDER[a.category] ?? 99;
      const priorityB = TROSE_CATEGORY_ORDER[b.category] ?? 99;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      if (a.category === 'coffee' || a.category === 'organic') {
        const getCoffeeScore = (p: Product) => {
          const nameLower = p.name.toLowerCase();
          const rawTags = (p.rawShopifyProduct?.tags || []).map((t) => t.toLowerCase());
          let score = 0;
          if (p.isBestSeller || rawTags.includes('bestseller') || nameLower.includes('best seller')) score += 10;
          if (rawTags.includes('sample pack') || nameLower.includes('sample pack')) score += 8;
          if (rawTags.includes('blend') || nameLower.includes('blend')) score += 6;
          if (rawTags.includes('single origin') || nameLower.includes('single origin')) score += 4;
          return score;
        };
        const scoreDiff = getCoffeeScore(b) - getCoffeeScore(a);
        if (scoreDiff !== 0) return scoreDiff;
      }

      if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
      if (a.isBestSeller && !b.isBestSeller) return -1;
      if (!a.isBestSeller && b.isBestSeller) return 1;
      return b.rating - a.rating;
    });
  }, [products, filters, searchQuery]);

  const handlePageSelect = (page: number) => {
    setCurrentPage(page);
    if (onPageChange) onPageChange(page);
  };

  React.useEffect(() => {
    setCurrentPage(1);
    if (onPageChange) onPageChange(1);
  }, [filters, searchQuery]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  return (
    <div id="trose-shop-page-view" className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Shop Page Banner / Header */}
        <div className="border-b border-[#12100E]/15 pb-6 mb-6 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="mb-3">
                <button
                  id="shop-back-btn"
                  onClick={() => {
                    if (window.history.length > 1) {
                      window.history.back();
                    } else {
                      onNavigateHome();
                    }
                  }}
                  className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#12100E]/70 hover:text-[#12100E] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>BACK</span>
                </button>
              </div>
              <h1 className="text-3xl sm:text-5xl font-editorial font-semibold text-[#12100E] tracking-tight uppercase">
                Shop
              </h1>
              <p className="text-sm text-[#12100E]/75 max-w-xl mt-2 font-sans font-normal">
                Explore TROSE coffee, tea, drinkware, machines, accessories and more.
              </p>
            </div>

            {/* Quick Search in Header */}
            <div className="relative min-w-[260px] sm:min-w-[320px]">
              <Search className="w-3.5 h-3.5 text-[#12100E]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH ROASTS, FLAVORS, ORIGIN..."
                className="w-full pl-9 pr-8 py-3 bg-[#FDFBF7] border border-[#12100E]/20 text-xs text-[#12100E] focus:outline-none focus:border-[#12100E] font-mono uppercase tracking-wider placeholder:text-[#12100E]/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#12100E]/50 hover:text-[#12100E]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar: Mobile Filter Button, Sorting Dropdown & Results Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#12100E]/15 mb-8">
          
          <div className="flex items-center space-x-3">
            {/* Mobile Filter Toggle */}
            <button
              id="mobile-filter-open-btn"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2.5 bg-[#FDFBF7] border border-[#12100E] text-[10px] font-mono font-bold uppercase tracking-wider text-[#12100E] cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>FILTER & CATEGORIES {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
            </button>

            {/* Results Count */}
            <span className="text-xs text-[#69574A] font-mono">
              SHOWING <strong className="text-[#12100E] font-bold">{filteredProducts.length}</strong> OF {products.length} ITEMS
            </span>
          </div>

          {/* Sort Selector Dropdown */}
          <div className="flex items-center space-x-2.5">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#69574A] hidden sm:inline font-bold">
              SORT:
            </span>
            <div className="relative">
              <select
                id="shop-sort-select"
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as SortOption }))}
                aria-label="Sort products by"
                className="appearance-none bg-[#FDFBF7] border border-[#12100E]/20 hover:border-[#12100E] px-4 py-2 pr-9 text-xs font-mono uppercase tracking-wider text-[#12100E] focus:outline-none focus:border-[#12100E] cursor-pointer"
              >
                <option value="featured">Featured Selections</option>
                <option value="best-selling">Best Selling</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#12100E]/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Reset Filters Icon Button */}
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="p-2 text-xs text-[#12100E] hover:text-[#D62828] border border-[#12100E]/20 bg-[#FDFBF7] cursor-pointer transition-colors"
                title="Clear all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Chips Strip (Zero pills) */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap pb-6 mb-6 border-b border-[#12100E]/15 text-left">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#69574A] font-bold">
              ACTIVE FILTERS:
            </span>
            
            {filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FDFBF7] border border-[#12100E] text-[10px] font-mono uppercase text-[#12100E]">
                Category: <strong>{filters.category.replace('-', ' ')}</strong>
                <button onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))} className="hover:text-[#D62828] ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.roast !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FDFBF7] border border-[#12100E] text-[10px] font-mono uppercase text-[#12100E]">
                Roast: <strong>{filters.roast}</strong>
                <button onClick={() => setFilters(prev => ({ ...prev, roast: 'all' }))} className="hover:text-[#D62828] ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.origin !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FDFBF7] border border-[#12100E] text-[10px] font-mono uppercase text-[#12100E]">
                Origin: <strong>{filters.origin}</strong>
                <button onClick={() => setFilters(prev => ({ ...prev, origin: 'all' }))} className="hover:text-[#D62828] ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FDFBF7] border border-[#12100E] text-[10px] font-mono uppercase text-[#12100E]">
                Price: <strong>{PRICE_RANGES.find(p => p.id === filters.priceRange)?.label}</strong>
                <button onClick={() => setFilters(prev => ({ ...prev, priceRange: 'all' }))} className="hover:text-[#D62828] ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.availability !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FDFBF7] border border-[#12100E] text-[10px] font-mono uppercase text-[#12100E]">
                Stock: <strong>{filters.availability === 'in-stock' ? 'In Stock' : 'Sold Out'}</strong>
                <button onClick={() => setFilters(prev => ({ ...prev, availability: 'all' }))} className="hover:text-[#D62828] ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FDFBF7] border border-[#12100E] text-[10px] font-mono uppercase text-[#12100E]">
                Keyword: <strong>"{searchQuery}"</strong>
                <button onClick={() => setSearchQuery('')} className="hover:text-[#D62828] ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-[10px] font-mono uppercase tracking-wider text-[#D62828] underline underline-offset-2 hover:text-[#12100E] cursor-pointer ml-2"
            >
              CLEAR ALL
            </button>
          </div>
        )}

        {/* Layout Grid: 3 Cols Filter Sidebar (Desktop) + 9 Cols Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Desktop Filter Sidebar (3 Columns) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            
            {/* 1. Category Filter */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold block">
                01 / CATEGORIES
              </span>
              <div className="space-y-1">
                {CATEGORY_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilters(prev => ({ ...prev, category: tab.id }))}
                    className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer border ${
                      filters.category === tab.id
                        ? 'bg-[#12100E] text-white border-[#12100E] font-bold'
                        : 'bg-transparent text-[#12100E]/75 border-transparent hover:border-[#12100E]/20 hover:text-[#12100E]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] opacity-60 font-mono">({getCategoryCount(tab.id)})</span>
                      {filters.category === tab.id && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Price Range */}
            <div className="space-y-2 pt-4 border-t border-[#12100E]/15">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#69574A] font-bold block">
                02 / PRICE
              </span>
              <div className="space-y-1">
                {PRICE_RANGES.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setFilters(prev => ({ ...prev, priceRange: range.id }))}
                    className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer border ${
                      filters.priceRange === range.id
                        ? 'bg-[#12100E] text-white border-[#12100E] font-bold'
                        : 'bg-transparent text-[#12100E]/75 border-transparent hover:border-[#12100E]/20 hover:text-[#12100E]'
                    }`}
                  >
                    <span>{range.label}</span>
                    {filters.priceRange === range.id && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Roast Profile */}
            <div className="space-y-2 pt-4 border-t border-[#12100E]/15">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#69574A] font-bold block">
                03 / ROAST PROFILE
              </span>
              <div className="space-y-1">
                {ROAST_OPTIONS.map((roast) => (
                  <button
                    key={roast}
                    onClick={() => setFilters(prev => ({ ...prev, roast }))}
                    className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer border ${
                      filters.roast === roast
                        ? 'bg-[#12100E] text-white border-[#12100E] font-bold'
                        : 'bg-transparent text-[#12100E]/75 border-transparent hover:border-[#12100E]/20 hover:text-[#12100E]'
                    }`}
                  >
                    <span>{roast === 'all' ? 'All Roasts' : `${roast} Roast`}</span>
                    {filters.roast === roast && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Origin Filter */}
            <div className="space-y-2 pt-4 border-t border-[#12100E]/15">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#69574A] font-bold block">
                04 / ORIGIN & TERROIR
              </span>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {ORIGIN_OPTIONS.map((orig) => (
                  <button
                    key={orig}
                    onClick={() => setFilters(prev => ({ ...prev, origin: orig }))}
                    className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer border ${
                      filters.origin === orig
                        ? 'bg-[#12100E] text-white border-[#12100E] font-bold'
                        : 'bg-transparent text-[#12100E]/75 border-transparent hover:border-[#12100E]/20 hover:text-[#12100E]'
                    }`}
                  >
                    <span>{orig === 'all' ? 'All Origins' : orig}</span>
                    {filters.origin === orig && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Availability Filter */}
            <div className="space-y-2 pt-4 border-t border-[#12100E]/15">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#69574A] font-bold block">
                05 / AVAILABILITY
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, availability: 'all' }))}
                  className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer border ${
                    filters.availability === 'all' ? 'bg-[#12100E] text-white border-[#12100E] font-bold' : 'bg-transparent text-[#12100E]/75 border-transparent hover:border-[#12100E]/20'
                  }`}
                >
                  <span>All Items</span>
                  {filters.availability === 'all' && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, availability: 'in-stock' }))}
                  className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer border ${
                    filters.availability === 'in-stock' ? 'bg-[#12100E] text-white border-[#12100E] font-bold' : 'bg-transparent text-[#12100E]/75 border-transparent hover:border-[#12100E]/20'
                  }`}
                >
                  <span>In Stock Only</span>
                  {filters.availability === 'in-stock' && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, availability: 'sold-out' }))}
                  className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer border ${
                    filters.availability === 'sold-out' ? 'bg-[#12100E] text-white border-[#12100E] font-bold' : 'bg-transparent text-[#12100E]/75 border-transparent hover:border-[#12100E]/20'
                  }`}
                >
                  <span>Sold Out</span>
                  {filters.availability === 'sold-out' && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                </button>
              </div>
            </div>

          </aside>

          {/* Product Grid Area (9 Columns) */}
          <div id="shop-product-grid-start" className="lg:col-span-9">
            
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#FDFBF7] border border-[#12100E]/15 animate-pulse flex flex-col aspect-[4/5]"
                  >
                    <div className="aspect-[4/3] bg-gray-200" />
                    <div className="p-3 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 w-1/3" />
                        <div className="h-5 bg-gray-200 w-3/4" />
                        <div className="h-3 bg-gray-100 w-1/2" />
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="h-6 bg-gray-200 w-16" />
                        <div className="h-8 bg-gray-200 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-[#FDFBF7] border border-[#12100E]/15 p-12 text-center space-y-4">
                <div className="w-14 h-14 border border-[#12100E] flex items-center justify-center mx-auto text-[#12100E]">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-editorial font-bold text-[#12100E] uppercase">No Matching Products</h3>
                <p className="text-xs text-[#12100E]/70 max-w-md mx-auto font-sans">
                  No products match the selected criteria. Try adjusting or clearing your filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-[#12100E] text-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-[#D62828] transition-colors cursor-pointer"
                >
                  RESET ALL FILTERS
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewProduct={onSelectProduct}
                      onAddToCart={onAddToCart}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredProducts.length}
                  pageSize={pageSize}
                  onPageChange={handlePageSelect}
                  scrollTargetId="shop-product-grid-start"
                  itemName="products"
                />
              </>
            )}

          </div>

        </div>

      </div>

      {/* Mobile Filters Drawer Modal (Bauhaus Sheet) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-[#12100E]/70 backdrop-blur-xs"
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-sm bg-[#FAF7F2] h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto border-l border-[#12100E]">
            
            <div className="p-6 space-y-6 text-left">
              
              <div className="flex items-center justify-between border-b border-[#12100E]/15 pb-4">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-editorial text-lg font-bold text-[#12100E] uppercase">Filters & Categories</span>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#12100E] hover:text-[#D62828]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category Select */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold block">
                  CATEGORY
                </span>
                <div className="space-y-1">
                  {CATEGORY_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilters(prev => ({ ...prev, category: tab.id }))}
                      className={`w-full text-left px-3 py-2 text-xs font-mono uppercase transition-colors flex items-center justify-between ${
                        filters.category === tab.id
                          ? 'bg-[#12100E] text-white font-bold'
                          : 'text-[#12100E]/80 hover:bg-black/5'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] opacity-60 font-mono">({getCategoryCount(tab.id)})</span>
                        {filters.category === tab.id && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="space-y-2 pt-4 border-t border-[#12100E]/15">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#69574A] font-bold block">
                  PRICE
                </span>
                <div className="space-y-1">
                  {PRICE_RANGES.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setFilters(prev => ({ ...prev, priceRange: range.id }))}
                      className={`w-full text-left px-3 py-2 text-xs font-mono uppercase transition-colors flex items-center justify-between ${
                        filters.priceRange === range.id
                          ? 'bg-[#12100E] text-white font-bold'
                          : 'text-[#12100E]/80 hover:bg-black/5'
                      }`}
                    >
                      <span>{range.label}</span>
                      {filters.priceRange === range.id && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Roast */}
              <div className="space-y-2 pt-4 border-t border-[#12100E]/15">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#69574A] font-bold block">
                  ROAST PROFILE
                </span>
                <div className="space-y-1">
                  {ROAST_OPTIONS.map((roast) => (
                    <button
                      key={roast}
                      onClick={() => setFilters(prev => ({ ...prev, roast }))}
                      className={`w-full text-left px-3 py-2 text-xs font-mono uppercase transition-colors flex items-center justify-between ${
                        filters.roast === roast
                          ? 'bg-[#12100E] text-white font-bold'
                          : 'text-[#12100E]/80 hover:bg-black/5'
                      }`}
                    >
                      <span>{roast === 'all' ? 'All Roasts' : `${roast} Roast`}</span>
                      {filters.roast === roast && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Mobile Footer Apply */}
            <div className="p-6 border-t border-[#12100E]/15 bg-[#FDFBF7] space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3.5 bg-[#12100E] text-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-[#D62828] transition-colors"
              >
                APPLY ({filteredProducts.length} PRODUCTS)
              </button>
              <button
                onClick={resetFilters}
                className="w-full py-2.5 text-xs font-mono text-[#69574A] hover:text-[#D62828] uppercase tracking-wider"
              >
                RESET FILTERS
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
