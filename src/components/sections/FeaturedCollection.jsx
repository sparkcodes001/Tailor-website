import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { createWhatsAppLink } from "../../utils/whatsapp";

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

// Detect touch/mobile once
const isMobile = window.matchMedia("(hover: none)").matches;

const FeaturedCard = ({ item, index }) => {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Mobile → always show buttons
  // Desktop → only on hover (original behavior)
  const showButtons = isMobile || hovered;

  // ---- DESKTOP ONLY HANDLERS ----
  const handleMouseMove = (e) => {
    if (isMobile) return; // skip on mobile
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

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
    if (isMobile) return;
    setHovered(true);
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
      className="featured-card group relative rounded-3xl overflow-hidden
                 cursor-pointer"
      style={{
        transformStyle: "preserve-3d",
        aspectRatio: "3/4",
      }}
    >
      {/* Image - exactly the same */}
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-full object-cover transition-transform
                   duration-700 group-hover:scale-110"
      />

      {/* Gradient overlay
          Desktop → changes opacity on hover (original)
          Mobile  → always full opacity so text is readable */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(to top, rgba(15,17,20,0.95) 0%, rgba(15,17,20,0.4) 50%, rgba(15,17,20,0.1) 100%)",
          opacity: isMobile ? 1 : hovered ? 1 : 0.7,
        }}
      />

      {/* Tag - exactly the same */}
      <div className="absolute top-4 left-4">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{
            background: "rgba(184,247,228,0.15)",
            border: "1px solid rgba(184,247,228,0.3)",
            color: "#b8f7e4",
            backdropFilter: "blur(8px)",
          }}
        >
          {item.tag}
        </span>
      </div>

      {/* Content - exactly the same */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p
          className="text-xs tracking-widest uppercase mb-1"
          style={{ color: "rgba(184,247,228,0.6)" }}
        >
          {item.category}
        </p>
        <h3 className="text-white font-display font-bold text-lg mb-4">
          {item.name}
        </h3>

        {/* 
          Buttons:
          Desktop → slide up on hover (original)
          Mobile  → always visible, no animation needed
        */}
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
                       text-center text-[#25272c] transition-all
                       duration-300 hover:opacity-90 active:scale-95"
            style={{ background: "#b8f7e4" }}
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

      {/* Shine - desktop only, exactly the same */}
      {!isMobile && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity
                     duration-500 rounded-3xl"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(184,247,228,0.05) 50%, transparent 60%)",
            opacity: hovered ? 1 : 0,
          }}
        />
      )}
    </div>
  );
};

const FeaturedCollection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title - exactly the same
      gsap.fromTo(
        ".collection-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".collection-title",
            start: "top 85%",
          },
        },
      );

      // Cards - exactly the same
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
          scrollTrigger: {
            trigger: ".featured-card",
            start: "top 88%",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 overflow-hidden"
      style={{ background: "#1a1c20" }}
    >
      {/* Glow - exactly the same */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2
                   w-[600px] h-[300px] opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(184,247,228,0.5) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header - exactly the same */}
        <div
          className="collection-title flex flex-col md:flex-row
                     items-start md:items-end justify-between mb-14 gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <div
                className="h-px w-8"
                style={{
                  background: "linear-gradient(90deg, transparent, #b8f7e4)",
                }}
              />
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: "#b8f7e4" }}
              >
                Grandeur Tailors
              </span>
            </div>

            <h2
              className="font-display text-4xl md:text-5xl font-bold
                         text-white"
            >
              Featured{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #b8f7e4, #7ee8c8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Collection
              </span>
            </h2>
            <p className="text-white/40 mt-3 max-w-md">
              Handcrafted premium pieces. Each outfit tells a story of skill,
              tradition and elegance.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3
                       rounded-xl text-sm font-semibold text-[#25272c]
                       hover:opacity-90 transition-all duration-300
                       hover:scale-105 flex-shrink-0 active:scale-95"
            style={{ background: "#b8f7e4" }}
          >
            View All
            <span>→</span>
          </Link>
        </div>

        {/* 
          GRID - the only change:
          Mobile  → 1 col (grid-cols-1)
          Desktop → 4 cols (lg:grid-cols-4)
          Everything else exactly the same
        */}
        <div
          className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6"
          style={{ perspective: "1200px" }}
        >
          {featured.map((item, index) => (
            <FeaturedCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
