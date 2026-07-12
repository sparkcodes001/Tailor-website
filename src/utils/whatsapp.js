const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

if (import.meta.env.DEV && !WHATSAPP_NUMBER) {
  console.warn(
    "[whatsapp.js] VITE_WHATSAPP_NUMBER is missing — WhatsApp links will be broken.",
  );
}

// ── Shared builder — dedupes the wa.me + encodeURIComponent logic ──
const buildLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const createWhatsAppLink = ({
  productName = "",
  productUrl = "",
  message = "",
} = {}) => {
  const text =
    message ||
    `Hi! I'm interested in *${productName}* 🧵\n\nProduct Link: ${productUrl}\n\nCould you please give me more details about pricing and availability?`;

  return buildLink(text);
};

export const createCustomOrderLink = () =>
  buildLink(
    `Hi! I'd like to place a *custom order* 🧵\n\nCould you please guide me through the process?`,
  );

export const createGeneralLink = () =>
  buildLink(`Hi! I'd like to know more about your tailoring services 🧵`);

export const createAlterationLink = () =>
  buildLink(
    `Hi! I have a garment that needs *alterations* ✂️\n\nCould you let me know how this works?`,
  );
