import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import { supabase } from "../../utils/supabase";
import { createWhatsAppLink } from "../../utils/whatsapp";
import { GARMENT_TYPES, BUDGET_RANGES } from "../../data/customOrderOptions";

const STEPS = ["Garment", "Details", "Contact"];

const initialForm = {
  garmentType: "",
  fabricPreference: "",
  budgetRange: "",
  notes: "",
  fullName: "",
  phone: "",
  email: "",
};

const CustomOrderForm = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [orderRef, setOrderRef] = useState(null);
  const stepRef = useRef(null);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // ── Animate step transitions ─────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        stepRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
      );
    });
    return () => ctx.revert();
  }, [step]);

  // ── Validation per step ───────────────────────────
  const validateStep = () => {
    if (step === 0) {
      if (!form.garmentType) {
        toast.error("Please select a garment type.");
        return false;
      }
      if (!form.budgetRange) {
        toast.error("Please select a budget range.");
        return false;
      }
    }
    if (step === 2) {
      if (!form.fullName.trim()) {
        toast.error("Please enter your name.");
        return false;
      }
      if (!form.phone.trim() || form.phone.trim().length < 7) {
        toast.error("Please enter a valid phone number.");
        return false;
      }
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
        toast.error("Please enter a valid email or leave it blank.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  // ── Image upload handling ─────────────────────────
  const handleImages = (e) => {
    const selected = Array.from(e.target.files).slice(0, 4);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const removePreview = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadReferenceImages = async () => {
    if (files.length === 0) return [];
    const urls = await Promise.all(
      files.map(async (file) => {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage
          .from("custom-order-references")
          .upload(path, file);
        if (error) throw new Error(error.message);
        const { data } = supabase.storage
          .from("custom-order-references")
          .getPublicUrl(path);
        return data.publicUrl;
      }),
    );
    return urls;
  };

  const buildWhatsAppMessage = (imageUrls) => {
    const garmentLabel =
      GARMENT_TYPES.find((g) => g.value === form.garmentType)?.label ||
      form.garmentType;

    return `Hi! I'd like to place a *custom order* 🧵

*Garment:* ${garmentLabel}
*Fabric preference:* ${form.fabricPreference || "Not specified"}
*Budget:* ${form.budgetRange}
${form.notes ? `*Notes:* ${form.notes}\n` : ""}
*Name:* ${form.fullName}
*Phone:* ${form.phone}
${form.email ? `*Email:* ${form.email}\n` : ""}
${imageUrls.length ? `*Reference images:*\n${imageUrls.join("\n")}` : ""}

Could you please guide me through the next steps?`;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    const toastId = toast.loading("Submitting your request...");

    let imageUrls = [];
    let insertedId = null;

    try {
      imageUrls = await uploadReferenceImages();
    } catch (err) {
      console.error("Reference image upload failed:", err);
      // Don't block the flow — proceed without images
    }

    try {
      const { data, error } = await supabase
        .from("custom_orders")
        .insert({
          full_name: form.fullName,
          phone: form.phone,
          email: form.email || null,
          garment_type: form.garmentType,
          fabric_preference: form.fabricPreference || null,
          budget_range: form.budgetRange,
          reference_images: imageUrls,
          notes: form.notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      insertedId = data.id;
    } catch (err) {
      console.error("Custom order save failed:", err);
      // Still proceed — customer's WhatsApp message is the fallback record
    }

    toast.success("Request ready! Opening WhatsApp...", { id: toastId });

    const message = buildWhatsAppMessage(imageUrls);
    const link = createWhatsAppLink({ message });
    window.open(link, "_blank", "noopener,noreferrer");

    setOrderRef(insertedId);
    setSubmitting(false);
  };

  const handleReset = () => {
    setForm(initialForm);
    setFiles([]);
    setPreviews([]);
    setStep(0);
    setOrderRef(null);
  };

  const whatsappFallbackLink = orderRef
    ? createWhatsAppLink({ message: buildWhatsAppMessage([]) })
    : "#";

  // ── SUCCESS STATE ──────────────────────────────────
  if (orderRef !== null) {
    return (
      <div className="text-center py-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-6"
          style={{
            background: "color-mix(in srgb, var(--accent) 15%, transparent)",
          }}
        >
          ✓
        </div>
        <h3 className="font-display text-2xl font-bold text-text-primary mb-3">
          Request Sent!
        </h3>
        <p className="text-text-secondary mb-2 max-w-sm mx-auto">
          Your custom order request has been received. Continue the conversation
          on WhatsApp to finalize the details.
        </p>
        {orderRef && (
          <p className="text-xs text-text-muted mb-8 font-mono">
            Reference #{orderRef.slice(0, 8).toUpperCase()}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={whatsappFallbackLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl
                       font-bold text-sm bg-accent text-bg-primary hover:opacity-90
                       transition-all duration-300"
          >
            Open WhatsApp Again
          </a>
          <button
            onClick={handleReset}
            className="px-6 py-3.5 rounded-2xl font-semibold text-sm border
                       text-text-primary hover:border-accent transition-all duration-300"
            style={{ borderColor: "var(--border)" }}
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── PROGRESS BAR ─────────────────────────────── */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1">
            <div
              className="h-1 rounded-full transition-all duration-500"
              style={{
                background: i <= step ? "var(--accent)" : "var(--border)",
              }}
            />
            <p
              className="text-[10px] uppercase tracking-wider mt-2 font-semibold"
              style={{
                color: i <= step ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      <div ref={stepRef}>
        {/* ── STEP 1: GARMENT ──────────────────────────── */}
        {step === 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              What are we making? <span className="text-accent">*</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {GARMENT_TYPES.map((g) => {
                const active = form.garmentType === g.value;
                return (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => set("garmentType", g.value)}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl border
                               transition-all duration-200"
                    style={{
                      background: active
                        ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                        : "var(--bg-card)",
                      borderColor: active ? "var(--accent)" : "var(--border)",
                    }}
                  >
                    <span className="text-2xl" aria-hidden="true">
                      {g.icon}
                    </span>
                    <span
                      className="text-xs font-semibold text-center"
                      style={{
                        color: active
                          ? "var(--accent)"
                          : "var(--text-secondary)",
                      }}
                    >
                      {g.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mb-8">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Fabric Preference (optional)
              </label>
              <input
                type="text"
                value={form.fabricPreference}
                onChange={(e) => set("fabricPreference", e.target.value)}
                placeholder="e.g. Italian wool, Ankara, linen..."
                className="w-full px-4 py-3 rounded-2xl text-sm border outline-none
                           bg-bg-primary text-text-primary placeholder:text-text-muted
                           focus:border-accent transition-colors duration-300"
                style={{ borderColor: "var(--border)" }}
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                Budget Range <span className="text-accent">*</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {BUDGET_RANGES.map((range) => {
                  const active = form.budgetRange === range;
                  return (
                    <button
                      key={range}
                      type="button"
                      onClick={() => set("budgetRange", range)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200"
                      style={{
                        background: active ? "var(--accent)" : "transparent",
                        color: active
                          ? "var(--bg-primary)"
                          : "var(--text-secondary)",
                        borderColor: active ? "var(--accent)" : "var(--border)",
                      }}
                    >
                      {range}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: DETAILS ──────────────────────────── */}
        {step === 1 && (
          <div>
            <div className="mb-8">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Reference Images (optional, max 4)
              </label>
              <p className="text-xs text-text-muted mb-3">
                Got a photo of a style you love? Upload it here.
              </p>

              {previews.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {previews.map((src, i) => (
                    <div
                      key={i}
                      className="relative w-20 h-20 rounded-2xl overflow-hidden border"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePreview(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500
                                   text-white text-xs flex items-center justify-center
                                   hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label
                className="flex flex-col items-center justify-center w-full h-28
                           rounded-2xl border-2 border-dashed cursor-pointer
                           hover:border-accent transition-colors duration-300"
                style={{ borderColor: "var(--border)" }}
              >
                <span className="text-xl mb-1" aria-hidden="true">
                  📷
                </span>
                <span className="text-xs text-text-muted">Click to upload</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImages}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Additional Notes
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={5}
                placeholder="Tell us more — style details, occasion, timeline, or measurements you already have. We'll confirm everything via WhatsApp."
                className="w-full px-4 py-3 rounded-2xl text-sm border outline-none
                           bg-bg-primary text-text-primary placeholder:text-text-muted
                           focus:border-accent transition-colors duration-300 resize-none"
                style={{ borderColor: "var(--border)" }}
              />
            </div>
          </div>
        )}

        {/* ── STEP 3: CONTACT ──────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Full Name <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-2xl text-sm border outline-none
                           bg-bg-primary text-text-primary placeholder:text-text-muted
                           focus:border-accent transition-colors duration-300"
                style={{ borderColor: "var(--border)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Phone Number <span className="text-accent">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+234 800 000 0000"
                className="w-full px-4 py-3 rounded-2xl text-sm border outline-none
                           bg-bg-primary text-text-primary placeholder:text-text-muted
                           focus:border-accent transition-colors duration-300"
                style={{ borderColor: "var(--border)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Email (optional)
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-2xl text-sm border outline-none
                           bg-bg-primary text-text-primary placeholder:text-text-muted
                           focus:border-accent transition-colors duration-300"
                style={{ borderColor: "var(--border)" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── NAV BUTTONS ──────────────────────────────── */}
      <div className="flex items-center justify-between mt-10">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0}
          className="px-6 py-3 rounded-2xl text-sm font-semibold border
                     text-text-secondary hover:border-accent transition-all duration-300
                     disabled:opacity-0 disabled:pointer-events-none"
          style={{ borderColor: "var(--border)" }}
        >
          ← Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-8 py-3 rounded-2xl text-sm font-bold bg-accent
                       text-bg-primary hover:opacity-90 transition-all duration-300
                       hover:scale-105 active:scale-95"
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-3 rounded-2xl text-sm font-bold bg-accent
                       text-bg-primary hover:opacity-90 transition-all duration-300
                       hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            {submitting ? "Submitting..." : "Send Request"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomOrderForm;
