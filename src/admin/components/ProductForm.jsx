import { useState } from "react";
import { supabase } from "../../utils/supabase";
import { PRODUCT_CATEGORIES } from "../../data/categories";
import toast from "react-hot-toast";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Custom"];

const ProductForm = ({ product = null, onSuccess }) => {
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "",
    sizes: product?.sizes || [],
    available: product?.available ?? true,
    featured: product?.featured ?? false,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(product?.images || []);
  const [loading, setLoading] = useState(false);

  const handleField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setImageFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removePreview = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return imagePreviews;

    const urls = await Promise.all(
      imageFiles.map(async (file) => {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage
          .from("product-images")
          .upload(path, file, { upsert: true });

        if (error) throw new Error(error.message);

        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);
        return data.publicUrl;
      }),
    );

    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error("Product name is required.");
    if (!form.category) return toast.error("Please select a category.");

    setLoading(true);
    const toastId = toast.loading(
      isEdit ? "Updating product..." : "Saving product...",
    );

    try {
      const imageUrls = await uploadImages();

      const payload = {
        ...form,
        images: imageUrls,
      };

      let error;

      if (isEdit) {
        ({ error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", product.id));
      } else {
        ({ error } = await supabase.from("products").insert(payload));
      }

      if (error) throw new Error(error.message);

      toast.success(isEdit ? "Product updated!" : "Product added!", {
        id: toastId,
      });
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || "Something went wrong.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Product Name *
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleField("name", e.target.value)}
          placeholder="e.g. Classic Ankara Suit"
          className="w-full px-4 py-3 rounded-2xl text-sm border outline-none
                     bg-bg-primary text-text-primary placeholder:text-text-muted
                     focus:border-accent transition-colors duration-300"
          style={{ borderColor: "var(--border)" }}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => handleField("description", e.target.value)}
          placeholder="Describe the garment, fabric, and craftsmanship..."
          rows={4}
          className="w-full px-4 py-3 rounded-2xl text-sm border outline-none
                     bg-bg-primary text-text-primary placeholder:text-text-muted
                     focus:border-accent transition-colors duration-300 resize-none"
          style={{ borderColor: "var(--border)" }}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Category *
        </label>
        <select
          value={form.category}
          onChange={(e) => handleField("category", e.target.value)}
          className="w-full px-4 py-3 rounded-2xl text-sm border outline-none
                     bg-bg-primary text-text-primary focus:border-accent
                     transition-colors duration-300"
          style={{ borderColor: "var(--border)" }}
        >
          <option value="">Select a category</option>
          {PRODUCT_CATEGORIES.filter((c) => c.value !== "all").map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sizes */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
          Available Sizes
        </label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const active = form.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className="px-4 py-2 rounded-xl text-xs font-bold border
                           transition-all duration-200"
                style={{
                  background: active ? "var(--accent)" : "transparent",
                  color: active ? "var(--bg-primary)" : "var(--text-secondary)",
                  borderColor: active ? "var(--accent)" : "var(--border)",
                }}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
          Product Images (max 4)
        </label>

        {/* Previews */}
        {imagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-3">
            {imagePreviews.map((src, i) => (
              <div
                key={i}
                className="relative w-20 h-20 rounded-2xl overflow-hidden border"
                style={{ borderColor: "var(--border)" }}
              >
                <img
                  src={src}
                  alt={`preview-${i}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePreview(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full
                             bg-red-500 text-white text-xs flex items-center
                             justify-center leading-none hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <label
          className="flex flex-col items-center justify-center w-full h-32
                     rounded-2xl border-2 border-dashed cursor-pointer
                     hover:border-accent transition-colors duration-300"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="text-2xl mb-1" aria-hidden="true">
            📷
          </span>
          <span className="text-xs text-text-muted">
            Click to upload images
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImages}
            className="hidden"
          />
        </label>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-6">
        {[
          { key: "available", label: "In Stock" },
          { key: "featured", label: "Featured on Homepage" },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => handleField(key, !form[key])}
              className="w-10 h-5 rounded-full relative transition-all duration-300"
              style={{
                background: form[key]
                  ? "var(--accent)"
                  : "color-mix(in srgb, var(--accent) 15%, transparent)",
              }}
            >
              <div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white
                           shadow transition-all duration-300"
                style={{ left: form[key] ? "calc(100% - 18px)" : "2px" }}
              />
            </div>
            <span className="text-sm text-text-secondary">{label}</span>
          </label>
        ))}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-2xl font-bold text-sm bg-accent
                   text-bg-primary hover:opacity-90 transition-all duration-300
                   hover:scale-[1.02] active:scale-95 disabled:opacity-50
                   disabled:cursor-not-allowed disabled:scale-100"
      >
        {loading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;
