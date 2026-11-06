import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpDown,
  Calendar,
  Edit,
  Ruler,
  Tag,
  Trash2,
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
      <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
        <div className="rounded-2xl sm:rounded-3xl bg-zinc-950 p-8 sm:p-12 text-center text-zinc-300 shadow-2xl border border-zinc-800">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-zinc-400" />
            <p className="text-sm sm:text-base text-zinc-400">Loading size details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !size) {
    return (
      <div className="min-h-screen bg-black p-3.5 sm:p-6 text-zinc-200">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-10 text-center shadow-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">Size not found</h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            {error ?? "The size you are looking for does not exist or could not be loaded."}
          </p>
          <Link
            to="/admin/sizes"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-200 transition hover:bg-zinc-750"
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
    <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200 space-y-4 sm:space-y-6">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-4 sm:pb-6">
        <div className="space-y-2">
          <Link
            to="/admin/sizes"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
          >
            <ArrowLeft size={15} />
            Back to sizes
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-100">Size Details</h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                isActive
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-zinc-700 bg-zinc-800/60 text-zinc-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive ? "bg-emerald-400" : "bg-zinc-400"
                }`}
              />
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            to={`/admin/sizes/edit/${size.id}`}
            state={{ size }}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800 hover:text-white"
          >
            <Edit size={15} />
            <span>Edit Size</span>
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
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-800/80 border border-zinc-700/60 font-bold text-zinc-200 text-xl sm:text-2xl">
              {size.name}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">{size.name}</h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Sort Order: <span className="font-mono font-medium text-zinc-300">#{size.sortOrder}</span> &bull; ID: #{size.id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                <Tag size={15} className="text-zinc-400" />
                <span>Size Label</span>
              </div>
              <p className="mt-1.5 text-base sm:text-lg font-bold text-zinc-100">{size.name}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                <ArrowUpDown size={15} className="text-zinc-400" />
                <span>Display Order</span>
              </div>
              <p className="mt-1.5 font-mono text-base sm:text-lg font-bold text-zinc-100">#{size.sortOrder}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                <Calendar size={15} className="text-zinc-400" />
                <span>Identifier</span>
              </div>
              <p className="mt-1.5 font-mono text-base sm:text-lg font-bold text-zinc-100">#{size.id}</p>
            </div>
          </div>
        </section>

        {/* Configuration Information Card */}
        <section className="rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
          <div className="mb-4 sm:mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
              <Ruler size={18} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-100">Catalog Configuration</h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                How this size behaves in product selections and customer storefront views.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-xl sm:rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Sorting Position
              </span>
              <p className="mt-2 text-base sm:text-lg font-semibold text-zinc-100">
                Position #{size.sortOrder}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Determines the order in which sizes are shown to customers on product detail pages.
              </p>
            </div>

            <div className="rounded-xl sm:rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Visibility State
              </span>
              <p className="mt-2 text-base sm:text-lg font-semibold text-zinc-100">
                {isActive ? "Available in Product Variant Forms" : "Hidden from Product Variant Forms"}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
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
