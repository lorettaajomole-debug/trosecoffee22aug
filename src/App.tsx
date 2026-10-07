import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, Coffee } from 'lucide-react';
import { PRODUCTS, REVIEWS } from './data/products';
import { Product, ProductCategory, CartItem, GrindOption, AppView } from './types';
import { fetchLiveShopifyCatalogue, ShopifyCollection, getMappedShopifyProductByHandle } from './services/shopify';
import { getAvailableCategories, CoffeeSubcategory } from './services/categoryManager';
import { isStorefrontEligibleProduct } from './services/productClassification';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EditorialImageStrip } from './components/EditorialImageStrip';
import { ShopOurCollections } from './components/ShopOurCollections';
import { ExploreTrose } from './components/ExploreTrose';
import { TroseBestSellers } from './components/TroseBestSellers';
import { CoffeeFinderSection } from './components/CoffeeFinderSection';
import { CoffeePage } from './components/CoffeePage';
import { CategoryPage } from './components/CategoryPage';
import { OrganicSpotlight } from './components/OrganicSpotlight';
import { MachinesAndAccessories } from './components/MachinesAndAccessories';
import { SubscriptionClub } from './components/SubscriptionClub';
import { BrandStory } from './components/BrandStory';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { ProductDetailPage } from './components/ProductDetailPage';
import { ShopPage } from './components/ShopPage';
import { OurStoryPage } from './components/OurStoryPage';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AccountModal } from './components/AccountModal';
import { AboutModal } from './components/AboutModal';
import { CoffeeQuizModal } from './components/CoffeeQuizModal';
import { PolicyModal, PolicyTab } from './components/PolicyModal';
import { Toast } from './components/Toast';

