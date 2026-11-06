import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Edit,
  FolderTree,
  Globe,
  Languages,
  Tag,
  Trash2,
} from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useCategory } from "../../../Context/CategoryContext";
import type { Category } from "../../../Types/Category";
import { DeleteModal } from "../../Global/Components/DeleteModal";
import { toast } from "react-toastify";

export const ShowCategory = () => {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { getCategoryById, deleteCategory } = useCategory();

  const locationState = location.state as { category?: Category } | null;
  const [category, setCategory] = useState<Category | null>(locationState?.category ?? null);
  const [loading, setLoading] = useState(!locationState?.category);
  const [error, setError] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!categoryId) return;

    if (!locationState?.category) {
      setLoading(true);
      setError(null);
      getCategoryById(categoryId)
        .then((fetched) => {
          setCategory(fetched);
        })
        .catch((err) => {
          const message = err instanceof Error ? err.message : "Failed to load category details.";
          setError(message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [categoryId, getCategoryById, locationState]);

  const handleDelete = async () => {
    if (!category) return;
    setIsDeleting(true);

    try {
      await deleteCategory(category.id);
      toast.success("Category deleted successfully!");
      setShowDeleteModal(false);
      navigate("/admin/categories");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete category.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
        <div className="rounded-2xl sm:rounded-3xl bg-zinc-950 p-8 sm:p-12 text-center text-zinc-300 shadow-2xl border border-zinc-800">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-zinc-400" />
            <p className="text-sm sm:text-base text-zinc-400">Loading category details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-black p-3.5 sm:p-6 text-zinc-200">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-10 text-center shadow-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">Category not found</h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            {error ?? "The category you are looking for does not exist or could not be loaded."}
          </p>
          <Link
            to="/admin/categories"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-200 transition hover:bg-zinc-750"
          >
            <ArrowLeft size={16} />
            <span>Back to Categories</span>
          </Link>
        </div>
      </div>
    );
  }

  const isActive = category.isActive ?? true;

  return (
    <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200 space-y-4 sm:space-y-6">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-4 sm:pb-6">
        <div className="space-y-2">
          <Link
            to="/admin/categories"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
          >
            <ArrowLeft size={15} />
            Back to categories
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-100">Category Details</h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                isActive
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-zinc-700 bg-zinc-800 text-zinc-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive ? "bg-emerald-400" : "bg-zinc-500"
                }`}
              />
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            to={`/admin/categories/edit/${category.id}`}
            state={{ category }}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800 hover:text-white"
          >
            <Edit size={15} />
            <span>Edit Category</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-zinc-400 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 min-w-0">
        {/* Main Overview Card */}
        <section className="rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
          <div className="mb-4 sm:mb-6 flex items-center gap-3.5">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 shrink-0">
              <FolderTree size={24} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">{category.name}</h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Category ID: <span className="font-mono font-medium text-zinc-300">#{category.id}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                <Tag size={15} className="text-zinc-400" />
                <span>Primary Name</span>
              </div>
              <p className="mt-1.5 text-base sm:text-lg font-bold text-zinc-100">{category.name}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                <CheckCircle2 size={15} className="text-zinc-400" />
                <span>Status</span>
              </div>
              <p className="mt-1.5 text-base sm:text-lg font-bold text-zinc-100">
                {isActive ? "Active in Catalog" : "Hidden from Catalog"}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                <Calendar size={15} className="text-zinc-400" />
                <span>Identifier</span>
              </div>
              <p className="mt-1.5 font-mono text-base sm:text-lg font-bold text-zinc-100">#{category.id}</p>
            </div>
          </div>
        </section>

        {/* Multilingual Translations Section */}
        <section className="rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
          <div className="mb-4 sm:mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
              <Languages size={18} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-100">Multilingual Information</h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Configured translations for Arabic and English locales.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-xl sm:rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  English (EN)
                </span>
                <Globe size={15} className="text-zinc-400" />
              </div>
              <p className="mt-2 text-base sm:text-lg font-semibold text-zinc-100">
                {category.nameEn || category.name || "—"}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">Displayed in English store view</p>
            </div>

            <div className="rounded-xl sm:rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4" dir="rtl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  العربية (AR)
                </span>
                <Globe size={15} className="text-zinc-400" />
              </div>
              <p className="mt-2 text-base sm:text-lg font-semibold text-zinc-100 font-['Cairo']">
                {category.nameAr || "—"}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">يظهر في واجهة المتجر باللغة العربية</p>
            </div>
          </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal
          type="category"
          name={category.name}
          canselFunction={() => setShowDeleteModal(false)}
          handleDeleteProduct={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};
