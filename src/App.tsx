import React, { useState, useEffect } from 'react';
import { PRODUCTS, REVIEWS } from './data/products';
import { Product, ProductCategory, CartItem, GrindOption, AppView } from './types';
import { fetchLiveShopifyCatalogue, ShopifyCollection } from './services/shopify';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EditorialImageStrip } from './components/EditorialImageStrip';
import { ShopOurCollections } from './components/ShopOurCollections';
import { ExploreTrose } from './components/ExploreTrose';
import { TroseBestSellers } from './components/TroseBestSellers';
import { CoffeeFinderSection } from './components/CoffeeFinderSection';
import { FeaturedProducts } from './components/FeaturedProducts';
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

  const handleNavigate = (view: AppView, category?: ProductCategory) => {
    if (category) {
      setActiveCategory(category);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <div id="trose-app-root" className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#12100E] selection:bg-[#C5A059]/30 selection:text-[#12100E]">
      
      {/* Top Announcement Bar */}
      <AnnouncementBar onOpenQuiz={() => setIsQuizOpen(true)} />

      {/* Sticky Navigation Bar */}
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
      />

      {/* Dynamic View Rendering */}
      <main className="flex-1">
        
        {/* VIEW 1: REUSABLE PRODUCT DETAIL PAGE */}
        {currentView === 'product-detail' && selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onBackToShop={(cat) => handleNavigate('shop', cat || 'all')}
            onSelectProduct={handleViewProductDetail}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        ) : currentView === 'shop' ? (
          /* VIEW 2: COMPLETE SHOP PAGE WITH FILTERS & SORTING */
          <ShopPage
            products={products}
            initialCategory={activeCategory}
            onSelectProduct={handleViewProductDetail}
            onAddToCart={handleAddToCart}
            onNavigateHome={() => handleNavigate('home')}
            isLoading={isLoadingCatalogue}
            isShopifyLive={isShopifyLive}
          />
        ) : (
          /* VIEW 3: EDITORIAL HOME PAGE */
          <>
            {/* 1. Master Reference Hero */}
            <Hero
              onShopClick={(cat) => handleNavigate('shop', cat || 'all')}
              onDiscoverClick={() => setIsAboutOpen(true)}
              onOpenQuiz={() => setIsQuizOpen(true)}
              featuredProduct={products.find((p) => p.category === 'coffee') || products[0]}
            />

            {/* 2. Master Reference Editorial Image Strip */}
            <EditorialImageStrip onLearnMore={() => setIsAboutOpen(true)} />

            {/* 3. Master Reference Shop Our Collections (5 Colored Arches) */}
            <ShopOurCollections
              onShopCollection={(cat) => handleNavigate('shop', cat)}
            />

            {/* 4. Master Reference Coffee Finder Section */}
            <CoffeeFinderSection
              onOpenFinder={() => setIsQuizOpen(true)}
            />

            {/* 5. Real Shopify Best Sellers & Products */}
            <TroseBestSellers
              products={products}
              onQuickView={handleViewProductDetail}
              onAddToCart={handleAddToCart}
              onExploreAll={() => handleNavigate('shop', 'all')}
            />

            {/* 6. Filterable Products & Roasts Showcase */}
            <FeaturedProducts
              products={products}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              onQuickView={handleViewProductDetail}
              onAddToCart={handleAddToCart}
            />

            {/* 7. Prosumer Espresso Machines & Precision Accessories */}
            <MachinesAndAccessories
              products={products}
              onQuickView={handleViewProductDetail}
              onAddToCart={(product) => handleAddToCart(product, undefined, 1)}
              onExploreGear={() => handleNavigate('shop', 'machines')}
            />

            {/* 8. Roaster's Club Subscription Tier (Editorial Discovery) */}
            <SubscriptionClub
              products={products}
              onSubscribe={handleSubscribe}
            />

            {/* 9. Brand Philosophy & Heritage Section */}
            <BrandStory
              onExploreStory={() => setIsAboutOpen(true)}
              onShopCoffee={() => handleNavigate('shop', 'coffee')}
            />
          </>
        )}

      </main>

      {/* Luxury Editorial Footer */}
      <Footer
        onSelectCategory={(cat) => handleNavigate('shop', cat)}
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
        onExploreShop={() => handleNavigate('shop', 'all')}
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
          handleNavigate('shop', 'coffee');
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

