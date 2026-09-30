import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCategory } from '../types';

interface ShopOurCollectionsProps {
  onShopCollection: (category: ProductCategory) => void;
}

export const ShopOurCollections: React.FC<ShopOurCollectionsProps> = ({ onShopCollection }) => {
  const collections = [
    {
      id: 'coffee' as ProductCategory,
      title: 'SIGNATURE BLENDS',
      subtitle: 'Everyday greatness.',
      archColor: '#C88E38', // Mustard / Gold
      pouchImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=85',
      accentGarnish: 'Vanilla & Beans'
    },
    {
      id: 'coffee' as ProductCategory,
      title: 'FLAVORED COFFEES',
      subtitle: 'A little more indulgence.',
      archColor: '#8A2B2B', // Burnt Red / Deep Terracotta
      pouchImage: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=85',
      accentGarnish: 'Artisan Dark Chocolate'
    },
    {
      id: 'coffee' as ProductCategory,
      title: 'SINGLE ORIGIN',
      subtitle: 'A taste of the world.',
      archColor: '#162820', // Forest Green
      pouchImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=85',
      accentGarnish: 'Cacao Nibs'
    },
    {
      id: 'organic' as ProductCategory,
      title: 'SPECIALTY',
      subtitle: 'Bold. Rare. Exceptional.',
      archColor: '#142233', // Deep Navy
      pouchImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=85',
      accentGarnish: 'Roasted Whole Beans'
    },
    {
      id: 'accessories' as ProductCategory,
      title: 'FUNCTIONAL',
      subtitle: 'Coffee that does more.',
      archColor: '#2A1D15', // Espresso / Chocolate Brown
      pouchImage: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=85',
      accentGarnish: 'Botanical Blends'
    }
  ];

  return (
    <section id="shop-our-collections-section" className="py-16 sm:py-24 bg-[#F4EFEA] border-b border-[#0E0C0B]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Section Header matching Master Reference */}
        <div className="flex flex-row items-end justify-between mb-12 sm:mb-16">
          <div className="text-left font-display">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0E0C0B] tracking-tight leading-[0.95] uppercase">
              <span className="block">SHOP</span>
              <span className="block">
                OUR <span className="text-[#C88E38]">COLLECTIONS</span>
              </span>
            </h2>
          </div>

          <button
            onClick={() => onShopCollection('all')}
            className="inline-flex items-center space-x-1.5 text-xs font-sans font-bold uppercase tracking-[0.16em] text-[#0E0C0B] hover:text-[#C88E38] border-b border-[#0E0C0B] pb-0.5 hover:border-[#C88E38] transition-colors cursor-pointer self-end mb-1"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Distinct Colored Arches with Products matching Reference */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-7 items-start">
          {collections.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onShopCollection(item.id)}
              className="group flex flex-col items-center text-center cursor-pointer transition-transform duration-300 hover:-translate-y-1.5"
            >
              {/* Colored Arch Stage with Overlapping Kraft Pouch */}
              <div className="relative w-full aspect-[4/5] rounded-t-full flex items-end justify-center p-3 overflow-hidden shadow-xs border border-[#0E0C0B]/10"
                   style={{ backgroundColor: item.archColor }}
              >
                {/* Product Kraft Bag with Official Circular TROSE Seal */}
                <div className="relative w-[85%] h-[85%] z-10 flex flex-col items-center justify-end">
                  
                  {/* Kraft Pouch Visual Card */}
                  <div className="relative w-full h-full bg-[#D4B896] border border-[#0E0C0B] shadow-md flex flex-col items-center justify-between p-2.5">
                    {/* Top Notch */}
                    <div className="w-6 h-1 bg-[#0E0C0B]/30 rounded-full" />
                    
                    {/* Official Circular Logo */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center my-auto">
                      <img
                        src="/assets/trose-logo.png"
                        alt="TROSE Seal"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Small Kraft label */}
                    <div className="w-full bg-[#F4EFEA] border border-[#0E0C0B]/40 p-1 text-[7px] font-sans font-bold uppercase tracking-tight text-[#0E0C0B]">
                      TROSE ROAST
                    </div>
                  </div>

                </div>

                {/* Roasted Beans & Ingredient Accent Silhouette at the Base */}
                <div className="absolute -bottom-2 inset-x-0 h-6 bg-[#0E0C0B]/30 blur-xs -z-0" />
              </div>

              {/* Title & Subtitle matching reference */}
              <div className="mt-4 space-y-0.5 font-sans">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0E0C0B] group-hover:text-[#C88E38] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#0E0C0B]/70 font-normal">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
