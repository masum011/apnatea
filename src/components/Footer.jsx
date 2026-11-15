import { Facebook, Instagram, MessageCircle, Youtube } from 'lucide-react';
import ApnaTeaLogo from './ApnaTeaLogo';
import { OUTLET_CONFIG } from '../data/contactData';
import { buildWhatsAppUrl } from '../utils/contactActions';

const FOOTER_NAV = [
  { id: 'home', label: 'Home', href: '#home', page: 'home' },
  { id: 'menu', label: 'Menu', href: '#menu', page: 'home' },
  { id: 'order', label: 'Order Online', href: '#/order', page: 'order' },
  { id: 'outlet', label: 'Our Outlet', href: '#outlet', page: 'home' },
  { id: 'franchise', label: 'Franchise', href: '#franchise', page: 'home' },
  { id: 'contact', label: 'Contact', href: '#contact', page: 'home' },
];

export default function Footer({ onNavigate }) {
  const handleScroll = (e, link) => {
    e.preventDefault();
    if (link.page === 'order') {
      if (onNavigate) onNavigate('order');
      return;
    }
    if (onNavigate) {
      onNavigate('home', link.id);
      return;
    }
    const el = document.querySelector(link.href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="bg-[#22110B] text-[#F6EBDD] border-t border-[#C88B36]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <a
            href="#home"
            onClick={(e) => handleScroll(e, FOOTER_NAV[0])}
            aria-label="Back to top"
          >
            <ApnaTeaLogo showTagline={true} size="md" />
          </a>
          <span
            className="hidden sm:block h-8 w-px bg-[#C88B36]/25 mx-2"
            aria-hidden="true"
          />
          <p className="text-xs text-[#F6EBDD]/70 max-w-xs leading-relaxed">
            {OUTLET_CONFIG.franchiseName} Outlet · {OUTLET_CONFIG.address.full}
          </p>
        </div>

        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#F6EBDD]/85"
        >
          {FOOTER_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleScroll(e, item)}
              className="hover:text-[#E59F29] transition-colors whitespace-nowrap shrink-0"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="w-9 h-9 rounded-full bg-[#1F9D55] text-[#FFFDF8] flex items-center justify-center hover:bg-[#198748] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <a
            href="#gallery"
            onClick={(e) => handleScroll(e, '#gallery')}
            aria-label="View Outlet Gallery"
            className="w-9 h-9 rounded-full bg-[#321B13] border border-[#C88B36]/30 text-[#F6EBDD] flex items-center justify-center hover:border-[#E59F29] hover:text-[#E59F29] transition-colors"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="#outlet"
            onClick={(e) => handleScroll(e, '#outlet')}
            aria-label="Our Outlet"
            className="w-9 h-9 rounded-full bg-[#321B13] border border-[#C88B36]/30 text-[#F6EBDD] flex items-center justify-center hover:border-[#E59F29] hover:text-[#E59F29] transition-colors"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="#about"
            onClick={(e) => handleScroll(e, '#about')}
            aria-label="About Apna Tea"
            className="w-9 h-9 rounded-full bg-[#321B13] border border-[#C88B36]/30 text-[#F6EBDD] flex items-center justify-center hover:border-[#E59F29] hover:text-[#E59F29] transition-colors"
          >
            <Youtube className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="border-t border-[#C88B36]/12 bg-[#1A0C08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#F6EBDD]/55">
          <p>
            © {new Date().getFullYear()} {OUTLET_CONFIG.brandName} ({OUTLET_CONFIG.franchiseName}).
            All rights reserved.
          </p>
          <p>{OUTLET_CONFIG.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
