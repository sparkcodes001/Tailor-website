import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const AdminNavbar = ({ title, onMenuClick, user, onSignOut, signingOut }) => {
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = (user?.email || "A").split("@")[0].slice(0, 2).toUpperCase();

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center justify-between gap-4 px-4 md:px-8
                 border-b backdrop-blur-md theme-transition"
      style={{
        background: "color-mix(in srgb, var(--bg-secondary) 85%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center
                     text-text-primary hover:bg-bg-tertiary transition-colors flex-shrink-0"
          aria-label="Open menu"
        >
          <span className="block w-5 space-y-1">
            <span className="block h-0.5 w-full bg-current rounded" />
            <span className="block h-0.5 w-3/4 bg-current rounded" />
            <span className="block h-0.5 w-full bg-current rounded" />
          </span>
        </button>

        <div className="min-w-0">
          <p className="text-xs text-text-muted hidden sm:block">Admin /</p>
          <h1 className="font-display font-bold text-text-primary text-lg truncate">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <button
          onClick={() => toggleTheme?.()}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-base
                     text-text-secondary hover:text-text-primary hover:bg-bg-tertiary
                     transition-all duration-300"
          aria-label="Toggle theme"
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl
                       hover:bg-bg-tertiary transition-colors duration-200"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background:
                  "color-mix(in srgb, var(--accent) 20%, transparent)",
                color: "var(--accent)",
              }}
            >
              {initials}
            </div>
            <span
              className="hidden md:inline-block text-xs transition-transform duration-200"
              style={{
                transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▾
            </span>
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl border p-2 shadow-xl animate-slide-up z-50"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <p className="text-xs text-text-muted px-3 py-2 truncate">
                {user?.email}
              </p>
              <div
                className="h-px my-1"
                style={{ background: "var(--border)" }}
              />
              <button
                onClick={onSignOut}
                disabled={signingOut}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl
                           text-sm font-semibold text-red-400 hover:bg-red-400/10
                           transition-all duration-200 disabled:opacity-50"
              >
                <span aria-hidden="true">→</span>
                {signingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes admin-slide-up { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: admin-slide-up 0.18s ease-out both; }
      `}</style>
    </header>
  );
};

export default AdminNavbar;
