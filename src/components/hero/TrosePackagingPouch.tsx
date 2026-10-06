import React from 'react';

export type TrosePouchVariant =
  | 'breakfast-blend'
  | 'dubai-chocolate'
  | 'single-origin'
  | 'specialty'
  | 'functional'
  | 'organic'
  | 'capsules';

interface TrosePackagingPouchProps {
  variant: TrosePouchVariant;
  customTitle?: string;
  className?: string;
  id?: string;
}

const POUCH_CONFIGS: Record<
  TrosePouchVariant,
  {
    tabColor: string;
    tabTextColor: string;
    tabText: string;
    collectionScript: string;
    title: string;
    subtitle: string;
    roastIndex: number; // 0 to 4 (circle index filled)
    roastLabel: string;
    notes: string;
    ingredients1: string;
    ingredients2: string;
  }
> = {
  'breakfast-blend': {
    tabColor: '#DE9E35',
    tabTextColor: '#12100E',
    tabText: 'FLAVOR',
    collectionScript: 'Signature Collection',
    title: 'BREAKFAST BLEND',
    subtitle: 'FLAVORED COFFEE',
    roastIndex: 2,
    roastLabel: 'Medium Roast',
    notes: 'Notes: Bright  •  Smooth  •  Well-Balanced',
    ingredients1: 'Natural and Artificial Flavorings',
    ingredients2: 'Distributed by Temecula'
  },
  'dubai-chocolate': {
    tabColor: '#12100E',
    tabTextColor: '#FFFFFF',
    tabText: 'FLAVOR',
    collectionScript: 'Signature Collection',
    title: 'DUBAI CHOCOLATE',
    subtitle: 'FLAVORED COFFEE',
    roastIndex: 3,
    roastLabel: 'Medium Dark',
    notes: 'Notes: Rich  •  Decadent  •  Indulgent',
    ingredients1: 'Natural Flavorings',
    ingredients2: 'Distributed by Temecula'
  },
  'single-origin': {
    tabColor: '#162820',
    tabTextColor: '#FFFFFF',
    tabText: 'TERROIR',
    collectionScript: 'Single Origin Reserve',
    title: 'ETHIOPIA NATURAL',
    subtitle: 'HIGH-ALTITUDE HEIRLOOM',
    roastIndex: 1,
    roastLabel: 'Light Roast',
    notes: 'Notes: Bergamot  •  White Peach  •  Jasmine',
    ingredients1: 'Single Origin Whole Bean',
    ingredients2: 'Distributed by Temecula'
  },
  specialty: {
    tabColor: '#142233',
    tabTextColor: '#FFFFFF',
    tabText: 'RESERVE',
    collectionScript: 'Specialty Micro-Lot',
    title: 'GRAND RESERVE',
    subtitle: 'ESTATE RESERVE',
    roastIndex: 2,
    roastLabel: 'Medium Roast',
    notes: 'Notes: Stone Fruit  •  Raw Honey  •  Floral',
    ingredients1: 'Artisan Reserve Lot',
    ingredients2: 'Distributed by Temecula'
  },
  organic: {
    tabColor: '#142233',
    tabTextColor: '#FFFFFF',
    tabText: 'ORGANIC',
    collectionScript: 'Organic Harvest',
    title: 'ORGANIC COFFEE',
    subtitle: 'CERTIFIED ORGANIC HARVEST',
    roastIndex: 2,
    roastLabel: 'Medium Roast',
    notes: 'Notes: Sweet Cane  •  Toffee  •  Clean Finish',
    ingredients1: 'Certified Organic Whole Bean Coffee',
    ingredients2: 'Distributed by Temecula'
  },
  capsules: {
    tabColor: '#2A1D15',
    tabTextColor: '#FFFFFF',
    tabText: 'PODS',
    collectionScript: 'Single-Serve Series',
    title: 'COFFEE CAPSULES',
    subtitle: 'SINGLE-SERVE RITUAL',
    roastIndex: 2,
    roastLabel: 'Medium Roast',
    notes: 'Notes: Balanced  •  Rich Crema  •  Smooth',
    ingredients1: 'Single-Serve Coffee Pods',
    ingredients2: 'Distributed by Temecula'
  },
  functional: {
    tabColor: '#2A1D15',
    tabTextColor: '#FFFFFF',
    tabText: 'VAULT',
    collectionScript: 'Adaptogenic Series',
    title: 'FUNCTIONAL BREW',
    subtitle: 'MUSHROOM & ADAPTOGEN',
    roastIndex: 3,
    roastLabel: 'Medium Dark',
    notes: 'Notes: Lion’s Mane  •  Chaga  •  Dark Cacao',
    ingredients1: 'Functional Mushroom Infusion',
    ingredients2: 'Curated Seasonal Lot'
  }
};

