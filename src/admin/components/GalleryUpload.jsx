import { useState, useRef } from "react";
import { supabase } from "../../utils/supabase";
import toast from "react-hot-toast";
import * as tus from "tus-js-client";

const ACCEPTED =
  "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime";
const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 500;
const CHUNK_SIZE = 6 * 1024 * 1024; // 6 MB chunks

const isVideoFile = (file) => file.type.startsWith("video/");
const formatBytes = (b) =>
  b < 1024 * 1024
    ? `${(b / 1024).toFixed(0)} KB`
    : `${(b / (1024 * 1024)).toFixed(1)} MB`;

// ── RESUMABLE VIDEO UPLOAD via TUS ──────────────────────────
const uploadVideoResumable = ({ file, path, onProgress }) => {
  return new Promise(async (resolve, reject) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return reject(new Error("Not authenticated"));

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const uploadUrl = `${supabaseUrl}/storage/v1/upload/resumable`;

    const upload = new tus.Upload(file, {
      endpoint: uploadUrl,
      retryDelays: [0, 1000, 3000, 5000, 10000], // auto-retry on connection drops
      chunkSize: CHUNK_SIZE,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "x-upsert": "false",
      },
      metadata: {
        bucketName: "gallery-videos",
        objectName: path,
        contentType: file.type,
        cacheControl: "3600",
      },
      onProgress(bytesUploaded, bytesTotal) {
        const pct = Math.round((bytesUploaded / bytesTotal) * 100);
        onProgress?.(pct);
      },
      onSuccess() {
        resolve();
      },
      onError(err) {
        reject(err);
      },
    });

    // Resume any previous upload if it was interrupted
    const previousUploads = await upload.findPreviousUploads();
    if (previousUploads.length > 0) {
      upload.resumeFromPreviousUpload(previousUploads[0]);
    }

    upload.start();
  });
};

