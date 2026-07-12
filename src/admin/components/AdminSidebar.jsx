import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const AdminSidebar = ({
  links,
  isOpen,
  onClose,
  collapsed,
  onToggleCollapsed,
  user,
  onSignOut,
  signingOut,
}) => {
  const location = useLocation();
  const itemRefs = useRef([]);
  const navRef = useRef(null);
  const [indicator, setIndicator] = useState({ top: 0, height: 0, opacity: 0 });

  useEffect(() => {
    const activeIndex = links.findIndex((l) =>
      l.end ? location.pathname === l.to : location.pathname.startsWith(l.to),
    );
    const el = itemRefs.current[activeIndex];
    if (el && navRef.current) {
      setIndicator({ top: el.offsetTop, height: el.offsetHeight, opacity: 1 });
    } else {
      setIndicator((s) => ({ ...s, opacity: 0 }));
    }
  }, [location.pathname, links, collapsed]);

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col
                  border-r theme-transition transition-all duration-300 ease-in-out
                  ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      style={{
        width: collapsed ? "84px" : "264px",
        background: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-6 border-b flex items-center justify-between gap-2"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{
              background: "color-mix(in srgb, var(--accent) 15%, transparent)",
            }}
          >
            ✂️
          </div>
          {!collapsed && (
            <div className="min-w-0 animate-fade-in">
              <p className="font-display font-bold text-sm text-text-primary truncate">
                Grandeur
              </p>
              <p className="text-xs text-text-muted truncate">Admin Panel</p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center
                     text-text-muted hover:text-text-primary hover:bg-bg-tertiary
                     transition-colors flex-shrink-0"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      {/* Nav */}
      <nav
        ref={navRef}
        className="relative flex-1 px-3 py-4 space-y-1 overflow-y-auto"
      >
        {/* Sliding active pill */}
        <div
          className="absolute left-3 right-3 rounded-2xl bg-accent transition-all duration-300 ease-out pointer-events-none"
          style={{
            top: indicator.top,
            height: indicator.height,
            opacity: indicator.opacity,
          }}
        />

        {links.map(({ to, label, icon, end }, i) => (
          <div
            key={to}
            ref={(el) => (itemRefs.current[i] = el)}
            className="relative group"
          >
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative z-10 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm
                 font-semibold transition-colors duration-200 ${collapsed ? "justify-center" : ""} ${
                   isActive
                     ? "text-bg-primary"
                     : "text-text-secondary hover:text-text-primary"
                 }`
              }
            >
              <span aria-hidden="true" className="text-base">
                {icon}
              </span>
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>

            {collapsed && (
              <span
                className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3
                           whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-lg"
                style={{
                  background: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                }}
              >
                {label}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Collapse toggle - desktop only */}
      <button
        onClick={onToggleCollapsed}
        className="hidden md:flex mx-3 mb-2 items-center justify-center gap-2 px-3 py-2.5
                   rounded-2xl text-xs font-semibold text-text-muted
                   hover:text-text-primary hover:bg-bg-tertiary transition-all duration-200"
      >
        <span
          className="inline-block transition-transform duration-300"
          style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ⏴
        </span>
        {!collapsed && "Collapse"}
      </button>

      {/* User + Sign out */}
      <div
        className="px-4 py-4 border-t space-y-2"
        style={{ borderColor: "var(--border)" }}
      >
        {!collapsed && (
          <p className="text-xs text-text-muted truncate px-2">{user?.email}</p>
        )}
        <button
          onClick={onSignOut}
          disabled={signingOut}
          title="Sign Out"
          className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl
                     text-sm font-semibold text-red-400 hover:bg-red-400/10
                     transition-all duration-200 disabled:opacity-50 ${collapsed ? "justify-center" : ""}`}
        >
          <span aria-hidden="true">→</span>
          {!collapsed && (signingOut ? "Signing out..." : "Sign Out")}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
