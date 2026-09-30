import React, { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Product, GrindOption } from '../types';
import { ProductCard } from './ProductCard';

interface TroseBestSellersProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, grind?: GrindOption, quantity?: number) => void;
  onExploreAll: () => void;
}

export const TroseBestSellers: React.FC<TroseBestSellersProps> = ({
  products,
  onQuickView,
  onAddToCart,
  onExploreAll,
}) => {
  const [filter, setFilter] = useState<'all' | 'coffee' | 'gear-lifestyle'>('all');

  const bestSellerProducts = useMemo(() => {
    const coffeeItems = products.filter(
      (p) => (p.category === 'coffee' || p.category === 'organic') && p.inStock
    );
    const gearItems = products.filter(
      (p) => p.category !== 'coffee' && p.category !== 'organic' && p.inStock
    );

    if (filter === 'coffee') {
      return coffeeItems.slice(0, 8);
    }
    if (filter === 'gear-lifestyle') {
      return gearItems.slice(0, 8);
    }

    // Default 'all': Prioritizes real coffee roasts and community favorites
    const combined = [...coffeeItems, ...gearItems];
    return combined.slice(0, 8);
  }, [products, filter]);

  return (
    <section id="trose-best-sellers-section" className="py-16 sm:py-24 bg-[#F4EFEA] border-b border-[#0E0C0B]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Section Header with Refined Secondary Editorial Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6 border-b border-[#0E0C0B]/10 pb-6">
          <div className="space-y-2 max-w-xl text-left">
            <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans text-[#8A2B2B] font-bold">
              <span className="w-5 h-[1.5px] bg-[#8A2B2B]" />
              <span>COMMUNITY FAVORITES</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-[#0E0C0B] tracking-tight uppercase">
              TROSE Best Sellers
            </h2>
            <p className="text-sm sm:text-base text-[#0E0C0B]/75 font-sans font-normal leading-relaxed">
              Our most celebrated roasts, single-origin selections, and morning staples.
            </p>
          </div>

          {/* Quick Segmented Filter Tabs: Clean Functional Sans */}
          <div className="inline-flex items-center border border-[#0E0C0B] p-1 bg-white self-start md:self-end font-sans">
            <button
              id="best-sellers-tab-all"
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-[0.12em] font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#0E0C0B] text-white'
                  : 'text-[#0E0C0B]/70 hover:text-[#0E0C0B]'
              }`}
            >
              All Favorites
            </button>
            <button
              id="best-sellers-tab-coffee"
              onClick={() => setFilter('coffee')}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-[0.12em] font-bold transition-all cursor-pointer ${
                filter === 'coffee'
                  ? 'bg-[#0E0C0B] text-white'
                  : 'text-[#0E0C0B]/70 hover:text-[#0E0C0B]'
              }`}
            >
              Coffee & Beans
            </button>
            <button
              id="best-sellers-tab-gear"
              onClick={() => setFilter('gear-lifestyle')}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-[0.12em] font-bold transition-all cursor-pointer ${
                filter === 'gear-lifestyle'
                  ? 'bg-[#0E0C0B] text-white'
                  : 'text-[#0E0C0B]/70 hover:text-[#0E0C0B]'
              }`}
            >
              Gear & Lifestyle
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellerProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewProduct={onQuickView}
              onAddToCart={onAddToCart}
              showViewButton={true}
            />
          ))}
        </div>

        {/* Clean Editorial Bottom Action: Functional Sans */}
        <div className="mt-12 pt-8 border-t border-[#0E0C0B]/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
          <span className="text-xs uppercase tracking-[0.16em] text-[#0E0C0B]/60">
            SHOWING 8 OF {products.length} OFFERINGS
          </span>
          <button
            id="best-sellers-explore-all-btn"
            onClick={onExploreAll}
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.16em] font-bold text-[#0E0C0B] hover:text-[#8A2B2B] transition-colors group cursor-pointer"
          >
            <span>VIEW FULL COLLECTION</span>
            <ArrowRight className="w-4 h-4 text-[#C88E38] group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
