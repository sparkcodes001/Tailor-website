import { Link } from "react-router-dom";
import { useWishlist } from "../../hooks/useWishlist";

const PLACEHOLDER_IMG =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="480" viewBox="0 0 400 480">
      <rect width="400" height="480" fill="#1a1c20"/>
      <text x="50%" y="50%" font-family="serif" font-size="16"
        fill="rgba(255,255,255,0.25)" text-anchor="middle" dy=".3em">
        No Image
      </text>
    </svg>
  `);

const HeartIcon = ({ filled, className }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

const ProductCard = ({ product }) => {
  const { id, name, images, category, available, description } = product;
  const { isWishlisted, toggleWishlist } = useWishlist();

  const image = images?.[0] || PLACEHOLDER_IMG;
  const wishlisted = isWishlisted(id);

  return (
    <div
      className="group relative rounded-3xl overflow-hidden border theme-transition
                 bg-bg-card border-border hover:border-border-hover
                 transition-all duration-500 hover:accent-glow flex flex-col h-full"
    >
      {/* ── IMAGE ── */}
      <Link
        to={`/shop/${id}`}
        className="relative block aspect-[5/6] overflow-hidden bg-bg-tertiary flex-shrink-0"
      >
        {/* Ambient glow behind product — echoes reference's studio lighting */}
        <div
          className="absolute -inset-8 opacity-40 blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, var(--accent), transparent 65%)",
          }}
        />

        <img
          src={image}
          alt={name}
          loading="lazy"
          className="relative w-full h-full object-cover transition-transform
                     duration-700 ease-out group-hover:scale-[1.05]"
        />

        {/* Bottom fade for legibility / depth */}
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.35), transparent)",
          }}
        />

        {/* Sold out badge */}
        {!available && (
          <span
            className="absolute top-4 left-4 text-[10px] font-bold tracking-[0.15em]
                       uppercase px-3 py-1.5 rounded-full backdrop-blur-sm
                       bg-black/60 text-white/90 border border-white/20"
          >
            Sold Out
          </span>
        )}
      </Link>

      {/* Wishlist heart — floats above image, always tappable (no hover dependency) */}
      <button
        type="button"
        onClick={() => toggleWishlist(id)}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wishlisted}
        className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center
                   justify-center backdrop-blur-md transition-all duration-300
                   hover:scale-110 active:scale-95 z-10"
        style={{
          background: "rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: wishlisted ? "var(--accent)" : "#ffffff",
        }}
      >
        <HeartIcon filled={wishlisted} className="w-4 h-4" />
      </button>

      {/* ── INFO ── */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent mb-2">
          {category}
        </p>

        <Link to={`/shop/${id}`}>
          <h3
            className="font-display font-bold text-xl leading-snug text-text-primary
                       mb-2 line-clamp-1 transition-colors duration-300
                       group-hover:text-accent"
          >
            {name}
          </h3>
        </Link>

        {description && (
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-5 flex-1">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 mt-auto">
          <span className="font-display font-bold text-base text-accent">
            Custom Quote
          </span>

          <Link
            to={`/shop/${id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl
                       text-xs font-bold uppercase tracking-wide
                       bg-accent text-bg-primary hover:opacity-90
                       transition-all duration-300 active:scale-95
                       flex-shrink-0"
          >
            View Details
            <span aria-hidden="true" className="text-sm leading-none">
              ↗
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
