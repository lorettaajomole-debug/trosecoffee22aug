import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ShoppingBag, Eye, Filter } from 'lucide-react';
import { Product, ProductCategory, PrimaryDepartment } from '../types';
import { searchService, SearchResultItem, CATEGORY_LABELS } from '../services/searchService';
import { DEPARTMENT_DEFINITIONS } from '../services/productClassification';
import { Pagination } from './Pagination';
import { useResponsivePageSize } from '../hooks/useResponsivePageSize';

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

  const curatedSearches = [
    { label: 'Espresso', query: 'espresso' },
    { label: 'Organic Coffee', query: 'organic coffee' },
    { label: 'Coffee Machine', query: 'coffee machine' },
    { label: 'Mugs', query: 'mugs' },
    { label: 'African Coffee', query: 'African coffee' }
  ];

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    results.forEach(r => cats.add(r.product.department || r.product.category));
    return Array.from(cats);
  }, [results]);

  const filteredResults = useMemo(() => {
    if (selectedCategoryFilter === 'all') return results;
    return results.filter(r => (r.product.department || r.product.category) === selectedCategoryFilter);
  }, [results, selectedCategoryFilter]);

  const pageSize = useResponsivePageSize(4, 8);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategoryFilter]);

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredResults.slice(start, start + pageSize);
  }, [filteredResults, currentPage, pageSize]);

  if (!isOpen) return null;

  return (
    <div 
      id="search-overlay-wrapper"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#12100E]/75 backdrop-blur-xs flex flex-col items-center justify-start p-4 sm:p-6 md:p-10"
    >
      <div 
        id="search-overlay-container"
        className="w-full max-w-4xl bg-[#FAF7F2] border border-[#12100E] shadow-2xl overflow-hidden flex flex-col mt-4 sm:mt-8 my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header & Search Input */}
        <div className="p-5 sm:p-6 bg-[#FDFBF7] border-b border-[#12100E]/15 flex items-center space-x-4">
          <div className="w-10 h-10 border border-[#12100E] bg-white flex items-center justify-center shrink-0 text-[#12100E]">
            <Search className="w-4 h-4" />
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
              placeholder="SEARCH BY ROAST, TASTING NOTE, MACHINE OR ORIGIN..."
              className="w-full text-sm sm:text-base bg-transparent text-[#12100E] placeholder-[#12100E]/40 focus:outline-none font-mono uppercase tracking-wider font-bold"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[#69574A] hover:text-[#12100E] cursor-pointer"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            id="close-search-overlay-btn"
            onClick={onClose}
            className="p-2 border border-[#12100E]/20 text-[#12100E] hover:border-[#12100E] hover:text-[#D62828] transition-colors cursor-pointer shrink-0"
            aria-label="Close search overlay"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suggested Searches Bar (Zero pills) */}
        <div className="px-6 py-3 bg-[#FAF7F2] border-b border-[#12100E]/15 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center space-x-2 overflow-x-auto py-0.5 no-scrollbar">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold shrink-0">
              SUGGESTED:
            </span>

            {curatedSearches.map((item) => (
              <button
                key={item.query}
                id={`quick-search-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  setSearchTerm(item.query);
                  setSelectedCategoryFilter('all');
                }}
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer shrink-0 border ${
                  searchTerm.toLowerCase() === item.query.toLowerCase()
                    ? 'bg-[#12100E] text-white border-[#12100E]'
                    : 'bg-[#FDFBF7] text-[#12100E] border-[#12100E]/20 hover:border-[#12100E]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <span className="hidden md:inline-block text-[10px] text-[#69574A] font-mono">
            ESC TO CLOSE
          </span>
        </div>

        {/* Category Filter Tabs */}
        {results.length > 0 && availableCategories.length > 1 && (
          <div className="px-6 py-2.5 bg-[#FDFBF7] border-b border-[#12100E]/15 flex items-center space-x-2 overflow-x-auto text-xs">
            <Filter className="w-3 h-3 text-[#69574A] shrink-0" />
            <span className="text-[9px] uppercase tracking-wider text-[#69574A] font-mono font-bold shrink-0">FILTER:</span>
            
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-2.5 py-1 text-[9px] font-mono uppercase transition-colors cursor-pointer shrink-0 border ${
                selectedCategoryFilter === 'all'
                  ? 'bg-[#12100E] text-white border-[#12100E] font-bold'
                  : 'bg-white text-[#12100E] border-[#12100E]/20 hover:border-[#12100E]'
              }`}
            >
              All ({results.length})
            </button>

            {availableCategories.map((cat) => {
              const count = results.filter(r => (r.product.department || r.product.category) === cat).length;
              const label = DEPARTMENT_DEFINITIONS[cat as PrimaryDepartment]?.navLabel || CATEGORY_LABELS[cat as ProductCategory] || cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-[9px] font-mono uppercase transition-colors cursor-pointer shrink-0 border ${
                    selectedCategoryFilter === cat
                      ? 'bg-[#12100E] text-white border-[#12100E] font-bold'
                      : 'bg-white text-[#12100E] border-[#12100E]/20 hover:border-[#12100E]'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Results Area */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
          {!searchTerm.trim() ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 border border-[#12100E] mx-auto flex items-center justify-center text-[#12100E]">
                <Search className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-xl font-editorial font-bold uppercase text-[#12100E]">
                  Catalogue Search
                </h3>
                <p className="text-xs text-[#69574A] font-sans leading-relaxed">
                  Search across freshly roasted single-origin lots, certified organic beans, barista-grade tools, and drinkware.
                </p>
              </div>

              {/* Popular Discovery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-4 text-left">
                {products.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onQuickView(p);
                      onClose();
                    }}
                    className="p-2.5 bg-[#FDFBF7] border border-[#12100E]/15 hover:border-[#12100E] cursor-pointer transition-colors"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="aspect-square w-full object-cover mb-2 bg-[#F2E8DC]"
                    />
                    <h4 className="text-[11px] font-editorial font-bold text-[#12100E] line-clamp-1 uppercase">
                      {p.name}
                    </h4>
                    <span className="text-[10px] font-mono text-[#69574A] block mt-0.5">
                      ${p.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : isSearching ? (
            <div className="text-center py-16 font-mono text-xs text-[#69574A] uppercase tracking-widest">
              Searching live roastery catalogue...
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 border border-[#12100E] mx-auto flex items-center justify-center text-[#69574A]">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-editorial font-bold uppercase text-[#12100E]">No Matching Results</h3>
              <p className="text-xs text-[#69574A] font-sans max-w-md mx-auto">
                No items matched "{searchTerm}". Try a different keyword or origin name.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#69574A] font-bold block mb-2">
                FOUND {filteredResults.length} MATCHING PRODUCTS
              </span>
              <div id="search-results-top" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paginatedResults.map(({ product, highlightFields, score }) => (
                  <div
                    key={product.id}
                    className="p-3 bg-[#FDFBF7] border border-[#12100E]/15 hover:border-[#12100E] transition-colors flex space-x-3 cursor-pointer group"
                    onClick={() => {
                      onQuickView(product);
                      onClose();
                    }}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover bg-[#F2E8DC] shrink-0 border border-[#12100E]/15"
                    />

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-editorial font-bold text-[#12100E] group-hover:text-[#D62828] line-clamp-1 uppercase">
                            {product.name}
                          </h4>
                          <span className="text-xs font-mono font-bold text-[#12100E] shrink-0 ml-2">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>

                        <span className="text-[9px] font-mono text-[#69574A] uppercase block mt-0.5">
                          {product.departmentLabel
                            ? (product.department === 'coffee' && product.origin ? `${product.departmentLabel} • ${product.origin}` : `${product.departmentLabel} • ${product.subcategory}`)
                            : (product.origin || product.category)}
                        </span>

                        {product.tastingNotes && product.tastingNotes.length > 0 && (
                          <span className="text-[9px] font-mono text-[#C5A059] block truncate mt-0.5">
                            {product.tastingNotes.slice(0, 3).join(' · ')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1 mt-1 border-t border-[#12100E]/10 text-[9px] font-mono">
                        <span className={product.inStock ? 'text-[#C5A059] font-bold' : 'text-[#D62828] font-bold'}>
                          {product.inStock ? 'IN STOCK' : 'SOLD OUT'}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                          }}
                          disabled={!product.inStock}
                          className="px-2 py-0.5 bg-[#12100E] hover:bg-[#D62828] text-white uppercase tracking-wider font-bold transition-colors disabled:opacity-30 cursor-pointer"
                        >
                          + ADD
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Search Results Pagination */}
              <Pagination
                currentPage={currentPage}
                totalItems={filteredResults.length}
                pageSize={pageSize}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  const el = document.getElementById('search-overlay-container');
                  if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                itemName="matching items"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
