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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#211C1A]/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      <div 
        id="product-detail-modal"
        className="relative w-full max-w-4xl bg-[#FDFBF7] rounded-2xl shadow-2xl border border-[#E5E5CB] overflow-hidden flex flex-col my-8"
      >
        {/* Close Button Top Right */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-lg bg-white/90 hover:bg-white text-[#3C2A21] flex items-center justify-center shadow-xs border border-[#E5E5CB] transition-colors cursor-pointer"
          aria-label="Close product view"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10">
          
          {/* Gallery Column */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#211C1A] border border-[#E5E5CB]">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              {product.isOrganic && (
                <div className="absolute top-3 left-3 bg-[#211C1A]/85 border border-[#C5A059]/40 text-[#E5C378] text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  USDA Organic
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#C5A059]'
                        : 'border-[#E5E5CB] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Origin & Rating */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#C5A059] uppercase tracking-widest text-[11px] font-bold">
                  {product.origin || product.subtitle}
                </span>
                <div className="flex items-center space-x-1 text-[#3C2A21] font-medium">
                  <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                  <span>{product.rating}</span>
                  <span className="text-[#7E7067] font-light">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Product Title */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#3C2A21]">
                  {product.name}
                </h2>
                <p className="text-xs text-[#7E7067] font-light mt-0.5">{product.subtitle}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-serif font-semibold text-[#3C2A21]">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#7E7067] line-through font-light">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-[11px] text-[#C5A059] font-mono">
                  In Stock & Ready for Roasting
                </span>
              </div>

              {/* Tasting Notes */}
              {product.tastingNotes && product.tastingNotes.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#7E7067] font-mono block">
                    Cupping Notes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.tastingNotes.map((note) => (
                      <span
                        key={note}
                        className="px-2.5 py-1 rounded bg-[#E5E5CB]/40 text-[#3C2A21] text-xs font-normal border border-[#E5E5CB]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Grind Selector for Coffee */}
              {product.availableGrinds && product.availableGrinds.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="uppercase tracking-widest text-[#7E7067] font-mono text-[10px]">
                      Select Grind Profile:
                    </span>
                    <span className="text-[#C5A059] font-medium text-xs">{selectedGrind}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {product.availableGrinds.map((grind) => (
                      <button
                        key={grind}
                        onClick={() => setSelectedGrind(grind)}
                        className={`py-2 px-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer text-center ${
                          selectedGrind === grind
                            ? 'bg-[#3C2A21] text-white border-[#3C2A21] shadow-xs'
                            : 'bg-white text-[#3C2A21] border-[#E5E5CB] hover:bg-[#E5E5CB]/30'
                        }`}
                      >
                        {grind}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specs / Bullet Points */}
              <div className="space-y-1.5 pt-2 border-t border-[#E5E5CB]">
                {product.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-[#3C2A21]/75 font-light">
                    <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Actions: Quantity & Add to Bag */}
            <div className="space-y-3 pt-4 border-t border-[#E5E5CB]">
              <div className="flex items-center space-x-4">
                
                {/* Quantity Counter */}
                <div className="flex items-center border border-[#E5E5CB] bg-white rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2.5 text-[#3C2A21] hover:bg-[#E5E5CB]/40 transition-colors font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-semibold text-[#3C2A21] min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2.5 text-[#3C2A21] hover:bg-[#E5E5CB]/40 transition-colors font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  id="modal-add-to-bag-btn"
                  onClick={handleAdd}
                  className="flex-1 py-3.5 bg-[#3C2A21] hover:bg-[#211C1A] text-white text-xs uppercase tracking-widest font-bold rounded-lg transition-all duration-300 shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                  <span>Add to Bag • ${(product.price * quantity).toFixed(2)}</span>
                </button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-[#7E7067] font-light">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Roasted to order & nitrogen-sealed for freshness</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

