import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Flame, HeartHandshake, Sparkles } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';
import SectionHeading from '../components/SectionHeading';
import { useGsapContext } from '../hooks/useGsapScroll';

const CULTURE_PILLARS = [
  {
    icon: Flame,
    title: 'Slow-Brewed Tradition',
    text: 'Every batch is simmered fresh with whole milk, crisp tea leaves, and hand-crushed spices — never reheated.',
  },
  {
    icon: Sparkles,
    title: 'Clean & Hygienic Counter',
    text: 'Consistent preparation hygiene, fresh serving cups, and welcoming seating designed for daily visits.',
  },
  {
    icon: HeartHandshake,
    title: 'Built Around Apnapan',
    text: 'From morning commuters to evening friends over chai and biscuits, our outlet is a neighborhood gathering place.',
  },
];

export default function About() {
  const sectionRef = useRef(null);

  useGsapContext(sectionRef, (gsap) => {
    gsap.fromTo(
      '.about-reveal',
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );
  });

  return (
    <section id="about" ref={sectionRef} className="bg-[#F6EBDD] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-12">
          {/* Editorial Photo Pair */}
          <div className="lg:col-span-5 about-reveal">
            <div className="grid grid-cols-2 gap-4 items-stretch">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl overflow-hidden border border-[#6B3D25]/15 bg-[#FFFDF8] shadow-sm h-64 sm:h-72"
              >
                <OptimizedImage
                  src="/images/special-chai.jpeg"
                  webpSrc="/images/special-chai.webp"
                  webpSrcSet="/images/special-chai-480w.webp 480w, /images/special-chai.webp 600w"
                  sizes="(max-width: 1024px) 50vw, 22vw"
                  width={600}
                  height={900}
                  alt="Frothy Apna Tea Special Chai served with crispy biscuits"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl overflow-hidden border border-[#6B3D25]/15 bg-[#FFFDF8] shadow-sm mt-6 h-64 sm:h-72"
              >
                <OptimizedImage
                  src="/images/chocolate-tea.jpeg"
                  webpSrc="/images/chocolate-tea.webp"
                  webpSrcSet="/images/chocolate-tea-480w.webp 480w, /images/chocolate-tea.webp 960w"
                  sizes="(max-width: 1024px) 50vw, 22vw"
                  width={960}
                  height={960}
                  alt="Creamy Chocolate Tea topped with dark chocolate shavings and cinnamon"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>

          {/* Brand Story Copy */}
          <div className="lg:col-span-7 about-reveal">
            <SectionHeading
              eyebrow="OUR STORY"
              title="Authentic Indian Chai Culture,"
              accentTitle="Served with Warmth"
              align="left"
              showLines={false}
              subtitle="At Apna Tea, an Apna Amruttulya franchise outlet in Ramdebpur, Malda Division, chai is more than a quick stop — it is a comforting daily ritual shared across generations."
            />

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {CULTURE_PILLARS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-xl bg-[#FFFDF8] border border-[#6B3D25]/12 p-5"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#F6EBDD] text-[#A83224] flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <h3 className="font-sans text-sm font-bold text-[#321B13]">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-[#6B3D25]/85 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
