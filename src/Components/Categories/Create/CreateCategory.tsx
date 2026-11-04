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
    <div className="min-h-screen p-6 text-slate-800 shadow-sm">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Link
              to="/admin/categories"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
            >
              <ArrowLeft size={16} />
              Back to categories
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">Create Category</h1>
              <p className="mt-1 text-sm text-slate-500">
                Add a new category with Arabic and English names and catalog visibility.
              </p>
            </div>
          </div>

          <button
            type="submit"
            form="create-category-form"
            disabled={isSubmitting || loading}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-(--main-color) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--hover-color) disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Plus size={16} />
            <span>{isSubmitting || loading ? "Creating..." : "Create Category"}</span>
          </button>
        </div>

        {/* Form Grid */}
        <form
          id="create-category-form"
          onSubmit={handleSubmit}
          className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
        >
          {/* Left Column: Form Fields */}
          <section className="space-y-6 rounded-[10px] border border-slate-200 bg-slate-50/70 p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Category Information</h2>
              <p className="mt-1 text-xs text-slate-500">
                Provide the category title in English and Arabic for localization.
              </p>
            </div>

            <div className="space-y-5">
              {/* English Name */}
              <label className="block space-y-2">
                <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <Globe size={15} className="text-slate-400" />
                  Category Name in English <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleChange}
                  placeholder="e.g. Dresses, Tops, Accessories"
                  required
                  maxLength={200}
                  className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </label>

              {/* Arabic Name */}
              <label className="block space-y-2">
                <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <Globe size={15} className="text-slate-400" />
                  اسم الفئة بالعربية (Arabic Name) <span className="text-red-500">*</span>
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
                  className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 font-['Cairo']"
                />
              </label>
            </div>
          </section>

          {/* Right Column: Live Preview & Status */}
          <div className="space-y-6">
            {/* Live Preview Card */}
            <section className="rounded-[10px] border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <FolderTree size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Live Preview</h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Preview how the category card appears in the dashboard.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
                      <FolderTree size={18} />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {formData.nameEn || "Category Name (EN)"}
                      </div>
                      <div className="text-sm font-medium text-slate-500 font-['Cairo']" dir="rtl">
                        {formData.nameAr || "اسم الفئة (AR)"}
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
                    Control whether this category is active and visible in the store and product forms.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleStatus}
                  className={`relative inline-flex h-8 w-14 cursor-pointer items-center rounded-full p-1 transition ${
                    formData.isActive ? "bg-teal-400" : "bg-white/20"
                  }`}
                  aria-pressed={formData.isActive}
                  title="Toggle category status"
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
