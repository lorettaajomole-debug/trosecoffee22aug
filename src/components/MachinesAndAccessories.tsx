import React from 'react';
import { Sliders, Wrench, Shield, ArrowRight, ShoppingBag, Eye, Star } from 'lucide-react';
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
    <section id="machines-and-accessories-section" className="py-16 sm:py-24 bg-[#FAF6F0] border-b border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-[#D63426] font-bold">
              Precision Gear & Hardware
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#241712] tracking-tight uppercase">
              Machines & Barista Tools
            </h2>
            <p className="text-sm sm:text-base text-[#241712]/70 font-normal">
              Commercial-grade dual boilers, precision flat burr grinders, and PID kettles designed for cafe-quality extraction at home.
            </p>
          </div>

          <button
            id="explore-all-gear-btn"
            onClick={onExploreGear}
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-black text-[#241712] hover:text-[#D63426] transition-colors cursor-pointer group self-start md:self-end"
          >
            <span>View All Gear</span>
            <ArrowRight className="w-4 h-4 text-[#D63426] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gearItems.slice(0, 4).map((item) => (
            <div
              key={item.id}
              id={`gear-card-${item.id}`}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E8DFD5] shadow-xs hover:shadow-xl hover:border-[#D63426]/40 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Product Visual */}
              <div 
                onClick={() => onQuickView(item)}
                className="relative aspect-square bg-[#1F1612] overflow-hidden cursor-pointer"
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                
                {/* Category Pill */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-2.5 py-0.5 bg-[#1F1612]/90 backdrop-blur-md text-white text-[10px] font-mono font-bold uppercase rounded-full tracking-wider border border-white/10">
                    {item.category === 'machines' ? 'Pro Machine' : 'Barista Tool'}
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#7A6C63]">
                    <span className="font-mono text-[10px] uppercase font-semibold">{item.weightOrSpecs}</span>
                    <div className="flex items-center space-x-1 text-[#241712] font-semibold">
                      <Star className="w-3.5 h-3.5 fill-[#E65F38] text-[#E65F38]" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => onQuickView(item)}
                    className="text-lg font-bold text-[#241712] group-hover:text-[#D63426] transition-colors cursor-pointer line-clamp-1"
                  >
                    {item.name}
                  </h3>

                  <p className="text-xs text-[#7A6C63] line-clamp-2 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-[#E8DFD5] flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-[#241712] tracking-tight">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.originalPrice && (
                      <span className="ml-1.5 text-xs text-[#7A6C63] line-through">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    id={`gear-add-btn-${item.id}`}
                    onClick={() => onAddToCart(item)}
                    className="px-4 py-2 bg-[#241712] hover:bg-[#D63426] text-white text-xs uppercase tracking-wider font-bold rounded-full transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-95"
                    aria-label={`Add ${item.name} to bag`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Technical Trust Strip */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#F4EFEB] border border-[#E8DFD5] grid grid-cols-1 sm:grid-cols-3 gap-6 shadow-xs">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-white text-[#D63426] shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#241712] uppercase">PID Thermal Stability</h4>
              <p className="text-xs text-[#7A6C63] mt-0.5 font-normal">0.5°C temperature precision for dialed-in espresso extractions.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-white text-[#657953] shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#241712] uppercase">2-Year Full Warranty</h4>
              <p className="text-xs text-[#7A6C63] mt-0.5 font-normal">Complimentary factory support, rapid replacement & parts service.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-white text-[#E65F38] shadow-xs">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#241712] uppercase">Bench-Tested Quality</h4>
              <p className="text-xs text-[#7A6C63] mt-0.5 font-normal">Every single unit is calibrated and inspected prior to dispatch.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};


