import React from 'react';
import { ArrowUpRight, Coffee, Sparkles, Sliders, ShieldCheck, Gift } from 'lucide-react';
import { ProductCategory } from '../types';

interface CuratedCategoriesProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export const CuratedCategories: React.FC<CuratedCategoriesProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'coffee' as ProductCategory,
      title: 'Single-Origin Coffee',
      subtitle: 'High-altitude micro-lots from Ethiopia, Colombia & Guatemala',
      image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80',
      icon: Coffee,
      badge: 'Artisan Harvest'
    },
    {
      id: 'organic' as ProductCategory,
      title: 'Organic Certified Roasts',
      subtitle: '100% USDA Organic, shade-grown, zero synthetic pesticides',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80',
      icon: ShieldCheck,
      badge: 'USDA Organic'
    },
    {
      id: 'machines' as ProductCategory,
      title: 'Prosumer Machines',
      subtitle: 'Dual-boiler espresso powerhouses & precision flat burr grinders',
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
      icon: Sliders,
      badge: 'Commercial Grade'
    },
    {
      id: 'accessories' as ProductCategory,
      title: 'Barista Accessories',
      subtitle: 'PID gooseneck kettles, smart scales, hand-thrown ceramics',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
      icon: Sparkles,
      badge: 'Precision Tools'
    },
    {
      id: 'bundles' as ProductCategory,
      title: 'Tasting Gift Sets',
      subtitle: 'Curated roaster flights in gold-embossed bespoke boxes',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
      icon: Gift,
      badge: 'Curated Gift'
    }
  ];

  return (
    <section id="curated-categories-section" className="py-16 sm:py-20 bg-[#FDFBF7] border-b border-[#E5E5CB]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="h-[1px] w-6 bg-[#C5A059]"></span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                The TROSE Collection
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#3C2A21]">
              Crafted For Every Coffee Ritual
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="mt-4 sm:mt-0 inline-flex items-center space-x-1.5 text-xs uppercase tracking-widest font-semibold text-[#3C2A21] hover:text-[#C5A059] transition-colors cursor-pointer group"
          >
            <span>Explore Full Catalog</span>
            <ArrowUpRight className="w-4 h-4 text-[#C5A059] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const isLarge = idx === 0 || idx === 1;

            return (
              <div
                key={cat.id}
                id={`category-card-${cat.id}`}
                onClick={() => {
                  onSelectCategory(cat.id);
                  const shopEl = document.getElementById('shop-collection-section');
                  if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group relative rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 bg-[#211C1A] border border-[#E5E5CB] ${
                  isLarge ? 'md:col-span-1 lg:col-span-1 h-[320px]' : 'h-[300px]'
                }`}
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 opacity-75 group-hover:opacity-90"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#211C1A] via-[#211C1A]/40 to-transparent" />

                {/* Badge Top Left */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-[#211C1A]/80 backdrop-blur-md border border-white/15 text-[#E5C378] text-[10px] font-semibold tracking-widest uppercase rounded">
                    {cat.badge}
                  </span>
                </div>

                {/* Floating Arrow Icon Top Right */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#C5A059] group-hover:text-[#211C1A] transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>

                {/* Text Content Bottom */}
                <div className="absolute bottom-5 left-5 right-5 space-y-1.5 text-white">
                  <div className="flex items-center space-x-2 text-[#C5A059]">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-widest font-mono">Curated Tier</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-normal text-[#FDFBF7] group-hover:text-[#E5C378] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#FDFBF7]/70 line-clamp-2 font-light">
                    {cat.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

