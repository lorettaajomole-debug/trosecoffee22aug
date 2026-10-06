import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, ChevronDown, RotateCcw, ArrowRight } from 'lucide-react';
import { Product, GrindOption } from '../types';
import { ProductCard } from './ProductCard';
import { Pagination } from './Pagination';
import { useResponsivePageSize } from '../hooks/useResponsivePageSize';
import { CategoryInfo, getProductsForCategory } from '../services/categoryManager';

interface CategoryPageProps {
  category: CategoryInfo;
  allProducts: Product[];
  initialPage?: number;
  onPageChange?: (newPage: number) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, grind?: GrindOption, quantity?: number) => void;
  onNavigateCategory: (catId: string) => void;
  onNavigateHome: () => void;
  isLoading?: boolean;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  allProducts,
  initialPage = 1,
  onPageChange,
  onSelectProduct,
  onAddToCart,
  onNavigateCategory,
  onNavigateHome,
  isLoading = false
}) => {
  // Responsive page size: 12 on desktop, 6 on mobile
  const pageSize = useResponsivePageSize(6, 12);

  // Live products for this specific category
  const categoryProducts = useMemo(() => {
    return getProductsForCategory(allProducts, category.id);
  }, [allProducts, category.id]);

  // States
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'best-selling'>('featured');
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Sync initialPage from outside/URL
  useEffect(() => {
    if (initialPage && initialPage !== currentPage) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  const handlePageSelect = (page: number) => {
    setCurrentPage(page);
    if (onPageChange) onPageChange(page);
  };

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
    if (onPageChange) onPageChange(1);
  }, [inStockOnly, priceRange, sortBy, category.id]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let list = categoryProducts.filter((p) => {
      if (inStockOnly && !p.inStock) return false;
      if (priceRange === 'under-25' && p.price >= 25) return false;
      if (priceRange === '25-50' && (p.price < 25 || p.price > 50)) return false;
      if (priceRange === '50-100' && (p.price < 50 || p.price > 100)) return false;
      if (priceRange === 'over-100' && p.price < 100) return false;
      return true;
    });

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
  }, [categoryProducts, inStockOnly, priceRange, sortBy]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (inStockOnly) count++;
    if (priceRange !== 'all') count++;
    return count;
  }, [inStockOnly, priceRange]);

  const resetFilters = () => {
    setInStockOnly(false);
    setPriceRange('all');
    setSortBy('featured');
    setCurrentPage(1);
  };

  return (
    <div id={`category-page-${category.id}`} className="min-h-screen bg-[#FAF7F2] text-[#0E0C0B] flex flex-col">
      
      {/* Compact Editorial Category Hero */}
      <section className="relative bg-[#F4EFEA] border-b border-[#0E0C0B]/10 overflow-hidden py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          {/* Breadcrumbs Navigation */}
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#0E0C0B]/60 mb-6">
            <button onClick={onNavigateHome} className="hover:text-[#0E0C0B] cursor-pointer">
              HOME
            </button>
            <span>/</span>
            <button onClick={() => onNavigateCategory('coffee')} className="hover:text-[#0E0C0B] cursor-pointer">
              STORE
            </button>
            <span>/</span>
            <span className="text-[#C88E38] font-bold">{category.navLabel}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="md:col-span-8 space-y-4 text-left">
              <div className="flex items-center space-x-2 text-xs font-sans font-bold tracking-[0.2em] text-[#C88E38] uppercase">
                <span className="w-5 h-[1.5px] bg-[#C88E38]" />
                <span>{category.label}</span>
              </div>

              <div className="font-display">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0E0C0B] tracking-tight leading-[0.96] uppercase">
                  {category.heroHeadline}
                </h1>
              </div>

              <p className="text-sm sm:text-base text-[#0E0C0B]/80 font-sans max-w-xl leading-relaxed">
                {category.heroSubheadline} {category.description}
              </p>

              <div className="pt-2 flex items-center space-x-4 text-xs font-mono text-[#0E0C0B]/70">
                <span>{categoryProducts.length} Live Items Available</span>
                <span>•</span>
                <span>Shopify Verified Sourcing</span>
              </div>
            </div>

            {/* Right Editorial Vignette */}
            <div className="md:col-span-4 hidden md:flex justify-end">
              <div className="relative w-48 lg:w-56 aspect-[3/4] rounded-t-full overflow-hidden border-2 border-[#0E0C0B] shadow-xl bg-[#12100E]">
                <img
                  src={category.heroImage}
                  alt={category.label}
                  className="w-full h-full object-cover object-center filter contrast-[1.05]"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C0B]/70 to-transparent" />
                <div className="absolute bottom-3 inset-x-3 text-center">
                  <span className="text-[10px] font-sans font-bold tracking-widest text-white uppercase">
                    TROSE {category.navLabel}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Main Catalogue Section */}
      <section id="category-catalogue-grid" className="py-12 sm:py-16 max-w-7xl mx-auto px-6 sm:px-10 w-full flex-1">
        
        {/* Filters and Sorting Bar */}
        <div className="bg-[#F4EFEA] border border-[#0E0C0B]/15 p-4 sm:p-5 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Price Filter */}
            <div className="relative">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="appearance-none bg-white border border-[#0E0C0B]/20 text-[#0E0C0B] text-xs font-mono uppercase tracking-wider pl-3.5 pr-8 py-2.5 cursor-pointer focus:outline-none focus:border-[#C88E38]"
              >
                <option value="all">ALL PRICES</option>
                <option value="under-25">UNDER $25</option>
                <option value="25-50">$25 – $50</option>
                <option value="50-100">$50 – $100</option>
                <option value="over-100">$100+</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#0E0C0B]/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

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

            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs font-mono uppercase tracking-wider text-[#8A2B2B] hover:text-[#0E0C0B] flex items-center space-x-1 cursor-pointer underline underline-offset-4"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Sort By */}
          <div className="flex items-center justify-end space-x-2">
            <span className="text-[11px] font-mono uppercase text-[#0E0C0B]/60 hidden sm:inline">SORT BY:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white border border-[#0E0C0B]/20 text-[#0E0C0B] text-xs font-mono uppercase tracking-wider pl-3 pr-8 py-2.5 cursor-pointer focus:outline-none focus:border-[#C88E38]"
              >
                <option value="featured">Featured Items</option>
                <option value="best-selling">Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#0E0C0B]/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-[#0E0C0B]/10 p-4 space-y-4 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#0E0C0B]/15 p-12 text-center space-y-4 max-w-lg mx-auto my-8">
            <h3 className="text-xl font-display font-extrabold uppercase text-[#0E0C0B]">No products found</h3>
            <p className="text-xs text-[#0E0C0B]/70 font-sans">
              There are currently no items matching your criteria in this collection.
            </p>
            <button
              onClick={() => onNavigateCategory('coffee')}
              className="px-6 py-3 bg-[#0E0C0B] text-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-[#C88E38] transition-colors cursor-pointer"
            >
              EXPLORE OUR COFFEE
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {paginatedProducts.map((product) => (
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
              totalItems={filteredProducts.length}
              pageSize={pageSize}
              onPageChange={handlePageSelect}
              scrollTargetId="category-catalogue-grid"
              itemName="products"
            />
          </>
        )}

      </section>

    </div>
  );
};
