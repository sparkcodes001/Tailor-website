import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminNavbar from "./components/AdminNavbar";

export const NAV_LINKS = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/products", label: "Products", icon: "👔" },
  { to: "/admin/gallery", label: "Gallery", icon: "🖼️" },
  { to: "/admin/testimonials", label: "Testimonials", icon: "💬" },
];

const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [signingOut, setSigningOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("admin-sidebar-collapsed") === "true",
  );

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      localStorage.setItem("admin-sidebar-collapsed", String(!prev));
      return !prev;
    });
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    navigate("/admin/login");
  };

  const currentPage =
    NAV_LINKS.find((l) =>
      l.end ? location.pathname === l.to : location.pathname.startsWith(l.to),
    )?.label || "Admin";

  return (
    <div className="min-h-screen flex bg-bg-primary theme-transition">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <AdminSidebar
        links={NAV_LINKS}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        user={user}
        onSignOut={handleSignOut}
        signingOut={signingOut}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AdminNavbar
          title={currentPage}
          onMenuClick={() => setMobileOpen(true)}
          user={user}
          onSignOut={handleSignOut}
          signingOut={signingOut}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <style>{`
        @keyframes admin-fade-in { from { opacity: 0 } to { opacity: 1 } }
        .animate-fade-in { animation: admin-fade-in 0.25s ease-out; }
      `}</style>
    </div>
  );
};

export default AdminLayout;
