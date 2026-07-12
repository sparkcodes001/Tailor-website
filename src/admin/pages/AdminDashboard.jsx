import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { supabase } from "../../utils/supabase";
import { useAuth } from "../../context/AuthContext";

// ─────────────────────────────────────────────────────────────
// ANIMATED SPARKLINE (draws itself in with GSAP)
// ─────────────────────────────────────────────────────────────
const Sparkline = ({ data, color, animate = true }) => {
  const pathRef = useRef(null);
  const areaRef = useRef(null);
  const dotRef = useRef(null);

  if (!data || data.length < 2) return null;

  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 80;
  const H = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * H;
    return [x, y];
  });
  const line = pts.map((p) => p.join(",")).join(" ");
  const area = `M0,${H} L${line
    .split(" ")
    .map((p) => `L${p}`)
    .join(" ")} L${W},${H} Z`;
  const last = pts.at(-1);

  useEffect(() => {
    if (!animate || !pathRef.current) return;
    const path = pathRef.current;
    const length = path.getTotalLength();

    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(areaRef.current, { opacity: 0 });
    gsap.set(dotRef.current, { scale: 0, transformOrigin: "center" });

    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(path, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" })
      .to(areaRef.current, { opacity: 1, duration: 0.6 }, "-=0.5")
      .to(
        dotRef.current,
        { scale: 1, duration: 0.4, ease: "back.out(3)" },
        "-=0.3",
      );

    return () => tl.kill();
  }, [animate, data]);

  return (
    <svg width={W} height={H} className="overflow-visible flex-shrink-0">
      <defs>
        <linearGradient
          id={`sg-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        ref={areaRef}
        d={area}
        fill={`url(#sg-${color.replace("#", "")})`}
      />
      <polyline
        ref={pathRef}
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle ref={dotRef} cx={last[0]} cy={last[1]} r="3" fill={color} />
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────
// ANIMATED COUNTER (with easing + subtle scale pop on complete)
// ─────────────────────────────────────────────────────────────
const AnimatedCount = ({ value, delay = 0 }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (value === null || value === undefined || !ref.current) return;
    const obj = { val: 0 };
    const tl = gsap.timeline({ delay });
    tl.to(obj, {
      val: value,
      duration: 1.3,
      ease: "power3.out",
      onUpdate: () =>
        ref.current && (ref.current.textContent = Math.round(obj.val)),
    })
      .to(
        ref.current,
        { scale: 1.12, duration: 0.15, ease: "power1.out" },
        "-=0.1",
      )
      .to(ref.current, {
        scale: 1,
        duration: 0.25,
        ease: "elastic.out(1,0.5)",
      });
    return () => tl.kill();
  }, [value, delay]);
  return (
    <span
      ref={ref}
      className="inline-block"
      style={{ transformOrigin: "left center" }}
    >
      {value == null ? "—" : 0}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// 3D MAGNETIC TILT WRAPPER
// ─────────────────────────────────────────────────────────────
const useTilt = (strength = 10) => {
  const ref = useRef(null);

  const handleMove = useCallback(
    (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(ref.current, {
        rotateY: x * strength,
        rotateX: -y * strength,
        transformPerspective: 900,
        duration: 0.4,
        ease: "power2.out",
      });
    },
    [strength],
  );

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.4)",
    });
  }, []);

  return { ref, handleMove, handleLeave };
};

