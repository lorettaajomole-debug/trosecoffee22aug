/**
 * TROSE Product Classification Engine
 *
 * Centralized, deterministic classification module that establishes 8 mutually exclusive
 * primary storefront departments across all Shopify and catalog products:
 * 1. COFFEE (Consumable coffee only: blends, single origins, flavored, organic, capsules, cold brew, decaf)
 * 2. TEA (Consumable tea only: loose leaf, tea bags, tisanes, matcha, chai, herbal infusions)
 * 3. MUGS & DRINKWARE (Vessels: ceramic mugs, insulated tumblers, water bottles, travel flasks)
 * 4. MACHINES (Powered countertop appliances: espresso machines, ice makers, electric boilers, appliances)
 * 5. ACCESSORIES (Barista gear, filters, manual french presses, kettles, scales, frothers, pins)
 * 6. HOME & LIFESTYLE (Coffee tables, furniture, scented candles, diffusers, bath mats)
 * 7. APPAREL (T-shirts, shirts, tank tops, hoodies, socks, garments)
 * 8. OTHER / UNCLASSIFIED (Artisan confections, chocolates, phone grips, cosmetics, masks, cocktails)
 *
 * Strict Rules:
 * - Mutually exclusive: Every product belongs to exactly ONE primary storefront department.
 * - Product identity is evaluated before broad keywords (e.g. "coffee", "machine", "tea", "espresso").
 * - Consumable Coffee contains NO t-shirts, tables, machines, mugs, filters, water bottles, or candles.
 * - Consumable Tea contains NO drinkware, teapots, bottles, mugs, or accessories.
 * - Deterministic whole-word matching and explicit exclusion rules prevent broad substring errors.
 */

import { Product, ProductCategory, PrimaryDepartment } from '../types';

export interface ClassificationResult {
  department: PrimaryDepartment;
  departmentLabel: string;
  subcategory: string;
  reason: string;
  isAmbiguous?: boolean;
}

export interface DepartmentDefinition {
  id: PrimaryDepartment;
  label: string;
  navLabel: string;
  badge?: string;
  description: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string;
  subcategories: string[];
}

