import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  X, 
  ChevronDown, 
  Search, 
  Check, 
  Sparkles, 
  RotateCcw, 
  ArrowUpDown, 
  Filter, 
  Grid3X3, 
  LayoutGrid
} from 'lucide-react';
import { Product, ProductCategory, SortOption, ShopFiltersState, GrindOption } from '../types';
import { ProductCard } from './ProductCard';
import { TROSE_CATEGORY_ORDER } from '../services/shopify';

interface ShopPageProps {
  products: Product[];
  initialCategory?: ProductCategory;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, grind?: GrindOption, quantity?: number) => void;
  onNavigateHome: () => void;
  isLoading?: boolean;
  isShopifyLive?: boolean;
}

const CATEGORY_TABS: { id: ProductCategory; label: string }[] = [
  { id: 'all', label: 'All Collections' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'organic', label: 'Organic Coffee' },
  { id: 'beverages', label: 'Beverages / Tea' },
  { id: 'machines', label: 'Coffee Machines' },
  { id: 'mugs-flasks', label: 'Mugs & Flasks' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'snacks', label: 'Snacks' },
  { id: 'tables', label: 'Coffee Tables' },
  { id: 'bundles', label: 'Bundles / Other' },
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
] as const;

const FORMAT_OPTIONS = [
  'all',
  '12 oz (340g)',
  '2 lb (908g)',
  '5 lb Roaster Bag',
  'Tumbler / Flask',
  'Amber Glass',
  'Artisan Chocolate',
  'Solid Walnut & Marble'
];

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  initialCategory = 'all',
  onSelectProduct,
  onAddToCart,
  onNavigateHome,
  isLoading = false,
  isShopifyLive = false,
}) => {
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

  // Sync category if passed from outside
  React.useEffect(() => {
    if (initialCategory) {
      setFilters(prev => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.priceRange !== 'all') count++;
    if (filters.roast !== 'all') count++;
    if (filters.origin !== 'all') count++;
    if (filters.availability !== 'all') count++;
    if (filters.format !== 'all') count++;
    if (searchQuery.trim()) count++;
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

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesNotes = product.tastingNotes?.some(n => n.toLowerCase().includes(query));
        const matchesOrigin = product.origin?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesNotes && !matchesOrigin) {
          return false;
        }
      }

      // Category & Shopify Collection matching
      if (filters.category !== 'all') {
        if (filters.category === 'organic') {
          if (!product.isOrganic && product.category !== 'organic') return false;
        } else if (
          product.category !== filters.category &&
          !product.collectionHandles?.some((h) => h.includes(filters.category))
        ) {
          return false;
        }
      }

      // Price Range
      if (filters.priceRange !== 'all') {
        if (filters.priceRange === 'under-25' && product.price >= 25) return false;
        if (filters.priceRange === '25-50' && (product.price < 25 || product.price > 50)) return false;
        if (filters.priceRange === '50-100' && (product.price < 50 || product.price > 100)) return false;
        if (filters.priceRange === '100-300' && (product.price < 100 || product.price > 300)) return false;
        if (filters.priceRange === 'over-300' && product.price <= 300) return false;
      }

      // Roast Level
      if (filters.roast !== 'all') {
        if (product.roastLevel !== filters.roast) return false;
      }

      // Origin
      if (filters.origin !== 'all') {
        const countryMatch = product.country?.toLowerCase() === filters.origin.toLowerCase();
        const originMatch = product.origin?.toLowerCase().includes(filters.origin.toLowerCase());
        if (!countryMatch && !originMatch) return false;
      }

      // Availability
      if (filters.availability !== 'all') {
        if (filters.availability === 'in-stock' && !product.inStock) return false;
        if (filters.availability === 'sold-out' && product.inStock) return false;
      }

      // Format
      if (filters.format !== 'all') {
        const hasFormat = product.formats?.some(f => f.toLowerCase().includes(filters.format.toLowerCase())) ||
                          product.weightOrSpecs?.toLowerCase().includes(filters.format.toLowerCase());
        if (!hasFormat) return false;
      }

      return true;
    }).sort((a, b) => {
      // 1. Explicit search query: Prioritize text relevance, do NOT force category order
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const aTitle = a.name.toLowerCase();
        const bTitle = b.name.toLowerCase();

        // Exact match
        const aExact = aTitle === query;
        const bExact = bTitle === query;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        // Starts with query
        const aStarts = aTitle.startsWith(query);
        const bStarts = bTitle.startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        // Contains in title
        const aIncludes = aTitle.includes(query);
        const bIncludes = bTitle.includes(query);
        if (aIncludes && !bIncludes) return -1;
        if (!aIncludes && bIncludes) return 1;

        // In-stock next
        if (a.inStock !== b.inStock) {
          return a.inStock ? -1 : 1;
        }
        return 0;
      }

      // 2. Explicit sort options
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

      // 3. 'featured' default: strictly follow TROSE Merchandising Priority
      // 1. Coffee, 2. Organic Coffee, 3. Beverages / Tea, 4. Coffee Machines,
      // 5. Mugs & Flasks, 6. Accessories, 7. Snacks, 8. Coffee Tables, 9. Bundles / Other
      const priorityA = TROSE_CATEGORY_ORDER[a.category] ?? 99;
      const priorityB = TROSE_CATEGORY_ORDER[b.category] ?? 99;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // Within Coffee & Organic Coffee, prioritize popular roasts, signature blends, and sample packs
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
        if (scoreDiff !== 0) {
          return scoreDiff;
        }
      }

      // In-stock products first
      if (a.inStock !== b.inStock) {
        return a.inStock ? -1 : 1;
      }
      if (a.isBestSeller && !b.isBestSeller) return -1;
      if (!a.isBestSeller && b.isBestSeller) return 1;
      return b.rating - a.rating;
    });
  }, [products, filters, searchQuery]);

  return (
    <div id="trose-shop-page-view" className="bg-[#FDFBF7] min-h-screen py-8 sm:py-12 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Shop Page Banner / Header */}
        <div className="border-b border-[#E5E5CB] pb-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <nav className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#7E7067] mb-2">
                <button onClick={onNavigateHome} className="hover:text-[#3C2A21] cursor-pointer">
                  Home
                </button>
                <span>/</span>
                <span className="text-[#3C2A21] font-semibold">The Shop Collection</span>
              </nav>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#3C2A21] tracking-tight">
                Curated Coffee & Living
              </h1>
              <p className="text-xs sm:text-sm text-[#7E7067] max-w-2xl mt-2 font-light">
                Discover artisan single-origins, certified organic roasts, prosumer espresso machinery, and bespoke living pieces.
              </p>
            </div>

            {/* Quick Search in Header */}
            <div className="relative min-w-[260px] sm:min-w-[300px]">
              <Search className="w-4 h-4 text-[#7E7067] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roasts, notes, origins..."
                className="w-full pl-9 pr-8 py-2.5 bg-white border border-[#E5E5CB] rounded-xl text-xs text-[#3C2A21] focus:outline-none focus:border-[#C5A059] shadow-2xs font-sans placeholder:text-[#7E7067]/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7E7067] hover:text-[#3C2A21]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Horizontal Category Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 scrollbar-none no-scrollbar">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                id={`shop-tab-${tab.id}`}
                onClick={() => setFilters(prev => ({ ...prev, category: tab.id }))}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider whitespace-nowrap transition-all cursor-pointer border ${
                  filters.category === tab.id
                    ? 'bg-[#3C2A21] text-white border-[#3C2A21] shadow-xs font-semibold'
                    : 'bg-white text-[#3C2A21]/80 border-[#E5E5CB] hover:border-[#3C2A21] hover:text-[#3C2A21]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Bar: Mobile Filter Button, Sorting Dropdown & Results Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5CB] mb-8">
          
          <div className="flex items-center space-x-3">
            {/* Mobile Filter Toggle */}
            <button
              id="mobile-filter-open-btn"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-[#E5E5CB] rounded-lg text-xs font-semibold uppercase tracking-wider text-[#3C2A21] shadow-2xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
            </button>

            {/* Results Count */}
            <span className="text-xs text-[#7E7067] font-mono">
              Showing <strong className="text-[#3C2A21]">{filteredProducts.length}</strong> of {products.length} Products
            </span>
          </div>

          {/* Sort Selector Dropdown */}
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#7E7067] hidden sm:inline">
              Sort By:
            </span>
            <div className="relative">
              <select
                id="shop-sort-select"
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as SortOption }))}
                aria-label="Sort products by"
                className="appearance-none bg-white border border-[#E5E5CB] hover:border-[#3C2A21] rounded-lg px-4 py-2 pr-9 text-xs font-medium text-[#3C2A21] focus:outline-none focus:border-[#C5A059] cursor-pointer shadow-2xs font-sans"
              >
                <option value="featured">Featured Selections</option>
                <option value="best-selling">Best Selling</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#7E7067] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Reset Filters Icon Button if active */}
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="p-2 text-xs text-[#7E7067] hover:text-[#C5A059] border border-[#E5E5CB] rounded-lg bg-white shadow-2xs cursor-pointer transition-colors"
                title="Clear all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Chips Strip */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap pb-6 mb-6 border-b border-[#E5E5CB]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#7E7067]">
              Active Filters:
            </span>
            
            {filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-[#E5E5CB] rounded-full text-xs text-[#3C2A21] shadow-2xs">
                Category: <strong className="capitalize">{filters.category.replace('-', ' ')}</strong>
                <button onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))} className="hover:text-red-500 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.roast !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-[#E5E5CB] rounded-full text-xs text-[#3C2A21] shadow-2xs">
                Roast: <strong>{filters.roast}</strong>
                <button onClick={() => setFilters(prev => ({ ...prev, roast: 'all' }))} className="hover:text-red-500 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.origin !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-[#E5E5CB] rounded-full text-xs text-[#3C2A21] shadow-2xs">
                Origin: <strong>{filters.origin}</strong>
                <button onClick={() => setFilters(prev => ({ ...prev, origin: 'all' }))} className="hover:text-red-500 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-[#E5E5CB] rounded-full text-xs text-[#3C2A21] shadow-2xs">
                Price: <strong>{PRICE_RANGES.find(p => p.id === filters.priceRange)?.label}</strong>
                <button onClick={() => setFilters(prev => ({ ...prev, priceRange: 'all' }))} className="hover:text-red-500 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.availability !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-[#E5E5CB] rounded-full text-xs text-[#3C2A21] shadow-2xs">
                Stock: <strong>{filters.availability === 'in-stock' ? 'In Stock' : 'Sold Out'}</strong>
                <button onClick={() => setFilters(prev => ({ ...prev, availability: 'all' }))} className="hover:text-red-500 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-[#E5E5CB] rounded-full text-xs text-[#3C2A21] shadow-2xs">
                Keyword: <strong>"{searchQuery}"</strong>
                <button onClick={() => setSearchQuery('')} className="hover:text-red-500 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-[#C5A059] hover:underline ml-2 cursor-pointer"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Main Content Layout: Desktop Sidebar Filters + Product Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar (3 Columns) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-2xl border border-[#E5E5CB] shadow-xs space-y-6 sticky top-28">
            
            <div className="flex items-center justify-between border-b border-[#E5E5CB] pb-4">
              <span className="text-xs font-mono uppercase tracking-widest font-bold text-[#3C2A21] flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#C5A059]" /> Filter Catalog
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[#C5A059] font-medium hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* 1. Category Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#7E7067] font-semibold block">
                Category
              </label>
              <div className="space-y-1">
                {CATEGORY_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilters(prev => ({ ...prev, category: tab.id }))}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      filters.category === tab.id
                        ? 'bg-[#3C2A21] text-white font-semibold'
                        : 'text-[#3C2A21]/80 hover:bg-[#E5E5CB]/30'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {filters.category === tab.id && <Check className="w-3 h-3 text-[#C5A059]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Price Range */}
            <div className="space-y-2 pt-4 border-t border-[#E5E5CB]">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#7E7067] font-semibold block">
                Price
              </label>
              <div className="space-y-1">
                {PRICE_RANGES.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setFilters(prev => ({ ...prev, priceRange: range.id }))}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      filters.priceRange === range.id
                        ? 'bg-[#3C2A21] text-white font-semibold'
                        : 'text-[#3C2A21]/80 hover:bg-[#E5E5CB]/30'
                    }`}
                  >
                    <span>{range.label}</span>
                    {filters.priceRange === range.id && <Check className="w-3 h-3 text-[#C5A059]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Roast Level Filter */}
            <div className="space-y-2 pt-4 border-t border-[#E5E5CB]">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#7E7067] font-semibold block">
                Roast Profile
              </label>
              <div className="space-y-1">
                {ROAST_OPTIONS.map((roast) => (
                  <button
                    key={roast}
                    onClick={() => setFilters(prev => ({ ...prev, roast }))}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      filters.roast === roast
                        ? 'bg-[#3C2A21] text-white font-semibold'
                        : 'text-[#3C2A21]/80 hover:bg-[#E5E5CB]/30'
                    }`}
                  >
                    <span>{roast === 'all' ? 'All Roasts' : `${roast} Roast`}</span>
                    {filters.roast === roast && <Check className="w-3 h-3 text-[#C5A059]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Origin Filter */}
            <div className="space-y-2 pt-4 border-t border-[#E5E5CB]">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#7E7067] font-semibold block">
                Origin / Region
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {ORIGIN_OPTIONS.map((orig) => (
                  <button
                    key={orig}
                    onClick={() => setFilters(prev => ({ ...prev, origin: orig }))}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      filters.origin === orig
                        ? 'bg-[#3C2A21] text-white font-semibold'
                        : 'text-[#3C2A21]/80 hover:bg-[#E5E5CB]/30'
                    }`}
                  >
                    <span>{orig === 'all' ? 'All Origins' : orig}</span>
                    {filters.origin === orig && <Check className="w-3 h-3 text-[#C5A059]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Availability Filter */}
            <div className="space-y-2 pt-4 border-t border-[#E5E5CB]">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#7E7067] font-semibold block">
                Availability
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, availability: 'all' }))}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    filters.availability === 'all' ? 'bg-[#3C2A21] text-white font-semibold' : 'text-[#3C2A21]/80 hover:bg-[#E5E5CB]/30'
                  }`}
                >
                  <span>All Items</span>
                  {filters.availability === 'all' && <Check className="w-3 h-3 text-[#C5A059]" />}
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, availability: 'in-stock' }))}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    filters.availability === 'in-stock' ? 'bg-[#3C2A21] text-white font-semibold' : 'text-[#3C2A21]/80 hover:bg-[#E5E5CB]/30'
                  }`}
                >
                  <span>In Stock Only</span>
                  {filters.availability === 'in-stock' && <Check className="w-3 h-3 text-[#C5A059]" />}
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, availability: 'sold-out' }))}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    filters.availability === 'sold-out' ? 'bg-[#3C2A21] text-white font-semibold' : 'text-[#3C2A21]/80 hover:bg-[#E5E5CB]/30'
                  }`}
                >
                  <span>Sold Out</span>
                  {filters.availability === 'sold-out' && <Check className="w-3 h-3 text-[#C5A059]" />}
                </button>
              </div>
            </div>

          </aside>

          {/* Product Grid Area (9 Columns) */}
          <div className="lg:col-span-9">
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl overflow-hidden border border-[#E8DFD5] animate-pulse flex flex-col aspect-[4/5]"
                  >
                    <div className="aspect-[4/3] bg-gray-200" />
                    <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="h-6 bg-gray-200 rounded w-16" />
                        <div className="h-8 bg-gray-200 rounded-full w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E5E5CB] p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E5E5CB]/40 text-[#C5A059] flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif text-[#3C2A21]">No Products Found</h3>
                <p className="text-xs text-[#7E7067] max-w-md mx-auto">
                  We couldn't find any products matching your active filter criteria. Try resetting or adjusting your search parameters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-[#3C2A21] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#211C1A] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewProduct={onSelectProduct}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden animate-fadeIn">
          {/* Backdrop */}
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-[#211C1A]/60 backdrop-blur-xs"
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-sm bg-[#FDFBF7] h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto">
            
            <div className="p-6 space-y-6">
              
              <div className="flex items-center justify-between border-b border-[#E5E5CB] pb-4">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-serif text-lg font-bold text-[#3C2A21]">Filters</span>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#7E7067] hover:text-[#3C2A21]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#7E7067] font-semibold">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {CATEGORY_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilters(prev => ({ ...prev, category: tab.id }))}
                      className={`p-2 rounded-lg text-xs text-left truncate transition-colors ${
                        filters.category === tab.id
                          ? 'bg-[#3C2A21] text-white font-semibold'
                          : 'bg-white border border-[#E5E5CB] text-[#3C2A21]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2 pt-2 border-t border-[#E5E5CB]">
                <label className="text-xs font-mono uppercase tracking-wider text-[#7E7067] font-semibold">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {PRICE_RANGES.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setFilters(prev => ({ ...prev, priceRange: range.id }))}
                      className={`p-2 rounded-lg text-xs text-left transition-colors ${
                        filters.priceRange === range.id
                          ? 'bg-[#3C2A21] text-white font-semibold'
                          : 'bg-white border border-[#E5E5CB] text-[#3C2A21]'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Roast Level */}
              <div className="space-y-2 pt-2 border-t border-[#E5E5CB]">
                <label className="text-xs font-mono uppercase tracking-wider text-[#7E7067] font-semibold">
                  Roast Profile
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {ROAST_OPTIONS.map((roast) => (
                    <button
                      key={roast}
                      onClick={() => setFilters(prev => ({ ...prev, roast }))}
                      className={`p-2 rounded-lg text-xs text-left transition-colors ${
                        filters.roast === roast
                          ? 'bg-[#3C2A21] text-white font-semibold'
                          : 'bg-white border border-[#E5E5CB] text-[#3C2A21]'
                      }`}
                    >
                      {roast === 'all' ? 'All Roasts' : roast}
                    </button>
                  ))}
                </div>
              </div>

              {/* Origin */}
              <div className="space-y-2 pt-2 border-t border-[#E5E5CB]">
                <label className="text-xs font-mono uppercase tracking-wider text-[#7E7067] font-semibold">
                  Origin Country
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
                  {ORIGIN_OPTIONS.map((orig) => (
                    <button
                      key={orig}
                      onClick={() => setFilters(prev => ({ ...prev, origin: orig }))}
                      className={`p-2 rounded-lg text-xs text-left transition-colors ${
                        filters.origin === orig
                          ? 'bg-[#3C2A21] text-white font-semibold'
                          : 'bg-white border border-[#E5E5CB] text-[#3C2A21]'
                      }`}
                    >
                      {orig === 'all' ? 'All Origins' : orig}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2 pt-2 border-t border-[#E5E5CB]">
                <label className="text-xs font-mono uppercase tracking-wider text-[#7E7067] font-semibold">
                  Availability
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, availability: 'all' }))}
                    className={`p-2 rounded-lg text-xs text-center ${
                      filters.availability === 'all' ? 'bg-[#3C2A21] text-white font-semibold' : 'bg-white border border-[#E5E5CB]'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, availability: 'in-stock' }))}
                    className={`p-2 rounded-lg text-xs text-center ${
                      filters.availability === 'in-stock' ? 'bg-[#3C2A21] text-white font-semibold' : 'bg-white border border-[#E5E5CB]'
                    }`}
                  >
                    In Stock
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, availability: 'sold-out' }))}
                    className={`p-2 rounded-lg text-xs text-center ${
                      filters.availability === 'sold-out' ? 'bg-[#3C2A21] text-white font-semibold' : 'bg-white border border-[#E5E5CB]'
                    }`}
                  >
                    Sold Out
                  </button>
                </div>
              </div>

            </div>

            {/* Mobile Footer Apply Button */}
            <div className="p-6 bg-white border-t border-[#E5E5CB] flex items-center space-x-3">
              <button
                onClick={resetFilters}
                className="px-4 py-3 border border-[#E5E5CB] rounded-lg text-xs font-semibold text-[#7E7067]"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 bg-[#3C2A21] text-white rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                Show Results ({filteredProducts.length})
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
