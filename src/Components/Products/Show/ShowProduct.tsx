import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Boxes,
  DollarSign,
  Edit,
  FileText,
  FolderTree,
  Globe,
  Layers,
  Package,
  Palette,
  Ruler,
  Sparkles,
  Tag,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../../../Context/ProductContext";
import { useCategory } from "../../../Context/CategoryContext";
import { useSize } from "../../../Context/SizeContext";
import { useColor } from "../../../Context/ColorContext";
import type { ProductFormData } from "../../../Types/Product";
import { DeleteModal } from "../../Global/Components/DeleteModal";
import { toast } from "react-toastify";

export const ShowProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getProductById, deleteProdeuct } = useProduct();
  const { categoryLookup, getCategoryLookup } = useCategory();
  const { sizeLookup, getSizeLookup } = useSize();
  const { colorLookup, getColorLookup } = useColor();

  const [product, setProduct] = useState<ProductFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    void getCategoryLookup().catch(() => {});
    void getSizeLookup().catch(() => {});
    void getColorLookup().catch(() => {});
  }, [getCategoryLookup, getSizeLookup, getColorLookup]);

  useEffect(() => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    getProductById(Number(productId))
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Failed to load product details.";
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId, getProductById]);

  const handleDelete = async () => {
    if (!productId) return;
    setIsDeleting(true);

    try {
      await deleteProdeuct(Number(productId));
      toast.success("Product deleted successfully!");
      setShowDeleteModal(false);
      navigate("/admin/products");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete product.";
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
            <p className="text-sm text-zinc-400">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
        <div className="rounded-2xl sm:rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-10 text-center shadow-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">Product not found</h1>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400">
            {error ?? "The product you are looking for does not exist or could not be loaded."}
          </p>
          <Link
            to="/admin/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-200 transition hover:bg-zinc-750"
          >
            <ArrowLeft size={16} />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>
    );
  }

  const category = categoryLookup.find((c) => c.id === product.categoryId);
  const isActive = product.isActive ?? true;
  const variants = product.variants || [];
  const totalQuantity = variants.reduce((acc, v) => acc + Number(v.quantity || 0), 0);
  const totalImages = variants.reduce((acc, v) => acc + (v.images?.length || 0), 0);

  return (
    <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
      <div className="w-full rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
        {/* Top Header */}
        <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-4 sm:pb-6">
          <div className="space-y-1.5 sm:space-y-2">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
            >
              <ArrowLeft size={15} />
              Back to products
            </Link>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-100">
                {product.nameEn || product.nameAr || "Product Details"}
              </h1>
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
            {product.nameAr && product.nameEn && (
              <p className="text-xs sm:text-sm font-medium text-zinc-400" dir="rtl">
                {product.nameAr}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              to={`/admin/products/edit/${productId}`}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800 hover:text-white"
            >
              <Edit size={15} />
              <span>Edit Product</span>
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

        {/* Content Grid */}
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] min-w-0">
          {/* Left Column */}
          <div className="space-y-6 min-w-0">
            {/* Overview Card */}
            <section className="space-y-5 sm:space-y-6 rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm min-w-0">
              <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
                  <Package size={20} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-zinc-100">Overview</h2>
                  <p className="text-xs text-zinc-400">
                    Product naming, category, and base pricing details.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <FolderTree size={14} className="text-zinc-400" />
                    Category
                  </div>
                  <p className="mt-2 text-base font-bold text-zinc-100">
                    {category ? category.name : "Uncategorized"}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <DollarSign size={14} className="text-zinc-400" />
                    Base Price
                  </div>
                  <p className="mt-2 font-mono text-base font-semibold text-zinc-100">
                    {Number(product.price || 0).toLocaleString()} <span className="text-xs font-semibold text-zinc-400">EGP</span>
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Tag size={14} className="text-zinc-400" />
                    Product ID
                  </div>
                  <p className="mt-2 font-mono text-base font-bold text-zinc-100">
                    #{productId}
                  </p>
                </div>
              </div>
            </section>

            {/* Descriptions Card */}
            <section className="space-y-6 rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm min-w-0">
              <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-100">Descriptions</h2>
                  <p className="text-xs text-zinc-400">
                    Customer-facing product content in both supported languages.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-zinc-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      English Description
                    </span>
                  </div>
                  <div
                    className="min-h-32 rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 text-sm leading-6 text-zinc-200 [&_h3]:mb-2 [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-2 [&_ul]:list-disc"
                    dangerouslySetInnerHTML={{
                      __html: product.descriptionEn || "<p class='text-zinc-500 italic'>No English description provided.</p>",
                    }}
                  />
                </div>

                <div className="space-y-2" dir="rtl">
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-zinc-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      الوصف باللغة العربية
                    </span>
                  </div>
                  <div
                    className="min-h-32 rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 text-sm leading-6 text-zinc-200 [&_h3]:mb-2 [&_h3]:font-semibold [&_li]:mr-5 [&_ol]:list-decimal [&_p]:mb-2 [&_ul]:list-disc font-['Cairo']"
                    dangerouslySetInnerHTML={{
                      __html: product.descriptionAr || "<p class='text-zinc-500 italic'>لم يتم إضافة وصف باللغة العربية.</p>",
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Product Variants Section */}
            <section className="space-y-5 rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm shadow-xl min-w-0">
              <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
                  <Layers size={20} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-zinc-100">Configured Variants</h2>
                  <p className="text-xs text-zinc-400">
                    Matrix of size, color, stock quantities, and associated imagery.
                  </p>
                </div>
              </div>

              {variants.length === 0 ? (
                <p className="py-6 text-center text-xs sm:text-sm text-zinc-500 italic">
                  No variants configured for this product.
                </p>
              ) : (
                <div className="space-y-4">
                  {variants.map((variant, idx) => {
                    const size = sizeLookup.find((s) => s.id === variant.sizeId);
                    const color = colorLookup.find((c) => c.id === variant.colorId);

                    return (
                      <div
                        key={variant.id || idx}
                        className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3.5 sm:p-5 space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 font-mono text-xs font-bold text-zinc-300">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-sm sm:text-base text-zinc-200">Variant #{idx + 1}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-zinc-400">Stock:</span>
                            <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-300">
                              {variant.quantity} units
                            </span>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300">
                              <Ruler size={16} />
                            </div>
                            <div>
                              <div className="text-xs text-zinc-500">Size</div>
                              <div className="font-semibold text-xs sm:text-sm text-zinc-200">
                                {size ? size.name : variant.sizeId ? `Size #${variant.sizeId}` : "None"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300">
                              <Palette size={16} />
                            </div>
                            <div>
                              <div className="text-xs text-zinc-500">Color</div>
                              <div className="font-semibold text-xs sm:text-sm text-zinc-200">
                                {color ? color.name : variant.colorId ? `Color #${variant.colorId}` : "None"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {variant.images && variant.images.length > 0 && (
                          <div className="space-y-2 pt-1">
                            <span className="text-xs font-medium text-zinc-400">Variant Images</span>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                              {variant.images.map((img, imgIdx) => (
                                <div
                                  key={img.id || imgIdx}
                                  className="group relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-xs"
                                >
                                  {img.imageUrl ? (
                                    <img
                                      src={img.imageUrl}
                                      alt={`Variant ${idx + 1} - Image ${imgIdx + 1}`}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-zinc-500 text-xs">
                                      No Image
                                    </div>
                                  )}
                                  <span className="absolute bottom-1 right-1 rounded-sm bg-black/80 px-1 font-mono text-[10px] text-zinc-200 border border-zinc-700/60">
                                    #{img.sortOrder}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6 min-w-0">
            {/* Visibility Gradient Card */}
            <section className="rounded-xl sm:rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-4 sm:p-6 text-zinc-200 shadow-xl min-w-0">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-amber-400" />
                <h3 className="text-base sm:text-lg font-bold text-zinc-100">Catalog Visibility</h3>
              </div>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-400">
                {isActive
                  ? "This product is published and active for customers in the catalog."
                  : "This product is currently inactive / hidden from customers."}
              </p>

              <div
                className={`mt-4 sm:mt-6 rounded-xl border p-3.5 sm:p-4 transition ${
                  isActive ? "border-emerald-500/30 bg-emerald-500/10" : "border-zinc-800 bg-zinc-950/80"
                }`}
              >
                <div className="text-xs uppercase tracking-wider text-zinc-400">Current Status</div>
                <div
                  className={`mt-1 flex items-center gap-2 text-xl sm:text-2xl font-bold ${
                    isActive ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full ${
                      isActive ? "bg-emerald-400" : "bg-zinc-400"
                    }`}
                  />
                  {isActive ? "Active" : "Inactive"}
                </div>
              </div>
            </section>

            {/* Inventory & Variant Stats */}
            <section className="rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm shadow-xl min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
                  <Boxes size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-100">Inventory Summary</h3>
                  <p className="text-xs text-zinc-400">Totals calculated across all variants.</p>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 sm:p-4">
                  <div className="text-xs text-zinc-400">Variants</div>
                  <div className="mt-1.5 font-mono text-xl sm:text-2xl font-bold text-zinc-100">
                    {variants.length}
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 sm:p-4">
                  <div className="text-xs text-zinc-400">Total Units</div>
                  <div className="mt-1.5 font-mono text-xl sm:text-2xl font-bold text-zinc-100">
                    {totalQuantity}
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 sm:p-4">
                  <div className="text-xs text-zinc-400">Images</div>
                  <div className="mt-1.5 font-mono text-xl sm:text-2xl font-bold text-zinc-100">
                    {totalImages}
                  </div>
                </div>
              </div>
            </section>

            {/* SEO and Metadata Card */}
            <section className="rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm shadow-xl space-y-4 min-w-0">
              <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">SEO & Metadata</h3>
                  <p className="text-xs text-zinc-400">Configured search engine tags and slugs.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    English URL Slug
                  </div>
                  <div className="font-mono text-sm text-zinc-200">
                    {product.slugEn || "—"}
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 space-y-1" dir="rtl">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    الرابط بالعربية (Slug)
                  </div>
                  <div className="font-mono text-sm text-zinc-200">
                    {product.slugAr || "—"}
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Meta Title (EN)
                  </div>
                  <div className="text-sm text-zinc-200">
                    {product.metaTitleEn || "—"}
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Meta Description (EN)
                  </div>
                  <div className="text-sm text-zinc-200">
                    {product.metaDescriptionEn || "—"}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal
          type="product"
          name={product.nameEn || product.nameAr}
          canselFunction={() => setShowDeleteModal(false)}
          handleDeleteProduct={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};
