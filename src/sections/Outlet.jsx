import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Navigation, Sparkles, Users } from 'lucide-react';
import Button from '../components/Button';
import OptimizedImage from '../components/OptimizedImage';
import SectionHeading from '../components/SectionHeading';
import { OUTLET_CONFIG } from '../data/contactData';
import { useGsapContext } from '../hooks/useGsapScroll';

export default function Outlet() {
  const outletRef = useRef(null);
  const imgRef = useRef(null);

  useGsapContext(outletRef, (gsap) => {
    gsap.fromTo(
      imgRef.current,
      { scale: 1.05, opacity: 0.88 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: outletRef.current,
          start: 'top 82%',
          once: true,
        },
      }
    );
  });

  return (
    <section id="outlet" ref={outletRef} className="bg-[#FBF5EC] py-16 sm:py-20 border-t border-[#6B3D25]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-8 lg:gap-10">
          {/* Actual Outlet Photograph */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative flex-1 rounded-2xl overflow-hidden border border-[#6B3D25]/15 shadow-[0_18px_48px_rgba(50,27,19,0.12)] bg-[#22110B] min-h-[280px] sm:min-h-[380px]">
              <OptimizedImage
                imgRef={imgRef}
                src="/images/apna-tea-outlet.jpeg"
                webpSrc="/images/apna-tea-outlet.webp"
                webpSrcSet="/images/apna-tea-outlet-480w.webp 480w, /images/apna-tea-outlet.webp 1200w"
                sizes="(max-width: 1024px) 100vw, 56vw"
                width={1200}
                height={900}
                alt="Real photograph of Apna Amruttulya Apna Tea outlet at Ashapur Road, Ramdebpur, Malda Division, West Bengal with evening lights and outdoor seating"
                className="w-full h-full object-cover"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#22110B]/85 via-[#22110B]/30 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-[#FFFDF8]">
                <p className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#E59F29] shrink-0" aria-hidden="true" />
                  <span>{OUTLET_CONFIG.address.full}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Outlet Introduction & Local Attraction */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <SectionHeading
              eyebrow="OUR OUTLET"
              title="Visit Apna Amruttulya"
              accentTitle="in Ramdebpur"
              align="left"
              showLines={false}
              subtitle="Located along Ashapur Road in Malda Division, our welcoming open-air tea kiosk brings together authentic Amruttulya chai craftsmanship, glowing evening ambience, and relaxed table seating."
            />

            <div className="mt-6 space-y-3.5">
              <motion.div
                whileHover={{ x: 3 }}
                transition={{ duration: 0.18 }}
                className="rounded-xl bg-[#FFFDF8] border border-[#6B3D25]/12 p-4 flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F6EBDD] text-[#A83224] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#321B13]">
                    Spacious Outdoor Seating
                  </h3>
                  <p className="text-xs text-[#6B3D25]/85 mt-0.5 leading-relaxed">
                    Comfortable shaded tables and easy roadside access for evening hangouts,
                    highway travelers, and family tea breaks.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 3 }}
                transition={{ duration: 0.18 }}
                className="rounded-xl bg-[#FFFDF8] border border-[#6B3D25]/12 p-4 flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F6EBDD] text-[#C88B36] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#321B13]">
                    Freshly Prepared All Day
                  </h3>
                  <p className="text-xs text-[#6B3D25]/85 mt-0.5 leading-relaxed">
                    Recognizable Apna Amruttulya signage, clean illuminated menu display, and hot
                    chai poured fresh on order.
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                variant="espresso"
                size="md"
                href={OUTLET_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="w-4 h-4 text-[#E59F29]" aria-hidden="true" />
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-75" aria-hidden="true" />
              </Button>

              <Button
                variant="outlineDark"
                size="md"
                onClick={() => {
                  const el = document.getElementById('gallery');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>View Outlet Gallery</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
