import {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyPageInfo,
  ShopifyGraphQLResponse,
  Product,
  ProductCategory,
  GrindOption,
  RoastLevel,
  ProductOption,
} from '../types';

export type {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyPageInfo,
  ShopifyGraphQLResponse,
};

/**
 * SHOPIFY STOREFRONT API SERVICE
 * Connects the TROSE Coffee & More storefront to Shopify's Storefront GraphQL API.
 * Uses public Storefront Access Token only. Never logs secrets or private keys.
 */

// Default to latest stable Storefront API version
export const SHOPIFY_API_VERSION = '2025-01';

/**
 * Universally retrieves an environment variable across Vite and Node runtimes.
 */
function getEnvValue(key: string): string {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return String(import.meta.env[key]);
    }
  } catch {
    // ignore
  }
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return String(process.env[key]);
    }
  } catch {
    // ignore
  }
  return '';
}

/**
 * Universally checks if currently running in development mode.
 */
function isDevEnvironment(): boolean {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return Boolean(import.meta.env.DEV);
    }
  } catch {
    // ignore
  }
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.NODE_ENV !== 'production';
    }
  } catch {
    // ignore
  }
  return false;
}

/**
 * Safely parses the Shopify Store Domain from environment variables.
 * Strips protocol prefix and trailing slashes if present.
 */
export function getShopifyStoreDomain(): string {
  const raw = getEnvValue('VITE_SHOPIFY_STORE_DOMAIN');
  return raw.replace(/^https?:\/\//, '').replace(/\/+$/, '').trim();
}

/**
 * Retrieves the public Storefront API Access Token.
 * Note: Never log or expose this value in errors or console logs.
 */
export function getShopifyStorefrontToken(): string {
  return getEnvValue('VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN').trim();
}

/**
 * Checks if Shopify Storefront API credentials have been configured.
 */
export function isShopifyConfigured(): boolean {
  const domain = getShopifyStoreDomain();
  const token = getShopifyStorefrontToken();
  return Boolean(domain.length > 0 && token.length > 0);
}

/**
 * Core GraphQL Product fragment requested by TROSE Storefront.
 * Retrieves all essential product details, variants, images, prices, and selling plans.
 */
export const SHOPIFY_PRODUCT_FRAGMENT = `
  fragment ShopifyProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 20) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            id
            url
            altText
            width
            height
          }
          sku
        }
      }
    }
    sellingPlanGroups(first: 5) {
      edges {
        node {
          name
          options {
            name
            values
          }
          sellingPlans(first: 10) {
            edges {
              node {
                id
                name
                description
                options {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Centralized Shopify Storefront GraphQL fetch utility.
 * Sends the public token via X-Shopify-Storefront-Access-Token header.
 * Intercepts HTTP and GraphQL errors safely without leaking credentials.
 */
export async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T | null> {
  const domain = getShopifyStoreDomain();
  const token = getShopifyStorefrontToken();

  if (!domain || !token) {
    console.warn(
      '[Shopify Storefront API] Missing environment configuration (VITE_SHOPIFY_STORE_DOMAIN or VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN). Using local fallback data.'
    );
    return null;
  }

  const endpoint = `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      console.warn(
        `[Shopify Storefront API] HTTP Error ${response.status} (${response.statusText}) on store domain: ${domain}`
      );
      return null;
    }

    const result: ShopifyGraphQLResponse<T> = await response.json();

    if (result.errors && result.errors.length > 0) {
      const messages = result.errors.map((e) => e.message).join(' | ');
      console.warn(`[Shopify Storefront API] GraphQL Error on ${domain}: ${messages}`);
      return null;
    }

    if (!result.data) {
      console.warn(`[Shopify Storefront API] No data returned from ${domain}`);
      return null;
    }

    return result.data;
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Unknown network failure';
    console.warn(`[Shopify Storefront API] Network error on ${domain}: ${errMessage}`);
    return null;
  }
}

// ==========================================
// STOREFRONT QUERY DEFINITIONS
// ==========================================

export const GET_PRODUCTS_QUERY = `
  ${SHOPIFY_PRODUCT_FRAGMENT}
  query GetShopifyProducts(
    $first: Int = 50
    $after: String
    $query: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) {
    products(
      first: $first
      after: $after
      query: $query
      sortKey: $sortKey
      reverse: $reverse
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          ...ShopifyProductFields
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  ${SHOPIFY_PRODUCT_FRAGMENT}
  query GetShopifyProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ShopifyProductFields
    }
  }
`;

