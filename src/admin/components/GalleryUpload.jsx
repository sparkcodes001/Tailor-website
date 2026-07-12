import { useState, useRef } from "react";
import { supabase } from "../../utils/supabase";
import toast from "react-hot-toast";

const ACCEPTED =
  "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime";
const MAX_IMAGE_MB = 5;
const MAX_VIDEO_MB = 100;

const isVideoFile = (file) => file.type.startsWith("video/");
const formatBytes = (b) =>
  b < 1024 * 1024
    ? `${(b / 1024).toFixed(0)} KB`
    : `${(b / (1024 * 1024)).toFixed(1)} MB`;

const GalleryUpload = ({ onSuccess }) => {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const addFiles = (incoming) => {
    const valid = Array.from(incoming).filter((f) => {
      const maxMB = isVideoFile(f) ? MAX_VIDEO_MB : MAX_IMAGE_MB;
      if (f.size > maxMB * 1024 * 1024) {
        toast.error(`"${f.name}" exceeds ${maxMB}MB limit.`);
        return false;
      }
      return true;
    });
    setFiles((prev) => {
      const seen = new Set(prev.map((f) => f.name + f.size));
      return [...prev, ...valid.filter((f) => !seen.has(f.name + f.size))];
    });
  };

  const removeFile = (i) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleUpload = async () => {
    if (!files.length) return toast.error("Select at least one file.");
    setUploading(true);
    setProgress(0);

    let done = 0;
    const errors = [];

    for (const file of files) {
      const isVid = isVideoFile(file);
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const bucket = isVid ? "gallery-videos" : "gallery";

      const { error: storageError } = await supabase.storage
        .from(bucket)
        .upload(path, file);

      if (storageError) {
        errors.push(file.name);
        done++;
        setProgress(Math.round((done / files.length) * 100));
        continue;
      }

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      const row = isVid
        ? {
            media_type: "video",
            media_url: urlData.publicUrl,
            image_url: null,
            category: category.trim() || null,
            caption: caption.trim() || null,
          }
        : {
            media_type: "image",
            image_url: urlData.publicUrl,
            category: category.trim() || null,
            caption: caption.trim() || null,
          };

      await supabase.from("gallery").insert(row);
      done++;
      setProgress(Math.round((done / files.length) * 100));
    }

    setUploading(false);
    setProgress(0);

    if (errors.length) toast.error(`${errors.length} file(s) failed.`);
    if (errors.length < files.length) {
      toast.success(`${files.length - errors.length} file(s) uploaded!`);
      onSuccess?.();
    }

    setFiles([]);
    setCategory("");
    setCaption("");
  };

  return (
    <div className="space-y-5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300"
        style={{
          borderColor: dragOver ? "var(--accent)" : "var(--border)",
          background: dragOver
            ? "color-mix(in srgb, var(--accent) 5%, transparent)"
            : "var(--bg-primary)",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <div className="text-3xl mb-3">{dragOver ? "⬇️" : "📁"}</div>
        <p className="text-sm font-semibold text-text-primary mb-1">
          Drop images or videos here
        </p>
        <p className="text-xs text-text-muted">
          JPG, PNG, WEBP, GIF up to {MAX_IMAGE_MB}MB · MP4, WEBM, MOV up to{" "}
          {MAX_VIDEO_MB}MB
        </p>
        <button
          type="button"
          className="mt-4 px-4 py-2 rounded-xl text-xs font-bold border hover:border-accent transition-all duration-200"
          style={{
            background: "var(--bg-card)",
            color: "var(--text-secondary)",
            borderColor: "var(--border)",
          }}
        >
          Browse files
        </button>
      </div>

      {files.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-2xl border"
              style={{
                background: "var(--bg-tertiary)",
                borderColor: "var(--border)",
              }}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-bg-primary flex items-center justify-center">
                {isVideoFile(f) ? (
                  <span className="text-lg">🎬</span>
                ) : (
                  <img
                    src={URL.createObjectURL(f)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">
                  {f.name}
                </p>
                <p className="text-[10px] text-text-muted">
                  {isVideoFile(f) ? "Video" : "Image"} · {formatBytes(f.size)}
                </p>
              </div>
              <button
                onClick={() => removeFile(i)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Agbada, Suits…"
            className="w-full px-4 py-3 rounded-2xl text-sm border outline-none bg-bg-primary text-text-primary placeholder:text-text-muted focus:border-accent transition-colors duration-300"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Caption <span className="normal-case font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Short description…"
            className="w-full px-4 py-3 rounded-2xl text-sm border outline-none bg-bg-primary text-text-primary placeholder:text-text-muted focus:border-accent transition-colors duration-300"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ background: "var(--bg-tertiary)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: "var(--accent)" }}
            />
          </div>
          <p className="text-xs text-text-muted text-center">
            Uploading… {progress}%
          </p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || !files.length}
        className="w-full py-3.5 rounded-2xl font-bold text-sm bg-accent text-bg-primary hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
      >
        {uploading
          ? `Uploading ${progress}%…`
          : `Upload ${files.length ? `${files.length} file${files.length !== 1 ? "s" : ""}` : "Media"}`}
      </button>
    </div>
  );
};

export default GalleryUpload;
