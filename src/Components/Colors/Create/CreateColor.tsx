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
    <div className="min-h-screen p-6 text-slate-800 shadow-sm">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Link
              to="/admin/colors"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
            >
              <ArrowLeft size={16} />
              Back to colors
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">Create Color</h1>
              <p className="mt-1 text-sm text-slate-500">
                Add a new dashboard color with hex palette value and visibility settings.
              </p>
            </div>
          </div>

          <button
            type="submit"
            form="create-color-form"
            disabled={isSubmitting || loading}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-(--main-color) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--hover-color) disabled:cursor-not-allowed disabled:opacity-70"
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
          <section className="space-y-6 rounded-[10px] border border-slate-200 bg-slate-50/70 p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Color Information</h2>
              <p className="mt-1 text-xs text-slate-500">
                Provide color names in English and Arabic along with its hex code.
              </p>
            </div>

            <div className="space-y-5">
              {/* English Name */}
              <label className="block space-y-2">
                <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <Globe size={15} className="text-slate-400" />
                  Color Name in English <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleChange}
                  placeholder="e.g. Navy Blue, Emerald, Rose Gold"
                  required
                  maxLength={200}
                  className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </label>

              {/* Arabic Name */}
              <label className="block space-y-2">
                <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <Globe size={15} className="text-slate-400" />
                  اسم اللون بالعربية (Arabic Name) <span className="text-red-500">*</span>
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
                  className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 font-['Cairo']"
                />
              </label>

              {/* Hex Code */}
              <div className="space-y-2">
                <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <Palette size={15} className="text-slate-400" />
                  Hex Code <span className="text-red-500">*</span>
                </span>
                <div className="flex overflow-hidden rounded-[10px] border border-slate-200 bg-white focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-100">
                  <div className="relative w-16 border-r border-slate-200">
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
                    className="h-11 w-full px-4 py-3 font-mono text-slate-900 uppercase outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Live Preview & Status */}
          <div className="space-y-6">
            {/* Live Preview Card */}
            <section className="rounded-[10px] border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-300 shadow-md"
                  style={{ backgroundColor: formData.hex }}
                >
                  <Palette size={20} className="text-white mix-blend-difference" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Live Preview</h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Check how the new color looks before creating it.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-9 w-9 rounded-full border border-slate-300 shadow-sm shrink-0"
                      style={{ backgroundColor: formData.hex }}
                      aria-hidden="true"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">
                        {formData.nameEn || "Color Name (EN)"}
                      </div>
                      <div className="text-sm font-medium text-slate-500 font-['Cairo']" dir="rtl">
                        {formData.nameAr || "اسم اللون (AR)"}
                      </div>
                      <div className="font-mono text-xs text-slate-400 uppercase">
                        {formData.hex || "#000000"}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      formData.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    }`}
                  >
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </section>

            {/* Visibility Settings Card */}
            <section className="rounded-[10px] border border-slate-200 bg-linear-to-r from-[#003334] to-[#014849d7] p-6 text-white shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-teal-300" />
                    <h3 className="text-lg font-semibold">Visibility</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Control whether this color should be available to products immediately.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleStatus}
                  className={`relative inline-flex h-8 w-14 cursor-pointer items-center rounded-full p-1 transition ${
                    formData.isActive ? "bg-teal-400" : "bg-white/20"
                  }`}
                  aria-pressed={formData.isActive}
                  title="Toggle color status"
                >
                  <span
                    className={`h-6 w-6 rounded-full bg-white shadow-md transition ${
                      formData.isActive ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-6 rounded-[10px] bg-white/10 p-4">
                <div className="text-xs text-slate-200 uppercase tracking-wider">Current status</div>
                <div className="mt-1 text-2xl font-bold">
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
