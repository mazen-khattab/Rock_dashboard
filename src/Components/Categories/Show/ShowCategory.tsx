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
  XCircle,
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
      <div className="min-h-screen rounded-3xl bg-white p-12 text-center text-slate-800 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
          <p className="text-slate-500">Loading category details...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen rounded-3xl bg-white p-6 text-slate-800 shadow-sm">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Category not found</h1>
          <p className="mt-3 text-slate-500">
            {error ?? "The category you are looking for does not exist or could not be loaded."}
          </p>
          <Link
            to="/admin/categories"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-(--main-color) px-4 py-2 text-white transition-colors hover:bg-(--hover-color)"
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
    <div className="min-h-screen p-6 text-slate-800 shadow-sm">
      {/* Top Navigation & Action Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <Link
            to="/admin/categories"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft size={16} />
            Back to categories
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Category Details</h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                isActive
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              {isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/admin/categories/edit/${category.id}`}
            state={{ category }}
            className="inline-flex items-center gap-2 rounded-lg bg-(--main-color) px-4 py-2 text-sm font-medium text-white transition hover:bg-(--hover-color)"
          >
            <Edit size={16} />
            <span>Edit Category</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Main Overview Card */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <FolderTree size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{category.name}</h2>
              <p className="text-sm text-slate-500">
                Category ID: <span className="font-mono font-medium text-slate-700">#{category.id}</span>
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Tag size={16} />
                <span>Primary Name</span>
              </div>
              <p className="mt-2 text-xl font-bold text-slate-900">{category.name}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 size={16} />
                <span>Status</span>
              </div>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {isActive ? "Active in Catalog" : "Hidden from Catalog"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar size={16} />
                <span>Identifier</span>
              </div>
              <p className="mt-2 font-mono text-xl font-bold text-slate-900">#{category.id}</p>
            </div>
          </div>
        </section>

        {/* Multilingual Translations Section */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <Languages size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Multilingual Information</h3>
              <p className="text-sm text-slate-500">
                Configured translations for Arabic and English locales.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  English (EN)
                </span>
                <Globe size={16} className="text-slate-400" />
              </div>
              <p className="mt-3 text-lg font-semibold text-slate-900">
                {category.nameEn || category.name || "—"}
              </p>
              <p className="mt-1 text-xs text-slate-400">Displayed in English store view</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5" dir="rtl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  العربية (AR)
                </span>
                <Globe size={16} className="text-slate-400" />
              </div>
              <p className="mt-3 text-lg font-semibold text-slate-900 font-['Cairo']">
                {category.nameAr || "—"}
              </p>
              <p className="mt-1 text-xs text-slate-400">يظهر في واجهة المتجر باللغة العربية</p>
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