export const DEPARTMENT_DEFINITIONS: Record<PrimaryDepartment, DepartmentDefinition> = {
  coffee: {
    id: 'coffee',
    label: 'Coffee',
    navLabel: 'COFFEE',
    badge: 'Core Ritual',
    description: 'Consumable whole-bean coffees, single-origin lots, master blends, and single-serve capsules.',
    heroHeadline: 'COFFEE FOR EVERY VERSION OF YOU.',
    heroSubheadline: 'Different moods. Different moments. Same exceptional coffee.',
    heroImage: 'https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=1200&q=85',
    subcategories: [
      'Signature Blends',
      'Flavored Coffees',
      'Single Origin',
      'Organic Coffee',
      'Capsules',
    ],
  },
  tea: {
    id: 'tea',
    label: 'Tea & Botanical Tisanes',
    navLabel: 'TEA',
    description: 'Consumable artisan whole leaf teas, single-estate cascara elixirs, moringa infusions, and rare tisanes.',
    heroHeadline: 'BOTANICAL PURITY IN EVERY SIP.',
    heroSubheadline: 'Restorative organic teas, whole leaf Darjeelings, spiced chai, and botanical infusions.',
    heroImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=85',
    subcategories: [
      'Green Tea',
      'Black Tea',
      'Chai & Spiced Tea',
      'Hibiscus & Botanical Tisanes',
      'Moringa Herbal Infusions',
      'Herbal & Specialty Tea',
    ],
  },
  'mugs-drinkware': {
    id: 'mugs-drinkware',
    label: 'Mugs & Drinkware',
    navLabel: 'MUGS & DRINKWARE',
    description: 'Tactile stoneware cupping tumblers, vacuum-insulated flasks, stainless steel water bottles, and studio mugs.',
    heroHeadline: 'VESSELS DESIGNED FOR THE RITUAL.',
    heroSubheadline: 'Handcrafted stoneware, double-wall ceramic mugs, and vacuum-sealed water bottles and flasks.',
    heroImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85',
    subcategories: [
      'Ceramic Mugs',
      'Water Bottles & Thermoses',
      'Travel Tumblers & Insulated Cups',
      'Flasks & Cupping Vessels',
    ],
  },
  machines: {
    id: 'machines',
    label: 'Machinery & Equipment',
    navLabel: 'MACHINES',
    description: 'Precision dual-boiler espresso machines, countertop appliances, commercial ice machines, and electric boilers.',
    heroHeadline: 'POWERED PRECISION EXTRACTION.',
    heroSubheadline: 'Engineered espresso machinery and countertop kitchen systems built for peak performance.',
    heroImage: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=1200&q=85',
    subcategories: [
      'Espresso Machines',
      'Ice Machines',
      'Kitchen Appliances',
      'Water Boilers & Kettles',
    ],
  },
  accessories: {
    id: 'accessories',
    label: 'Brew Gear & Accessories',
    navLabel: 'ACCESSORIES',
    description: 'Precision smart scales, reusable coffee filters, variable gooseneck kettles, milk frothers, and barista essentials.',
    heroHeadline: 'PRECISION GEAR FOR MASTER BREWERS.',
    heroSubheadline: 'Engineered manual extraction tools, smart timers, reusable filters, and barista essentials.',
    heroImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85',
    subcategories: [
      'Filters & Brewing Media',
      'Manual Brewers & French Presses',
      'Gooseneck Kettles',
      'Precision Scales',
      'Milk Frothers & Mixers',
      'Barista Tools & Accessories',
      'Pins & Flair',
    ],
  },
  'home-lifestyle': {
    id: 'home-lifestyle',
    label: 'Home & Lifestyle',
    navLabel: 'HOME & LIFESTYLE',
    description: 'Handcrafted salon coffee tables, architectural nesting tables, botanical candles, and luxury home accents.',
    heroHeadline: 'LIVING SPACES ELEVATED.',
    heroSubheadline: 'Handcrafted marble & wood coffee tables, roasted coffee candles, and architectural home accents.',
    heroImage: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=85',
    subcategories: [
      'Coffee Tables & Furniture',
      'Candles & Aromatics',
      'Home Accents',
    ],
  },
  apparel: {
    id: 'apparel',
    label: 'Apparel & Garments',
    navLabel: 'APPAREL',
    description: 'Heavyweight organic cotton graphic tees, racerback tank tops, barista hoodies, and casual goods.',
    heroHeadline: 'WEAR THE RITUAL.',
    heroSubheadline: 'Tailored silhouettes, heavyweight cotton, and bespoke TROSE graphic expressions.',
    heroImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
    subcategories: [
      'T-Shirts & Tops',
      'Tank Tops',
      'Sweatshirts & Hoodies',
      'Socks & Goods',
    ],
  },
  other: {
    id: 'other',
    label: 'Other / Curated Collections',
    navLabel: 'OTHER',
    description: 'Artisan single-estate chocolates, confectionery pairings, phone accessories, and curated pantry specials.',
    heroHeadline: 'CURATED SPECIALTY COLLECTIONS.',
    heroSubheadline: 'Artisan chocolate pairings, specialty cocktail kits, and curated lifestyle additions.',
    heroImage: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=85',
    subcategories: [
      'Artisan Snacks & Confections',
      'Phone Accessories',
      'Personal Care & Cosmetics',
      'Cocktail Kits',
      'Face Masks',
      'Culinary Spices',
      'Unclassified',
    ],
  },
};

/**
 * Merchandising priority rank:
 * 1. Coffee (Primary)
 * 2. Tea
 * 3. Mugs & Drinkware
 * 4. Machines
 * 5. Accessories
 * 6. Home & Lifestyle
 * 7. Apparel
 * 8. Other / Unclassified
 */
export const TROSE_DEPARTMENT_ORDER: Record<PrimaryDepartment, number> = {
  coffee: 1,
  tea: 2,
  'mugs-drinkware': 3,
  machines: 4,
  accessories: 5,
  'home-lifestyle': 6,
  apparel: 7,
  other: 8,
};

/**
 * Deterministic helper to match whole words/phrases inside text
 */
function containsWholeWord(text: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'i');
  return regex.test(text);
}

/**
 * Central deterministic product classification function.
 * Evaluates product identity before broad keywords to ensure 100% mutually exclusive
 * assignment into one of the 8 primary storefront departments.
 */
