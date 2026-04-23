import { formatPrice } from './formatPrice';

export function buildWhatsAppUrl(cartItems, settings, language) {
  const isEs = language === 'es';
  //const header = isEs ? '🛒 *Nuevo Pedido — LUPE*' : '🛒 *New Order — LUPE*';
  const header = '🛒 *Nuevo Pedido — LUPE*'
  const footer = '¡Gracias!';

  const lines = cartItems.map((item) => {
    const name = (language === 'en' ? item.nameEn : item.nameEs) || item.nameEs || item.nameEn || '';
    const lineTotal = formatPrice(parseFloat(item.price) * item.quantity);
    return `${item.quantity}x  ${name.padEnd(20)} ${lineTotal}`;
  });

  const total = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  const message = [
    header,
    '---',
    ...lines,
    '---',
    `*Total: ${formatPrice(total)}*`,
    '',
    footer,
  ].join('\n');

  const phone = (settings.whatsapp_number || '').replace(/\+/g, '');
  const text = encodeURIComponent(message);
  return { url: `https://wa.me/${phone}?text=${text}`, message };
}
