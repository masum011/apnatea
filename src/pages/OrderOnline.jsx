import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Search,
  ShieldAlert,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import Button from '../components/Button';
import { ProductGridSkeleton } from '../components/Skeletons';
import AgeGateBanner from '../components/order/AgeGateBanner';
import ProductCard from '../components/order/ProductCard';
import { ORDER_CATEGORIES, ORDER_PRODUCTS } from '../data/orderCatalogData';
import { ORDER_CONFIG } from '../data/orderConfig';
import { useCachedCatalog } from '../hooks/useCachedCatalog';
import { getSessionValue, setSessionValue } from '../utils/cacheManager';
import { calculateOrderTotals, formatCurrency } from '../utils/orderUtils';

const AGE_SESSION_KEY = 'apna_tea_age_verified_v1';

export default function OrderOnline({
  cartItems,
  onAddToCart,
  onUpdateQty,
  onOpenCart,
  onBackHome,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [ageVerified, setAgeVerified] = useState(() =>
    Boolean(getSessionValue(AGE_SESSION_KEY, false))
  );

  const { items: cachedProducts, isHydrating } = useCachedCatalog(
    'apna_tea_order_catalog',
    ORDER_PRODUCTS,
    ORDER_CONFIG
  );

  const totals = useMemo(
    () => calculateOrderTotals(cartItems, 'pickup'),
    [cartItems]
  );

  const cartQtyMap = useMemo(() => {
    const map = {};
    cartItems.forEach((item) => {
      map[item.id] = item.quantity;
    });
    return map;
  }, [cartItems]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return cachedProducts.filter((product) => {
      if (selectedCategory === 'all' && product.restricted) {
        return false;
      }
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      if (q) {
        return (
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.categoryLabel.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [cachedProducts, selectedCategory, searchQuery]);

  const handleConfirmAge = () => {
    setAgeVerified(true);
    setSessionValue(AGE_SESSION_KEY, true);
  };

  const isSmokingCategory = selectedCategory === 'smoking-products';

  return (
    <div className="min-h-screen bg-[#F6EBDD] pt-16 md:pt-20 pb-24 sm:pb-16">
      {/* Ordering Storefront Header */}
      <section className="bg-[#321B13] text-[#FFFDF8] border-b border-[#C88B36]/25 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <button
                type="button"
                onClick={onBackHome}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E59F29] hover:text-[#f5b94c] transition-colors cursor-pointer mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Back to Apna Tea Homepage</span>
              </button>

              <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
                Order Online from <span className="text-[#E59F29]">Apna Tea</span>
              </h1>

              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-[#F6EBDD]/80">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E59F29]" aria-hidden="true" />
                  <span>{ORDER_CONFIG.outletAddress}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#E59F29]" aria-hidden="true" />
                  <span>
                    Pickup or Local Delivery (Free over{' '}
                    {formatCurrency(ORDER_CONFIG.delivery.freeDeliveryAbove)})
                  </span>
                </span>
              </div>
            </div>

            {/* Search & Cart Trigger */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search
                  className="w-4 h-4 text-[#F6EBDD]/55 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chai, drinks, snacks..."
                  aria-label="Search ordering catalogue"
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#22110B] border border-[#C88B36]/30 text-sm text-[#FFFDF8] placeholder:text-[#F6EBDD]/50 focus:outline-none focus:border-[#E59F29]"
                />
              </div>

              <Button variant="primary" size="md" onClick={onOpenCart}>
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                <span>
                  Cart ({totals.itemCount}) · {formatCurrency(totals.subtotal)}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Bar */}
      <div className="bg-[#FBF5EC] border-b border-[#6B3D25]/15 sticky top-16 md:top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto">
          <div
            className="flex items-center gap-2 min-w-max"
            role="tablist"
            aria-label="Product Categories"
          >
            {ORDER_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? category.restricted
                        ? 'bg-[#A83224] text-[#FFFDF8]'
                        : 'bg-[#321B13] text-[#FFFDF8]'
                      : category.restricted
                        ? 'bg-[#FFFDF8] text-[#A83224] border border-[#A83224]/30 hover:border-[#A83224]'
                        : 'bg-[#FFFDF8] text-[#6B3D25] border border-[#6B3D25]/20 hover:border-[#6B3D25]/50'
                  }`}
                >
                  {category.restricted && (
                    <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Catalogue Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8" aria-label="Product Catalogue">
        <h2 className="sr-only">Product Catalogue</h2>

        {isSmokingCategory && !ageVerified ? (
          <AgeGateBanner
            onConfirmAge={handleConfirmAge}
            onReturnToMenu={() => setSelectedCategory('all')}
          />
        ) : isHydrating ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <>
            {isSmokingCategory && ageVerified && (
              <div className="mb-6 rounded-xl bg-[#321B13] text-[#FFFDF8] border border-[#A83224]/50 px-4 py-3 flex items-center gap-3 text-xs sm:text-sm">
                <ShieldAlert className="w-5 h-5 text-[#E59F29] shrink-0" aria-hidden="true" />
                <p className="text-[#F6EBDD]/90">{ORDER_CONFIG.legal.smokingWarning}</p>
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl bg-[#FFFDF8] border border-[#6B3D25]/15 p-10 text-center max-w-md mx-auto my-8">
                <p className="font-display text-xl font-bold text-[#321B13]">
                  No Matching Products
                </p>
                <p className="text-xs sm:text-sm text-[#6B3D25]/80 mt-1.5">
                  Try clearing your search or switching to another product category.
                </p>
                <Button
                  variant="outlineDark"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-4"
                >
                  <span>Reset Filters</span>
                </Button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantityInCart={cartQtyMap[product.id] || 0}
                      onAdd={onAddToCart}
                      onUpdateQty={onUpdateQty}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </section>

      {/* Compact Mobile Sticky Cart Bar (only when items exist) */}
      <AnimatePresence>
        {totals.itemCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-[#321B13] text-[#FFFDF8] border-t border-[#C88B36]/30 px-4 py-2.5 flex items-center justify-between gap-3 shadow-2xl"
          >
            <div className="tabular-nums">
              <p className="text-xs text-[#E59F29] font-semibold">
                {totals.itemCount} {totals.itemCount === 1 ? 'Item' : 'Items'} Added
              </p>
              <p className="text-sm font-bold text-[#FFFDF8]">
                {formatCurrency(totals.subtotal)}
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={onOpenCart}>
              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
              <span>View Cart</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
