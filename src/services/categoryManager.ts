import { Product, ProductCategory, PrimaryDepartment } from '../types';
import {
  isCoffeeProduct as isCoffeeDept,
  isTeaProduct as isTeaDept,
  isMugDrinkwareProduct as isMugDept,
  isMachineProduct as isMachineDept,
  isAccessoryProduct as isAccessoryDept,
  isHomeLifestyleProduct as isHomeDept,
  isApparelProduct as isApparelDept,
  isOtherProduct as isOtherDept,
  DEPARTMENT_DEFINITIONS,
  TROSE_DEPARTMENT_ORDER,
  isStorefrontEligibleProduct,
} from './productClassification';

export interface CategoryInfo {
  id: 'coffee' | 'tea' | 'mugs' | 'machines' | 'accessories' | 'home-lifestyle' | 'apparel' | 'clothing' | 'candles' | 'other';
  label: string;
  navLabel: string;
  badge?: string;
  description: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string;
  productCount: number;
}

export type CoffeeSubcategory =
  | 'all'
  | 'signature-blends'
  | 'flavored-coffees'
  | 'single-origin'
  | 'organic-coffee'
  | 'capsules'
  | 'functional-coffee';

export interface CoffeeSubcategoryOption {
  id: CoffeeSubcategory;
  label: string;
  count: number;
}

/**
 * Checks whether a product belongs to the COFFEE primary department.
 * STRICT: Only consumable coffee beans, grounds, capsules, or cold brew.
 * Excludes: T-shirts, tables, machines, mugs, filters, water bottles, candles, accessories.
 */
export function isCoffeeProduct(p: Product): boolean {
  if (p.department) {
    return p.department === 'coffee';
  }
  return isCoffeeDept(p);
}

/**
 * Checks whether a product belongs to TEA primary department.
 * STRICT: Only consumable tea leaves, tisanes, chai, or moringa infusions.
 * Excludes: Drinkware, flasks, bottles, mugs, teapots, and accessories.
 */
export function isTeaBeverageProduct(p: Product): boolean {
  if (p.department) {
    return p.department === 'tea';
  }
  return isTeaDept(p);
}

/**
 * Checks whether a product belongs to MUGS & DRINKWARE primary department.
 * Ceramic mugs, tumblers, insulated cups, water bottles, and flasks.
 */
export function isMugDrinkwareProduct(p: Product): boolean {
  if (p.department) {
    return p.department === 'mugs-drinkware';
  }
  return isMugDept(p);
}

/**
 * Checks whether a product belongs to MACHINES primary department.
 * Powered countertop appliances, espresso machines, ice machines, and electric boilers.
 */
export function isMachineProduct(p: Product): boolean {
  if (p.department) {
    return p.department === 'machines';
  }
  return isMachineDept(p);
}

/**
 * Checks whether a product belongs to ACCESSORIES primary department.
 * Manual brewers, filters, precision scales, variable kettles, frothers, and barista tools.
 */
export function isAccessoryProduct(p: Product): boolean {
  if (p.department) {
    return p.department === 'accessories';
  }
  return isAccessoryDept(p);
}

/**
 * Checks whether a product belongs to HOME & LIFESTYLE primary department.
 * Coffee tables, accent furniture, scented candles, diffusers, and bath mats.
 */
export function isHomeLifestyleProduct(p: Product): boolean {
  if (p.department) {
    return p.department === 'home-lifestyle';
  }
  return isHomeDept(p);
}

/**
 * Checks whether a product belongs to APPAREL primary department.
 * T-shirts, graphic shirts, tank tops, hoodies, socks, and garments.
 */
export function isClothingProduct(p: Product): boolean {
  if (p.department) {
    return p.department === 'apparel';
  }
  return isApparelDept(p);
}

/**
 * Checks whether a product is an artisan candle (Home & Lifestyle subcategory).
 */
export function isCandleProduct(p: Product): boolean {
  return (
    p.department === 'home-lifestyle' &&
    (p.subcategory === 'Candles & Aromatics' || p.category === 'candles')
  );
}

