import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { ORDER_CONFIG } from '../../data/orderConfig';
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppOrderUrl,
  calculateOrderTotals,
  formatCurrency,
  generateOrderId,
} from '../../utils/orderUtils';
import Button from '../Button';
import { CheckoutProcessingSkeleton } from '../Skeletons';

const INITIAL_CHECKOUT = {
  customerName: '',
  customerPhone: '',
  orderType: ORDER_CONFIG.delivery.enabled ? 'delivery' : 'pickup',
  deliveryAddress: '',
  instructions: '',
  ageConfirmed: false,
};

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}) {
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout' | 'processing' | 'confirmation'
  const [form, setForm] = useState(INITIAL_CHECKOUT);
  const [errors, setErrors] = useState({});
  const [placedOrder, setPlacedOrder] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');

  const totals = calculateOrderTotals(cartItems, form.orderType);
  const minimumOrderMet = totals.subtotal >= ORDER_CONFIG.minimumOrderAmount;

  useEffect(() => {
    if (isOpen && step === 'confirmation' && cartItems.length > 0) {
      setStep('cart');
      setPlacedOrder(null);
    }
  }, [isOpen, cartItems.length, step]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleFieldChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'deliveryAddress') setLocationMessage('');
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Location is unavailable in this browser. Please enter your address.');
      return;
    }

    setIsLocating(true);
    setLocationMessage('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`;
        setForm((prev) => ({ ...prev, deliveryAddress: mapUrl }));
        setErrors((prev) => ({ ...prev, deliveryAddress: '' }));
        setLocationMessage('Location added. Add a house number or landmark if needed.');
        setIsLocating(false);
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? 'Location permission was denied. Allow access in your browser settings, then try again.'
            : error.code === error.POSITION_UNAVAILABLE
              ? 'Your location could not be determined. Check that location services are enabled.'
              : error.code === error.TIMEOUT
                ? 'Location request timed out. Please try again.'
                : 'Unable to fetch your location. Please enter your address.';
        setLocationMessage(message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const validateCheckout = () => {
    const nextErrors = {};
    if (!form.customerName.trim() || form.customerName.trim().length < 2) {
      nextErrors.customerName = 'Please enter your full name.';
    }
    const digits = form.customerPhone.replace(/[^\d]/g, '');
    if (digits.length < 10 || digits.length > 13) {
      nextErrors.customerPhone = 'Enter a valid 10-digit mobile number.';
    }
    if (
      form.orderType === 'delivery' &&
      (!form.deliveryAddress.trim() || form.deliveryAddress.trim().length < 6)
    ) {
      nextErrors.deliveryAddress = 'Please enter your complete delivery address.';
    }
    if (!minimumOrderMet) {
      nextErrors.minimumOrderAmount = `Orders require a minimum subtotal of ${formatCurrency(ORDER_CONFIG.minimumOrderAmount)}.`;
    }
    if (totals.hasRestrictedItems && !form.ageConfirmed) {
      nextErrors.ageConfirmed = 'Please confirm 18+ age eligibility for restricted items.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validateCheckout()) return;

    setStep('processing');

    const orderSnapshot = {
      orderId: generateOrderId(),
      createdAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      customerName: form.customerName.trim(),
      customerPhone: form.customerPhone.trim(),
      orderType: form.orderType,
      deliveryAddress: form.orderType === 'delivery' ? form.deliveryAddress.trim() : '',
      instructions: form.instructions.trim(),
      items: cartItems.map((item) => ({ ...item })),
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      total: totals.total,
      hasRestrictedItems: totals.hasRestrictedItems,
    };

    const message = buildWhatsAppOrderMessage(orderSnapshot);
    const whatsAppUrl = buildWhatsAppOrderUrl(message);

    window.setTimeout(() => {
      setPlacedOrder({
        ...orderSnapshot,
        whatsAppMessage: message,
        whatsAppUrl,
      });
      setStep('confirmation');
      onClearCart();
    }, 280);
  };

  const handleCopySummary = async () => {
    if (!placedOrder?.whatsAppMessage) return;
    try {
      await navigator.clipboard.writeText(placedOrder.whatsAppMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleStartNew = () => {
    setStep('cart');
    setPlacedOrder(null);
    setForm(INITIAL_CHECKOUT);
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex justify-end bg-[#160B07]/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Cart and Checkout"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-full bg-[#FFFDF8] text-[#321B13] shadow-2xl flex flex-col border-l border-[#6B3D25]/20"
          >
            {/* Drawer Header */}
            <div className="bg-[#321B13] text-[#FFFDF8] px-5 py-4 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                {step === 'checkout' && (
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    aria-label="Back to cart"
                    className="w-8 h-8 rounded-full bg-[#FFFDF8]/10 hover:bg-[#FFFDF8]/20 flex items-center justify-center cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div>
                  <h2 className="font-display text-lg font-bold leading-tight">
                    {step === 'cart'
                      ? `Your Order (${totals.itemCount})`
                      : step === 'checkout'
                        ? 'Checkout Details'
                        : 'Order Ready for WhatsApp'}
                  </h2>
                  <p className="text-[11px] text-[#E59F29]">
                    {ORDER_CONFIG.storeName} · Ashapur Road, Chanchal
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart drawer"
                className="w-9 h-9 rounded-full bg-[#FFFDF8]/10 hover:bg-[#FFFDF8]/20 text-[#FFFDF8] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {step === 'processing' ? (
                <CheckoutProcessingSkeleton />
              ) : step === 'confirmation' && placedOrder ? (
                <div className="space-y-5">
                  <div className="text-center pt-2">
                    <div className="w-14 h-14 mx-auto rounded-full bg-[#1F9D55]/15 text-[#1F9D55] flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#C88B36]">
                      Order ID: {placedOrder.orderId}
                    </p>
                    <h3 className="font-display text-2xl font-bold text-[#321B13] mt-1">
                      Send Order on WhatsApp
                    </h3>
                    <p className="text-xs text-[#6B3D25] mt-1.5 leading-relaxed">
                      Tap the green WhatsApp button below to open WhatsApp with your complete
                      pre-filled order summary and send it directly to our counter.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#FBF5EC] border border-[#6B3D25]/15 p-4 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#6B3D25]">Customer</span>
                      <span className="font-semibold text-[#321B13]">
                        {placedOrder.customerName} ({placedOrder.customerPhone})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B3D25]">Preference</span>
                      <span className="font-semibold text-[#321B13]">
                        {placedOrder.orderType === 'delivery'
                          ? 'Local Delivery'
                          : 'Pickup at Outlet'}
                      </span>
                    </div>
                    {placedOrder.deliveryAddress && (
                      <div className="flex justify-between gap-4">
                        <span className="text-[#6B3D25] shrink-0">Address</span>
                        <span className="font-medium text-[#321B13] text-right">
                          {placedOrder.deliveryAddress}
                        </span>
                      </div>
                    )}

                    <div className="border-t border-[#6B3D25]/15 pt-2.5 space-y-1.5">
                      {placedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between gap-2 tabular-nums">
                          <span className="text-[#321B13]">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-semibold text-[#321B13]">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#6B3D25]/15 pt-2.5 space-y-1 tabular-nums">
                      <div className="flex justify-between text-[#6B3D25]">
                        <span>Subtotal</span>
                        <span>{formatCurrency(placedOrder.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-[#6B3D25]">
                        <span>Delivery</span>
                        <span>
                          {placedOrder.orderType === 'delivery'
                            ? placedOrder.deliveryFee === 0
                              ? 'FREE'
                              : formatCurrency(placedOrder.deliveryFee)
                            : 'Pickup'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-[#321B13] pt-1">
                        <span>Total Amount</span>
                        <span>{formatCurrency(placedOrder.total)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <a
                      href={placedOrder.whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#1F9D55] hover:bg-[#198748] text-[#FFFDF8] text-sm font-bold shadow-[0_6px_20px_rgba(31,157,85,0.28)] transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" aria-hidden="true" />
                      <span>Send Order on WhatsApp</span>
                    </a>

                    <div className="grid grid-cols-2 gap-2.5">
                      <Button
                        variant="outlineDark"
                        size="sm"
                        onClick={handleCopySummary}
                        className="w-full"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#1F9D55]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Summary</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#F6EBDD] text-[#6B3D25] flex items-center justify-center mb-4">
                    <ShoppingBag className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#321B13]">
                    Your Cart Is Empty
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B3D25]/80 mt-1.5 max-w-xs">
                    Browse our freshly brewed chai, cold beverages, and crispy snacks to start an
                    order.
                  </p>
                  <Button variant="primary" size="md" onClick={onClose} className="mt-6">
                    <span>Browse Menu</span>
                  </Button>
                </div>
              ) : step === 'cart' ? (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl bg-[#FBF5EC] border border-[#6B3D25]/12 p-3.5 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium text-[#6B3D25]/75">
                          {item.categoryLabel}
                        </p>
                        <h4 className="font-sans text-sm font-bold text-[#321B13] truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs font-semibold text-[#A83224] mt-0.5 tabular-nums">
                          {formatCurrency(item.price)} × {item.quantity} ={' '}
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="inline-flex items-center rounded-full bg-[#FFFDF8] border border-[#6B3D25]/20 p-0.5 gap-1.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                            aria-label={`Decrease ${item.name}`}
                            className="w-7 h-7 rounded-full hover:bg-[#F6EBDD] flex items-center justify-center cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold tabular-nums min-w-[16px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                            aria-label={`Increase ${item.name}`}
                            className="w-7 h-7 rounded-full hover:bg-[#F6EBDD] flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="w-8 h-8 rounded-full text-[#6B3D25]/70 hover:text-[#A83224] hover:bg-[#A83224]/10 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="text-xs font-semibold text-[#A83224] hover:underline cursor-pointer"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              ) : (
                <form id="order-checkout-form" onSubmit={handlePlaceOrder} noValidate className="space-y-4">
                  {/* Pickup or Delivery Toggle */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B3D25] mb-1.5">
                      Order Preference
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {ORDER_CONFIG.delivery.enabled && (
                        <button
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, orderType: 'delivery' }))}
                          className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                            form.orderType === 'delivery'
                              ? 'bg-[#321B13] text-[#FFFDF8] border-[#321B13]'
                              : 'bg-[#FBF5EC] text-[#321B13] border-[#6B3D25]/20 hover:border-[#6B3D25]/45'
                          }`}
                        >
                          <Truck className="w-4 h-4 text-[#E59F29] mb-1" aria-hidden="true" />
                          <p className="text-xs font-bold">{ORDER_CONFIG.delivery.label}</p>
                          <p
                            className={`text-[11px] mt-0.5 ${
                              form.orderType === 'delivery'
                                ? 'text-[#F6EBDD]/75'
                                : 'text-[#6B3D25]/80'
                            }`}
                          >
                            Free above {formatCurrency(ORDER_CONFIG.delivery.freeDeliveryAbove)}
                          </p>
                        </button>
                      )}

                      {ORDER_CONFIG.pickup.enabled && (
                        <button
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, orderType: 'pickup' }))}
                          className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                            form.orderType === 'pickup'
                              ? 'bg-[#321B13] text-[#FFFDF8] border-[#321B13]'
                              : 'bg-[#FBF5EC] text-[#321B13] border-[#6B3D25]/20 hover:border-[#6B3D25]/45'
                          }`}
                        >
                          <Store className="w-4 h-4 text-[#E59F29] mb-1" aria-hidden="true" />
                          <p className="text-xs font-bold">{ORDER_CONFIG.pickup.label}</p>
                          <p
                            className={`text-[11px] mt-0.5 ${
                              form.orderType === 'pickup' ? 'text-[#F6EBDD]/75' : 'text-[#6B3D25]/80'
                            }`}
                          >
                            No delivery fee
                          </p>
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="chk-name"
                      className="block text-xs font-semibold text-[#321B13] mb-1"
                    >
                      Customer Name *
                    </label>
                    <input
                      id="chk-name"
                      type="text"
                      value={form.customerName}
                      onChange={handleFieldChange('customerName')}
                      placeholder="Enter your full name"
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-[#FBF5EC] border text-sm text-[#321B13] focus:outline-none focus:ring-2 focus:ring-[#C88B36] ${
                        errors.customerName ? 'border-[#A83224]' : 'border-[#6B3D25]/20'
                      }`}
                    />
                    {errors.customerName && (
                      <p className="text-xs text-[#A83224] mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="chk-phone"
                      className="block text-xs font-semibold text-[#321B13] mb-1"
                    >
                      Mobile Number *
                    </label>
                    <input
                      id="chk-phone"
                      type="tel"
                      value={form.customerPhone}
                      onChange={handleFieldChange('customerPhone')}
                      placeholder="10-digit mobile number"
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-[#FBF5EC] border text-sm text-[#321B13] focus:outline-none focus:ring-2 focus:ring-[#C88B36] ${
                        errors.customerPhone ? 'border-[#A83224]' : 'border-[#6B3D25]/20'
                      }`}
                    />
                    {errors.customerPhone && (
                      <p className="text-xs text-[#A83224] mt-1">{errors.customerPhone}</p>
                    )}
                  </div>

                  {form.orderType === 'delivery' ? (
                    <div>
                      <label
                        htmlFor="chk-address"
                        className="block text-xs font-semibold text-[#321B13] mb-1"
                      >
                        Delivery Address *
                      </label>
                      <textarea
                        id="chk-address"
                        rows={2}
                        value={form.deliveryAddress}
                        onChange={handleFieldChange('deliveryAddress')}
                        placeholder="House/shop name, road, landmark near Chanchal / Ashapur Road..."
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-[#FBF5EC] border text-sm text-[#321B13] focus:outline-none focus:ring-2 focus:ring-[#C88B36] ${
                          errors.deliveryAddress ? 'border-[#A83224]' : 'border-[#6B3D25]/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        disabled={isLocating}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B3D25] hover:text-[#321B13] disabled:opacity-60 disabled:cursor-wait cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        {isLocating ? 'Fetching location...' : 'Use my current location'}
                      </button>
                      {locationMessage && (
                        <p
                          className={`text-xs mt-1 ${
                            locationMessage.startsWith('Location added')
                              ? 'text-[#1F7A43]'
                              : 'text-[#A83224]'
                          }`}
                          role="status"
                        >
                          {locationMessage}
                        </p>
                      )}
                      {errors.deliveryAddress && (
                        <p className="text-xs text-[#A83224] mt-1">{errors.deliveryAddress}</p>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl bg-[#FBF5EC] border border-[#6B3D25]/15 p-3 flex items-start gap-2.5 text-xs text-[#6B3D25]">
                      <MapPin className="w-4 h-4 text-[#A83224] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-[#321B13]">Pickup Counter</p>
                        <p>{ORDER_CONFIG.outletAddress}</p>
                        <p className="text-[11px] mt-0.5 text-[#6B3D25]/80">
                          {ORDER_CONFIG.pickup.prepTimeNote}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="chk-instructions"
                      className="block text-xs font-semibold text-[#321B13] mb-1"
                    >
                      Additional Instructions (Optional)
                    </label>
                    <input
                      id="chk-instructions"
                      type="text"
                      value={form.instructions}
                      onChange={handleFieldChange('instructions')}
                      placeholder="e.g. Less sugar, extra ginger, pack separately"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBF5EC] border border-[#6B3D25]/20 text-sm text-[#321B13] focus:outline-none focus:ring-2 focus:ring-[#C88B36]"
                    />
                  </div>

                  {totals.hasRestrictedItems && (
                    <div className="rounded-xl bg-[#321B13]/5 border border-[#A83224]/30 p-3">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.ageConfirmed}
                          onChange={handleFieldChange('ageConfirmed')}
                          className="mt-0.5 accent-[#A83224] w-4 h-4 shrink-0"
                        />
                        <span className="text-xs text-[#321B13] leading-relaxed">
                          {ORDER_CONFIG.legal.smokingCheckoutAck}
                        </span>
                      </label>
                      {errors.ageConfirmed && (
                        <p className="text-xs text-[#A83224] mt-1.5">{errors.ageConfirmed}</p>
                      )}
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Footer Totals & Action Bar */}
            {cartItems.length > 0 && step !== 'confirmation' && step !== 'processing' && (
              <div className="border-t border-[#6B3D25]/15 bg-[#FBF5EC] p-5 space-y-3 shrink-0">
                {!minimumOrderMet && (
                  <p className="text-xs font-semibold text-[#A83224]" role="status" aria-live="polite">
                    Minimum order: {formatCurrency(ORDER_CONFIG.minimumOrderAmount)}. Add{' '}
                    {formatCurrency(ORDER_CONFIG.minimumOrderAmount - totals.subtotal)} more to
                    place your order.
                  </p>
                )}
                <div className="space-y-1.5 text-sm tabular-nums">
                  <div className="flex justify-between text-[#6B3D25]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#321B13]">
                      {formatCurrency(totals.subtotal)}
                    </span>
                  </div>

                  {step === 'checkout' && form.orderType === 'delivery' && (
                    <div className="flex justify-between text-[#6B3D25]">
                      <span>Delivery Fee</span>
                      <span className="font-semibold text-[#321B13]">
                        {totals.deliveryFee === 0 ? 'FREE' : formatCurrency(totals.deliveryFee)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-bold text-[#321B13] pt-1.5 border-t border-[#6B3D25]/15">
                    <span>Total Amount</span>
                    <span>
                      {formatCurrency(step === 'checkout' ? totals.total : totals.subtotal)}
                    </span>
                  </div>
                </div>

                {step === 'cart' ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setStep('checkout')}
                    disabled={!minimumOrderMet}
                    className="w-full"
                  >
                    <span>Proceed to Checkout</span>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    form="order-checkout-form"
                    variant="whatsapp"
                    size="lg"
                    disabled={!minimumOrderMet}
                    className="w-full"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Review &amp; Send on WhatsApp</span>
                  </Button>
                )}
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
