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
    category: "Agbada",
    subCategory: "Premium",
    tag: "Bestseller",
    tagIcon: "🔥",
  },
  {
    id: 2,
    image: agbada2,
    name: "Black Embroidered Agbada",
    category: "Agbada",
    subCategory: "Luxury",
    tag: "New",
    tagIcon: "✨",
  },
  {
    id: 3,
    image: agbada3,
    name: "Cream Senator Set",
    category: "Senator",
    subCategory: "Classic",
    tag: "Featured",
    tagIcon: "⭐",
  },
  {
    id: 4,
    image: agbada4,
    name: "Navy Cross-Stitch Agbada",
    category: "Agbada",
    subCategory: "Traditional",
    tag: "Popular",
    tagIcon: "💎",
  },
];

const categories = ["All", "Agbada", "Senator"];

const isMobile = window.matchMedia("(hover: none)").matches;

// ── FAVORITE HEART BUTTON ────────────────────────────────────
const FavoriteButton = ({ active, onClick, accent }) => (
  <button
    onClick={onClick}
    className="w-8 h-8 rounded-full flex items-center justify-center
               transition-all duration-300 active:scale-90"
    style={{
      background: active ? accent : "rgba(255,255,255,0.10)",
      backdropFilter: "blur(8px)",
      border: `1px solid ${active ? accent : "rgba(255,255,255,0.20)"}`,
    }}
  >
    <span
      className="text-xs transition-transform duration-300"
      style={{ transform: active ? "scale(1.1)" : "scale(1)" }}
    >
      {active ? "❤️" : "🤍"}
    </span>
  </button>
);

