import React, { useMemo } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product, GrindOption } from '../types';
import { ProductCard } from './ProductCard';
import { isCoffeeProduct } from '../services/categoryManager';
import { isStorefrontEligibleProduct } from '../services/productClassification';

interface TroseBestSellersProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, grind?: GrindOption, quantity?: number) => void;
  onExploreCoffee: () => void;
}

export const TroseBestSellers: React.FC<TroseBestSellersProps> = ({
  products,
  onQuickView,
  onAddToCart,
  onExploreCoffee,
}) => {
  // Strictly filter to COFFEE products to maintain priority #1 and never mix unrelated products
  const coffeeBestSellers = useMemo(() => {
    const coffees = products.filter((p) => isCoffeeProduct(p) && isStorefrontEligibleProduct(p));
    const sorted = [...coffees].sort((a, b) => {
      if (a.isBestSeller && !b.isBestSeller) return -1;
      if (!a.isBestSeller && b.isBestSeller) return 1;
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });
    // Curate top 4 to keep mobile viewport presence tight without endless scrolling
    return sorted.slice(0, 4);
  }, [products]);

  const totalCoffeeCount = useMemo(() => {
    return products.filter((p) => isCoffeeProduct(p) && isStorefrontEligibleProduct(p)).length;
  }, [products]);

  return (
    <section id="trose-best-sellers-section" className="py-12 sm:py-20 bg-[#F4EFEA] border-b border-[#0E0C0B]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Section Header: Bold modern typography with coffee priority */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4 border-b border-[#0E0C0B]/10 pb-6 text-left">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans text-[#8A2B2B] font-bold">
              <span className="w-5 h-[1.5px] bg-[#8A2B2B]" />
              <span>CORE RITUAL • BEST SELLERS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-[#0E0C0B] tracking-tight uppercase">
              CELEBRATED ROASTS
            </h2>
            <p className="text-sm sm:text-base text-[#0E0C0B]/75 font-sans font-normal leading-relaxed">
              Explore a selection of TROSE coffee favorites.
            </p>
          </div>

          <button
            onClick={onExploreCoffee}
            className="inline-flex items-center space-x-2 text-xs font-sans font-bold uppercase tracking-[0.16em] text-[#0E0C0B] hover:text-[#C88E38] border-b-2 border-[#0E0C0B] pb-1 hover:border-[#C88E38] transition-colors cursor-pointer self-start sm:self-end"
          >
            <span>VIEW ALL COFFEES ({totalCoffeeCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Curated Coffee Cards (Clean 4-column layout on desktop, max 4 on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coffeeBestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewProduct={onQuickView}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Mobile View All Coffee CTA Button */}
        <div className="mt-8 text-center sm:hidden">
          <button
            onClick={onExploreCoffee}
            className="w-full py-3.5 bg-[#0E0C0B] text-white text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-[#221B16] transition-colors"
          >
            <span>EXPLORE FULL COFFEE CATALOGUE ({totalCoffeeCount})</span>
            <ArrowRight className="w-4 h-4 text-[#C88E38]" />
          </button>
        </div>

      </div>
    </section>
  );
};
