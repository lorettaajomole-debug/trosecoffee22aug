import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Product, GrindOption } from '../types';

export interface ProductCardProps {
  product: Product;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product, grind?: GrindOption, quantity?: number) => void;
  className?: string;
  showViewButton?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewProduct,
  onAddToCart,
  className = '',
}) => {
  const isSoldOut = !product.inStock;
  const hasCompareAtPrice = Boolean(product.originalPrice && product.originalPrice > product.price);
  const discountPercent = hasCompareAtPrice && product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut) return;
    const defaultGrind = product.availableGrinds && product.availableGrinds.length > 0
      ? product.availableGrinds[0]
      : undefined;
    onAddToCart(product, defaultGrind, 1);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewProduct(product);
  };

  // Determine real category label
  const categoryLabel = product.category === 'organic'
    ? 'Certified Organic'
    : product.category === 'coffee'
    ? 'Specialty Coffee'
    : product.category === 'machines'
    ? 'Espresso Machinery'
    : product.category === 'mugs-flasks'
    ? 'Drinkware'
    : product.category === 'accessories'
    ? 'Barista Gear'
    : product.category === 'snacks'
    ? 'Artisan Snacks'
    : product.category === 'tables'
    ? 'Living Furniture'
    : 'Curated Item';

  return (
    <div
      id={`trose-product-card-${product.id}`}
      onClick={handleView}
      className={`group relative flex flex-col bg-[#FAF6F0] border border-[#12100E]/12 hover:border-[#12100E] transition-all duration-300 cursor-pointer text-left ${
        isSoldOut ? 'opacity-85' : ''
      } ${className}`}
    >
      {/* Product Image Stage (Bauhaus architectural framing, zero pills) */}
      <div className="relative aspect-[4/3] bg-[#E8D8C3] overflow-hidden border-b border-[#12100E]/12 flex items-center justify-center p-3">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className={`w-full h-full object-contain transition-transform duration-700 ease-out ${
            isSoldOut ? 'grayscale-50 opacity-70' : 'group-hover:scale-104 opacity-95 group-hover:opacity-100'
          }`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Real Badges: Unboxed Editorial Typography */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 font-sans">
          {isSoldOut ? (
            <span className="px-2 py-0.5 bg-[#12100E] text-white text-[9px] uppercase tracking-[0.16em] font-semibold">
              Sold Out
            </span>
          ) : (
            <>
              {hasCompareAtPrice && (
                <span className="px-2 py-0.5 bg-[#5C151E] text-white text-[9px] uppercase tracking-[0.16em] font-semibold">
                  Sale -{discountPercent}%
                </span>
              )}
              {product.isOrganic && (
                <span className="px-2 py-0.5 bg-[#1C3328] text-white text-[9px] uppercase tracking-[0.16em] font-semibold">
                  Organic
                </span>
              )}
              {product.isBestSeller && !hasCompareAtPrice && !product.isOrganic && (
                <span className="px-2 py-0.5 bg-[#CCA347] text-[#12100E] text-[9px] uppercase tracking-[0.16em] font-bold">
                  Bestseller
                </span>
              )}
            </>
          )}
        </div>

        {/* Real Roast Tag */}
        {product.roastLevel && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="px-2 py-0.5 bg-[#FAF6F0]/95 backdrop-blur-xs text-[#12100E] text-[9px] font-sans uppercase tracking-wider font-semibold border border-[#12100E]/15">
              {product.roastLevel}
            </span>
          </div>
        )}
      </div>

      {/* Card Body: Structured 3-Level Typography */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        <div className="space-y-1.5 font-sans">
          {/* Subtle Category & Origin Tag */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-[#69574A]">
            <span className="truncate max-w-[180px]">
              {product.origin || categoryLabel}
            </span>
            {product.inStock && (
              <span className="text-[#CCA347] font-semibold text-[10px]">IN STOCK</span>
            )}
          </div>

          {/* Product Title: Refined Quieter Serif */}
          <h3
            className="text-base sm:text-lg font-serif font-semibold text-[#12100E] group-hover:text-[#5C151E] transition-colors line-clamp-1 leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Real Tasting Notes or Real Description (Only if data exists) */}
          {product.tastingNotes && product.tastingNotes.length > 0 ? (
            <p className="text-xs text-[#69574A] truncate font-sans">
              {product.tastingNotes.join(' · ')}
            </p>
          ) : product.subtitle && product.subtitle !== product.name ? (
            <p className="text-xs text-[#69574A] truncate font-sans">
              {product.subtitle}
            </p>
          ) : null}
        </div>

        {/* Card Pricing & Functional Action Footer */}
        <div className="pt-3 border-t border-[#12100E]/10 flex items-center justify-between gap-3">
          
          {/* Price: Clean Sans-Serif */}
          <div className="flex items-baseline space-x-1.5 font-sans">
            <span className="text-base sm:text-lg font-bold text-[#12100E]">
              ${product.price.toFixed(2)}
            </span>
            {hasCompareAtPrice && (
              <span className="text-xs text-[#69574A] line-through">
                ${product.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Bag Button: Functional Sans */}
          <button
            id={`btn-add-bag-${product.id}`}
            onClick={handleAdd}
            disabled={isSoldOut}
            className={`px-3 py-1.5 text-[11px] uppercase font-sans tracking-[0.14em] font-semibold transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95 ${
              isSoldOut
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-[#12100E] hover:bg-[#5C151E] text-white shadow-2xs'
            }`}
            title={isSoldOut ? 'Product is sold out' : 'Add to Tasting Bag'}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#CCA347]" />
            <span>{isSoldOut ? 'Sold Out' : 'Add'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