/**
 * Checks whether a product belongs to OTHER / UNCLASSIFIED primary department.
 */
export function isOtherProduct(p: Product): boolean {
  if (p.department) {
    return p.department === 'other';
  }
  return isOtherDept(p);
}

/**
 * Filters products strictly by primary department or category view ID.
 */
export function getProductsForCategory(
  products: Product[],
  category: 'coffee' | 'tea' | 'mugs' | 'machines' | 'accessories' | 'home-lifestyle' | 'apparel' | 'clothing' | 'candles' | 'other' | 'all' | string
): Product[] {
  const eligible = products.filter(isStorefrontEligibleProduct);
  switch (category) {
    case 'coffee':
      return eligible.filter(isCoffeeProduct);
    case 'tea':
      return eligible.filter(isTeaBeverageProduct);
    case 'mugs':
    case 'mugs-drinkware':
      return eligible.filter(isMugDrinkwareProduct);
    case 'machines':
      return eligible.filter(isMachineProduct);
    case 'accessories':
      return eligible.filter(isAccessoryProduct);
    case 'home-lifestyle':
      return eligible.filter(isHomeLifestyleProduct);
    case 'clothing':
    case 'apparel':
      return eligible.filter(isClothingProduct);
    case 'candles':
      return eligible.filter(isCandleProduct);
    case 'other':
      return eligible.filter(isOtherProduct);
    case 'all':
    default:
      return eligible;
  }
}

/**
 * Maps a consumable coffee product into subcategories strictly based on live catalog attributes.
 *
 * CRITICAL TAXONOMY RULES:
 * 1. Canonical taxonomy: Signature Blends, Flavored Coffees, Single Origin, Organic Coffee, Capsules
 * 2. Department classification must happen before coffee-subcategory classification:
 *    A product classified as Apparel, Tea, Mug/Drinkware, Machine, Accessory, Home & Living or
 *    another non-coffee department can NEVER appear in a coffee collection.
 * 3. Never classify products by vague keyword matching alone.
 * 4. Do not use "Specialty" as a catch-all collection.
 * 5. Only include Functional Coffee if actual Shopify products are confidently classified as functional coffee.
 */
