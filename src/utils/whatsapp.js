const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export const createWhatsAppLink = ({
  productName = "",
  productUrl = "",
  message = "",
}) => {
  const defaultMessage =
    message ||
    `Hi! I'm interested in *${productName}* 🧵\n\nProduct Link: ${productUrl}\n\nCould you please give me more details about pricing and availability?`;

  const encoded = encodeURIComponent(defaultMessage);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
};

export const createCustomOrderLink = () => {
  const message = `Hi! I'd like to place a *custom order* 🧵\n\nCould you please guide me through the process?`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
};

export const createGeneralLink = () => {
  const message = `Hi! I'd like to know more about your tailoring services 🧵`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
};
