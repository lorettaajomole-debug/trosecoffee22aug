import React, { useState } from 'react';
import { TrosePackagingPouch } from './TrosePackagingPouch';

interface HeroAdvertisingCompositionProps {
  onPouchClick?: (variant: 'breakfast-blend' | 'dubai-chocolate') => void;
  isMobileCompact?: boolean;
}

/**
 * P7.5B — FINAL TROSE HERO POLISH
 *
 * Polish Corrections:
 * - Product images increased by 15–20% (desktop ~280px / ~270px) while keeping all labels visible.
 * - Moved composition upward to align visually with the main headline.
 * - Removed rectangular brown grounding bar beneath bags.
 * - Replaced heavy dark shadows with subtle, realistic contact shadows.
 * - Preserved rounded gold/ochre (#C88E38) arch and small burgundy (#7A2222) circular geometry.
 * - Preserves exact uploaded image proportions, authentic packaging, and TROSE logos.
 * - Provides dedicated responsive layout for mobile (320px, 375px, 390px, 430px) and desktop (768px, 1440px).
 */
export const HeroAdvertisingComposition: React.FC<HeroAdvertisingCompositionProps> = ({
  onPouchClick,
  isMobileCompact = false
}) => {
  // Graceful fallback to authentic vector packaging if PNGs are not in /public/assets/
  const [bbImgError, setBbImgError] = useState(false);
  const [dcImgError, setDcImgError] = useState(false);

  if (isMobileCompact) {
    // Dedicated Mobile Composition (reduced 25-30% for fast viewport discovery)
    return (
      <div
        id="mobile-hero-product-composition"
        className="relative w-full max-w-[280px] min-[360px]:max-w-[300px] min-[390px]:max-w-[320px] mx-auto h-[185px] min-[360px]:h-[195px] min-[390px]:h-[205px] select-none flex items-end justify-center my-1.5 overflow-visible"
        aria-label="TROSE Breakfast Blend and Dubai Chocolate roasts"
      >
        {/* Soft Rounded Bauhaus Geometry Backdrop */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Main Gold/Ochre Arch */}
          <div
            className="
              relative
              w-[155px] min-[360px]:w-[165px] min-[390px]:w-[175px]
              h-[170px] min-[360px]:h-[180px] min-[390px]:h-[190px]
              rounded-t-full rounded-b-2xl
              shadow-[0_8px_20px_rgba(200,142,56,0.18)]
              overflow-hidden
            "
            style={{
              background: 'linear-gradient(175deg, #DE9E35 0%, #C88E38 48%, #A87123 100%)'
            }}
          >
            {/* Interior radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.25)_0%,transparent_70%)]" />

            {/* Small Burgundy Circular Accent */}
            <div
              className="
                absolute
                -top-2.5 -right-2.5
                w-16 min-[390px]:w-18
                h-16 min-[390px]:h-18
                rounded-full
                bg-[#7A2222]
                opacity-90
                shadow-[0_4px_12px_rgba(122,34,34,0.25)]
              "
              style={{
                background: 'radial-gradient(circle at 35% 35%, #9E2D2D 0%, #7A2222 65%, #521515 100%)'
              }}
            />
          </div>
        </div>

        {/* Two Products (Mobile Proportion & Placement: reduced 25-30%) */}
        <div className="relative w-full h-full flex items-end justify-center pb-1.5 z-20 px-2">
          {/* Product 1: Breakfast Blend (Left / Slightly Forward) */}
          <div
            onClick={() => onPouchClick?.('breakfast-blend')}
            className="
              relative
              -mr-5 min-[390px]:-mr-6
              mb-0.5
              w-[102px] min-[360px]:w-[108px] min-[390px]:w-[114px]
              z-30
              cursor-pointer
              transition-transform duration-200 active:scale-95
            "
            title="TROSE Breakfast Blend — Signature Collection"
          >
            {!bbImgError ? (
              <img
                src="/assets/breakfast-blend.png"
                alt="TROSE Breakfast Blend Flavored Coffee"
                onError={() => setBbImgError(true)}
                className="w-full h-auto object-contain drop-shadow-[0_8px_12px_rgba(14,12,11,0.22)]"
              />
            ) : (
              <TrosePackagingPouch
                variant="breakfast-blend"
                className="w-full filter drop-shadow-[0_8px_12px_rgba(14,12,11,0.22)]"
              />
            )}
            {/* Subtle realistic contact shadow */}
            <div className="absolute -bottom-1 inset-x-2.5 h-1.5 bg-[#12100E]/20 rounded-full blur-xs -z-10" />
          </div>

          {/* Product 2: Dubai Chocolate (Right / Slightly Offset Beside) */}
          <div
            onClick={() => onPouchClick?.('dubai-chocolate')}
            className="
              relative
              mb-4 min-[360px]:mb-4.5 min-[390px]:mb-5
              w-[98px] min-[360px]:w-[104px] min-[390px]:w-[110px]
              z-20
              cursor-pointer
              transition-transform duration-200 active:scale-95
            "
            title="TROSE Dubai Chocolate — Signature Collection"
          >
            {!dcImgError ? (
              <img
                src="/assets/dubai-chocolate.png"
                alt="TROSE Dubai Chocolate Flavored Coffee"
                onError={() => setDcImgError(true)}
                className="w-full h-auto object-contain drop-shadow-[0_6px_10px_rgba(14,12,11,0.18)]"
              />
            ) : (
              <TrosePackagingPouch
                variant="dubai-chocolate"
                className="w-full filter drop-shadow-[0_6px_10px_rgba(14,12,11,0.18)]"
              />
            )}
            {/* Subtle realistic contact shadow */}
            <div className="absolute -bottom-1 inset-x-2.5 h-1.5 bg-[#12100E]/16 rounded-full blur-xs -z-10" />
          </div>
        </div>
      </div>
    );
  }

  // Desktop Composition
  return (
    <div
      id="hero-advertising-composition"
      className="relative w-full max-w-[500px] lg:max-w-[540px] xl:max-w-[580px] mx-auto lg:mx-0 h-[480px] lg:h-[530px] xl:h-[560px] select-none flex items-end justify-center lg:justify-start -mt-2 lg:-mt-6 xl:-mt-8 lg:-ml-8 xl:-ml-10 overflow-visible"
      aria-label="TROSE Specialty Coffee campaign featuring Breakfast Blend and Dubai Chocolate"
    >
      {/* ==================================================== */}
      {/* 1. SOFT ROUNDED GEOMETRY BEHIND PRODUCTS */}
      {/* NO RECTANGULAR PLATFORM BENEATH BAGS */}
      {/* ==================================================== */}
      <div className="absolute inset-0 flex items-start justify-center lg:justify-start pt-2 lg:pt-4 xl:pt-6 pointer-events-none">
        
        {/* Main Large Rounded Gold / Ochre Circular Disc (#C88E38) behind products */}
        <div
          className="
            relative
            w-[340px] sm:w-[390px] lg:w-[420px] xl:w-[440px]
            h-[340px] sm:h-[390px] lg:h-[420px] xl:h-[440px]
            rounded-full
            shadow-[0_16px_36px_rgba(200,142,56,0.18)]
            overflow-hidden
            transition-all duration-700
          "
          style={{
            background: 'linear-gradient(175deg, #DE9E35 0%, #C88E38 48%, #A87123 100%)'
          }}
        >
          {/* Subtle warm interior glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.24)_0%,transparent_70%)]" />
          
          {/* Small Deep Burgundy Circular Accent (#7A2222) inside top-right */}
          <div
            className="
              absolute
              -top-6 -right-6 lg:-top-8 lg:-right-8
              w-36 sm:w-44 lg:w-48 xl:w-52
              h-36 sm:h-44 lg:h-48 xl:h-52
              rounded-full
              bg-[#7A2222]
              opacity-90
              shadow-[0_8px_20px_rgba(122,34,34,0.3)]
            "
            style={{
              background: 'radial-gradient(circle at 35% 35%, #9E2D2D 0%, #7A2222 65%, #521515 100%)'
            }}
          />
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. TWO HERO PRODUCTS (SITTING NATURALLY ON BACKGROUND) */}
      {/* Both TROSE logos and both product titles are 100% visible */}
      {/* Subtle realistic contact shadows directly beneath each pouch */}
      {/* ==================================================== */}
      <div className="relative w-full h-full flex items-end justify-center lg:justify-start pb-4 lg:pb-6 z-20 px-2 lg:pl-4">
        
        {/* PRODUCT 1: BREAKFAST BLEND (LEFT / SLIGHTLY IN FRONT) */}
        <div
          onClick={() => onPouchClick?.('breakfast-blend')}
          className="
            relative
            -mr-10 lg:-mr-14 xl:-mr-16
            mb-3 lg:mb-5
            w-[215px] sm:w-[250px] lg:w-[280px] xl:w-[295px]
            z-30
            cursor-pointer
            group
            transition-all duration-300 ease-out
            hover:scale-[1.03] hover:z-40
          "
          title="TROSE Breakfast Blend — Signature Collection"
          id="hero-pouch-breakfast-blend"
        >
          {/* Subtle warm studio glow on hover */}
          <div className="absolute inset-0 rounded-2xl bg-amber-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

          {!bbImgError ? (
            <img
              src="/assets/breakfast-blend.png"
              alt="TROSE Breakfast Blend Flavored Coffee"
              onError={() => setBbImgError(true)}
              className="w-full h-auto object-contain drop-shadow-[0_12px_20px_rgba(14,12,11,0.22)] transition-transform duration-300"
            />
          ) : (
            <TrosePackagingPouch
              id="svg-pouch-breakfast-blend"
              variant="breakfast-blend"
              className="w-full filter drop-shadow-[0_12px_20px_rgba(14,12,11,0.22)]"
            />
          )}

          {/* Subtle realistic contact shadow beneath Breakfast Blend */}
          <div className="absolute -bottom-2 inset-x-6 h-2.5 bg-[#12100E]/16 rounded-full blur-xs -z-10" />
        </div>

        {/* PRODUCT 2: DUBAI CHOCOLATE (RIGHT / SLIGHTLY HIGHER BESIDE) */}
        <div
          onClick={() => onPouchClick?.('dubai-chocolate')}
          className="
            relative
            mb-12 sm:mb-16 lg:mb-20 xl:mb-22
            w-[205px] sm:w-[240px] lg:w-[270px] xl:w-[285px]
            z-20
            cursor-pointer
            group
            transition-all duration-300 ease-out
            hover:scale-[1.03] hover:z-40
          "
          title="TROSE Dubai Chocolate — Signature Collection"
          id="hero-pouch-dubai-chocolate"
        >
          {/* Subtle warm studio glow on hover */}
          <div className="absolute inset-0 rounded-2xl bg-amber-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

          {!dcImgError ? (
            <img
              src="/assets/dubai-chocolate.png"
              alt="TROSE Dubai Chocolate Flavored Coffee"
              onError={() => setDcImgError(true)}
              className="w-full h-auto object-contain drop-shadow-[0_10px_18px_rgba(14,12,11,0.2)] transition-transform duration-300"
            />
          ) : (
            <TrosePackagingPouch
              id="svg-pouch-dubai-chocolate"
              variant="dubai-chocolate"
              className="w-full filter drop-shadow-[0_10px_18px_rgba(14,12,11,0.2)]"
            />
          )}

          {/* Subtle realistic contact shadow beneath Dubai Chocolate */}
          <div className="absolute -bottom-2 inset-x-6 h-2.5 bg-[#12100E]/14 rounded-full blur-xs -z-10" />
        </div>

      </div>

    </div>
  );
};
