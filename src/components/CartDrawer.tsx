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
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'TROSE10' || code === 'WELCOME10') {
      setAppliedDiscount(0.10);
      setPromoMessage('10% Welcome Discount applied!');
    } else if (code === 'FREESHIP') {
      setAppliedDiscount(0.05);
      setPromoMessage('5% Special Promo applied!');
    } else {
      setPromoMessage('Invalid promo code. Use TROSE10 for 10% off.');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRef = `TR-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderRef(newRef);
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
    <div id="cart-drawer-root" className="fixed inset-0 z-50 overflow-hidden">
      
      {/* Backdrop */}
      <div 
        id="cart-backdrop"
        className="absolute inset-0 bg-[#12100E]/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in drawer container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div 
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#12100E] shadow-2xl flex flex-col justify-between"
        >
          
          {/* Header */}
          <div className="p-5 sm:p-6 bg-[#FDFBF7] border-b border-[#12100E]/15 flex items-center justify-between text-left">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border border-[#12100E] bg-white flex items-center justify-center text-[#12100E]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-editorial font-bold text-[#12100E] uppercase tracking-wider">Tasting Bag</h2>
                <span className="text-[10px] font-mono text-[#69574A] uppercase tracking-wider">
                  {totalItemCount} {totalItemCount === 1 ? 'ITEM' : 'ITEMS'}
                </span>
              </div>
            </div>

            <button
              id="close-cart-drawer-btn"
              onClick={onClose}
              className="p-1.5 border border-[#12100E]/20 text-[#12100E] hover:border-[#12100E] hover:text-[#D62828] transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Complimentary Shipping Progress Bar */}
          <div className="px-6 py-3 bg-[#FDFBF7] border-b border-[#12100E]/15 text-xs text-left">
            {items.length === 0 ? (
              <p className="text-[#69574A] text-[11px] font-mono uppercase tracking-wider text-center">
                COMPLIMENTARY DISPATCH ON ORDERS OVER ${freeShippingThreshold}.
              </p>
            ) : shippingRemaining > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                  <span className="text-[#12100E]">
                    ADD <strong className="text-[#D62828]">${shippingRemaining.toFixed(2)}</strong> FOR FREE DISPATCH
                  </span>
                  <span className="text-[#69574A]">
                    ${subtotal.toFixed(0)} / ${freeShippingThreshold}
                  </span>
                </div>
                <div className="w-full bg-[#12100E]/10 h-1 overflow-hidden">
                  <div
                    className="bg-[#D62828] h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 text-[#C5A059] text-[11px] font-mono uppercase tracking-wider font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>UNLOCKED COMPLIMENTARY EXPEDITED SHIPPING</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3 text-left">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-14 h-14 border border-[#12100E] mx-auto flex items-center justify-center text-[#12100E]">
                  <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-editorial font-bold text-[#12100E] uppercase">Your bag is empty</h3>
                  <p className="text-xs text-[#69574A] max-w-xs mx-auto font-sans leading-relaxed">
                    Explore single-origins, organic micro-lots, and accessories to initiate your morning ritual.
                  </p>
                </div>
                <button
                  id="empty-cart-shop-now-btn"
                  onClick={() => {
                    onClose();
                    if (onExploreShop) onExploreShop();
                  }}
                  className="px-6 py-3 bg-[#12100E] text-white text-[10px] font-mono uppercase tracking-widest font-bold hover:bg-[#D62828] transition-colors cursor-pointer"
                >
                  EXPLORE ROASTS
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedGrind || 'default'}-${item.subscriptionPlan || 'onetime'}`}
                  className="flex space-x-3.5 p-3.5 bg-[#FDFBF7] border border-[#12100E]/15"
                >
                  {/* Product Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-18 h-18 object-cover shrink-0 bg-[#F2E8DC] border border-[#12100E]/15"
                  />

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-editorial font-bold text-[#12100E] line-clamp-1 uppercase">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedGrind)}
                          className="text-[#69574A] hover:text-[#D62828] transition-colors p-1 cursor-pointer shrink-0"
                          aria-label={`Remove ${item.product.name} from bag`}
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant Details */}
                      <div className="mt-1 space-y-0.5">
                        {item.selectedGrind && (
                          <span className="text-[9px] text-[#C5A059] font-mono uppercase tracking-wider font-bold block">
                            GRIND: {item.selectedGrind}
                          </span>
                        )}

                        {item.product.formats && item.product.formats[0] && (
                          <span className="text-[9px] text-[#69574A] font-mono block">
                            SIZE: {item.product.formats[0]}
                          </span>
                        )}

                        {item.subscriptionPlan && (
                          <span className="text-[8px] text-[#12100E] bg-[#FAF7F2] border border-[#12100E]/20 px-1.5 py-0.5 inline-block font-mono uppercase font-bold">
                            CLUB ({item.subscriptionPlan === 'every-2-weeks' ? 'BI-WEEKLY' : 'MONTHLY'})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Item Subtotal */}
                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#12100E]/10">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#12100E]/30 bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1, item.selectedGrind)}
                          className="px-2 py-0.5 text-[#12100E] hover:bg-black/5 transition-colors cursor-pointer text-xs font-mono font-bold"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 py-0.5 text-xs font-bold text-[#12100E] min-w-[20px] text-center font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1, item.selectedGrind)}
                          className="px-2 py-0.5 text-[#12100E] hover:bg-black/5 transition-colors cursor-pointer text-xs font-mono font-bold"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-mono font-bold text-[#12100E]">
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
            <div className="p-5 sm:p-6 bg-[#FDFBF7] border-t border-[#12100E]/15 space-y-3.5 text-left">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex space-x-2">
                <div className="relative flex-1">
                  <Tag className="w-3 h-3 text-[#69574A] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="PROMO CODE (TROSE10)"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-[#12100E]/20 text-[10px] focus:outline-none focus:border-[#12100E] uppercase tracking-wider font-mono font-bold text-[#12100E]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#12100E] hover:bg-[#261C14] text-white text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  APPLY
                </button>
              </form>

              {promoMessage && (
                <p className={`text-[10px] font-mono ${appliedDiscount > 0 ? 'text-[#C5A059]' : 'text-[#D62828]'}`}>
                  {promoMessage}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#12100E] pt-2 border-t border-[#12100E]/10 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#69574A]">SUBTOTAL</span>
                  <span className="font-bold">${rawSubtotal.toFixed(2)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-[#C5A059] font-bold">
                    <span>DISCOUNT ({(appliedDiscount * 100).toFixed(0)}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-[#69574A]">ESTIMATED DISPATCH</span>
                  <span>
                    {shippingCost === 0 ? (
                      <strong className="text-[#C5A059] font-bold">FREE</strong>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-[#12100E] pt-2 border-t border-[#12100E]/15">
                  <span>TOTAL</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="cart-proceed-checkout-btn"
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-4 bg-[#12100E] hover:bg-[#261C14] text-white text-xs font-mono uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-xs active:translate-y-0.5"
              >
                <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>CHECKOUT · ${finalTotal.toFixed(2)}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] font-mono text-[#69574A] uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>256-BIT SSL ENCRYPTION · FRESH BATCH PACKAGED</span>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Checkout Modal Simulation */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="relative w-full max-w-lg bg-[#FAF7F2] p-6 sm:p-8 border border-[#12100E] space-y-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsCheckingOut(false)}
              className="absolute top-4 right-4 p-1.5 border border-[#12100E]/20 text-[#12100E] hover:border-[#12100E] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {!orderComplete ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-mono font-bold">
                    EXPRESS DISPATCH
                  </span>
                  <h3 className="text-2xl font-editorial font-bold uppercase text-[#12100E]">
                    Order Details
                  </h3>
                  <p className="text-xs text-[#69574A]">
                    Enter your contact details to review your order.
                  </p>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="block uppercase tracking-wider text-[#12100E] font-bold mb-1 text-[9px]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Taylor"
                      defaultValue="Alex Taylor"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#12100E]/20 focus:outline-none focus:border-[#12100E] text-[#12100E]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[#12100E] font-bold mb-1 text-[9px]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      defaultValue="alex.taylor@example.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#12100E]/20 focus:outline-none focus:border-[#12100E] text-[#12100E]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[#12100E] font-bold mb-1 text-[9px]">
                      Shipping Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="123 Main St, New York, NY"
                      defaultValue="123 Main St, New York, NY"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#12100E]/20 focus:outline-none focus:border-[#12100E] text-[#12100E]"
                    />
                  </div>

                  <div className="p-3 bg-white border border-[#12100E]/15 text-xs text-[#12100E] flex items-center justify-between">
                    <span>ORDER TOTAL ({totalItemCount} ITEMS):</span>
                    <strong className="text-base font-bold text-[#12100E]">${finalTotal.toFixed(2)}</strong>
                  </div>
                </div>

                <button
                  id="submit-mock-order-btn"
                  type="submit"
                  className="w-full py-4 bg-[#12100E] hover:bg-[#D62828] text-white text-xs uppercase tracking-[0.2em] font-mono font-bold transition-colors cursor-pointer"
                >
                  PLACE ORDER (${finalTotal.toFixed(2)})
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 border border-[#12100E] text-[#C5A059] mx-auto flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-editorial font-bold uppercase text-[#12100E]">Order Confirmed</h3>
                  <p className="text-xs text-[#69574A] max-w-sm mx-auto font-sans leading-relaxed">
                    Thank you for ordering with TROSE. Your order has been received and is being prepared for fulfillment.
                  </p>
                </div>
                <div className="p-3 bg-white border border-[#12100E]/20 text-xs font-mono text-[#12100E]">
                  ORDER REFERENCE: <strong className="text-[#D62828]">{orderRef}</strong>
                </div>
                <button
                  onClick={handleFinalOrderFinish}
                  className="px-8 py-3 bg-[#12100E] hover:bg-[#D62828] text-white text-xs font-mono uppercase tracking-widest font-bold cursor-pointer transition-colors"
                >
                  RETURN TO CATALOGUE
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