export function classifyProduct(productInput: {
  id: string;
  title: string;
  productType?: string;
  tags?: string[];
  description?: string;
  handle?: string;
}): ClassificationResult {
  const title = (productInput.title || '').trim();
  const titleLower = title.toLowerCase();
  const rawType = (productInput.productType || '').trim();
  const typeLower = rawType.toLowerCase();
  const tags = (productInput.tags || []).map((t) => t.toLowerCase().trim());
  const descLower = (productInput.description || '').toLowerCase();

  // =========================================================================
  // 1. APPAREL CHECK (Highest Identity Priority)
  // Catches: T-shirts, graphic shirts, tank tops, clothing, hoodies, socks
  // Resolves: "Espresso coffee machine t-shirt" -> APPAREL (never coffee or machine)
  // =========================================================================
  const apparelTypes = [
    't-shirts',
    'tank tops',
    "women's clothing",
    'apparel',
    'clothing',
    'hoodies',
    'sweatshirts',
  ];
  const apparelWords = [
    't-shirt',
    'tshirt',
    't-shirts',
    'tshirts',
    'tank top',
    'racerback',
    'shirt',
    'tee',
    'hoodie',
    'sweatshirt',
    'socks',
  ];

  const isApparelType = apparelTypes.includes(typeLower);
  const isApparelTitle = apparelWords.some((w) => containsWholeWord(titleLower, w));
  const isApparelTag = tags.some((t) =>
    ['clothing', 'apparel', 'graphic shirt', 'graphic tee', 't-shirt', 'tank top', 'shirt'].includes(t)
  );

  if (isApparelType || isApparelTitle || isApparelTag) {
    let subcategory = 'T-Shirts & Tops';
    if (titleLower.includes('tank')) subcategory = 'Tank Tops';
    else if (titleLower.includes('socks')) subcategory = 'Socks & Goods';
    else if (titleLower.includes('hoodie') || titleLower.includes('sweatshirt')) subcategory = 'Sweatshirts & Hoodies';

    return {
      department: 'apparel',
      departmentLabel: 'Apparel',
      subcategory,
      reason: isApparelType
        ? `Shopify productType '${rawType}'`
        : isApparelTitle
        ? 'Title indicates apparel / garment'
        : 'Tagged as apparel/clothing',
    };
  }

  // =========================================================================
  // 2. HOME & LIFESTYLE CHECK
  // Catches: Coffee tables, side tables, nesting furniture, candles, bath mats
  // Resolves: "Coffee Table with Round Glass Top High Gloss Gray" -> HOME & LIFESTYLE (never coffee)
  // =========================================================================
  const isTable =
    titleLower.includes('coffee table') ||
    titleLower.includes('side table') ||
    titleLower.includes('nesting table') ||
    titleLower.includes('pedestal table') ||
    titleLower.includes('travertine table') ||
    titleLower.includes('rattan coffee set') ||
    tags.some((t) => t === 'coffee table' || t === 'table' || t === 'nesting coffee table') ||
    (typeLower === 'furniture' && titleLower.includes('table')) ||
    (typeLower === 'home & garden' && titleLower.includes('table'));

  if (isTable) {
    return {
      department: 'home-lifestyle',
      departmentLabel: 'Home & Lifestyle',
      subcategory: 'Coffee Tables & Furniture',
      reason: 'Product is furniture / coffee table',
    };
  }

  const isCandleOrDiffuser =
    typeLower.includes('candles') ||
    typeLower.includes('diffuser') ||
    tags.some((t) => t.includes('candle') || t.includes('diffuser')) ||
    titleLower.includes('scented candle') ||
    containsWholeWord(titleLower, 'candle') ||
    containsWholeWord(titleLower, 'candles');

  if (isCandleOrDiffuser) {
    return {
      department: 'home-lifestyle',
      departmentLabel: 'Home & Lifestyle',
      subcategory: 'Candles & Aromatics',
      reason: 'Product is a scented candle or diffuser',
    };
  }

  const isHomeLiving =
    typeLower === 'bathroom' ||
    tags.includes('bath mat') ||
    tags.includes('home decor') ||
    titleLower.includes('bath mat') ||
    containsWholeWord(titleLower, 'rug') ||
    containsWholeWord(titleLower, 'rugs');

  if (isHomeLiving) {
    return {
      department: 'home-lifestyle',
      departmentLabel: 'Home & Lifestyle',
      subcategory: 'Home Accents',
      reason: 'Product is home decor / bath mat',
    };
  }

  // =========================================================================
  // 3. MUGS & DRINKWARE CHECK
  // Catches: Ceramic mugs, travel mugs, insulated cups, tumblers, water bottles, flasks
  // Resolves: "Stainless steel sport water bottle" -> MUGS & DRINKWARE
  // Resolves: "Pumpkin spice coffee handle lid water bottle" -> MUGS & DRINKWARE (never coffee)
  // Explicitly excludes: filters, caddies, brewing equipment, machines
  // =========================================================================
  const isFilter = titleLower.includes('filter') || tags.some((t) => t.includes('filter'));
  const isCaddy = titleLower.includes('caddy') || titleLower.includes('holder');
  const isPin = containsWholeWord(titleLower, 'pin') || containsWholeWord(titleLower, 'pins') || tags.some((t) => t === 'pin' || t === 'pins' || t === 'enamel pin' || t === 'lapel pin');

  const isDrinkwareType = typeLower === 'drinkware' || typeLower === 'mugs' || typeLower === 'mugs-flasks' || typeLower === 'mugs-drinkware';
  const hasDrinkwareTitle =
    (titleLower.includes('water bottle') ||
      titleLower.includes('travel mug') ||
      titleLower.includes('coffee mug') ||
      titleLower.includes('campfire mug') ||
      titleLower.includes('insulated cup') ||
      titleLower.includes('thermos bottle') ||
      titleLower.includes('tumbler') ||
      titleLower.includes('cupping tumbler') ||
      titleLower.includes('tasting cup') ||
      titleLower.includes('nomad flask') ||
      titleLower.includes('travel flask') ||
      titleLower.includes('studio mug') ||
      containsWholeWord(titleLower, 'mug') ||
      containsWholeWord(titleLower, 'mugs') ||
      containsWholeWord(titleLower, 'tumbler') ||
      containsWholeWord(titleLower, 'tumblers') ||
      containsWholeWord(titleLower, 'cup') ||
      containsWholeWord(titleLower, 'cups') ||
      containsWholeWord(titleLower, 'flask') ||
      containsWholeWord(titleLower, 'flasks') ||
      containsWholeWord(titleLower, 'drinkware')) &&
    !isFilter &&
    !isCaddy &&
    !isPin &&
    !titleLower.includes('maker') &&
    !titleLower.includes('machine');

  const hasDrinkwareTag =
    tags.some((t) =>
      [
        'coffee mug',
        'mug',
        'mugs',
        'travel mug',
        'water bottle',
        'water bottles',
        'stainless steel water bottle',
        'tumbler',
        'cup',
        'campfire_mug',
        'campfire mug',
        'drinkware',
      ].includes(t)
    ) &&
    !isFilter &&
    !isCaddy &&
    !isPin;

  if (isDrinkwareType || hasDrinkwareTitle || hasDrinkwareTag) {
    let subcategory = 'Ceramic Mugs';
    if (
      titleLower.includes('water bottle') ||
      titleLower.includes('thermos bottle') ||
      tags.includes('water bottle') ||
      tags.includes('water bottles') ||
      tags.includes('stainless steel water bottle')
    ) {
      subcategory = 'Water Bottles & Thermoses';
    } else if (
      titleLower.includes('tumbler') ||
      titleLower.includes('insulated cup') ||
      titleLower.includes('travel mug') ||
      tags.includes('travel mug')
    ) {
      subcategory = 'Travel Tumblers & Insulated Cups';
    } else if (titleLower.includes('flask') || titleLower.includes('cupping')) {
      subcategory = 'Flasks & Cupping Vessels';
    }

    return {
      department: 'mugs-drinkware',
      departmentLabel: 'Mugs & Drinkware',
      subcategory,
      reason: isDrinkwareType
        ? `Shopify productType '${rawType}'`
        : hasDrinkwareTitle
        ? 'Title specifies mug / cup / water bottle vessel'
        : 'Tagged as drinkware vessel',
    };
  }

  // =========================================================================
  // 4. MACHINES CHECK (Powered & Countertop Electrical Appliances)
  // Catches: Espresso machines, ice makers, popcorn machines, electric juicers, water boilers
  // Resolves: "Espresso Coffee Maker Stainless Steel Italian Coffee Machine" -> MACHINES
  // Resolves: "1350W 20 Bar Espresso Machine With safety valve" -> MACHINES
  // Excludes: Manual french press coffee makers (which go to ACCESSORIES)
  // =========================================================================
  const isElectricMachine =
    titleLower.includes('espresso machine') ||
    titleLower.includes('espresso maker') ||
    titleLower.includes('ice maker') ||
    titleLower.includes('ice machine') ||
    titleLower.includes('popcorn maker') ||
    titleLower.includes('popcorn machine') ||
    titleLower.includes('electric juicer') ||
    titleLower.includes('water boiler') ||
    titleLower.includes('yogurt maker') ||
    titleLower.includes('precision grinder') ||
    (titleLower.includes('coffee machine') && !isApparelTitle) ||
    tags.some((t) =>
      ['espresso machine', 'coffee machine', 'ice maker', 'ice maker machine', 'coffee machines'].includes(t)
    ) ||
    (typeLower === 'kitchen' &&
      (titleLower.includes('machine') || titleLower.includes('maker') || titleLower.includes('juicer')) &&
      !titleLower.includes('french press'));

  if (isElectricMachine) {
    let subcategory = 'Espresso Machines';
    if (titleLower.includes('ice')) subcategory = 'Ice Machines';
    else if (
      titleLower.includes('popcorn') ||
      titleLower.includes('yogurt') ||
      titleLower.includes('juicer')
    ) {
      subcategory = 'Kitchen Appliances';
    } else if (titleLower.includes('boiler') || titleLower.includes('warmer')) {
      subcategory = 'Water Boilers & Kettles';
    }

    return {
      department: 'machines',
      departmentLabel: 'Machines',
      subcategory,
      reason: 'Powered machine / countertop electrical appliance',
    };
  }

  // =========================================================================
  // 5. ACCESSORIES CHECK
  // Catches: Filters, manual french presses, kettles, scales, frothers, infusers, pins
  // Resolves: "Reusable coffee filter" / "3pcs Reusable Coffee Filter Pod with Spoon" -> ACCESSORIES
  // Resolves: "Mini Electric Mixer Milk Drink Coffee" -> ACCESSORIES
  // Resolves: "Camellios Teapot With Infuser" -> ACCESSORIES
  // =========================================================================
  const isAccessory =
    isFilter ||
    isCaddy ||
    isPin ||
    titleLower.includes('french press') ||
    titleLower.includes('electric mixer') ||
    titleLower.includes('frother') ||
    containsWholeWord(titleLower, 'scale') ||
    containsWholeWord(titleLower, 'scales') ||
    containsWholeWord(titleLower, 'kettle') ||
    containsWholeWord(titleLower, 'kettles') ||
    containsWholeWord(titleLower, 'grinder') ||
    containsWholeWord(titleLower, 'grinders') ||
    titleLower.includes('teapot with infuser') ||
    containsWholeWord(titleLower, 'infuser') ||
    containsWholeWord(titleLower, 'infusers') ||
    typeLower === 'accessories' ||
    tags.some((t) =>
      [
        'filter',
        'coffee filter',
        'french press',
        'reusable coffee filter',
        'pin',
        'kettle',
        'scale',
        'teapot',
        'teaware',
        'tools',
      ].includes(t)
    );

  if (isAccessory) {
    let subcategory = 'Barista Tools & Accessories';
    if (isFilter) subcategory = 'Filters & Brewing Media';
    else if (titleLower.includes('french press')) subcategory = 'Manual Brewers & French Presses';
    else if (titleLower.includes('kettle')) subcategory = 'Gooseneck Kettles';
    else if (titleLower.includes('scale')) subcategory = 'Precision Scales';
    else if (titleLower.includes('mixer') || titleLower.includes('frother')) subcategory = 'Milk Frothers & Mixers';
    else if (isPin) subcategory = 'Pins & Flair';

    return {
      department: 'accessories',
      departmentLabel: 'Accessories',
      subcategory,
      reason: isFilter ? 'Coffee/tea filter accessory' : 'Brewing accessory / hardware tool',
    };
  }

  // =========================================================================
  // 6. TEA CHECK (Consumable Tea ONLY)
  // Catches: Moringa tea, black tea, green tea, Darjeeling, herbal tea, chai, tisane
  // Resolves: "Miracle Tree's Organic Moringa Tea, Green Tea" -> TEA
  // Excludes: Teapots, infusers, drinkware, mugs, chocolates, candles, soaps
  // =========================================================================
  const isTeaFoodType =
    typeLower === 'food & beverage' ||
    typeLower === 'tea & coffee' ||
    typeLower === 'healthcare' ||
    typeLower === 'skincare';

  const hasTeaKeyword =
    containsWholeWord(titleLower, 'tea') ||
    containsWholeWord(titleLower, 'teas') ||
    titleLower.includes('tea bag') ||
    titleLower.includes('teabag') ||
    titleLower.includes('chai') ||
    titleLower.includes('darjeeling') ||
    titleLower.includes('hibiscus') ||
    titleLower.includes('maté') ||
    titleLower.includes('yerba mate') ||
    titleLower.includes('moringa') ||
    titleLower.includes('tisane') ||
    titleLower.includes('loose leaf') ||
    titleLower.includes('cascara') ||
    tags.some((t) =>
      [
        'tea',
        'black tea',
        'herbal tea',
        'organic tea',
        'tea bags',
        'loose_leaf_tea',
        'chai tea',
        'tisane',
        'moringa tea',
      ].includes(t) || t.startsWith('tea/')
    );

  const isConsumableTea =
    isTeaFoodType &&
    hasTeaKeyword &&
    !titleLower.includes('teapot') &&
    !titleLower.includes('candle') &&
    !titleLower.includes('chocolate') &&
    !titleLower.includes('soap');

  if (isConsumableTea) {
    let subcategory = 'Herbal & Specialty Tea';
    if (titleLower.includes('green') || tags.includes('green tea')) subcategory = 'Green Tea';
    else if (
      titleLower.includes('black') ||
      titleLower.includes('darjeeling') ||
      tags.includes('black tea') ||
      tags.includes('tea/black tea/darjeeling tea')
    ) {
      subcategory = 'Black Tea';
    } else if (titleLower.includes('chai') || tags.includes('chai tea')) subcategory = 'Chai & Spiced Tea';
    else if (titleLower.includes('hibiscus') || tags.some((t) => t.includes('hibiscus'))) {
      subcategory = 'Hibiscus & Botanical Tisanes';
    } else if (titleLower.includes('moringa') || tags.includes('moringa tea')) {
      subcategory = 'Moringa Herbal Infusions';
    }

    return {
      department: 'tea',
      departmentLabel: 'Tea',
      subcategory,
      reason: 'Consumable tea leaves / botanical herbal infusion',
    };
  }

  // =========================================================================
  // 7. OTHER NON-COFFEE MERCHANDISE CHECK (Department classification before coffee)
  // Catches: Chocolates, snacks, biscotti, cantucci, confections, phone accessories,
  //          cosmetics, soaps, masks, sipkits, culinary spices.
  // Explicitly ensures edible non-coffee food and pantry items NEVER become coffee!
  // =========================================================================
  const isSnackOrConfection =
    typeLower === 'snacks' ||
    tags.includes('chocolate') ||
    tags.includes('snacks') ||
    titleLower.includes('chocolate bar') ||
    titleLower.includes('truffle') ||
    titleLower.includes('biscotti') ||
    titleLower.includes('cantucci') ||
    containsWholeWord(titleLower, 'snack') ||
    containsWholeWord(titleLower, 'snacks') ||
    titleLower.includes('nutrition bars') ||
    titleLower.includes('honey patties') ||
    titleLower.includes('sweetpotato') ||
    titleLower.includes('papadum') ||
    titleLower.includes('pairing chocolate') ||
    (typeLower === 'food & beverage' && (titleLower.includes('chocolate') || titleLower.includes('saffron') || titleLower.includes('almond') || titleLower.includes('lentil') || titleLower.includes('pretzel')));

  const isPhoneAccessory =
    typeLower === 'mobile & laptop accessories' ||
    titleLower.includes('nuckees') ||
    tags.includes('nuckees');

  const isPersonalCare =
    typeLower === 'bodycare' ||
    typeLower === 'makeup' ||
    typeLower === 'skincare' && !hasTeaKeyword ||
    containsWholeWord(titleLower, 'soap') ||
    containsWholeWord(titleLower, 'soaps') ||
    titleLower.includes('pomade') ||
    tags.includes('soap') ||
    tags.includes('pomade');

  const isFaceMask =
    titleLower.includes('face mask') ||
    containsWholeWord(titleLower, 'mask') ||
    containsWholeWord(titleLower, 'masks') ||
    tags.includes('face mask') ||
    tags.includes('mask');

  const isCocktailKit =
    titleLower.includes('sipkit') ||
    titleLower.includes('cocktail') ||
    tags.includes('cocktail') ||
    tags.includes('sipkit');

  const isSpice =
    titleLower.includes('saffron') ||
    tags.includes('saffron');

  if (isSnackOrConfection || isPhoneAccessory || isPersonalCare || isFaceMask || isCocktailKit || isSpice) {
    let subcategory = 'Artisan Snacks & Confections';
    let reason = 'Edible confections / artisan snacks (not coffee or tea)';

    if (isPhoneAccessory) {
      subcategory = 'Phone Accessories';
      reason = 'Mobile phone grip accessory';
    } else if (isPersonalCare) {
      subcategory = 'Personal Care & Cosmetics';
      reason = 'Cosmetics / personal care';
    } else if (isFaceMask) {
      subcategory = 'Face Masks';
      reason = 'Protective face mask';
    } else if (isCocktailKit) {
      subcategory = 'Cocktail Kits';
      reason = 'Cocktail ingredient kit';
    } else if (isSpice) {
      subcategory = 'Culinary Spices';
      reason = 'Culinary spice';
    }

    return {
      department: 'other',
      departmentLabel: 'Other / Curated',
      subcategory,
      reason,
      isAmbiguous: false,
    };
  }

  // =========================================================================
  // 8. COFFEE CHECK (Consumable Coffee ONLY)
  // Evaluates strictly AFTER all other departments have claimed their products.
  // Canonical Coffee Taxonomy:
  // - Signature Blends
  // - Flavored Coffees
  // - Single Origin
  // - Organic Coffee
  // - Capsules
  // Strictly Excludes: mugs, drinkware, tea, apparel, tables, machines, accessories, snacks
  // =========================================================================
  const isExplicitNonCoffee =
    typeLower === 'snacks' ||
    typeLower === 'tables' ||
    typeLower === 'machines' ||
    typeLower === 'accessories' ||
    typeLower === 'clothing' ||
    typeLower === 'apparel' ||
    typeLower === 'candles' ||
    typeLower === 'mugs-flasks' ||
    typeLower === 'mugs-drinkware' ||
    titleLower.includes('cantucci') ||
    titleLower.includes('biscotti') ||
    containsWholeWord(titleLower, 'table') ||
    containsWholeWord(titleLower, 'tables') ||
    containsWholeWord(titleLower, 'mug') ||
    containsWholeWord(titleLower, 'mugs') ||
    containsWholeWord(titleLower, 'cup') ||
    containsWholeWord(titleLower, 'cups') ||
    titleLower.includes('water bottle') ||
    containsWholeWord(titleLower, 'tumbler') ||
    containsWholeWord(titleLower, 'tumblers') ||
    containsWholeWord(titleLower, 'shirt') ||
    containsWholeWord(titleLower, 'shirts') ||
    containsWholeWord(titleLower, 'tee') ||
    containsWholeWord(titleLower, 'tees') ||
    titleLower.includes('tank top') ||
    containsWholeWord(titleLower, 'scale') ||
    containsWholeWord(titleLower, 'scales') ||
    containsWholeWord(titleLower, 'kettle') ||
    containsWholeWord(titleLower, 'kettles') ||
    containsWholeWord(titleLower, 'candle') ||
    containsWholeWord(titleLower, 'candles') ||
    containsWholeWord(titleLower, 'tea') ||
    containsWholeWord(titleLower, 'teas') ||
    titleLower.includes('tea bag') ||
    titleLower.includes('teabag');

  const isCoffeeTag = tags.some((t) =>
    ['blend', 'flavored', 'single origin', 'sample pack'].includes(t)
  );

  const isCoffeeNameOrType =
    !isExplicitNonCoffee &&
    (typeLower === '' || typeLower === 'coffee' || typeLower === 'coffee beans' || productInput.id.startsWith('trose-')) &&
    (isCoffeeTag ||
      titleLower.includes('blend') ||
      titleLower.includes('roast') ||
      titleLower.includes('single origin') ||
      titleLower.includes('single-origin') ||
      titleLower.includes('espresso') ||
      titleLower.includes('cold brew') ||
      titleLower.includes('decaf') ||
      titleLower.includes('coffee capsules') ||
      titleLower.includes('single serve') ||
      titleLower.includes('sample pack') ||
      title === 'Coffee' ||
      titleLower.includes('peaberry') ||
      titleLower.includes('yirgacheffe') ||
      titleLower.includes('marcala') ||
      titleLower.includes('cajamarca') ||
      titleLower.includes('gayo') ||
      titleLower.includes('antigua') ||
      titleLower.includes('kenya aa') ||
      titleLower.includes('bourbon'));

  if (isCoffeeNameOrType) {
    // 1. Generic placeholder product check:
    // If titled "Coffee" with no tags and generic description, do NOT assume Signature Blends
    if (
      titleLower.trim() === 'coffee' &&
      tags.length === 0 &&
      (typeLower === '' || typeLower === 'coffee') &&
      (descLower.trim() === 'coffee products' || descLower.trim() === '' || descLower.includes('coffee products'))
    ) {
      return {
        department: 'coffee',
        departmentLabel: 'Coffee',
        subcategory: 'Uncategorized Coffee',
        reason: 'Generic placeholder product with insufficient category metadata',
      };
    }

    // Canonical subcategories:
    // - Capsules
    // - Flavored Coffees
    // - Organic Coffee
    // - Single Origin
    // - Signature Blends
    let subcategory = 'Signature Blends';

    const isCapsule =
      titleLower.includes('capsule') ||
      titleLower.includes('single serve') ||
      tags.includes('capsule') ||
      tags.includes('pod');

    const isFlavored =
      tags.includes('flavored') ||
      titleLower.includes('flavored') ||
      titleLower.includes('vanilla') ||
      titleLower.includes('hazelnut') ||
      titleLower.includes('chocolate') ||
      titleLower.includes('caramel') ||
      titleLower.includes('cinnamon') ||
      titleLower.includes('pumpkin') ||
      titleLower.includes('mocha') ||
      titleLower.includes('candy cane') ||
      titleLower.includes('mint') ||
      titleLower.includes('cinnabun') ||
      titleLower.includes('turtle');

    const isSamplePack =
      tags.includes('sample pack') ||
      titleLower.includes('sample pack') ||
      titleLower.includes('flight');

    // Rule: Sample packs do NOT inherit Organic Coffee unless the entire pack is explicitly verified as organic
    const isOrganic = isSamplePack
      ? (titleLower.includes('organic') || tags.includes('organic') || descLower.includes('100% organic') || descLower.includes('all organic'))
      : (titleLower.includes('organic') || tags.includes('organic') || descLower.includes('certified organic'));

    // Best Sellers Sample Pack is a variety blend pack, not single origin
    const isSingleOrigin =
      !titleLower.includes('best sellers sample pack') &&
      (tags.includes('single origin') ||
        titleLower.includes('single origin') ||
        titleLower.includes('single-origin') ||
        titleLower.includes('favorites sample pack') ||
        titleLower.includes('yirgacheffe') ||
        titleLower.includes('antigua') ||
        titleLower.includes('kenya aa') ||
        titleLower.includes('bali') ||
        titleLower.includes('colombia') ||
        titleLower.includes('brazil') ||
        titleLower.includes('costa rica') ||
        titleLower.includes('honduras') ||
        titleLower.includes('peru') ||
        titleLower.includes('mexico') ||
        titleLower.includes('nicaragua') ||
        titleLower.includes('papua') ||
        titleLower.includes('guatemala') ||
        titleLower.includes('tanzania'));

    if (isCapsule) {
      subcategory = 'Capsules';
    } else if (isFlavored) {
      subcategory = 'Flavored Coffees';
    } else if (isOrganic) {
      subcategory = 'Organic Coffee';
    } else if (isSingleOrigin) {
      subcategory = 'Single Origin';
    } else {
      subcategory = 'Signature Blends';
    }

    return {
      department: 'coffee',
      departmentLabel: 'Coffee',
      subcategory,
      reason: 'Consumable artisan coffee beans / capsules / brew',
    };
  }

  // =========================================================================
  // 9. UNCLASSIFIED / OTHER FALLBACK (Never default to Coffee!)
  // =========================================================================
  return {
    department: 'other',
    departmentLabel: 'Other / Unclassified',
    subcategory: 'Unclassified',
    reason: 'Uncategorized or ambiguous product',
    isAmbiguous: true,
  };
}

