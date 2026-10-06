import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { CoffeeSubcategory, matchCoffeeSubcategory } from '../services/categoryManager';
import { isStorefrontEligibleProduct } from '../services/productClassification';
import { TrosePackagingPouch, TrosePouchVariant } from './hero/TrosePackagingPouch';

interface ShopOurCollectionsProps {
  products?: Product[];
  onShopCollection: (subcategory: CoffeeSubcategory) => void;
  onViewAllCoffee?: () => void;
}

export const ShopOurCollections: React.FC<ShopOurCollectionsProps> = ({
  products = [],
  onShopCollection,
  onViewAllCoffee
}) => {
  // CRITICAL RULE: STRICTLY COFFEE ONLY.
  // Zero mugs, clothing, tea, tables, machines, candles, drinkware, or accessories can ever enter.
  const coffeeOnlyProducts = useMemo(() => {
    return products.filter((p) => p.department === 'coffee' && isStorefrontEligibleProduct(p));
  }, [products]);

  // 1. Signature Blends (House Blend, Breakfast Blend, 6 Bean Blend and genuine core blends)
  const signatureBlends = useMemo(() => {
    return coffeeOnlyProducts.filter((p) => matchCoffeeSubcategory(p, 'signature-blends'));
  }, [coffeeOnlyProducts]);

  // 2. Flavored Coffees (Dubai Chocolate, French Vanilla, Hazelnut, etc.)
  const flavoredCoffees = useMemo(() => {
    return coffeeOnlyProducts.filter((p) => matchCoffeeSubcategory(p, 'flavored-coffees'));
  }, [coffeeOnlyProducts]);

  // 3. Single Origin (Ethiopia Natural, Colombia, Bali Blue, etc.)
  const singleOriginCoffees = useMemo(() => {
    return coffeeOnlyProducts.filter((p) => matchCoffeeSubcategory(p, 'single-origin'));
  }, [coffeeOnlyProducts]);

  // 4. Organic Coffee (Honduras Organic, Bali Blue, Peru, TROSE Organic Marcala)
  const organicCoffees = useMemo(() => {
    return coffeeOnlyProducts.filter((p) => matchCoffeeSubcategory(p, 'organic-coffee'));
  }, [coffeeOnlyProducts]);

  // 5. Capsules (60 Pack & 12 Pack Single Serve Coffee Capsules)
  const capsuleCoffees = useMemo(() => {
    return coffeeOnlyProducts.filter((p) => matchCoffeeSubcategory(p, 'capsules'));
  }, [coffeeOnlyProducts]);

  // Resolve REAL, DIFFERENT representative Shopify products for each collection:
  const signatureProduct =
    signatureBlends.find((p) => p.name.toLowerCase().includes('breakfast blend')) ||
    signatureBlends.find((p) => p.name.toLowerCase().includes('house blend')) ||
    signatureBlends[0];

  const flavoredProduct =
    flavoredCoffees.find((p) => p.name.toLowerCase().includes('dubai')) ||
    flavoredCoffees.find((p) => p.name.toLowerCase().includes('vanilla')) ||
    flavoredCoffees.find((p) => p.name.toLowerCase().includes('chocolate')) ||
    flavoredCoffees[0];

  const singleOriginProduct =
    singleOriginCoffees.find((p) => p.name.toLowerCase().includes('ethiopia')) ||
    singleOriginCoffees.find((p) => p.name.toLowerCase().includes('colombia')) ||
    singleOriginCoffees[0];

  const organicProduct =
    organicCoffees.find((p) => p.name.toLowerCase().includes('honduras')) ||
    organicCoffees.find((p) => p.name.toLowerCase().includes('marcala')) ||
    organicCoffees.find((p) => p.name.toLowerCase().includes('bali')) ||
    organicCoffees[0];

  const capsuleProduct =
    capsuleCoffees.find((p) => p.name.toLowerCase().includes('60 pack')) ||
    capsuleCoffees.find((p) => p.name.toLowerCase().includes('single serve')) ||
    capsuleCoffees[0];

  // The 5 Bauhaus Coffee Collections in approved canonical order & colors:
  // 1. Signature Blends (Gold #C88E38)
  // 2. Flavored Coffees (Burgundy #8A2B2B)
  // 3. Single Origin (Forest Green #162820)
  // 4. Organic Coffee (Navy #142233)
  // 5. Capsules (Espresso Brown #2A1D15)
  const collections: {
    subcategoryId: CoffeeSubcategory;
    title: string;
    subtitle: string;
    archColor: string;
    product: Product | null;
    pouchVariant: TrosePouchVariant;
    pouchCustomTitle?: string;
    decorativeBadge: string;
    actionLabel: string;
    isAvailable: boolean;
  }[] = [
    {
      subcategoryId: 'signature-blends',
      title: 'SIGNATURE BLENDS',
      subtitle: 'Everyday greatness.',
      archColor: '#C88E38', // Gold
      product: signatureProduct,
      pouchVariant: 'breakfast-blend',
      pouchCustomTitle: signatureProduct ? signatureProduct.name.toUpperCase() : 'BREAKFAST BLEND',
      decorativeBadge: 'Whole Bean & Crema',
      actionLabel: 'EXPLORE COLLECTION',
      isAvailable: true
    },
    {
      subcategoryId: 'flavored-coffees',
      title: 'FLAVORED COFFEES',
      subtitle: 'A little more indulgence.',
      archColor: '#8A2B2B', // Burgundy
      product: flavoredProduct,
      pouchVariant: 'dubai-chocolate',
      pouchCustomTitle: flavoredProduct ? flavoredProduct.name.toUpperCase() : 'DUBAI CHOCOLATE',
      decorativeBadge: 'Cacao & Spiced Notes',
      actionLabel: 'EXPLORE COLLECTION',
      isAvailable: true
    },
    {
      subcategoryId: 'single-origin',
      title: 'SINGLE ORIGIN',
      subtitle: 'A taste of the world.',
      archColor: '#162820', // Forest Green
      product: singleOriginProduct,
      pouchVariant: 'single-origin',
      pouchCustomTitle: singleOriginProduct ? singleOriginProduct.name.toUpperCase() : 'ETHIOPIA NATURAL',
      decorativeBadge: 'High-Elevation Terroir',
      actionLabel: 'EXPLORE COLLECTION',
      isAvailable: true
    },
    {
      subcategoryId: 'organic-coffee',
      title: 'ORGANIC COFFEE',
      subtitle: 'Certified pure harvest.',
      archColor: '#142233', // Navy
      product: organicProduct,
      pouchVariant: 'organic',
      pouchCustomTitle: organicProduct ? organicProduct.name.toUpperCase() : 'ORGANIC HARVEST',
      decorativeBadge: 'Certified Organic Beans',
      actionLabel: 'EXPLORE COLLECTION',
      isAvailable: true
    },
    {
      subcategoryId: 'capsules',
      title: 'CAPSULES',
      subtitle: 'Precision single-serve ritual.',
      archColor: '#2A1D15', // Espresso Brown
      product: capsuleProduct,
      pouchVariant: 'capsules',
      pouchCustomTitle: capsuleProduct ? capsuleProduct.name.toUpperCase() : 'COFFEE CAPSULES',
      decorativeBadge: 'Single-Serve Pods',
      actionLabel: 'EXPLORE COLLECTION',
      isAvailable: true
    }
  ];

  return (
    <section id="shop-our-collections-section" className="py-10 sm:py-20 bg-[#F4EFEA] border-b border-[#0E0C0B]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Section Header: EXPLORE COFFEE */}
        <div className="flex flex-row items-end justify-between mb-8 sm:mb-14">
          <div className="text-left font-display">
            <div className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.22em] text-[#C88E38] mb-1">
              EXPLORE COFFEE
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0E0C0B] tracking-tight leading-[0.95] uppercase">
              <span className="block">COFFEE</span>
              <span className="block">
                <span className="text-[#C88E38]">COLLECTIONS</span>
              </span>
            </h2>
          </div>

          <button
            onClick={() => {
              if (onViewAllCoffee) onViewAllCoffee();
              else onShopCollection('all');
            }}
            className="inline-flex items-center space-x-1.5 text-xs font-sans font-bold uppercase tracking-[0.16em] text-[#0E0C0B] hover:text-[#C88E38] border-b border-[#0E0C0B] pb-0.5 hover:border-[#C88E38] transition-colors cursor-pointer self-end mb-1"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Distinct Colored Bauhaus Arches with Real, Different Representative Coffee Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-7 items-start">
          {collections.map((item, idx) => {
            return (
              <div
                key={idx}
                onClick={() => onShopCollection(item.subcategoryId)}
                className="group flex flex-col items-center text-center cursor-pointer transition-transform duration-300 hover:-translate-y-2"
                title={`${item.title} — ${item.subtitle}`}
              >
                {/* Colored Arch Stage */}
                <div
                  className="relative w-full aspect-[4/5] rounded-t-full flex items-end justify-center p-3 shadow-md border border-[#0E0C0B]/15 overflow-visible"
                  style={{ backgroundColor: item.archColor }}
                >
                  {/* Subtle Arch Radial Highlight */}
                  <div className="absolute inset-0 rounded-t-full bg-radial from-white/15 to-transparent pointer-events-none" />

                  {/* Real, Distinct Product Pouch Graphic breaking boundaries */}
                  <div className="relative w-[92%] h-[106%] -top-3 sm:-top-4 z-10 flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-105">
                    <TrosePackagingPouch
                      variant={item.pouchVariant}
                      customTitle={item.pouchCustomTitle}
                      className="w-full h-auto filter drop-shadow-[0_16px_22px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_20px_26px_rgba(0,0,0,0.6)] transition-all"
                    />
                  </div>

                  {/* Contextual Miniature Accent at Arch Base */}
                  <div className="absolute -bottom-2.5 inset-x-2 h-7 z-20 flex items-center justify-center">
                    <div className="bg-[#0E0C0B]/90 backdrop-blur-xs px-2.5 py-0.5 border border-[#C88E38]/60 shadow-lg flex items-center space-x-1.5 rounded-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C88E38]" />
                      <span className="text-[8px] font-sans font-bold uppercase tracking-wider text-[#F4EFEA] whitespace-nowrap">
                        {item.decorativeBadge}
                      </span>
                    </div>
                  </div>

                  {/* Base Shadow */}
                  <div className="absolute -bottom-3 inset-x-4 h-4 bg-[#0E0C0B]/40 blur-sm rounded-full z-0" />
                </div>

                {/* Collection Typography & Action Link */}
                <div className="mt-5 space-y-1 font-sans flex flex-col items-center">
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0E0C0B] group-hover:text-[#C88E38] transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#0E0C0B]/70 font-normal">
                    {item.subtitle}
                  </p>
                  
                  {/* Small Action Link: EXPLORE COLLECTION → */}
                  <div className="pt-1.5 inline-flex items-center space-x-1 text-[10px] font-sans font-bold uppercase tracking-[0.16em] text-[#0E0C0B] group-hover:text-[#C88E38] transition-colors">
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
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
