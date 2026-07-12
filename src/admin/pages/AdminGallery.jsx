import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { supabase } from "../../utils/supabase";
import GalleryUpload from "../components/GalleryUpload";
import toast from "react-hot-toast";

const BENTO_PATTERN = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
];
const getBentoSpan = (i) => BENTO_PATTERN[i % BENTO_PATTERN.length];

const GallerySkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[140px] grid-flow-dense gap-4">
    {BENTO_PATTERN.map((span, i) => (
      <div
        key={i}
        className={`${span} rounded-3xl animate-pulse`}
        style={{ background: "var(--bg-tertiary)" }}
      />
    ))}
  </div>
);

const Lightbox = ({ images, index, onClose, onPrev, onNext, onDelete }) => {
  const touchStartX = useRef(0);
  const img = images[index];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 60) onPrev();
    else if (delta < -60) onNext();
  };

  if (!img) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-10"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full
                   flex items-center justify-center text-white text-xl
                   bg-white/10 hover:bg-white/20 transition-colors z-10"
        aria-label="Close"
      >
        ×
      </button>

      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-xs font-semibold tracking-widest uppercase">
        {index + 1} / {images.length}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11
                   rounded-full items-center justify-center text-white text-xl
                   bg-white/10 hover:bg-white/20 transition-colors z-10"
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11
                   rounded-full items-center justify-center text-white text-xl
                   bg-white/10 hover:bg-white/20 transition-colors z-10"
        aria-label="Next"
      >
        ›
      </button>

      <div
        className="relative max-w-5xl max-h-[80vh] w-full flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={img.id}
          src={img.image_url}
          alt={img.caption || "Gallery image"}
          className="max-h-[70vh] w-auto max-w-full object-contain rounded-2xl lightbox-img-in"
        />
        <div className="flex items-center gap-3 text-center flex-wrap justify-center">
          {img.category && (
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80 px-3 py-1 rounded-full bg-white/10">
              {img.category}
            </span>
          )}
          {img.caption && (
            <p className="text-sm text-white/70">{img.caption}</p>
          )}
          <button
            onClick={() => onDelete(img.id)}
            className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors px-3 py-1 rounded-full bg-red-400/10"
          >
            Delete
          </button>
        </div>
      </div>

      <style>{`
        @keyframes lightbox-img-in { from{opacity:0; transform:scale(0.96);} to{opacity:1; transform:scale(1);} }
        .lightbox-img-in { animation: lightbox-img-in 0.25s ease-out; }
      `}</style>
    </div>
  );
};

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const gridRef = useRef(null);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) toast.error("Failed to load gallery.");
    else setImages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(images.map((i) => i.category).filter(Boolean)),
    );
    return ["all", ...unique];
  }, [images]);

  const filteredImages = useMemo(
    () =>
      activeCategory === "all"
        ? images
        : images.filter((i) => i.category === activeCategory),
    [images, activeCategory],
  );

  useEffect(() => {
    if (!gridRef.current || loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gallery-tile",
        { opacity: 0, y: 24, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "power3.out",
        },
      );
    }, gridRef);
    return () => ctx.revert();
  }, [filteredImages, loading]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this image? This cannot be undone.")) return;
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) return toast.error("Delete failed.");
    toast.success("Image deleted.");
    setLightboxIndex(null);
    fetchImages();
  };

  const handleSuccess = () => {
    setShowUpload(false);
    fetchImages();
  };

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null
          ? null
          : (i - 1 + filteredImages.length) % filteredImages.length,
      ),
    [filteredImages.length],
  );
  const nextImage = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? null : (i + 1) % filteredImages.length,
      ),
    [filteredImages.length],
  );

  return (
    <div className="p-5 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary">
            Gallery
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {images.length} image{images.length !== 1 ? "s" : ""} uploaded
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="px-6 py-3 rounded-2xl font-bold text-sm bg-accent
                     text-bg-primary hover:opacity-90 transition-all duration-300
                     hover:scale-105 active:scale-95 self-start sm:self-auto"
        >
          + Upload Images
        </button>
      </div>

      {categories.length > 1 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all duration-300 border"
              style={{
                background:
                  activeCategory === cat ? "var(--accent)" : "var(--bg-card)",
                color:
                  activeCategory === cat
                    ? "var(--bg-primary)"
                    : "var(--text-secondary)",
                borderColor:
                  activeCategory === cat ? "var(--accent)" : "var(--border)",
              }}
            >
              {cat}
              {cat !== "all" && (
                <span className="ml-1.5 opacity-70">
                  {images.filter((i) => i.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {showUpload && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-8 border"
            style={{
              background: "var(--bg-secondary)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-text-primary">
                Upload to Gallery
              </h2>
              <button
                onClick={() => setShowUpload(false)}
                className="text-text-muted hover:text-text-primary transition-colors text-xl"
              >
                ×
              </button>
            </div>
            <GalleryUpload onSuccess={handleSuccess} />
          </div>
        </div>
      )}

      {loading ? (
        <GallerySkeleton />
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-4xl mb-4">🖼️</p>
          <p className="text-text-muted">
            {images.length === 0
              ? "No images yet. Upload your first batch."
              : "No images in this category."}
          </p>
        </div>
      ) : (
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[140px] grid-flow-dense gap-4"
        >
          {filteredImages.map((img, index) => (
            <div
              key={img.id}
              onClick={() => openLightbox(index)}
              className={`gallery-tile group relative rounded-3xl overflow-hidden border cursor-pointer ${getBentoSpan(index)}`}
              style={{ borderColor: "var(--border)" }}
            >
              <img
                src={img.image_url}
                alt={img.caption || "Gallery image"}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100
                           transition-opacity duration-300 flex flex-col justify-between p-3"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 30%, rgba(0,0,0,0.65) 100%)",
                }}
              >
                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(img.id);
                    }}
                    className="w-7 h-7 rounded-full bg-red-500 text-white text-sm
                               flex items-center justify-center hover:bg-red-600 transition-colors"
                    aria-label="Delete image"
                  >
                    ×
                  </button>
                </div>
                <div>
                  {img.category && (
                    <p className="text-xs font-semibold text-white/90 capitalize">
                      {img.category}
                    </p>
                  )}
                  {img.caption && (
                    <p className="text-xs text-white/70 truncate">
                      {img.caption}
                    </p>
                  )}
                </div>
              </div>
              <div
                className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/15
                           backdrop-blur-sm flex items-center justify-center text-white text-xs
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                ⤢
              </div>
            </div>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={filteredImages}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
          onDelete={handleDelete}
        />
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AdminGallery;
