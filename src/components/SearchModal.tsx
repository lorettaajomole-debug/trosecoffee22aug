import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ShoppingBag, Eye, Sparkles, Filter, CheckCircle } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { searchService, SearchResultItem, CATEGORY_LABELS } from '../services/searchService';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onQuickView,
  onAddToCart
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Curated queries requested specifically in prompt
  const curatedSearches = [
    { label: 'Espresso', query: 'espresso', icon: '☕' },
    { label: 'Organic Coffee', query: 'organic coffee', icon: '🌱' },
    { label: 'Coffee Machine', query: 'coffee machine', icon: '⚙️' },
    { label: 'Mugs', query: 'mugs', icon: '🏺' },
    { label: 'African Coffee', query: 'African coffee', icon: '🌍' }
  ];

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSearchTerm('');
      setResults([]);
      setSelectedCategoryFilter('all');
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Execute Search via searchService provider
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const searchResults = await searchService.search(searchTerm, products);
        setResults(searchResults);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [searchTerm, products]);

  // Extract distinct categories from current search results for quick sub-filtering
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    results.forEach(r => cats.add(r.product.category));
    return Array.from(cats);
  }, [results]);

  // Filtered results based on category pill
  const filteredResults = useMemo(() => {
    if (selectedCategoryFilter === 'all') return results;
    return results.filter(r => r.product.category === selectedCategoryFilter);
  }, [results, selectedCategoryFilter]);

  if (!isOpen) return null;

  return (
    <div 
      id="search-overlay-wrapper"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex flex-col items-center justify-start p-4 sm:p-6 md:p-10 animate-fadeIn"
    >
      {/* Container - Large Expansive Search Modal */}
      <div 
        id="search-overlay-container"
        className="w-full max-w-4xl bg-[#FAF6F0] rounded-3xl shadow-2xl border border-[#E8DFD5] overflow-hidden flex flex-col mt-4 sm:mt-8 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header & Search Bar */}
        <div className="p-5 sm:p-7 bg-white border-b border-[#E8DFD5] flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#E8DFD5] flex items-center justify-center shrink-0 text-[#241712]">
            <Search className="w-5 h-5" />
          </div>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              id="search-input-field"
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedCategoryFilter('all');
              }}
              placeholder="Search roasts, origins, machines, mugs, or notes (e.g. 'African coffee', 'espresso')..."
              className="w-full text-base sm:text-lg bg-transparent text-[#241712] placeholder-[#7A6C63]/70 focus:outline-none font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 text-[#7A6C63] hover:text-[#241712] cursor-pointer"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Close Overlay Button */}
          <button
            id="close-search-overlay-btn"
            onClick={onClose}
            className="p-2.5 rounded-full text-[#7A6C63] hover:text-[#241712] hover:bg-[#FAF6F0] transition-colors cursor-pointer shrink-0"
            aria-label="Close search overlay"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Prompts Bar */}
        <div className="px-6 py-3.5 bg-[#FAF6F0] border-b border-[#E8DFD5] flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center space-x-2 overflow-x-auto py-0.5 no-scrollbar">
            <span className="text-[#7A6C63] uppercase tracking-wider font-mono text-[10px] font-bold shrink-0 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#D63426]" />
              <span>Suggested:</span>
            </span>

            {curatedSearches.map((item) => (
              <button
                key={item.query}
                id={`quick-search-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  setSearchTerm(item.query);
                  setSelectedCategoryFilter('all');
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-1.5 ${
                  searchTerm.toLowerCase() === item.query.toLowerCase()
                    ? 'bg-[#D63426] text-white shadow-xs'
                    : 'bg-white hover:bg-[#241712] hover:text-white text-[#241712] border border-[#E8DFD5]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <span className="hidden md:inline-block text-[11px] text-[#7A6C63] font-mono">
            Press <kbd className="px-2 py-0.5 bg-white border border-[#E8DFD5] rounded-md text-[10px] font-bold">ESC</kbd> to close
          </span>
        </div>

        {/* Category Refinement Pills */}
        {results.length > 0 && availableCategories.length > 1 && (
          <div className="px-6 py-2.5 bg-white/70 border-b border-[#E8DFD5] flex items-center space-x-2 overflow-x-auto text-xs">
            <Filter className="w-3.5 h-3.5 text-[#7A6C63] shrink-0" />
            <span className="text-[10px] uppercase tracking-wider text-[#7A6C63] font-mono font-bold shrink-0">Filter Collection:</span>
            
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer shrink-0 font-bold ${
                selectedCategoryFilter === 'all'
                  ? 'bg-[#241712] text-white'
                  : 'bg-white text-[#241712] hover:bg-[#FAF6F0] border border-[#E8DFD5]'
              }`}
            >
              All ({results.length})
            </button>

            {availableCategories.map((cat) => {
              const count = results.filter(r => r.product.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer shrink-0 font-bold ${
                    selectedCategoryFilter === cat
                      ? 'bg-[#241712] text-white'
                      : 'bg-white text-[#241712] hover:bg-[#FAF6F0] border border-[#E8DFD5]'
                  }`}
                >
                  {CATEGORY_LABELS[cat as ProductCategory] || cat} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Results Area */}
        <div className="p-6 sm:p-8 max-h-[62vh] overflow-y-auto">
          {!searchTerm.trim() ? (
            /* Initial Empty Exploration State */
            <div className="text-center py-10 space-y-6">
              <div className="w-16 h-16 rounded-full bg-white border border-[#E8DFD5] mx-auto flex items-center justify-center text-[#D63426]">
                <Search className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-2xl font-black uppercase text-[#241712]">
                  Explore TROSE Coffee
                </h3>
                <p className="text-xs text-[#7A6C63] font-normal leading-relaxed">
                  Search across freshly roasted single-origin lots, certified organic beans, barista-grade tools, and ceramic gear.
                </p>
              </div>

              {/* Popular Discovery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2 text-left">
                {products.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onQuickView(p);
                      onClose();
                    }}
                    className="p-3 bg-white rounded-2xl border border-[#E8DFD5] hover:border-[#D63426] hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-24 object-cover rounded-xl mb-2 group-hover:scale-[1.02] transition-transform duration-300 bg-[#FAF6F0]"
                    />
                    <span className="text-[10px] text-[#E65F38] font-mono font-bold block truncate">
                      {CATEGORY_LABELS[p.category] || 'Coffee'}
                    </span>
                    <h4 className="text-xs font-bold text-[#241712] line-clamp-1 group-hover:text-[#D63426] transition-colors">
                      {p.name}
                    </h4>
                    <span className="text-xs font-black text-[#241712]">${p.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : isSearching ? (
            /* Loading State */
            <div className="text-center py-16 space-y-3">
              <div className="w-8 h-8 border-2 border-[#D63426] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#7A6C63]">Finding freshest matches...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            /* No Results Found State */
            <div className="text-center py-14 space-y-4">
              <div className="w-14 h-14 rounded-full bg-white border border-[#E8DFD5] text-[#D63426] mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-[#241712]">No exact matches for "{searchTerm}"</h4>
                <p className="text-xs text-[#7A6C63] font-normal max-w-sm mx-auto">
                  Try searching for <button onClick={() => setSearchTerm('coffee')} className="text-[#D63426] font-bold underline">coffee</button>, <button onClick={() => setSearchTerm('organic')} className="text-[#D63426] font-bold underline">organic</button>, or <button onClick={() => setSearchTerm('espresso')} className="text-[#D63426] font-bold underline">espresso</button>.
                </p>
              </div>
            </div>
          ) : (
            /* Results List */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8DFD5]">
                <span className="text-xs text-[#7A6C63] uppercase tracking-widest font-mono font-bold text-[10px]">
                  Found {filteredResults.length} {filteredResults.length === 1 ? 'Match' : 'Matches'} for "{searchTerm}"
                </span>
                <span className="text-xs text-[#657953] font-bold">
                  Fresh Roast Selection
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResults.map(({ product, matchedCategory }) => (
                  <div
                    key={product.id}
                    className="p-4 bg-white rounded-2xl border border-[#E8DFD5] hover:border-[#D63426] transition-all hover:shadow-md flex flex-col justify-between group"
                  >
                    <div className="flex space-x-4">
                      {/* Product Thumbnail */}
                      <div 
                        onClick={() => {
                          onQuickView(product);
                          onClose();
                        }}
                        className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 cursor-pointer bg-[#FAF6F0]"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.isOrganic && (
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-[#657953] text-white text-[8px] font-mono font-bold uppercase rounded-full">
                            Organic
                          </span>
                        )}
                        {!product.inStock && (
                          <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-[9px] uppercase font-bold text-white tracking-wider">
                            Sold Out
                          </span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        {/* Matching Category Badge */}
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="px-2 py-0.5 bg-[#FAF6F0] border border-[#E8DFD5] text-[#241712] text-[9px] font-mono font-bold uppercase tracking-wider rounded-full">
                            {matchedCategory}
                          </span>
                          {product.country && (
                            <span className="text-[10px] text-[#7A6C63] font-medium truncate">
                              • {product.country}
                            </span>
                          )}
                        </div>

                        {/* Product Title */}
                        <h4
                          onClick={() => {
                            onQuickView(product);
                            onClose();
                          }}
                          className="text-sm font-bold text-[#241712] group-hover:text-[#D63426] transition-colors cursor-pointer line-clamp-1"
                        >
                          {product.name}
                        </h4>

                        {/* Subtitle / Tasting Notes */}
                        <p className="text-xs text-[#7A6C63] font-normal line-clamp-1 mt-0.5">
                          {product.subtitle || (product.tastingNotes ? product.tastingNotes.join(', ') : '')}
                        </p>

                        {/* Price & Rating */}
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-sm font-black text-[#241712]">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-[#7A6C63] line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                          {product.rating && (
                            <span className="text-[11px] text-[#E65F38] font-bold">
                              ★ {product.rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E8DFD5]">
                      <button
                        onClick={() => {
                          onQuickView(product);
                          onClose();
                        }}
                        className="text-xs text-[#7A6C63] hover:text-[#241712] font-bold flex items-center space-x-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick View</span>
                      </button>

                      {product.inStock ? (
                        <button
                          onClick={() => {
                            onAddToCart(product);
                            onClose();
                          }}
                          className="px-4 py-2 bg-[#241712] hover:bg-[#D63426] text-white text-xs font-black rounded-full flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-[#7A6C63] font-bold">
                          Sold Out
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-white border-t border-[#E8DFD5] flex items-center justify-between text-xs text-[#7A6C63]">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-3.5 h-3.5 text-[#657953]" />
            <span className="text-[11px] font-medium">Direct Trade • 100% Specialty Grade • Roasted Fresh Weekly</span>
          </div>

          <button
            onClick={onClose}
            className="text-xs font-bold text-[#241712] hover:text-[#D63426] cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

