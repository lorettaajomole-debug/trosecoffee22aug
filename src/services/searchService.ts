import { Product, ProductCategory } from '../types';

export interface SearchResultItem {
  product: Product;
  score: number;
  matchedCategory: string;
  matchedFields: string[];
}

export interface SearchProvider {
  search(query: string, products: Product[]): Promise<SearchResultItem[]>;
}

// Category display mapping
export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  all: 'All Collections',
  coffee: 'Specialty Coffee',
  organic: 'Organic Coffee',
  beverages: 'Beverages & Elixirs',
  snacks: 'Snacks & Cacao',
  tables: 'Coffee Tables',
  'mugs-flasks': 'Mugs & Flasks',
  machines: 'Coffee Machines',
  accessories: 'Precision Accessories',
  bundles: 'Bundles & Flights'
};

// Region & Synonym Mappings for enhanced search experience
const REGION_SYNONYMS: Record<string, string[]> = {
  africa: ['ethiopia', 'african', 'kenya', 'rwanda', 'yirgacheffe', 'guji', 'sidama'],
  'african coffee': ['ethiopia', 'kenya', 'rwanda', 'yirgacheffe', 'african', 'heirloom', 'guji'],
  espresso: ['espresso', 'velvet noir', 'aurora', 'grinder', 'machine', 'dark roast', 'crema'],
  'organic coffee': ['organic', 'usda', 'marcala', 'cajamarca', 'gayo', 'rainforest', 'fair trade'],
  'coffee machine': ['machine', 'machines', 'aurora', 'boiler', 'grinder', 'zenith', 'espresso machine'],
  machines: ['machines', 'aurora', 'grinder', 'zenith', 'boiler', 'dual-boiler'],
  mugs: ['mug', 'mugs', 'tumbler', 'flask', 'cup', 'stoneware', 'drinkware', 'ceramics', 'nomad'],
  cups: ['tumbler', 'cup', 'mugs', 'stoneware', 'flask'],
  flasks: ['flask', 'nomad', 'travel flask', 'tumbler'],
  tables: ['table', 'tables', 'walnut', 'travertine', 'marble', 'calacatta', 'furniture'],
  chocolate: ['chocolate', 'cacao', 'chuncho', 'snack', 'biscotti'],
  tea: ['cascara', 'cherry tea', 'elixir', 'botanical', 'hibiscus'],
  'cold brew': ['cold brew', 'nitro', 'concentrate']
};

/**
 * LocalSearchProvider: High-performance, client-side semantic search engine.
 * Designed with a clean interface so it can be swapped seamlessly with Shopify Storefront API.
 */
export class LocalSearchProvider implements SearchProvider {
  async search(query: string, products: Product[]): Promise<SearchResultItem[]> {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return [];

    const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);
    const results: SearchResultItem[] = [];

    // Find expanded synonym keywords if query matches known search intents
    const expandedTerms = new Set<string>(queryTokens);
    for (const [key, synonyms] of Object.entries(REGION_SYNONYMS)) {
      if (cleanQuery.includes(key) || key.includes(cleanQuery)) {
        synonyms.forEach(syn => expandedTerms.add(syn));
      }
    }

    for (const product of products) {
      let score = 0;
      const matchedFields: string[] = [];

      const name = product.name.toLowerCase();
      const subtitle = product.subtitle.toLowerCase();
      const description = product.description.toLowerCase();
      const origin = (product.origin || '').toLowerCase();
      const country = (product.country || '').toLowerCase();
      const roastLevel = (product.roastLevel || '').toLowerCase();
      const category = product.category.toLowerCase();
      const categoryLabel = (CATEGORY_LABELS[product.category] || '').toLowerCase();
      const notes = (product.tastingNotes || []).map(n => n.toLowerCase());
      const details = (product.details || []).map(d => d.toLowerCase());
      const formats = (product.formats || []).map(f => f.toLowerCase());
      const grinds = (product.availableGrinds || []).map(g => g.toLowerCase());

      // 1. Direct whole phrase exact match in title or category
      if (name.includes(cleanQuery)) {
        score += 100;
        matchedFields.push('Title Exact');
      }
      if (categoryLabel.includes(cleanQuery) || category.includes(cleanQuery)) {
        score += 80;
        matchedFields.push('Category Exact');
      }

      // 2. Special Intent: "African coffee" / "African" / "Africa"
      if (
        cleanQuery.includes('african') || 
        cleanQuery.includes('africa') || 
        cleanQuery.includes('ethiopia') ||
        cleanQuery.includes('kenya')
      ) {
        if (
          country.includes('ethiopia') || 
          origin.includes('ethiopia') || 
          country.includes('kenya') || 
          country.includes('rwanda') ||
          origin.includes('african') ||
          description.includes('ethiopian') ||
          description.includes('african')
        ) {
          score += 90;
          matchedFields.push('African Origin');
        }
      }

      // 3. Special Intent: "Organic coffee" / "Organic"
      if (cleanQuery.includes('organic')) {
        if (product.isOrganic || category === 'organic' || name.includes('organic')) {
          score += 90;
          matchedFields.push('USDA Organic');
        }
      }

      // 4. Special Intent: "Espresso" / "Espresso machine"
      if (cleanQuery.includes('espresso')) {
        if (name.includes('espresso') || roastLevel.includes('espresso') || grinds.includes('espresso')) {
          score += 70;
          matchedFields.push('Espresso Roast / Method');
        }
        if (category === 'machines' || name.includes('aurora') || name.includes('grinder')) {
          score += 65;
          matchedFields.push('Espresso Hardware');
        }
      }

      // 5. Special Intent: "Coffee machine" / "Machines"
      if (cleanQuery.includes('machine') || cleanQuery.includes('coffee machine')) {
        if (category === 'machines' || name.includes('machine') || name.includes('grinder') || name.includes('kettle')) {
          score += 90;
          matchedFields.push('Coffee Equipment');
        }
      }

      // 6. Special Intent: "Mugs" / "Flask" / "Tumbler" / "Cups"
      if (cleanQuery.includes('mug') || cleanQuery.includes('mugs') || cleanQuery.includes('flask') || cleanQuery.includes('tumbler')) {
        if (category === 'mugs-flasks' || name.includes('tumbler') || name.includes('flask') || name.includes('cup')) {
          score += 90;
          matchedFields.push('Drinkware & Vessels');
        }
      }

      // 7. Token matching across all fields
      for (const token of expandedTerms) {
        if (name.includes(token)) score += 30;
        if (subtitle.includes(token)) score += 20;
        if (category.includes(token) || categoryLabel.includes(token)) score += 25;
        if (origin.includes(token) || country.includes(token)) score += 35;
        if (roastLevel.includes(token)) score += 20;
        if (notes.some(n => n.includes(token))) score += 20;
        if (description.includes(token)) score += 10;
        if (details.some(d => d.includes(token))) score += 10;
        if (formats.some(f => f.includes(token))) score += 10;
      }

      if (score > 0) {
        results.push({
          product,
          score,
          matchedCategory: CATEGORY_LABELS[product.category] || 'Specialty Collection',
          matchedFields
        });
      }
    }

    // Sort by descending relevance score
    return results.sort((a, b) => b.score - a.score);
  }
}

// Export a singleton instance ready for use, easily replaceable with Shopify API
export const searchService: SearchProvider = new LocalSearchProvider();
