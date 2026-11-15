import { OUTLET_CONFIG } from '../data/contactData';

export function buildWhatsAppUrl(customMessage) {
  const defaultMsg =
    customMessage ||
    `Hello Apna Tea (${OUTLET_CONFIG.address.full}), I would like to connect regarding your outlet / franchise.`;
  const encoded = encodeURIComponent(defaultMsg);
  const cleanNumber = (OUTLET_CONFIG.whatsappNumber || '').replace(/[^\d]/g, '');

  if (cleanNumber) {
    return `https://wa.me/${cleanNumber}?text=${encoded}`;
  }

  return `https://api.whatsapp.com/send?text=${encoded}`;
}

export function triggerCallOutlet(onFallbackOpenEnquiry) {
  const cleanPhone = (OUTLET_CONFIG.phoneNumber || '').replace(/[^\d+]/g, '');
  if (cleanPhone) {
    window.location.href = `tel:${cleanPhone}`;
    return true;
  }

  if (typeof onFallbackOpenEnquiry === 'function') {
    onFallbackOpenEnquiry('callback');
  }
  return false;
}