export function matchCoffeeSubcategory(product: Product, subcategory: CoffeeSubcategory): boolean {
  // Strict guard 1: Department MUST be coffee
  if (product.department && product.department !== 'coffee') {
    return false;
  }
  // Strict guard 2: Product must pass coffee predicate
  if (!isCoffeeProduct(product)) {
    return false;
  }
  // Strict guard 3: Storefront eligibility (excludes invalid/placeholder non-sellable records)
  if (!isStorefrontEligibleProduct(product)) {
    return false;
  }

  if (subcategory === 'all') return true;

  const sub = product.subcategory || '';
  const nameLower = product.name.toLowerCase();
  const descLower = (product.description || '').toLowerCase();
  const tagsLower = (product.rawShopifyProduct?.tags || []).map((t) => t.toLowerCase());

  const isSamplePack =
    tagsLower.includes('sample pack') ||
    nameLower.includes('sample pack') ||
    nameLower.includes('flight');

  // 1. Capsules (Single-serve coffee pods)
  const isCapsule =
    sub === 'Capsules' ||
    tagsLower.includes('capsule') ||
    tagsLower.includes('pod') ||
    tagsLower.includes('single serve') ||
    nameLower.includes('capsule') ||
    nameLower.includes('single serve') ||
    nameLower.includes('coffee pods');

  // 2. Flavored Coffees (Dubai Chocolate, French Vanilla, Hazelnut, etc.)
  const isFlavored =
    !isCapsule &&
    (sub === 'Flavored Coffees' ||
      tagsLower.includes('flavored') ||
      nameLower.includes('vanilla') ||
      nameLower.includes('hazelnut') ||
      nameLower.includes('chocolate') ||
      nameLower.includes('caramel') ||
      nameLower.includes('cinnamon') ||
      nameLower.includes('pumpkin') ||
      nameLower.includes('mocha') ||
      nameLower.includes('candy cane') ||
      nameLower.includes('mint') ||
      nameLower.includes('cinnabun') ||
      nameLower.includes('turtle'));

  // 3. Organic Coffee (Certified or explicit organic harvest)
  // Rule: Sample packs do NOT inherit Organic Coffee unless the entire pack is explicitly verified as organic
  const isOrganic =
    !isCapsule &&
    (isSamplePack
      ? (nameLower.includes('organic') || tagsLower.includes('organic') || descLower.includes('100% organic') || descLower.includes('all organic'))
      : (sub === 'Organic Coffee' ||
          Boolean(product.isOrganic) ||
          product.category === 'organic' ||
          tagsLower.includes('organic') ||
          nameLower.includes('organic') ||
          descLower.includes('certified organic') ||
          descLower.includes('organic methods') ||
          descLower.includes('usda organic')));

  // 4. Single Origin (Actual single-origin coffee products)
  // Rule: Best Sellers Sample Pack is a variety blend pack, not single origin
  const isSingleOrigin =
    !isCapsule &&
    !isFlavored &&
    !nameLower.includes('best sellers sample pack') &&
    (sub === 'Single Origin' ||
      tagsLower.includes('single origin') ||
      (!nameLower.includes('blend') &&
        !isSamplePack &&
        (Boolean(product.origin || product.country) ||
          [
            'ethiopia',
            'colombia',
            'bali',
            'honduras',
            'costa rica',
            'guatemala',
            'peru',
            'mexico',
            'tanzania',
            'nicaragua',
            'papua',
            'brazil',
            'kenya',
            'sumatra',
            'rwanda',
          ].some((c) => nameLower.includes(c)))) ||
      (isSamplePack && (nameLower.includes('single origin') || nameLower.includes('favorites sample pack'))));

  // 5. Signature Blends (House Blend, Breakfast Blend, 6 Bean Blend and genuine core blends)
  // Rule: Generic "Coffee" placeholder with subcategory 'Uncategorized Coffee' must NOT match Signature Blends
  const isSignatureBlend =
    !isCapsule &&
    !isFlavored &&
    sub !== 'Uncategorized Coffee' &&
    nameLower.trim() !== 'coffee' &&
    (sub === 'Signature Blends' ||
      tagsLower.includes('blend') ||
      nameLower.includes('blend') ||
      nameLower.includes('house') ||
      nameLower.includes('breakfast') ||
      nameLower.includes('espresso') ||
      nameLower.includes('roast') ||
      nameLower.includes('blonde') ||
      nameLower.includes('donut') ||
      nameLower.includes('cowboy') ||
      nameLower.includes('best sellers sample pack') ||
      (!isSingleOrigin && !isOrganic && !nameLower.includes('favorites sample pack')));

  // 6. Functional Coffee (Only if genuine consumable functional coffee, never tea or mugs)
  const isFunctional =
    !isCapsule &&
    product.department === 'coffee' &&
    (sub === 'Functional Coffee' ||
      tagsLower.includes('functional coffee') ||
      nameLower.includes('functional coffee') ||
      (tagsLower.includes('mushroom') && nameLower.includes('coffee')));

  switch (subcategory) {
    case 'capsules':
      return isCapsule;

    case 'flavored-coffees':
      return isFlavored;

    case 'organic-coffee':
      return isOrganic;

    case 'single-origin':
      return isSingleOrigin;

    case 'signature-blends':
      return isSignatureBlend;

    case 'functional-coffee':
      return isFunctional;

    default:
      return true;
  }
}

/**
 * Returns available subcategories for Coffee that actually contain qualifying products.
 * Establishes one canonical coffee taxonomy across the entire site:
 * 1. Signature Blends
 * 2. Flavored Coffees
 * 3. Single Origin
 * 4. Organic Coffee
 * 5. Capsules
 * Only includes Functional Coffee as an additional category if actual Shopify products
 * are confidently classified as functional coffee.
 */
