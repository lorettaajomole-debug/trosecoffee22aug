import React, { useState, useEffect } from 'react';
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedGrind, setSelectedGrind] = useState<GrindOption | undefined>(
    product.availableGrinds && product.availableGrinds.length > 0 ? product.availableGrinds[0] : undefined
  );
  const [selectedFormat, setSelectedFormat] = useState<string | undefined>(
    product.formats && product.formats.length > 0 ? product.formats[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  
  // Accordion state
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    description: true,
    tasting: true,
    origin: false,
    ingredients: false,
    brewing: false,
    shipping: false
  });

  // Reset selections when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setSelectedGrind(product.availableGrinds && product.availableGrinds.length > 0 ? product.availableGrinds[0] : undefined);
    setSelectedFormat(product.formats && product.formats.length > 0 ? product.formats[0] : undefined);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isSoldOut = !product.inStock;
  const hasCompareAtPrice = Boolean(product.originalPrice && product.originalPrice > product.price);
  const discountPercent = hasCompareAtPrice && product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // "You May Also Like" - Products in same category or complimentary items
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.isBestSeller))
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isSoldOut) return;
    onAddToCart(product, selectedGrind, quantity);
  };

  const handleBuyNow = () => {
    if (isSoldOut) return;
    onBuyNow(product, selectedGrind, quantity);
  };

  return (
    <div id="trose-product-detail-view" className="bg-[#FDFBF7] min-h-screen py-8 sm:py-12 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Top Breadcrumb Navigation & Back Link */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-between pb-8 border-b border-[#E5E5CB] mb-8 text-xs font-mono uppercase tracking-wider text-[#7E7067]">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <button
              onClick={() => onBackToShop('all')}
              className="hover:text-[#3C2A21] transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
            <button
              onClick={() => onBackToShop(product.category)}
              className="hover:text-[#3C2A21] transition-colors cursor-pointer capitalize"
            >
              {product.category.replace('-', ' ')}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[#3C2A21] font-semibold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </div>

          <button
            onClick={() => onBackToShop(product.category)}
            className="inline-flex items-center space-x-1.5 text-xs text-[#3C2A21] hover:text-[#C5A059] font-medium transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Collection</span>
          </button>
        </nav>

        {/* Main Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Gallery & Large Image View (7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Primary Large Image Stage */}
            <div className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-[#211C1A] border border-[#E5E5CB] shadow-sm">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={`${product.name} - View ${selectedImageIndex + 1}`}
                className={`w-full h-full object-cover object-center transition-all duration-500 ${
                  isSoldOut ? 'grayscale-30 opacity-80' : ''
                }`}
                referrerPolicy="no-referrer"
              />

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 items-start">
                {isSoldOut ? (
                  <span className="px-3 py-1 bg-[#211C1A] text-white text-xs font-mono font-bold uppercase tracking-wider rounded border border-white/20">
                    Sold Out
                  </span>
                ) : (
                  <>
                    {hasCompareAtPrice && (
                      <span className="px-3 py-1 bg-[#C5A059] text-[#211C1A] text-xs font-bold uppercase tracking-wider rounded shadow-md">
                        Sale • Save {discountPercent}%
                      </span>
                    )}
                    {product.isOrganic && (
                      <span className="px-3 py-1 bg-[#211C1A]/90 text-[#E5C378] text-xs font-bold uppercase tracking-wider rounded border border-[#C5A059]/40 backdrop-blur-xs">
                        USDA Organic
                      </span>
                    )}
                    {product.isBestSeller && !hasCompareAtPrice && (
                      <span className="px-3 py-1 bg-[#3C2A21] text-white text-xs font-bold uppercase tracking-wider rounded">
                        Best Seller
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Roast Badge on Image */}
              {product.roastLevel && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[#3C2A21] text-xs font-semibold tracking-wider uppercase rounded-full shadow-sm border border-[#E5E5CB]">
                    {product.roastLevel} Roast
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Image Carousel / Strip */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    id={`thumb-image-${idx}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-[#211C1A] ${
                      selectedImageIndex === idx
                        ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30 scale-102'
                        : 'border-[#E5E5CB] opacity-70 hover:opacity-100 hover:border-[#3C2A21]/40'
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
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white border border-[#E5E5CB] text-[#3C2A21] text-center mt-6">
              <div className="flex flex-col items-center space-y-1.5 p-2">
                <Truck className="w-5 h-5 text-[#C5A059]" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Fast Dispatch</span>
                <span className="text-[10px] text-[#7E7067]">Free on orders $50+</span>
              </div>
              <div className="flex flex-col items-center space-y-1.5 p-2 border-x border-[#E5E5CB]">
                <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Freshness Peak</span>
                <span className="text-[10px] text-[#7E7067]">Weekly small-batch</span>
              </div>
              <div className="flex flex-col items-center space-y-1.5 p-2">
                <RotateCcw className="w-5 h-5 text-[#C5A059]" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Palate Guarantee</span>
                <span className="text-[10px] text-[#7E7067]">30-day satisfaction</span>
              </div>
            </div>

          </div>

          {/* Right Column: Details, Selectors, Add to Bag & Buy Now (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Header / Subtitle & Rating */}
            <div className="space-y-2 border-b border-[#E5E5CB] pb-5">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                  {product.origin || product.category.toUpperCase()}
                </span>
                
                {/* Rating Display */}
                <div className="flex items-center space-x-1.5 text-xs text-[#3C2A21]">
                  <div className="flex text-[#C5A059]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-[#C5A059] text-[#C5A059]'
                            : 'text-[#E5E5CB]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{product.rating.toFixed(1)}</span>
                  <span className="text-[#7E7067]">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#3C2A21] leading-tight">
                {product.name}
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-[#7E7067] font-light">
                {product.subtitle}
              </p>

              {/* Pricing Line */}
              <div className="flex items-baseline space-x-3 pt-2">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#3C2A21]">
                  ${product.price.toFixed(2)}
                </span>
                {hasCompareAtPrice && (
                  <span className="text-base text-[#7E7067] line-through font-light">
                    ${product.originalPrice?.toFixed(2)}
                  </span>
                )}
                {hasCompareAtPrice && (
                  <span className="text-xs font-mono text-[#C5A059] font-bold bg-[#C5A059]/10 px-2 py-0.5 rounded">
                    Save ${(product.originalPrice! - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status Indicator */}
              <div className="flex items-center space-x-2 pt-1">
                <span className={`w-2 h-2 rounded-full ${isSoldOut ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                <span className={`text-xs font-medium ${isSoldOut ? 'text-red-700' : 'text-emerald-800'}`}>
                  {isSoldOut ? 'Currently Sold Out — Restocking Soon' : 'In Stock • Freshly Roasted & Ready to Dispatch'}
                </span>
              </div>
            </div>

            {/* Coffee Specific Attributes: Roast Meter & Flavour Notes */}
            {product.roastLevel && (
              <div className="space-y-4 p-4 rounded-xl bg-[#E5E5CB]/20 border border-[#E5E5CB]">
                
                {/* Roast Level Visual Indicator */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono uppercase tracking-wider">
                    <span className="text-[#7E7067] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-[#C5A059]" /> Roast Profile
                    </span>
                    <span className="font-bold text-[#3C2A21]">{product.roastLevel}</span>
                  </div>
                  
                  {/* Visual 5-segment roast meter */}
                  <div className="grid grid-cols-5 gap-1.5 h-2 w-full pt-0.5">
                    {[1, 2, 3, 4, 5].map((level) => {
                      const isActive = (product.roastMeter || 3) >= level;
                      return (
                        <div
                          key={level}
                          className={`rounded-full h-1.5 transition-all ${
                            isActive
                              ? 'bg-[#3C2A21]'
                              : 'bg-[#E5E5CB]'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-[#7E7067] pt-0.5">
                    <span>Light (Floral)</span>
                    <span>Medium</span>
                    <span>Dark (Decadent)</span>
                  </div>
                </div>

                {/* Flavour Tasting Notes */}
                {product.tastingNotes && product.tastingNotes.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[#E5E5CB]/60">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#7E7067] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> Flavour & Aroma Notes
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.tastingNotes.map((note) => (
                        <span
                          key={note}
                          className="px-2.5 py-1 bg-white text-[#3C2A21] text-xs font-medium rounded-md border border-[#E5E5CB] shadow-2xs"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Format / Size Selector (e.g., 12 oz, 2 lb, 5 lb) */}
            {product.formats && product.formats.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#3C2A21] font-semibold flex justify-between">
                  <span>Format / Option:</span>
                  <span className="text-[#C5A059]">{selectedFormat}</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.formats.map((fmt) => (
                    <button
                      key={fmt}
                      id={`format-btn-${fmt.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => setSelectedFormat(fmt)}
                      className={`py-2.5 px-3 rounded-lg text-xs font-medium transition-all text-center cursor-pointer border ${
                        selectedFormat === fmt
                          ? 'bg-[#3C2A21] text-white border-[#3C2A21] shadow-xs'
                          : 'bg-white text-[#3C2A21] border-[#E5E5CB] hover:border-[#3C2A21]'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Grind Selector (If Coffee) */}
            {product.availableGrinds && product.availableGrinds.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#3C2A21] font-semibold flex justify-between">
                  <span>Brew Method / Grind:</span>
                  <span className="text-[#C5A059]">{selectedGrind || 'Whole Bean'}</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.availableGrinds.map((grind) => (
                    <button
                      key={grind}
                      id={`grind-btn-${grind.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => setSelectedGrind(grind)}
                      className={`py-2.5 px-3 rounded-lg text-xs font-medium transition-all text-center cursor-pointer border ${
                        selectedGrind === grind
                          ? 'bg-[#3C2A21] text-white border-[#3C2A21] shadow-xs'
                          : 'bg-white text-[#3C2A21] border-[#E5E5CB] hover:border-[#3C2A21]'
                      }`}
                    >
                      {grind}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              
              <div className="flex items-center space-x-3">
                
                {/* Quantity Controls */}
                <div className="flex items-center border border-[#E5E5CB] bg-white rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isSoldOut}
                    className="w-8 h-8 flex items-center justify-center text-[#3C2A21] hover:bg-[#E5E5CB]/40 rounded disabled:opacity-30 cursor-pointer font-bold"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-semibold font-mono text-[#3C2A21]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isSoldOut}
                    className="w-8 h-8 flex items-center justify-center text-[#3C2A21] hover:bg-[#E5E5CB]/40 rounded disabled:opacity-30 cursor-pointer font-bold"
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
                  className={`flex-1 py-3.5 px-6 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center space-x-2 shadow-md ${
                    isSoldOut
                      ? 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed'
                      : 'bg-[#3C2A21] hover:bg-[#211C1A] text-white cursor-pointer hover:shadow-lg'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                  <span>{isSoldOut ? 'Sold Out' : `Add to Bag • $${(product.price * quantity).toFixed(2)}`}</span>
                </button>

              </div>

              {/* Buy Now Button (Express Checkout Flow) */}
              {!isSoldOut && (
                <button
                  id="pdp-buy-now-btn"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 bg-[#C5A059] hover:bg-[#b08e4c] text-[#211C1A] text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-[#211C1A]" />
                  <span>Instant Checkout / Buy Now</span>
                </button>
              )}

            </div>

            {/* Expandable Accordion Sections */}
            <div className="pt-6 border-t border-[#E5E5CB] divide-y divide-[#E5E5CB]">
              
              {/* Description Section */}
              <div className="py-4">
                <button
                  onClick={() => toggleSection('description')}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#3C2A21] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#C5A059]" /> Description & Experience
                  </span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${openSections.description ? 'rotate-180' : ''}`} />
                </button>
                {openSections.description && (
                  <div className="pt-3 text-xs sm:text-sm text-[#3C2A21]/80 leading-relaxed space-y-2 font-light">
                    <p>{product.description}</p>
                    {product.details && product.details.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 pt-2 text-xs font-normal text-[#3C2A21]">
                        {product.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Tasting Notes / Sensorics */}
              {product.tastingNotes && product.tastingNotes.length > 0 && (
                <div className="py-4">
                  <button
                    onClick={() => toggleSection('tasting')}
                    className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#3C2A21] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C5A059]" /> Tasting Notes & Sensory Profile
                    </span>
                    <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${openSections.tasting ? 'rotate-180' : ''}`} />
                  </button>
                  {openSections.tasting && (
                    <div className="pt-3 text-xs sm:text-sm text-[#3C2A21]/80 leading-relaxed space-y-2 font-light">
                      <p>
                        Selected for supreme clarity and balanced extraction. Key sensory markers:
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {product.tastingNotes.map((note) => (
                          <span key={note} className="px-3 py-1 bg-[#E5E5CB]/40 rounded-full text-xs font-medium text-[#3C2A21]">
                            ✦ {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Origin & Cultivation */}
              {product.origin && (
                <div className="py-4">
                  <button
                    onClick={() => toggleSection('origin')}
                    className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#3C2A21] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#C5A059]" /> Origin, Terroir & Processing
                    </span>
                    <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${openSections.origin ? 'rotate-180' : ''}`} />
                  </button>
                  {openSections.origin && (
                    <div className="pt-3 text-xs space-y-2 text-[#3C2A21]/80 font-mono">
                      <div className="grid grid-cols-2 gap-2 p-3 bg-white rounded-lg border border-[#E5E5CB]">
                        <div>
                          <span className="text-[#7E7067] block text-[10px]">Location:</span>
                          <span className="text-[#3C2A21] font-semibold">{product.origin}</span>
                        </div>
                        {product.altitude && (
                          <div>
                            <span className="text-[#7E7067] block text-[10px]">Elevation:</span>
                            <span className="text-[#3C2A21] font-semibold">{product.altitude}</span>
                          </div>
                        )}
                        {product.process && (
                          <div className="col-span-2 pt-1 border-t border-[#E5E5CB]">
                            <span className="text-[#7E7067] block text-[10px]">Process:</span>
                            <span className="text-[#3C2A21] font-semibold">{product.process}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Ingredients & Materials */}
              {product.ingredients && (
                <div className="py-4">
                  <button
                    onClick={() => toggleSection('ingredients')}
                    className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#3C2A21] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#C5A059]" /> Ingredients & Purity Specs
                    </span>
                    <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${openSections.ingredients ? 'rotate-180' : ''}`} />
                  </button>
                  {openSections.ingredients && (
                    <div className="pt-3 text-xs sm:text-sm text-[#3C2A21]/80 leading-relaxed font-light">
                      <p>{product.ingredients}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Brewing Guide & Recipe */}
              {product.brewingRecommendation && (
                <div className="py-4">
                  <button
                    onClick={() => toggleSection('brewing')}
                    className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#3C2A21] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-[#C5A059]" /> Roaster’s Brewing Guide & Parameters
                    </span>
                    <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${openSections.brewing ? 'rotate-180' : ''}`} />
                  </button>
                  {openSections.brewing && (
                    <div className="pt-3 text-xs sm:text-sm text-[#3C2A21]/80 leading-relaxed p-3.5 bg-[#3C2A21] text-white rounded-xl space-y-2">
                      <div className="flex items-center space-x-2 text-[#C5A059] font-mono text-xs uppercase">
                        <Droplet className="w-3.5 h-3.5" />
                        <span>Recommended Extraction Recipe</span>
                      </div>
                      <p className="text-xs text-[#FDFBF7]/90 leading-relaxed font-sans">
                        {product.brewingRecommendation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Shipping & Returns */}
              <div className="py-4">
                <button
                  onClick={() => toggleSection('shipping')}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#3C2A21] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#C5A059]" /> Shipping & Returns Policy
                  </span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${openSections.shipping ? 'rotate-180' : ''}`} />
                </button>
                {openSections.shipping && (
                  <div className="pt-3 text-xs sm:text-sm text-[#3C2A21]/80 leading-relaxed space-y-2 font-light">
                    <p>{product.shippingInfo || 'All coffees are roasted fresh in weekly micro-batches. Orders placed before 1:00 PM are dispatched on the next roasting cycle.'}</p>
                    <p className="text-xs text-[#7E7067]">
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
          <section id="you-may-also-like-section" className="mt-20 pt-12 border-t border-[#E5E5CB]">
            
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-semibold block mb-1">
                  Curated Pairings
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#3C2A21]">
                  You May Also Like
                </h2>
              </div>
              <button
                onClick={() => onBackToShop(product.category)}
                className="text-xs uppercase font-semibold tracking-wider text-[#3C2A21] hover:text-[#C5A059] flex items-center space-x-1 cursor-pointer"
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
