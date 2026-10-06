import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS, REVIEWS } from './data/products';
import { Product, ProductCategory, CartItem, GrindOption, AppView } from './types';
import { fetchLiveShopifyCatalogue, ShopifyCollection } from './services/shopify';
import { getAvailableCategories, CoffeeSubcategory } from './services/categoryManager';
import { isStorefrontEligibleProduct } from './services/productClassification';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryDiscoveryBar } from './components/CategoryDiscoveryBar';
import { EditorialImageStrip } from './components/EditorialImageStrip';
import { ShopOurCollections } from './components/ShopOurCollections';
import { ExploreTrose } from './components/ExploreTrose';
import { TroseBestSellers } from './components/TroseBestSellers';
import { CoffeeFinderSection } from './components/CoffeeFinderSection';
import { FeaturedProducts } from './components/FeaturedProducts';
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
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AccountModal } from './components/AccountModal';
import { AboutModal } from './components/AboutModal';
import { CoffeeQuizModal } from './components/CoffeeQuizModal';
import { PolicyModal, PolicyTab } from './components/PolicyModal';
import { Toast } from './components/Toast';
import { MobileCheckoutBar } from './components/MobileCheckoutBar';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  
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

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [coffeeSubcategory, setCoffeeSubcategory] = useState<CoffeeSubcategory>('all');

  // Helper to parse URL on load and on browser back/forward popstate
  const parseUrlLocation = () => {
    try {
      const path = window.location.pathname.replace(/^\/+/, '').toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const urlPage = parseInt(params.get('page') || '1', 10);
      const initialPageNum = isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;
      const urlCat = params.get('category') as ProductCategory;
      const urlSubcat = params.get('subcategory') as CoffeeSubcategory;

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
      if (queryView && ['coffee', 'tea', 'mugs', 'machines', 'accessories', 'home-lifestyle', 'apparel', 'clothing', 'candles', 'shop'].includes(queryView)) {
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

  // Sync state to URL and history so back button and shareable links work
  const updateUrlHistory = (
    view: AppView,
    page: number = 1,
    category?: ProductCategory,
    subcat?: CoffeeSubcategory
  ) => {
    try {
      let path = '/';
      const params = new URLSearchParams();

      if (view === 'coffee') {
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

      if (page > 1 && view !== 'home') {
        params.set('page', String(page));
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${path}?${queryString}` : path;

      if (window.location.pathname + window.location.search !== newUrl) {
        window.history.pushState({ view, page, category, subcat }, '', newUrl);
      }
    } catch {
      // ignore
    }
  };

  // Initialize from URL and listen to browser Back / Forward events
  useEffect(() => {
    const loc = parseUrlLocation();
    if (loc.view !== 'home') {
      setCurrentView(loc.view);
      if (loc.category) setActiveCategory(loc.category);
      setPageNumber(loc.page);
    }

    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.view) {
        setCurrentView(e.state.view);
        if (e.state.category) setActiveCategory(e.state.category);
        if (e.state.subcat) setCoffeeSubcategory(e.state.subcat);
        setPageNumber(e.state.page || 1);
      } else {
        const parsed = parseUrlLocation();
        setCurrentView(parsed.view);
        if (parsed.category) setActiveCategory(parsed.category);
        if (parsed.subcategory) setCoffeeSubcategory(parsed.subcategory);
        setPageNumber(parsed.page);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleShopCoffeeCollection = (subcat: CoffeeSubcategory) => {
    setCoffeeSubcategory(subcat);
    setPageNumber(1);
    setCurrentView('coffee');
    setActiveCategory('coffee');
    updateUrlHistory('coffee', 1, 'coffee', subcat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: AppView, category?: ProductCategory, page: number = 1) => {
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
    setSelectedProduct(product);
    setCurrentView('product-detail');
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
    <div id="trose-app-root" className={`min-h-screen flex flex-col bg-[#FAF7F2] text-[#12100E] selection:bg-[#C5A059]/30 selection:text-[#12100E] ${currentView !== 'home' ? 'pb-14 sm:pb-0' : ''}`}>
      
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
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        cartCount={totalCartCount}
        availableCategories={availableCategories}
      />

      {/* Dynamic View Rendering */}
      <main className="flex-1">
        
        {/* VIEW 1: REUSABLE PRODUCT DETAIL PAGE */}
        {currentView === 'product-detail' && selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onBackToShop={(cat) => handleNavigate(cat === 'coffee' ? 'coffee' : 'shop', cat || 'all')}
            onSelectProduct={handleViewProductDetail}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        ) : currentView === 'coffee' ? (
          /* VIEW 2: DEDICATED PRIMARY COFFEE STOREFRONT */
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
            isLoading={isLoadingCatalogue}
          />
        ) : currentView === 'tea' || currentView === 'mugs' || currentView === 'machines' || currentView === 'accessories' || currentView === 'home-lifestyle' || currentView === 'apparel' || currentView === 'clothing' || currentView === 'candles' || currentView === 'other' ? (
          /* VIEW 3: DEDICATED CATEGORY PAGES IN STRICT PRIORITY ORDER */
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
          /* VIEW 4: COMPLETE FILTERABLE CATALOGUE WITH PAGINATION */
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
          /* VIEW 5: EDITORIAL HOME PAGE */
          <>
            {/* 1. P7.5 Hero (Left locked, Right rounded Bauhaus composition) */}
            <Hero
              onShopClick={() => handleNavigate('coffee')}
              onDiscoverClick={() => setIsAboutOpen(true)}
              onOpenQuiz={() => setIsQuizOpen(true)}
              featuredProduct={products.find((p) => p.department === 'coffee' && isStorefrontEligibleProduct(p)) || products[0]}
            />

            {/* 1. Explore Coffee Collections (5 Bauhaus Coffee Arches) */}
            <ShopOurCollections
              products={products}
              onShopCollection={handleShopCoffeeCollection}
              onViewAllCoffee={() => {
                handleShopCoffeeCollection('all');
              }}
            />

            {/* 2. Featured Coffee Products — Maximum 4 Roasts */}
            <TroseBestSellers
              products={products}
              onQuickView={handleViewProductDetail}
              onAddToCart={handleAddToCart}
              onExploreCoffee={() => handleNavigate('coffee')}
            />

            {/* 3. Find Your Trose Quiz Section */}
            <CoffeeFinderSection
              onOpenFinder={() => setIsQuizOpen(true)}
            />

            {/* 4. Explore Tea, Mugs and Accessories */}
            <div id="explore-gear-and-departments">
              {/* Category Quick Discovery Bar */}
              <CategoryDiscoveryBar
                categories={availableCategories}
                onSelectCategory={(catId) => handleNavigate(catId as AppView)}
                onOpenQuiz={() => setIsQuizOpen(true)}
              />

              {/* Department Products Showcase (Tea, Mugs, Gear, Accessories) */}
              <FeaturedProducts
                products={products}
                onQuickView={handleViewProductDetail}
                onAddToCart={handleAddToCart}
                onNavigateToCategory={(catId) => handleNavigate(catId as AppView)}
              />
            </div>

            {/* Desktop Subscription Tier & Editorial Imagery (hidden on mobile to prioritize shopping flow) */}
            <div className="hidden lg:block">
              <SubscriptionClub
                products={products}
                onSubscribe={handleSubscribe}
              />
              <EditorialImageStrip onLearnMore={() => setIsAboutOpen(true)} />
            </div>

            {/* 5. Short Our Story Preview (Mobile) / Full Collage (Desktop) */}
            <BrandStory
              onExploreStory={() => setIsAboutOpen(true)}
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
        onOpenAbout={() => setIsAboutOpen(true)}
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

      {/* Sticky Mobile Checkout Access Bar (active on shop/product views, never obstructs mobile homepage) */}
      {currentView !== 'home' && (
        <MobileCheckoutBar
          cart={cart}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {/* Global Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

    </div>
  );
}

