import { useEffect, useMemo, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useProducts } from "../hooks/useProducts";
import { PRODUCT_CATEGORIES } from "../data/categories";
import ProductCard from "../components/ui/ProductCard";
import SectionTitle from "../components/ui/SectionTitle";
import Loader from "../components/ui/Loader";

gsap.registerPlugin(ScrollTrigger);

const Shop = () => {
  const { products, loading, error } = useProducts();
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  useEffect(() => {
    if (loading || filteredProducts.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".product-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        },
      );
    });

    return () => ctx.revert();
  }, [loading, activeCategory]);

  return (
    <section className="min-h-screen px-6 py-28 bg-bg-primary theme-transition">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="The Collection"
          title="Our"
          highlight="Collection"
          subtitle="Premium ready-to-ship pieces, crafted with the same care as our custom work."
        />

        <div className="flex flex-wrap justify-center gap-3 mt-10 mb-14">
          {PRODUCT_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border"
                style={{
                  background: isActive ? "var(--accent)" : "transparent",
                  color: isActive
                    ? "var(--bg-primary)"
                    : "var(--text-secondary)",
                  borderColor: isActive ? "var(--accent)" : "var(--border)",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <Loader />
          </div>
        )}

        {!loading && error && (
          <p className="text-center text-red-400 py-24">
            Couldn't load products right now. Please try again shortly.
          </p>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <p className="text-center text-text-muted py-24">
            No products found in this category yet.
          </p>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div
            key={activeCategory}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="product-card">
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Shop;