export function getAvailableCoffeeSubcategories(coffeeProducts: Product[]): CoffeeSubcategoryOption[] {
  const definitions: { id: CoffeeSubcategory; label: string }[] = [
    { id: 'all', label: 'All Coffee' },
    { id: 'signature-blends', label: 'Signature Blends' },
    { id: 'flavored-coffees', label: 'Flavored Coffees' },
    { id: 'single-origin', label: 'Single Origin' },
    { id: 'organic-coffee', label: 'Organic Coffee' },
    { id: 'capsules', label: 'Capsules' },
  ];

  // Only check Functional Coffee if there are actual functional coffees
  const functionalCount = coffeeProducts.filter((p) => matchCoffeeSubcategory(p, 'functional-coffee')).length;
  if (functionalCount > 0) {
    definitions.push({ id: 'functional-coffee', label: 'Functional Coffee' });
  }

  return definitions
    .map((def) => {
      if (def.id === 'all') {
        return { ...def, count: coffeeProducts.filter(isStorefrontEligibleProduct).length };
      }
      const count = coffeeProducts.filter((p) => matchCoffeeSubcategory(p, def.id)).length;
      return { ...def, count };
    })
    .filter((def) => def.count > 0);
}

/**
 * Returns non-empty departments available in the current catalog in strict brand priority order:
 * 1. COFFEE
 * 2. TEA
 * 3. MUGS & DRINKWARE
 * 4. MACHINES
 * 5. ACCESSORIES
 * 6. HOME & LIFESTYLE
 * 7. APPAREL
 * 8. OTHER / UNCLASSIFIED
 */
