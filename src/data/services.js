export const SERVICES = [
  {
    id: "custom-tailoring",
    icon: "📐",
    title: "Custom Tailoring",
    tagline: "Made from scratch, exactly to you",
    description:
      "Send us your measurements and vision — we craft your outfit entirely from scratch using premium fabrics and precision stitching.",
    includes: [
      "Personal consultation via WhatsApp",
      "Fabric sourcing & selection",
      "Hand-finished stitching",
      "Two fitting adjustments",
      "Worldwide shipping",
    ],
    timeframe: "7–14 days",
    cta: { label: "Start Custom Order", to: "/custom-order" },
  },
  {
    id: "ready-made",
    icon: "👔",
    title: "Ready Made",
    tagline: "Premium pieces, ready to ship",
    description:
      "Browse our curated collection of ready-to-wear garments. Same craftsmanship, available in standard sizes for immediate delivery.",
    includes: [
      "Multiple sizes in stock",
      "Premium fabric quality",
      "Ships within 48 hours",
      "Easy size exchange",
    ],
    timeframe: "Ships in 1–3 days",
    cta: { label: "Browse Shop", to: "/shop" },
  },
  {
    id: "alterations",
    icon: "✂️",
    title: "Alterations & Repairs",
    tagline: "Perfect the fit you already own",
    description:
      "Have a garment that needs adjusting? Whether it's a hem, a resize, or a repair — we bring old favorites back to life.",
    includes: [
      "Any garment type accepted",
      "Precise fit correction",
      "Fast turnaround",
      "Return shipping included",
    ],
    timeframe: "3–5 days",
    cta: { label: "Chat With Tailor", whatsapp: true },
  },
];

export const FAQ = [
  {
    q: "How do I get measured if I'm not local?",
    a: "We'll guide you through a simple self-measurement process over WhatsApp with photo/video reference — most customers complete it in under 10 minutes.",
  },
  {
    q: "What if my custom piece doesn't fit right?",
    a: "Every custom order includes fitting adjustments. If something's off, we make it right before final shipping, or offer alterations after delivery.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes — we've shipped to over 50 countries. Shipping costs and timelines are confirmed with you directly based on your location.",
  },
  {
    q: "Can I request a specific fabric?",
    a: "Absolutely. Tell us your fabric preference during your custom order, and we'll source it or suggest close premium alternatives.",
  },
];
