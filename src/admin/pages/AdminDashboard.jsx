import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../utils/supabase";

const StatCard = ({ label, value, icon, to }) => (
  <Link
    to={to}
    className="rounded-3xl p-6 border flex items-center gap-4
               hover:border-accent transition-all duration-300 group theme-transition"
    style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
  >
    <div
      className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
      style={{
        background: "color-mix(in srgb, var(--accent) 10%, transparent)",
      }}
    >
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold font-display text-text-primary">
        {value ?? "—"}
      </p>
      <p className="text-xs text-text-muted uppercase tracking-wider">
        {label}
      </p>
    </div>
  </Link>
);

const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    products: null,
    gallery: null,
    testimonials: null,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const [p, g, t] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("gallery").select("id", { count: "exact", head: true }),
        supabase
          .from("testimonials")
          .select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        products: p.count,
        gallery: g.count,
        testimonials: t.count,
      });
    };
    fetchCounts();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary">
          Dashboard
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Welcome back. Here's what's in your store.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Products"
          value={counts.products}
          icon="👔"
          to="/admin/products"
        />
        <StatCard
          label="Gallery Images"
          value={counts.gallery}
          icon="🖼️"
          to="/admin/gallery"
        />
        <StatCard
          label="Testimonials"
          value={counts.testimonials}
          icon="💬"
          to="/admin/testimonials"
        />
      </div>

      {/* Quick links */}
      <div className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 rounded-2xl text-sm font-semibold
                       bg-accent text-bg-primary hover:opacity-90 transition-all"
          >
            + Add Product
          </Link>
          <Link
            to="/admin/gallery"
            className="px-5 py-2.5 rounded-2xl text-sm font-semibold border
                       text-text-primary hover:border-accent transition-all"
            style={{ borderColor: "var(--border)" }}
          >
            + Upload Photo
          </Link>
          <Link
            to="/admin/testimonials"
            className="px-5 py-2.5 rounded-2xl text-sm font-semibold border
                       text-text-primary hover:border-accent transition-all"
            style={{ borderColor: "var(--border)" }}
          >
            + Add Testimonial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
