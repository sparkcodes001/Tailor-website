import { useState } from "react";
import { supabase } from "../../utils/supabase";
import toast from "react-hot-toast";

const GALLERY_CATEGORIES = [
  "Suits",
  "Shirts",
  "Traditional Wear",
  "Outerwear",
  "Behind the Scenes",
  "Fittings",
];

const GalleryUpload = ({ onSuccess }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [category, setCategory] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files).slice(0, 8);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const removePreview = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (files.length === 0) return toast.error("Select at least one image.");

    setLoading(true);
    const toastId = toast.loading(`Uploading ${files.length} image(s)...`);

    try {
      const rows = await Promise.all(
        files.map(async (file) => {
          const ext = file.name.split(".").pop();
          const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

          const { error: uploadError } = await supabase.storage
            .from("gallery-images")
            .upload(path, file);

          if (uploadError) throw new Error(uploadError.message);

          const { data } = supabase.storage
            .from("gallery-images")
            .getPublicUrl(path);

          return {
            image_url: data.publicUrl,
            category: category || null,
            caption: caption || null,
          };
        }),
      );

      const { error: insertError } = await supabase
        .from("gallery")
        .insert(rows);
      if (insertError) throw new Error(insertError.message);

      toast.success("Images uploaded!", { id: toastId });
      setFiles([]);
      setPreviews([]);
      setCategory("");
      setCaption("");
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || "Upload failed.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-6">
      {/* Previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {previews.map((src, i) => (
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
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500
                           text-white text-xs flex items-center justify-center
                           leading-none hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Uploader */}
      <label
        className="flex flex-col items-center justify-center w-full h-32
                   rounded-2xl border-2 border-dashed cursor-pointer
                   hover:border-accent transition-colors duration-300"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="text-2xl mb-1" aria-hidden="true">
          🖼️
        </span>
        <span className="text-xs text-text-muted">
          Click to select up to 8 images
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
      </label>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Category (optional)
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl text-sm border outline-none
                     bg-bg-primary text-text-primary focus:border-accent
                     transition-colors duration-300"
          style={{ borderColor: "var(--border)" }}
        >
          <option value="">No category</option>
          {GALLERY_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Caption */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Caption (optional)
        </label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Applies to all images in this batch"
          className="w-full px-4 py-3 rounded-2xl text-sm border outline-none
                     bg-bg-primary text-text-primary placeholder:text-text-muted
                     focus:border-accent transition-colors duration-300"
          style={{ borderColor: "var(--border)" }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-2xl font-bold text-sm bg-accent
                   text-bg-primary hover:opacity-90 transition-all duration-300
                   hover:scale-[1.02] active:scale-95 disabled:opacity-50
                   disabled:cursor-not-allowed disabled:scale-100"
      >
        {loading
          ? "Uploading..."
          : `Upload ${files.length || ""} Image${files.length !== 1 ? "s" : ""}`}
      </button>
    </form>
  );
};

export default GalleryUpload;
