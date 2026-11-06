import { useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, Globe, Palette, Plus, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useColor } from "../../../Context/ColorContext";
import type { ColorFormData } from "../../../Types/Color";
import { toast } from "react-toastify";
import { z } from "zod";

const colorSchema = z.object({
  nameEn: z
    .string()
    .trim()
    .min(1, "English color name is required.")
    .max(200, "English color name must be 200 characters or less."),
  nameAr: z
    .string()
    .trim()
    .min(1, "Arabic color name is required.")
    .max(200, "Arabic color name must be 200 characters or less."),
  hex: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Hex code must be in #RRGGBB format (e.g., #003334)."),
  isActive: z.boolean(),
});

export const CreateColor = () => {
  const navigate = useNavigate();
  const { createColor, loading } = useColor();

  const [formData, setFormData] = useState<ColorFormData>({
    nameEn: "",
    nameAr: "",
    hex: "#000000",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    const validation = colorSchema.safeParse(formData);

    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createColor(formData);
      toast.success("Color created successfully!");
      navigate("/admin/colors");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create color.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
      <div className="w-full rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 border-b border-zinc-800 pb-5 sm:pb-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 sm:space-y-3">
            <Link
              to="/admin/colors"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
            >
              <ArrowLeft size={15} />
              Back to colors
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-100">Create Color</h1>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                Add a new dashboard color with hex palette value and visibility settings.
              </p>
            </div>
          </div>

          <button
            type="submit"
            form="create-color-form"
            disabled={isSubmitting || loading}
            className="inline-flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 sm:py-3 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={16} />
            <span>{isSubmitting || loading ? "Creating..." : "Create Color"}</span>
          </button>
        </div>

        {/* Form Grid */}
        <form
          id="create-color-form"
          onSubmit={handleSubmit}
          className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
        >
          {/* Left Column: Form Fields */}
          <section className="space-y-5 sm:space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 sm:p-6 shadow-sm">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-100">Color Information</h2>
              <p className="mt-1 text-xs text-zinc-400">
                Provide color names in English and Arabic along with its hex code.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {/* English Name */}
              <label className="block space-y-2">
                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-300">
                  <Globe size={15} className="text-zinc-400" />
                  Color Name in English <span className="text-rose-400">*</span>
                </span>
                <input
                  type="text"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleChange}
                  placeholder="e.g. Navy Blue, Emerald, Rose Gold"
                  required
                  maxLength={200}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-zinc-500 focus:bg-zinc-900"
                />
              </label>

              {/* Arabic Name */}
              <label className="block space-y-2">
                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-300">
                  <Globe size={15} className="text-zinc-400" />
                  اسم اللون بالعربية (Arabic Name) <span className="text-rose-400">*</span>
                </span>
                <input
                  type="text"
                  name="nameAr"
                  dir="rtl"
                  value={formData.nameAr}
                  onChange={handleChange}
                  placeholder="مثال: كحلي، زمردي، ذهبي وردي"
                  required
                  maxLength={200}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-zinc-500 focus:bg-zinc-900 font-['Cairo']"
                />
              </label>

              {/* Hex Code */}
              <div className="space-y-2">
                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-300">
                  <Palette size={15} className="text-zinc-400" />
                  Hex Code <span className="text-rose-400">*</span>
                </span>
                <div className="flex overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 focus-within:border-zinc-500 focus-within:bg-zinc-900">
                  <div className="relative w-14 sm:w-16 border-r border-zinc-800 shrink-0">
                    <span
                      className="block h-full w-full"
                      style={{ backgroundColor: formData.hex }}
                      aria-hidden="true"
                    />
                    <input
                      type="color"
                      name="hex"
                      value={formData.hex}
                      onChange={handleChange}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </div>
                  <input
                    type="text"
                    name="hex"
                    value={formData.hex}
                    onChange={handleChange}
                    placeholder="#003334"
                    maxLength={7}
                    required
                    className="h-10 sm:h-11 w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base font-mono text-zinc-200 uppercase outline-none placeholder:text-zinc-600"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Live Preview & Status */}
          <div className="space-y-5 sm:space-y-6">
            {/* Live Preview Card */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 sm:p-6 shadow-sm">
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border border-zinc-700 shadow-md"
                  style={{ backgroundColor: formData.hex }}
                >
                  <Palette size={20} className="text-white mix-blend-difference" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-100">Live Preview</h3>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    Check how the new color looks before creating it.
                  </p>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-9 w-9 rounded-full border border-zinc-700 shadow-sm shrink-0"
                      style={{ backgroundColor: formData.hex }}
                      aria-hidden="true"
                    />
                    <div>
                      <div className="font-semibold text-sm sm:text-base text-zinc-100">
                        {formData.nameEn || "Color Name (EN)"}
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-zinc-400 font-['Cairo']" dir="rtl">
                        {formData.nameAr || "اسم اللون (AR)"}
                      </div>
                      <div className="font-mono text-xs text-zinc-500 uppercase">
                        {formData.hex || "#000000"}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex self-start sm:self-auto rounded-full border px-3 py-1 text-xs font-medium ${
                      formData.isActive
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </section>

            {/* Visibility Settings Card */}
            <section
              className={`rounded-2xl border p-4 sm:p-6 text-zinc-100 shadow-xl transition-all ${
                formData.isActive
                  ? "border-emerald-500/40 bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/20 shadow-emerald-950/20"
                  : "border-zinc-800 bg-zinc-950"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles
                      size={18}
                      className={formData.isActive ? "text-emerald-400" : "text-zinc-500"}
                    />
                    <h3 className="text-base sm:text-lg font-bold text-zinc-100">Visibility</h3>
                  </div>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-zinc-400">
                    Control whether this color should be available to products immediately.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleStatus}
                  className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border p-1 transition-all ${
                    formData.isActive
                      ? "bg-emerald-600 border-emerald-500"
                      : "bg-zinc-800 border-zinc-700"
                  }`}
                  aria-pressed={formData.isActive}
                  title="Toggle color status"
                >
                  <span
                    className={`h-6 w-6 rounded-full shadow-md transition-transform ${
                      formData.isActive ? "translate-x-6 bg-white" : "translate-x-0 bg-zinc-400"
                    }`}
                  />
                </button>
              </div>

              <div
                className={`mt-5 sm:mt-6 rounded-xl border p-3.5 sm:p-4 transition-colors ${
                  formData.isActive
                    ? "border-emerald-500/30 bg-emerald-950/30"
                    : "border-zinc-800 bg-zinc-900/80"
                }`}
              >
                <div className="text-[11px] sm:text-xs text-zinc-400 uppercase tracking-wider">Current status</div>
                <div
                  className={`mt-1 text-xl sm:text-2xl font-bold ${
                    formData.isActive ? "text-emerald-400" : "text-zinc-500"
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
