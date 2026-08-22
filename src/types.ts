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

export interface Product {
  id: string;
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
  details: string[];
  images: string[];
  inStock: boolean;
  weightOrSpecs?: string;
  availableGrinds?: GrindOption[];
  formats?: string[];
  brewingRecommendation?: string;
  ingredients?: string;
  shippingInfo?: string;
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
  subscriptionPlan?: 'one-time' | 'every-2-weeks' | 'every-4-weeks';
}

export interface CoffeeQuizAnswers {
  brewMethod?: string;
  flavorPreference?: string;
  roastStrength?: string;
  caffeineType?: string;
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