// =========================================================================
// PREDICATES FOR MUTUALLY EXCLUSIVE DEPARTMENTS
// =========================================================================

export function isCoffeeProduct(p: Product): boolean {
  return p.department === 'coffee';
}

export function isTeaProduct(p: Product): boolean {
  return p.department === 'tea';
}

export function isMugDrinkwareProduct(p: Product): boolean {
  return p.department === 'mugs-drinkware';
}

export function isMachineProduct(p: Product): boolean {
  return p.department === 'machines';
}

export function isAccessoryProduct(p: Product): boolean {
  return p.department === 'accessories';
}

export function isHomeLifestyleProduct(p: Product): boolean {
  return p.department === 'home-lifestyle';
}

export function isApparelProduct(p: Product): boolean {
  return p.department === 'apparel';
}

export function isOtherProduct(p: Product): boolean {
  return p.department === 'other';
}

export function getDepartmentLabel(dept: PrimaryDepartment): string {
  return DEPARTMENT_DEFINITIONS[dept]?.label || 'Specialty Item';
}

/**
 * Safe storefront merchandising eligibility predicate.
 * Excludes incomplete, empty, or placeholder Shopify records (such as the un-sellable
 * placeholder "Coffee" with $0.00 price, no images, empty tags, and 'Uncategorized Coffee' subcategory).
 *
 * Rules:
 * - Does NOT simply hide every $0 product globally unless there is clear evidence of an invalid placeholder.
 * - Evaluates combination of incomplete product data / placeholder status and non-sellable merchandising eligibility.
 * - Preserves all 49 legitimate sellable coffee products.
 */
export function isStorefrontEligibleProduct(product: Product): boolean {
  if (!product) return false;

  const title = (product.name || '').trim().toLowerCase();
  const subcategory = product.subcategory || '';
  const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || '0'));
  const hasImages = Array.isArray(product.images) && product.images.length > 0;
  const rawTags = product.rawShopifyProduct?.tags || [];
  const desc = (product.description || '').trim().toLowerCase();
  const handle = (product.handle || '').trim().toLowerCase();

  // Incomplete placeholder check (e.g. placeholder "Coffee" with $0 price, no images, or uncategorized status)
  const isPlaceholderIdentity =
    (title === 'coffee' && (handle === 'coffee' || desc === 'coffee products' || rawTags.length === 0)) ||
    subcategory === 'Uncategorized Coffee';

  if (isPlaceholderIdentity && (price <= 0 || !hasImages)) {
    return false;
  }

  // Safety check for incomplete/empty records missing title, or zero price with no imagery and no metadata
  if (!product.name || product.name.trim() === '') {
    return false;
  }

  if (price <= 0 && !hasImages && rawTags.length === 0) {
    return false;
  }

  return true;
}