/**
 * Dedicated authentic TROSE packaging pouch asset matching the exact packaging photographs:
 * 1. TROSE Breakfast Blend Flavored Coffee (Gold Tab, Medium Roast)
 * 2. TROSE Dubai Chocolate Flavored Coffee (Black Tab, Medium Dark)
 * 3. Single Origin (Forest Green Tab, Light Roast)
 * 4. Specialty Reserve (Navy Tab, Grade 1)
 * 5. Functional Brew (Espresso Brown Tab, Adaptogen Lot)
 *
 * Preserves exact pouch form, degassing valve, crimp lines, tear notches, gold crown,
 * circular TROSE medallion, attribute matrix (Grind & Roast level), tasting notes,
 * and bottom Temecula Coffee Roasters details.
 */
export const TrosePackagingPouch: React.FC<TrosePackagingPouchProps> = ({
  variant,
  customTitle,
  className = '',
  id
}) => {
  const config = POUCH_CONFIGS[variant] || POUCH_CONFIGS['breakfast-blend'];
  const displayTitle = customTitle || config.title;
  const uniquePrefix = `trose_${variant.replace(/-/g, '_')}_`;

  return (
    <div id={id} className={`relative select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 460 680"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-[0_25px_35px_rgba(18,16,14,0.45)]"
      >
        <defs>
          {/* Natural Kraft Pouch Multi-Stop Gradients */}
          <linearGradient id={`${uniquePrefix}kraftGradient`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A377" />
            <stop offset="6%" stopColor="#DFC39F" />
            <stop offset="25%" stopColor="#E8D1B3" />
            <stop offset="50%" stopColor="#DFC29E" />
            <stop offset="78%" stopColor="#D2B088" />
            <stop offset="94%" stopColor="#C59E72" />
            <stop offset="100%" stopColor="#BA9266" />
          </linearGradient>

          {/* Top Seal Crimp Gradient */}
          <linearGradient id={`${uniquePrefix}crimpGradient`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BA9367" />
            <stop offset="35%" stopColor="#DFC39F" />
            <stop offset="70%" stopColor="#BA9367" />
            <stop offset="100%" stopColor="#A88155" />
          </linearGradient>

          {/* Metallic Gold Ring Gradients for Medallion */}
          <linearGradient id={`${uniquePrefix}goldRing`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A47B2C" />
            <stop offset="15%" stopColor="#E2BD63" />
            <stop offset="30%" stopColor="#FFF2B2" />
            <stop offset="50%" stopColor="#B6882D" />
            <stop offset="70%" stopColor="#F9E28C" />
            <stop offset="85%" stopColor="#CE9E3C" />
            <stop offset="100%" stopColor="#7E5616" />
          </linearGradient>

          {/* Metallic Gold for Crowns */}
          <linearGradient id={`${uniquePrefix}crownGold`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F5DF88" />
            <stop offset="100%" stopColor="#AA821A" />
          </linearGradient>

          {/* Red Coffee Liquid / Rose in Cup */}
          <linearGradient id={`${uniquePrefix}rubyCoffee`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E63946" />
            <stop offset="50%" stopColor="#C1121F" />
            <stop offset="100%" stopColor="#780000" />
          </linearGradient>

          {/* Label Cardstock Background Gradient */}
          <linearGradient id={`${uniquePrefix}labelBg`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D9BE9B" />
            <stop offset="50%" stopColor="#CFB28D" />
            <stop offset="100%" stopColor="#C4A680" />
          </linearGradient>

          {/* Degassing Valve Shading */}
          <radialGradient id={`${uniquePrefix}valveShade`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9C7750" />
            <stop offset="65%" stopColor="#B8946E" />
            <stop offset="100%" stopColor="#DFC39F" />
          </radialGradient>
        </defs>

        {/* Ambient Bottom Floor Contact Shadow */}
        <ellipse cx="230" cy="652" rx="180" ry="18" fill="#12100E" opacity="0.35" filter="blur(10px)" />
        <ellipse cx="230" cy="650" rx="140" ry="10" fill="#0A0807" opacity="0.5" filter="blur(4px)" />

        {/* MAIN KRAFT POUCH SILHOUETTE */}
        <path
          d="
            M 52 42
            C 52 40 54 38 56 38
            L 404 38
            C 406 38 408 40 408 42
            L 412 120
            C 412 128 418 135 418 145
            L 410 610
            C 410 628 398 642 380 644
            C 310 650 150 650 80 644
            C 62 642 50 628 50 610
            L 42 145
            C 42 135 48 128 48 120
            Z
          "
          fill={`url(#${uniquePrefix}kraftGradient)`}
          stroke="#94714B"
          strokeWidth="1.5"
        />

        {/* Highlights & 3D Creases */}
        <path d="M 56 40 L 80 644 L 54 610 L 44 145 Z" fill="#FFFFFF" opacity="0.08" />
        <path d="M 404 40 L 380 644 L 406 610 L 416 145 Z" fill="#000000" opacity="0.12" />

        {/* Top Heat-Sealed Edge Bar (Crimp lines) */}
        <rect x="52" y="38" width="356" height="34" fill={`url(#${uniquePrefix}crimpGradient)`} opacity="0.9" />
        <line x1="52" y1="44" x2="408" y2="44" stroke="#8A673E" strokeWidth="0.8" opacity="0.6" strokeDasharray="3 2" />
        <line x1="52" y1="52" x2="408" y2="52" stroke="#8A673E" strokeWidth="0.8" opacity="0.6" strokeDasharray="3 2" />
        <line x1="52" y1="60" x2="408" y2="60" stroke="#8A673E" strokeWidth="0.8" opacity="0.6" strokeDasharray="3 2" />
        <line x1="52" y1="72" x2="408" y2="72" stroke="#684A28" strokeWidth="1.5" />

        {/* Left & Right Tear Notches */}
        <path d="M 47 88 L 55 92 L 47 96 Z" fill="#75522F" />
        <path d="M 413 88 L 405 92 L 413 96 Z" fill="#75522F" />

        {/* Horizontal Zipper Line */}
        <line x1="50" y1="116" x2="410" y2="116" stroke="#9A754D" strokeWidth="1.2" opacity="0.75" />
        <line x1="50" y1="120" x2="410" y2="120" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.35" />

        {/* Central Degassing Aroma Valve */}
        <g transform="translate(230, 206)">
          <circle cx="0" cy="0" r="11" fill={`url(#${uniquePrefix}valveShade)`} stroke="#7D5B37" strokeWidth="1" />
          <circle cx="0" cy="0" r="8" fill="#B38E68" opacity="0.6" />
          <circle cx="0" cy="0" r="2.2" fill="#5E3F1F" />
          <line x1="-3" y1="0" x2="3" y2="0" stroke="#3D2611" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* ==================================================== */}
        {/* CENTRAL PRODUCT PACKAGING LABEL */}
        {/* ==================================================== */}
        <g transform="translate(100, 238)">
          {/* Label Cardstock Shadow & Border */}
          <rect
            x="0"
            y="0"
            width="260"
            height="378"
            rx="4"
            fill={`url(#${uniquePrefix}labelBg)`}
            stroke="#12100E"
            strokeWidth="1.8"
            className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
          />

          {/* TOP SECTION: Gold Crown with Coffee Bean */}
          <g transform="translate(130, 28) scale(0.95)">
            <path
              d="
                M -16 6
                L -12 -12
                L -5 -3
                L 0 -16
                L 5 -3
                L 12 -12
                L 16 6
                Z
              "
              fill={`url(#${uniquePrefix}crownGold)`}
              stroke="#5A400E"
              strokeWidth="0.8"
            />
            <rect x="-16" y="6" width="32" height="3" rx="1" fill={`url(#${uniquePrefix}crownGold)`} stroke="#5A400E" strokeWidth="0.6" />
            <g transform="translate(0, 16) scale(0.65)">
              <ellipse cx="-2.5" cy="0" rx="3.5" ry="6.5" fill="#12100E" transform="rotate(-15)" />
              <ellipse cx="2.5" cy="0" rx="3.5" ry="6.5" fill="#12100E" transform="rotate(-15)" />
              <path d="M 0 -6 Q -1.5 0 0 6" stroke={`url(#${uniquePrefix}crownGold)`} strokeWidth="1.2" fill="none" transform="rotate(-15)" />
            </g>
          </g>

          {/* ==================================================== */}
          {/* OFFICIAL CIRCULAR TROSE MEDALLION */}
          {/* ==================================================== */}
          <g transform="translate(130, 114)">
            <circle cx="0" cy="0" r="58" fill={`url(#${uniquePrefix}goldRing)`} stroke="#46310C" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="53" fill="none" stroke="#684712" strokeWidth="1" />
            <circle cx="0" cy="0" r="51.5" fill={`url(#${uniquePrefix}goldRing)`} />
            <circle cx="0" cy="0" r="47.5" fill="none" stroke="#3D2908" strokeWidth="1.2" />

            <circle cx="0" cy="0" r="46.5" fill="#12100E" />

            <path id={`${uniquePrefix}arc`} d="M -34 -6 A 34 34 0 0 1 34 -6" fill="none" />
            <text fill="#FFFFFF" fontSize="4.6" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontWeight="700" letterSpacing="1.2">
              <textPath href={`#${uniquePrefix}arc`} startOffset="50%" textAnchor="middle">
                BALANCE WITH BOLDNESS
              </textPath>
            </text>

            <g stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.9">
              <path d="M -4 -16 Q -7 -20 -5 -24" />
              <path d="M 0 -17 Q 2 -22 0 -26" strokeWidth="1.2" />
              <path d="M 4 -16 Q 7 -20 5 -24" />
            </g>

            <g transform="translate(0, -6)">
              <path d="M -15 0 C -15 12 -7 16 0 16 C 7 16 15 12 15 0 Z" fill="#12100E" stroke="#FFFFFF" strokeWidth="1.8" />
              <ellipse cx="0" cy="0" rx="15" ry="4" fill="#12100E" stroke="#FFFFFF" strokeWidth="1.8" />
              <ellipse cx="0" cy="0" rx="11" ry="2.8" fill={`url(#${uniquePrefix}rubyCoffee)`} />
              <circle cx="0" cy="0" r="1.2" fill="#FFE8E8" />
              <path d="M -5 0 Q 0 -1.5 5 0 Q 0 1.5 -5 0" stroke="#FFFFFF" strokeWidth="0.6" fill="none" opacity="0.8" />
              <path d="M 14 2 C 20 3 20 10 13 11" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
              <g transform="translate(0, 9) scale(0.4) rotate(-15)">
                <ellipse cx="-2.5" cy="0" rx="3.5" ry="6.5" fill="#FFFFFF" />
                <ellipse cx="2.5" cy="0" rx="3.5" ry="6.5" fill="#FFFFFF" />
                <path d="M 0 -6 Q -1 0 0 6" stroke="#12100E" strokeWidth="1.5" fill="none" />
              </g>
              <ellipse cx="0" cy="18" rx="19" ry="2.2" fill="#FFFFFF" />
            </g>

            <text
              x="0"
              y="27"
              textAnchor="middle"
              fill="#FFFFFF"
              fontFamily="'Playfair Display', Georgia, serif"
              fontSize="16"
              fontWeight="900"
              letterSpacing="1.8"
            >
              TROSE
            </text>

            <text
              x="0"
              y="37"
              textAnchor="middle"
              fill="#FFFFFF"
              fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
              fontSize="5.2"
              fontWeight="700"
              letterSpacing="2.8"
            >
              COFFEE
            </text>
          </g>

          {/* ==================================================== */}
          {/* TAB & COLLECTION HEADER */}
          {/* ==================================================== */}
          <g transform="translate(10, 182)">
            <rect x="0" y="0" width="240" height="98" fill="#F4EFEA" stroke="#12100E" strokeWidth="1.2" />

            <g>
              <rect
                x="0"
                y="0"
                width="64"
                height="20"
                fill={config.tabColor}
                stroke="#12100E"
                strokeWidth="1.2"
              />
              <text
                x="32"
                y="14"
                textAnchor="middle"
                fill={config.tabTextColor}
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize="8.5"
                fontWeight="800"
                letterSpacing="1.2"
              >
                {config.tabText}
              </text>

              <text
                x="148"
                y="14"
                textAnchor="middle"
                fill="#241B13"
                fontFamily="'Playfair Display', Georgia, serif"
                fontStyle="italic"
                fontSize="10"
                fontWeight="500"
              >
                {config.collectionScript}
              </text>
            </g>

            <line x1="0" y1="20" x2="240" y2="20" stroke="#12100E" strokeWidth="1.2" />

            {/* PRODUCT TITLE */}
            <text
              x="120"
              y="42"
              textAnchor="middle"
              fill="#12100E"
              fontFamily="'Playfair Display', 'Bodoni MT', Georgia, serif"
              fontSize={displayTitle.length > 15 ? '15' : '17'}
              fontWeight="900"
              letterSpacing="0.8"
            >
              {displayTitle}
            </text>

            <text
              x="120"
              y="53"
              textAnchor="middle"
              fill="#12100E"
              fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
              fontSize="7"
              fontWeight="700"
              letterSpacing="2.2"
            >
              {config.subtitle}
            </text>

            <line x1="0" y1="58" x2="240" y2="58" stroke="#12100E" strokeWidth="1.2" />

            {/* ATTRIBUTE MATRIX (GRIND & ROAST LEVEL) */}
            <g transform="translate(0, 58)">
              <line x1="102" y1="0" x2="102" y2="40" stroke="#12100E" strokeWidth="1" />

              {/* GRIND */}
              <g transform="translate(6, 3)">
                <text x="45" y="7" textAnchor="middle" fill="#6A533E" fontSize="5.5" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" letterSpacing="1">
                  GRIND
                </text>
                <rect x="0" y="9" width="90" height="9" fill="#9C6B37" rx="1.5" />
                <circle cx="8" cy="13.5" r="3" fill="#12100E" stroke="#FFFFFF" strokeWidth="1.2" />
                <circle cx="8" cy="13.5" r="1.2" fill="#FFFFFF" />
                <text x="16" y="16.5" fill="#FFFFFF" fontSize="5.8" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700">
                  Whole Bean
                </text>

                <circle cx="8" cy="24" r="2.8" fill="none" stroke="#12100E" strokeWidth="0.8" />
                <text x="16" y="26" fill="#12100E" fontSize="5.5" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600">
                  Ground
                </text>

                <circle cx="8" cy="33" r="2.8" fill="none" stroke="#12100E" strokeWidth="0.8" />
                <text x="16" y="35" fill="#12100E" fontSize="5.5" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600">
                  Espresso
                </text>
              </g>

              {/* ROAST LEVEL */}
              <g transform="translate(108, 3)">
                <text x="63" y="7" textAnchor="middle" fill="#6A533E" fontSize="5.5" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" letterSpacing="1">
                  ROAST LEVEL
                </text>

                <g transform="translate(24, 15)">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <circle
                      key={idx}
                      cx={idx * 16}
                      cy="0"
                      r="4.2"
                      fill={config.roastIndex === idx ? '#12100E' : 'none'}
                      stroke="#12100E"
                      strokeWidth="0.9"
                    />
                  ))}
                </g>

                <text x="63" y="31" textAnchor="middle" fill="#12100E" fontSize="6.5" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600">
                  {config.roastLabel}
                </text>
              </g>
            </g>
          </g>

          {/* TASTING NOTES */}
          <g transform="translate(10, 283)">
            <rect x="0" y="0" width="240" height="15" fill="#E8DEC9" stroke="#12100E" strokeWidth="1" />
            <text x="120" y="10.5" textAnchor="middle" fill="#12100E" fontSize="6.8" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700">
              {config.notes}
            </text>
          </g>

          {/* FOOTER */}
          <g transform="translate(10, 300)">
            <rect x="0" y="0" width="240" height="42" fill="#12100E" />

            <g transform="translate(10, 16)">
              <text fill="#FFFFFF" fontSize="5.2" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" letterSpacing="0.8">
                NET WEIGHT:
              </text>
              <text y="12" fill="#FFFFFF" fontSize="7.2" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800">
                12 OZ (340G)
              </text>
            </g>

            <line x1="78" y1="6" x2="78" y2="36" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.3" />

            <g transform="translate(102, 23) scale(0.65)">
              <path d="M -12 4 L -9 -10 L -4 -2 L 0 -13 L 4 -2 L 9 -10 L 12 4 Z" fill={`url(#${uniquePrefix}crownGold)`} />
              <rect x="-12" y="4" width="24" height="2.5" fill={`url(#${uniquePrefix}crownGold)`} />
            </g>

            <line x1="126" y1="6" x2="126" y2="36" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.3" />

            <g transform="translate(132, 12)">
              <text fill="#FFFFFF" fontSize="4.6" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" letterSpacing="0.4">
                INGREDIENTS: Coffee,
              </text>
              <text y="7" fill="#FFFFFF" fontSize="4.4" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="500">
                {config.ingredients1}
              </text>
              <text y="14" fill="#FFFFFF" fontSize="4.2" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="500" opacity="0.85">
                {config.ingredients2}
              </text>
              <text y="20" fill="#FFFFFF" fontSize="4.2" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="500" opacity="0.85">
                Coffee Roasters, Temecula, CA
              </text>
            </g>
          </g>

          {/* BOTTOM TAGLINE */}
          <g transform="translate(130, 358)">
            <line x1="-80" y1="-3" x2="-48" y2="-3" stroke="#5C452C" strokeWidth="0.6" opacity="0.6" />
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="#3D2B17"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontSize="6"
              fontWeight="800"
              letterSpacing="3"
            >
              RISE. REFRESH. REIGN.
            </text>
            <line x1="48" y1="-3" x2="80" y2="-3" stroke="#5C452C" strokeWidth="0.6" opacity="0.6" />
          </g>
        </g>
      </svg>
    </div>
  );
};
