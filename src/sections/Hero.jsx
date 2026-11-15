import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Coffee, Leaf, MapPin } from 'lucide-react';
import Button from '../components/Button';
import OptimizedImage from '../components/OptimizedImage';
import { useGsapContext } from '../hooks/useGsapScroll';

const textContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.08,
    },
  },
};

const textItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero() {
  const heroRef = useRef(null);
  const imageWrapRef = useRef(null);
  const photoRef = useRef(null);

  useGsapContext(heroRef, (gsap) => {
    // Subtle cinematic zoom-settle on hero cup showcase without delaying LCP paint
    gsap.fromTo(
      imageWrapRef.current,
      { scale: 1.035 },
      { scale: 1, duration: 0.85, ease: 'power3.out' }
    );

    // Subtle scroll-driven depth parallax on the tea photograph
    gsap.to(photoRef.current, {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative overflow-hidden bg-[#22110B] pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24"
      style={{
        backgroundImage:
          "linear-gradient(rgba(34, 17, 11, 0.76), rgba(34, 17, 11, 0.76)), url('/images/apna-tea-outlet.webp')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      {/* Atmospheric warm spice radial backdrop */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,rgba(200,139,54,0.22),transparent_60%),radial-gradient(circle_at_15%_30%,rgba(168,50,36,0.16),transparent_50%)]"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-8">
          {/* Left Typography Column — Framer Motion */}
          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 z-10 text-left"
          >
            <motion.div
              variants={textItemVariants}
              className="inline-flex items-center gap-2 text-[#E59F29] mb-4"
            >
              <span className="font-display italic text-lg sm:text-xl tracking-wide">
                A Cup Full of Happiness
              </span>
              <Leaf className="w-4 h-4 text-[#C88B36]" aria-hidden="true" />
            </motion.div>

            <motion.h1
              variants={textItemVariants}
              className="font-display font-bold text-[#FFFDF8] leading-[1.06] tracking-tight text-[clamp(2.5rem,5.2vw,4.35rem)]"
            >
              Har Cup Mein{' '}
              <span className="block italic text-[#E59F29] mt-1">Apnapan</span>
            </motion.h1>

            <motion.p
              variants={textItemVariants}
              className="mt-5 text-base sm:text-lg text-[#F6EBDD]/85 leading-relaxed max-w-lg"
            >
              Freshly brewed chai, refreshing beverages and delicious snacks at your nearby{' '}
              <span className="text-[#E59F29] font-semibold">Apna Tea</span> outlet by <span className="text-[#E59F29] font-semibold">Mamun</span> — an
              authentic Apna Amruttulya experience in Chanchal.
            </motion.p>

            <motion.div
              variants={textItemVariants}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => scrollToSection('menu')}
              >
                <Coffee className="w-4 h-4" aria-hidden="true" />
                <span>View Our Menu</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>

              <Button
                variant="outlineLight"
                size="lg"
                onClick={() => scrollToSection('contact')}
              >
                <MapPin className="w-4 h-4 text-[#E59F29]" aria-hidden="true" />
                <span>Visit Our Outlet</span>
              </Button>
            </motion.div>

            <motion.p
              variants={textItemVariants}
              className="mt-7 text-xs sm:text-sm text-[#F6EBDD]/65 flex items-center gap-2"
            >
              <span>Ashapur Road, Chanchal</span>
              <span aria-hidden="true">·</span>
              <span>Malda Division, West Bengal</span>
            </motion.p>
          </motion.div>

          {/* Right Photographic Stage — GSAP Reveal + Scroll Parallax */}
          <div className="lg:col-span-6 relative">
            <div
              ref={imageWrapRef}
              className="relative mx-auto max-w-xl lg:max-w-none rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.5)] border border-[#C88B36]/25 bg-[#321B13]"
            >
              <div className="aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden relative">
                <OptimizedImage
                  imgRef={photoRef}
                  src="/images/adrak-chai.jpeg"
                  webpSrc="/images/adrak-chai.webp"
                  webpSrcSet="/images/adrak-chai-480w.webp 480w, /images/adrak-chai.webp 960w"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  width={960}
                  height={960}
                  priority={true}
                  alt="Steaming hot traditional Adrak Chai in a red terracotta cup with crushed ginger, cardamom pods, and jaggery at Apna Tea"
                  className="w-full h-[112%] -top-[6%] relative object-cover object-center"
                />
                {/* Measured vignette scrim so warm photography melts seamlessly into espresso tones */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#22110B]/70 via-transparent to-[#22110B]/25"
                  aria-hidden="true"
                />
              </div>

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-auto bg-[#22110B]/88 backdrop-blur-md border border-[#C88B36]/30 rounded-xl px-4 py-3 text-left max-w-xs">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#E59F29] font-semibold">
                  Signature Kulhad Brew
                </p>
                <p className="text-sm font-medium text-[#FFFDF8] mt-0.5">
                  Fresh Ginger, Cardamom &amp; Slow-Simmered Tea
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
