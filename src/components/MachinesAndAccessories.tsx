import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface MachinesAndAccessoriesProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onExploreGear: () => void;
}

export const MachinesAndAccessories: React.FC<MachinesAndAccessoriesProps> = ({
  products,
  onQuickView,
  onAddToCart,
  onExploreGear
}) => {
  const gearItems = products.filter(
    (p) => p.category === 'machines' || p.category === 'accessories'
  );

  return (
    <section id="machines-and-accessories-section" className="py-16 sm:py-24 bg-[#F4EFEA] border-b border-[#0E0C0B]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Section Header: Quieter Editorial Hierarchy */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6 border-b border-[#0E0C0B]/10 pb-6">
          <div className="space-y-2 max-w-xl text-left font-sans">
            <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#C88E38] font-bold">
              <span className="w-5 h-[1.5px] bg-[#C88E38]" />
              <span>BREWING & HARDWARE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-[#0E0C0B] tracking-tight uppercase">
              Machines & Tools
            </h2>
            <p className="text-sm sm:text-base text-[#0E0C0B]/75 font-normal leading-relaxed">
              Precision espresso machinery, grinders, and barista tools curated to elevate your daily extraction.
            </p>
          </div>

          <button
            id="explore-all-gear-btn"
            onClick={onExploreGear}
            className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-[0.16em] font-bold text-[#0E0C0B] hover:text-[#8A2B2B] transition-colors cursor-pointer group self-start md:self-end border-b border-[#0E0C0B]/30 pb-0.5 hover:border-[#8A2B2B]"
          >
            <span>VIEW ALL GEAR</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C88E38] group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gearItems.slice(0, 4).map((item) => (
            <div
              key={item.id}
              id={`gear-card-${item.id}`}
              onClick={() => onQuickView(item)}
              className="group bg-white border border-[#0E0C0B]/12 hover:border-[#0E0C0B] hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer text-left"
            >
              {/* Product Visual */}
              <div className="relative aspect-square bg-[#E8D8C3] overflow-hidden border-b border-[#0E0C0B]/12 flex items-center justify-center p-4">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-contain group-hover:scale-104 transition-transform duration-500"
                  loading="lazy"
                />
                
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 bg-[#0E0C0B] text-white text-[9px] font-sans font-bold uppercase tracking-wider">
                    {item.category === 'machines' ? 'Pro Machine' : 'Barista Tool'}
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 font-sans">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[#69574A] block mb-1">
                    {item.category === 'machines' ? 'Precision Extraction' : 'Barista Essentials'}
                  </span>
                  <h3 className="text-sm font-sans font-bold text-[#0E0C0B] group-hover:text-[#8A2B2B] transition-colors line-clamp-2 leading-snug uppercase">
                    {item.name}
                  </h3>
                </div>

                <div className="pt-3 border-t border-[#0E0C0B]/10 flex items-center justify-between">
                  <span className="text-base font-sans font-bold text-[#0E0C0B]">
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(item);
                    }}
                    className="px-3 py-1.5 bg-[#0E0C0B] hover:bg-[#8A2B2B] text-white text-[11px] font-sans uppercase tracking-wider font-bold transition-colors flex items-center space-x-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C88E38]" />
                    <span>ADD</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