// ─────────────────────────────────────────────────────────────
// STAT CARD (magnetic tilt + spotlight cursor glow)
// ─────────────────────────────────────────────────────────────
const StatCard = ({
  label,
  value,
  icon,
  to,
  change,
  sparkData,
  color = "var(--accent)",
  index = 0,
}) => {
  const { ref: tiltRef, handleMove, handleLeave } = useTilt(8);
  const glowRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const isPositive = (change ?? 0) >= 0;

  const handleMouseMove = (e) => {
    handleMove(e);
    if (glowRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      gsap.to(glowRef.current, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <Link
      ref={tiltRef}
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHovered(false);
        handleLeave();
      }}
      className="stat-card relative rounded-3xl p-6 border flex flex-col gap-4 overflow-hidden
                 theme-transition group"
      style={{
        background: "var(--bg-card)",
        borderColor: hovered
          ? "color-mix(in srgb, var(--accent) 45%, var(--border))"
          : "var(--border)",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.16)" : "none",
        transformStyle: "preserve-3d",
        willChange: "transform",
        transition: "border-color 0.3s, box-shadow 0.4s",
      }}
    >
      {/* Cursor spotlight */}
      <div
        ref={glowRef}
        className="absolute w-40 h-40 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, ${color} 15%, transparent), transparent 70%)`,
          transform: "translate(-80px, -80px)",
          left: 0,
          top: 0,
        }}
      />

      <div
        className="relative flex items-start justify-between"
        style={{ transform: "translateZ(20px)" }}
      >
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 icon-float"
          style={{
            background: `color-mix(in srgb, ${color} 12%, transparent)`,
          }}
        >
          {icon}
        </div>
        {sparkData && <Sparkline data={sparkData} color={color} />}
      </div>

      <div className="relative" style={{ transform: "translateZ(15px)" }}>
        <p className="text-3xl font-bold font-display text-text-primary">
          <AnimatedCount value={value} delay={index * 0.15} />
        </p>
        <p className="text-xs text-text-muted uppercase tracking-wider mt-0.5">
          {label}
        </p>
      </div>

      {change !== undefined && (
        <div
          className="relative flex items-center gap-1.5"
          style={{ transform: "translateZ(10px)" }}
        >
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5"
            style={{
              background: isPositive
                ? "color-mix(in srgb, #4ade80 12%, transparent)"
                : "color-mix(in srgb, #f87171 12%, transparent)",
              color: isPositive ? "#4ade80" : "#f87171",
            }}
          >
            <span
              className={isPositive ? "trend-arrow-up" : "trend-arrow-down"}
            >
              {isPositive ? "↑" : "↓"}
            </span>
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-text-muted">this month</span>
        </div>
      )}

      <span
        className="absolute bottom-4 right-5 text-xs font-semibold opacity-0 group-hover:opacity-100
                   transition-all duration-300 group-hover:translate-x-0 translate-x-[-4px]"
        style={{ color }}
      >
        Manage →
      </span>
    </Link>
  );
};

