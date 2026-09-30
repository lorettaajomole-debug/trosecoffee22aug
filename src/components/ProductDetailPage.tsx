import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, 
  ShoppingBag, 
  Zap, 
  ChevronRight, 
  ChevronDown, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Coffee, 
  Flame, 
  Globe, 
  Sparkles, 
  Layers,
  Clock,
  Droplet,
  Info
} from 'lucide-react';
import { Product, GrindOption, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { getMappedShopifyProductByHandle } from '../services/shopify';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBackToShop: (category?: ProductCategory) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, grind?: GrindOption, quantity?: number) => void;
  onBuyNow: (product: Product, grind?: GrindOption, quantity?: number) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBackToShop,
  onSelectProduct,
  onAddToCart,
  onBuyNow
}) => {
  // Live single-source-of-truth product state
  const [currentProduct, setCurrentProduct] = useState<Product>(product);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Real Shopify variant selection state
  const [selectedOptionsState, setSelectedOptionsState] = useState<Record<string, string>>({});
  
  // Fallback state for local mock products without Shopify variants
  const [selectedGrind, setSelectedGrind] = useState<GrindOption | undefined>(
    product.availableGrinds && product.availableGrinds.length > 0 ? product.availableGrinds[0] : undefined
  );
  const [selectedFormat, setSelectedFormat] = useState<string | undefined>(
    product.formats && product.formats.length > 0 ? product.formats[0] : undefined
  );
  
  // Accordion state
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    description: true,
    tasting: true,
    origin: false,
    ingredients: false,
    brewing: false,
    shipping: false
  });

  // Fetch freshest live Shopify product data if handle is available
  useEffect(() => {
    setCurrentProduct(product);
    setSelectedImageIndex(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (product.handle) {
      let isMounted = true;
      getMappedShopifyProductByHandle(product.handle)
        .then((fresh) => {
          if (isMounted && fresh) {
            setCurrentProduct(fresh);
          }
        })
        .catch(() => {});
      return () => {
        isMounted = false;
      };
    }
  }, [product.handle, product.id]);

  // Initialize selected options to first available variant
  useEffect(() => {
    if (currentProduct.variants && currentProduct.variants.length > 0) {
      const firstAvailable =
        currentProduct.variants.find((v) => v.availableForSale) || currentProduct.variants[0];
      const initialMap: Record<string, string> = {};
      firstAvailable.selectedOptions?.forEach((opt) => {
        initialMap[opt.name] = opt.value;
      });
      setSelectedOptionsState(initialMap);
    } else {
      setSelectedGrind(
        currentProduct.availableGrinds && currentProduct.availableGrinds.length > 0
          ? currentProduct.availableGrinds[0]
          : undefined
      );
      setSelectedFormat(
        currentProduct.formats && currentProduct.formats.length > 0
          ? currentProduct.formats[0]
          : undefined
      );
    }
  }, [currentProduct.id, currentProduct.variants]);

  // Find active variant matching current option selections
  const activeVariant = useMemo(() => {
    if (!currentProduct.variants || currentProduct.variants.length === 0) return null;
    return (
      currentProduct.variants.find((v) =>
        v.selectedOptions?.every((opt) => selectedOptionsState[opt.name] === opt.value)
      ) || currentProduct.variants[0]
    );
  }, [currentProduct.variants, selectedOptionsState]);

  // If selected variant has a specific image, switch gallery
  useEffect(() => {
    if (activeVariant?.image?.url) {
      const idx = currentProduct.images.findIndex((img) => img === activeVariant.image?.url);
      if (idx >= 0) {
        setSelectedImageIndex(idx);
      }
    }
  }, [activeVariant, currentProduct.images]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Real pricing & stock metrics derived from live variant
  const displayedPrice = activeVariant ? parseFloat(activeVariant.price.amount) : currentProduct.price;
  const rawCompareAt = activeVariant?.compareAtPrice
    ? parseFloat(activeVariant.compareAtPrice.amount)
    : currentProduct.originalPrice;
  const hasCompareAtPrice = Boolean(rawCompareAt && rawCompareAt > displayedPrice);
  const displayedCompareAt = hasCompareAtPrice ? rawCompareAt : undefined;
  const isSoldOut = activeVariant ? !activeVariant.availableForSale : !currentProduct.inStock;
  const discountPercent =
    hasCompareAtPrice && displayedCompareAt
      ? Math.round(((displayedCompareAt - displayedPrice) / displayedCompareAt) * 100)
      : 0;

  // "You May Also Like" - Products in same category or complimentary items
  const relatedProducts = allProducts
    .filter((p) => p.id !== currentProduct.id && (p.category === currentProduct.category || p.isBestSeller))
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isSoldOut) return;
    const effectiveProduct: Product = {
      ...currentProduct,
      price: displayedPrice,
      originalPrice: displayedCompareAt,
      inStock: !isSoldOut,
      selectedVariantId: activeVariant?.id,
    };
    const grindToPass = (selectedOptionsState['Grind'] ||
      selectedOptionsState['Grind Option'] ||
      selectedGrind) as GrindOption | undefined;
    onAddToCart(effectiveProduct, grindToPass, quantity);
  };

  const handleBuyNow = () => {
    if (isSoldOut) return;
    const effectiveProduct: Product = {
      ...currentProduct,
      price: displayedPrice,
      originalPrice: displayedCompareAt,
      inStock: !isSoldOut,
      selectedVariantId: activeVariant?.id,
    };
    const grindToPass = (selectedOptionsState['Grind'] ||
      selectedOptionsState['Grind Option'] ||
      selectedGrind) as GrindOption | undefined;
    onBuyNow(effectiveProduct, grindToPass, quantity);
  };

  return (
    <div id="trose-product-detail-view" className="bg-[#FAF6F0] min-h-screen py-8 sm:py-12 animate-fadeIn text-[#241712]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Top Breadcrumb Navigation & Back Link */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-between pb-8 border-b border-[#E8DFD5] mb-8 text-xs font-mono uppercase tracking-wider text-[#7A6C63]">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <button
              onClick={() => onBackToShop('all')}
              className="hover:text-[#241712] transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#E65F38]" />
            <button
              onClick={() => onBackToShop(currentProduct.category)}
              className="hover:text-[#241712] transition-colors cursor-pointer capitalize"
            >
              {currentProduct.category.replace('-', ' ')}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#E65F38]" />
            <span className="text-[#241712] font-semibold truncate max-w-[200px] sm:max-w-none">
              {currentProduct.name}
            </span>
          </div>

          <button
            onClick={() => onBackToShop(currentProduct.category)}
            className="inline-flex items-center space-x-1.5 text-xs text-[#241712] hover:text-[#D63426] font-medium transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Collection</span>
          </button>
        </nav>

        {/* Main Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Gallery & Large Image View (7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Primary Large Image Stage (Dynamic Shopify CDN Images) */}
            <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-[#1F1612] border border-[#E8DFD5] shadow-sm">
              <img
                src={currentProduct.images[selectedImageIndex] || currentProduct.images[0]}
                alt={`${currentProduct.name} - View ${selectedImageIndex + 1}`}
                className={`w-full h-full object-cover object-center transition-all duration-500 ${
                  isSoldOut ? 'grayscale-30 opacity-80' : ''
                }`}
                referrerPolicy="no-referrer"
              />

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 items-start">
                {isSoldOut ? (
                  <span className="px-3 py-1 bg-[#1F1612] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-full border border-white/20">
                    Sold Out
                  </span>
                ) : (
                  <>
                    {hasCompareAtPrice && (
                      <span className="px-3 py-1 bg-[#D63426] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs">
                        Sale • Save {discountPercent}%
                      </span>
                    )}
                    {currentProduct.isOrganic && (
                      <span className="px-3 py-1 bg-[#EBF1E6] text-[#657953] text-xs font-bold uppercase tracking-wider rounded-full border border-[#657953]/30 shadow-xs">
                        Bio Organic
                      </span>
                    )}
                    {currentProduct.isBestSeller && !hasCompareAtPrice && (
                      <span className="px-3 py-1 bg-[#E65F38] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs">
                        Best Seller
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Roast Badge on Image */}
              {currentProduct.roastLevel && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[#241712] text-xs font-semibold tracking-wider uppercase rounded-full shadow-xs border border-[#E8DFD5]">
                    {currentProduct.roastLevel} Roast
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Image Carousel / Strip (Dynamic Shopify Images) */}
            {currentProduct.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-2">
                {currentProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    id={`thumb-image-${idx}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-[#1F1612] ${
                      selectedImageIndex === idx
                        ? 'border-[#D63426] ring-2 ring-[#D63426]/30 scale-102'
                        : 'border-[#E8DFD5] opacity-70 hover:opacity-100 hover:border-[#241712]/40'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Value Guarantees Banner */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-[#E8DFD5] text-[#241712] text-center mt-6">
              <div className="flex flex-col items-center space-y-1.5 p-2">
                <Truck className="w-5 h-5 text-[#E65F38]" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Fast Dispatch</span>
                <span className="text-[10px] text-[#7A6C63]">Free on orders $50+</span>
              </div>
              <div className="flex flex-col items-center space-y-1.5 p-2 border-x border-[#E8DFD5]">
                <ShieldCheck className="w-5 h-5 text-[#657953]" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Freshness Peak</span>
                <span className="text-[10px] text-[#7A6C63]">Weekly micro-batch</span>
              </div>
              <div className="flex flex-col items-center space-y-1.5 p-2">
                <RotateCcw className="w-5 h-5 text-[#D63426]" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Palate Guarantee</span>
                <span className="text-[10px] text-[#7A6C63]">30-day satisfaction</span>
              </div>
            </div>

          </div>

          {/* Right Column: Details, Selectors, Add to Bag & Buy Now (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Header / Subtitle & Rating */}
            <div className="space-y-2 border-b border-[#E8DFD5] pb-5">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-[#E65F38] font-bold">
                  {currentProduct.origin || currentProduct.category.toUpperCase()}
                </span>
                
                {/* Rating Display */}
                <div className="flex items-center space-x-1.5 text-xs text-[#241712]">
                  <div className="flex text-[#E65F38]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(currentProduct.rating)
                            ? 'fill-[#E65F38] text-[#E65F38]'
                            : 'text-[#E8DFD5]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{currentProduct.rating.toFixed(1)}</span>
                  <span className="text-[#7A6C63]">({currentProduct.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#241712] tracking-tight">
                {currentProduct.name}
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-[#7A6C63] font-normal">
                {currentProduct.subtitle}
              </p>

              {/* Pricing Line: Real Live Shopify Prices */}
              <div className="flex items-baseline space-x-3 pt-2">
                <span className="text-2xl sm:text-3xl font-black text-[#241712]">
                  ${displayedPrice.toFixed(2)}
                </span>
                {hasCompareAtPrice && (
                  <span className="text-base text-[#7A6C63] line-through font-normal">
                    ${displayedCompareAt?.toFixed(2)}
                  </span>
                )}
                {hasCompareAtPrice && displayedCompareAt && (
                  <span className="text-xs font-mono text-[#D63426] font-bold bg-[#D63426]/10 px-2 py-0.5 rounded-full">
                    Save ${(displayedCompareAt - displayedPrice).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status Indicator */}
              <div className="flex items-center space-x-2 pt-1">
                <span className={`w-2 h-2 rounded-full ${isSoldOut ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                <span className={`text-xs font-medium ${isSoldOut ? 'text-red-700' : 'text-emerald-800'}`}>
                  {isSoldOut ? 'Currently Sold Out — Restocking Soon' : 'In Stock • Ready to Dispatch'}
                </span>
              </div>
            </div>

            {/* Coffee Specific Attributes: Roast Meter & Flavour Notes */}
            {currentProduct.roastLevel && (
              <div className="space-y-4 p-4 rounded-2xl bg-white border border-[#E8DFD5]">
                
                {/* Roast Level Visual Indicator */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono uppercase tracking-wider">
                    <span className="text-[#7A6C63] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-[#E65F38]" /> Roast Profile
                    </span>
                    <span className="font-bold text-[#241712]">{currentProduct.roastLevel}</span>
                  </div>
                  
                  {/* Visual 5-segment roast meter */}
                  <div className="grid grid-cols-5 gap-1.5 h-2 w-full pt-0.5">
                    {[1, 2, 3, 4, 5].map((level) => {
                      const isActive = (currentProduct.roastMeter || 3) >= level;
                      return (
                        <div
                          key={level}
                          className={`rounded-full h-1.5 transition-all ${
                            isActive
                              ? 'bg-[#241712]'
                              : 'bg-[#E8DFD5]'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-[#7A6C63] pt-0.5">
                    <span>Light (Floral)</span>
                    <span>Medium</span>
                    <span>Dark (Decadent)</span>
                  </div>
                </div>

                {/* Flavour Tasting Notes */}
                {currentProduct.tastingNotes && currentProduct.tastingNotes.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[#E8DFD5]">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#7A6C63] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#E65F38]" /> Flavour & Aroma Notes
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {currentProduct.tastingNotes.map((note) => (
                        <span
                          key={note}
                          className="px-2.5 py-1 bg-[#FAF6F0] text-[#241712] text-xs font-medium rounded-full border border-[#E8DFD5]"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* REAL SHOPIFY VARIANT SELECTOR */}
            {currentProduct.options && currentProduct.options.length > 0 ? (
              <div className="space-y-4">
                {currentProduct.options.map((optionGroup) => (
                  <div key={optionGroup.name} className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#241712] font-semibold flex justify-between">
                      <span>{optionGroup.name}:</span>
                      <span className="text-[#D63426] font-bold">
                        {selectedOptionsState[optionGroup.name] || optionGroup.values[0]}
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {optionGroup.values.map((val) => {
                        const isSelected = selectedOptionsState[optionGroup.name] === val;
                        // Determine if any variant with this option is in stock
                        const isAvailable = currentProduct.variants?.some(
                          (v) =>
                            v.availableForSale &&
                            v.selectedOptions?.some(
                              (opt) => opt.name === optionGroup.name && opt.value === val
                            )
                        );
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() =>
                              setSelectedOptionsState((prev) => ({
                                ...prev,
                                [optionGroup.name]: val,
                              }))
                            }
                            className={`py-2 px-3.5 rounded-full text-xs font-medium transition-all text-center cursor-pointer border ${
                              isSelected
                                ? 'bg-[#241712] text-white border-[#241712] shadow-xs'
                                : 'bg-white text-[#241712] border-[#E8DFD5] hover:border-[#241712]'
                            } ${!isAvailable ? 'opacity-60' : ''}`}
                          >
                            {val}
                            {!isAvailable && (
                              <span className="ml-1 text-[10px] text-gray-400">(sold out)</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Fallback selector for mock products without Shopify variants */
              <>
                {currentProduct.formats && currentProduct.formats.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#241712] font-semibold flex justify-between">
                      <span>Format / Option:</span>
                      <span className="text-[#E65F38]">{selectedFormat}</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {currentProduct.formats.map((fmt) => (
                        <button
                          key={fmt}
                          id={`format-btn-${fmt.replace(/\s+/g, '-').toLowerCase()}`}
                          onClick={() => setSelectedFormat(fmt)}
                          className={`py-2.5 px-3 rounded-full text-xs font-medium transition-all text-center cursor-pointer border ${
                            selectedFormat === fmt
                              ? 'bg-[#241712] text-white border-[#241712] shadow-xs'
                              : 'bg-white text-[#241712] border-[#E8DFD5] hover:border-[#241712]'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentProduct.availableGrinds && currentProduct.availableGrinds.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#241712] font-semibold flex justify-between">
                      <span>Brew Method / Grind:</span>
                      <span className="text-[#E65F38]">{selectedGrind || 'Whole Bean'}</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {currentProduct.availableGrinds.map((grind) => (
                        <button
                          key={grind}
                          id={`grind-btn-${grind.replace(/\s+/g, '-').toLowerCase()}`}
                          onClick={() => setSelectedGrind(grind)}
                          className={`py-2.5 px-3 rounded-full text-xs font-medium transition-all text-center cursor-pointer border ${
                            selectedGrind === grind
                              ? 'bg-[#241712] text-white border-[#241712] shadow-xs'
                              : 'bg-white text-[#241712] border-[#E8DFD5] hover:border-[#241712]'
                          }`}
                        >
                          {grind}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              
              <div className="flex items-center space-x-3">
                
                {/* Quantity Controls */}
                <div className="flex items-center border border-[#E8DFD5] bg-white rounded-full p-1 shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isSoldOut}
                    className="w-8 h-8 flex items-center justify-center text-[#241712] hover:bg-[#FAF6F0] rounded-full disabled:opacity-30 cursor-pointer font-bold"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-semibold font-mono text-[#241712]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isSoldOut}
                    className="w-8 h-8 flex items-center justify-center text-[#241712] hover:bg-[#FAF6F0] rounded-full disabled:opacity-30 cursor-pointer font-bold"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  id="pdp-add-to-bag-btn"
                  onClick={handleAddToCart}
                  disabled={isSoldOut}
                  className={`flex-1 py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer ${
                    isSoldOut
                      ? 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed'
                      : 'bg-[#241712] hover:bg-[#D63426] text-white hover:shadow-md'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isSoldOut ? 'Sold Out' : `Add to Bag • $${(displayedPrice * quantity).toFixed(2)}`}</span>
                </button>

              </div>

              {/* Buy Now Button */}
              {!isSoldOut && (
                <button
                  id="pdp-buy-now-btn"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 bg-[#D63426] hover:bg-[#b82a1d] text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer hover:shadow-md"
                >
                  <Zap className="w-4 h-4 text-white" />
                  <span>Instant Checkout / Buy Now</span>
                </button>
              )}

            </div>

            {/* Expandable Accordion Sections */}
            <div className="pt-6 border-t border-[#E8DFD5] divide-y divide-[#E8DFD5]">
              
              {/* Description Section */}
              <div className="py-4">
                <button
                  onClick={() => toggleSection('description')}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-bold text-[#241712] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#D63426]" /> Description & Experience
                  </span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${openSections.description ? 'rotate-180' : ''}`} />
                </button>
                {openSections.description && (
                  <div className="pt-3 text-xs sm:text-sm text-[#241712]/80 leading-relaxed space-y-2 font-normal">
                    {currentProduct.descriptionHtml ? (
                      <div
                        className="prose prose-sm max-w-none text-[#241712]/80"
                        dangerouslySetInnerHTML={{ __html: currentProduct.descriptionHtml }}
                      />
                    ) : (
                      <p>{currentProduct.description}</p>
                    )}
                    {currentProduct.details && currentProduct.details.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 pt-2 text-xs font-normal text-[#241712]">
                        {currentProduct.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Tasting Notes / Sensorics */}
              {currentProduct.tastingNotes && currentProduct.tastingNotes.length > 0 && (
                <div className="py-4">
                  <button
                    onClick={() => toggleSection('tasting')}
                    className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-bold text-[#241712] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#E65F38]" /> Tasting Notes & Sensory Profile
                    </span>
                    <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${openSections.tasting ? 'rotate-180' : ''}`} />
                  </button>
                  {openSections.tasting && (
                    <div className="pt-3 text-xs sm:text-sm text-[#241712]/80 leading-relaxed space-y-2 font-normal">
                      <p>
                        Selected for supreme clarity and balanced extraction. Key sensory markers:
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {currentProduct.tastingNotes.map((note) => (
                          <span key={note} className="px-3 py-1 bg-white border border-[#E8DFD5] rounded-full text-xs font-medium text-[#241712]">
                            ✦ {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Origin & Cultivation */}
              {currentProduct.origin && (
                <div className="py-4">
                  <button
                    onClick={() => toggleSection('origin')}
                    className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-bold text-[#241712] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#657953]" /> Origin & Sourcing
                    </span>
                    <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${openSections.origin ? 'rotate-180' : ''}`} />
                  </button>
                  {openSections.origin && (
                    <div className="pt-3 text-xs space-y-2 text-[#241712]/80 font-mono">
                      <div className="grid grid-cols-2 gap-2 p-3 bg-white rounded-2xl border border-[#E8DFD5]">
                        <div>
                          <span className="text-[#7A6C63] block text-[10px]">Location:</span>
                          <span className="text-[#241712] font-semibold">{currentProduct.origin}</span>
                        </div>
                        {currentProduct.altitude && (
                          <div>
                            <span className="text-[#7A6C63] block text-[10px]">Elevation:</span>
                            <span className="text-[#241712] font-semibold">{currentProduct.altitude}</span>
                          </div>
                        )}
                        {currentProduct.process && (
                          <div className="col-span-2 pt-1 border-t border-[#E8DFD5]">
                            <span className="text-[#7A6C63] block text-[10px]">Process:</span>
                            <span className="text-[#241712] font-semibold">{currentProduct.process}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Ingredients & Materials */}
              {currentProduct.ingredients && (
                <div className="py-4">
                  <button
                    onClick={() => toggleSection('ingredients')}
                    className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-bold text-[#241712] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#D63426]" /> Ingredients & Purity Specs
                    </span>
                    <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${openSections.ingredients ? 'rotate-180' : ''}`} />
                  </button>
                  {openSections.ingredients && (
                    <div className="pt-3 text-xs sm:text-sm text-[#241712]/80 leading-relaxed font-normal">
                      <p>{currentProduct.ingredients}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Brewing Guide & Recipe */}
              {currentProduct.brewingRecommendation && (
                <div className="py-4">
                  <button
                    onClick={() => toggleSection('brewing')}
                    className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-bold text-[#241712] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-[#E65F38]" /> Roaster’s Brewing Guide
                    </span>
                    <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${openSections.brewing ? 'rotate-180' : ''}`} />
                  </button>
                  {openSections.brewing && (
                    <div className="pt-3 text-xs sm:text-sm text-white leading-relaxed p-3.5 bg-[#241712] rounded-2xl space-y-2">
                      <div className="flex items-center space-x-2 text-[#E65F38] font-mono text-xs uppercase">
                        <Droplet className="w-3.5 h-3.5" />
                        <span>Recommended Extraction Recipe</span>
                      </div>
                      <p className="text-xs text-white/90 leading-relaxed font-sans">
                        {currentProduct.brewingRecommendation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Shipping & Returns */}
              <div className="py-4">
                <button
                  onClick={() => toggleSection('shipping')}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-bold text-[#241712] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#657953]" /> Shipping & Returns Policy
                  </span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${openSections.shipping ? 'rotate-180' : ''}`} />
                </button>
                {openSections.shipping && (
                  <div className="pt-3 text-xs sm:text-sm text-[#241712]/80 leading-relaxed space-y-2 font-normal">
                    <p>{currentProduct.shippingInfo || 'All coffees are roasted fresh in weekly micro-batches. Orders placed before 1:00 PM are dispatched on the next roasting cycle.'}</p>
                    <p className="text-xs text-[#7A6C63]">
                      We stand behind every bag. If your coffee does not exceed your expectations, reach out within 30 days for a replacement or full refund.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* "You May Also Like" Related Products Section */}
        {relatedProducts.length > 0 && (
          <section id="you-may-also-like-section" className="mt-20 pt-12 border-t border-[#E8DFD5]">
            
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#E65F38] font-semibold block mb-1">
                  Curated Pairings
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#241712]">
                  You May Also Like
                </h2>
              </div>
              <button
                onClick={() => onBackToShop(currentProduct.category)}
                className="text-xs uppercase font-bold tracking-wider text-[#241712] hover:text-[#D63426] flex items-center space-x-1 cursor-pointer"
              >
                <span>View Full Collection</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct.id}
                  product={relProduct}
                  onViewProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>

          </section>
        )}

      </div>
    </div>
  );
};
