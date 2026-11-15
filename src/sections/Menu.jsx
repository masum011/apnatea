import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronUp, Coffee, X } from 'lucide-react';
import Button from '../components/Button';
import OptimizedImage from '../components/OptimizedImage';
import SectionHeading from '../components/SectionHeading';
import {
  FEATURED_MENU,
  MENU_CATEGORIES,
  SNACKS_AND_BEVERAGES,
} from '../data/menuData';
import { useCachedCatalog } from '../hooks/useCachedCatalog';
import { useGsapContext } from '../hooks/useGsapScroll';

export default function Menu({ onEnquireClick }) {
  const menuRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAllSnacks, setShowAllSnacks] = useState(true);
  const [selectedTea, setSelectedTea] = useState(null);

  const { items: cachedFeaturedMenu } = useCachedCatalog(
    'apna_tea_featured_menu',
    FEATURED_MENU
  );
  const { items: cachedSnacks } = useCachedCatalog(
    'apna_tea_snacks_menu',
    SNACKS_AND_BEVERAGES
  );

  useGsapContext(menuRef, (gsap) => {
    gsap.fromTo(
      '.menu-card-reveal',
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.menu-grid-trigger',
          start: 'top 88%',
          once: true,
        },
      }
    );
  });

  const filteredItems = useMemo(
    () =>
      activeCategory === 'all'
        ? cachedFeaturedMenu
        : cachedFeaturedMenu.filter((item) => item.category === activeCategory),
    [activeCategory, cachedFeaturedMenu]
  );

  return (
    <section id="menu" ref={menuRef} className="bg-[#F6EBDD] pb-16 sm:pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="md:flex-1">
            <SectionHeading
              eyebrow="OUR MENU"
              title="Our Special"
              accentTitle="Chai & Beverages"
              align="center"
            />
          </div>

          <div className="flex justify-center md:justify-end shrink-0">
            <Button
              variant="outlineDark"
              size="sm"
              onClick={() => setShowAllSnacks((prev) => !prev)}
            >
              <span>{showAllSnacks ? 'Hide Snacks List' : 'View Full Menu'}</span>
              {showAllSnacks ? (
                <ChevronUp className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Menu Categories"
        >
          {MENU_CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#321B13] text-[#FFFDF8] shadow-sm'
                    : 'bg-[#FFFDF8] text-[#6B3D25] border border-[#6B3D25]/20 hover:border-[#6B3D25]/45'
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* 5 Signature Tea Cards Grid */}
        <motion.div
          layout
          className={`menu-grid-trigger mt-8 grid gap-5 ${
            filteredItems.length === 5
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
              : filteredItems.length === 1
                ? 'grid-cols-1 max-w-sm mx-auto'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto'
          }`}
        >
          {filteredItems.map((item) => (
            <motion.article
              layout
              key={item.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedTea(item)}
              className="menu-card-reveal group cursor-pointer rounded-2xl bg-[#FFFDF8] border border-[#6B3D25]/12 shadow-[0_8px_24px_rgba(50,27,19,0.06)] hover:shadow-[0_14px_34px_rgba(50,27,19,0.12)] overflow-hidden flex flex-col"
            >
              <div className="p-2.5 pb-0">
                <div className="aspect-[4/3] sm:aspect-square w-full overflow-hidden rounded-xl bg-[#F6EBDD]">
                  <OptimizedImage
                    src={item.image}
                    webpSrc={item.webpSrc}
                    webpSrcSet={item.webpSrcSet}
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 18vw"
                    width={item.width}
                    height={item.height}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="p-4 text-center flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#321B13] group-hover:text-[#A83224] transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#6B3D25]/80 line-clamp-2 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <p className="mt-3 pt-2.5 border-t border-[#6B3D25]/10 text-[11px] font-semibold text-[#C88B36]">
                  View Tasting Notes
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Snacks and Other Beverages Section */}
        <AnimatePresence initial={false}>
          {showAllSnacks && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-12 rounded-2xl bg-[#FFFDF8] border border-[#6B3D25]/15 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#6B3D25]/12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C88B36]">
                    Daily Counter Offerings
                  </p>
                  <h3 className="font-display text-2xl font-bold text-[#321B13] mt-0.5">
                    Snacks &amp; Other Beverages
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#6B3D25]/85">
                  Freshly prepared daily at our Ashapur Road outlet
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cachedSnacks.map((snack) => (
                  <div
                    key={snack.id}
                    className="rounded-xl bg-[#FBF5EC] border border-[#6B3D25]/10 p-4 flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#321B13] text-[#E59F29] flex items-center justify-center shrink-0 mt-0.5">
                      <Coffee className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A83224]">
                        {snack.type}
                      </p>
                      <h4 className="font-sans text-sm font-bold text-[#321B13] mt-0.5">
                        {snack.name}
                      </h4>
                      <p className="text-xs text-[#6B3D25]/85 mt-1 leading-relaxed">
                        {snack.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Tasting Detail Modal */}
      <AnimatePresence>
        {selectedTea && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTea(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#160B07]/75 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tea-detail-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl overflow-hidden bg-[#FFFDF8] border border-[#6B3D25]/20 shadow-2xl"
            >
              <div className="relative aspect-[4/3] w-full bg-[#321B13]">
                <OptimizedImage
                  src={selectedTea.image}
                  webpSrc={selectedTea.webpSrc}
                  webpSrcSet={selectedTea.webpSrcSet}
                  sizes="(max-width: 480px) calc(100vw - 32px), 448px"
                  width={selectedTea.width}
                  height={selectedTea.height}
                  alt={selectedTea.alt}
                  priority={true}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setSelectedTea(null)}
                  aria-label="Close tasting details"
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#22110B]/80 text-[#FFFDF8] flex items-center justify-center hover:bg-[#22110B] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C88B36]">
                  {selectedTea.servingNote}
                </p>
                <h3
                  id="tea-detail-title"
                  className="font-display text-2xl font-bold text-[#321B13] mt-1"
                >
                  {selectedTea.name}
                </h3>
                <p className="mt-2.5 text-sm text-[#6B3D25] leading-relaxed">
                  {selectedTea.description}
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedTea(null);
                      const contactEl = document.getElementById('contact');
                      if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1"
                  >
                    <span>Visit Outlet</span>
                  </Button>
                  <Button
                    variant="outlineDark"
                    size="sm"
                    onClick={() => {
                      setSelectedTea(null);
                      if (onEnquireClick) onEnquireClick('outlet');
                    }}
                    className="flex-1"
                  >
                    <span>Bulk / Event Order</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
