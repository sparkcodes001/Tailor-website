// src/components/layout/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../ui/ThemeToggle";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Gallery", path: "/gallery" },
  { name: "Shop", path: "/shop" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredPath, setHoveredPath] = useState(null);

  const location = useLocation();
  const { isDark } = useTheme();

  const navRef = useRef(null);
  const pillRef = useRef(null);
  const linkContainerRef = useRef(null);
  const linkRefs = useRef({});
  const logoRef = useRef(null);
  const menuOverlayRef = useRef(null);

  const accent = isDark ? "#b8f7e4" : "#6b1d2e";
  const btnText = isDark ? "#25272c" : "#fffdf7";

  // ── SCROLL STATE + PROGRESS BAR ───────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);

      const height = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(height > 0 ? (y / height) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── CLOSE MOBILE MENU ON ROUTE CHANGE ─────────────────────
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // ── ENTRANCE ANIMATION ────────────────────────────────────
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 },
    );
  }, []);

  // ── MAGNETIC SLIDING PILL ──────────────────────────────────
  const movePill = (path) => {
    const el = linkRefs.current[path];
    const container = linkContainerRef.current;
    if (!el || !container || !pillRef.current) return;

    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    gsap.to(pillRef.current, {
      x: elRect.left - containerRect.left,
      width: elRect.width,
      opacity: 1,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  const hidePill = () => {
    gsap.to(pillRef.current, { opacity: 0, duration: 0.3 });
  };

  useEffect(() => {
    // Position pill on active route (after layout is ready)
    requestAnimationFrame(() => {
      if (navLinks.some((l) => l.path === location.pathname)) {
        movePill(location.pathname);
      } else {
        hidePill();
      }
    });
  }, [location.pathname]);

  const handleLinkHover = (path) => {
    setHoveredPath(path);
    movePill(path);
  };

  const handleLinkLeave = () => {
    setHoveredPath(null);
    if (navLinks.some((l) => l.path === location.pathname)) {
      movePill(location.pathname);
    } else {
      hidePill();
    }
  };

  // ── MOBILE MENU ANIMATION ─────────────────────────────────
  useEffect(() => {
    if (menuOpen) {
      gsap.set(menuOverlayRef.current, { display: "flex" });
      gsap.fromTo(
        menuOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" },
      );
      gsap.fromTo(
        ".mobile-link",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.07,
          ease: "power3.out",
          delay: 0.15,
        },
      );
      gsap.fromTo(
        ".mobile-menu-footer",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: "power2.out" },
      );
    } else {
      gsap.to(menuOverlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          if (menuOverlayRef.current) {
            gsap.set(menuOverlayRef.current, { display: "none" });
          }
        },
      });
    }
  }, [menuOpen]);

  return (
    <>
      {/* ── SCROLL PROGRESS BAR ─────────────────────────────── */}
      <div
        className="fixed top-0 left-0 h-[2px] z-[60] pointer-events-none"
        style={{
          width: `${scrollProgress}%`,
          background: `linear-gradient(90deg, ${accent}, transparent)`,
          transition: "width 0.1s ease",
        }}
      />

      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <div
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center
                   px-4 transition-all duration-500"
        style={{ paddingTop: scrolled ? "14px" : "20px" }}
      >
        <nav
          className="w-full flex items-center justify-between transition-all duration-500"
          style={{
            maxWidth: scrolled ? "1100px" : "1280px",
            background: scrolled ? "var(--nav-bg)" : "transparent",
            backdropFilter: scrolled ? "blur(16px)" : "none",
            border: scrolled
              ? "1px solid var(--border)"
              : "1px solid transparent",
            borderRadius: scrolled ? "999px" : "0px",
            padding: scrolled ? "10px 24px" : "12px 6px",
            boxShadow: scrolled
              ? isDark
                ? "0 8px 32px rgba(0,0,0,0.35)"
                : "0 8px 32px rgba(107,29,46,0.08)"
              : "none",
          }}
        >
          {/* LOGO */}
          <Link
            ref={logoRef}
            to="/"
            className="flex items-center gap-2 group flex-shrink-0"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center
                         group-hover:rotate-[10deg] transition-transform duration-300"
              style={{ background: "var(--accent)" }}
            >
              <span className="font-bold text-lg" style={{ color: btnText }}>
                T
              </span>
            </div>
            <span
              className="font-display font-semibold text-xl tracking-wide hidden sm:inline"
              style={{ color: "var(--text-primary)" }}
            >
              Tunex
              <span style={{ color: "var(--accent)" }}> Fash</span>
            </span>
          </Link>

          {/* DESKTOP LINKS + MAGNETIC PILL */}
          <div
            ref={linkContainerRef}
            className="hidden md:flex items-center gap-1 relative mx-6"
            onMouseLeave={handleLinkLeave}
          >
            {/* sliding pill */}
            <div
              ref={pillRef}
              className="absolute top-0 h-full rounded-full pointer-events-none"
              style={{
                background: "var(--accent-glow)",
                border: "1px solid var(--border-hover)",
                opacity: 0,
              }}
            />

            {navLinks.map((link) => (
              <Link
                key={link.name}
                ref={(el) => (linkRefs.current[link.path] = el)}
                to={link.path}
                onMouseEnter={() => handleLinkHover(link.path)}
                className="relative z-10 text-sm font-medium px-4 py-2 rounded-full
                           transition-colors duration-300 whitespace-nowrap"
                style={{
                  color:
                    location.pathname === link.path
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <ThemeToggle />
            <Link
              to="/custom-order"
              className="group relative overflow-hidden px-5 py-2.5 rounded-full
                         font-semibold text-sm transition-all duration-300
                         hover:scale-105 active:scale-95"
              style={{ background: "var(--accent)", color: btnText }}
            >
              <span className="relative z-10">Custom Order</span>
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100
                           transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.4) 50%,transparent 60%)",
                }}
              />
            </Link>
          </div>

          {/* MOBILE TOGGLE + HAMBURGER */}
          <div className="md:hidden flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative w-9 h-9 flex flex-col items-center justify-center gap-[5px]"
              aria-label="Toggle menu"
            >
              <span
                className="block h-[2px] rounded-full transition-all duration-300"
                style={{
                  width: "20px",
                  background: "var(--text-primary)",
                  transform: menuOpen
                    ? "rotate(45deg) translateY(7px)"
                    : "none",
                }}
              />
              <span
                className="block h-[2px] rounded-full transition-all duration-300"
                style={{
                  width: "20px",
                  background: "var(--text-primary)",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                className="block h-[2px] rounded-full transition-all duration-300"
                style={{
                  width: "20px",
                  background: "var(--text-primary)",
                  transform: menuOpen
                    ? "rotate(-45deg) translateY(-7px)"
                    : "none",
                }}
              />
            </button>
          </div>
        </nav>
      </div>

      {/* ── CINEMATIC MOBILE MENU ──────────────────────────── */}
      <div
        ref={menuOverlayRef}
        className="fixed inset-0 z-[55] hidden flex-col md:hidden"
        style={{
          background: "var(--bg-primary)",
        }}
      >
        {/* decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(var(--accent) 1px, transparent 1px),
                               linear-gradient(90deg, var(--accent) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* ambient glow */}
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[100px] opacity-20 pointer-events-none"
          style={{ background: "var(--accent)" }}
        />

        {/* header */}
        <div className="relative flex items-center justify-between px-6 pt-6 pb-4">
          <span
            className="font-display font-semibold text-lg"
            style={{ color: "var(--text-primary)" }}
          >
            Tunex<span style={{ color: "var(--accent)" }}> Fash</span>
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
            style={{
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          >
            ✕
          </button>
        </div>

        {/* links */}
        <div className="relative flex-1 flex flex-col justify-center px-8 gap-1">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              to={link.path}
              className="mobile-link group flex items-baseline gap-4 py-3 border-b"
              style={{
                borderColor: "var(--border)",
              }}
            >
              <span
                className="text-xs font-mono"
                style={{ color: "var(--text-muted)" }}
              >
                0{i + 1}
              </span>
              <span
                className="font-display text-3xl font-bold transition-colors duration-300"
                style={{
                  color:
                    location.pathname === link.path
                      ? "var(--accent)"
                      : "var(--text-primary)",
                }}
              >
                {link.name}
              </span>
              <span
                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ color: "var(--accent)" }}
              >
                →
              </span>
            </Link>
          ))}
        </div>

        {/* footer */}
        <div className="mobile-menu-footer relative px-8 pb-10 pt-4">
          <Link
            to="/custom-order"
            className="block w-full py-4 rounded-2xl font-semibold text-center
                       transition-all duration-300 active:scale-95 mb-4"
            style={{ background: "var(--accent)", color: btnText }}
          >
            Start Custom Order ✂️
          </Link>
          <p
            className="text-center text-xs tracking-widest uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            Premium · Worldwide · Handcrafted
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
