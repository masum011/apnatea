/**
 * Centralized Owner Configuration for Apna Tea Online Ordering.
 * Update prices, WhatsApp number, and delivery settings here.
 */
export const ORDER_CONFIG = {
  storeName: 'Apna Tea',
  franchiseName: 'Apna Amruttulya',
  outletAddress: 'Ashapur Road, Chanchal, Malda Division, West Bengal',
  currencySymbol: '₹',

  // Enter your 10-digit mobile number with country code (e.g., '919876543210')
  // Leave blank to let WhatsApp prompt contact selection on send.
  ownerWhatsAppNumber: '918016634973',

  acceptingOrders: true,
  minimumOrderAmount: 50,

  pickup: {
    enabled: true,
    label: 'Pickup at Outlet',
    prepTimeNote: 'Ready in 10–15 mins at Ashapur Road counter',
  },

  delivery: {
    enabled: true,
    label: 'Local Delivery',
    fee: 15,
    freeDeliveryAbove: 99,
    areaNote: 'Local delivery around Ashapur Road & Chanchal',
  },

  legal: {
    minimumAge: 18,
    smokingWarning:
      'Statutory Warning: Smoking is injurious to health. Products in this category are strictly for adults aged 18 years and above.',
    smokingCheckoutAck:
      'I confirm that I am 18 years or older and understand valid age proof may be checked at pickup or delivery.',
  },
};