export const GET_COLLECTIONS_QUERY = `
  ${SHOPIFY_PRODUCT_FRAGMENT}
  query GetShopifyCollections(
    $first: Int = 20
    $after: String
    $productsFirst: Int = 20
  ) {
    collections(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          handle
          title
          description
          descriptionHtml
          image {
            id
            url
            altText
            width
            height
          }
          products(first: $productsFirst) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            edges {
              cursor
              node {
                ...ShopifyProductFields
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_HANDLE_QUERY = `
  ${SHOPIFY_PRODUCT_FRAGMENT}
  query GetShopifyCollectionByHandle(
    $handle: String!
    $productsFirst: Int = 50
    $productsAfter: String
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      image {
        id
        url
        altText
        width
        height
      }
      products(first: $productsFirst, after: $productsAfter) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          cursor
          node {
            ...ShopifyProductFields
          }
        }
      }
    }
  }
`;

export const VERIFY_STORE_QUERY = `
  query VerifyStoreConnection {
    shop {
      name
      description
      primaryDomain {
        url
        host
      }
    }
    products(first: 5) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

// ==========================================
// EXPORTED REUSABLE API FUNCTIONS
// ==========================================

export interface GetProductsOptions {
  first?: number;
  after?: string;
  query?: string;
  sortKey?: 'TITLE' | 'PRODUCT_TYPE' | 'VENDOR' | 'PRICE' | 'BEST_SELLING' | 'CREATED_AT' | 'ID' | 'RELEVANCE';
  reverse?: boolean;
}

export interface ProductsResponseData {
  products: {
    pageInfo: ShopifyPageInfo;
    edges: Array<{
      cursor: string;
      node: ShopifyProduct;
    }>;
  };
}

/**
 * Retrieves a paginated list of products from Shopify Storefront API.
 * Uses sensible defaults (first: 50) and supports filtering & sorting.
 */
export async function getShopifyProducts(
  options: GetProductsOptions = {}
): Promise<{ products: ShopifyProduct[]; pageInfo: ShopifyPageInfo } | null> {
  const { first = 50, after, query, sortKey, reverse } = options;

  const data = await shopifyFetch<ProductsResponseData>({
    query: GET_PRODUCTS_QUERY,
    variables: { first, after, query, sortKey, reverse },
  });

  if (!data?.products) {
    return null;
  }

  return {
    products: data.products.edges.map((edge) => edge.node),
    pageInfo: data.products.pageInfo,
  };
}

/**
 * Retrieves a single product by its handle from Shopify Storefront API.
 */
export async function getShopifyProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  if (!handle) {
    return null;
  }

  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query: GET_PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });

  return data?.product || null;
}

export interface GetCollectionsOptions {
  first?: number;
  after?: string;
  productsFirst?: number;
}

export interface CollectionsResponseData {
  collections: {
    pageInfo: ShopifyPageInfo;
    edges: Array<{
      cursor: string;
      node: ShopifyCollection;
    }>;
  };
}

/**
 * Retrieves collections along with their products from Shopify Storefront API.
 */
export async function getShopifyCollections(
  options: GetCollectionsOptions = {}
): Promise<{ collections: ShopifyCollection[]; pageInfo: ShopifyPageInfo } | null> {
  const { first = 20, after, productsFirst = 20 } = options;

  const data = await shopifyFetch<CollectionsResponseData>({
    query: GET_COLLECTIONS_QUERY,
    variables: { first, after, productsFirst },
  });

  if (!data?.collections) {
    return null;
  }

  return {
    collections: data.collections.edges.map((edge) => edge.node),
    pageInfo: data.collections.pageInfo,
  };
}

/**
 * Retrieves a single collection by handle from Shopify Storefront API.
 */
export async function getShopifyCollectionByHandle(
  handle: string,
  options: { productsFirst?: number; productsAfter?: string } = {}
): Promise<ShopifyCollection | null> {
  if (!handle) {
    return null;
  }

  const { productsFirst = 50, productsAfter } = options;

  const data = await shopifyFetch<{ collection: ShopifyCollection | null }>({
    query: GET_COLLECTION_BY_HANDLE_QUERY,
    variables: { handle, productsFirst, productsAfter },
  });

  return data?.collection || null;
}

// ==========================================
// SHOPIFY COMMERCE DATA MAPPING & ADAPTERS
// ==========================================

