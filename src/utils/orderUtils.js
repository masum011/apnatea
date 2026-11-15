import { ORDER_CONFIG } from '../data/orderConfig';

export function formatCurrency(amount) {
  const numeric = Number(amount) || 0;
  return `${ORDER_CONFIG.currencySymbol}${numeric.toFixed(0)}`;
}

export function generateOrderId() {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `APNA-${rand}`;
}

export function calculateOrderTotals(cartItems, orderType = 'pickup') {
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const hasRestrictedItems = cartItems.some((item) => Boolean(item.restricted));

  let deliveryFee = 0;
  let qualifiesFreeDelivery = false;

  if (orderType === 'delivery' && itemCount > 0 && ORDER_CONFIG.delivery.enabled) {
    if (subtotal >= ORDER_CONFIG.delivery.freeDeliveryAbove) {
      deliveryFee = 0;
      qualifiesFreeDelivery = true;
    } else {
      deliveryFee = ORDER_CONFIG.delivery.fee;
    }
  }

  return {
    itemCount,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    qualifiesFreeDelivery,
    hasRestrictedItems,
  };
}

export function buildWhatsAppOrderMessage(order) {
  const {
    orderId,
    createdAt,
    customerName,
    customerPhone,
    orderType,
    deliveryAddress,
    instructions,
    items,
    subtotal,
    deliveryFee,
    total,
    hasRestrictedItems,
  } = order;

  const lines = [
    `*NEW ORDER — ${ORDER_CONFIG.storeName} (${ORDER_CONFIG.franchiseName})*`,
    `Order ID: *${orderId}*`,
    `Time: ${createdAt}`,
    ``,
    `*Customer Details*`,
    `Name: ${customerName}`,
    `Mobile: ${customerPhone}`,
    `Preference: ${orderType === 'delivery' ? 'Local Delivery' : 'Pickup at Outlet'}`,
  ];

  if (orderType === 'delivery' && deliveryAddress) {
    lines.push(`Delivery Address: ${deliveryAddress}`);
  } else {
    lines.push(`Pickup Outlet: ${ORDER_CONFIG.outletAddress}`);
  }

  lines.push(``, `*Order Items*`);
  items.forEach((item, index) => {
    const lineTotal = item.price * item.quantity;
    lines.push(
      `${index + 1}. ${item.name} x ${item.quantity} (${formatCurrency(item.price)} each) = *${formatCurrency(lineTotal)}*`
    );
  });

  lines.push(
    ``,
    `*Bill Summary*`,
    `Subtotal: ${formatCurrency(subtotal)}`,
    `Delivery Charge: ${orderType === 'delivery' ? (deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)) : 'N/A (Pickup)'}`,
    `*Total Amount: ${formatCurrency(total)}*`
  );

  if (instructions && instructions.trim()) {
    lines.push(``, `*Instructions:* ${instructions.trim()}`);
  }

  if (hasRestrictedItems) {
    lines.push(
      ``,
      `_[18+ Age-Restricted Items Included — Customer confirmed 18+ age at checkout]_`
    );
  }

  return lines.join('\n');
}

export function buildWhatsAppOrderUrl(message) {
  const encoded = encodeURIComponent(message);
  const cleanNumber = (ORDER_CONFIG.ownerWhatsAppNumber || '').replace(/[^\d]/g, '');

  if (cleanNumber) {
    return `https://wa.me/${cleanNumber}?text=${encoded}`;
  }

  return `https://api.whatsapp.com/send?text=${encoded}`;
}
