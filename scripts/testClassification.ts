import { getShopifyProducts } from '../src/services/shopify';
import { PRODUCTS } from '../src/data/products';

export type PrimaryDepartment = 
  | 'coffee'
  | 'tea'
  | 'mugs-drinkware'
  | 'machines'
  | 'accessories'
  | 'home-lifestyle'
  | 'apparel'
  | 'other';

export interface ClassificationResult {
  department: PrimaryDepartment;
  departmentLabel: string;
  subcategory: string;
  reason: string;
  isAmbiguous?: boolean;
}

export function classifyProduct(p: {
  id: string;
  title: string;
  productType?: string;
  tags?: string[];
  description?: string;
  handle?: string;
}): ClassificationResult {
  const title = (p.title || '').trim();
  const titleL = title.toLowerCase();
  const typeL = (p.productType || '').trim().toLowerCase();
  const tags = (p.tags || []).map((t) => t.toLowerCase().trim());

  // 1. APPAREL CHECK
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
  const isApparelType = apparelTypes.includes(typeL);
  const isApparelTitle = apparelWords.some((w) =>
    new RegExp('(\\b)' + w + '(\\b)', 'i').test(titleL)
  );
  const isApparelTag = tags.some((t) =>
    ['clothing', 'apparel', 'graphic shirt', 'graphic tee', 't-shirt', 'tank top', 'shirt'].includes(t)
  );

  if (isApparelType || isApparelTitle || isApparelTag) {
    let subcategory = 'T-Shirts & Tops';
    if (titleL.includes('tank')) subcategory = 'Tank Tops';
    else if (titleL.includes('socks')) subcategory = 'Socks';
    else if (titleL.includes('hoodie') || titleL.includes('sweatshirt')) subcategory = 'Sweatshirts';
    return {
      department: 'apparel',
      departmentLabel: 'Apparel',
      subcategory,
      reason: isApparelType
        ? `Shopify productType '${p.productType}'`
        : isApparelTitle
        ? 'Title indicates garment/apparel'
        : 'Tagged as apparel/clothing',
    };
  }

  // 2. HOME & LIFESTYLE CHECK
  const isTable =
    titleL.includes('coffee table') ||
    titleL.includes('side table') ||
    titleL.includes('nesting table') ||
    titleL.includes('rattan coffee set') ||
    tags.some((t) => t === 'coffee table' || t === 'table' || t === 'nesting coffee table') ||
    (typeL === 'furniture' && titleL.includes('table')) ||
    (typeL === 'home & garden' && titleL.includes('table'));

  if (isTable) {
    return {
      department: 'home-lifestyle',
      departmentLabel: 'Home & Lifestyle',
      subcategory: 'Coffee Tables & Furniture',
      reason: 'Product is furniture / coffee table',
    };
  }

  const isCandleOrDiffuser =
    typeL.includes('candles') ||
    typeL.includes('diffuser') ||
    tags.some((t) => t.includes('candle') || t.includes('diffuser')) ||
    titleL.includes('scented candle') ||
    titleL.includes('candle');

  if (isCandleOrDiffuser) {
    return {
      department: 'home-lifestyle',
      departmentLabel: 'Home & Lifestyle',
      subcategory: 'Candles & Aromatics',
      reason: 'Product is a scented candle or diffuser',
    };
  }

  const isHomeLiving =
    typeL === 'bathroom' ||
    tags.includes('bath mat') ||
    tags.includes('home decor') ||
    titleL.includes('bath mat');

  if (isHomeLiving) {
    return {
      department: 'home-lifestyle',
      departmentLabel: 'Home & Lifestyle',
      subcategory: 'Home Accents',
      reason: 'Product is home decor / bath mat',
    };
  }

  // 3. MUGS & DRINKWARE CHECK
  const isFilter = titleL.includes('filter') || tags.some((t) => t.includes('filter'));
  const isCaddy = titleL.includes('caddy') || titleL.includes('holder');
  const isPin = titleL.includes('pin') || tags.some((t) => t.includes('pin'));

  const isDrinkwareType = typeL === 'drinkware' || typeL === 'mugs';
  const hasDrinkwareTitle =
    (titleL.includes('water bottle') ||
      titleL.includes('travel mug') ||
      titleL.includes('coffee mug') ||
      titleL.includes('campfire mug') ||
      titleL.includes('insulated cup') ||
      titleL.includes('thermos bottle') ||
      titleL.includes('tumbler') ||
      titleL.includes('flask') ||
      new RegExp('(\\b)(mug|mugs|tumbler|tumblers|cup|cups|flask|flasks|drinkware)(\\b)', 'i').test(titleL)) &&
    !isFilter &&
    !isCaddy &&
    !isPin &&
    !titleL.includes('maker') &&
    !titleL.includes('machine');

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
      titleL.includes('water bottle') ||
      titleL.includes('thermos bottle') ||
      tags.includes('water bottle')
    ) {
      subcategory = 'Water Bottles & Thermoses';
    } else if (
      titleL.includes('tumbler') ||
      titleL.includes('insulated cup') ||
      titleL.includes('travel mug')
    ) {
      subcategory = 'Travel Tumblers & Insulated Cups';
    } else if (titleL.includes('flask')) {
      subcategory = 'Flasks';
    }
    return {
      department: 'mugs-drinkware',
      departmentLabel: 'Mugs & Drinkware',
      subcategory,
      reason: isDrinkwareType
        ? `Shopify productType '${p.productType}'`
        : hasDrinkwareTitle
        ? 'Title specifies mug/cup/water bottle'
        : 'Tagged as drinkware',
    };
  }

  // 4. MACHINES CHECK
  const isElectricMachine =
    titleL.includes('espresso machine') ||
    titleL.includes('espresso maker') ||
    titleL.includes('ice maker') ||
    titleL.includes('ice machine') ||
    titleL.includes('popcorn maker') ||
    titleL.includes('popcorn machine') ||
    titleL.includes('electric juicer') ||
    titleL.includes('water boiler') ||
    titleL.includes('yogurt maker') ||
    (titleL.includes('coffee machine') && !isApparelTitle) ||
    tags.some((t) => ['espresso machine', 'coffee machine', 'ice maker', 'ice maker machine'].includes(t)) ||
    (typeL === 'kitchen' &&
      (titleL.includes('machine') || titleL.includes('maker') || titleL.includes('juicer')) &&
      !titleL.includes('french press'));

  if (isElectricMachine) {
    let subcategory = 'Espresso Machines';
    if (titleL.includes('ice')) subcategory = 'Ice Machines';
    else if (titleL.includes('popcorn') || titleL.includes('yogurt') || titleL.includes('juicer'))
      subcategory = 'Kitchen Appliances';
    else if (titleL.includes('boiler') || titleL.includes('warmer')) subcategory = 'Water Boilers & Kettles';
    return {
      department: 'machines',
      departmentLabel: 'Machines',
      subcategory,
      reason: 'Powered machine / countertop appliance',
    };
  }

  // 5. ACCESSORIES CHECK
  const isAccessory =
    isFilter ||
    isCaddy ||
    isPin ||
    titleL.includes('french press') ||
    titleL.includes('electric mixer') ||
    titleL.includes('frother') ||
    titleL.includes('scale') ||
    titleL.includes('kettle') ||
    titleL.includes('grinder') ||
    titleL.includes('teapot with infuser') ||
    titleL.includes('infuser') ||
    typeL === 'accessories' ||
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
      ].includes(t)
    );

  if (isAccessory) {
    let subcategory = 'Barista Tools & Accessories';
    if (isFilter) subcategory = 'Filters & Brewing Media';
    else if (titleL.includes('french press')) subcategory = 'Manual Brewers & French Presses';
    else if (titleL.includes('kettle')) subcategory = 'Gooseneck Kettles';
    else if (titleL.includes('scale')) subcategory = 'Precision Scales';
    else if (titleL.includes('mixer') || titleL.includes('frother')) subcategory = 'Milk Frothers & Mixers';
    else if (isPin) subcategory = 'Pins & Flair';
    return {
      department: 'accessories',
      departmentLabel: 'Accessories',
      subcategory,
      reason: isFilter ? 'Coffee/tea filter accessory' : 'Brewing accessory / hardware tool',
    };
  }

  // 6. TEA CHECK
  const isConsumableTea =
    (typeL === 'food & beverage' ||
      typeL === 'tea & coffee' ||
      typeL === 'healthcare' ||
      typeL === 'skincare') &&
    (titleL.includes('tea') ||
      titleL.includes('chai') ||
      titleL.includes('darjeeling') ||
      titleL.includes('hibiscus') ||
      titleL.includes('maté') ||
      titleL.includes('moringa') ||
      tags.some((t) =>
        ['tea', 'black tea', 'herbal tea', 'organic tea', 'tea bags', 'loose_leaf_tea', 'chai tea'].includes(t)
      )) &&
    !titleL.includes('teapot') &&
    !titleL.includes('candle') &&
    !titleL.includes('chocolate') &&
    !titleL.includes('soap');

  if (isConsumableTea) {
    let subcategory = 'Herbal & Specialty Tea';
    if (titleL.includes('green') || tags.includes('green tea')) subcategory = 'Green Tea';
    else if (titleL.includes('black') || titleL.includes('darjeeling') || tags.includes('black tea'))
      subcategory = 'Black Tea';
    else if (titleL.includes('chai')) subcategory = 'Chai & Spiced Tea';
    else if (titleL.includes('hibiscus')) subcategory = 'Hibiscus & Botanical Tisanes';
    else if (titleL.includes('moringa')) subcategory = 'Moringa Herbal Infusions';
    return {
      department: 'tea',
      departmentLabel: 'Tea',
      subcategory,
      reason: 'Consumable tea leaves / herbal infusion',
    };
  }

  // 7. COFFEE CHECK
  const isCoffeeTag = tags.some((t) =>
    ['blend', 'flavored', 'single origin', 'sample pack'].includes(t)
  );
  const isExplicitCoffee =
    (typeL === '' || typeL === 'coffee' || typeL === 'coffee beans' || p.id.startsWith('trose-')) &&
    (isCoffeeTag ||
      titleL.includes('blend') ||
      titleL.includes('roast') ||
      titleL.includes('single origin') ||
      titleL.includes('espresso') ||
      titleL.includes('cold brew') ||
      titleL.includes('decaf') ||
      titleL.includes('coffee capsules') ||
      titleL.includes('single serve') ||
      titleL.includes('sample pack') ||
      title === 'Coffee' ||
      titleL.includes('peaberry') ||
      titleL.includes('yirgacheffe') ||
      titleL.includes('marcala') ||
      titleL.includes('cajamarca') ||
      titleL.includes('gayo'));

  if (isExplicitCoffee) {
    let subcategory = 'Signature Blends';
    if (titleL.includes('capsule') || titleL.includes('single serve')) {
      subcategory = 'Capsules / Coffee Pods';
    } else if (titleL.includes('cold brew')) {
      subcategory = 'Cold Brew Coffee';
    } else if (titleL.includes('decaf') || titleL.includes('half caff')) {
      subcategory = 'Decaf / Half Caff';
    } else if (tags.includes('flavored') || titleL.includes('flavored')) {
      subcategory = 'Flavored Coffee';
    } else if (
      tags.includes('single origin') ||
      titleL.includes('single origin') ||
      titleL.includes('favorites sample pack')
    ) {
      subcategory = 'Single Origin';
    } else if (titleL.includes('organic') || tags.includes('organic')) {
      subcategory = 'Organic Coffee';
    } else if (tags.includes('sample pack') || titleL.includes('sample pack') || titleL.includes('flight')) {
      subcategory = 'Sample Packs & Flights';
    }
    return {
      department: 'coffee',
      departmentLabel: 'Coffee',
      subcategory,
      reason: 'Consumable artisan coffee beans / capsules / brew',
    };
  }

  // 8. OTHER / UNCLASSIFIED
  let subcategory = 'Unclassified';
  let reason = 'Uncategorized or ambiguous product';
  if (typeL === 'mobile & laptop accessories' || titleL.includes('nuckees')) {
    subcategory = 'Phone Accessories';
    reason = 'Mobile phone grip accessory';
  } else if (
    tags.includes('chocolate') ||
    titleL.includes('chocolate') ||
    titleL.includes('truffle') ||
    titleL.includes('biscotti') ||
    titleL.includes('snack') ||
    titleL.includes('nutrition bars') ||
    titleL.includes('patties')
  ) {
    subcategory = 'Artisan Snacks & Confections';
    reason = 'Edible confections / snacks (not coffee or tea)';
  } else if (typeL === 'makeup' || tags.includes('pomade') || titleL.includes('pomade')) {
    subcategory = 'Cosmetics';
    reason = 'Cosmetics / brow pomade';
  } else if (typeL === 'bodycare' || titleL.includes('soap')) {
    subcategory = 'Bodycare';
    reason = 'Handmade bath soap';
  } else if (titleL.includes('mask') || tags.includes('face mask')) {
    subcategory = 'Face Masks';
    reason = 'Protective face mask';
  } else if (titleL.includes('sipkit') || titleL.includes('cocktail')) {
    subcategory = 'Cocktail Kits';
    reason = 'Cocktail ingredient kit';
  } else if (titleL.includes('saffron')) {
    subcategory = 'Culinary Spices';
    reason = 'Culinary spice';
  }

  return {
    department: 'other',
    departmentLabel: 'Other / Unclassified',
    subcategory,
    reason,
    isAmbiguous: true,
  };
}