// ── MAIN COMPONENT ───────────────────────────────────────────
const GalleryUpload = ({ onSuccess }) => {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileProgress, setFileProgress] = useState({}); // per-file progress
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

  const setFileProgressValue = (name, pct) => {
    setFileProgress((prev) => ({ ...prev, [name]: pct }));
  };

  const handleUpload = async () => {
    if (!files.length) return toast.error("Select at least one file.");
    setUploading(true);
    setFileProgress({});

    const errors = [];

    for (const file of files) {
      const isVid = isVideoFile(file);
      const ext = file.name.split(".").pop().toLowerCase();
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      setFileProgressValue(file.name, 0);

      try {
        let publicUrl = "";

        if (isVid) {
          // ── RESUMABLE TUS UPLOAD for videos ──
          await uploadVideoResumable({
            file,
            path: safeName,
            onProgress: (pct) => setFileProgressValue(file.name, pct),
          });

          const { data: urlData } = supabase.storage
            .from("gallery-videos")
            .getPublicUrl(safeName);
          publicUrl = urlData?.publicUrl;
        } else {
          // ── STANDARD UPLOAD for images ──
          const { error: storageError } = await supabase.storage
            .from("gallery-images")
            .upload(safeName, file, {
              cacheControl: "3600",
              upsert: false,
              contentType: file.type,
            });

          if (storageError) throw new Error(`Storage: ${storageError.message}`);

          const { data: urlData } = supabase.storage
            .from("gallery-images")
            .getPublicUrl(safeName);
          publicUrl = urlData?.publicUrl;
          setFileProgressValue(file.name, 100);
        }

        if (!publicUrl) throw new Error("Could not get public URL");

        // ── DB INSERT ──
        const row = isVid
          ? {
              media_type: "video",
              media_url: publicUrl,
              image_url: publicUrl,
              category: category.trim() || null,
              caption: caption.trim() || null,
            }
          : {
              media_type: "image",
              image_url: publicUrl,
              category: category.trim() || null,
              caption: caption.trim() || null,
            };

        const { error: insertError } = await supabase
          .from("gallery")
          .insert(row);

        if (insertError) {
          // Clean up orphaned storage file
          const bucket = isVid ? "gallery-videos" : "gallery-images";
          await supabase.storage.from(bucket).remove([safeName]);
          throw new Error(`DB: ${insertError.message}`);
        }
      } catch (err) {
        console.error(`Failed for "${file.name}":`, err.message);
        errors.push(`${file.name}: ${err.message}`);
        setFileProgressValue(file.name, -1); // -1 = error state
      }
    }

    setUploading(false);

    if (errors.length) {
      toast.error(
        errors.length === files.length
          ? "All uploads failed. Check console."
          : `${errors.length} file(s) failed.`,
        { duration: 6000 },
      );
    }

    if (errors.length < files.length) {
      toast.success(`${files.length - errors.length} file(s) uploaded!`);
      onSuccess?.();
    }

    setFiles([]);
    setFileProgress({});
    setCategory("");
    setCaption("");
  };

  const overallProgress =
    files.length > 0
      ? Math.round(
          Object.values(fileProgress).reduce((a, b) => a + Math.max(b, 0), 0) /
            files.length,
        )
      : 0;

  return (
    <div className="space-y-5">
      {/* Drop zone */}
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
          JPG, PNG, WEBP up to {MAX_IMAGE_MB}MB · MP4, WEBM, MOV up to{" "}
          {MAX_VIDEO_MB}MB
        </p>
        <p className="text-[10px] text-text-muted mt-1">
          Videos use resumable upload — large files are fine
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

      {/* File list with per-file progress */}
      {files.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {files.map((f, i) => {
            const pct = fileProgress[f.name];
            const isVid = isVideoFile(f);
            const hasError = pct === -1;
            const isDone = pct === 100;

            return (
              <div
                key={i}
                className="flex flex-col gap-2 p-3 rounded-2xl border"
                style={{
                  background: "var(--bg-tertiary)",
                  borderColor: hasError
                    ? "#f87171"
                    : isDone
                      ? "#4ade8040"
                      : "var(--border)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-bg-primary flex items-center justify-center">
                    {isVid ? (
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
                      {isVid ? "Video · Resumable upload" : "Image"} ·{" "}
                      {formatBytes(f.size)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {pct !== undefined && pct >= 0 && (
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: isDone ? "#4ade80" : "var(--accent)" }}
                      >
                        {isDone ? "✓" : `${pct}%`}
                      </span>
                    )}
                    {hasError && (
                      <span className="text-[10px] font-bold text-red-400">
                        ✗ Failed
                      </span>
                    )}
                    {!uploading && (
                      <button
                        onClick={() => removeFile(i)}
                        className="w-6 h-6 rounded-full flex items-center justify-center
                                   text-xs text-text-muted hover:text-red-400
                                   hover:bg-red-400/10 transition-all"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                {/* Per-file progress bar */}
                {pct !== undefined && pct >= 0 && !isDone && (
                  <div
                    className="w-full h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--border)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${pct}%`,
                        background: isVid ? "#a78bfa" : "var(--accent)",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Metadata */}
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
            className="w-full px-4 py-3 rounded-2xl text-sm border outline-none
                       bg-bg-primary text-text-primary placeholder:text-text-muted
                       focus:border-accent transition-colors duration-300"
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
            className="w-full px-4 py-3 rounded-2xl text-sm border outline-none
                       bg-bg-primary text-text-primary placeholder:text-text-muted
                       focus:border-accent transition-colors duration-300"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
      </div>

      {/* Overall progress bar (only during upload) */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Overall progress</span>
            <span className="font-semibold" style={{ color: "var(--accent)" }}>
              {overallProgress}%
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ background: "var(--bg-tertiary)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${overallProgress}%`,
                background: "var(--accent)",
              }}
            />
          </div>
          <p className="text-[10px] text-text-muted text-center">
            Large videos upload in chunks — do not close this window
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleUpload}
        disabled={uploading || !files.length}
        className="w-full py-3.5 rounded-2xl font-bold text-sm bg-accent
                   text-bg-primary hover:opacity-90 transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:scale-[1.02] active:scale-95"
      >
        {uploading
          ? `Uploading… ${overallProgress}%`
          : `Upload ${
              files.length
                ? `${files.length} file${files.length !== 1 ? "s" : ""}`
                : "Media"
            }`}
      </button>
    </div>
  );
};

export default GalleryUpload;
