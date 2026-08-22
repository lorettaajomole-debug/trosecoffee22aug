import React, { useMemo, useState } from 'react';
import { ArrowRight, Sparkles, Coffee } from 'lucide-react';
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
    const primary = products.filter((p) => p.isBestSeller);
    const list = primary.length >= 8 ? primary.slice(0, 8) : products.slice(0, 8);

    if (filter === 'coffee') {
      return list.filter((p) => p.category === 'coffee' || p.category === 'organic');
    }
    if (filter === 'gear-lifestyle') {
      return list.filter((p) => p.category !== 'coffee' && p.category !== 'organic');
    }

    return list;
  }, [products, filter]);

  return (
    <section id="trose-best-sellers-section" className="py-16 sm:py-24 bg-[#FAF6F0] border-b border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-[#E65F38] font-bold">
              Community Favorites
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#241712] tracking-tight uppercase">
              TROSE Best Sellers
            </h2>
            <p className="text-sm sm:text-base text-[#241712]/70 font-normal">
              Our most-loved micro-lot bags, precision grinders, and daily morning staples.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center space-x-1.5 bg-[#F4EFEB] p-1.5 rounded-full border border-[#E8DFD5] self-start md:self-end">
            <button
              id="best-sellers-tab-all"
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#241712] text-white shadow-xs'
                  : 'text-[#241712]/70 hover:text-[#241712]'
              }`}
            >
              All Favorites
            </button>
            <button
              id="best-sellers-tab-coffee"
              onClick={() => setFilter('coffee')}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                filter === 'coffee'
                  ? 'bg-[#241712] text-white shadow-xs'
                  : 'text-[#241712]/70 hover:text-[#241712]'
              }`}
            >
              Coffee & Beans
            </button>
            <button
              id="best-sellers-tab-gear"
              onClick={() => setFilter('gear-lifestyle')}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                filter === 'gear-lifestyle'
                  ? 'bg-[#241712] text-white shadow-xs'
                  : 'text-[#241712]/70 hover:text-[#241712]'
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

        {/* Clean, Playful Bottom Action */}
        <div className="mt-12 text-center">
          <button
            onClick={onExploreAll}
            className="px-8 py-3.5 bg-white hover:bg-[#241712] hover:text-white text-[#241712] border border-[#E8DFD5] text-xs uppercase tracking-widest font-black rounded-full transition-all duration-300 inline-flex items-center space-x-2 cursor-pointer shadow-xs group"
          >
            <span>Shop All Best Sellers</span>
            <ArrowRight className="w-4 h-4 text-[#D63426] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};

