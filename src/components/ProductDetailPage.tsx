import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, 
  ShoppingBag, 
  Zap, 
  ChevronRight, 
  ChevronDown, 
  ArrowLeft, 
  Globe, 
  Sparkles, 
  Layers, 
  Coffee, 
  Truck, 
  Info, 
  Flame 
} from 'lucide-react';
import { Product, GrindOption, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { getMappedShopifyProductByHandle } from '../services/shopify';
import { isStorefrontEligibleProduct } from '../services/productClassification';

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
  allProducts = [],
  onBackToShop,
  onSelectProduct,
  onAddToCart,
  onBuyNow
}) => {
  if (!product) {
    return (
      <div id="trose-product-detail-fallback" className="bg-[#FAF7F2] min-h-[70vh] py-16 flex items-center justify-center text-left">
        <div className="max-w-md mx-auto px-6 text-center space-y-6">
          <div className="w-16 h-16 border border-[#12100E] mx-auto flex items-center justify-center text-[#12100E]">
            <Coffee className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-editorial font-bold uppercase text-[#12100E]">
              Product Not Found
            </h1>
            <p className="text-xs text-[#69574A] font-sans">
              The requested coffee or product record could not be resolved in the roastery catalogue.
            </p>
          </div>
          <div className="flex items-center justify-center space-x-4 pt-2">
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  onBackToShop('coffee');
                }
              }}
              className="px-6 py-3 border border-[#12100E] text-[#12100E] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#12100E] hover:text-white transition-colors cursor-pointer"
            >
              ← BACK
            </button>
            <button
              onClick={() => onBackToShop('coffee')}
              className="px-6 py-3 bg-[#12100E] text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#D62828] transition-colors cursor-pointer"
            >
              SHOP COFFEE →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Live single-source-of-truth product state
  const [currentProduct, setCurrentProduct] = useState<Product>(product);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Real Shopify variant selection state
  const [selectedOptionsState, setSelectedOptionsState] = useState<Record<string, string>>({});
  
  // Fallback state for local mock products without Shopify variants
  const [selectedGrind, setSelectedGrind] = useState<GrindOption | undefined>(
    product?.availableGrinds && product.availableGrinds.length > 0 ? product.availableGrinds[0] : undefined
  );
  const [selectedFormat, setSelectedFormat] = useState<string | undefined>(
    product?.formats && product.formats.length > 0 ? product.formats[0] : undefined
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
    }
  }, [currentProduct.variants]);

  // Matched variant from current selected options
  const matchedVariant = useMemo(() => {
    if (!currentProduct.variants || currentProduct.variants.length === 0) return null;
    return currentProduct.variants.find((variant) => {
      if (!variant.selectedOptions) return false;
      return variant.selectedOptions.every(
        (opt) => selectedOptionsState[opt.name] === opt.value
      );
    });
  }, [currentProduct.variants, selectedOptionsState]);

  // Active pricing & stock
  const rawPrice = matchedVariant ? matchedVariant.price : currentProduct.price;
  const displayedPrice = typeof rawPrice === 'number' && !isNaN(rawPrice) ? rawPrice : 0;
  const displayedCompareAt = matchedVariant?.compareAtPrice ?? currentProduct.originalPrice;
  const hasCompareAtPrice = Boolean(displayedCompareAt && displayedCompareAt > displayedPrice);
  const isSoldOut = matchedVariant ? !matchedVariant.availableForSale : !currentProduct.inStock;
  const productImages =
    currentProduct.images && currentProduct.images.length > 0
      ? currentProduct.images
      : ['https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=1000&q=85'];

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAddToCart = () => {
    if (isSoldOut) return;
    const grind = selectedGrind || (selectedOptionsState['Grind'] as GrindOption) || undefined;
    onAddToCart(currentProduct, grind, quantity);
  };

  const handleBuyNow = () => {
    if (isSoldOut) return;
    const grind = selectedGrind || (selectedOptionsState['Grind'] as GrindOption) || undefined;
    onBuyNow(currentProduct, grind, quantity);
  };

  const relatedProducts = useMemo(() => {
    return allProducts
      .filter((p) => p.id !== currentProduct.id && isStorefrontEligibleProduct(p) && (p.department === currentProduct.department || p.category === currentProduct.category))
      .slice(0, 4);
  }, [allProducts, currentProduct]);

  return (
    <div id="trose-product-detail-view" className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Breadcrumb Navigation (Zero pills, Space Mono) */}
        <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.24em] text-[#69574A] mb-8 pb-4 border-b border-[#12100E]/15 text-left">
          <button
            id="pdp-back-btn"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                onBackToShop(currentProduct.department || currentProduct.category);
              }
            }}
            className="hover:text-[#12100E] flex items-center space-x-1 cursor-pointer font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>BACK</span>
          </button>
          <span>/</span>
          <span className="hover:text-[#12100E] cursor-pointer" onClick={() => onBackToShop(currentProduct.department || currentProduct.category)}>
            {(currentProduct.departmentLabel || currentProduct.category).toUpperCase()}
          </span>
          <span>/</span>
          <span className="text-[#12100E] font-bold truncate max-w-xs">{currentProduct.name}</span>
        </nav>

        {/* Main PDP Grid: 6 cols Gallery + 6 cols Bauhaus Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 text-left">
          
          {/* LEFT: Image Gallery (Offset Bauhaus Photographic Frame) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Primary Image Stage */}
            <div className="relative bg-[#D4B896] p-2 border border-[#12100E]">
              <div className="relative aspect-square overflow-hidden bg-[#FAF7F2]">
                <img
                  src={productImages[selectedImageIndex] || productImages[0]}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Badges in Unboxed Typography */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
                  {isSoldOut ? (
                    <span className="px-2 py-0.5 bg-[#12100E] text-white text-[9px] font-mono uppercase tracking-widest font-bold">
                      SOLD OUT
                    </span>
                  ) : (
                    <>
                      {currentProduct.isOrganic && (
                        <span className="px-2 py-0.5 bg-[#12100E] text-[#FAF7F2] text-[9px] font-mono uppercase tracking-widest font-bold">
                          BIO ORGANIC
                        </span>
                      )}
                      {hasCompareAtPrice && (
                        <span className="px-2 py-0.5 bg-[#D62828] text-white text-[9px] font-mono uppercase tracking-widest font-bold">
                          SALE
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Technical Corner Badge */}
                <div className="absolute bottom-3 right-3 bg-[#FAF7F2] border border-[#12100E] px-2 py-0.5 text-[9px] font-mono text-[#12100E] uppercase tracking-wider font-bold">
                  IMG 0{selectedImageIndex + 1} / 0{Math.max(1, productImages.length)}
                </div>
              </div>
            </div>

            {/* Thumbnail Row */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-square border overflow-hidden cursor-pointer transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#12100E] ring-1 ring-[#12100E]'
                        : 'border-[#12100E]/20 opacity-70 hover:opacity-100 hover:border-[#12100E]'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${currentProduct.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Packaging Technical Spec Summary Box */}
            <div className="p-4 bg-[#FDFBF7] border border-[#12100E]/15 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-[#12100E]/10 pb-1.5 text-[9px] uppercase tracking-[0.2em] text-[#C2873F] font-bold">
                <span>SPECIFICATION</span>
                <span>TROSE ROAST</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#12100E]">
                <div>
                  <span className="text-[#69574A] block text-[9px]">DEPARTMENT:</span>
                  <span className="font-bold uppercase">{currentProduct.departmentLabel || currentProduct.category}</span>
                </div>
                <div>
                  <span className="text-[#69574A] block text-[9px]">ORIGIN:</span>
                  <span className="font-bold">{currentProduct.origin || 'Selected Roaster Lot'}</span>
                </div>
                {currentProduct.altitude && (
                  <div>
                    <span className="text-[#69574A] block text-[9px]">ELEVATION:</span>
                    <span>{currentProduct.altitude}</span>
                  </div>
                )}
                {currentProduct.process && (
                  <div>
                    <span className="text-[#69574A] block text-[9px]">PROCESS:</span>
                    <span>{currentProduct.process}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT: Product Buy Box (Packaging Grid Typography) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & Metadata */}
            <div className="space-y-2 border-b border-[#12100E]/15 pb-5">
              
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-[#69574A]">
                <span>{currentProduct.origin || 'SPECIALTY ROAST'}</span>
                <div className="flex items-center space-x-1 text-[#C5A059]">
                  <Star className="w-3 h-3 fill-[#C5A059]" />
                  <span className="font-bold text-[#12100E]">{(currentProduct.rating ?? 5.0).toFixed(1)}</span>
                  <span>({currentProduct.reviewsCount ?? 16})</span>
                </div>
              </div>

              {/* Product Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-[#12100E] uppercase tracking-tight leading-[1.02]">
                {currentProduct.name}
              </h1>

              {/* Subtitle */}
              {currentProduct.subtitle && (
                <p className="text-xs sm:text-sm text-[#12100E]/70 font-sans">
                  {currentProduct.subtitle}
                </p>
              )}

              {/* Price Row */}
              <div className="flex items-baseline space-x-3 pt-3">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-[#12100E] tracking-tight">
                  ${displayedPrice.toFixed(2)}
                </span>
                {hasCompareAtPrice && (
                  <span className="text-base text-[#69574A] line-through font-mono">
                    ${displayedCompareAt?.toFixed(2)}
                  </span>
                )}
                {hasCompareAtPrice && displayedCompareAt && (
                  <span className="text-[10px] font-mono text-white font-bold bg-[#D62828] px-2 py-0.5 uppercase tracking-wider">
                    SAVE ${(displayedCompareAt - displayedPrice).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Indicator */}
              <div className="flex items-center space-x-2 pt-1 text-[11px] font-mono uppercase">
                <span className={`w-2 h-2 ${isSoldOut ? 'bg-[#D62828]' : 'bg-[#C5A059]'}`} />
                <span className={isSoldOut ? 'text-[#D62828] font-bold' : 'text-[#12100E] font-bold'}>
                  {isSoldOut ? 'SOLD OUT — RESTOCKING SOON' : 'IN STOCK · ROASTED TO ORDER'}
                </span>
              </div>
            </div>

            {/* Coffee Specific: Roast Profile Gauge & Flavour Notes */}
            {currentProduct.roastLevel && (
              <div className="p-4 bg-[#FDFBF7] border border-[#12100E]/15 space-y-3">
                
                {/* Visual 5-segment roast gauge */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-[#12100E]">
                    <span className="text-[#69574A] flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#D62828]" /> ROAST LEVEL:
                    </span>
                    <span className="font-bold text-[#12100E]">{currentProduct.roastLevel}</span>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full">
                    {[1, 2, 3, 4, 5].map((level) => {
                      const isActive = (currentProduct.roastMeter || 3) >= level;
                      return (
                        <div
                          key={level}
                          className={`h-full transition-all ${
                            isActive ? 'bg-[#12100E]' : 'bg-[#12100E]/15'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-[#69574A] uppercase tracking-wider">
                    <span>LIGHT</span>
                    <span>MEDIUM</span>
                    <span>DARK</span>
                  </div>
                </div>

                {/* Flavour Notes (Zero pills) */}
                {currentProduct.tastingNotes && currentProduct.tastingNotes.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[#12100E]/10">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#69574A] flex items-center gap-1 font-bold">
                      <Sparkles className="w-3 h-3 text-[#C5A059]" /> SENSORY NOTES:
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {currentProduct.tastingNotes.map((note) => (
                        <span
                          key={note}
                          className="px-2 py-0.5 bg-[#FAF7F2] text-[#12100E] text-[10px] font-mono uppercase border border-[#12100E]/20"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* REAL SHOPIFY VARIANT SELECTOR (Zero pills, crisp rectangular boxes) */}
            {currentProduct.options && currentProduct.options.length > 0 ? (
              <div className="space-y-4">
                {currentProduct.options.map((optionGroup) => (
                  <div key={optionGroup.name} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.2em]">
                      <span className="text-[#69574A] font-bold">{optionGroup.name}:</span>
                      <span className="text-[#12100E] font-bold">
                        {selectedOptionsState[optionGroup.name] || optionGroup.values[0]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {optionGroup.values.map((val) => {
                        const isSelected = selectedOptionsState[optionGroup.name] === val;
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
                            className={`py-2 px-3 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-[#12100E] text-white border-[#12100E] font-bold'
                                : 'bg-[#FDFBF7] text-[#12100E] border-[#12100E]/20 hover:border-[#12100E]'
                            } ${!isAvailable ? 'opacity-50' : ''}`}
                          >
                            {val}
                            {!isAvailable && (
                              <span className="ml-1 text-[9px] text-[#D62828]">(out)</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Fallback selector for mock products */
              <>
                {currentProduct.formats && currentProduct.formats.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.2em]">
                      <span className="text-[#69574A] font-bold">FORMAT:</span>
                      <span className="text-[#12100E] font-bold">{selectedFormat}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {currentProduct.formats.map((fmt) => (
                        <button
                          key={fmt}
                          id={`format-btn-${fmt.replace(/\s+/g, '-').toLowerCase()}`}
                          onClick={() => setSelectedFormat(fmt)}
                          className={`py-2 px-3 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                            selectedFormat === fmt
                              ? 'bg-[#12100E] text-white border-[#12100E] font-bold'
                              : 'bg-[#FDFBF7] text-[#12100E] border-[#12100E]/20 hover:border-[#12100E]'
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
                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.2em]">
                      <span className="text-[#69574A] font-bold">BREW METHOD / GRIND:</span>
                      <span className="text-[#12100E] font-bold">{selectedGrind || 'Whole Bean'}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {currentProduct.availableGrinds.map((grind) => (
                        <button
                          key={grind}
                          id={`grind-btn-${grind.replace(/\s+/g, '-').toLowerCase()}`}
                          onClick={() => setSelectedGrind(grind)}
                          className={`py-2 px-3 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                            selectedGrind === grind
                              ? 'bg-[#12100E] text-white border-[#12100E] font-bold'
                              : 'bg-[#FDFBF7] text-[#12100E] border-[#12100E]/20 hover:border-[#12100E]'
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
                
                {/* Quantity Controls (Sharp Bauhaus Box) */}
                <div className="flex items-center border border-[#12100E] bg-[#FDFBF7]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isSoldOut}
                    className="w-10 h-11 flex items-center justify-center text-[#12100E] hover:bg-black/5 disabled:opacity-30 cursor-pointer font-mono font-bold text-sm"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold font-mono text-[#12100E]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isSoldOut}
                    className="w-10 h-11 flex items-center justify-center text-[#12100E] hover:bg-black/5 disabled:opacity-30 cursor-pointer font-mono font-bold text-sm"
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
                  className={`flex-1 py-3.5 px-6 text-xs uppercase font-mono tracking-[0.2em] font-bold transition-all flex items-center justify-center space-x-2.5 cursor-pointer ${
                    isSoldOut
                      ? 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed'
                      : 'bg-[#12100E] hover:bg-[#261C14] text-white shadow-xs active:translate-y-0.5'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                  <span>{isSoldOut ? 'SOLD OUT' : `ADD TO TASTING BAG · $${(displayedPrice * quantity).toFixed(2)}`}</span>
                </button>

              </div>

              {/* Buy Now Button */}
              {!isSoldOut && (
                <button
                  id="pdp-buy-now-btn"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 bg-[#D62828] hover:bg-[#B71C1C] text-white text-xs font-mono uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer active:translate-y-0.5"
                >
                  <Zap className="w-4 h-4 text-white" />
                  <span>INSTANT CHECKOUT / BUY NOW</span>
                </button>
              )}

            </div>

            {/* Technical Accordion Sections */}
            <div className="pt-6 border-t border-[#12100E]/15 divide-y divide-[#12100E]/15">
              
              {/* Description Section */}
              <div className="py-4">
                <button
                  onClick={() => toggleSection('description')}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.18em] font-mono font-bold text-[#12100E] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-[#D62828]" /> 01 / DESCRIPTION & EXPERIENCE
                  </span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${openSections.description ? 'rotate-180' : ''}`} />
                </button>
                {openSections.description && (
                  <div className="pt-3 text-xs sm:text-sm text-[#12100E]/80 leading-relaxed space-y-2 font-normal">
                    {currentProduct.descriptionHtml ? (
                      <div
                        className="prose prose-sm max-w-none text-[#12100E]/80"
                        dangerouslySetInnerHTML={{ __html: currentProduct.descriptionHtml }}
                      />
                    ) : (
                      <p>{currentProduct.description}</p>
                    )}
                    {currentProduct.details && currentProduct.details.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 pt-2 text-xs font-mono text-[#12100E]">
                        {currentProduct.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Tasting Notes */}
              {currentProduct.tastingNotes && currentProduct.tastingNotes.length > 0 && (
                <div className="py-4">
                  <button
                    onClick={() => toggleSection('tasting')}
                    className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.18em] font-mono font-bold text-[#12100E] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> 02 / SENSORY PROFILE
                    </span>
                    <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${openSections.tasting ? 'rotate-180' : ''}`} />
                  </button>
                  {openSections.tasting && (
                    <div className="pt-3 text-xs sm:text-sm text-[#12100E]/80 leading-relaxed space-y-2">
                      <p>
                        Selected for supreme clarity and balanced extraction:
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {currentProduct.tastingNotes.map((note) => (
                          <span key={note} className="px-2.5 py-1 bg-[#FDFBF7] border border-[#12100E] text-xs font-mono uppercase text-[#12100E]">
                            ✦ {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Origin Terroir */}
              {currentProduct.origin && (
                <div className="py-4">
                  <button
                    onClick={() => toggleSection('origin')}
                    className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.18em] font-mono font-bold text-[#12100E] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-[#C5A059]" /> 03 / ORIGIN & TERROIR
                    </span>
                    <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${openSections.origin ? 'rotate-180' : ''}`} />
                  </button>
                  {openSections.origin && (
                    <div className="pt-3 text-xs space-y-2 text-[#12100E]/80 font-mono">
                      <div className="grid grid-cols-2 gap-2 p-3 bg-[#FDFBF7] border border-[#12100E]/15">
                        <div>
                          <span className="text-[#69574A] block text-[9px]">REGION:</span>
                          <span className="font-bold text-[#12100E]">{currentProduct.origin}</span>
                        </div>
                        {currentProduct.altitude && (
                          <div>
                            <span className="text-[#69574A] block text-[9px]">ALTITUDE:</span>
                            <span className="font-bold text-[#12100E]">{currentProduct.altitude}</span>
                          </div>
                        )}
                        {currentProduct.process && (
                          <div className="col-span-2 pt-1 border-t border-[#12100E]/10">
                            <span className="text-[#69574A] block text-[9px]">PROCESS:</span>
                            <span className="font-bold text-[#12100E]">{currentProduct.process}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Brewing Recommendation */}
              {currentProduct.brewingRecommendation && (
                <div className="py-4">
                  <button
                    onClick={() => toggleSection('brewing')}
                    className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.18em] font-mono font-bold text-[#12100E] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Coffee className="w-3.5 h-3.5 text-[#D62828]" /> 04 / ROASTER'S EXTRACTION GUIDE
                    </span>
                    <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${openSections.brewing ? 'rotate-180' : ''}`} />
                  </button>
                  {openSections.brewing && (
                    <div className="pt-3 text-xs sm:text-sm text-white leading-relaxed p-4 bg-[#12100E] space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block font-bold">
                        RECOMMENDED RECIPE
                      </span>
                      <p className="text-xs text-white/90 leading-relaxed font-sans">
                        {currentProduct.brewingRecommendation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Shipping Policy */}
              <div className="py-4">
                <button
                  onClick={() => toggleSection('shipping')}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.18em] font-mono font-bold text-[#12100E] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-[#C5A059]" /> 05 / SHIPPING & ROAST GUARANTEE
                  </span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${openSections.shipping ? 'rotate-180' : ''}`} />
                </button>
                {openSections.shipping && (
                  <div className="pt-3 text-xs sm:text-sm text-[#12100E]/80 leading-relaxed space-y-2 font-normal">
                    <p>{currentProduct.shippingInfo || 'Orders placed before 1:00 PM are dispatched promptly on the next fulfillment cycle.'}</p>
                    <p className="text-xs text-[#69574A] font-mono">
                      Fresh Roast Guarantee: If your coffee does not exceed expectations, reach out within 30 days for a replacement or full refund.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Curated Pairings / Related Products */}
        {relatedProducts.length > 0 && (
          <section id="you-may-also-like-section" className="mt-20 pt-12 border-t border-[#12100E]/15 text-left">
            <div className="flex items-baseline justify-between mb-8 border-b border-[#12100E]/15 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#C5A059] font-bold block mb-1">
                  RECOMMENDED PAIRINGS
                </span>
                <h2 className="text-2xl sm:text-4xl font-editorial font-bold text-[#12100E] uppercase tracking-tight">
                  You May Also Like
                </h2>
              </div>
              <button
                onClick={() => onBackToShop(currentProduct.category)}
                className="text-xs font-mono uppercase tracking-wider font-bold text-[#12100E] hover:text-[#D62828] flex items-center space-x-1 cursor-pointer"
              >
                <span>FULL DIRECTORY</span>
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
