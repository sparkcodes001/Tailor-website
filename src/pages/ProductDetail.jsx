import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import toast from "react-hot-toast";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { useProduct } from "../hooks/useProducts";
import { useRelatedProducts } from "../hooks/useRelatedProducts";
import { useLiveViewers } from "../hooks/useLiveViewers";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import { useProductsByIds } from "../hooks/useProductsByIds";
import { createWhatsAppLink } from "../utils/whatsapp";
import ProductCard from "../components/ui/ProductCard";
import Loader from "../components/ui/Loader";

gsap.registerPlugin(ScrollTrigger);

const PLACEHOLDER_IMG =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="720" viewBox="0 0 600 720">
      <rect width="600" height="720" fill="#1a1c20"/>
      <text x="50%" y="50%" font-family="serif" font-size="20"
        fill="rgba(255,255,255,0.25)" text-anchor="middle" dy=".3em">
        No Image Available
      </text>
    </svg>
  `);

const TABS = [
  { key: "details", label: "Details" },
  { key: "care", label: "Fabric & Care" },
  { key: "shipping", label: "Shipping & Delivery" },
];

const TRUST_POINTS = [
  { icon: "🧵", title: "Premium Fabrics", caption: "Finest quality materials" },
  { icon: "📐", title: "Perfect Fit", caption: "Tailored to your measure" },
  { icon: "✂️", title: "Handcrafted", caption: "Expertly stitched" },
  { icon: "👤", title: "Made for You", caption: "Unique. Like you." },
];

const ProductDetail = () => {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { products: related, loading: relatedLoading } = useRelatedProducts(
    product?.category,
    id,
  );

  const viewerCount = useLiveViewers(id);
  const recentIds = useRecentlyViewed(id);
  const { products: recentlyViewed } = useProductsByIds(recentIds);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({});
  const [activeTab, setActiveTab] = useState("details");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const contentRef = useRef(null);

  const images = useMemo(
    () => (product?.images?.length ? product.images : [PLACEHOLDER_IMG]),
    [product],
  );

  const slides = useMemo(() => images.map((src) => ({ src })), [images]);

  const requiresSize = product?.sizes?.length > 0;
  const canChat = !requiresSize || Boolean(selectedSize);

  useEffect(() => {
    document.title = product
      ? `${product.name} | Grandeur Tailor`
      : "Product | Grandeur Tailor";
  }, [product]);

  useEffect(() => {
    setActiveImage(0);
    setSelectedSize(null);
    setActiveTab("details");
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pd-gallery",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" },
      );
      gsap.fromTo(
        ".pd-info > *",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.15,
        },
      );
    }, contentRef);
    return () => ctx.revert();
  }, [product]);

  useEffect(() => {
    if (relatedLoading || related.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".related-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".related-section", start: "top 85%" },
        },
      );
    });
    return () => ctx.revert();
  }, [relatedLoading, related]);

  useEffect(() => {
    if (recentlyViewed.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".recent-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".recent-section", start: "top 90%" },
        },
      );
    });
    return () => ctx.revert();
  }, [recentlyViewed]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: "scale(1.7)" });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: "center", transform: "scale(1)" });
  };

  const handleChatClick = (e) => {
    if (!canChat) {
      e.preventDefault();
      toast.error("Please select a size before chatting with the tailor.");
    }
  };

  const whatsappHref = product
    ? createWhatsAppLink({
        message: `Hi! I'm interested in *${product.name}* 🧵\n\n${
          selectedSize ? `Size: ${selectedSize}\n` : ""
        }Product Link: ${window.location.href}\n\nCould you please give me more details about pricing and availability?`,
      })
    : "#";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary theme-transition">
        <Loader fullScreen />
      </div>
    );
  }

  if (error || !product) {
    return (
      <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center bg-bg-primary theme-transition">
        <p className="text-6xl mb-4" aria-hidden="true">
          🧵
        </p>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-3">
          Product Not Found
        </h1>
        <p className="text-text-secondary max-w-sm mb-8">
          This item may have been removed or the link is incorrect.
        </p>
        <Link
          to="/shop"
          className="px-8 py-4 rounded-2xl font-bold text-sm bg-accent
                     text-bg-primary hover:opacity-90 transition-all duration-300
                     hover:scale-105"
        >
          Back to Shop
        </Link>
      </section>
    );
  }

  return (
    <section
      ref={contentRef}
      className="px-6 py-24 bg-bg-primary theme-transition"
    >
      <div className="max-w-7xl mx-auto">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-text-muted
                     hover:text-accent transition-colors duration-300 mb-8"
        >
          <span aria-hidden="true">←</span> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* ══════════ GALLERY ══════════ */}
          <div className="pd-gallery lg:sticky lg:top-28 lg:self-start">
            <div className="grid grid-cols-1 sm:grid-cols-[88px_1fr] gap-4">
              {images.length > 1 && (
                <div
                  className="order-2 sm:order-1 flex sm:flex-col gap-3
                             overflow-x-auto sm:overflow-y-auto sm:max-h-[600px] pb-1 sm:pb-0"
                >
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      aria-label={`View image ${i + 1}`}
                      aria-current={activeImage === i}
                      className="relative flex-shrink-0 w-16 h-20 sm:w-full sm:h-24
                                 rounded-xl overflow-hidden border-2 transition-all duration-300"
                      style={{
                        borderColor:
                          activeImage === i ? "var(--accent)" : "var(--border)",
                        opacity: activeImage === i ? 1 : 0.55,
                      }}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image — click to open immersive lightbox */}
              <div
                className={`relative order-1 sm:order-2 aspect-[4/5] rounded-3xl
                           overflow-hidden bg-bg-tertiary cursor-zoom-in isolate
                           ${images.length > 1 ? "" : "sm:col-span-2"}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => setLightboxOpen(true)}
              >
                {/* Ambient glow — hardened: z-0, clipped by parent overflow-hidden */}
                <div
                  className="absolute -inset-10 opacity-30 blur-3xl pointer-events-none z-0"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 35%, var(--accent), transparent 65%)",
                  }}
                />
                <img
                  src={images[activeImage]}
                  alt={`${product.name} — view ${activeImage + 1}`}
                  className="relative z-10 w-full h-full object-cover transition-transform duration-300 ease-out"
                  style={zoomStyle}
                />

                {product.featured && (
                  <span
                    className="absolute top-4 left-4 z-20 text-[10px] font-bold tracking-[0.15em]
                               uppercase px-3 py-1.5 rounded-full"
                    style={{
                      background: "var(--accent)",
                      color: "var(--bg-primary)",
                    }}
                  >
                    Featured
                  </span>
                )}

                {!product.available && (
                  <span
                    className="absolute top-4 right-4 z-20 text-[10px] font-bold tracking-[0.15em]
                               uppercase px-3 py-1.5 rounded-full backdrop-blur-sm
                               bg-black/60 text-white/90 border border-white/20"
                  >
                    Currently Unavailable
                  </span>
                )}

                <span
                  className="absolute bottom-4 right-4 z-20 text-[10px] font-semibold
                             px-3 py-1.5 rounded-full backdrop-blur-sm bg-black/50 text-white/90
                             flex items-center gap-1.5"
                >
                  🔍 Tap to zoom
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {TRUST_POINTS.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col items-center text-center gap-1.5 p-4 rounded-2xl border theme-transition"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--bg-card)",
                  }}
                >
                  <span className="text-xl" aria-hidden="true">
                    {item.icon}
                  </span>
                  <p className="text-xs font-semibold text-text-primary">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-text-muted leading-tight">
                    {item.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ══════════ INFO ══════════ */}
          <div className="pd-info">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">
              {product.category}
            </p>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-3 leading-tight">
              {product.name}
            </h1>

            {product.description && (
              <p className="text-text-secondary leading-relaxed mb-4">
                {product.description}
              </p>
            )}

            {viewerCount > 1 && (
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                <span className="text-xs font-semibold text-orange-400">
                  🔥 {viewerCount} people viewing this right now
                </span>
              </div>
            )}

            <div
              className="flex items-center gap-3 pb-6 mb-6 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="font-display text-2xl font-bold text-accent">
                Custom Quote
              </span>
              <span className="text-xs text-text-muted">
                Pricing discussed directly with your tailor
              </span>
            </div>

            {requiresSize && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Select Size <span className="text-accent">*</span>
                  </p>
                  <Link
                    to="/custom-order"
                    className="text-xs text-accent hover:opacity-80 transition-opacity"
                  >
                    Need a custom size?
                  </Link>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((size) => {
                    const active = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className="aspect-square rounded-xl text-sm font-bold border
                                   flex items-center justify-center transition-all duration-200"
                        style={{
                          background: active ? "var(--accent)" : "transparent",
                          color: active
                            ? "var(--bg-primary)"
                            : "var(--text-secondary)",
                          borderColor: active
                            ? "var(--accent)"
                            : "var(--border)",
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                {!selectedSize && (
                  <p className="text-xs text-text-muted mt-2">
                    Select a size to continue
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3 mb-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleChatClick}
                aria-disabled={!canChat}
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl
                           font-bold text-sm transition-all duration-300"
                style={{
                  background: canChat ? "var(--accent)" : "var(--bg-tertiary)",
                  color: canChat ? "var(--bg-primary)" : "var(--text-muted)",
                  cursor: canChat ? "pointer" : "not-allowed",
                  opacity: canChat ? 1 : 0.6,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full bg-green-400 animate-pulse"
                  aria-hidden="true"
                />
                Chat With Tailor
              </a>

              <Link
                to="/custom-order"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl
                           font-semibold text-sm border transition-all duration-300 hover:border-accent"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              >
                Book a Custom Order
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <p className="text-xs text-text-muted text-center mt-4">
              ✓ Free alterations & perfect fit guarantee
            </p>

            <div className="mt-12">
              <div
                className="flex gap-6 border-b overflow-x-auto"
                style={{ borderColor: "var(--border)" }}
              >
                {TABS.map((tab) => {
                  const active = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className="relative pb-3 text-sm font-semibold whitespace-nowrap transition-colors duration-300"
                      style={{
                        color: active ? "var(--accent)" : "var(--text-muted)",
                      }}
                    >
                      {tab.label}
                      {active && (
                        <span
                          className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                          style={{ background: "var(--accent)" }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="py-6 text-sm text-text-secondary leading-relaxed">
                {activeTab === "details" && (
                  <ul className="space-y-2">
                    {[
                      "Handcrafted by our master tailors",
                      "Made to order — crafted after you place your request",
                      "Fully lined for comfort and durability",
                      requiresSize
                        ? `Available in sizes: ${product.sizes.join(", ")}`
                        : "Custom-fit to your exact measurements",
                    ].map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span className="text-accent mt-0.5" aria-hidden="true">
                          ✓
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === "care" && (
                  <p>
                    Dry clean recommended. Store on a padded hanger away from
                    direct sunlight. Steam gently to remove wrinkles — avoid
                    ironing directly over buttons or embellishments.
                  </p>
                )}
                {activeTab === "shipping" && (
                  <p>
                    Once your order is confirmed via WhatsApp, production
                    typically takes 5–14 days depending on complexity. We ship
                    worldwide via tracked courier — delivery timelines and costs
                    are confirmed directly with your tailor.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ RELATED ══════════ */}
        {related.length > 0 && (
          <div
            className="related-section mt-24 pt-16 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-10">
              You May Also <span className="text-accent">Like</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <div key={item.id} className="related-card">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ RECENTLY VIEWED ══════════ */}
        {recentlyViewed.length > 0 && (
          <div
            className="recent-section mt-24 pt-16 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-10">
              Recently <span className="text-accent">Viewed</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.map((item) => (
                <div key={item.id} className="recent-card">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ══════════ FULLSCREEN LIGHTBOX ══════════ */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={activeImage}
        on={{ view: ({ index }) => setActiveImage(index) }}
        plugins={[Zoom, Thumbnails]}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
        styles={{ container: { backgroundColor: "rgba(0,0,0,0.95)" } }}
      />
    </section>
  );
};

export default ProductDetail;