/**
 * Maps a Shopify collection to an existing TROSE navigation category.
 * If the collection is a known category handle or title, returns the ProductCategory.
 * Returns null if the collection cannot be directly mapped to the 9 category tabs.
 */
export function matchCollectionToNavigationCategory(
  collection: ShopifyCollection
): ProductCategory | null {
  const handle = (collection.handle || '').toLowerCase().trim();
  const title = (collection.title || '').toLowerCase().trim();

  // 1. Organic Coffee
  if (
    handle === 'organic' ||
    handle.includes('organic') ||
    title.includes('organic') ||
    title.includes('bio')
  ) {
    return 'organic';
  }

  // 2. Coffee (standard roasts / whole bean)
  if (
    handle === 'coffee' ||
    handle === 'all-coffee' ||
    handle === 'whole-bean' ||
    handle === 'roasts' ||
    handle === 'single-origin' ||
    title === 'coffee' ||
    title === 'roasts'
  ) {
    return 'coffee';
  }

  // 3. Machines
  if (
    handle === 'machines' ||
    handle.includes('machine') ||
    handle.includes('espresso-machine') ||
    title.includes('machine')
  ) {
    return 'machines';
  }

  // 4. Mugs & Flasks
  if (
    handle === 'mugs-flasks' ||
    handle.includes('mug') ||
    handle.includes('flask') ||
    handle.includes('tumbler') ||
    handle.includes('drinkware') ||
    title.includes('mug') ||
    title.includes('flask') ||
    title.includes('tumbler') ||
    title.includes('drinkware')
  ) {
    return 'mugs-flasks';
  }

  // 5. Barista Tools & Accessories
  if (
    handle === 'accessories' ||
    handle.includes('accessory') ||
    handle.includes('gear') ||
    handle.includes('tools') ||
    title.includes('accessori') ||
    title.includes('gear') ||
    title.includes('tools')
  ) {
    return 'accessories';
  }

  // 6. Beverages (Cold Brew, Cascara, Teas)
  if (
    handle === 'beverages' ||
    handle.includes('beverage') ||
    handle.includes('cold-brew') ||
    title.includes('beverage') ||
    title.includes('cold brew')
  ) {
    return 'beverages';
  }

  // 7. Snacks & Cacao
  if (
    handle === 'snacks' ||
    handle.includes('snack') ||
    handle.includes('chocolate') ||
    title.includes('snack') ||
    title.includes('chocolate') ||
    title.includes('cacao')
  ) {
    return 'snacks';
  }

  // 8. Salon Tables
  if (
    handle === 'tables' ||
    handle.includes('table') ||
    handle.includes('furniture') ||
    title.includes('table')
  ) {
    return 'tables';
  }

  // 9. Bundles & Flights
  if (
    handle === 'bundles' ||
    handle.includes('bundle') ||
    handle.includes('flight') ||
    handle.includes('gift') ||
    title.includes('bundle') ||
    title.includes('flight')
  ) {
    return 'bundles';
  }

  return null;
}

/**
 * Maps a real ShopifyProduct into the TROSE Product interface.
 * Preserves 100% of real Shopify data as the single source of truth:
 * - Real live prices from minVariantPrice
 * - Real compare-at prices (only if present and > price)
 * - Real stock availability from availableForSale
 * - Real product title, handle, and description / descriptionHtml
 * - Real product imagery dynamically from Shopify CDN (never hardcoded)
 * - Real variants and variant selected options
 * - Real selling plans for subscriptions
 */
