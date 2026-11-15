import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Coffee,
  Headphones,
  Leaf,
  Send,
  Store,
} from 'lucide-react';
import Button from '../components/Button';
import OptimizedImage from '../components/OptimizedImage';
import { FRANCHISE_HIGHLIGHTS } from '../data/franchiseData';
import { useGsapContext } from '../hooks/useGsapScroll';
import { buildWhatsAppUrl } from '../utils/contactActions';

const ICON_MAP = {
  Award,
  Headphones,
  Store,
  Leaf,
};

export default function Franchise({ onOpenEnquiry }) {
  const sectionRef = useRef(null);
  const [inlineForm, setInlineForm] = useState({
    name: '',
    phone: '',
    location: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useGsapContext(sectionRef, (gsap) => {
    gsap.fromTo(
      '.franchise-reveal',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 84%',
          once: true,
        },
      }
    );
  });

  const handleInlineSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!inlineForm.name.trim() || inlineForm.name.trim().length < 2) {
      nextErrors.name = 'Enter your name';
    }
    const digits = inlineForm.phone.replace(/[^\d]/g, '');
    if (digits.length < 10 || digits.length > 13) {
      nextErrors.phone = 'Enter a valid 10-digit mobile number';
    }
    if (!inlineForm.location.trim()) {
      nextErrors.location = 'Enter your city or town';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
    }
  };

  return (
    <section
      id="franchise"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#321B13] text-[#FFFDF8] py-16 sm:py-20"
    >
      {/* Subtle decorative teacup line art */}
      <div
        className="pointer-events-none absolute right-6 bottom-6 opacity-15 text-[#E59F29]"
        aria-hidden="true"
      >
        <Coffee className="w-28 h-28 stroke-[1.2]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-12">
          {/* Left Outlet Visual + Quick Enquiry Card */}
          <div className="lg:col-span-6 franchise-reveal space-y-6">
            <div className="rounded-2xl overflow-hidden border border-[#C88B36]/30 shadow-2xl bg-[#22110B] h-64 sm:h-80">
              <OptimizedImage
                src="/images/apna-tea-outlet.jpeg"
                webpSrc="/images/apna-tea-outlet.webp"
                webpSrcSet="/images/apna-tea-outlet-480w.webp 480w, /images/apna-tea-outlet.webp 1200w"
                sizes="(max-width: 1024px) 100vw, 48vw"
                width={1200}
                height={900}
                alt="Apna Amruttulya franchise outlet storefront with illuminated branding and busy customer seating"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Inline Quick Franchise Enquiry Form */}
            <div className="rounded-2xl bg-[#22110B]/90 border border-[#C88B36]/25 p-5 sm:p-6">
              {submitted ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#1F9D55] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#FFFDF8]">
                        Franchise Request Noted
                      </h3>
                      <p className="text-xs text-[#F6EBDD]/80 mt-0.5">
                        Thank you, {inlineForm.name}. Continue on WhatsApp to share your enquiry
                        for {inlineForm.location}.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="whatsapp"
                      size="sm"
                      href={buildWhatsAppUrl(
                        `Franchise Enquiry from ${inlineForm.name} (${inlineForm.phone}) for location: ${inlineForm.location}`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>Send on WhatsApp</span>
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setInlineForm({ name: '', phone: '', location: '' });
                      }}
                      className="text-xs text-[#E59F29] underline px-2 py-1 cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleInlineSubmit} noValidate>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#E59F29] mb-3">
                    Quick Franchise Callback
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <input
                        type="text"
                        aria-label="Your Name"
                        placeholder="Your Name"
                        value={inlineForm.name}
                        onChange={(e) => {
                          setInlineForm((p) => ({ ...p, name: e.target.value }));
                          if (errors.name) setErrors((p) => ({ ...p, name: '' }));
                        }}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#321B13] border border-[#C88B36]/30 text-sm text-[#FFFDF8] placeholder:text-[#F6EBDD]/45 focus:outline-none focus:border-[#E59F29]"
                      />
                      {errors.name && (
                        <p className="text-[11px] text-[#fca5a5] mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="tel"
                        aria-label="Mobile Number"
                        placeholder="Mobile Number"
                        value={inlineForm.phone}
                        onChange={(e) => {
                          setInlineForm((p) => ({ ...p, phone: e.target.value }));
                          if (errors.phone) setErrors((p) => ({ ...p, phone: '' }));
                        }}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#321B13] border border-[#C88B36]/30 text-sm text-[#FFFDF8] placeholder:text-[#F6EBDD]/45 focus:outline-none focus:border-[#E59F29]"
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-[#fca5a5] mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        aria-label="City or Area"
                        placeholder="City / Area"
                        value={inlineForm.location}
                        onChange={(e) => {
                          setInlineForm((p) => ({ ...p, location: e.target.value }));
                          if (errors.location) setErrors((p) => ({ ...p, location: '' }));
                        }}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#321B13] border border-[#C88B36]/30 text-sm text-[#FFFDF8] placeholder:text-[#F6EBDD]/45 focus:outline-none focus:border-[#E59F29]"
                      />
                      {errors.location && (
                        <p className="text-[11px] text-[#fca5a5] mt-1">{errors.location}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button type="submit" variant="primary" size="sm">
                      <Send className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Request Franchise Info</span>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Franchise Copy & Highlights */}
          <div className="lg:col-span-6 franchise-reveal">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E59F29]">
              GROW WITH APNA AMRUTTULYA
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight mt-2">
              Own an <span className="text-[#E59F29]">Apna Tea</span> Franchise
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#F6EBDD]/85 leading-relaxed max-w-xl">
              Be part of a growing Indian chai brand that neighborhoods trust. We provide
              recipe standardization, outlet setup guidance, and hands-on training to help you
              launch smoothly.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FRANCHISE_HIGHLIGHTS.map((item) => {
                const Icon = ICON_MAP[item.icon] || Store;
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.18 }}
                    className="rounded-xl bg-[#22110B]/70 border border-[#C88B36]/20 p-4 flex items-start gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#321B13] border border-[#E59F29]/40 text-[#E59F29] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-sans text-sm font-bold text-[#FFFDF8]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-[#F6EBDD]/75 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onOpenEnquiry('franchise')}
              >
                <Store className="w-4 h-4" aria-hidden="true" />
                <span>Enquire for Franchise</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