export function getAvailableCategories(products: Product[]): CategoryInfo[] {
  const eligible = products.filter(isStorefrontEligibleProduct);
  const coffeeCount = eligible.filter(isCoffeeProduct).length;
  const teaCount = eligible.filter(isTeaBeverageProduct).length;
  const mugsCount = eligible.filter(isMugDrinkwareProduct).length;
  const machinesCount = eligible.filter(isMachineProduct).length;
  const accessoriesCount = eligible.filter(isAccessoryProduct).length;
  const homeCount = eligible.filter(isHomeLifestyleProduct).length;
  const apparelCount = eligible.filter(isClothingProduct).length;
  const otherCount = eligible.filter(isOtherProduct).length;

  const result: CategoryInfo[] = [];

  // 1. COFFEE (Primary)
  if (coffeeCount > 0) {
    result.push({
      id: 'coffee',
      label: DEPARTMENT_DEFINITIONS.coffee.label,
      navLabel: DEPARTMENT_DEFINITIONS.coffee.navLabel,
      badge: DEPARTMENT_DEFINITIONS.coffee.badge,
      description: DEPARTMENT_DEFINITIONS.coffee.description,
      heroHeadline: DEPARTMENT_DEFINITIONS.coffee.heroHeadline,
      heroSubheadline: DEPARTMENT_DEFINITIONS.coffee.heroSubheadline,
      heroImage: DEPARTMENT_DEFINITIONS.coffee.heroImage,
      productCount: coffeeCount,
    });
  }

  // 2. TEA
  if (teaCount > 0) {
    result.push({
      id: 'tea',
      label: DEPARTMENT_DEFINITIONS.tea.label,
      navLabel: DEPARTMENT_DEFINITIONS.tea.navLabel,
      description: DEPARTMENT_DEFINITIONS.tea.description,
      heroHeadline: DEPARTMENT_DEFINITIONS.tea.heroHeadline,
      heroSubheadline: DEPARTMENT_DEFINITIONS.tea.heroSubheadline,
      heroImage: DEPARTMENT_DEFINITIONS.tea.heroImage,
      productCount: teaCount,
    });
  }

  // 3. MUGS & DRINKWARE
  if (mugsCount > 0) {
    result.push({
      id: 'mugs',
      label: DEPARTMENT_DEFINITIONS['mugs-drinkware'].label,
      navLabel: DEPARTMENT_DEFINITIONS['mugs-drinkware'].navLabel,
      description: DEPARTMENT_DEFINITIONS['mugs-drinkware'].description,
      heroHeadline: DEPARTMENT_DEFINITIONS['mugs-drinkware'].heroHeadline,
      heroSubheadline: DEPARTMENT_DEFINITIONS['mugs-drinkware'].heroSubheadline,
      heroImage: DEPARTMENT_DEFINITIONS['mugs-drinkware'].heroImage,
      productCount: mugsCount,
    });
  }

  // 4. MACHINES
  if (machinesCount > 0) {
    result.push({
      id: 'machines',
      label: DEPARTMENT_DEFINITIONS.machines.label,
      navLabel: DEPARTMENT_DEFINITIONS.machines.navLabel,
      description: DEPARTMENT_DEFINITIONS.machines.description,
      heroHeadline: DEPARTMENT_DEFINITIONS.machines.heroHeadline,
      heroSubheadline: DEPARTMENT_DEFINITIONS.machines.heroSubheadline,
      heroImage: DEPARTMENT_DEFINITIONS.machines.heroImage,
      productCount: machinesCount,
    });
  }

  // 5. ACCESSORIES
  if (accessoriesCount > 0) {
    result.push({
      id: 'accessories',
      label: DEPARTMENT_DEFINITIONS.accessories.label,
      navLabel: DEPARTMENT_DEFINITIONS.accessories.navLabel,
      description: DEPARTMENT_DEFINITIONS.accessories.description,
      heroHeadline: DEPARTMENT_DEFINITIONS.accessories.heroHeadline,
      heroSubheadline: DEPARTMENT_DEFINITIONS.accessories.heroSubheadline,
      heroImage: DEPARTMENT_DEFINITIONS.accessories.heroImage,
      productCount: accessoriesCount,
    });
  }

  // 6. HOME & LIFESTYLE
  if (homeCount > 0) {
    result.push({
      id: 'home-lifestyle',
      label: DEPARTMENT_DEFINITIONS['home-lifestyle'].label,
      navLabel: DEPARTMENT_DEFINITIONS['home-lifestyle'].navLabel,
      description: DEPARTMENT_DEFINITIONS['home-lifestyle'].description,
      heroHeadline: DEPARTMENT_DEFINITIONS['home-lifestyle'].heroHeadline,
      heroSubheadline: DEPARTMENT_DEFINITIONS['home-lifestyle'].heroSubheadline,
      heroImage: DEPARTMENT_DEFINITIONS['home-lifestyle'].heroImage,
      productCount: homeCount,
    });
  }

  // 7. APPAREL
  if (apparelCount > 0) {
    result.push({
      id: 'apparel',
      label: DEPARTMENT_DEFINITIONS.apparel.label,
      navLabel: DEPARTMENT_DEFINITIONS.apparel.navLabel,
      description: DEPARTMENT_DEFINITIONS.apparel.description,
      heroHeadline: DEPARTMENT_DEFINITIONS.apparel.heroHeadline,
      heroSubheadline: DEPARTMENT_DEFINITIONS.apparel.heroSubheadline,
      heroImage: DEPARTMENT_DEFINITIONS.apparel.heroImage,
      productCount: apparelCount,
    });
  }

  // 8. OTHER / UNCLASSIFIED
  if (otherCount > 0) {
    result.push({
      id: 'other',
      label: DEPARTMENT_DEFINITIONS.other.label,
      navLabel: DEPARTMENT_DEFINITIONS.other.navLabel,
      description: DEPARTMENT_DEFINITIONS.other.description,
      heroHeadline: DEPARTMENT_DEFINITIONS.other.heroHeadline,
      heroSubheadline: DEPARTMENT_DEFINITIONS.other.heroSubheadline,
      heroImage: DEPARTMENT_DEFINITIONS.other.heroImage,
      productCount: otherCount,
    });
  }

  return result;
}
