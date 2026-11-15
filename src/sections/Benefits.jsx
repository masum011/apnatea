import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Leaf, Store, Users } from 'lucide-react';
import { BRAND_BENEFITS } from '../data/franchiseData';
import { useGsapContext } from '../hooks/useGsapScroll';

const ICON_MAP = {
  Coffee,
  Leaf,
  Users,
  Store,
};

export default function Benefits() {
  const stripRef = useRef(null);

  useGsapContext(stripRef, (gsap) => {
    gsap.fromTo(
      '.benefit-item',
      { y: 18, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: stripRef.current,
          start: 'top 90%',
          once: true,
        },
      }
    );
  });

  return (
    <section
      ref={stripRef}
      aria-label="Brand Benefits"
      className="bg-[#FBF5EC] border-y border-[#6B3D25]/15"
    >
      <h2 className="sr-only">Why Choose Apna Tea</h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#6B3D25]/15">
          {BRAND_BENEFITS.map((benefit) => {
            const Icon = ICON_MAP[benefit.icon] || Coffee;
            return (
              <div
                key={benefit.id}
                className="benefit-item flex items-center gap-3.5 py-3.5 sm:py-1 sm:px-5 first:sm:pl-0 last:sm:pr-0"
              >
                <motion.div
                  whileHover={{ scale: 1.08, rotate: -4 }}
                  transition={{ duration: 0.18 }}
                  className="w-11 h-11 rounded-xl bg-[#F6EBDD] border border-[#C88B36]/30 text-[#6B3D25] flex items-center justify-center shrink-0"
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </motion.div>
                <div className="min-w-0">
                  <h3 className="font-sans text-sm font-bold text-[#321B13] leading-snug">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-[#6B3D25]/85 mt-0.5">{benefit.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
