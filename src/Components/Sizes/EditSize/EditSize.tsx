import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, ArrowUpDown, Ruler, Save, Sparkles, Tag } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSize } from "../../../Context/SizeContext";
import type { Size, SizeFormData } from "../../../Types/Size";
import { toast } from "react-toastify";
import { z } from "zod";

const sizeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Size name is required.")
    .max(50, "Size name must be 50 characters or less."),
  sortOrder: z.number().int().min(0, "Sort order must be 0 or greater."),
  isActive: z.boolean(),
});

export const EditSize = () => {
  const { sizeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { getSizeById, updateSize, loading } = useSize();

  const locationSize = (location.state as { size?: Size })?.size;

  const [size, setSize] = useState<Size | null>(locationSize ?? null);
  const [formData, setFormData] = useState<SizeFormData>({
    name: locationSize?.name || "",
    sortOrder: typeof locationSize?.sortOrder === "number" ? locationSize.sortOrder : 1,
    isActive: locationSize?.isActive ?? true,
  });

  const [isLoadingSize, setIsLoadingSize] = useState(!locationSize);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!sizeId) return;

    if (!locationSize) {
      setIsLoadingSize(true);
      getSizeById(sizeId)
        .then((fetched) => {
          setSize(fetched);
          setFormData({
            name: fetched.name || "",
            sortOrder: typeof fetched.sortOrder === "number" ? fetched.sortOrder : 1,
            isActive: fetched.isActive ?? true,
          });
        })
        .catch((err) => {
          const message = err instanceof Error ? err.message : "Failed to load size.";
          toast.error(message);
        })
        .finally(() => {
          setIsLoadingSize(false);
        });
    }
  }, [sizeId, getSizeById, locationSize]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleToggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!sizeId) return;

    const validation = sizeSchema.safeParse(formData);

    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await updateSize(sizeId, formData);
      toast.success("Size updated successfully!");
      navigate("/admin/sizes");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update size.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingSize) {
    return (
      <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
        <div className="rounded-2xl sm:rounded-3xl bg-zinc-950 p-8 sm:p-12 text-center text-zinc-300 shadow-2xl border border-zinc-800">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-zinc-400" />
            <p className="text-sm sm:text-base text-zinc-400">Loading size for editing...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
      <div className="w-full rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 border-b border-zinc-800 pb-5 sm:pb-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 sm:space-y-3">
            <Link
              to="/admin/sizes"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
            >
              <ArrowLeft size={15} />
              Back to sizes
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-100">Edit Size</h1>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                Updating <span className="font-semibold text-zinc-200">{size?.name || formData.name || `#${sizeId}`}</span>
              </p>
            </div>
          </div>

          <button
            type="submit"
            form="edit-size-form"
            disabled={isSubmitting || loading}
            className="inline-flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm px-5 py-2.5 sm:py-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isSubmitting || loading ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>

        {/* Form Grid */}
        <form
          id="edit-size-form"
          onSubmit={handleSubmit}
          className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
        >
          {/* Left Column: Form Fields */}
          <section className="space-y-5 sm:space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 sm:p-6 shadow-sm">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-100">Size Information</h2>
              <p className="mt-1 text-xs text-zinc-400">
                Update the size label and its sorting position in product forms.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {/* Size Name */}
              <label className="block space-y-2">
                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-300">
                  <Tag size={15} className="text-zinc-400" />
                  Size Name / Label <span className="text-rose-400">*</span>
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. S, M, L, XL, 38, 40"
                  required
                  maxLength={50}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-zinc-500 focus:bg-zinc-900"
                />
              </label>

              {/* Sort Order */}
              <label className="block space-y-2">
                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-300">
                  <ArrowUpDown size={15} className="text-zinc-400" />
                  Sort Order <span className="text-rose-400">*</span>
                </span>
                <input
                  type="number"
                  name="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleChange}
                  min={0}
                  step={1}
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 font-mono text-sm sm:text-base text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-zinc-500 focus:bg-zinc-900"
                />
                <p className="text-xs text-zinc-500">
                  Lower numbers appear first in customer selections (e.g. 1 for XS, 2 for S).
                </p>
              </label>
            </div>
          </section>

          {/* Right Column: Live Preview & Status */}
          <div className="space-y-5 sm:space-y-6">
            {/* Live Preview Card */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 sm:p-6 shadow-sm">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
                  <Ruler size={22} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-100">Live Preview</h3>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    Preview how this size badge appears in the dashboard.
                  </p>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700 font-bold text-zinc-200 text-sm sm:text-base shrink-0">
                      {formData.name || "—"}
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base text-zinc-100">
                        {formData.name || "Size Label"}
                      </div>
                      <div className="font-mono text-xs text-zinc-400">
                        Sort Priority: #{formData.sortOrder}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border px-3 py-1 text-xs font-medium ${
                      formData.isActive
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-zinc-700 bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        formData.isActive ? "bg-emerald-400" : "bg-zinc-500"
                      }`}
                    />
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </section>

            {/* Visibility Settings Card */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 text-zinc-100 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-zinc-400" />
                    <h3 className="text-base sm:text-lg font-bold text-zinc-100">Visibility</h3>
                  </div>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-zinc-400">
                    Control whether this size is active and available in product variant creation.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleStatus}
                  className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border p-1 transition ${
                    formData.isActive
                      ? "border-emerald-500 bg-emerald-600"
                      : "border-zinc-700 bg-zinc-800"
                  }`}
                  aria-pressed={formData.isActive}
                  title="Toggle size status"
                >
                  <span
                    className={`h-6 w-6 rounded-full shadow-md transition ${
                      formData.isActive ? "translate-x-6 bg-white" : "translate-x-0 bg-zinc-400"
                    }`}
                  />
                </button>
              </div>

              <div
                className={`mt-5 sm:mt-6 rounded-xl border p-3.5 sm:p-4 transition ${
                  formData.isActive
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-zinc-800 bg-zinc-900/80"
                }`}
              >
                <div className="text-[11px] sm:text-xs text-zinc-400 uppercase tracking-wider">Current status</div>
                <div
                  className={`mt-1 text-xl sm:text-2xl font-bold ${
                    formData.isActive ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {formData.isActive ? "Active" : "Inactive"}
                </div>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
};
