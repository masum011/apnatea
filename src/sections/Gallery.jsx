import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';
import SectionHeading from '../components/SectionHeading';
import { useGsapContext } from '../hooks/useGsapScroll';

const GALLERY_ITEMS = [
  {
    id: 'outlet-main',
    src: '/images/apna-tea-outlet.jpeg',
    webpSrc: '/images/apna-tea-outlet.webp',
    webpSrcSet: '/images/apna-tea-outlet-480w.webp 480w, /images/apna-tea-outlet.webp 1200w',
    width: 1200,
    height: 900,
    alt: 'Apna Amruttulya outlet at Ashapur Road, Chanchal, Malda Division during evening service',
    caption: 'Apna Amruttulya Outlet · Ashapur Road, Chanchal',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    id: 'adrak-chai-gal',
    src: '/images/adrak-chai.jpeg',
    webpSrc: '/images/adrak-chai.webp',
    webpSrcSet: '/images/adrak-chai-480w.webp 480w, /images/adrak-chai.webp 960w',
    width: 960,
    height: 960,
    alt: 'Hot Adrak Chai served with crushed ginger, cardamom, and jaggery',
    caption: 'Traditional Adrak Chai',
    span: '',
  },
  {
    id: 'lemon-tea-gal',
    src: '/images/lemon-tea.jpeg',
    webpSrc: '/images/lemon-tea.webp',
    webpSrcSet: '/images/lemon-tea-480w.webp 480w, /images/lemon-tea.webp 680w',
    width: 680,
    height: 1018,
    alt: 'Freshly brewed Lemon Tea with lemon slices and crispy namakpara',
    caption: 'Zesty Lemon Tea & Snacks',
    span: '',
  },
  {
    id: 'green-tea-gal',
    src: '/images/green-tea.jpeg',
    webpSrc: '/images/green-tea.webp',
    webpSrcSet: '/images/green-tea-480w.webp 480w, /images/green-tea.webp 480w',
    width: 480,
    height: 640,
    alt: 'Clear golden-green tea in glass cup with fresh tea leaf garnish',
    caption: 'Pure Botanical Green Tea',
    span: '',
  },
  {
    id: 'chocolate-tea-gal',
    src: '/images/chocolate-tea.jpeg',
    webpSrc: '/images/chocolate-tea.webp',
    webpSrcSet: '/images/chocolate-tea-480w.webp 480w, /images/chocolate-tea.webp 960w',
    width: 960,
    height: 960,
    alt: 'Creamy Chocolate Tea topped with dark chocolate shavings and cinnamon',
    caption: 'Signature Chocolate Tea',
    span: '',
  },
  {
    id: 'special-chai-gal',
    src: '/images/special-chai.jpeg',
    webpSrc: '/images/special-chai.webp',
    webpSrcSet: '/images/special-chai-480w.webp 480w, /images/special-chai.webp 600w',
    width: 600,
    height: 900,
    alt: 'Frothy Special Chai in a turquoise cup with butter biscuits',
    caption: 'Special Chai & Biscuits',
    span: 'md:col-span-2',
  },
];

export default function Gallery() {
  const galleryRef = useRef(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useGsapContext(galleryRef, (gsap) => {
    gsap.fromTo(
      '.gallery-tile',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );
  });

  const activeItem = lightboxIdx !== null ? GALLERY_ITEMS[lightboxIdx] : null;

  const goPrev = () => {
    setLightboxIdx((idx) => (idx === 0 ? GALLERY_ITEMS.length - 1 : idx - 1));
  };

  const goNext = () => {
    setLightboxIdx((idx) => (idx === GALLERY_ITEMS.length - 1 ? 0 : idx + 1));
  };

  return (
    <section id="gallery" ref={galleryRef} className="bg-[#FBF5EC] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="OUTLET GALLERY"
          title="Inside"
          accentTitle="Apna Tea"
          subtitle="Real moments from our Chanchal outlet and the freshly brewed cups we serve every day."
          align="center"
        />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[210px] sm:auto-rows-[220px]">
          {GALLERY_ITEMS.map((item, idx) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setLightboxIdx(idx)}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className={`gallery-tile group relative rounded-2xl overflow-hidden border border-[#6B3D25]/15 bg-[#321B13] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E59F29] ${item.span}`}
            >
              <OptimizedImage
                src={item.src}
                webpSrc={item.webpSrc}
                webpSrcSet={item.webpSrcSet}
                sizes={idx === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 25vw'}
                width={item.width}
                height={item.height}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#22110B]/85 via-black/15 to-transparent opacity-80 group-hover:opacity-95 transition-opacity pointer-events-none"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-2 pointer-events-none">
                <p className="text-xs sm:text-sm font-semibold text-[#FFFDF8] leading-snug">
                  {item.caption}
                </p>
                <span className="w-8 h-8 rounded-full bg-[#FFFDF8]/15 backdrop-blur-sm text-[#FFFDF8] flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Expand className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIdx(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#140A07]/90 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.caption}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-[#22110B] border border-[#C88B36]/30 shadow-2xl"
            >
              <div className="relative aspect-[16/10] max-h-[75vh] w-full bg-[#140A07]">
                <OptimizedImage
                  src={activeItem.src}
                  webpSrc={activeItem.webpSrc}
                  webpSrcSet={activeItem.webpSrcSet}
                  sizes="(max-width: 928px) calc(100vw - 32px), 896px"
                  width={activeItem.width}
                  height={activeItem.height}
                  priority={true}
                  alt={activeItem.alt}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="px-5 py-4 flex items-center justify-between gap-4 bg-[#22110B] border-t border-[#C88B36]/20">
                <p className="text-sm font-medium text-[#FFFDF8]">{activeItem.caption}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous photo"
                    className="w-9 h-9 rounded-full bg-[#321B13] border border-[#C88B36]/30 text-[#FFFDF8] flex items-center justify-center hover:border-[#E59F29] cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next photo"
                    className="w-9 h-9 rounded-full bg-[#321B13] border border-[#C88B36]/30 text-[#FFFDF8] flex items-center justify-center hover:border-[#E59F29] cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightboxIdx(null)}
                    aria-label="Close lightbox"
                    className="w-9 h-9 rounded-full bg-[#A83224] text-[#FFFDF8] flex items-center justify-center hover:bg-[#8c271b] cursor-pointer ml-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
