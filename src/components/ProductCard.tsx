import React from 'react';
import { Star, ShoppingBag, Eye } from 'lucide-react';
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
  showViewButton = true,
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

  return (
    <div
      id={`trose-product-card-${product.id}`}
      className={`group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-[#E8DFD5] shadow-xs hover:shadow-xl hover:border-[#D63426]/40 transition-all duration-300 ${
        isSoldOut ? 'opacity-85' : ''
      } ${className}`}
    >
      {/* Product Image Area */}
      <div 
        onClick={handleView}
        className="relative aspect-[4/3] bg-[#1F1612] overflow-hidden cursor-pointer"
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-transform duration-500 ${
            isSoldOut ? 'grayscale-50 opacity-70' : 'group-hover:scale-105 opacity-95 group-hover:opacity-100'
          }`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges: Clean, Colorful & Intentional */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1 items-start z-10">
          {isSoldOut ? (
            <span className="px-2.5 py-1 bg-[#1F1612] text-white text-[10px] font-mono font-bold uppercase tracking-wider rounded-full shadow-xs">
              Sold Out
            </span>
          ) : (
            <>
              {hasCompareAtPrice && (
                <span className="px-2.5 py-0.5 bg-[#D63426] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
                  Sale {discountPercent > 0 ? `-${discountPercent}%` : ''}
                </span>
              )}
              {product.isOrganic && (
                <span className="px-2.5 py-0.5 bg-[#EBF1E6] text-[#657953] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#657953]/20 shadow-xs">
                  Bio Organic
                </span>
              )}
              {product.isBestSeller && !hasCompareAtPrice && (
                <span className="px-2.5 py-0.5 bg-[#E65F38] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
                  Bestseller
                </span>
              )}
            </>
          )}
        </div>

        {/* Roast Level or Type Pill Top Right */}
        {product.roastLevel && (
          <div className="absolute top-3.5 right-3.5 z-10">
            <span className="px-2.5 py-0.5 bg-[#FAF6F0]/95 backdrop-blur-md text-[#241712] text-[10px] font-bold tracking-wider uppercase rounded-full shadow-xs border border-[#E8DFD5]">
              {product.roastLevel}
            </span>
          </div>
        )}
      </div>

      {/* Card Content: Clean, Spacious Hierarchy */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          {/* Subtitle / Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#7A6C63]">
            <span className="font-mono uppercase tracking-wider text-[10px] font-medium truncate max-w-[170px]">
              {product.origin || product.subtitle || product.category}
            </span>
            
            <div className="flex items-center space-x-1 text-[#241712] font-semibold shrink-0">
              <Star className="w-3.5 h-3.5 fill-[#E65F38] text-[#E65F38]" />
              <span className="text-xs">{product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={handleView}
            className="text-lg font-bold text-[#241712] group-hover:text-[#D63426] transition-colors cursor-pointer line-clamp-1"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Tasting Notes */}
          {product.tastingNotes && product.tastingNotes.length > 0 && (
            <p className="text-xs text-[#7A6C63] font-normal truncate">
              {product.tastingNotes.join(' • ')}
            </p>
          )}
        </div>

        {/* Card Pricing & Action Footer */}
        <div className="pt-3 border-t border-[#E8DFD5] flex items-center justify-between gap-3">
          
          {/* Price */}
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xl font-black text-[#241712] tracking-tight">
              ${product.price.toFixed(2)}
            </span>
            {hasCompareAtPrice && (
              <span className="text-xs text-[#7A6C63] line-through font-normal">
                ${product.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Bag Button */}
          <button
            id={`btn-add-bag-${product.id}`}
            onClick={handleAdd}
            disabled={isSoldOut}
            className={`px-4 py-2.5 text-[11px] uppercase tracking-wider font-bold rounded-full transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-95 ${
              isSoldOut
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-[#241712] hover:bg-[#D63426] text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isSoldOut ? 'Sold Out' : 'Add to Bag'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
