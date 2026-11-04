import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, Globe, Palette, Save, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useColor } from "../../../Context/ColorContext";
import type { Color, ColorFormData } from "../../../Types/Color";
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

export const EditColor = () => {
  const { colorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { getColorById, updateColor, loading } = useColor();

  const locationColor = (location.state as { color?: Color })?.color;

  const [color, setColor] = useState<Color | null>(locationColor ?? null);
  const [formData, setFormData] = useState<ColorFormData>({
    nameEn: locationColor?.nameEn || locationColor?.name || "",
    nameAr: locationColor?.nameAr || "",
    hex: locationColor?.hex || locationColor?.hexCode || "#000000",
    isActive: locationColor?.isActive ?? true,
  });

  const [isLoadingColor, setIsLoadingColor] = useState(!locationColor);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!colorId) return;

    if (!locationColor) {
      setIsLoadingColor(true);
      getColorById(colorId)
        .then((fetched) => {
          setColor(fetched);
          setFormData({
            nameEn: fetched.nameEn || fetched.name || "",
            nameAr: fetched.nameAr || "",
            hex: fetched.hex || fetched.hexCode || "#000000",
            isActive: fetched.isActive ?? true,
          });
        })
        .catch((err) => {
          const message = err instanceof Error ? err.message : "Failed to load color.";
          toast.error(message);
        })
        .finally(() => {
          setIsLoadingColor(false);
        });
    }
  }, [colorId, getColorById, locationColor]);

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

    if (!colorId) return;

    const validation = colorSchema.safeParse(formData);

    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await updateColor(colorId, formData);
      toast.success("Color updated successfully!");
      navigate("/admin/colors");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update color.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingColor) {
    return (
      <div className="min-h-[50vh] rounded-2xl sm:rounded-3xl bg-white p-8 sm:p-12 text-center text-slate-800 shadow-sm flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
          <p className="text-sm text-slate-500">Loading color for editing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3.5 sm:p-5 lg:p-6 text-slate-800 shadow-sm">
      <div className="w-full rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:pb-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 sm:space-y-3">
            <Link
              to="/admin/colors"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
            >
              <ArrowLeft size={16} />
              Back to colors
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">Edit Color</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Updating <span className="font-semibold text-slate-800">{color?.name || formData.nameEn || `#${colorId}`}</span>
              </p>
            </div>
          </div>

          <button
            type="submit"
            form="edit-color-form"
            disabled={isSubmitting || loading}
            className="inline-flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-(--main-color) px-5 py-2.5 sm:py-3 text-sm font-semibold text-white transition hover:bg-(--hover-color) disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Save size={16} />
            <span>{isSubmitting || loading ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>

        {/* Form Grid */}
        <form
          id="edit-color-form"
          onSubmit={handleSubmit}
          className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
        >
          {/* Left Column: Form Fields */}
          <section className="space-y-5 sm:space-y-6 rounded-[10px] border border-slate-200 bg-slate-50/70 p-4 sm:p-6">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">Color Information</h2>
              <p className="mt-1 text-xs text-slate-500">
                Update the color names in English and Arabic along with its hex code.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {/* English Name */}
              <label className="block space-y-2">
                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
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
                  className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </label>

              {/* Arabic Name */}
              <label className="block space-y-2">
                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
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
                  className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 font-['Cairo']"
                />
              </label>

              {/* Hex Code */}
              <div className="space-y-2">
                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
                  <Palette size={15} className="text-slate-400" />
                  Hex Code <span className="text-red-500">*</span>
                </span>
                <div className="flex overflow-hidden rounded-[10px] border border-slate-200 bg-white focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-100">
                  <div className="relative w-14 sm:w-16 border-r border-slate-200 shrink-0">
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
                    className="h-10 sm:h-11 w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base font-mono text-slate-900 uppercase outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Live Preview & Status */}
          <div className="space-y-5 sm:space-y-6">
            {/* Live Preview Card */}
            <section className="rounded-[10px] border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-300 shadow-md"
                  style={{ backgroundColor: formData.hex }}
                >
                  <Palette size={20} className="text-white mix-blend-difference" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">Live Preview</h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Check how the edited color looks before saving.
                  </p>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-9 w-9 rounded-full border border-slate-300 shadow-sm shrink-0"
                      style={{ backgroundColor: formData.hex }}
                      aria-hidden="true"
                    />
                    <div>
                      <div className="font-semibold text-sm sm:text-base text-slate-900">
                        {formData.nameEn || "Color Name (EN)"}
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-slate-500 font-['Cairo']" dir="rtl">
                        {formData.nameAr || "اسم اللون (AR)"}
                      </div>
                      <div className="font-mono text-xs text-slate-400 uppercase">
                        {formData.hex || "#000000"}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex self-start sm:self-auto rounded-full border px-3 py-1 text-xs font-medium ${
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
            <section className="rounded-[10px] border border-slate-200 bg-linear-to-r from-[#003334] to-[#014849d7] p-4 sm:p-6 text-white shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-teal-300" />
                    <h3 className="text-base sm:text-lg font-semibold">Visibility</h3>
                  </div>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-200">
                    Control whether this color is currently available to products in the dashboard.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleStatus}
                  className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full p-1 transition ${
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

              <div className="mt-5 sm:mt-6 rounded-[10px] bg-white/10 p-3.5 sm:p-4">
                <div className="text-[11px] sm:text-xs text-slate-200 uppercase tracking-wider">Current status</div>
                <div className="mt-1 text-xl sm:text-2xl font-bold">
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
