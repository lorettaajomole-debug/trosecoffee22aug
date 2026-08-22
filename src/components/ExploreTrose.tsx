import React from 'react';
import { ArrowRight, Coffee, ShieldCheck, CupSoda, Cookie, Armchair, Sliders, Sparkles } from 'lucide-react';
import { ProductCategory } from '../types';

interface ExploreTroseProps {
  onShopCollection: (category: ProductCategory) => void;
}

export const ExploreTrose: React.FC<ExploreTroseProps> = ({ onShopCollection }) => {
  // 4 Primary Hero Categories
  const mainCategories = [
    {
      id: 'coffee' as ProductCategory,
      title: 'Coffee',
      tag: 'Micro-Lot Roasts',
      image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=900&q=85',
      badgeColor: 'bg-[#D63426] text-white',
      badgeText: 'Fresh Roasts'
    },
    {
      id: 'organic' as ProductCategory,
      title: 'Organic Coffee',
      tag: '100% USDA Certified',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=85',
      badgeColor: 'bg-[#657953] text-white',
      badgeText: 'Bio Organic'
    },
    {
      id: 'machines' as ProductCategory,
      title: 'Coffee Machines',
      tag: 'Espresso & Grinders',
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=85',
      badgeColor: 'bg-[#241712] text-white',
      badgeText: 'Pro Gear'
    },
    {
      id: 'accessories' as ProductCategory,
      title: 'Mugs & Accessories',
      tag: 'Ceramics & Barista Tools',
      image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=85',
      badgeColor: 'bg-[#E65F38] text-white',
      badgeText: 'Drinkware & Tools'
    }
  ];

  // Secondary categories accessed as clean, minimalist chips
  const secondaryCategories: { id: ProductCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'beverages', label: 'Craft Beverages & Cascara', icon: CupSoda },
    { id: 'snacks', label: 'Artisan Chocolates & Cantucci', icon: Cookie },
    { id: 'tables', label: 'Salon Coffee Tables', icon: Armchair },
    { id: 'bundles', label: 'Gift Flights & Sets', icon: Sparkles }
  ];

  return (
    <section id="explore-trose-section" className="py-16 sm:py-24 bg-[#FAF6F0] border-b border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-[#D63426] font-bold">
              Shop By Category
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#241712] tracking-tight uppercase">
              Explore TROSE
            </h2>
            <p className="text-sm sm:text-base text-[#241712]/70 font-normal">
              Find your morning essential — from freshly roasted beans to precision machines and artisan drinkware.
            </p>
          </div>

          <button
            onClick={() => onShopCollection('all')}
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-black text-[#241712] hover:text-[#D63426] transition-colors cursor-pointer group pb-1 self-start md:self-end"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 text-[#D63426] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Prominent Hero Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainCategories.map((item) => (
            <div
              key={item.id}
              id={`explore-collection-card-${item.id}`}
              onClick={() => onShopCollection(item.id)}
              className="group relative h-[360px] sm:h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border border-[#E8DFD5] flex flex-col justify-end p-6 bg-[#1F1612]"
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 opacity-85 group-hover:opacity-95"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              
              {/* Clean Dark Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F1612]/90 via-[#1F1612]/30 to-transparent" />

              {/* Top Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs ${item.badgeColor}`}>
                  {item.badgeText}
                </span>
              </div>

              {/* Card Bottom Content */}
              <div className="relative z-10 space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#FAF6F0]/80 block">
                  {item.tag}
                </span>
                
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-[#FAF6F0]">
                    {item.title}
                  </h3>
                  <div className="w-9 h-9 rounded-full bg-[#FAF6F0] text-[#241712] flex items-center justify-center group-hover:bg-[#D63426] group-hover:text-white transition-colors duration-200 shadow-md">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sleek Minimalist Secondary Category Bar */}
        <div className="mt-8 pt-6 border-t border-[#E8DFD5] flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[11px] font-mono uppercase text-[#7A6C63] font-semibold">
            Also In The Studio:
          </span>
          <div className="flex flex-wrap gap-2">
            {secondaryCategories.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => onShopCollection(sec.id)}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#241712] hover:text-white border border-[#E8DFD5] text-[#241712] text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Icon className="w-3.5 h-3.5 text-[#D63426]" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

