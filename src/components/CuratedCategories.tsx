import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ProductCategory } from '../types';

interface CuratedCategoriesProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export const CuratedCategories: React.FC<CuratedCategoriesProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'coffee' as ProductCategory,
      number: '01',
      title: 'Single-Origin Coffee',
      subtitle: 'High-altitude micro-lots from Ethiopia, Colombia & Guatemala',
      image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80',
      tag: 'Arabica Micro-Lots'
    },
    {
      id: 'organic' as ProductCategory,
      number: '02',
      title: 'Organic Certified Roasts',
      subtitle: '100% USDA Organic, shade-grown, zero synthetic pesticides',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80',
      tag: 'Bio Certification'
    },
    {
      id: 'machines' as ProductCategory,
      number: '03',
      title: 'Prosumer Machines',
      subtitle: 'Dual-boiler espresso powerhouses & precision flat burr grinders',
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
      tag: 'Precision Extraction'
    },
    {
      id: 'accessories' as ProductCategory,
      number: '04',
      title: 'Barista Accessories',
      subtitle: 'PID gooseneck kettles, smart scales, hand-thrown ceramics',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
      tag: 'Brew Craft'
    },
    {
      id: 'mugs-flasks' as ProductCategory,
      number: '05',
      title: 'Drinkware & Flasks',
      subtitle: 'Double-walled vacuum insulated thermal travel vessels',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      tag: 'Thermal Vessels'
    }
  ];

  return (
    <section id="curated-categories-section" className="py-16 sm:py-24 bg-[#FDFBF7] border-b border-[#12100E]/15">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-[#12100E]/15 pb-6 text-left">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059]">
              <span>02 / THE TROSE DIRECTORY</span>
              <span className="text-[#D62828]">●</span>
              <span>INDEX</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-editorial font-bold text-[#12100E] uppercase tracking-tight">
              Crafted For Every Ritual
            </h2>
          </div>
          
          <button
            onClick={() => onSelectCategory('all')}
            className="mt-4 sm:mt-0 inline-flex items-center space-x-2 text-[11px] font-mono uppercase tracking-[0.2em] font-bold text-[#12100E] hover:text-[#D62828] transition-colors cursor-pointer group"
          >
            <span>EXPLORE FULL DIRECTORY</span>
            <ArrowUpRight className="w-4 h-4 text-[#D62828] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Categories Grid (Bauhaus Asymmetric Structured Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
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
                className={`group relative border border-[#12100E]/15 hover:border-[#12100E] overflow-hidden cursor-pointer transition-all duration-300 bg-[#12100E] ${
                  isLarge ? 'md:col-span-1 lg:col-span-1 h-[340px]' : 'h-[320px]'
                }`}
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-75"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Packaging Technical Grid Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-left pointer-events-none">
                  
                  {/* Top Bar: Number & Tag */}
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-[#FAF7F2] text-[#12100E] text-[10px] font-mono font-bold tracking-widest uppercase">
                      {cat.number}
                    </span>
                    <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-widest font-bold">
                      {cat.tag}
                    </span>
                  </div>

                  {/* Bottom Bar: Title & Subtitle */}
                  <div className="space-y-1.5 bg-[#12100E]/85 backdrop-blur-xs p-4 border border-white/10">
                    <h3 className="text-xl font-editorial font-bold text-white uppercase tracking-wide group-hover:text-[#C5A059] transition-colors flex items-center justify-between">
                      <span>{cat.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-[#C5A059] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </h3>
                    <p className="text-[11px] text-[#FAF7F2]/75 font-sans line-clamp-2">
                      {cat.subtitle}
                    </p>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
