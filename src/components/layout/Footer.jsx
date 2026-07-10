import { Link } from "react-router-dom";
import { createGeneralLink } from "../../utils/whatsapp";
import { useTheme } from "../../context/ThemeContext";

const footerLinks = {
  Pages: [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Gallery", path: "/gallery" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ],
  Services: [
    { name: "Custom Clothing", path: "/custom-order" },
    { name: "Ready Made", path: "/shop" },
    { name: "Alterations", path: "/services" },
    { name: "Worldwide Shipping", path: "/services" },
  ],
};

const Footer = () => {
  const year = new Date().getFullYear();
  const { isDark } = useTheme();

  // ── THEME TOKENS ──────────────────────────────────────────
  const accent = isDark ? "#b8f7e4" : "#6b1d2e";
  const footerBg = isDark ? "#15171a" : "#fdf5f6";
  const borderColor = isDark
    ? "rgba(184,247,228,0.10)"
    : "rgba(107,29,46,0.12)";

  const textPrimary = isDark ? "#ffffff" : "#1a0a0e";
  const textSub = isDark ? "rgba(255,255,255,0.50)" : "rgba(26,10,14,0.55)";
  const textFaint = isDark ? "rgba(255,255,255,0.30)" : "rgba(26,10,14,0.35)";
  const textFainter = isDark ? "rgba(255,255,255,0.20)" : "rgba(26,10,14,0.25)";

  const logoBg = accent;
  const logoText = isDark ? "#25272c" : "#fffdf7";

  const waBg = isDark ? "rgba(184,247,228,0.10)" : "rgba(107,29,46,0.08)";
  const waBorder = isDark ? "rgba(184,247,228,0.20)" : "rgba(107,29,46,0.20)";
  const waBgHover = isDark ? "rgba(184,247,228,0.20)" : "rgba(107,29,46,0.15)";

  return (
    <footer
      style={{
        background: footerBg,
        borderTop: `1px solid ${borderColor}`,
        transition: "background 0.5s ease, border-color 0.5s ease",
      }}
    >
      {/* ── TOP SECTION ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* BRAND */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: logoBg,
                  transition: "background 0.5s ease",
                }}
              >
                <span
                  className="font-bold text-lg"
                  style={{ color: logoText, transition: "color 0.5s ease" }}
                >
                  T
                </span>
              </div>
              <span
                className="font-display font-semibold text-xl"
                style={{ color: textPrimary, transition: "color 0.5s ease" }}
              >
                Tailor
                <span style={{ color: accent, transition: "color 0.5s ease" }}>
                  Pro
                </span>
              </span>
            </Link>

            <p
              className="text-sm leading-relaxed max-w-xs mb-6"
              style={{ color: textSub, transition: "color 0.5s ease" }}
            >
              Premium custom tailoring for everyone, everywhere. We craft your
              perfect outfit and ship it straight to your door — anywhere in the
              world.
            </p>

            {/* WhatsApp CTA */}
            <a
              href={createGeneralLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5
                         rounded-lg text-sm font-medium
                         transition-all duration-300"
              style={{
                background: waBg,
                border: `1px solid ${waBorder}`,
                color: accent,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = waBgHover)
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = waBg)}
            >
              <span>💬</span>
              <span>Chat With Us on WhatsApp</span>
            </a>
          </div>

          {/* LINKS */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4
                className="font-semibold mb-4 text-sm uppercase tracking-wider"
                style={{ color: textPrimary, transition: "color 0.5s ease" }}
              >
                {title}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm transition-colors duration-300"
                      style={{ color: textSub }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = accent)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = textSub)
                      }
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM BAR ─────────────────────────────────────── */}
      <div
        style={{
          borderTop: `1px solid ${borderColor}`,
          transition: "border-color 0.5s ease",
        }}
      >
        <div
          className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row
                     items-center justify-between gap-4"
        >
          <p
            className="text-sm"
            style={{ color: textFaint, transition: "color 0.5s ease" }}
          >
            © {year} TailorPro. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/admin"
              className="text-xs transition-colors duration-300"
              style={{ color: textFainter }}
              onMouseEnter={(e) => (e.currentTarget.style.color = textFaint)}
              onMouseLeave={(e) => (e.currentTarget.style.color = textFainter)}
            >
              Admin
            </Link>
            <span
              className="text-sm"
              style={{ color: textFaint, transition: "color 0.5s ease" }}
            >
              Made with ❤️ for quality fashion
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