const FeaturedCard = ({ item, index, tokens, favorites, toggleFavorite }) => {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const { accent, accentBg15, accentBorder30, btnText } = tokens;

  const showButtons = isMobile || hovered;
  const isFavorite = favorites.includes(item.id);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -8;
    const rotateY = ((x - rect.width / 2) / rect.width) * 8;
    gsap.to(card, {
      rotateX,
      rotateY,
      scale: 1.02,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 800,
    });

    // subtle image parallax inside card
    gsap.to(imgRef.current, {
      x: (x / rect.width - 0.5) * 14,
      y: (y / rect.height - 0.5) * 14,
      duration: 0.6,
      ease: "power2.out",
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
    gsap.to(imgRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.6)",
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
      {/* Image wrapper — scaled up slightly to allow parallax movement without edges showing */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={imgRef}
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover scale-110 transition-transform
                     duration-700 group-hover:scale-125"
        />
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(to top, rgba(15,17,20,0.95) 0%, rgba(15,17,20,0.4) 50%, rgba(15,17,20,0.1) 100%)",
          opacity: isMobile ? 1 : hovered ? 1 : 0.7,
        }}
      />

      {/* Corner brackets — matches Services cards */}
      <div className="absolute top-4 left-4 w-3 h-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div
          className="absolute top-0 left-0 w-full h-[1.5px]"
          style={{ background: accent }}
        />
        <div
          className="absolute top-0 left-0 h-full w-[1.5px]"
          style={{ background: accent }}
        />
      </div>
      <div className="absolute bottom-4 right-4 w-3 h-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div
          className="absolute bottom-0 right-0 w-full h-[1.5px]"
          style={{ background: accent }}
        />
        <div
          className="absolute bottom-0 right-0 h-full w-[1.5px]"
          style={{ background: accent }}
        />
      </div>

      {/* Top row — tag + favorite */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <span
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
          style={{
            background: accentBg15,
            border: `1px solid ${accentBorder30}`,
            color: accent,
            backdropFilter: "blur(8px)",
            transition: "all 0.5s ease",
          }}
        >
          <span>{item.tagIcon}</span>
          {item.tag}
        </span>

        <FavoriteButton
          active={isFavorite}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
          accent={accent}
        />
      </div>

      {/* Number watermark */}
      <div
        className="absolute top-14 left-4 text-4xl font-display font-bold
                   select-none pointer-events-none leading-none opacity-0
                   group-hover:opacity-100 transition-opacity duration-500"
        style={{ color: accent, opacity: 0.15 }}
      >
        0{index + 1}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p
          className="text-xs tracking-widest uppercase mb-1"
          style={{ color: `${accent}99`, transition: "color 0.5s ease" }}
        >
          {item.category} · {item.subCategory}
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
  const viewAllRef = useRef(null);
  const { isDark } = useTheme();

  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const filteredItems =
    activeCategory === "All"
      ? featured
      : featured.filter((item) => item.category === activeCategory);

  // ── TOKENS — fixed typo: #6b190e → #6b1d2e ─────────────────
  const accent = isDark ? "#b8f7e4" : "#6b1d2e";
  const accentDeep = isDark ? "#7ee8c8" : "#4e1220";
  const accentBg10 = isDark ? "rgba(184,247,228,0.10)" : "rgba(107,29,46,0.10)";
  const accentBg15 = isDark ? "rgba(184,247,228,0.15)" : "rgba(107,29,46,0.15)";
  const accentBorder30 = isDark
    ? "rgba(184,247,228,0.30)"
    : "rgba(107,29,46,0.30)";

  const sectionBg = isDark ? "#1a1c20" : "#fdf5f6";
  const glowColor = isDark
    ? "radial-gradient(ellipse, rgba(184,247,228,0.5) 0%, transparent 70%)"
    : "radial-gradient(ellipse, rgba(107,29,46,0.12) 0%, transparent 70%)";

  const labelLineL = isDark
    ? "linear-gradient(90deg, transparent, #b8f7e4)"
    : "linear-gradient(90deg, transparent, #6b1d2e)";

  const textPrimary = isDark ? "#ffffff" : "#1a0a0e";
  const textMuted = isDark ? "rgba(255,255,255,0.40)" : "rgba(26,10,14,0.40)";
  const subText = isDark ? "rgba(255,255,255,0.40)" : "rgba(26,10,14,0.45)";

  const btnBg = isDark ? "#b8f7e4" : "#6b1d2e";
  const btnText = isDark ? "#25272c" : "#fffdf7";

  const pillBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(107,29,46,0.04)";
  const pillBorder = isDark ? "rgba(255,255,255,0.10)" : "rgba(107,29,46,0.12)";
  const pillActiveBg = accent;

  const statBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(107,29,46,0.10)";

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
        { opacity: 0, y: 80, scale: 0.92, rotateZ: -1 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateZ: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".featured-card", start: "top 88%" },
        },
      );
      gsap.fromTo(
        ".trust-stat",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".trust-stat", start: "top 92%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Re-run card entrance when filter changes
  useEffect(() => {
    gsap.fromTo(
      ".featured-card",
      { opacity: 0, y: 30, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
      },
    );
  }, [activeCategory]);

  // ── MAGNETIC "VIEW ALL" ────────────────────────────────────
  const handleViewAllMove = (e) => {
    const rect = viewAllRef.current.getBoundingClientRect();
    gsap.to(viewAllRef.current, {
      x: (e.clientX - rect.left - rect.width / 2) * 0.3,
      y: (e.clientY - rect.top - rect.height / 2) * 0.3,
      duration: 0.3,
      ease: "power2.out",
    });
  };
  const handleViewAllLeave = () => {
    gsap.to(viewAllRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1,0.5)",
    });
  };

  const trustStats = [
    { icon: "🌍", label: "50+ Countries" },
    { icon: "✂️", label: "100% Handmade" },
    { icon: "⭐", label: "500+ Happy Clients" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 overflow-hidden"
      style={{ background: sectionBg, transition: "background 0.5s ease" }}
    >
      {/* Glow blob */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2
                   w-[600px] h-[300px] opacity-10 pointer-events-none"
        style={{ background: glowColor, transition: "background 0.5s ease" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ── HEADER ──────────────────────────────────────── */}
        <div
          className="collection-title flex flex-col md:flex-row
                     items-start md:items-end justify-between mb-10 gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8" style={{ background: labelLineL }} />
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: accent, transition: "color 0.5s ease" }}
              >
                Grandeur Tailors
              </span>
            </div>

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

          {/* Magnetic View All CTA */}
          <Link
            ref={viewAllRef}
            to="/shop"
            onMouseMove={handleViewAllMove}
            onMouseLeave={handleViewAllLeave}
            className="group relative inline-flex items-center gap-2 px-6 py-3
                       rounded-xl text-sm font-semibold overflow-hidden
                       hover:shadow-lg flex-shrink-0 active:scale-95"
            style={{
              background: btnBg,
              color: btnText,
              transition: "background 0.5s ease, color 0.5s ease",
            }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100
                         transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.35) 50%,transparent 60%)",
              }}
            />
            <span className="relative z-10">View All</span>
            <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </Link>
        </div>

        {/* ── CATEGORY FILTER PILLS ──────────────────────────── */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                style={{
                  background: isActive ? pillActiveBg : pillBg,
                  border: `1px solid ${isActive ? pillActiveBg : pillBorder}`,
                  color: isActive ? btnText : textMuted,
                  transition: "all 0.3s ease",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ── CARDS ───────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6"
          style={{ perspective: "1200px" }}
        >
          {filteredItems.map((item, index) => (
            <FeaturedCard
              key={item.id}
              item={item}
              index={index}
              tokens={tokens}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {/* ── TRUST STATS BAR ─────────────────────────────── */}
        <div
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12
                     mt-16 pt-10 border-t"
          style={{
            borderColor: statBorder,
            transition: "border-color 0.5s ease",
          }}
        >
          {trustStats.map((stat) => (
            <div
              key={stat.label}
              className="trust-stat flex items-center gap-2.5"
            >
              <span className="text-lg">{stat.icon}</span>
              <span
                className="text-sm font-medium"
                style={{ color: textMuted, transition: "color 0.5s ease" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
