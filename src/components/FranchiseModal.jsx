import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, MessageCircle, Send, X } from 'lucide-react';
import { OUTLET_CONFIG } from '../data/contactData';
import { buildWhatsAppUrl } from '../utils/contactActions';
import Button from './Button';

const INITIAL_FORM = {
  fullName: '',
  phone: '',
  city: '',
  enquiryType: 'franchise',
  message: '',
};

export default function FranchiseModal({ isOpen, initialType = 'franchise', onClose }) {
  const [form, setForm] = useState({ ...INITIAL_FORM, enquiryType: initialType });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm((prev) => ({ ...prev, enquiryType: initialType || 'franchise' }));
      setErrors({});
      setSubmitted(false);
    }
  }, [isOpen, initialType]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }

    const digits = form.phone.replace(/[^\d]/g, '');
    if (digits.length < 10 || digits.length > 13) {
      nextErrors.phone = 'Enter a valid 10-digit mobile number.';
    }

    if (!form.city.trim() || form.city.trim().length < 2) {
      nextErrors.city = 'Please enter your city or proposed location.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const whatsAppSummary = `Hello Apna Tea Team,\nName: ${form.fullName}\nPhone: ${form.phone}\nLocation: ${form.city}\nEnquiry Type: ${
    form.enquiryType === 'franchise'
      ? 'Franchise Partnership'
      : form.enquiryType === 'callback'
        ? 'Outlet Callback Request'
        : 'Outlet Visit / Bulk Order'
  }\nMessage: ${form.message || 'Interested in connecting with Apna Tea.'}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#160B07]/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-modal-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-[#FFFDF8] border border-[#6B3D25]/20 shadow-2xl overflow-hidden"
          >
            <div className="bg-[#321B13] px-6 py-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E59F29]">
                  {OUTLET_CONFIG.brandName} · {OUTLET_CONFIG.franchiseName}
                </p>
                <h3
                  id="enquiry-modal-title"
                  className="font-display text-xl sm:text-2xl font-bold text-[#FFFDF8] mt-0.5"
                >
                  {form.enquiryType === 'callback'
                    ? 'Request an Outlet Callback'
                    : 'Franchise & Business Enquiry'}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close enquiry modal"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FFFDF8]/10 text-[#F6EBDD] hover:bg-[#FFFDF8]/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="p-6 sm:p-8 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#1F9D55]/12 text-[#1F9D55] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-display text-2xl font-bold text-[#321B13] mt-4">
                  Enquiry Recorded
                </h4>
                <p className="text-sm text-[#6B3D25] mt-2 leading-relaxed max-w-md mx-auto">
                  Thank you, <span className="font-semibold text-[#321B13]">{form.fullName}</span>.
                  Your details for <span className="font-semibold text-[#321B13]">{form.city}</span>{' '}
                  are ready. Send a quick message on WhatsApp to connect immediately, or visit our{' '}
                  {OUTLET_CONFIG.address.street} outlet.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    variant="whatsapp"
                    href={buildWhatsAppUrl(whatsAppSummary)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send via WhatsApp</span>
                  </Button>
                  <Button
                    variant="outlineDark"
                    onClick={onClose}
                    className="w-full sm:w-auto"
                  >
                    <span>Done</span>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B3D25] mb-1.5">
                    Enquiry Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'franchise', label: 'Franchise' },
                      { id: 'callback', label: 'Callback' },
                      { id: 'outlet', label: 'Outlet / Events' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, enquiryType: opt.id }))}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          form.enquiryType === opt.id
                            ? 'bg-[#321B13] text-[#FFFDF8] border-[#321B13]'
                            : 'bg-[#FBF5EC] text-[#6B3D25] border-[#6B3D25]/20 hover:border-[#6B3D25]/50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="modal-fullname"
                      className="block text-xs font-semibold text-[#321B13] mb-1"
                    >
                      Full Name *
                    </label>
                    <input
                      id="modal-fullname"
                      type="text"
                      value={form.fullName}
                      onChange={handleChange('fullName')}
                      placeholder="Your name"
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-[#FBF5EC] border text-sm text-[#321B13] placeholder:text-[#6B3D25]/50 focus:outline-none focus:ring-2 focus:ring-[#C88B36] ${
                        errors.fullName ? 'border-[#A83224]' : 'border-[#6B3D25]/20'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-[#A83224] mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="modal-phone"
                      className="block text-xs font-semibold text-[#321B13] mb-1"
                    >
                      Mobile Number *
                    </label>
                    <input
                      id="modal-phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange('phone')}
                      placeholder="10-digit mobile number"
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-[#FBF5EC] border text-sm text-[#321B13] placeholder:text-[#6B3D25]/50 focus:outline-none focus:ring-2 focus:ring-[#C88B36] ${
                        errors.phone ? 'border-[#A83224]' : 'border-[#6B3D25]/20'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-[#A83224] mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="modal-city"
                    className="block text-xs font-semibold text-[#321B13] mb-1"
                  >
                    City / Proposed Location *
                  </label>
                  <input
                    id="modal-city"
                    type="text"
                    value={form.city}
                    onChange={handleChange('city')}
                    placeholder="e.g. Malda, West Bengal"
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-[#FBF5EC] border text-sm text-[#321B13] placeholder:text-[#6B3D25]/50 focus:outline-none focus:ring-2 focus:ring-[#C88B36] ${
                      errors.city ? 'border-[#A83224]' : 'border-[#6B3D25]/20'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-xs text-[#A83224] mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="modal-message"
                    className="block text-xs font-semibold text-[#321B13] mb-1"
                  >
                    Notes (Optional)
                  </label>
                  <textarea
                    id="modal-message"
                    rows={3}
                    value={form.message}
                    onChange={handleChange('message')}
                    placeholder="Tell us about your shop space or enquiry details..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBF5EC] border border-[#6B3D25]/20 text-sm text-[#321B13] placeholder:text-[#6B3D25]/50 focus:outline-none focus:ring-2 focus:ring-[#C88B36]"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                  <Button type="button" variant="outlineDark" onClick={onClose} className="w-full sm:w-auto">
                    <span>Cancel</span>
                  </Button>
                  <Button type="submit" variant="primary" className="w-full sm:w-auto">
                    <Send className="w-4 h-4" />
                    <span>Submit Enquiry</span>
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
