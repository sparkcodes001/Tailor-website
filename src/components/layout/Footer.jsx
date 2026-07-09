import { Link } from "react-router-dom";
import { createGeneralLink } from "../../utils/whatsapp";

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

  return (
    <footer className="bg-[#15171a] border-t border-[#b8f7e4]/10">
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* BRAND */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#b8f7e4] rounded-lg flex items-center justify-center">
                <span className="text-[#25272c] font-bold text-lg">T</span>
              </div>
              <span className="text-white font-display font-semibold text-xl">
                Tailor<span className="text-[#b8f7e4]">Pro</span>
              </span>
            </Link>

            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              Premium custom tailoring for everyone, everywhere. We craft your
              perfect outfit and ship it straight to your door — anywhere in the
              world.
            </p>

            {/* WhatsApp CTA */}
            <a
              href={createGeneralLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#b8f7e4]/10 
                         border border-[#b8f7e4]/20 text-[#b8f7e4] 
                         px-4 py-2.5 rounded-lg text-sm font-medium 
                         hover:bg-[#b8f7e4]/20 transition-all duration-300"
            >
              <span>💬</span>
              <span>Chat With Us on WhatsApp</span>
            </a>
          </div>

          {/* LINKS */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4
                className="text-white font-semibold mb-4 text-sm uppercase 
                             tracking-wider"
              >
                {title}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-white/50 text-sm hover:text-[#b8f7e4] 
                                 transition-colors duration-300"
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

      {/* BOTTOM BAR */}
      <div className="border-t border-[#b8f7e4]/10">
        <div
          className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row 
                        items-center justify-between gap-4"
        >
          <p className="text-white/30 text-sm">
            © {year} TailorPro. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/admin"
              className="text-white/20 text-xs hover:text-white/40 
                         transition-colors duration-300"
            >
              Admin
            </Link>
            <span className="text-white/30 text-sm">
              Made with ❤️ for quality fashion
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
