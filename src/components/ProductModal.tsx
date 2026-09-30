import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Check } from 'lucide-react';
import { Product, GrindOption } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, grind?: GrindOption, quantity?: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart
}) => {
  if (!isOpen || !product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedGrind, setSelectedGrind] = useState<GrindOption>(
    product.availableGrinds ? product.availableGrinds[0] : 'Whole Bean'
  );
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAddToCart(product, product.availableGrinds ? selectedGrind : undefined, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#12100E]/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      
      <div 
        id="product-detail-modal"
        className="relative w-full max-w-4xl bg-[#FAF7F2] border border-[#12100E] shadow-2xl overflow-hidden flex flex-col my-8 text-left"
      >
        {/* Close Button Top Right */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white border border-[#12100E]/20 hover:border-[#12100E] text-[#12100E] transition-colors cursor-pointer"
          aria-label="Close product view"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10">
          
          {/* Gallery Column (Offset Bauhaus Photo) */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] bg-[#D4B896] p-1.5 border border-[#12100E]">
              <div className="relative w-full h-full overflow-hidden bg-[#12100E]">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                {product.isOrganic && (
                  <div className="absolute top-2.5 left-2.5 bg-[#12100E] text-white text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5">
                    BIO ORGANIC
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-14 h-14 border overflow-hidden cursor-pointer transition-all ${
                      activeImageIndex === i ? 'border-[#12100E] ring-1 ring-[#12100E]' : 'border-[#12100E]/20 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-[#69574A]">
                <span>{product.origin || product.category}</span>
                <div className="flex items-center space-x-1 text-[#C5A059]">
                  <Star className="w-3.5 h-3.5 fill-[#C5A059]" />
                  <span className="font-bold text-[#12100E]">{product.rating.toFixed(1)}</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#12100E] uppercase leading-tight">
                {product.name}
              </h2>

              <div className="flex items-baseline space-x-2 font-mono">
                <span className="text-2xl font-bold text-[#12100E]">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-[#69574A] line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-xs text-[#12100E]/75 font-sans leading-relaxed">
                {product.description}
              </p>

              {/* Tasting notes */}
              {product.tastingNotes && product.tastingNotes.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-[#12100E]/15">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#69574A] font-bold block">
                    FLAVOR PROFILES:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.tastingNotes.map((n) => (
                      <span key={n} className="px-2 py-0.5 bg-[#FDFBF7] text-[#12100E] text-[10px] font-mono uppercase border border-[#12100E]/20">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Grind Selector (Zero pills) */}
              {product.availableGrinds && product.availableGrinds.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#12100E]/15">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#69574A] font-bold block">
                    BREW METHOD / GRIND:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {product.availableGrinds.map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGrind(g)}
                        className={`p-2 text-[10px] font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer border ${
                          selectedGrind === g
                            ? 'bg-[#12100E] text-white border-[#12100E]'
                            : 'bg-white text-[#12100E] border-[#12100E]/20 hover:border-[#12100E]'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-[#12100E]/15">
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-[#12100E] bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-xs font-mono font-bold text-[#12100E] hover:bg-black/5"
                  >
                    -
                  </button>
                  <span className="px-2 font-mono font-bold text-xs text-[#12100E]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-xs font-mono font-bold text-[#12100E] hover:bg-black/5"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 px-6 text-xs font-mono uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    !product.inStock
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                      : 'bg-[#12100E] hover:bg-[#D62828] text-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                  <span>{product.inStock ? `ADD TO BAG · $${(product.price * quantity).toFixed(2)}` : 'SOLD OUT'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
