import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, CheckCircle, Tag, Plus, Minus, Lock } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number, grind?: string) => void;
  onRemoveItem: (productId: string, grind?: string) => void;
  onClearCart: () => void;
  onExploreShop?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onExploreShop
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string>('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const rawSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = rawSubtotal * appliedDiscount;
  const subtotal = Math.max(0, rawSubtotal - discountAmount);
  const freeShippingThreshold = 65;
  const shippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 7.50;
  const finalTotal = subtotal + shippingCost;
  const totalItemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'TROSE10' || code === 'WELCOME10') {
      setAppliedDiscount(0.10);
      setPromoMessage('10% Welcome Discount Applied!');
    } else if (code === 'VIPFREESHIP' || code === 'ROASTER15') {
      setAppliedDiscount(0.15);
      setPromoMessage('15% TROSE Club Discount Applied!');
    } else {
      setPromoMessage('Invalid promo code. Try "TROSE10" or "ROASTER15"');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRef = `TR-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderRef(generatedRef);
    setOrderComplete(true);
  };

  const handleFinalOrderFinish = () => {
    onClearCart();
    setOrderComplete(false);
    setIsCheckingOut(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      id="cart-drawer-root"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop overlay */}
      <div 
        id="cart-backdrop"
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Slide-in drawer container from the right */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div 
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-[#FAF6F0] border-l border-[#E8DFD5] shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out"
        >
          
          {/* Header */}
          <div className="p-5 sm:p-6 bg-white border-b border-[#E8DFD5] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FAF6F0] border border-[#E8DFD5] flex items-center justify-center text-[#241712]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#241712] uppercase tracking-tight">Your Bag</h2>
                <span className="text-xs text-[#7A6C63]">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            <button
              id="close-cart-drawer-btn"
              onClick={onClose}
              className="p-2 rounded-full text-[#7A6C63] hover:text-[#241712] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-6 py-3 bg-[#FAF6F0] border-b border-[#E8DFD5] text-xs">
            {items.length === 0 ? (
              <p className="text-[#7A6C63] text-xs text-center font-normal">
                Free shipping on all orders over ${freeShippingThreshold}.
              </p>
            ) : shippingRemaining > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#241712]">
                    Add <strong className="text-[#D63426]">${shippingRemaining.toFixed(2)}</strong> for Free Delivery
                  </span>
                  <span className="text-[10px] font-mono text-[#7A6C63] font-bold">
                    ${subtotal.toFixed(0)} / ${freeShippingThreshold}
                  </span>
                </div>
                <div className="w-full bg-[#E8DFD5] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#D63426] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 text-[#657953] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#657953] shrink-0" />
                <span>You’ve unlocked Free Priority Shipping!</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white border border-[#E8DFD5] mx-auto flex items-center justify-center text-[#7A6C63]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#241712] uppercase">Your bag is empty</h3>
                  <p className="text-xs text-[#7A6C63] max-w-xs mx-auto font-normal leading-relaxed">
                    Explore single-origins, organic roasts, and accessories to start your morning ritual.
                  </p>
                </div>
                <button
                  id="empty-cart-shop-now-btn"
                  onClick={() => {
                    onClose();
                    if (onExploreShop) onExploreShop();
                  }}
                  className="px-6 py-3 bg-[#241712] text-white text-xs uppercase tracking-widest font-black rounded-full hover:bg-[#D63426] transition-colors cursor-pointer shadow-xs"
                >
                  Explore Roasts
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedGrind || 'default'}-${item.subscriptionPlan || 'onetime'}`}
                  className="flex space-x-3.5 p-3.5 bg-white rounded-2xl border border-[#E8DFD5] shadow-xs"
                >
                  {/* Product Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 bg-[#FAF6F0]"
                  />

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-[#241712] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedGrind)}
                          className="text-[#7A6C63] hover:text-[#D63426] transition-colors p-1 cursor-pointer shrink-0"
                          aria-label={`Remove ${item.product.name} from bag`}
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant Details */}
                      <div className="mt-1 space-y-0.5">
                        {item.selectedGrind && (
                          <span className="text-[10px] text-[#E65F38] font-mono font-bold block">
                            Grind: {item.selectedGrind}
                          </span>
                        )}

                        {item.product.formats && item.product.formats[0] && (
                          <span className="text-[10px] text-[#7A6C63] block">
                            Size: {item.product.formats[0]}
                          </span>
                        )}

                        {item.subscriptionPlan && (
                          <span className="text-[9px] text-[#241712] bg-[#FAF6F0] border border-[#E8DFD5] px-2 py-0.5 rounded-full inline-block font-mono font-bold">
                            Club ({item.subscriptionPlan === 'every-2-weeks' ? 'Bi-weekly' : 'Monthly'})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Item Subtotal */}
                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#E8DFD5]">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#E8DFD5] rounded-full overflow-hidden bg-[#FAF6F0]">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1, item.selectedGrind)}
                          className="p-1 text-[#241712] hover:bg-white transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 py-0.5 text-xs font-bold text-[#241712] min-w-[20px] text-center font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1, item.selectedGrind)}
                          className="p-1 text-[#241712] hover:bg-white transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs sm:text-sm font-black text-[#241712]">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Panel */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-[#E8DFD5] space-y-3.5">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex space-x-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#7A6C63] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo Code (e.g. TROSE10)"
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF6F0] border border-[#E8DFD5] rounded-full text-xs focus:outline-none focus:border-[#D63426] uppercase tracking-wider font-mono font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#241712] hover:bg-[#D63426] text-white text-xs font-black uppercase tracking-wider rounded-full transition-colors cursor-pointer shadow-xs"
                >
                  Apply
                </button>
              </form>

              {promoMessage && (
                <p className={`text-xs ${appliedDiscount > 0 ? 'text-green-700' : 'text-[#D63426]'}`}>
                  {promoMessage}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#241712] pt-2 border-t border-[#E8DFD5]">
                <div className="flex justify-between">
                  <span className="text-[#7A6C63]">Subtotal</span>
                  <span className="font-semibold">${rawSubtotal.toFixed(2)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>Discount ({(appliedDiscount * 100).toFixed(0)}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-[#7A6C63]">Estimated Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <strong className="text-[#657953] font-bold">FREE</strong>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-[#241712] pt-2 border-t border-[#E8DFD5]">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="cart-proceed-checkout-btn"
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-3.5 bg-[#D63426] hover:bg-[#BF2A1D] text-white text-xs uppercase tracking-widest font-black rounded-full transition-all duration-300 shadow-md flex items-center justify-center space-x-2 cursor-pointer group"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Checkout • ${finalTotal.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#7A6C63]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#657953]" />
                <span>256-Bit SSL Encrypted • Roasted Fresh</span>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Checkout Modal Simulation */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="relative w-full max-w-lg bg-[#FAF6F0] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8DFD5] space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            
            <button
              onClick={() => setIsCheckingOut(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#7A6C63] hover:text-[#241712] hover:bg-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!orderComplete ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#D63426] font-mono font-bold">
                    Express Checkout
                  </span>
                  <h3 className="text-2xl font-black uppercase text-[#241712]">
                    Fresh Roast Dispatch
                  </h3>
                  <p className="text-xs text-[#7A6C63]">
                    Enter shipping details to schedule weekly small-batch roast delivery.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block uppercase tracking-wider text-[#241712] font-bold mb-1 text-[10px]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Taylor"
                      defaultValue="Alex Taylor"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#D63426]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[#241712] font-bold mb-1 text-[10px]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      defaultValue="alex.taylor@specialtycoffee.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#D63426]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[#241712] font-bold mb-1 text-[10px]">
                      Shipping Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="742 Artisan Roastery Blvd, Portland, OR"
                      defaultValue="742 Artisan Roastery Blvd, Portland, OR"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#D63426]"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E8DFD5] text-xs text-[#241712] flex items-center justify-between">
                    <span>Order Total ({totalItemCount} items):</span>
                    <strong className="text-base font-black text-[#241712]">${finalTotal.toFixed(2)}</strong>
                  </div>
                </div>

                <button
                  id="submit-mock-order-btn"
                  type="submit"
                  className="w-full py-4 bg-[#D63426] hover:bg-[#BF2A1D] text-white text-xs uppercase tracking-widest font-black rounded-full shadow-lg transition-colors cursor-pointer"
                >
                  Place Order (${finalTotal.toFixed(2)})
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#657953]/20 text-[#657953] mx-auto flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase text-[#241712]">Order Placed!</h3>
                  <p className="text-xs text-[#7A6C63] max-w-sm mx-auto font-normal leading-relaxed">
                    Thank you for ordering with TROSE. Your roast has been queued for small-drum roasting and fresh packaging.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E8DFD5] text-xs font-mono text-[#241712]">
                  Order Reference: <strong className="text-[#D63426]">{orderRef}</strong>
                </div>
                <button
                  onClick={handleFinalOrderFinish}
                  className="px-8 py-3 bg-[#241712] hover:bg-[#D63426] text-white text-xs uppercase tracking-widest font-black rounded-full cursor-pointer transition-colors"
                >
                  Back to Shop
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

