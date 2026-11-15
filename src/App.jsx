import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { OrderPageSkeleton, SectionSkeleton } from './components/Skeletons';
import WhatsAppButton from './components/WhatsAppButton';
import { useSeoMetadata } from './hooks/useSeoMetadata';
import About from './sections/About';
import Benefits from './sections/Benefits';
import Hero from './sections/Hero';
import Menu from './sections/Menu';
import Outlet from './sections/Outlet';

const OrderOnline = lazy(() => import('./pages/OrderOnline'));
const CartDrawer = lazy(() => import('./components/order/CartDrawer'));
const FranchiseModal = lazy(() => import('./components/FranchiseModal'));
const Franchise = lazy(() => import('./sections/Franchise'));
const Process = lazy(() => import('./sections/Process'));
const Gallery = lazy(() => import('./sections/Gallery'));
const Contact = lazy(() => import('./sections/Contact'));

const CART_STORAGE_KEY = 'apna_tea_cart_v1';

function loadInitialCart() {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const activePage = location.pathname === '/order' ? 'order' : 'home';
  const [cartItems, setCartItems] = useState(loadInitialCart);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [enquiryModal, setEnquiryModal] = useState({ open: false, type: 'franchise' });
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  useSeoMetadata(activePage);

  useEffect(() => {
    const handleQuota = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') return;

    const destination =
      location.hash === '#/order'
        ? '/order'
        : `/home${
            location.hash && location.hash !== '#home' && !location.hash.startsWith('#/')
              ? location.hash
              : ''
          }`;
    navigate(destination, { replace: true });
  }, [location.hash, location.pathname, navigate]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage failures in restricted contexts
    }
  }, [cartItems]);

  const navigateTo = useCallback((page, sectionId) => {
    if (page === 'order') {
      navigate('/order');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'home') {
      if (location.pathname !== '/home' || location.hash) {
        navigate('/home');
      }
    } else if (location.pathname !== '/home') {
      navigate(sectionId ? `/home#${sectionId}` : '/home');
    }

    if (sectionId) {
      window.setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash, location.pathname, navigate]);

  const handleAddToCart = useCallback((product) => {
    if (!product.available) return;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const handleUpdateQty = useCallback((productId, nextQty) => {
    if (nextQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: nextQty } : item))
    );
  }, []);

  const handleRemoveItem = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const openEnquiry = useCallback((type = 'franchise') => {
    setEnquiryModal({ open: true, type });
  }, []);

  const closeEnquiry = useCallback(() => {
    setEnquiryModal((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#F6EBDD] text-[#321B13]">
        {mapsQuotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        <Navbar
          activePage={activePage}
          cartCount={cartCount}
          onNavigate={navigateTo}
          onOpenEnquiry={openEnquiry}
          onOpenCart={() => setCartDrawerOpen(true)}
        />

        <main className="flex-1">
          {activePage === 'order' ? (
            <Suspense fallback={<OrderPageSkeleton />}>
              <OrderOnline
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                onUpdateQty={handleUpdateQty}
                onOpenCart={() => setCartDrawerOpen(true)}
                onBackHome={() => navigateTo('home', 'home')}
              />
            </Suspense>
          ) : (
            <>
              <Hero />
              <Benefits />
              <About />
              <Menu onEnquireClick={openEnquiry} />
              <Outlet />
              <Suspense fallback={<SectionSkeleton dark={true} />}>
                <Franchise onOpenEnquiry={openEnquiry} />
              </Suspense>
              <Suspense fallback={<SectionSkeleton dark={false} />}>
                <Process />
              </Suspense>
              <Suspense fallback={<SectionSkeleton dark={false} />}>
                <Gallery />
              </Suspense>
              <Suspense fallback={<SectionSkeleton dark={true} />}>
                <Contact onOpenEnquiry={openEnquiry} />
              </Suspense>
            </>
          )}
        </main>

        <Footer onNavigate={navigateTo} />

        {activePage === 'home' && <WhatsAppButton variant="floating" />}

        <Suspense fallback={null}>
          {cartDrawerOpen && (
            <CartDrawer
              isOpen={cartDrawerOpen}
              onClose={() => setCartDrawerOpen(false)}
              cartItems={cartItems}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
            />
          )}
        </Suspense>

        <Suspense fallback={null}>
          {enquiryModal.open && (
            <FranchiseModal
              isOpen={enquiryModal.open}
              initialType={enquiryModal.type}
              onClose={closeEnquiry}
            />
          )}
        </Suspense>
      </div>
    </MotionConfig>
  );
}