// ─────────────────────────────────────────────────────────────
// DONUT CHART (animates draw-in with GSAP)
// ─────────────────────────────────────────────────────────────
const DonutChart = ({ segments, total }) => {
  const R = 36;
  const C = 2 * Math.PI * R;
  const circleRefs = useRef([]);
  const textRef = useRef(null);
  let offset = 0;

  useEffect(() => {
    circleRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { strokeDasharray: `0 ${C}` });
    });

    const tl = gsap.timeline({ delay: 0.2 });
    let cumulativeOffset = 0;
    segments.forEach((seg, i) => {
      const dash = total ? (seg.value / total) * C : 0;
      const el = circleRefs.current[i];
      if (!el) return;
      tl.to(
        el,
        {
          strokeDasharray: `${dash} ${C - dash}`,
          duration: 0.9,
          ease: "power2.inOut",
        },
        i === 0 ? 0 : "-=0.6",
      );
      cumulativeOffset += dash;
    });

    if (textRef.current) {
      const obj = { val: 0 };
      tl.to(
        obj,
        {
          val: total,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => (textRef.current.textContent = Math.round(obj.val)),
        },
        0,
      );
    }

    return () => tl.kill();
  }, [segments, total]);

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="flex-shrink-0"
      >
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="var(--border)"
          strokeWidth="10"
        />
        {segments.map((seg, i) => {
          const dash = total ? (seg.value / total) * C : 0;
          const el = (
            <circle
              key={i}
              ref={(node) => (circleRefs.current[i] = node)}
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth="10"
              strokeDashoffset={-offset}
              strokeLinecap="round"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "50% 50%",
              }}
            />
          );
          offset += dash;
          return el;
        })}
        <text
          ref={textRef}
          x="50"
          y="55"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="var(--text-primary)"
        >
          0
        </text>
      </svg>
      <div className="space-y-2 min-w-[120px]">
        {segments.map((seg, i) => (
          <div
            key={seg.label}
            className="flex items-center gap-2 donut-legend"
            style={{ animationDelay: `${0.4 + i * 0.1}s` }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: seg.color }}
            />
            <span className="text-xs text-text-muted flex-1">{seg.label}</span>
            <span className="text-xs font-bold text-text-primary">
              {seg.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ACTIVITY ITEM (slides in with icon bounce)
// ─────────────────────────────────────────────────────────────
const ActivityItem = ({ icon, text, time, color, index }) => {
  const itemRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    if (!itemRef.current) return;
    const tl = gsap.timeline({ delay: 0.5 + index * 0.08 });
    tl.fromTo(
      itemRef.current,
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" },
    ).fromTo(
      iconRef.current,
      { scale: 0, rotate: -90 },
      { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2.5)" },
      "-=0.35",
    );
    return () => tl.kill();
  }, [index]);

  return (
    <div ref={itemRef} className="flex items-start gap-3 py-3">
      <div
        ref={iconRef}
        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
        style={{ background: `${color}18`, color }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary leading-snug">{text}</p>
        <p className="text-xs text-text-muted mt-0.5">{time}</p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// RECENT PRODUCTS (staggered slide-in rows)
// ─────────────────────────────────────────────────────────────
const RecentProducts = ({ products }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".recent-product-row",
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [products]);

  return (
    <div ref={containerRef} className="space-y-3">
      {products.map((p) => (
        <Link
          key={p.id}
          to="/admin/products"
          className="recent-product-row flex items-center gap-3 p-3 rounded-2xl border
                     transition-all duration-200 hover:border-accent/40 hover:translate-x-1"
          style={{
            background: "var(--bg-tertiary)",
            borderColor: "var(--border)",
          }}
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-bg-primary">
            {p.images?.[0] ? (
              <img
                src={p.images[0]}
                alt={p.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-base">
                👔
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">
              {p.name}
            </p>
            <p className="text-xs text-text-muted capitalize">{p.category}</p>
          </div>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
            style={{
              background: p.available
                ? "color-mix(in srgb, #4ade80 12%, transparent)"
                : "color-mix(in srgb, #f87171 12%, transparent)",
              color: p.available ? "#4ade80" : "#f87171",
            }}
          >
            {p.available ? "Live" : "Off"}
          </span>
        </Link>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// RECENT GALLERY (pop-in scale stagger, video hover-play)
// ─────────────────────────────────────────────────────────────
const GalleryThumb = ({ img }) => {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    if (hovered) videoRef.current.play().catch(() => {});
    else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [hovered]);

  return (
    <Link
      to="/admin/gallery"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="recent-gallery-thumb relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border
                 transition-transform duration-300 hover:scale-105"
      style={{ borderColor: "var(--border)" }}
    >
      {img.media_type === "video" ? (
        <>
          <video
            ref={videoRef}
            src={img.media_url || img.image_url}
            className="w-full h-full object-cover"
            muted
            playsInline
            loop
          />
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity duration-300"
            style={{ opacity: hovered ? 0 : 1 }}
          >
            <span className="text-white text-xs">▶</span>
          </div>
        </>
      ) : (
        <img
          src={img.image_url}
          alt={img.caption || ""}
          className="w-full h-full object-cover"
        />
      )}
    </Link>
  );
};

const RecentGallery = ({ items }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".recent-gallery-thumb",
        { opacity: 0, scale: 0.7 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "back.out(2)",
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [items]);

  return (
    <div
      ref={containerRef}
      className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide"
    >
      {items.map((img) => (
        <GalleryThumb key={img.id} img={img} />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAGNETIC QUICK ACTION BUTTON
// ─────────────────────────────────────────────────────────────
const QuickAction = ({ to, label, icon, primary, external, index = 0 }) => {
  const btnRef = useRef(null);

  const handleMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    gsap.to(btnRef.current, { x, y, duration: 0.3, ease: "power2.out" });
  };
  const handleLeave = () => {
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  };

  useEffect(() => {
    if (!btnRef.current) return;
    gsap.fromTo(
      btnRef.current,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        delay: 0.6 + index * 0.07,
        ease: "power2.out",
      },
    );
  }, [index]);

  return (
    <Link
      ref={btnRef}
      to={to}
      target={external ? "_blank" : undefined}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-colors duration-300"
      style={
        primary
          ? { background: "var(--accent)", color: "var(--bg-primary)" }
          : {
              background: "var(--bg-card)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }
      }
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
};

// ─────────────────────────────────────────────────────────────
// LIVE INDICATOR (pulsing ripple)
// ─────────────────────────────────────────────────────────────
const LiveIndicator = () => (
  <div
    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border self-start sm:self-auto"
    style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
  >
    <span className="relative flex w-2 h-2">
      <span
        className="absolute inline-flex h-full w-full rounded-full opacity-60 ripple-ping"
        style={{ background: "#4ade80" }}
      />
      <span
        className="relative inline-flex rounded-full w-2 h-2"
        style={{ background: "#4ade80" }}
      />
    </span>
    <span className="text-xs font-semibold text-text-secondary">
      Store is live
    </span>
  </div>
);

// ─────────────────────────────────────────────────────────────
// SKELETON LOADER
// ─────────────────────────────────────────────────────────────
const DashboardSkeleton = () => (
  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
    <div className="flex justify-between mb-8">
      <div>
        <div className="skeleton-shimmer h-3 w-24 rounded-full mb-3" />
        <div className="skeleton-shimmer h-8 w-48 rounded-full mb-2" />
        <div className="skeleton-shimmer h-3 w-64 rounded-full" />
      </div>
      <div className="skeleton-shimmer h-10 w-32 rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton-shimmer h-40 rounded-3xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton-shimmer h-48 rounded-3xl" />
        ))}
      </div>
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton-shimmer h-40 rounded-3xl" />
        ))}
      </div>
    </div>
    <style>{`
      .skeleton-shimmer {
        background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-card) 50%, var(--bg-tertiary) 75%);
        background-size: 200% 100%;
        animation: shimmer-move 1.5s ease-in-out infinite;
      }
      @keyframes shimmer-move {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { user } = useAuth();
  const pageRef = useRef(null);
  const headerRef = useRef(null);

  const [counts, setCounts] = useState({
    products: null,
    gallery: null,
    testimonials: null,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentGallery, setRecentGallery] = useState([]);
  const [recentTestimonials, setRecentTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12
      ? "Good morning"
      : greetingHour < 17
        ? "Good afternoon"
        : "Good evening";
  const firstName = user?.email?.split("@")[0] || "Admin";

  const sparklines = {
    products: [3, 5, 4, 7, 6, 8, 9],
    gallery: [10, 14, 12, 18, 22, 19, 25],
    testimonials: [1, 2, 2, 3, 4, 4, 5],
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [p, g, t, rp, rg, rt] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("gallery").select("id", { count: "exact", head: true }),
        supabase
          .from("testimonials")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("products")
          .select("id,name,category,available,images")
          .order("created_at", { ascending: false })
          .limit(4),
        supabase
          .from("gallery")
          .select("id,image_url,media_url,media_type,caption,category")
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("testimonials")
          .select("id,name,review,rating")
          .order("created_at", { ascending: false })
          .limit(3),
      ]);

      setCounts({ products: p.count, gallery: g.count, testimonials: t.count });
      setRecentProducts(rp.data || []);
      setRecentGallery(rg.data || []);
      setRecentTestimonials(rt.data || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Master entrance timeline — orchestrated, not just a flat stagger
  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".dash-header-item",
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
      )
        .fromTo(
          ".stat-card",
          { opacity: 0, y: 30, rotateX: -10 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .fromTo(
          ".dash-panel",
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.4",
        );
    }, pageRef);
    return () => ctx.revert();
  }, [loading]);

  const activity = [
    ...recentProducts.map((p) => ({
      icon: "👔",
      text: `Product "${p.name}" added`,
      time: "Recently",
      color: "#60a5fa",
    })),
    ...recentTestimonials.map((t) => ({
      icon: "💬",
      text: `New review from ${t.name} — ${"★".repeat(t.rating)}`,
      time: "Recently",
      color: "#34d399",
    })),
    ...recentGallery.slice(0, 2).map((g) => ({
      icon: g.media_type === "video" ? "🎬" : "🖼️",
      text: `${g.media_type === "video" ? "Video" : "Image"} uploaded${g.caption ? `: "${g.caption}"` : ""}`,
      time: "Recently",
      color: "#a78bfa",
    })),
  ].slice(0, 6);

  const totalItems =
    (counts.products || 0) + (counts.gallery || 0) + (counts.testimonials || 0);

  if (loading) return <DashboardSkeleton />;

  return (
    <div ref={pageRef} className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div
        ref={headerRef}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <p className="dash-header-item text-text-muted text-sm font-medium">
            {greeting},
          </p>
          <h1 className="dash-header-item font-display text-2xl sm:text-3xl font-bold text-text-primary capitalize">
            {firstName} <span className="inline-block wave-emoji">👋</span>
          </h1>
          <p className="dash-header-item text-text-muted text-sm mt-1">
            Here's what's happening in your store today.
          </p>
        </div>
        <div className="dash-header-item">
          <LiveIndicator />
        </div>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        style={{ perspective: "1000px" }}
      >
        <StatCard
          label="Products"
          value={counts.products}
          icon="👔"
          to="/admin/products"
          change={12}
          sparkData={sparklines.products}
          color="#60a5fa"
          index={0}
        />
        <StatCard
          label="Gallery Items"
          value={counts.gallery}
          icon="🖼️"
          to="/admin/gallery"
          change={8}
          sparkData={sparklines.gallery}
          color="#a78bfa"
          index={1}
        />
        <StatCard
          label="Testimonials"
          value={counts.testimonials}
          icon="💬"
          to="/admin/testimonials"
          change={5}
          sparkData={sparklines.testimonials}
          color="#34d399"
          index={2}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className="dash-panel rounded-3xl border p-5 sm:p-6 theme-transition"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-text-primary">
                Recent Products
              </h2>
              <Link
                to="/admin/products"
                className="text-xs font-semibold text-accent hover:opacity-80 transition-opacity"
              >
                View all →
              </Link>
            </div>
            {recentProducts.length > 0 ? (
              <RecentProducts products={recentProducts} />
            ) : (
              <p className="text-text-muted text-sm py-4 text-center">
                No products yet.
              </p>
            )}
          </div>

          <div
            className="dash-panel rounded-3xl border p-5 sm:p-6 theme-transition"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-text-primary">
                Recent Gallery
              </h2>
              <Link
                to="/admin/gallery"
                className="text-xs font-semibold text-accent hover:opacity-80 transition-opacity"
              >
                View all →
              </Link>
            </div>
            {recentGallery.length > 0 ? (
              <RecentGallery items={recentGallery} />
            ) : (
              <p className="text-text-muted text-sm py-4 text-center">
                No gallery items yet.
              </p>
            )}
          </div>

          <div
            className="dash-panel rounded-3xl border p-5 sm:p-6 theme-transition"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-text-primary">
                Recent Reviews
              </h2>
              <Link
                to="/admin/testimonials"
                className="text-xs font-semibold text-accent hover:opacity-80 transition-opacity"
              >
                View all →
              </Link>
            </div>
            {recentTestimonials.length > 0 ? (
              <div className="space-y-3">
                {recentTestimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl border"
                    style={{
                      background: "var(--bg-tertiary)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-text-primary">
                        {t.name}
                      </p>
                      <span
                        className="text-xs"
                        style={{ color: "var(--accent)" }}
                      >
                        {"★".repeat(t.rating)}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                      "{t.review}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-sm py-4 text-center">
                No reviews yet.
              </p>
            )}
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-6">
          <div
            className="dash-panel rounded-3xl border p-5 sm:p-6 theme-transition"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <h2 className="font-display font-bold text-text-primary mb-4">
              Store Overview
            </h2>
            {totalItems > 0 ? (
              <DonutChart
                total={totalItems}
                segments={[
                  {
                    label: "Products",
                    value: counts.products || 0,
                    color: "#60a5fa",
                  },
                  {
                    label: "Gallery",
                    value: counts.gallery || 0,
                    color: "#a78bfa",
                  },
                  {
                    label: "Testimonials",
                    value: counts.testimonials || 0,
                    color: "#34d399",
                  },
                ]}
              />
            ) : (
              <p className="text-text-muted text-sm text-center py-4">
                No data yet.
              </p>
            )}
          </div>

          <div
            className="dash-panel rounded-3xl border p-5 sm:p-6 theme-transition"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <h2 className="font-display font-bold text-text-primary mb-1">
              Activity
            </h2>
            <p className="text-xs text-text-muted mb-3">Latest changes</p>
            {activity.length > 0 ? (
              <div
                className="divide-y"
                style={{ borderColor: "var(--border)" }}
              >
                {activity.map((a, i) => (
                  <ActivityItem key={i} {...a} index={i} />
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-sm py-4 text-center">
                No activity yet.
              </p>
            )}
          </div>

          <div
            className="dash-panel rounded-3xl border p-5 sm:p-6 theme-transition"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <h2 className="font-display font-bold text-text-primary mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-col gap-2">
              <QuickAction
                to="/admin/products"
                label="Add Product"
                icon="👔"
                primary
                index={0}
              />
              <QuickAction
                to="/admin/gallery"
                label="Upload Media"
                icon="🖼️"
                index={1}
              />
              <QuickAction
                to="/admin/testimonials"
                label="Add Testimonial"
                icon="💬"
                index={2}
              />
              <QuickAction
                to="/"
                label="View Store"
                icon="🌐"
                external
                index={3}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        @keyframes wave {
          0%, 60%, 100% { transform: rotate(0deg); }
          10%, 30% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          40% { transform: rotate(10deg); }
          50% { transform: rotate(-4deg); }
        }
        .wave-emoji { animation: wave 2.2s ease-in-out infinite; transform-origin: 70% 70%; }

        @keyframes ripple-ping {
          0% { transform: scale(1); opacity: 0.6; }
          75%, 100% { transform: scale(2.8); opacity: 0; }
        }
        .ripple-ping { animation: ripple-ping 1.8s cubic-bezier(0,0,0.2,1) infinite; }

        .icon-float { animation: icon-float 3.5s ease-in-out infinite; }
        @keyframes icon-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .trend-arrow-up { display: inline-block; animation: bounce-up 1.6s ease-in-out infinite; }
        .trend-arrow-down { display: inline-block; animation: bounce-down 1.6s ease-in-out infinite; }
        @keyframes bounce-up { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
        @keyframes bounce-down { 0%,100%{transform:translateY(0)} 50%{transform:translateY(2px)} }

        .donut-legend {
          opacity: 0;
          animation: legend-in 0.4s ease-out forwards;
        }
        @keyframes legend-in {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
