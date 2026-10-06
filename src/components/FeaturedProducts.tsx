import React, { useState, useMemo } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product, GrindOption } from '../types';
import { ProductCard } from './ProductCard';
import { getAvailableCategories, getProductsForCategory } from '../services/categoryManager';

interface FeaturedProductsProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, grind?: GrindOption, quantity?: number) => void;
  onNavigateToCategory: (categoryId: string) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onQuickView,
  onAddToCart,
  onNavigateToCategory
}) => {
  // Available non-empty categories strictly ordered by brand priority
  const availableCategories = useMemo(() => {
    return getAvailableCategories(products);
  }, [products]);

  const [selectedCatId, setSelectedCatId] = useState<string>('coffee');

  // Active category object
  const activeCategory = useMemo(() => {
    return availableCategories.find((c) => c.id === selectedCatId) || availableCategories[0];
  }, [availableCategories, selectedCatId]);

  // Products for active category
  const categoryProducts = useMemo(() => {
    if (!activeCategory) return [];
    const items = getProductsForCategory(products, activeCategory.id);
    // Limit to 4 cards to keep mobile concise and prevent endless scrolling
    return items.slice(0, 4);
  }, [products, activeCategory]);

  if (availableCategories.length === 0) return null;

  return (
    <section id="shop-collection-section" className="py-12 sm:py-20 bg-[#FAF7F2] border-b border-[#0E0C0B]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Section Header: Users CHOOSE what they want to explore */}
        <div className="text-left max-w-3xl mb-8 sm:mb-10 space-y-2 border-b border-[#0E0C0B]/10 pb-6">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans text-[#C88E38] font-bold">
            <span className="w-5 h-[1.5px] bg-[#C88E38]" />
            <span>DISCOVER BY DEPARTMENT</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-[#0E0C0B] tracking-tight uppercase">
            CHOOSE YOUR RITUAL
          </h2>
          <p className="text-sm sm:text-base text-[#0E0C0B]/75 font-sans font-normal leading-relaxed">
            Select a collection to preview, or jump directly into the full dedicated catalog.
          </p>
        </div>

        {/* Priority Tabs (COFFEE #1, TEA #2, MUGS #3, ACCESSORIES #4) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {availableCategories.map((cat, idx) => {
            const isActive = cat.id === activeCategory.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-4 py-2.5 text-xs font-sans uppercase tracking-[0.14em] font-bold transition-all whitespace-nowrap cursor-pointer border flex items-center space-x-2 ${
                  isActive
                    ? 'bg-[#0E0C0B] text-white border-[#0E0C0B] shadow-sm'
                    : 'bg-[#F4EFEA] text-[#0E0C0B]/80 border-[#0E0C0B]/15 hover:border-[#0E0C0B] hover:text-[#0E0C0B]'
                }`}
              >
                <span>{`${idx + 1}. ${cat.navLabel}`}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-[#C88E38] text-[#0E0C0B]' : 'bg-[#0E0C0B]/10 text-[#0E0C0B]/70'
                  }`}
                >
                  {cat.productCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Description Banner with Quick Jump CTA */}
        {activeCategory && (
          <div className="bg-[#F4EFEA] border border-[#0E0C0B]/15 p-4 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C88E38] font-bold block">
                {activeCategory.label}
              </span>
              <p className="text-xs sm:text-sm text-[#0E0C0B]/80 font-sans max-w-xl">
                {activeCategory.description}
              </p>
            </div>

            <button
              onClick={() => onNavigateToCategory(activeCategory.id)}
              className="px-5 py-2.5 bg-[#0E0C0B] hover:bg-[#221B16] text-white text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center space-x-2 transition-colors cursor-pointer self-start sm:self-center whitespace-nowrap"
            >
              <span>EXPLORE FULL {activeCategory.navLabel} PAGE</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C88E38]" />
            </button>
          </div>
        )}

        {/* 4 Curated Products Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewProduct={onQuickView}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Bottom Full Category Exploration CTA */}
        {activeCategory && (
          <div className="mt-10 text-center">
            <button
              onClick={() => onNavigateToCategory(activeCategory.id)}
              className="inline-flex items-center space-x-2 text-xs font-sans font-bold uppercase tracking-[0.16em] text-[#0E0C0B] hover:text-[#C88E38] border-b-2 border-[#0E0C0B] pb-1 hover:border-[#C88E38] transition-colors cursor-pointer"
            >
              <span>VIEW ALL {activeCategory.productCount} {activeCategory.navLabel} PRODUCTS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