async function run() {
  const prodsRes = await getShopifyProducts({ first: 250 });
  const rawShopify = prodsRes?.products || [];
  console.log('Testing raw Shopify products:', rawShopify.length);

  const deptCounts: Record<string, number> = {};
  const ambiguousProducts: Array<{ id: string; title: string; subcategory: string; reason: string }> = [];

  rawShopify.forEach((p) => {
    const res = classifyProduct(p);
    deptCounts[res.department] = (deptCounts[res.department] || 0) + 1;
    if (res.department === 'other') {
      ambiguousProducts.push({ id: p.id, title: p.title, subcategory: res.subcategory, reason: res.reason });
    }
  });

  console.log('\n=== DEPARTMENT DISTRIBUTION (Shopify 250) ===');
  Object.entries(deptCounts).forEach(([dept, count]) => {
    console.log(`- ${dept.toUpperCase()}: ${count} products`);
  });

  console.log('\n=== OTHER / UNCLASSIFIED BREAKDOWN (' + ambiguousProducts.length + ' products) ===');
  ambiguousProducts.forEach((p) => {
    console.log(`  [${p.id}] ${p.title} -> Subcat: ${p.subcategory} (${p.reason})`);
  });

  // Test the 7 problematic test examples
  const problematicTests = [
    { name: '1. Espresso coffee machine T-shirt', pattern: 'espresso coffee machine t-shirt', expectedDept: 'apparel' },
    { name: '2. Coffee table', pattern: 'coffee table with round glass top', expectedDept: 'home-lifestyle' },
    { name: '3. Espresso coffee maker', pattern: 'espresso coffee maker stainless steel', expectedDept: 'machines' },
    { name: '4. Reusable coffee filter', pattern: 'reusable coffee filter', expectedDept: 'accessories' },
    { name: '5. Moringa green tea', pattern: 'moringa tea, green tea', expectedDept: 'tea' },
    { name: '6. Stainless steel water bottle', pattern: 'stainless steel sport water bottle', expectedDept: 'mugs-drinkware' },
    { name: '7. Actual coffee capsules', pattern: 'single serve coffee capsules', expectedDept: 'coffee' },
  ];

  console.log('\n=== PROBLEMATIC EXAMPLES TEST RESULTS ===');
  let allPassed = true;
  for (const t of problematicTests) {
    const match = rawShopify.find((p) => p.title.toLowerCase().includes(t.pattern.toLowerCase()));
    if (!match) {
      console.error('NOT FOUND:', t.name);
      allPassed = false;
      continue;
    }
    const c = classifyProduct(match);
    const pass = c.department === t.expectedDept;
    if (!pass) allPassed = false;
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${t.name}`);
    console.log(`       Title: "${match.title}"`);
    console.log(`       Assigned Department: ${c.department} (${c.departmentLabel})`);
    console.log(`       Assigned Subcategory: ${c.subcategory}`);
    console.log(`       Reason: ${c.reason}\n`);
  }

  console.log(`All 7 problematic tests passed: ${allPassed}`);
}

run();