export default function App() {
  // Helper to parse URL on load and on browser back/forward popstate
  const parseUrlLocation = () => {
    try {
      const path = window.location.pathname.replace(/^\/+/, '').toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const urlPage = parseInt(params.get('page') || '1', 10);
      const initialPageNum = isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;
      const urlCat = params.get('category') as ProductCategory;
      const urlSubcat = params.get('subcategory') as CoffeeSubcategory;

      // Real product route (/products/:handle or /product/:handle)
      if (path.startsWith('products/') || path.startsWith('product/')) {
        const productHandle = path.replace(/^products?\//, '').replace(/\/+$/, '');
        return {
          view: 'product-detail' as AppView,
          category: 'all' as ProductCategory,
          page: 1,
          handle: productHandle
        };
      }

      if (path === 'our-story' || path === 'pages/our-story' || path === 'about') {
        return {
          view: 'our-story' as AppView,
          category: 'all' as ProductCategory,
          page: 1
        };
      }

      if (path === 'coffee') {
        return {
          view: 'coffee' as AppView,
          category: 'coffee' as ProductCategory,
          page: initialPageNum,
          subcategory: urlSubcat || 'all'
        };
      }
      if (path === 'tea') {
        return { view: 'tea' as AppView, category: 'beverages' as ProductCategory, page: initialPageNum };
      }
      if (path === 'mugs' || path === 'mugs-drinkware') {
        return { view: 'mugs' as AppView, category: 'mugs-drinkware' as ProductCategory, page: initialPageNum };
      }
      if (path === 'machines') {
        return { view: 'machines' as AppView, category: 'machines' as ProductCategory, page: initialPageNum };
      }
      if (path === 'accessories') {
        return { view: 'accessories' as AppView, category: 'accessories' as ProductCategory, page: initialPageNum };
      }
      if (path === 'home-lifestyle') {
        return { view: 'home-lifestyle' as AppView, category: 'home-lifestyle' as ProductCategory, page: initialPageNum };
      }
      if (path === 'apparel' || path === 'clothing') {
        return { view: 'apparel' as AppView, category: 'apparel' as ProductCategory, page: initialPageNum };
      }
      if (path === 'candles') {
        return { view: 'candles' as AppView, category: 'candles' as ProductCategory, page: initialPageNum };
      }
      if (path === 'shop') {
        return { view: 'shop' as AppView, category: urlCat || 'all', page: initialPageNum };
      }

      // Query param fallback
      const queryView = params.get('view') as AppView;
      if (queryView && ['coffee', 'tea', 'mugs', 'machines', 'accessories', 'home-lifestyle', 'apparel', 'clothing', 'candles', 'shop', 'our-story'].includes(queryView)) {
        return {
          view: queryView,
          category: urlCat || (queryView as any),
          page: initialPageNum,
          subcategory: urlSubcat || 'all'
        };
      }

      return { view: 'home' as AppView, category: 'all' as ProductCategory, page: 1, subcategory: 'all' as CoffeeSubcategory };
    } catch {
      return { view: 'home' as AppView, category: 'all' as ProductCategory, page: 1, subcategory: 'all' as CoffeeSubcategory };
    }
  };

  const [currentView, setCurrentView] = useState<AppView>(() => parseUrlLocation().view);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>(() => parseUrlLocation().category || 'all');
  const [pageNumber, setPageNumber] = useState<number>(() => parseUrlLocation().page || 1);
  const [coffeeSubcategory, setCoffeeSubcategory] = useState<CoffeeSubcategory>(() => parseUrlLocation().subcategory || 'all');
  const [pendingProductHandle, setPendingProductHandle] = useState<string | null>(() => (parseUrlLocation() as any).handle || null);
  const [isLoadingProductDetail, setIsLoadingProductDetail] = useState<boolean>(() => parseUrlLocation().view === 'product-detail');
  const [productLookupFailed, setProductLookupFailed] = useState<boolean>(false);
  
  // Single source of truth: Live Shopify products (with local fallback if API unavailable)
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [shopifyCollections, setShopifyCollections] = useState<ShopifyCollection[]>([]);
  const [unmappedCollections, setUnmappedCollections] = useState<ShopifyCollection[]>([]);
  const [isLoadingCatalogue, setIsLoadingCatalogue] = useState<boolean>(true);
  const [isShopifyLive, setIsShopifyLive] = useState<boolean>(false);
  const [catalogueError, setCatalogueError] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('trose_cart');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    // Default initial luxury item in tasting bag
    return [
      {
        product: PRODUCTS[0],
        quantity: 1,
        selectedGrind: 'Whole Bean'
      }
    ];
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [policyModal, setPolicyModal] = useState<{ isOpen: boolean; tab: PolicyTab }>({
    isOpen: false,
    tab: 'privacy'
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load Live Shopify Storefront Catalogue on startup
  useEffect(() => {
    let isMounted = true;
    fetchLiveShopifyCatalogue()
      .then((result) => {
        if (!isMounted) return;
        if (result.isLive && result.products.length > 0) {
          setProducts(result.products);
          setShopifyCollections(result.collections);
          setUnmappedCollections(result.unmappedCollections);
          setIsShopifyLive(true);
          setCatalogueError(null);
        } else {
          // Graceful fallback to local PRODUCTS dataset
          setProducts(PRODUCTS);
          setIsShopifyLive(false);
          if (result.error && result.error !== 'CREDENTIALS_NOT_CONFIGURED') {
            setCatalogueError(result.error);
          }
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('[TROSE Storefront] Catalogue fetch error, using local fallback:', err);
        setProducts(PRODUCTS);
        setIsShopifyLive(false);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingCatalogue(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('trose_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Helper to find product by real handle or ID
  const findProductByHandle = (handle: string, list: Product[]): Product | undefined => {
    if (!handle) return undefined;
    const clean = handle.toLowerCase().trim();
    return list.find(
      (p) =>
        (p.handle && p.handle.toLowerCase() === clean) ||
        (p.shopifyHandle && p.shopifyHandle.toLowerCase() === clean) ||
        p.id.toLowerCase() === clean
    );
  };

  // Sync state to URL and history so back button and shareable links work
  const updateUrlHistory = (
    view: AppView,
    page: number = 1,
    category?: ProductCategory,
    subcat?: CoffeeSubcategory,
    product?: Product
  ) => {
    try {
      let path = '/';
      const params = new URLSearchParams();

      if (view === 'product-detail') {
        const p = product || selectedProduct;
        const handle = p?.shopifyHandle || p?.handle || p?.id;
        path = handle ? `/products/${handle}` : '/shop';
      } else if (view === 'our-story') {
        path = '/pages/our-story';
      } else if (view === 'coffee') {
        path = '/coffee';
        if (subcat && subcat !== 'all') {
          params.set('subcategory', subcat);
        }
      } else if (view === 'tea') {
        path = '/tea';
      } else if (view === 'mugs') {
        path = '/mugs';
      } else if (view === 'machines') {
        path = '/machines';
      } else if (view === 'accessories') {
        path = '/accessories';
      } else if (view === 'home-lifestyle') {
        path = '/home-lifestyle';
      } else if (view === 'apparel' || view === 'clothing') {
        path = '/apparel';
      } else if (view === 'candles') {
        path = '/candles';
      } else if (view === 'shop') {
        path = '/shop';
        if (category && category !== 'all') {
          params.set('category', category);
        }
      }

      if (page > 1 && view !== 'home' && view !== 'product-detail' && view !== 'our-story') {
        params.set('page', String(page));
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${path}?${queryString}` : path;

      const pObj = product || selectedProduct;
      const serializableProduct = pObj
        ? {
            id: pObj.id,
            handle: pObj.handle,
            shopifyHandle: pObj.shopifyHandle,
            name: pObj.name,
            price: pObj.price,
            images: pObj.images,
            category: pObj.category,
            department: pObj.department,
            departmentLabel: pObj.departmentLabel,
          }
        : undefined;

      if (window.location.pathname + window.location.search !== newUrl) {
        window.history.pushState(
          {
            view,
            page,
            category,
            subcat,
            handle: pObj?.shopifyHandle || pObj?.handle || pObj?.id,
            product: serializableProduct
          },
          '',
          newUrl
        );
      }
    } catch {
      // ignore
    }
  };

  // Resolve product for product-detail route whenever handle or products change
  useEffect(() => {
    if (currentView !== 'product-detail') return;

    const handleToFind = pendingProductHandle || (selectedProduct?.shopifyHandle || selectedProduct?.handle || selectedProduct?.id);
    if (!handleToFind) {
      setIsLoadingProductDetail(false);
      setProductLookupFailed(true);
      return;
    }

    // Check in-memory products list
    const candidateList = products.length > 0 ? products : PRODUCTS;
    const match = findProductByHandle(handleToFind, candidateList);
    if (match) {
      setSelectedProduct(match);
      setIsLoadingProductDetail(false);
      setProductLookupFailed(false);
      return;
    }

    // If not found in memory, fetch fresh from Shopify
    setIsLoadingProductDetail(true);
    let isCancelled = false;
    getMappedShopifyProductByHandle(handleToFind)
      .then((fresh) => {
        if (isCancelled) return;
        if (fresh) {
          setSelectedProduct(fresh);
          setIsLoadingProductDetail(false);
          setProductLookupFailed(false);
        } else if (!isLoadingCatalogue) {
          setIsLoadingProductDetail(false);
          setProductLookupFailed(true);
        }
      })
      .catch(() => {
        if (isCancelled) return;
        if (!isLoadingCatalogue) {
          setIsLoadingProductDetail(false);
          setProductLookupFailed(true);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [currentView, pendingProductHandle, products, isLoadingCatalogue]);

  // Listen to browser Back / Forward events
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.searchOpen) {
        setIsSearchOpen(true);
      }
      const parsed = parseUrlLocation();
      const stateView = e.state?.view;
      const targetView = stateView || parsed.view;

      if (targetView === 'product-detail') {
        const handle = e.state?.handle || (parsed as any).handle;
        setPendingProductHandle(handle);
        setCurrentView('product-detail');
        if (e.state?.product) {
          const match = findProductByHandle(handle, products.length > 0 ? products : PRODUCTS);
          setSelectedProduct(match || (e.state.product as Product));
          setIsLoadingProductDetail(false);
          setProductLookupFailed(false);
        } else if (handle) {
          const match = findProductByHandle(handle, products.length > 0 ? products : PRODUCTS);
          if (match) {
            setSelectedProduct(match);
            setIsLoadingProductDetail(false);
            setProductLookupFailed(false);
          } else {
            setIsLoadingProductDetail(true);
            setProductLookupFailed(false);
            getMappedShopifyProductByHandle(handle)
              .then((fresh) => {
                if (fresh) {
                  setSelectedProduct(fresh);
                  setIsLoadingProductDetail(false);
                  setProductLookupFailed(false);
                } else {
                  setIsLoadingProductDetail(false);
                  setProductLookupFailed(true);
                }
              })
              .catch(() => {
                setIsLoadingProductDetail(false);
                setProductLookupFailed(true);
              });
          }
        }
      } else {
        setSelectedProduct(null);
        setPendingProductHandle(null);
        setIsLoadingProductDetail(false);
        setProductLookupFailed(false);
        setCurrentView(targetView);
        if (e.state?.category || parsed.category) setActiveCategory(e.state?.category || parsed.category || 'all');
        if (e.state?.subcat || parsed.subcategory) setCoffeeSubcategory(e.state?.subcat || parsed.subcategory || 'all');
        setPageNumber(e.state?.page || parsed.page || 1);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

  const handleShopCoffeeCollection = (subcat: CoffeeSubcategory) => {
    setCoffeeSubcategory(subcat);
    setPageNumber(1);
    setCurrentView('coffee');
    setActiveCategory('coffee');
    updateUrlHistory('coffee', 1, 'coffee', subcat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: AppView, category?: ProductCategory, page: number = 1) => {
    if (view !== 'product-detail') {
      setSelectedProduct(null);
    }
    if (category) {
      setActiveCategory(category);
    }
    if (view === 'coffee' && !category) {
      setCoffeeSubcategory('all');
    }
    setPageNumber(page);
    setCurrentView(view);
    updateUrlHistory(view, page, category, view === 'coffee' ? coffeeSubcategory : undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
    updateUrlHistory(currentView, newPage, activeCategory);
  };

  const handleViewProductDetail = (product: Product) => {
    const handle = product.shopifyHandle || product.handle || product.id;
    setSelectedProduct(product);
    setPendingProductHandle(handle);
    setIsLoadingProductDetail(false);
    setProductLookupFailed(false);
    setCurrentView('product-detail');
    updateUrlHistory('product-detail', 1, undefined, undefined, product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product, grind?: GrindOption, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedGrind === grind
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            product,
            quantity,
            selectedGrind: grind || (product.availableGrinds ? product.availableGrinds[0] : undefined)
          }
        ];
      }
    });

    showToast(`Added ${product.name}${grind ? ` (${grind})` : ''} to your Tasting Bag`);
  };

  const handleBuyNow = (product: Product, grind?: GrindOption, quantity: number = 1) => {
    handleAddToCart(product, grind, quantity);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number, grind?: string) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId && item.selectedGrind === grind) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (productId: string, grind?: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productId && item.selectedGrind === grind))
    );
    showToast('Item removed from your bag');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleSubscribe = (product: Product, plan: 'every-2-weeks' | 'every-4-weeks') => {
    setCart((prevCart) => [
      ...prevCart,
      {
        product,
        quantity: 1,
        selectedGrind: product.availableGrinds ? product.availableGrinds[0] : undefined,
        subscriptionPlan: plan
      }
    ]);
    setIsCartOpen(true);
    showToast(`Subscribed to ${product.name} (${plan === 'every-2-weeks' ? 'Bi-weekly' : 'Monthly'})`);
  };

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const organicProducts = products.filter((p) => p.isOrganic || p.category === 'organic');

  // Dynamic non-empty categories in strict brand priority order
  const availableCategories = useMemo(() => {
    return getAvailableCategories(products);
  }, [products]);

  return (
    <div id="trose-app-root" className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#12100E] selection:bg-[#C5A059]/30 selection:text-[#12100E]">
      
      {/* Top Announcement Bar */}
      <AnnouncementBar onOpenQuiz={() => setIsQuizOpen(true)} />

      {/* Sticky Navigation Bar with Priority Categories */}
      <Navbar
        activeCategory={activeCategory}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAbout={() => handleNavigate('our-story')}
        onOpenQuiz={() => setIsQuizOpen(true)}
        cartCount={totalCartCount}
        availableCategories={availableCategories}
      />

      {/* Dynamic View Rendering */}
      <main className="flex-1">
        
        {/* VIEW 1: REUSABLE PRODUCT DETAIL PAGE */}
        {currentView === 'product-detail' ? (
          selectedProduct ? (
            <ProductDetailPage
              product={selectedProduct}
              allProducts={products}
              onBackToShop={(cat) => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  handleNavigate(cat === 'coffee' ? 'coffee' : 'shop', cat || 'all');
                }
              }}
              onSelectProduct={handleViewProductDetail}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          ) : isLoadingProductDetail || isLoadingCatalogue ? (
            /* Loading State (Never render a blank page) */
            <div id="trose-product-loading-view" className="bg-[#FAF7F2] min-h-[70vh] py-12 sm:py-16 px-6 max-w-7xl mx-auto text-left">
              <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.24em] text-[#69574A] mb-8 pb-4 border-b border-[#12100E]/15">
                <button
                  onClick={() => {
                    if (window.history.length > 1) window.history.back();
                    else handleNavigate('coffee');
                  }}
                  className="hover:text-[#12100E] flex items-center space-x-1 font-bold cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  <span>BACK</span>
                </button>
                <span>/</span>
                <span>ROASTERY CATALOGUE</span>
                <span>/</span>
                <span className="text-[#12100E] font-bold">LOADING...</span>
              </nav>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 animate-pulse">
                <div className="lg:col-span-6 bg-[#E8D8C3]/50 aspect-square border border-[#12100E]/20 flex items-center justify-center">
                  <div className="text-center space-y-3 p-6 font-mono text-xs uppercase tracking-widest text-[#69574A]">
                    <div className="w-8 h-8 border-2 border-[#12100E] border-t-transparent rounded-full animate-spin mx-auto" />
                    <span>Resolving live roast specifications...</span>
                  </div>
                </div>
                <div className="lg:col-span-6 space-y-6">
                  <div className="h-4 bg-[#12100E]/10 w-1/3" />
                  <div className="h-10 bg-[#12100E]/15 w-3/4" />
                  <div className="h-6 bg-[#12100E]/10 w-1/4" />
                  <div className="h-28 bg-[#12100E]/5 border border-[#12100E]/10" />
                  <div className="h-12 bg-[#12100E]/20 w-full" />
                </div>
              </div>
            </div>
          ) : (
            /* Safe Product Not Found State (Never render a blank page) */
            <div id="trose-product-not-found-view" className="bg-[#FAF7F2] min-h-[70vh] py-20 flex items-center justify-center text-left">
              <div className="max-w-md mx-auto px-6 text-center space-y-6">
                <div className="w-16 h-16 border border-[#12100E] mx-auto flex items-center justify-center text-[#12100E]">
                  <Coffee className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-editorial font-bold uppercase text-[#12100E]">
                    Product Not Found
                  </h1>
                  <p className="text-xs sm:text-sm text-[#69574A] font-sans leading-relaxed">
                    The requested product could not be resolved from our live catalogue. It may be temporarily unavailable or unlisted.
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-4 pt-2">
                  <button
                    id="not-found-back-btn"
                    onClick={() => {
                      if (window.history.length > 1) {
                        window.history.back();
                      } else {
                        handleNavigate('coffee');
                      }
                    }}
                    className="px-6 py-3 border border-[#12100E] text-[#12100E] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#12100E] hover:text-white transition-colors cursor-pointer"
                  >
                    ← BACK
                  </button>
                  <button
                    id="not-found-shop-coffee-btn"
                    onClick={() => handleNavigate('coffee')}
                    className="px-6 py-3 bg-[#12100E] text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#D62828] transition-colors cursor-pointer"
                  >
                    SHOP COFFEE →
                  </button>
                </div>
              </div>
            </div>
          )
        ) : currentView === 'our-story' ? (
          /* VIEW 2: DEDICATED CANONICAL OUR STORY PAGE */
          <OurStoryPage
            onBack={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                handleNavigate('home');
              }
            }}
            onShopCoffee={() => handleNavigate('coffee')}
          />
        ) : currentView === 'coffee' ? (
          /* VIEW 3: DEDICATED PRIMARY COFFEE STOREFRONT */
          <CoffeePage
            products={products}
            initialPage={pageNumber}
            initialSubcategory={coffeeSubcategory}
            onPageChange={handlePageChange}
            onSubcategoryChange={(sub) => {
              setCoffeeSubcategory(sub);
              updateUrlHistory('coffee', 1, 'coffee', sub);
            }}
            onSelectProduct={handleViewProductDetail}
            onAddToCart={handleAddToCart}
            onOpenQuiz={() => setIsQuizOpen(true)}
            onNavigateHome={() => handleNavigate('home')}
            isLoading={isLoadingCatalogue}
          />
        ) : currentView === 'tea' || currentView === 'mugs' || currentView === 'machines' || currentView === 'accessories' || currentView === 'home-lifestyle' || currentView === 'apparel' || currentView === 'clothing' || currentView === 'candles' || currentView === 'other' ? (
          /* VIEW 4: DEDICATED CATEGORY PAGES IN STRICT PRIORITY ORDER */
          (() => {
            const catInfo = availableCategories.find((c) => c.id === currentView || (currentView === 'clothing' && c.id === 'apparel')) || {
              id: currentView as any,
              label: currentView.toUpperCase(),
              navLabel: currentView.toUpperCase(),
              description: 'Exclusive artisanal creations and gear from the TROSE portfolio.',
              heroHeadline: `${currentView.toUpperCase()} COLLECTION`,
              heroSubheadline: 'Engineered with intention and craft.',
              heroImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85',
              productCount: 0
            };
            return (
              <CategoryPage
                category={catInfo}
                allProducts={products}
                initialPage={pageNumber}
                onPageChange={handlePageChange}
                onSelectProduct={handleViewProductDetail}
                onAddToCart={handleAddToCart}
                onNavigateCategory={(catId) => handleNavigate(catId as AppView)}
                onNavigateHome={() => handleNavigate('home')}
                isLoading={isLoadingCatalogue}
              />
            );
          })()
        ) : currentView === 'shop' ? (
          /* VIEW 5: COMPLETE FILTERABLE CATALOGUE WITH PAGINATION */
          <ShopPage
            products={products}
            initialCategory={activeCategory}
            initialPage={pageNumber}
            onPageChange={handlePageChange}
            onSelectProduct={handleViewProductDetail}
            onAddToCart={handleAddToCart}
            onNavigateHome={() => handleNavigate('home')}
            isLoading={isLoadingCatalogue}
            isShopifyLive={isShopifyLive}
          />
        ) : (
          /* VIEW 6: EDITORIAL HOME PAGE */
          <>
            {/* 1. Approved TROSE Hero */}
            <Hero
              onShopClick={() => handleNavigate('coffee')}
              onDiscoverClick={() => handleNavigate('our-story')}
              onOpenQuiz={() => setIsQuizOpen(true)}
              featuredProduct={products.find((p) => p.department === 'coffee' && isStorefrontEligibleProduct(p)) || products[0]}
            />

            {/* 2. Coffee Collections (5 Bauhaus Coffee Arches) */}
            <ShopOurCollections
              products={products}
              onShopCollection={handleShopCoffeeCollection}
              onViewAllCoffee={() => {
                handleShopCoffeeCollection('all');
              }}
            />

            {/* 3. Featured / Best-Selling Coffee */}
            <TroseBestSellers
              products={products}
              onQuickView={handleViewProductDetail}
              onAddToCart={handleAddToCart}
              onExploreCoffee={() => handleNavigate('coffee')}
            />

            {/* 4. Find Your TROSE (ONE Coffee Finder promotional section only) */}
            <CoffeeFinderSection
              onOpenFinder={() => setIsQuizOpen(true)}
            />

            {/* Desktop Subscription Tier & Editorial Imagery (hidden on mobile to prioritize shopping flow) */}
            <div className="hidden lg:block">
              <SubscriptionClub
                products={products}
                onSubscribe={handleSubscribe}
              />
              <EditorialImageStrip onLearnMore={() => handleNavigate('our-story')} />
            </div>

            {/* 5. Concise Brand Story / Balance With Boldness */}
            <BrandStory
              onExploreStory={() => handleNavigate('our-story')}
              onShopCoffee={() => handleNavigate('coffee')}
            />
          </>
        )}

      </main>

      {/* Luxury Editorial Footer */}
      <Footer
        onSelectCategory={(cat) => {
          if (cat === 'coffee' || cat === 'organic') handleNavigate('coffee');
          else if (cat === 'beverages') handleNavigate('tea');
          else if (cat === 'mugs-flasks') handleNavigate('mugs');
          else if (cat === 'accessories') handleNavigate('accessories');
          else handleNavigate('shop', cat);
        }}
        onOpenAbout={() => handleNavigate('our-story')}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenPolicy={(tab) => setPolicyModal({ isOpen: true, tab })}
      />

      {/* Interactive Overlays & Modals */}
      <ProductModal
        product={modalProduct}
        isOpen={Boolean(modalProduct)}
        onClose={() => setModalProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onExploreShop={() => handleNavigate('coffee')}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onQuickView={(product) => {
          setIsSearchOpen(false);
          handleViewProductDetail(product);
        }}
        onAddToCart={(product) => handleAddToCart(product, undefined, 1)}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onShopCoffee={() => {
          setIsAboutOpen(false);
          handleNavigate('coffee');
        }}
      />

      <CoffeeQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        products={products}
        onAddToCart={handleAddToCart}
        onQuickView={(product) => {
          setIsQuizOpen(false);
          handleViewProductDetail(product);
        }}
      />

      <PolicyModal
        isOpen={policyModal.isOpen}
        initialTab={policyModal.tab}
        onClose={() => setPolicyModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Global Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

    </div>
  );
}