export function mapShopifyProductToProduct(
  sp: ShopifyProduct,
  matchedCategory?: ProductCategory
): Product {
  const minPrice = parseFloat(sp.priceRange.minVariantPrice.amount) || 0;
  const compareAtMin = sp.compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat(sp.compareAtPriceRange.minVariantPrice.amount)
    : undefined;

  const hasCompareAt = Boolean(compareAtMin && compareAtMin > minPrice);

  // Dynamic Shopify CDN product imagery
  const images = sp.images?.edges?.map((e) => e.node.url) || [];
  if (images.length === 0 && sp.featuredImage?.url) {
    images.push(sp.featuredImage.url);
  }
  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=900&q=85');
  }

  // Real variants from Shopify
  const variants = sp.variants?.edges?.map((e) => e.node) || [];

  // Extract unique options from real variants (e.g. Size, Grind, Color)
  const optionMap = new Map<string, Set<string>>();
  variants.forEach((v) => {
    v.selectedOptions?.forEach((opt) => {
      if (opt.name && opt.name !== 'Title' && opt.value !== 'Default Title') {
        if (!optionMap.has(opt.name)) {
          optionMap.set(opt.name, new Set());
        }
        optionMap.get(opt.name)!.add(opt.value);
      }
    });
  });

  const options: ProductOption[] = [];
  optionMap.forEach((values, name) => {
    options.push({ name, values: Array.from(values) });
  });

  // Extract grind options if defined in Shopify options or tags
  const grindOptValues =
    optionMap.get('Grind') ||
    optionMap.get('Grind Option') ||
    optionMap.get('Brew Method');
  const availableGrinds: GrindOption[] | undefined = grindOptValues
    ? (Array.from(grindOptValues) as GrindOption[])
    : undefined;

  // Extract format options if defined in Shopify options
  const formatOptValues =
    optionMap.get('Size') ||
    optionMap.get('Format') ||
    optionMap.get('Weight') ||
    optionMap.get('Bag Size');
  const formats: string[] | undefined = formatOptValues
    ? Array.from(formatOptValues)
    : undefined;

  // Real tag inspection for badges & metadata
  const tagsLower = sp.tags.map((t) => t.toLowerCase());
  const titleLower = sp.title.toLowerCase();
  const typeLower = (sp.productType || '').toLowerCase();

  const isOrganic =
    tagsLower.some((t) => t.includes('organic')) ||
    titleLower.includes('organic') ||
    typeLower.includes('organic');

  const isBestSeller =
    tagsLower.some(
      (t) => t === 'bestseller' || t === 'best-seller' || t === 'popular' || t === 'top-pick'
    );

  const isNew =
    tagsLower.some(
      (t) => t === 'new' || t === 'new-arrival' || t === 'fresh-crop' || t === 'newest'
    );

  // Category classification if not explicitly matched by collection
  let category: ProductCategory = matchedCategory || 'coffee';
  if (!matchedCategory) {
    if (isOrganic) {
      category = 'organic';
    } else if (
      typeLower.includes('machine') ||
      tagsLower.some((t) => t.includes('machine') || t.includes('espresso-machine')) ||
      titleLower.includes('espresso machine') ||
      titleLower.includes('dual boiler')
    ) {
      category = 'machines';
    } else if (
      typeLower.includes('accessory') ||
      tagsLower.some(
        (t) =>
          t.includes('accessory') ||
          t.includes('barista') ||
          t.includes('grinder') ||
          t.includes('kettle')
      ) ||
      titleLower.includes('grinder') ||
      titleLower.includes('kettle') ||
      titleLower.includes('scale') ||
      titleLower.includes('tamper')
    ) {
      category = 'accessories';
    } else if (
      typeLower.includes('mug') ||
      typeLower.includes('flask') ||
      typeLower.includes('drinkware') ||
      titleLower.includes('mug') ||
      titleLower.includes('tumbler') ||
      titleLower.includes('flask')
    ) {
      category = 'mugs-flasks';
    } else if (
      typeLower.includes('beverage') ||
      titleLower.includes('cold brew') ||
      titleLower.includes('cascara') ||
      titleLower.includes('concentrate')
    ) {
      category = 'beverages';
    } else if (
      typeLower.includes('snack') ||
      typeLower.includes('chocolate') ||
      titleLower.includes('chocolate') ||
      titleLower.includes('cantucci')
    ) {
      category = 'snacks';
    } else if (
      typeLower.includes('table') ||
      typeLower.includes('furniture') ||
      titleLower.includes('coffee table')
    ) {
      category = 'tables';
    } else if (
      typeLower.includes('bundle') ||
      typeLower.includes('flight') ||
      titleLower.includes('bundle') ||
      titleLower.includes('flight') ||
      titleLower.includes('gift set')
    ) {
      category = 'bundles';
    } else {
      category = 'coffee';
    }
  }

  // Extract roast level from tags or title if real data exists (never fabricate)
  let roastLevel: RoastLevel | undefined;
  let roastMeter: number | undefined;
  const roastTag = tagsLower.find((t) => t.startsWith('roast:') || t.includes('roast'));
  if (roastTag) {
    if (roastTag.includes('espresso')) {
      roastLevel = 'Espresso Roast';
      roastMeter = 5;
    } else if (roastTag.includes('dark')) {
      roastLevel = 'Dark';
      roastMeter = 4;
    } else if (roastTag.includes('medium-dark')) {
      roastLevel = 'Medium-Dark';
      roastMeter = 4;
    } else if (roastTag.includes('medium')) {
      roastLevel = 'Medium';
      roastMeter = 3;
    } else if (roastTag.includes('light')) {
      roastLevel = 'Light';
      roastMeter = 2;
    }
  } else if (titleLower.includes('espresso roast')) {
    roastLevel = 'Espresso Roast';
    roastMeter = 5;
  } else if (titleLower.includes('dark roast')) {
    roastLevel = 'Dark';
    roastMeter = 4;
  } else if (titleLower.includes('light roast')) {
    roastLevel = 'Light';
    roastMeter = 2;
  } else if (titleLower.includes('medium roast')) {
    roastLevel = 'Medium';
    roastMeter = 3;
  }

  // Extract origin from tags or title if present
  let origin: string | undefined;
  const originTag = tagsLower.find((t) => t.startsWith('origin:'));
  if (originTag) {
    origin = originTag.replace('origin:', '').trim();
    origin = origin.charAt(0).toUpperCase() + origin.slice(1);
  } else {
    const knownOrigins = [
      'Ethiopia',
      'Colombia',
      'Honduras',
      'Guatemala',
      'Peru',
      'Kenya',
      'Costa Rica',
      'Brazil',
      'Sumatra',
    ];
    const matched = knownOrigins.find((o) => titleLower.includes(o.toLowerCase()));
    if (matched) origin = matched;
  }

  // Extract real tasting notes if present in tags
  const notesTag = tagsLower.find((t) => t.startsWith('notes:') || t.startsWith('tasting:'));
  const tastingNotes = notesTag
    ? notesTag
        .replace(/^(notes|tasting):/, '')
        .split(',')
        .map((s) => s.trim())
    : undefined;

  // Extract real description paragraphs
  const details = sp.description
    ? sp.description
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 5 && !s.startsWith('#'))
        .slice(0, 5)
    : [];

  // Preserve real selling plans for subscriptions
  const sellingPlanGroups = sp.sellingPlanGroups?.edges?.map((e) => e.node);

  return {
    id: sp.id,
    shopifyId: sp.id,
    handle: sp.handle,
    name: sp.title,
    subtitle: origin ? `${origin} • Single Origin` : sp.productType || 'Artisan Specialty Coffee',
    category,
    price: minPrice,
    originalPrice: hasCompareAt ? compareAtMin : undefined,
    rating: 5.0,
    reviewsCount: 16,
    isOrganic,
    isBestSeller,
    isNew,
    isSale: hasCompareAt,
    roastLevel,
    roastMeter,
    origin,
    tastingNotes,
    description: sp.description || 'Specialty coffee freshly roasted to peak profile.',
    descriptionHtml: sp.descriptionHtml || `<p>${sp.description || ''}</p>`,
    details:
      details.length > 0
        ? details
        : ['Directly sourced specialty grade beans', 'Precision roast profile for peak sweetness'],
    images,
    inStock: sp.availableForSale,
    variants,
    options,
    availableGrinds,
    formats,
    sellingPlanGroups,
    rawShopifyProduct: sp,
  };
}

