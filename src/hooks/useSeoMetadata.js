import { useEffect } from 'react';

const SEO_BY_PAGE = {
  home: {
    title: 'Apna Tea | Har Cup Mein Apnapan – Chai & Snacks in Chanchal, Malda',
    description:
      'Visit Apna Tea (Apna Amruttulya) on Ashapur Road, Chanchal, Malda Division for freshly brewed chai, snacks, cold drinks, and franchise enquiries.',
  },
  order: {
    title: 'Order Online | Apna Tea – Chai, Drinks & Snacks in Chanchal, Malda',
    description:
      'Order fresh Adrak Chai, Special Chai, Lemon Tea, Green Tea, soft drinks, energy drinks, and crispy snacks online for pickup or delivery via WhatsApp.',
  },
};

function setMetaContent(selector, content) {
  const el = document.querySelector(selector);
  if (el && content) {
    el.setAttribute('content', content);
  }
}

export function useSeoMetadata(activePage) {
  useEffect(() => {
    const meta = SEO_BY_PAGE[activePage] || SEO_BY_PAGE.home;
    document.title = meta.title;

    setMetaContent('meta[name="description"]', meta.description);
    setMetaContent('meta[property="og:title"]', meta.title);
    setMetaContent('meta[property="og:description"]', meta.description);
    setMetaContent('meta[name="twitter:title"]', meta.title);
    setMetaContent('meta[name="twitter:description"]', meta.description);

    const origin = window.location.origin;
    const canonicalHref =
      activePage === 'order' ? `${origin}/order` : `${origin}/home`;

    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalHref);

    setMetaContent('meta[property="og:url"]', canonicalHref);
    setMetaContent('meta[property="og:image"]', `${origin}/og-apna-tea.jpg`);
    setMetaContent('meta[name="twitter:image"]', `${origin}/og-apna-tea.jpg`);
  }, [activePage]);
}
