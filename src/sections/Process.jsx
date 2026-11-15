import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Coffee, FileEdit, Headphones, Store } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { FRANCHISE_PROCESS_STEPS } from '../data/franchiseData';
import { useGsapContext } from '../hooks/useGsapScroll';

const ICON_MAP = {
  FileEdit,
  Headphones,
  Store,
  Coffee,
};

export default function Process() {
  const processRef = useRef(null);

  useGsapContext(processRef, (gsap) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: processRef.current,
        start: 'top 84%',
        once: true,
      },
    });

    tl.fromTo(
      '.process-step-card',
      { y: 22, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, stagger: 0.14, ease: 'power2.out' }
    ).fromTo(
      '.process-arrow',
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.35, stagger: 0.14, ease: 'power2.out' },
      '-=0.45'
    );
  });

  return (
    <section
      id="process"
      ref={processRef}
      className="bg-[#F6EBDD] py-16 sm:py-20 border-b border-[#6B3D25]/12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FRANCHISE PROCESS"
          title="How to Start Your"
          accentTitle="Franchise?"
          subtitle="Start Your Tea Business in 4 Easy Steps"
          align="center"
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
          {FRANCHISE_PROCESS_STEPS.map((item, idx) => {
            const Icon = ICON_MAP[item.icon] || Coffee;
            const isLast = idx === FRANCHISE_PROCESS_STEPS.length - 1;

            return (
              <div key={item.step} className="relative flex flex-col items-center text-center">
                <div className="process-step-card flex flex-col items-center max-w-[230px]">
                  <motion.div
                    whileHover={{ scale: 1.07, y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="w-16 h-16 rounded-full bg-[#FBE7B5] border border-[#C88B36]/45 text-[#6B3D25] flex items-center justify-center shadow-sm"
                  >
                    <Icon className="w-7 h-7" aria-hidden="true" />
                  </motion.div>

                  <h3 className="mt-4 font-sans text-base font-bold text-[#321B13]">
                    {item.step}. {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#6B3D25]/85 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {!isLast && (
                  <div
                    className="process-arrow hidden md:flex items-center justify-center absolute top-8 -right-4 translate-x-1/2 origin-left text-[#6B3D25]/55"
                    aria-hidden="true"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
