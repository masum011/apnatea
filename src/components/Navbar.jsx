import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, ShoppingBag, Store, X } from 'lucide-react';
import ApnaTeaLogo from './ApnaTeaLogo';
import Button from './Button';

const NAV_LINKS = [
  { id: 'home', label: 'Home', href: '/home', page: 'home' },
  { id: 'menu', label: 'Menu', href: '#menu', page: 'home' },
  { id: 'order', label: 'Order Online', href: '/order', page: 'order' },
  { id: 'outlet', label: 'Our Outlet', href: '#outlet', page: 'home' },
  { id: 'franchise', label: 'Franchise', href: '#franchise', page: 'home' },
  { id: 'contact', label: 'Contact', href: '#contact', page: 'home' },
];

export default function Navbar({
  activePage = 'home',
  cartCount = 0,
  onNavigate,
  onOpenEnquiry,
  onOpenCart,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState('home');

  useEffect(() => {
    if (activePage === 'order') {
      setActiveId('order');
      setScrolled(true);
      return undefined;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 28);

      const sectionLinks = NAV_LINKS.filter((item) => item.page === 'home');
      const offsets = sectionLinks.map((item) => {
        const el = document.getElementById(item.id);
        if (!el) return { id: item.id, top: Infinity };
        return { id: item.id, top: Math.abs(el.getBoundingClientRect().top - 110) };
      });

      const closest = offsets.reduce((min, cur) => (cur.top < min.top ? cur : min), offsets[0]);
      if (closest) setActiveId(closest.id);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activePage]);

  const handleNavClick = (e, link) => {
    e.preventDefault();
    setMobileOpen(false);

    if (link.page === 'order') {
      setActiveId('order');
      if (onNavigate) onNavigate('order');
      return;
    }

    setActiveId(link.id);
    if (onNavigate) {
      onNavigate('home', link.id);
    } else {
      const target = document.querySelector(link.href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled || activePage === 'order'
          ? 'bg-[#22110B]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.28)] border-b border-[#C88B36]/20'
          : 'bg-gradient-to-b from-[#22110B]/95 via-[#22110B]/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-6">
        <a
          href="/home"
          onClick={(e) => handleNavClick(e, NAV_LINKS[0])}
          className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E59F29] rounded-md"
          aria-label="Apna Tea Home"
        >
          <ApnaTeaLogo showTagline={false} size="md" />
        </a>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary Navigation">
          {NAV_LINKS.map((link) => {
            const isActive =
              activePage === 'order' ? link.id === 'order' : activeId === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E59F29] ${
                  isActive ? 'text-[#E59F29]' : 'text-[#F6EBDD]/90 hover:text-[#FFFDF8]'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#E59F29] rounded-full"
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {activePage === 'order' ? (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenCart}
              className="hidden sm:inline-flex"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span className="tabular-nums">Cart ({cartCount})</span>
            </Button>
          ) : (
            <>
              <div className="lg:hidden">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate('order')}
                  ariaLabel="Order Online"
                >
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Order Online</span>
                  <span className="sm:hidden">Order</span>
                </Button>
              </div>
              <div className="hidden lg:block">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onOpenEnquiry('franchise')}
                >
                  <Store className="w-4 h-4" aria-hidden="true" />
                  <span>Enquire Franchise</span>
                </Button>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#C88B36]/35 bg-[#321B13]/85 text-[#FFFDF8] hover:border-[#E59F29] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-[#22110B] border-b border-[#C88B36]/25 px-4 pb-5 pt-2 shadow-2xl"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
              {NAV_LINKS.map((link) => {
                const isActive =
                  activePage === 'order' ? link.id === 'order' : activeId === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#321B13] text-[#E59F29]'
                        : 'text-[#F6EBDD] hover:bg-[#321B13]/70'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-[#C88B36]/20 flex flex-col gap-2">
              {activePage === 'order' ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenCart();
                  }}
                  className="w-full"
                >
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                  <span className="tabular-nums">View Cart ({cartCount})</span>
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenEnquiry('franchise');
                  }}
                  className="w-full"
                >
                  <Store className="w-4 h-4" aria-hidden="true" />
                  <span>Enquire Franchise</span>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
