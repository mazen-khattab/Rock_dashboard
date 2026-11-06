import { useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, FolderTree, Globe, Plus, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCategory } from "../../../Context/CategoryContext";
import type { CategoryFormData } from "../../../Types/Category";
import { toast } from "react-toastify";
import { z } from "zod";

const categorySchema = z.object({
  nameEn: z
    .string()
    .trim()
    .min(1, "English category name is required.")
    .max(200, "English category name must be 200 characters or less."),
  nameAr: z
    .string()
    .trim()
    .min(1, "Arabic category name is required.")
    .max(200, "Arabic category name must be 200 characters or less."),
  isActive: z.boolean(),
});

export const CreateCategory = () => {
  const navigate = useNavigate();
  const { createCategory, loading } = useCategory();

  const [formData, setFormData] = useState<CategoryFormData>({
    nameEn: "",
    nameAr: "",
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

    const validation = categorySchema.safeParse(formData);

    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createCategory(formData);
      toast.success("Category created successfully!");
      navigate("/admin/categories");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create category.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
      <div className="w-full rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-4 sm:pb-6">
          <div className="space-y-2">
            <Link
              to="/admin/categories"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
            >
              <ArrowLeft size={15} />
              Back to categories
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-100">Create Category</h1>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                Add a new category with Arabic and English names and catalog visibility.
              </p>
            </div>
          </div>

          <button
            type="submit"
            form="create-category-form"
            disabled={isSubmitting || loading}
            className="w-full sm:w-auto inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm px-5 py-3 text-xs sm:text-sm transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={16} />
            <span>{isSubmitting || loading ? "Creating..." : "Create Category"}</span>
          </button>
        </div>

        {/* Form Grid */}
        <form
          id="create-category-form"
          onSubmit={handleSubmit}
          className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] min-w-0"
        >
          {/* Left Column: Form Fields */}
          <section className="space-y-5 sm:space-y-6 rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm min-w-0">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-100">Category Information</h2>
              <p className="mt-0.5 text-xs text-zinc-400">
                Provide the category title in English and Arabic for localization.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {/* English Name */}
              <label className="block space-y-1.5">
                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-300">
                  <Globe size={14} className="text-zinc-400" />
                  Category Name in English <span className="text-rose-400">*</span>
                </span>
                <input
                  type="text"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleChange}
                  placeholder="e.g. Dresses, Tops, Accessories"
                  required
                  maxLength={200}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-zinc-500 focus:bg-zinc-900/90 focus:ring-2 focus:ring-zinc-600/20"
                />
              </label>

              {/* Arabic Name */}
              <label className="block space-y-1.5">
                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-300">
                  <Globe size={14} className="text-zinc-400" />
                  اسم الفئة بالعربية (Arabic Name) <span className="text-rose-400">*</span>
                </span>
                <input
                  type="text"
                  name="nameAr"
                  dir="rtl"
                  value={formData.nameAr}
                  onChange={handleChange}
                  placeholder="مثال: فساتين، إكسسوارات"
                  required
                  maxLength={200}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-zinc-500 focus:bg-zinc-900/90 focus:ring-2 focus:ring-zinc-600/20 font-['Cairo']"
                />
              </label>
            </div>
          </section>

          {/* Right Column: Live Preview & Status */}
          <div className="space-y-6 min-w-0">
            {/* Live Preview Card */}
            <section className="rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm shadow-xl min-w-0">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 shrink-0">
                  <FolderTree size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-100">Live Preview</h3>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    Preview how the category card appears in the dashboard.
                  </p>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 rounded-xl sm:rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
                      <FolderTree size={18} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base text-zinc-100">
                        {formData.nameEn || "Category Name (EN)"}
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-zinc-400 font-['Cairo']" dir="rtl">
                        {formData.nameAr || "اسم الفئة (AR)"}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
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
            <section className="rounded-xl sm:rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-4 sm:p-6 text-zinc-200 shadow-xl min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-zinc-400" />
                    <h3 className="text-base sm:text-lg font-bold text-zinc-100">Visibility</h3>
                  </div>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-relaxed text-zinc-400">
                    Control whether this category is active and visible in the store and product forms.
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
                  title="Toggle category status"
                >
                  <span
                    className={`h-6 w-6 rounded-full shadow-md transition ${
                      formData.isActive ? "translate-x-6 bg-white" : "translate-x-0 bg-zinc-400"
                    }`}
                  />
                </button>
              </div>

              <div
                className={`mt-4 sm:mt-6 rounded-xl border p-3.5 sm:p-4 transition ${
                  formData.isActive
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-zinc-800 bg-zinc-950/80"
                }`}
              >
                <div className="text-xs text-zinc-400 uppercase tracking-wider">Current status</div>
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
