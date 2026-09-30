import {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyPageInfo,
  ShopifyGraphQLResponse,
} from '../types';

/**
 * SHOPIFY STOREFRONT API SERVICE
 * Connects the TROSE Coffee & More storefront to Shopify's Storefront GraphQL API.
 * Uses public Storefront Access Token only. Never logs secrets or private keys.
 */

// Default to latest stable Storefront API version
export const SHOPIFY_API_VERSION = '2025-01';

/**
 * Safely parses the Shopify Store Domain from environment variables.
 * Strips protocol prefix and trailing slashes if present.
 */
export function getShopifyStoreDomain(): string {
  const raw = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '';
  return raw.replace(/^https?:\/\//, '').replace(/\/+$/, '').trim();
}

/**
 * Retrieves the public Storefront API Access Token.
 * Note: Never log or expose this value in errors or console logs.
 */
export function getShopifyStorefrontToken(): string {
  return (import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '').trim();
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
          quantityAvailable
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
    if (import.meta.env.DEV) {
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
      if (import.meta.env.DEV) {
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
      if (import.meta.env.DEV) {
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
    if (import.meta.env.DEV) {
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
