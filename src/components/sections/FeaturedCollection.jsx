import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { createWhatsAppLink } from "../../utils/whatsapp";
import { useTheme } from "../../context/ThemeContext";
import GradientText from "../ui/GradientText";

import agbada1 from "../../assets/images/gallery/agbada-1.jpg";
import agbada2 from "../../assets/images/gallery/agbada-2.jpg";
import agbada3 from "../../assets/images/gallery/agbada-3.jpg";
import agbada4 from "../../assets/images/gallery/agbada-4.jpg";

gsap.registerPlugin(ScrollTrigger);

const featured = [
  {
    id: 1,
    image: agbada1,
    name: "Royal Blue Agbada",
    category: "Agbada · Premium",
    tag: "Bestseller",
  },
  {
    id: 2,
    image: agbada2,
    name: "Black Embroidered Agbada",
    category: "Agbada · Luxury",
    tag: "New",
  },
  {
    id: 3,
    image: agbada3,
    name: "Cream Senator Set",
    category: "Senator · Classic",
    tag: "Featured",
  },
  {
    id: 4,
    image: agbada4,
    name: "Navy Cross-Stitch Agbada",
    category: "Agbada · Traditional",
    tag: "Popular",
  },
];

const isMobile = window.matchMedia("(hover: none)").matches;

