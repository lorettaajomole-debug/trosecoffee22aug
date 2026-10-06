import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface MobileCheckoutBarProps {
  cart: CartItem[];
  onOpenCart: () => void;
}

export const MobileCheckoutBar: React.FC<MobileCheckoutBarProps> = ({ cart, onOpenCart }) => {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-[#0E0C0B] text-white border-t border-[#C88E38]/60 shadow-[0_-8px_25px_rgba(0,0,0,0.4)] px-4 py-3 animate-fadeIn">
      <div className="flex items-center justify-between gap-3">
        
        {/* Left: Bag summary */}
        <button
          onClick={onOpenCart}
          className="flex items-center space-x-2 text-left cursor-pointer flex-1"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#C88E38]" />
            <span className="absolute -top-1.5 -right-2 bg-[#8A2B2B] text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalCount}
            </span>
          </div>
          <div className="flex flex-col pl-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/70">
              TASTING BAG
            </span>
            <span className="text-xs font-sans font-bold text-white">
              ${subtotal.toFixed(2)}
            </span>
          </div>
        </button>

        {/* Right: Checkout CTA */}
        <button
          onClick={onOpenCart}
          className="px-5 py-2.5 bg-[#C88E38] hover:bg-[#d99f48] text-[#0E0C0B] text-xs font-sans font-extrabold uppercase tracking-widest flex items-center space-x-2 rounded-xs shadow-md cursor-pointer active:scale-95 transition-transform"
        >
          <span>CHECKOUT</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>

      </div>
    </div>
  );
};
