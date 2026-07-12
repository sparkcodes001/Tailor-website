import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { useGallery } from "../hooks/useGallery";
import { GALLERY_CATEGORIES } from "../data/galleryCategories";
import SectionTitle from "../components/ui/SectionTitle";
import Loader from "../components/ui/Loader";

gsap.registerPlugin(ScrollTrigger);

// ── SKELETON ────────────────────────────────────────────────
const SKELETON_HEIGHTS = [260, 340, 200, 300, 220, 380, 260, 200, 310];

const GallerySkeleton = () => (
  <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [&>*]:mb-5">
    {SKELETON_HEIGHTS.map((h, i) => (
      <div
        key={i}
        className="break-inside-avoid rounded-3xl animate-pulse"
        style={{ height: h, background: "var(--bg-tertiary)" }}
      />
    ))}
  </div>
);

// ── CATEGORY PILL ────────────────────────────────────────────
const CategoryPill = ({ label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full
               text-sm font-semibold transition-all duration-300 border
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
    style={{
      background: isActive ? "var(--accent)" : "var(--bg-card)",
      color: isActive ? "var(--bg-primary)" : "var(--text-secondary)",
      borderColor: isActive ? "var(--accent)" : "var(--border)",
      transform: isActive ? "scale(1.04)" : "scale(1)",
    }}
  >
    <span>{label}</span>
    {count !== undefined && (
      <span
        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all duration-300"
        style={{
          background: isActive
            ? "rgba(0,0,0,0.15)"
            : "color-mix(in srgb, var(--accent) 12%, transparent)",
          color: isActive ? "var(--bg-primary)" : "var(--accent)",
        }}
      >
        {count}
      </span>
    )}
  </button>
);

// ── GALLERY ITEM ─────────────────────────────────────────────
const GalleryItem = ({ img, index, onOpen, priority = false }) => {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="gallery-item group relative block w-full rounded-3xl overflow-hidden
                 break-inside-avoid border theme-transition focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-accent/60"
      style={{
        borderColor: hovered ? "var(--border-hover)" : "var(--border)",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.18)" : "none",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      aria-label={img.caption ? `View: ${img.caption}` : "View image"}
    >
      {/* Blur-up placeholder */}
      {!loaded && (
        <div
          className="w-full animate-pulse"
          style={{ minHeight: 200, background: "var(--bg-tertiary)" }}
        />
      )}

      <img
        src={img.image_url}
        alt={img.caption || "Gallery image"}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className="w-full h-auto object-cover transition-transform duration-700"
        style={{
          transform: hovered ? "scale(1.06)" : "scale(1)",
          opacity: loaded ? 1 : 0,
          transition:
            "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease",
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, transparent 35%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      {/* Zoom icon */}
      <div
        className="absolute top-3 right-3 w-8 h-8 rounded-full
                   flex items-center justify-center text-white text-sm
                   backdrop-blur-md transition-all duration-300"
        style={{
          background: "rgba(255,255,255,0.15)",
          opacity: hovered ? 1 : 0,
          transform: hovered
            ? "scale(1) rotate(0deg)"
            : "scale(0.6) rotate(-15deg)",
        }}
        aria-hidden="true"
      >
        ⤢
      </div>

      {/* Caption strip */}
      {(img.caption || img.category) && (
        <div
          className="absolute inset-x-0 bottom-0 p-4 transition-all duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
          }}
        >
          {img.category && (
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent mb-1">
              {img.category}
            </p>
          )}
          {img.caption && (
            <p className="text-xs text-white/90 text-left leading-relaxed">
              {img.caption}
            </p>
          )}
        </div>
      )}
    </button>
  );
};

// ── STATS BAR ────────────────────────────────────────────────
const StatsBar = ({ total, filtered, activeCategory }) => (
  <div className="flex items-center justify-between mb-8 px-1">
    <p className="text-sm text-text-muted">
      Showing <span className="font-bold text-text-primary">{filtered}</span>
      {activeCategory !== "all" && (
        <>
          {" "}
          in{" "}
          <span className="font-semibold text-accent capitalize">
            {activeCategory}
          </span>
        </>
      )}{" "}
      of <span className="font-bold text-text-primary">{total}</span> images
    </p>

    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
      <span className="text-xs text-text-muted font-medium">Live gallery</span>
    </div>
  </div>
);

// ── EMPTY STATE ───────────────────────────────────────────────
const EmptyState = ({ category }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div
      className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      🖼️
    </div>
    <p className="text-text-primary font-semibold text-lg mb-2">
      {category === "all" ? "Gallery is empty" : `No ${category} images yet`}
    </p>
    <p className="text-text-muted text-sm max-w-xs">
      {category === "all"
        ? "Images uploaded from the admin panel will appear here."
        : "Try selecting a different category or check back soon."}
    </p>
  </div>
);

// ── MAIN ─────────────────────────────────────────────────────
const Gallery = () => {
  const { images, loading, error } = useGallery();
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const gridRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    document.title = "Gallery | Grandeur Tailor";
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: images.length };
    GALLERY_CATEGORIES.forEach((cat) => {
      counts[cat] = images.filter((img) => img.category === cat).length;
    });
    return counts;
  }, [images]);

  const filteredImages = useMemo(() => {
    if (activeCategory === "all") return images;
    return images.filter((img) => img.category === activeCategory);
  }, [images, activeCategory]);

  const slides = useMemo(
    () =>
      filteredImages.map((img) => ({
        src: img.image_url,
        title: img.caption || undefined,
      })),
    [filteredImages],
  );

  // Header scroll reveal
  useEffect(() => {
    if (!headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gallery-header-item",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%" },
        },
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  // Grid stagger animation on filter change
  useEffect(() => {
    if (loading || filteredImages.length === 0 || !gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gallery-item",
        { opacity: 0, y: 28, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: { each: 0.045, from: "start" },
          ease: "power3.out",
        },
      );
    }, gridRef);
    return () => ctx.revert();
  }, [loading, activeCategory, filteredImages.length]);

  const handleCategoryChange = (cat) => {
    if (cat === activeCategory || isTransitioning) return;
    setIsTransitioning(true);

    if (gridRef.current) {
      gsap.to(".gallery-item", {
        opacity: 0,
        y: -12,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setActiveCategory(cat);
          setIsTransitioning(false);
        },
      });
    } else {
      setActiveCategory(cat);
      setIsTransitioning(false);
    }
  };

  return (
    <section className="min-h-screen bg-bg-primary theme-transition">
      {/* Hero header */}
      <div ref={headerRef} className="px-5 sm:px-8 pt-24 sm:pt-28 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="gallery-header-item">
            <SectionTitle
              eyebrow="Our Craft"
              title="The"
              highlight="Gallery"
              subtitle="A look into our work — every stitch, fitting, and finished piece."
            />
          </div>

          {/* Category filters */}
          <div className="gallery-header-item flex flex-wrap justify-center gap-2 sm:gap-3 mt-8 sm:mt-10 mb-0">
            <CategoryPill
              label="All"
              count={categoryCounts.all}
              isActive={activeCategory === "all"}
              onClick={() => handleCategoryChange("all")}
            />
            {GALLERY_CATEGORIES.filter(
              (cat) => (categoryCounts[cat] ?? 0) > 0,
            ).map((cat) => (
              <CategoryPill
                key={cat}
                label={cat}
                count={categoryCounts[cat]}
                isActive={activeCategory === cat}
                onClick={() => handleCategoryChange(cat)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main grid area */}
      <div className="px-5 sm:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Loading */}
          {loading && <GallerySkeleton />}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center py-24 text-center">
              <p className="text-4xl mb-4">⚠️</p>
              <p className="text-text-primary font-semibold mb-2">
                Couldn't load the gallery
              </p>
              <p className="text-text-muted text-sm">
                Please try again shortly.
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredImages.length === 0 && (
            <EmptyState category={activeCategory} />
          )}

          {/* Grid */}
          {!loading && !error && filteredImages.length > 0 && (
            <>
              <StatsBar
                total={images.length}
                filtered={filteredImages.length}
                activeCategory={activeCategory}
              />

              <div
                ref={gridRef}
                key={activeCategory}
                className="columns-1 sm:columns-2 lg:columns-3 gap-5 [&>*]:mb-5"
              >
                {filteredImages.map((img, index) => (
                  <GalleryItem
                    key={img.id}
                    img={img}
                    index={index}
                    onOpen={setLightboxIndex}
                    priority={index < 3}
                  />
                ))}
              </div>

              {/* Bottom count */}
              <p className="text-center text-xs text-text-muted mt-8 tracking-wider uppercase">
                {filteredImages.length} image
                {filteredImages.length !== 1 ? "s" : ""} ·{" "}
                {activeCategory === "all" ? "All categories" : activeCategory}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Zoom, Thumbnails]}
        styles={{
          container: { backgroundColor: "rgba(0,0,0,0.96)" },
          thumbnailsContainer: { backgroundColor: "rgba(0,0,0,0.85)" },
        }}
      />
    </section>
  );
};

export default Gallery;
