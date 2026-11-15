import { useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { Clock, ExternalLink, MapPin, Navigation, Phone } from 'lucide-react';
import Button from '../components/Button';
import OptimizedImage from '../components/OptimizedImage';
import WhatsAppButton from '../components/WhatsAppButton';
import { OUTLET_CONFIG } from '../data/contactData';
import { triggerCallOutlet } from '../utils/contactActions';

const MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  (typeof __GOOGLE_MAPS_API_KEY__ !== 'undefined' ? __GOOGLE_MAPS_API_KEY__ : '');

function OutletMapPin() {
  const [infoOpen, setInfoOpen] = useState(true);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={OUTLET_CONFIG.coordinates}
        onClick={() => setInfoOpen((prev) => !prev)}
        title={`${OUTLET_CONFIG.brandName} — ${OUTLET_CONFIG.address.shortLabel}`}
      >
        <Pin
          background="#A83224"
          borderColor="#FFFDF8"
          glyphColor="#E59F29"
          scale={1.2}
        />
      </AdvancedMarker>

      {infoOpen && marker && (
        <InfoWindow
          anchor={marker}
          maxWidth={230}
          onCloseClick={() => setInfoOpen(false)}
        >
          <div className="text-[#321B13] py-0.5">
            <p className="font-bold text-sm">{OUTLET_CONFIG.brandName}</p>
            <p className="text-xs text-[#6B3D25] mt-0.5">
              {OUTLET_CONFIG.address.full}
            </p>
            <a
              href={OUTLET_CONFIG.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#A83224] underline mt-1.5"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export default function Contact({ onOpenEnquiry }) {
  const hoursText = OUTLET_CONFIG.openingHours || OUTLET_CONFIG.openingHoursFallback;
  const phoneDisplay = OUTLET_CONFIG.phoneNumber || 'Request Outlet Callback';

  return (
    <section
      id="contact"
      className="bg-[#321B13] text-[#FFFDF8] py-14 sm:py-16 border-t border-[#C88B36]/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-8">
          {/* Left Column: Address, Hours, Phone, WhatsApp */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E59F29]">
                VISIT OR CONNECT
              </p>
              <h2 className="font-display text-3xl font-bold text-[#FFFDF8] mt-1">
                Find Our Outlet
              </h2>

              <ul className="mt-6 space-y-4 text-sm text-[#F6EBDD]/90">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#E59F29] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-[#FFFDF8]">{OUTLET_CONFIG.address.street}</p>
                    <p className="text-[#F6EBDD]/75">{OUTLET_CONFIG.address.region}</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#E59F29] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-[#FFFDF8]">Outlet Timings</p>
                    <p className="text-[#F6EBDD]/75">{hoursText}</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#E59F29] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <button
                      type="button"
                      onClick={() => triggerCallOutlet(onOpenEnquiry)}
                      className="text-left font-semibold text-[#FFFDF8] hover:text-[#E59F29] underline decoration-[#C88B36]/50 underline-offset-4 transition-colors cursor-pointer"
                    >
                      {phoneDisplay}
                    </button>
                    <p className="text-xs text-[#F6EBDD]/65 mt-0.5">
                      Click to call or leave your number for a quick callback
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <WhatsAppButton label="Chat on WhatsApp" className="w-full sm:w-auto" />
              <Button
                variant="outlineLight"
                size="md"
                href={OUTLET_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Navigation className="w-4 h-4 text-[#E59F29]" aria-hidden="true" />
                <span>Directions</span>
              </Button>
            </div>
          </div>

          {/* Center Column: Interactive Google Map (@vis.gl/react-google-maps) */}
          <div className="lg:col-span-5">
            <div className="h-[320px] sm:h-[360px] w-full rounded-2xl overflow-hidden border border-[#C88B36]/30 bg-[#22110B] shadow-xl relative">
              {MAPS_API_KEY ? (
                <APIProvider
                  apiKey={MAPS_API_KEY}
                  libraries={['marker']}
                  language="en"
                  region="IN"
                >
                  <GoogleMap
                    mapId="DEMO_MAP_ID"
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                    defaultCenter={OUTLET_CONFIG.coordinates}
                    defaultZoom={13}
                    gestureHandling="cooperative"
                    disableDefaultUI={false}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <OutletMapPin />
                  </GoogleMap>
                </APIProvider>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[radial-gradient(circle_at_center,rgba(200,139,54,0.18),rgba(34,17,11,0.95))]">
                  <div className="w-12 h-12 rounded-full bg-[#A83224] text-[#FFFDF8] flex items-center justify-center mb-3 shadow-lg">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#FFFDF8]">
                    {OUTLET_CONFIG.brandName} · {OUTLET_CONFIG.address.shortLabel}
                  </h3>
                  <p className="text-xs text-[#F6EBDD]/75 mt-1 max-w-xs">
                    {OUTLET_CONFIG.address.full}
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    href={OUTLET_CONFIG.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Visual Chai & Biscuit Pairing Card */}
          <div className="lg:col-span-3 hidden lg:block">
            <div className="h-[360px] rounded-2xl overflow-hidden border border-[#C88B36]/25 relative bg-[#22110B]">
              <OptimizedImage
                src="/images/special-chai.jpeg"
                webpSrc="/images/special-chai.webp"
                webpSrcSet="/images/special-chai-480w.webp 480w, /images/special-chai.webp 600w"
                sizes="25vw"
                width={600}
                height={900}
                alt="Apna Tea Special Chai and biscuits served warm"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#22110B]/90 via-[#22110B]/20 to-transparent pointer-events-none"
                aria-hidden="true"
              />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#E59F29]">
                  {OUTLET_CONFIG.tagline}
                </p>
                <p className="text-sm font-medium text-[#FFFDF8] mt-0.5">
                  Stop by for a fresh cup today
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
