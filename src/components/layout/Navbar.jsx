import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

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
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#15171a]/95 backdrop-blur-md border-b border-[#b8f7e4]/10 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div
              className="w-9 h-9 bg-[#b8f7e4] rounded-lg flex items-center 
                            justify-center group-hover:scale-110 transition-transform duration-300"
            >
              <span className="text-[#25272c] font-bold text-lg">T</span>
            </div>
            <span className="text-white font-display font-semibold text-xl tracking-wide">
              Tailor<span className="text-[#b8f7e4]">Pro</span>
            </span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-all duration-300 relative group ${
                  location.pathname === link.path
                    ? "text-[#b8f7e4]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.name}
                {/* underline effect */}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-[#b8f7e4] 
                               transition-all duration-300 rounded-full ${
                                 location.pathname === link.path
                                   ? "w-full"
                                   : "w-0 group-hover:w-full"
                               }`}
                />
              </Link>
            ))}
          </div>

          {/* DESKTOP CTA BUTTON */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/custom-order"
              className="bg-[#b8f7e4] text-[#25272c] px-5 py-2.5 rounded-lg 
                         font-semibold text-sm hover:bg-[#7ee8c8] transition-all 
                         duration-300 hover:scale-105 hover:shadow-lg 
                         hover:shadow-[#b8f7e4]/20"
            >
              Custom Order
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 group"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 bg-white rounded-full transition-all 
                           duration-300 ${
                             menuOpen ? "w-6 rotate-45 translate-y-2" : "w-6"
                           }`}
            />
            <span
              className={`block h-0.5 bg-white rounded-full transition-all 
                           duration-300 ${menuOpen ? "opacity-0 w-0" : "w-4"}`}
            />
            <span
              className={`block h-0.5 bg-white rounded-full transition-all 
                           duration-300 ${
                             menuOpen ? "w-6 -rotate-45 -translate-y-2" : "w-6"
                           }`}
            />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#15171a]/95 backdrop-blur-md"
          onClick={() => setMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-[#15171a] 
                       border-l border-[#b8f7e4]/10 p-8 flex flex-col
                       transition-all duration-500 ${
                         menuOpen ? "translate-x-0" : "translate-x-full"
                       }`}
        >
          {/* Close + Logo */}
          <div className="flex items-center justify-between mb-12">
            <span className="text-white font-display font-semibold text-lg">
              Tailor<span className="text-[#b8f7e4]">Pro</span>
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white/50 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                style={{ transitionDelay: `${index * 50}ms` }}
                className={`text-lg font-medium py-3 px-4 rounded-lg 
                             transition-all duration-300 ${
                               location.pathname === link.path
                                 ? "bg-[#b8f7e4]/10 text-[#b8f7e4]"
                                 : "text-white/70 hover:text-white hover:bg-white/5"
                             }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-auto">
            <Link
              to="/custom-order"
              className="block w-full bg-[#b8f7e4] text-[#25272c] px-5 py-3 
                         rounded-lg font-semibold text-center hover:bg-[#7ee8c8] 
                         transition-all duration-300"
            >
              Custom Order ✂️
            </Link>

            {/* Social / WhatsApp */}
            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 mt-4 
                         text-white/50 hover:text-[#b8f7e4] transition-colors 
                         text-sm"
            >
              <span>💬</span>
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