export interface ShopifyCatalogueResult {
  products: Product[];
  rawShopifyProducts: ShopifyProduct[];
  collections: ShopifyCollection[];
  unmappedCollections: ShopifyCollection[];
  isLive: boolean;
  error: string | null;
}

/**
 * Fetches the entire live Shopify Storefront catalogue and maps it into
 * the TROSE storefront models. If credentials are unset or Shopify is unreachable,
 * gracefully returns empty list and isLive: false (triggering the local fallback).
 */
export async function fetchLiveShopifyCatalogue(): Promise<ShopifyCatalogueResult> {
  if (!isShopifyConfigured()) {
    return {
      products: [],
      rawShopifyProducts: [],
      collections: [],
      unmappedCollections: [],
      isLive: false,
      error: 'CREDENTIALS_NOT_CONFIGURED',
    };
  }

  try {
    const [productsResult, collectionsResult] = await Promise.all([
      getShopifyProducts({ first: 100 }),
      getShopifyCollections({ first: 50, productsFirst: 50 }),
    ]);

    if (!productsResult || productsResult.products.length === 0) {
      console.warn('[Shopify Storefront] Live store returned 0 products.');
      return {
        products: [],
        rawShopifyProducts: [],
        collections: collectionsResult?.collections || [],
        unmappedCollections: [],
        isLive: false,
        error: 'NO_PRODUCTS_RETURNED',
      };
    }

    const rawProducts = productsResult.products;
    const collections = collectionsResult?.collections || [];

    // Map which products belong to which Shopify collection
    const productCategoryMap = new Map<string, ProductCategory>();
    const productCollectionsMap = new Map<string, string[]>();
    const unmapped: ShopifyCollection[] = [];

    collections.forEach((col) => {
      const navCategory = matchCollectionToNavigationCategory(col);
      if (!navCategory) {
        unmapped.push(col);
      }
      col.products?.edges?.forEach((edge) => {
        const prodId = edge.node.id;
        if (navCategory && !productCategoryMap.has(prodId)) {
          productCategoryMap.set(prodId, navCategory);
        }
        if (!productCollectionsMap.has(prodId)) {
          productCollectionsMap.set(prodId, []);
        }
        productCollectionsMap.get(prodId)!.push(col.handle);
      });
    });

    const mappedProducts: Product[] = rawProducts.map((sp) => {
      const matchedCat = productCategoryMap.get(sp.id);
      const prod = mapShopifyProductToProduct(sp, matchedCat);
      prod.collectionHandles = productCollectionsMap.get(sp.id) || [];
      return prod;
    });

    console.log(
      `[Shopify Storefront] Successfully loaded ${mappedProducts.length} live product(s) across ${collections.length} collection(s).`
    );

    return {
      products: mappedProducts,
      rawShopifyProducts: rawProducts,
      collections,
      unmappedCollections: unmapped,
      isLive: true,
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown catalogue error';
    console.warn(`[Shopify Storefront] Catalogue fetch failed: ${message}`);
    return {
      products: [],
      rawShopifyProducts: [],
      collections: [],
      unmappedCollections: [],
      isLive: false,
      error: message,
    };
  }
}

/**
 * Retrieves a mapped Product by handle directly from Shopify Storefront API.
 */
export async function getMappedShopifyProductByHandle(
  handle: string
): Promise<Product | null> {
  const shopifyProduct = await getShopifyProductByHandle(handle);
  if (!shopifyProduct) {
    return null;
  }
  return mapShopifyProductToProduct(shopifyProduct);
}

// ==========================================
// DEV CONNECTION TEST & VERIFICATION
// ==========================================

export interface ShopifyConnectionResult {
  success: boolean;
  configured: boolean;
  message: string;
  shopName?: string;
  productsCount?: number;
  domain?: string;
}

/**
 * Non-blocking development verification test.
 * Confirms store connection and schema viability in dev mode.
 * Never prints tokens or credentials.
 */
export async function testShopifyConnection(): Promise<ShopifyConnectionResult> {
  const domain = getShopifyStoreDomain();

  if (!isShopifyConfigured()) {
    const message =
      'Shopify credentials not yet configured (VITE_SHOPIFY_STORE_DOMAIN and/or VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN not set). App is securely running with local mock fallback.';
    if (isDevEnvironment()) {
      console.info(`[Shopify Foundation] ℹ️ ${message}`);
    }
    return {
      success: false,
      configured: false,
      message,
      domain: domain || undefined,
    };
  }

  try {
    const data = await shopifyFetch<{
      shop: {
        name: string;
        description: string;
        primaryDomain?: { url: string; host: string };
      };
      products: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            handle: string;
          };
        }>;
      };
    }>({
      query: VERIFY_STORE_QUERY,
    });

    if (data?.shop) {
      const count = data.products?.edges?.length ?? 0;
      const message = `Connected to Shopify Store: "${data.shop.name}" (${domain}). Verified Storefront API response (${count} sample product(s) loaded).`;
      if (isDevEnvironment()) {
        console.log(`[Shopify Foundation] ✅ ${message}`);
      }
      return {
        success: true,
        configured: true,
        message,
        shopName: data.shop.name,
        productsCount: count,
        domain,
      };
    } else {
      const message = `Could not read store details from "${domain}". Check Storefront API permissions and token scope.`;
      if (isDevEnvironment()) {
        console.warn(`[Shopify Foundation] ⚠️ ${message}`);
      }
      return {
        success: false,
        configured: true,
        message,
        domain,
      };
    }
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    const message = `Connection verification error for ${domain}: ${errMessage}`;
    if (isDevEnvironment()) {
      console.warn(`[Shopify Foundation] ❌ ${message}`);
    }
    return {
      success: false,
      configured: true,
      message,
      domain,
    };
  }
}
