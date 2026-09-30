export type ProductCategory = 
  | 'all' 
  | 'coffee' 
  | 'organic' 
  | 'beverages'
  | 'snacks'
  | 'tables'
  | 'mugs-flasks'
  | 'machines' 
  | 'accessories' 
  | 'bundles';

export type RoastLevel = 'Light' | 'Medium' | 'Medium-Dark' | 'Dark' | 'Espresso Roast';

export type GrindOption = 
  | 'Whole Bean' 
  | 'Espresso' 
  | 'Pour Over' 
  | 'French Press' 
  | 'Cold Brew'
  | 'Standard Grind';

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  handle?: string;
  shopifyId?: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  isOrganic?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  roastLevel?: RoastLevel;
  roastMeter?: number; // 1 to 5
  origin?: string;
  country?: string;
  altitude?: string;
  process?: string;
  tastingNotes?: string[];
  description: string;
  descriptionHtml?: string;
  details: string[];
  images: string[];
  inStock: boolean;
  weightOrSpecs?: string;
  availableGrinds?: GrindOption[];
  formats?: string[];
  brewingRecommendation?: string;
  ingredients?: string;
  shippingInfo?: string;
  // Live Shopify Commerce Fields
  variants?: ShopifyProductVariant[];
  options?: ProductOption[];
  sellingPlanGroups?: ShopifySellingPlanGroup[];
  rawShopifyProduct?: ShopifyProduct;
  collectionHandles?: string[];
}

export type AppView = 'home' | 'shop' | 'product-detail';

export type SortOption = 'featured' | 'best-selling' | 'price-asc' | 'price-desc' | 'newest';

export interface ShopFiltersState {
  category: ProductCategory;
  priceRange: 'all' | 'under-25' | '25-50' | '50-100' | '100-300' | 'over-300';
  roast: 'all' | 'Light' | 'Medium' | 'Medium-Dark' | 'Dark' | 'Espresso Roast';
  origin: string; // 'all', 'Ethiopia', 'Colombia', 'Honduras', 'Guatemala', 'Peru', 'Italy', 'USA'
  availability: 'all' | 'in-stock' | 'sold-out';
  format: string; // 'all', 'Whole Bean', 'Ground', 'Concentrate', 'Artisan Chocolate', 'Ceramic', 'Hardware', 'Furniture'
  sortBy: SortOption;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedGrind?: GrindOption;
  selectedVariantId?: string;
  selectedVariantTitle?: string;
  selectedOptions?: Record<string, string>;
  subscriptionPlan?: 'one-time' | 'every-2-weeks' | 'every-4-weeks';
}

// --- COFFEE FINDER & SHOPIFY METAFIELEDS ARCHITECTURE ---
export type CoffeeEnjoyment = 'black' | 'milk' | 'iced' | 'mood';

export type CoffeeFlavourOption = 
  | 'chocolate-rich' 
  | 'caramel-sweet' 
  | 'fruity-bright' 
  | 'nutty-smooth' 
  | 'bold-intense' 
  | 'light-delicate';

export type CoffeeStrengthLevel = 'Smooth' | 'Balanced' | 'Bold' | 'Very Bold';

export type CoffeeBrewingMethod = 
  | 'espresso-machine' 
  | 'coffee-machine' 
  | 'french-press' 
  | 'pour-over' 
  | 'moka-pot' 
  | 'capsules' 
  | 'instant-easy' 
  | 'not-sure';

export type CoffeeMoodType = 
  | 'wake-up' 
  | 'work-mode' 
  | 'slow-morning' 
  | 'dessert' 
  | 'friends' 
  | 'gift';

export interface CoffeeFinderAnswers {
  enjoyment?: CoffeeEnjoyment;
  flavours: CoffeeFlavourOption[];
  strength?: CoffeeStrengthLevel;
  brewingMethod?: CoffeeBrewingMethod;
  mood?: CoffeeMoodType;
}

// Prepared for Shopify Product Metafields (coffee.roast, coffee.strength, coffee.flavour_notes, coffee.brewing_methods, coffee.moods)
export interface ShopifyCoffeeMetafields {
  roast: RoastLevel;
  strength: CoffeeStrengthLevel;
  flavour_notes: string[];
  brewing_methods: string[];
  moods: string[];
  milk_friendly: boolean;
  iced_friendly: boolean;
}

export interface CoffeeMatchScore {
  product: Product;
  score: number; // 0-100%
  isTopMatch: boolean;
  matchedReasons: string[];
  whyYoullLoveIt: string;
  shareablePersona: string;
  shopifyMetafields?: ShopifyCoffeeMetafields;
}

export interface CoffeeFinderResult {
  perfectMatch: CoffeeMatchScore;
  alternatives: CoffeeMatchScore[];
  userAnswers: CoffeeFinderAnswers;
  timestamp: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  productName: string;
}

// ==========================================
// SHOPIFY STOREFRONT API TYPES & INTERFACES
// ==========================================

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  id?: string;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifySellingPlan {
  id: string;
  name: string;
  description?: string | null;
  recurringDeliveries?: boolean;
  options?: Array<{
    name: string;
    value: string;
  }>;
  priceAdjustments?: Array<{
    adjustmentValue: {
      adjustmentAmount?: ShopifyMoney;
      adjustmentPercentage?: number;
    };
  }>;
}

export interface ShopifySellingPlanAllocation {
  sellingPlan: ShopifySellingPlan;
  price?: ShopifyMoney;
  compareAtPrice?: ShopifyMoney | null;
}

export interface ShopifySellingPlanGroup {
  name: string;
  options: Array<{ name: string; values: string[] }>;
  sellingPlans: {
    edges: Array<{
      node: ShopifySellingPlan;
    }>;
  };
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney | null;
  selectedOptions: ShopifySelectedOption[];
  image?: ShopifyImage | null;
  sku?: string | null;
  quantityAvailable?: number | null;
  sellingPlanAllocations?: {
    edges: Array<{
      node: ShopifySellingPlanAllocation;
    }>;
  };
}

export interface ShopifyPriceRange {
  minVariantPrice: ShopifyMoney;
  maxVariantPrice: ShopifyMoney;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage?: ShopifyImage | null;
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  priceRange: ShopifyPriceRange;
  compareAtPriceRange?: ShopifyPriceRange;
  variants: {
    edges: Array<{
      node: ShopifyProductVariant;
    }>;
  };
  sellingPlanGroups?: {
    edges: Array<{
      node: ShopifySellingPlanGroup;
    }>;
  };
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  image?: ShopifyImage | null;
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
    pageInfo?: ShopifyPageInfo;
  };
}

export interface ShopifyPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
}

export interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: Record<string, unknown>;
  }>;
}
