import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  Edit,
  Ruler,
  Tag,
  Trash2,
  XCircle,
} from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSize } from "../../../Context/SizeContext";
import type { Size } from "../../../Types/Size";
import { DeleteModal } from "../../Global/Components/DeleteModal";
import { toast } from "react-toastify";

export const ShowSize = () => {
  const { sizeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { getSizeById, deleteSize } = useSize();

  const locationState = location.state as { size?: Size } | null;
  const [size, setSize] = useState<Size | null>(locationState?.size ?? null);
  const [loading, setLoading] = useState(!locationState?.size);
  const [error, setError] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!sizeId) return;

    if (!locationState?.size) {
      setLoading(true);
      setError(null);
      getSizeById(sizeId)
        .then((fetched) => {
          setSize(fetched);
        })
        .catch((err) => {
          const message = err instanceof Error ? err.message : "Failed to load size details.";
          setError(message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [sizeId, getSizeById, locationState]);

  const handleDelete = async () => {
    if (!size) return;
    setIsDeleting(true);

    try {
      await deleteSize(size.id);
      toast.success("Size deleted successfully!");
      setShowDeleteModal(false);
      navigate("/admin/sizes");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete size.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] rounded-2xl sm:rounded-3xl bg-white p-8 sm:p-12 text-center text-slate-800 shadow-sm flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
          <p className="text-sm text-slate-500">Loading size details...</p>
        </div>
      </div>
    );
  }

  if (error || !size) {
    return (
      <div className="min-h-[50vh] rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 text-slate-800 shadow-sm">
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-10 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Size not found</h1>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-500">
            {error ?? "The size you are looking for does not exist or could not be loaded."}
          </p>
          <Link
            to="/admin/sizes"
            className="mt-5 sm:mt-6 inline-flex items-center gap-2 rounded-lg bg-(--main-color) px-4 py-2 text-sm text-white transition-colors hover:bg-(--hover-color)"
          >
            <ArrowLeft size={16} />
            <span>Back to Sizes</span>
          </Link>
        </div>
      </div>
    );
  }

  const isActive = size.isActive ?? true;

  return (
    <div className="min-h-screen p-3.5 sm:p-5 lg:p-6 text-slate-800 shadow-sm">
      {/* Top Navigation & Action Header */}
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2 sm:space-y-3">
          <Link
            to="/admin/sizes"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft size={16} />
            Back to sizes
          </Link>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">Size Details</h1>
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

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            to={`/admin/sizes/edit/${size.id}`}
            state={{ size }}
            className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-(--main-color) px-4 py-2 text-xs sm:text-sm font-medium text-white transition hover:bg-(--hover-color)"
          >
            <Edit size={16} />
            <span>Edit Size</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex flex-1 sm:flex-none cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs sm:text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid gap-5 sm:gap-6">
        {/* Main Overview Card */}
        <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
          <div className="mb-5 sm:mb-6 flex items-center gap-3.5 sm:gap-4">
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-50 font-bold text-teal-800 text-xl sm:text-2xl border border-teal-100">
              {size.name}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{size.name}</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Sort Order: <span className="font-mono font-medium text-slate-700">#{size.sortOrder}</span> &bull; ID: #{size.id}
              </p>
            </div>
          </div>

          <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                <Tag size={16} />
                <span>Size Label</span>
              </div>
              <p className="mt-1.5 sm:mt-2 text-lg sm:text-xl font-bold text-slate-900">{size.name}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                <ArrowUpDown size={16} />
                <span>Display Order</span>
              </div>
              <p className="mt-1.5 sm:mt-2 font-mono text-lg sm:text-xl font-bold text-slate-900">#{size.sortOrder}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                <Calendar size={16} />
                <span>Identifier</span>
              </div>
              <p className="mt-1.5 sm:mt-2 font-mono text-lg sm:text-xl font-bold text-slate-900">#{size.id}</p>
            </div>
          </div>
        </section>

        {/* Configuration Information Card */}
        <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
          <div className="mb-4 sm:mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <Ruler size={18} className="sm:hidden" />
              <Ruler size={20} className="hidden sm:block" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">Catalog Configuration</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                How this size behaves in product selections and customer storefront views.
              </p>
            </div>
          </div>

          <div className="grid gap-3.5 sm:gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
                Sorting Position
              </span>
              <p className="mt-1.5 sm:mt-2 text-base sm:text-lg font-semibold text-slate-900">
                Position #{size.sortOrder}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Determines the order in which sizes are shown to customers on product detail pages.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
                Visibility State
              </span>
              <p className="mt-1.5 sm:mt-2 text-base sm:text-lg font-semibold text-slate-900">
                {isActive ? "Available in Product Variant Forms" : "Hidden from Product Variant Forms"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {isActive
                  ? "Admins can assign this size to products and stock management."
                  : "Inactive sizes cannot be assigned to new product variants."}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal
          type="size"
          name={size.name}
          canselFunction={() => setShowDeleteModal(false)}
          handleDeleteProduct={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};
