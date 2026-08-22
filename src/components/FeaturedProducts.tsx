import React, { useState, useMemo } from 'react';
import { Filter, Check, SlidersHorizontal } from 'lucide-react';
import { Product, ProductCategory, GrindOption } from '../types';
import { ProductCard } from './ProductCard';

interface FeaturedProductsProps {
  products: Product[];
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, grind?: GrindOption, quantity?: number) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  onQuickView,
  onAddToCart
}) => {
  const [selectedSort, setSelectedSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [selectedRoast, setSelectedRoast] = useState<string>('all');

  const categoryTabs: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'All Universe' },
    { id: 'coffee', label: 'Coffee' },
    { id: 'organic', label: 'Organic Coffee' },
    { id: 'beverages', label: 'Beverages' },
    { id: 'snacks', label: 'Snacks' },
    { id: 'tables', label: 'Coffee Tables' },
    { id: 'mugs-flasks', label: 'Mugs & Flasks' },
    { id: 'machines', label: 'Coffee Machines' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'bundles', label: 'Gift Flights' }
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Organic filter
    if (onlyOrganic) {
      list = list.filter((p) => p.isOrganic);
    }

    // Roast filter
    if (selectedRoast !== 'all') {
      list = list.filter((p) => p.roastLevel === selectedRoast);
    }

    // Sorting
    if (selectedSort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      // featured
      list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return list;
  }, [products, activeCategory, onlyOrganic, selectedRoast, selectedSort]);

  return (
    <section id="shop-collection-section" className="py-16 sm:py-24 bg-[#FDFBF7] border-b border-[#E5E5CB]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <span className="h-[1px] w-6 bg-[#C5A059]"></span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">
              Freshly Roasted To Order
            </span>
            <span className="h-[1px] w-6 bg-[#C5A059]"></span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#3C2A21] tracking-tight">
            Curated Specialty Roasts & Gear
          </h2>
          <p className="text-sm sm:text-base text-[#3C2A21]/70 font-light leading-relaxed">
            Every bean is batch-roasted on demand, nitrogen-sealed for supreme freshness, and shipped directly to your threshold.
          </p>
        </div>

        {/* Category Tabs & Controls Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E5E5CB]">
          
          {/* Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {categoryTabs.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-filter-${tab.id}`}
                  onClick={() => onSelectCategory(tab.id)}
                  className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#3C2A21] text-white shadow-sm'
                      : 'bg-[#E5E5CB]/40 text-[#3C2A21]/80 hover:bg-[#E5E5CB] hover:text-[#3C2A21]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Sub Filters & Sort */}
          <div className="flex flex-wrap items-center justify-end gap-3 w-full lg:w-auto text-xs">
            
            {/* Quick Organic Toggle */}
            <button
              id="toggle-organic-filter-btn"
              onClick={() => setOnlyOrganic(!onlyOrganic)}
              className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 font-medium transition-colors cursor-pointer ${
                onlyOrganic
                  ? 'bg-[#3C2A21] text-[#E5C378] border-[#3C2A21]'
                  : 'bg-white text-[#3C2A21] border-[#E5E5CB] hover:bg-[#F5F2EB]'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${onlyOrganic ? 'border-[#C5A059] bg-[#C5A059]' : 'border-gray-400'}`}>
                {onlyOrganic && <Check className="w-2.5 h-2.5 text-[#211C1A] stroke-[3]" />}
              </div>
              <span className="text-[11px]">USDA Organic Only</span>
            </button>

            {/* Roast Level Selector */}
            <div className="flex items-center space-x-1 bg-white px-2.5 py-1.5 rounded-lg border border-[#E5E5CB]">
              <Filter className="w-3.5 h-3.5 text-[#7E7067]" />
              <select
                id="roast-level-select"
                value={selectedRoast}
                onChange={(e) => setSelectedRoast(e.target.value)}
                className="bg-transparent text-[#3C2A21] focus:outline-none cursor-pointer font-medium text-[11px]"
              >
                <option value="all">All Roasts</option>
                <option value="Light">Light Roast</option>
                <option value="Medium">Medium Roast</option>
                <option value="Dark">Dark Roast</option>
                <option value="Espresso Roast">Espresso Roast</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center space-x-1 bg-white px-2.5 py-1.5 rounded-lg border border-[#E5E5CB]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#7E7067]" />
              <select
                id="sort-by-select"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as any)}
                className="bg-transparent text-[#3C2A21] focus:outline-none cursor-pointer font-medium text-[11px]"
              >
                <option value="featured">Featured Roasts</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#E5E5CB]">
            <p className="text-base text-[#7E7067] mb-2 font-serif">No products found matching your current filter.</p>
            <button
              onClick={() => {
                onSelectCategory('all');
                setOnlyOrganic(false);
                setSelectedRoast('all');
              }}
              className="text-xs uppercase tracking-widest text-[#C5A059] font-bold underline cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewProduct={onQuickView}
                onAddToCart={onAddToCart}
                showViewButton={true}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

