import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import ProductForm from "../components/ProductForm";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) toast.error("Failed to load products.");
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error("Delete failed.");
    toast.success("Product deleted.");
    fetchProducts();
  };

  const openAdd = () => {
    setEditProduct(null);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    fetchProducts();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
            Products
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""} in store
          </p>
        </div>
        <button
          onClick={openAdd}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm bg-accent
                     text-bg-primary hover:opacity-90 transition-all duration-300
                     hover:scale-105 active:scale-95 flex-shrink-0"
        >
          + Add Product
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="w-full max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-y-auto
                       rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 border"
            style={{
              background: "var(--bg-secondary)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg sm:text-xl font-bold text-text-primary">
                {editProduct ? "Edit Product" : "New Product"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-text-muted hover:text-text-primary transition-colors text-xl
                           w-8 h-8 flex items-center justify-center flex-shrink-0"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <ProductForm product={editProduct} onSuccess={handleSuccess} />
          </div>
        </div>
      )}

      {/* Products list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 sm:h-[88px] rounded-2xl border animate-pulse"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 sm:py-24">
          <p className="text-4xl mb-4">👔</p>
          <p className="text-text-muted">
            No products yet. Add your first one.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border theme-transition"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              {/* Top row on mobile: thumbnail + info */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-bg-tertiary">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">
                      👔
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-primary truncate">
                    {product.name}
                  </p>
                  <div className="flex items-center flex-wrap gap-2 mt-1">
                    <span className="text-xs text-text-muted capitalize">
                      {product.category}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{
                        background: product.available
                          ? "color-mix(in srgb, #4ade80 15%, transparent)"
                          : "color-mix(in srgb, #f87171 15%, transparent)",
                        color: product.available ? "#4ade80" : "#f87171",
                      }}
                    >
                      {product.available ? "In Stock" : "Sold Out"}
                    </span>
                    {product.featured && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={{
                          background:
                            "color-mix(in srgb, var(--accent) 15%, transparent)",
                          color: "var(--accent)",
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions — full width row on mobile, inline on sm+ */}
              <div className="flex items-center gap-2 flex-shrink-0 sm:ml-2">
                <button
                  onClick={() => openEdit(product)}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold border
                             text-text-primary hover:border-accent transition-all duration-200"
                  style={{ borderColor: "var(--border)" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold
                             text-red-400 hover:bg-red-400/10 transition-all duration-200
                             border border-transparent sm:border-none"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