const FeaturedCard = ({ item, tokens }) => {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const { accent, accentDeep, accentBg15, accentBorder30, btnText } = tokens;

  const showButtons = isMobile || hovered;

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -10;
    const rotateY = ((x - rect.width / 2) / rect.width) * 10;
    gsap.to(card, {
      rotateX,
      rotateY,
      scale: 1.03,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 800,
    });
  };

  const handleMouseEnter = () => {
    if (!isMobile) setHovered(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setHovered(false);
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.7,
      ease: "elastic.out(1, 0.6)",
      transformPerspective: 800,
    });
  };

  const whatsappLink = createWhatsAppLink({
    productName: item.name,
    productUrl: `${window.location.origin}/shop`,
  });

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="featured-card group relative rounded-3xl overflow-hidden cursor-pointer"
      style={{ transformStyle: "preserve-3d", aspectRatio: "3/4" }}
    >
      {/* Image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-full object-cover transition-transform
                   duration-700 group-hover:scale-110"
      />

      {/* Overlay — always dark since images are the bg */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(to top, rgba(15,17,20,0.95) 0%, rgba(15,17,20,0.4) 50%, rgba(15,17,20,0.1) 100%)",
          opacity: isMobile ? 1 : hovered ? 1 : 0.7,
        }}
      />

      {/* Tag */}
      <div className="absolute top-4 left-4">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{
            background: accentBg15,
            border: `1px solid ${accentBorder30}`,
            color: accent,
            backdropFilter: "blur(8px)",
            transition:
              "background 0.5s ease, border-color 0.5s ease, color 0.5s ease",
          }}
        >
          {item.tag}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p
          className="text-xs tracking-widest uppercase mb-1"
          style={{ color: `${accent}99`, transition: "color 0.5s ease" }}
        >
          {item.category}
        </p>
        <h3 className="text-white font-display font-bold text-lg mb-4">
          {item.name}
        </h3>

        <div
          className="flex gap-3 transition-all duration-500"
          style={{
            opacity: showButtons ? 1 : 0,
            transform: showButtons ? "translateY(0)" : "translateY(20px)",
            pointerEvents: showButtons ? "all" : "none",
          }}
        >
          {/* Primary — accent filled */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold
                       text-center transition-all duration-300
                       hover:opacity-90 active:scale-95"
            style={{
              background: accent,
              color: btnText,
              transition: "background 0.5s ease, color 0.5s ease",
            }}
          >
            💬 Chat Tailor
          </a>

          {/* Secondary — glass */}
          <Link
            to="/shop"
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-2.5 rounded-xl text-sm font-medium
                       text-white transition-all duration-300
                       hover:bg-white/15 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            View
          </Link>
        </div>
      </div>

      {/* Shine — desktop only */}
      {!isMobile && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity
                     duration-500 rounded-3xl"
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${accent}0d 50%, transparent 60%)`,
            opacity: hovered ? 1 : 0,
          }}
        />
      )}
    </div>
  );
};

const FeaturedCollection = () => {
  const sectionRef = useRef(null);
  const { isDark } = useTheme();

  // ── TOKENS — same pattern as Hero & Services ──────────────
  const accent = isDark ? "#b8f7e4" : "#6b190e";
  const accentDeep = isDark ? "#7ee8c8" : "#4e1220";
  const accentBg10 = isDark ? "rgba(184,247,228,0.10)" : "rgba(107,29,46,0.10)";
  const accentBg15 = isDark ? "rgba(184,247,228,0.15)" : "rgba(107,29,46,0.15)";
  const accentBorder30 = isDark
    ? "rgba(184,247,228,0.30)"
    : "rgba(107,29,46,0.30)";

  // Section bg — one step darker than hero base for depth
  // Dark  → #1a1c20  |  Light → #fdf5f6 (warm blush tint)
  const sectionBg = isDark ? "#1a1c20" : "#fdf5f6";

  // Glow blob
  const glowColor = isDark
    ? "radial-gradient(ellipse, rgba(184,247,228,0.5) 0%, transparent 70%)"
    : "radial-gradient(ellipse, rgba(107,29,46,0.12) 0%, transparent 70%)";

  // Label lines
  const labelLineL = isDark
    ? "linear-gradient(90deg, transparent, #b8f7e4)"
    : "linear-gradient(90deg, transparent, #6b1d2e)";

  // Heading gradient — same fix: inline-block, no transition on background
  const headingGrad = isDark
    ? "linear-gradient(135deg, #b8f7e4, #7ee8c8)"
    : "linear-gradient(135deg, #6b1d2e, #4e1220)";

  // Text
  const textPrimary = isDark ? "#ffffff" : "#1a0a0e";
  const textMuted = isDark ? "rgba(255,255,255,0.40)" : "rgba(26,10,14,0.40)";
  const subText = isDark ? "rgba(255,255,255,0.40)" : "rgba(26,10,14,0.45)";

  // "View All" button
  const btnBg = isDark ? "#b8f7e4" : "#6b1d2e";
  const btnText = isDark ? "#25272c" : "#fffdf7";

  const tokens = {
    accent,
    accentDeep,
    accentBg10,
    accentBg15,
    accentBorder30,
    btnText,
  };

  // ── SCROLL ANIMATIONS ─────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".collection-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".collection-title", start: "top 85%" },
        },
      );
      gsap.fromTo(
        ".featured-card",
        { opacity: 0, y: 80, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".featured-card", start: "top 88%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 overflow-hidden"
      style={{
        background: sectionBg,
        transition: "background 0.5s ease",
      }}
    >
      {/* Glow blob */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2
                   w-[600px] h-[300px] opacity-10 pointer-events-none"
        style={{
          background: glowColor,
          transition: "background 0.5s ease",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* ── HEADER ──────────────────────────────────────── */}
        <div
          className="collection-title flex flex-col md:flex-row
                     items-start md:items-end justify-between mb-14 gap-6"
        >
          <div>
            {/* Label */}
            <div className="inline-flex items-center gap-2 mb-4">
              <div
                className="h-px w-8"
                style={{
                  background: labelLineL,
                  transition: "background 0.5s ease",
                }}
              />
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: accent, transition: "color 0.5s ease" }}
              >
                Grandeur Tailors
              </span>
            </div>

            {/* Heading */}
            <h2
              className="font-display text-4xl md:text-5xl font-bold"
              style={{ color: textPrimary, transition: "color 0.5s ease" }}
            >
              Featured <GradientText isDark={isDark}>Collection</GradientText>
            </h2>
            <p
              className="mt-3 max-w-md text-sm leading-relaxed"
              style={{ color: subText, transition: "color 0.5s ease" }}
            >
              Handcrafted premium pieces. Each outfit tells a story of skill,
              tradition and elegance.
            </p>
          </div>

          {/* View All CTA */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3
                       rounded-xl text-sm font-semibold
                       hover:opacity-90 transition-all duration-300
                       hover:scale-105 flex-shrink-0 active:scale-95"
            style={{
              background: btnBg,
              color: btnText,
              transition: "background 0.5s ease, color 0.5s ease",
            }}
          >
            View All
            <span>→</span>
          </Link>
        </div>

        {/* ── CARDS ───────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6"
          style={{ perspective: "1200px" }}
        >
          {featured.map((item) => (
            <FeaturedCard key={item.id} item={item} tokens={tokens} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
