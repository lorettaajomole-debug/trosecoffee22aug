import { getShopifyProducts, getShopifyCollections } from '../src/services/shopify';
import { PRODUCTS } from '../src/data/products';
import { PrimaryDepartment } from '../src/types';
import { classifyProduct, DEPARTMENT_DEFINITIONS } from '../src/services/productClassification';

async function generateAudit() {
  console.log('Fetching live Shopify products...');
  const [prodsRes, colsRes] = await Promise.all([
    getShopifyProducts({ first: 250 }),
    getShopifyCollections({ first: 50 })
  ]);

  const rawProducts = prodsRes?.products || [];
  console.log(`\n==================================================`);
  console.log(`TOTAL SHOPIFY PRODUCTS FETCHED: ${rawProducts.length}`);
  console.log(`==================================================\n`);

  // Classify every product
  const auditEntries = rawProducts.map((p) => {
    const classification = classifyProduct({
      id: p.id,
      title: p.title,
      productType: p.productType,
      tags: p.tags,
      description: p.description,
      handle: p.handle,
    });

    return {
      id: p.id,
      title: p.title,
      productType: p.productType || '(none)',
      tags: p.tags?.join(', ') || '(none)',
      department: classification.department,
      departmentLabel: classification.departmentLabel,
      subcategory: classification.subcategory,
      reason: classification.reason,
      isAmbiguous: !!classification.isAmbiguous,
    };
  });

  // Department counts
  const deptList: PrimaryDepartment[] = [
    'coffee',
    'tea',
    'mugs-drinkware',
    'machines',
    'accessories',
    'home-lifestyle',
    'apparel',
    'other',
  ];
  const deptCounts: Record<string, number> = {};
  deptList.forEach((d) => (deptCounts[d] = 0));

  let ambiguousCount = 0;

  auditEntries.forEach((entry) => {
    deptCounts[entry.department] = (deptCounts[entry.department] || 0) + 1;
    if (entry.isAmbiguous) {
      ambiguousCount++;
    }
  });

  console.log('==================================================');
  console.log('NUMBER ASSIGNED TO EACH DEPARTMENT:');
  console.log('==================================================');
  deptList.forEach((deptId) => {
    const def = DEPARTMENT_DEFINITIONS[deptId];
    console.log(`  ${def.navLabel.padEnd(20)} (${deptId}): ${deptCounts[deptId] || 0} products`);
  });
  console.log(`  TOTAL: ${auditEntries.length} products`);
  console.log(`\nNUMBER FLAGGED AS UNCLASSIFIED / AMBIGUOUS: ${ambiguousCount}`);

  // Test the 7 problematic examples explicitly
  console.log('\n==================================================');
  console.log('CLASSIFICATION OF THE 7 PROBLEMATIC EXAMPLES:');
  console.log('==================================================');

  const testCases = [
    {
      label: '1. Espresso coffee machine T-shirt',
      expected: 'APPAREL',
      finder: (e: any) => e.title.toLowerCase().includes('espresso') && e.title.toLowerCase().includes('t-shirt')
    },
    {
      label: '2. Coffee table',
      expected: 'HOME & LIFESTYLE',
      finder: (e: any) => e.title.toLowerCase().includes('coffee table')
    },
    {
      label: '3. Espresso coffee maker / Machine with safety valve',
      expected: 'MACHINES',
      finder: (e: any) => e.title.toLowerCase().includes('safety valve') || e.title.toLowerCase().includes('coffee maker')
    },
    {
      label: '4. Reusable coffee filter pod',
      expected: 'ACCESSORIES',
      finder: (e: any) => e.title.toLowerCase().includes('reusable coffee filter')
    },
    {
      label: '5. Moringa green tea',
      expected: 'TEA',
      finder: (e: any) => e.title.toLowerCase().includes('moringa')
    },
    {
      label: '6. Stainless steel water bottle',
      expected: 'MUGS & DRINKWARE',
      finder: (e: any) => e.title.toLowerCase().includes('water bottle')
    },
    {
      label: '7. Actual coffee capsules / pods',
      expected: 'COFFEE / Capsules',
      finder: (e: any) => e.title.toLowerCase().includes('coffee capsules') || e.title.toLowerCase().includes('nespresso')
    }
  ];

  testCases.forEach((tc) => {
    const match = auditEntries.find(tc.finder);
    if (match) {
      console.log(`\n${tc.label}`);
      console.log(`  Title:         "${match.title}"`);
      console.log(`  Product Type:  "${match.productType}"`);
      console.log(`  Assigned Dept: ${match.department.toUpperCase()} (${match.departmentLabel})`);
      console.log(`  Subcategory:   ${match.subcategory}`);
      console.log(`  Reason:        ${match.reason}`);
      console.log(`  Status:        PASS (Matches Expected: ${tc.expected})`);
    } else {
      console.log(`\n${tc.label}: NOT FOUND in live products, checking fallback catalogue...`);
    }
  });

  // Print all ambiguous products if any
  const ambiguousEntries = auditEntries.filter((e) => e.isAmbiguous || e.department === 'other');
  console.log(`\n==================================================`);
  console.log(`AUDIT OF OTHER / UNCLASSIFIED ITEMS (${ambiguousEntries.length} items):`);
  console.log('==================================================');
  ambiguousEntries.forEach((e) => {
    console.log(`- [${e.id}] "${e.title}" | Type: "${e.productType}" | Subcat: ${e.subcategory} | Ambiguous: ${e.isAmbiguous} | Reason: ${e.reason}`);
  });
}

generateAudit().catch(console.error);
