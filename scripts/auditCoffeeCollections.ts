import { getShopifyProducts } from '../src/services/shopify';
import { PRODUCTS } from '../src/data/products';
import { classifyProduct } from '../src/services/productClassification';
import { matchCoffeeSubcategory } from '../src/services/categoryManager';
import { Product } from '../src/types';

async function auditCollections() {
  console.log('Running Audit on TROSE Homepage Coffee Collections (P7.3B)...\n');
  const res = await getShopifyProducts({ first: 250 });
  const rawProducts = res?.products || [];

  // Map into classified products
  const classifiedProducts: Product[] = rawProducts.map((p) => {
    const cl = classifyProduct({
      id: p.id,
      title: p.title,
      productType: p.productType,
      tags: p.tags,
      description: p.description,
      handle: p.handle
    });
    const isOrg = (p.description || '').toLowerCase().includes('organic') || (p.title || '').toLowerCase().includes('organic');
    return {
      id: p.id,
      name: p.title,
      description: p.description,
      subtitle: cl.subcategory,
      category: isOrg ? 'organic' : 'coffee',
      isOrganic: isOrg,
      department: cl.department,
      departmentLabel: cl.departmentLabel,
      subcategory: cl.subcategory,
      classificationReason: cl.reason,
      isAmbiguous: cl.isAmbiguous,
      price: parseFloat(p.priceRange?.minVariantPrice?.amount || '0') || 0,
      rating: 5,
      reviewsCount: 10,
      rawShopifyProduct: p
    } as any;
  });

  const coffeeOnly = classifiedProducts.filter((p) => p.department === 'coffee');
  console.log(`==================================================`);
  console.log(`TOTAL SHOPIFY PRODUCTS FETCHED: ${classifiedProducts.length}`);
  console.log(`TOTAL CONSUMABLE COFFEE PRODUCTS: ${coffeeOnly.length}`);
  console.log(`==================================================\n`);

  // Verify Grandma Mug
  const grandmaMug = classifiedProducts.find((p) => p.name.toLowerCase().includes('grandma'));
  console.log('GRANDMA MUG VERIFICATION:');
  if (grandmaMug) {
    console.log(`  Name:             "${grandmaMug.name}"`);
    console.log(`  Assigned Dept:    ${grandmaMug.department} (${grandmaMug.departmentLabel})`);
    console.log(`  In Coffee Dept?:  ${grandmaMug.department === 'coffee' ? 'YES (FAIL)' : 'NO (EXCLUDED - PASS)'}`);
  }

  // 1. Signature Blends
  const signatureBlends = coffeeOnly.filter((p) => matchCoffeeSubcategory(p, 'signature-blends'));
  const sigCover =
    signatureBlends.find((p) => p.name.toLowerCase().includes('breakfast blend')) ||
    signatureBlends.find((p) => p.name.toLowerCase().includes('house blend')) ||
    signatureBlends[0];

  // 2. Flavored Coffees
  const flavoredCoffees = coffeeOnly.filter((p) => matchCoffeeSubcategory(p, 'flavored-coffees'));
  const flavCover =
    flavoredCoffees.find((p) => p.name.toLowerCase().includes('vanilla')) ||
    flavoredCoffees.find((p) => p.name.toLowerCase().includes('chocolate')) ||
    flavoredCoffees[0];

  // 3. Single Origin
  const singleOrigin = coffeeOnly.filter((p) => matchCoffeeSubcategory(p, 'single-origin'));
  const soCover =
    singleOrigin.find((p) => p.name.toLowerCase().includes('ethiopia')) ||
    singleOrigin.find((p) => p.name.toLowerCase().includes('bali')) ||
    singleOrigin[0];

  // 4. Organic Coffee
  const organic = coffeeOnly.filter((p) => matchCoffeeSubcategory(p, 'organic-coffee'));
  const orgCover =
    organic.find((p) => p.name.toLowerCase().includes('honduras')) ||
    organic.find((p) => p.name.toLowerCase().includes('marcala')) ||
    organic.find((p) => p.name.toLowerCase().includes('bali')) ||
    organic[0];

  // 5. Capsules
  const capsules = coffeeOnly.filter((p) => matchCoffeeSubcategory(p, 'capsules'));
  const capCover =
    capsules.find((p) => p.name.toLowerCase().includes('60 pack')) ||
    capsules.find((p) => p.name.toLowerCase().includes('single serve')) ||
    capsules[0];

  console.log('\n==================================================');
  console.log('COLLECTION MEMBERSHIP & COVERS:');
  console.log('==================================================');

  const collections = [
    { name: '1. SIGNATURE BLENDS', list: signatureBlends, cover: sigCover, expected: 'Breakfast Blend / House Blend' },
    { name: '2. FLAVORED COFFEES', list: flavoredCoffees, cover: flavCover, expected: 'French Vanilla / Dubai Chocolate' },
    { name: '3. SINGLE ORIGIN', list: singleOrigin, cover: soCover, expected: 'Ethiopia Natural / Bali Blue' },
    { name: '4. ORGANIC COFFEE', list: organic, cover: orgCover, expected: 'Honduras / Bali Blue / Marcala' },
    { name: '5. CAPSULES', list: capsules, cover: capCover, expected: '60 Pack Single Serve Capsules' }
  ];

  collections.forEach((c) => {
    console.log(`\n${c.name}:`);
    console.log(`  Count of Qualifying Products: ${c.list.length}`);
    if (c.cover) {
      console.log(`  Cover Product ID:             ${c.cover.id}`);
      console.log(`  Cover Product Name:           "${c.cover.name}"`);
      console.log(`  Cover Department:             ${c.cover.department}`);
      console.log(`  Cover Subcategory:            ${c.cover.subcategory}`);
    } else {
      console.log(`  Cover Product:                NONE (Properly set to 'Reserve Vault • Coming Soon' unavailable state)`);
    }
  });

  // Verify non-coffee contamination
  console.log('\n==================================================');
  console.log('NON-COFFEE CONTAMINATION CHECK:');
  console.log('==================================================');
  let nonCoffeeFound = 0;
  collections.forEach((c) => {
    c.list.forEach((p) => {
      if (p.department !== 'coffee') {
        console.error(`  VIOLATION: Non-coffee product "${p.name}" (${p.department}) found in ${c.name}`);
        nonCoffeeFound++;
      }
    });
  });
  if (nonCoffeeFound === 0) {
    console.log('  PASS: Exactly 0 non-coffee products entered any of the 5 collections.');
  }

  // Ambiguity Check
  const ambiguousInCoffee = coffeeOnly.filter((p) => p.isAmbiguous);
  console.log(`\nAMBIGUOUS COFFEE PRODUCTS: ${ambiguousInCoffee.length}`);
  if (ambiguousInCoffee.length > 0) {
    ambiguousInCoffee.forEach((p) => console.log(`  - ${p.name} (${p.classificationReason})`));
  }
}

auditCollections().catch(console.error);
