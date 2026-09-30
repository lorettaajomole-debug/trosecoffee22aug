import React, { useState, useMemo } from 'react';
import { Filter, Check, SlidersHorizontal } from 'lucide-react';
import { Product, ProductCategory, GrindOption } from '../types';
import { ProductCard } from './ProductCard';
import { TROSE_CATEGORY_ORDER } from '../services/shopify';

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
    { id: 'all', label: 'All' },
    { id: 'coffee', label: 'Coffee' },
    { id: 'organic', label: 'Organic Coffee' },
    { id: 'beverages', label: 'Tea & Beverages' },
    { id: 'machines', label: 'Machines' },
    { id: 'mugs-flasks', label: 'Mugs & Flasks' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'snacks', label: 'Snacks' },
    { id: 'tables', label: 'Tables' },
    { id: 'bundles', label: 'Flights' }
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
      // featured: strictly prioritize Coffee and Organic Coffee before secondary merchandise
      list.sort((a, b) => {
        const priorityA = TROSE_CATEGORY_ORDER[a.category] ?? 99;
        const priorityB = TROSE_CATEGORY_ORDER[b.category] ?? 99;
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        if (a.inStock !== b.inStock) {
          return a.inStock ? -1 : 1;
        }
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
    }

    return list;
  }, [products, activeCategory, onlyOrganic, selectedRoast, selectedSort]);

  return (
    <section id="shop-collection-section" className="py-16 sm:py-24 bg-[#F4EFEA] border-b border-[#0E0C0B]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Section Header: Quieter Editorial Hierarchy */}
        <div className="text-left max-w-3xl mb-10 sm:mb-12 space-y-2 border-b border-[#0E0C0B]/10 pb-6">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans text-[#C88E38] font-bold">
            <span className="w-5 h-[1.5px] bg-[#C88E38]" />
            <span>DISCOVER THE STOREFRONT</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-[#0E0C0B] tracking-tight uppercase">
            Curated Roasts & Living Wares
          </h2>
          <p className="text-sm sm:text-base text-[#0E0C0B]/75 font-sans font-normal leading-relaxed">
            From single-origin beans and certified organic selections to espresso machines and ceramic essentials.
          </p>
        </div>

        {/* Category Tabs & Controls Bar: Functional Sans */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#0E0C0B]/10">
          
          {/* Functional Category Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none border border-[#0E0C0B]/20 p-1 bg-white">
            {categoryTabs.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-filter-${tab.id}`}
                  onClick={() => onSelectCategory(tab.id)}
                  className={`px-3 py-1.5 text-xs font-sans uppercase tracking-[0.12em] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0E0C0B] text-white'
                      : 'text-[#0E0C0B]/70 hover:text-[#0E0C0B]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Sub Filters & Sort: Clean Functional Controls */}
          <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2.5 text-xs font-sans">
            
            {/* Quick Organic Toggle */}
            <button
              id="toggle-organic-filter-btn"
              onClick={() => setOnlyOrganic(!onlyOrganic)}
              className={`px-3 py-1.5 border flex items-center space-x-1.5 text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer ${
                onlyOrganic
                  ? 'bg-[#162820] text-white border-[#162820]'
                  : 'bg-white text-[#0E0C0B] border-[#0E0C0B]/20 hover:border-[#0E0C0B]'
              }`}
            >
              <div className={`w-3 h-3 border flex items-center justify-center ${onlyOrganic ? 'border-white bg-white' : 'border-[#0E0C0B]/40'}`}>
                {onlyOrganic && <Check className="w-2.5 h-2.5 text-[#162820] stroke-[3]" />}
              </div>
              <span>Organic Only</span>
            </button>

            {/* Roast Level Selector */}
            <div className="flex items-center space-x-1 bg-white px-2.5 py-1.5 border border-[#0E0C0B]/20 text-xs uppercase font-sans">
              <Filter className="w-3.5 h-3.5 text-[#8A2B2B]" />
              <select
                id="roast-level-select"
                value={selectedRoast}
                onChange={(e) => setSelectedRoast(e.target.value)}
                className="bg-transparent text-[#0E0C0B] focus:outline-none cursor-pointer font-bold uppercase tracking-wider text-xs"
              >
                <option value="all">All Roasts</option>
                <option value="Light">Light Roast</option>
                <option value="Medium">Medium Roast</option>
                <option value="Dark">Dark Roast</option>
                <option value="Espresso Roast">Espresso Roast</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center space-x-1 bg-white px-2.5 py-1.5 border border-[#12100E]/20 text-xs uppercase font-sans">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#5C151E]" />
              <select
                id="sort-by-select"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as any)}
                className="bg-transparent text-[#12100E] focus:outline-none cursor-pointer font-semibold uppercase tracking-wider text-xs"
              >
                <option value="featured">Featured Order</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

          </div>
        </div>

        {/* Product Grid Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

        {filteredProducts.length === 0 && (
          <div className="py-16 text-center border border-[#12100E]/10 bg-[#FAF6F0] p-8 space-y-3 font-sans">
            <p className="text-sm uppercase tracking-wider text-[#12100E]/70 font-medium">
              No products found matching active filters.
            </p>
            <button
              onClick={() => {
                onSelectCategory('all');
                setOnlyOrganic(false);
                setSelectedRoast('all');
              }}
              className="px-4 py-2 bg-[#12100E] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#5C151E] transition-colors cursor-pointer"
            >
              RESET FILTERS
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
