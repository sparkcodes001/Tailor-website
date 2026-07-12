import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import toast from "react-hot-toast";

const emptyForm = { name: "", review: "", rating: 5 };

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) toast.error("Failed to load testimonials.");
    else setTestimonials(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (t) => {
    setEditId(t.id);
    setForm({ name: t.name, review: t.review, rating: t.rating });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.review.trim()) {
      return toast.error("Name and review are required.");
    }

    setSaving(true);
    const toastId = toast.loading(editId ? "Updating..." : "Saving...");

    const { error } = editId
      ? await supabase.from("testimonials").update(form).eq("id", editId)
      : await supabase.from("testimonials").insert(form);

    if (error) {
      toast.error(error.message, { id: toastId });
    } else {
      toast.success(editId ? "Testimonial updated!" : "Testimonial added!", {
        id: toastId,
      });
      setShowForm(false);
      fetchTestimonials();
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return toast.error("Delete failed.");
    toast.success("Testimonial deleted.");
    fetchTestimonials();
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">
            Testimonials
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {testimonials.length} review{testimonials.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-6 py-3 rounded-2xl font-bold text-sm bg-accent
                     text-bg-primary hover:opacity-90 transition-all duration-300
                     hover:scale-105 active:scale-95"
        >
          + Add Testimonial
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="w-full max-w-md rounded-3xl p-8 border"
            style={{
              background: "var(--bg-secondary)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-text-primary">
                {editId ? "Edit Testimonial" : "New Testimonial"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-text-muted hover:text-text-primary transition-colors text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Sarah J, London"
                  className="w-full px-4 py-3 rounded-2xl text-sm border outline-none
                             bg-bg-primary text-text-primary placeholder:text-text-muted
                             focus:border-accent transition-colors duration-300"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Review *
                </label>
                <textarea
                  value={form.review}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, review: e.target.value }))
                  }
                  rows={4}
                  placeholder="What did they say about your work?"
                  className="w-full px-4 py-3 rounded-2xl text-sm border outline-none
                             bg-bg-primary text-text-primary placeholder:text-text-muted
                             focus:border-accent transition-colors duration-300 resize-none"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, rating: star }))}
                      className="text-2xl transition-transform hover:scale-110"
                      style={{
                        color:
                          star <= form.rating
                            ? "var(--accent)"
                            : "var(--border)",
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 rounded-2xl font-bold text-sm bg-accent
                           text-bg-primary hover:opacity-90 transition-all duration-300
                           disabled:opacity-50"
              >
                {saving ? "Saving..." : editId ? "Update" : "Add Testimonial"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-text-muted text-center py-24">Loading...</p>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-4xl mb-4">💬</p>
          <p className="text-text-muted">No testimonials yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-2xl border theme-transition"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      style={{
                        color:
                          s <= t.rating ? "var(--accent)" : "var(--border)",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(t)}
                    className="text-xs font-semibold text-text-secondary hover:text-accent transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-xs font-semibold text-red-400 hover:text-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-text-secondary mb-3 leading-relaxed">
                "{t.review}"
              </p>
              <p className="text-xs font-semibold text-accent">— {t.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
