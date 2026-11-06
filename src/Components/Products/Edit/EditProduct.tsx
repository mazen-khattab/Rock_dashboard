import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bold,
  Boxes,
  FileText,
  FolderTree,
  Globe,
  ImagePlus,
  Italic,
  Layers,
  List,
  ListOrdered,
  Package,
  Palette,
  Pilcrow,
  Plus,
  Ruler,
  Save,
  Sparkles,
  Tag,
  Trash2,
  Type,
} from "lucide-react";
import { type CreatedVariantImage, type CreateVariant, type ProductFormData } from "../../../Types/Product";
import { useProduct } from "../../../Context/ProductContext";
import { SeoPricingCard } from "../Shared/SeoPricingCard";
import { useCategory } from "../../../Context/CategoryContext";
import { useSize } from "../../../Context/SizeContext";
import { useColor } from "../../../Context/ColorContext";
import { VariantImageUploader } from "../../Global/Components";
import { prepareProductFormData } from "../../../Helper/PrepareProductFormData";
import { productFormDataSchema } from "../../../Helper/ProductFormDataSchema";
import { toast } from "react-toastify";
import { DeleteModal } from "../../Global/Components/DeleteModal";

const generateUniqueId = (): number =>
  Math.floor(Date.now() / Math.max(1, Math.floor(Math.random() * 100000)));

const createEmptyVariantImage = (): CreatedVariantImage => ({
  id: generateUniqueId(),
  file: null,
  imageUrl: "",
  sortOrder: 0,
});

const createEmptyVariant = (): CreateVariant => ({
  id: generateUniqueId(),
  sizeId: 0,
  colorId: 0,
  quantity: 0,
  images: [createEmptyVariantImage()],
});

const toolbarButtons = [
  { label: "Bold", icon: Bold, command: "bold" },
  { label: "Italic", icon: Italic, command: "italic" },
  { label: "Paragraph", icon: Pilcrow, command: "formatBlock", value: "p" },
  { label: "Heading", icon: Type, command: "formatBlock", value: "h3" },
  { label: "Bullets", icon: List, command: "insertUnorderedList" },
  { label: "Numbered", icon: ListOrdered, command: "insertOrderedList" },
];

type SeoLocale = "en" | "ar";
type SeoField = "slug" | "metaTitle" | "metaDescription";

const buildInitialFormData = (product: ProductFormData): ProductFormData => {
  return {
    ...product,
    variants: (product.variants || []).map((variant) => ({
      ...variant,
      images: (variant.images || []).map((image) => ({
        ...image,
        file: null,
      })),
    })),
  };
};

export const EditProduct = () => {
  const navigate = useNavigate();
  const { categoryLookup, getCategoryLookup } = useCategory();
  const { sizeLookup, getSizeLookup } = useSize();
  const { colorLookup, getColorLookup } = useColor();

  const { productId } = useParams();
  const { getProductById, selectedProduct, updateProduct, loading, error, deleteProdeuct } = useProduct();
  const [formData, setFormData] = useState<ProductFormData | null>(null);
  const [isFetchAttempted, setIsFetchAttempted] = useState(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Text editor refs
  const editorRefAR = useRef<HTMLDivElement>(null);
  const editorRefEn = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        await getProductById(Number(productId));
      } catch (err) {
        console.error("Error fetching product by ID:", err);
      } finally {
        setIsFetchAttempted(true);
      }
    };

    void fetchProduct();
  }, [productId, getProductById]);

  useEffect(() => {
    void getCategoryLookup().catch(() => {});
    void getSizeLookup().catch(() => {});
    void getColorLookup().catch(() => {});
  }, [getCategoryLookup, getSizeLookup, getColorLookup]);

  useEffect(() => {
    if (!selectedProduct) return;

    setFormData(buildInitialFormData(selectedProduct));

    if (editorRefEn.current) {
      editorRefEn.current.innerHTML = selectedProduct.descriptionEn || "";
    }
    if (editorRefAR.current) {
      editorRefAR.current.innerHTML = selectedProduct.descriptionAr || "";
    }
  }, [selectedProduct]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    let finalValue: string | number = value;

    if (name === "categoryId" || name === "price") {
      finalValue = Number(value);
    }

    setFormData((current) => (current ? { ...current, [name]: finalValue } : null));
  };

  const handleSeoFieldChange = (locale: SeoLocale, field: SeoField, value: string) => {
    const fieldMap = {
      en: {
        slug: "slugEn",
        metaTitle: "metaTitleEn",
        metaDescription: "metaDescriptionEn",
      },
      ar: {
        slug: "slugAr",
        metaTitle: "metaTitleAr",
        metaDescription: "metaDescriptionAr",
      },
    } as const;

    const localizedField = fieldMap[locale][field];

    setFormData((current) => (current ? { ...current, [localizedField]: value } : null));
  };

  const applyEditorCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    setFormData((current) =>
      current
        ? {
            ...current,
            descriptionAr: editorRefAR.current?.innerHTML ?? "",
            descriptionEn: editorRefEn.current?.innerHTML ?? "",
          }
        : null,
    );
  };

  const handleDescriptionChange = () => {
    setFormData((current) =>
      current
        ? {
            ...current,
            descriptionAr: editorRefAR.current?.innerHTML ?? "",
            descriptionEn: editorRefEn.current?.innerHTML ?? "",
          }
        : null,
    );
  };

  const handleVariantChange = (
    variantId: number,
    key: keyof Omit<CreateVariant, "id" | "images">,
    value: string | number,
  ) => {
    if (key === "sizeId" || key === "colorId" || key === "quantity") {
      value = Number(value);
    }

    setFormData((current) => {
      if (!current) return null;
      return {
        ...current,
        variants: current.variants.map((variant) =>
          variant.id === variantId ? { ...variant, [key]: value } : variant,
        ),
      };
    });
  };

  const handleAddVariant = () => {
    setFormData((current) => {
      if (!current) return null;
      return {
        ...current,
        variants: [...current.variants, createEmptyVariant()],
      };
    });
  };

  const handleRemoveVariant = (variantId: number) => {
    setFormData((current) => {
      if (!current) return null;
      return {
        ...current,
        variants:
          current.variants.length === 1
            ? [createEmptyVariant()]
            : current.variants.filter((variant) => variant.id !== variantId),
      };
    });
  };

  const handleAddVariantImage = (variantId: number) => {
    setFormData((current) => {
      if (!current) return null;
      return {
        ...current,
        variants: current.variants.map((variant) =>
          variant.id === variantId
            ? { ...variant, images: [...variant.images, createEmptyVariantImage()] }
            : variant,
        ),
      };
    });
  };

  const handleRemoveVariantImage = (variantId: number, imageId: number) => {
    setFormData((current) => {
      if (!current) return null;
      return {
        ...current,
        variants: current.variants.map((variant) => {
          if (variant.id !== variantId) {
            return variant;
          }

          return {
            ...variant,
            images:
              variant.images.length === 1
                ? [createEmptyVariantImage()]
                : variant.images.filter((image) => image.id !== imageId),
          };
        }),
      };
    });
  };

  const handleVariantImageFileChange = (variantId: number, imageId: number, file: File | null) => {
    setFormData((current) => {
      if (!current) return null;
      return {
        ...current,
        variants: current.variants.map((variant) => {
          if (variant.id !== variantId) {
            return variant;
          }

          return {
            ...variant,
            images: variant.images.map((image) =>
              image.id === imageId ? { ...image, file } : image,
            ),
          };
        }),
      };
    });
  };

  const handleVariantImageFieldsChange = (
    variantId: number,
    imageId: number,
    field: keyof CreatedVariantImage,
    value: unknown,
  ) => {
    let finalValue = value;
    if (field === "sortOrder") {
      finalValue = Number(value);
    }

    setFormData((current) => {
      if (!current) return null;
      return {
        ...current,
        variants: current.variants.map((variant) =>
          variant.id === variantId
            ? {
                ...variant,
                images: variant.images.map((img) =>
                  img.id === imageId ? { ...img, [field]: finalValue } : img,
                ),
              }
            : variant,
        ),
      };
    });
  };

  const handleToggleStatus = () => {
    setFormData((prev) => (prev ? { ...prev, isActive: !prev.isActive } : null));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData || !productId) return;

    const result = productFormDataSchema.safeParse(formData);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      return;
    }

    const data = prepareProductFormData(formData);

    try {
      await updateProduct(Number(productId), data);
      toast.success("Product updated successfully!");
      navigate(`/admin/products/show/${productId}`);
    } catch (submitError) {
      console.error("Failed to update product:", submitError);
    }
  };

  const handleDeleting = async () => {
    if (!productId) return;
    try {
      await deleteProdeuct(Number(productId));
      toast.success("Product deleted successfully!");
      setDeleting(false);
      navigate("/admin/products");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product.");
    }
  };

  if (!isFetchAttempted && !selectedProduct) {
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

  if (error && !selectedProduct) {
    return (
      <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
        <div className="rounded-2xl sm:rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-10 text-center shadow-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">Failed to load product</h1>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400">{error}</p>
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

  if (isFetchAttempted && !selectedProduct) {
    return <Navigate to="/admin/products" replace />;
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
        <div className="rounded-2xl sm:rounded-3xl bg-zinc-950 p-8 sm:p-12 text-center text-zinc-300 shadow-2xl border border-zinc-800">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-zinc-400" />
            <p className="text-sm text-zinc-400">Preparing form...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalVariantImages = formData.variants.reduce((total, variant) => total + variant.images.length, 0);
  const totalStockQuantity = formData.variants.reduce((total, variant) => total + Number(variant.quantity || 0), 0);
  const selectedCategory = categoryLookup.find((c) => c.id === formData.categoryId);

  return (
    <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
      <div className="w-full rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-4 sm:pb-6">
          <div className="space-y-1.5 sm:space-y-2">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
            >
              <ArrowLeft size={15} />
              Back to products
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-100">Edit Product</h1>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                Updating <span className="font-semibold text-zinc-200">{formData.nameEn || formData.nameAr || "Product"}</span> — manage details, variants, and catalog visibility.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setDeleting(true)}
              disabled={loading}
              className="inline-flex flex-1 sm:flex-none cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-zinc-400 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>

            <button
              type="submit"
              form="edit-product-form"
              disabled={loading}
              className="inline-flex flex-1 sm:flex-none cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm px-5 py-2.5 sm:py-3 text-xs sm:text-sm transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={16} />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>

        {deleting && (
          <DeleteModal
            type="product"
            name={formData.nameEn || formData.nameAr}
            canselFunction={() => setDeleting(false)}
            handleDeleteProduct={handleDeleting}
            isDeleting={loading}
          />
        )}

        {/* Form Grid */}
        <form
          id="edit-product-form"
          onSubmit={handleSubmit}
          className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] min-w-0"
        >
          {/* Left Column: Form Fields & Variants */}
          <div className="space-y-5 sm:space-y-6 min-w-0">
            {/* Product Details Section */}
            <section className="space-y-4 sm:space-y-6 rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm min-w-0">
              <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-3 sm:pb-4">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 shrink-0">
                  <Package size={20} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-zinc-100">Product Details</h2>
                  <p className="text-xs text-zinc-400">
                    Basic naming, category classification, and base pricing.
                  </p>
                </div>
              </div>

              {/* Name, category, price */}
              <div className="grid gap-3.5 sm:gap-5 grid-cols-1 sm:grid-cols-2">
                {/* Arabic Name */}
                <label className="block space-y-1.5 sm:space-y-2">
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-300">
                    <Globe size={15} className="text-zinc-400" />
                    Name in Arabic <span className="text-rose-400">*</span>
                  </span>
                  <input
                    type="text"
                    name="nameAr"
                    dir="rtl"
                    value={formData.nameAr}
                    onChange={handleInputChange}
                    placeholder="مثال: تي شيرت كلاسيك قطن"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-zinc-500 focus:bg-zinc-900/90 focus:ring-2 focus:ring-zinc-600/20 font-['Cairo']"
                  />
                </label>

                {/* English Name */}
                <label className="block space-y-1.5 sm:space-y-2">
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-300">
                    <Globe size={15} className="text-zinc-400" />
                    Name in English <span className="text-rose-400">*</span>
                  </span>
                  <input
                    type="text"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleInputChange}
                    placeholder="e.g. Classic Cotton T-Shirt"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-zinc-500 focus:bg-zinc-900/90 focus:ring-2 focus:ring-zinc-600/20"
                  />
                </label>

                {/* Category */}
                <label className="block space-y-1.5 sm:space-y-2">
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-300">
                    <FolderTree size={15} className="text-zinc-400" />
                    Category <span className="text-rose-400">*</span>
                  </span>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-200 outline-none transition focus:border-zinc-500 focus:bg-zinc-900/90 focus:ring-2 focus:ring-zinc-600/20"
                  >
                    <option value={0}>Select category</option>
                    {categoryLookup.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Price */}
                <label className="block space-y-1.5 sm:space-y-2">
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-300">
                    <Tag size={15} className="text-zinc-400" />
                    Base Price <span className="text-rose-400">*</span>
                  </span>
                  <div className="flex w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 transition-all duration-200 focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-zinc-600/20">
                    <span className="flex items-center border-r border-zinc-800 bg-zinc-900 px-3 sm:px-4 text-xs font-semibold text-zinc-400 shrink-0">
                      EGP
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="1"
                      required
                      className="w-full bg-transparent px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
                    />
                  </div>
                </label>
              </div>

              {/* Descriptions */}
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                {/* Description in English */}
                <div className="space-y-1.5 sm:space-y-2 min-w-0">
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-300">
                    <FileText size={15} className="text-zinc-400" />
                    Description in English
                  </span>

                  <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-inner">
                    <div className="flex flex-wrap gap-1 border-b border-zinc-800 bg-zinc-900/90 px-2 sm:px-3 py-1.5 sm:py-2">
                      {toolbarButtons.map((button) => {
                        const Icon = button.icon;
                        return (
                          <button
                            key={button.label}
                            type="button"
                            onClick={() => applyEditorCommand(button.command, button.value)}
                            className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 transition hover:border-zinc-600 hover:bg-zinc-850 hover:text-zinc-200 cursor-pointer"
                            aria-label={button.label}
                            title={button.label}
                          >
                            <Icon size={14} />
                          </button>
                        );
                      })}
                    </div>

                    <div
                      ref={editorRefEn}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={handleDescriptionChange}
                      className="min-h-36 sm:min-h-48 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm leading-6 text-zinc-200 outline-none empty:before:pointer-events-none empty:before:text-zinc-600 empty:before:content-[attr(data-placeholder)] [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-2 [&_ul]:list-disc break-words"
                      data-placeholder="Write an English product description..."
                    />
                  </div>
                </div>

                {/* Description in Arabic */}
                <div className="space-y-1.5 sm:space-y-2 min-w-0" dir="rtl">
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-300">
                    <FileText size={15} className="text-zinc-400" />
                    الوصف باللغة العربية
                  </span>

                  <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-inner" dir="ltr">
                    <div className="flex flex-wrap gap-1 border-b border-zinc-800 bg-zinc-900/90 px-2 sm:px-3 py-1.5 sm:py-2">
                      {toolbarButtons.map((button) => {
                        const Icon = button.icon;
                        return (
                          <button
                            key={button.label}
                            type="button"
                            onClick={() => applyEditorCommand(button.command, button.value)}
                            className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 transition hover:border-zinc-600 hover:bg-zinc-850 hover:text-zinc-200 cursor-pointer"
                            aria-label={button.label}
                            title={button.label}
                          >
                            <Icon size={14} />
                          </button>
                        );
                      })}
                    </div>

                    <div
                      ref={editorRefAR}
                      contentEditable
                      suppressContentEditableWarning
                      dir="rtl"
                      onInput={handleDescriptionChange}
                      className="min-h-36 sm:min-h-48 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm leading-6 text-zinc-200 outline-none empty:before:pointer-events-none empty:before:text-zinc-600 empty:before:content-[attr(data-placeholder)] [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_li]:mr-5 [&_ol]:list-decimal [&_p]:mb-2 [&_ul]:list-disc break-words font-['Cairo']"
                      data-placeholder="اكتب وصف المنتج باللغة العربية..."
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Product Variants Section */}
            <section className="space-y-4 sm:space-y-5 rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-3.5 sm:p-6 backdrop-blur-sm shadow-xl min-w-0">
              <div className="flex flex-col gap-3 border-b border-zinc-800/80 pb-3 sm:pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 shrink-0">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-zinc-100">Product Variants</h2>
                    <p className="text-xs text-zinc-400">
                      Configure size, color, stock quantities, and variant images.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800 hover:text-white w-full sm:w-auto"
                >
                  <Plus size={16} />
                  <span>Add Variant</span>
                </button>
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                {formData.variants.map((variant, variantIndex) => (
                  <div
                    key={variant.id}
                    className="space-y-3 sm:space-y-4 rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 sm:p-5 transition hover:border-zinc-700 min-w-0"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 sm:pb-4 gap-2">
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                        <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 font-mono text-xs font-bold text-zinc-300 shrink-0">
                          {variantIndex + 1}
                        </span>
                        <h3 className="text-xs sm:text-base font-semibold text-zinc-200 truncate">
                          Variant #{variantIndex + 1}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(variant.id)}
                        className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-zinc-400 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 shrink-0"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
                      {/* Size */}
                      <label className="block space-y-1.5">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                          <Ruler size={13} className="text-zinc-400" />
                          Size
                        </span>
                        <select
                          value={variant.sizeId}
                          onChange={(event) =>
                            handleVariantChange(variant.id, "sizeId", event.target.value)
                          }
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-zinc-200 outline-none transition focus:border-zinc-500 focus:bg-zinc-850"
                        >
                          <option value={0}>Select size</option>
                          {sizeLookup.map((size) => (
                            <option key={size.id} value={size.id}>
                              {size.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      {/* Color */}
                      <label className="block space-y-1.5">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                          <Palette size={13} className="text-zinc-400" />
                          Color
                        </span>
                        <select
                          value={variant.colorId}
                          onChange={(event) =>
                            handleVariantChange(variant.id, "colorId", event.target.value)
                          }
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-zinc-200 outline-none transition focus:border-zinc-500 focus:bg-zinc-850"
                        >
                          <option value={0}>Select color</option>
                          {colorLookup.map((color) => (
                            <option key={color.id} value={color.id}>
                              {color.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      {/* Quantity */}
                      <label className="block space-y-1.5">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                          <Boxes size={13} className="text-zinc-400" />
                          Stock Quantity
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={variant.quantity}
                          onChange={(event) =>
                            handleVariantChange(variant.id, "quantity", event.target.value)
                          }
                          placeholder="0"
                          className="w-full min-w-0 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-mono text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-zinc-500 focus:bg-zinc-850"
                        />
                      </label>
                    </div>

                    {/* Variant Images Card */}
                    <div className="space-y-3 sm:space-y-4 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-3 sm:p-4 min-w-0">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-zinc-200">Variant Images</h4>
                          <p className="text-[11px] sm:text-xs text-zinc-400">
                            Each image row stores one file and its sort order.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddVariantImage(variant.id)}
                          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-850 hover:text-zinc-100 w-full sm:w-auto"
                        >
                          <ImagePlus size={14} />
                          Add Image
                        </button>
                      </div>

                      <div className="space-y-3">
                        {variant.images.map((image, imageIndex) => (
                          <div
                            key={image.id}
                            className="grid gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3 grid-cols-1 sm:grid-cols-[1.3fr_1fr_auto] items-start min-w-0"
                          >
                            <div className="min-w-0 w-full">
                              <VariantImageUploader
                                image={image}
                                imageIndex={imageIndex}
                                variantId={variant.id}
                                imageUrl={image.imageUrl}
                                onFileSelect={handleVariantImageFileChange}
                              />
                            </div>

                            <div className="flex items-end gap-2.5 sm:contents">
                              <label className="block space-y-1.5 flex-1 min-w-0">
                                <span className="text-xs font-medium text-zinc-400">Sort Priority</span>
                                <input
                                  name="sortOrder"
                                  type="number"
                                  min={0}
                                  step={1}
                                  value={image.sortOrder}
                                  onChange={(event) =>
                                    handleVariantImageFieldsChange(
                                      variant.id,
                                      image.id,
                                      event.target.name as keyof CreatedVariantImage,
                                      event.target.value,
                                    )
                                  }
                                  placeholder="0"
                                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-xs font-mono text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                                />
                              </label>

                              <button
                                type="button"
                                onClick={() => handleRemoveVariantImage(variant.id, image.id)}
                                className="inline-flex h-9 sm:h-10 w-9 sm:w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-rose-900/40 bg-zinc-900 text-rose-400 transition hover:bg-zinc-850 hover:text-rose-300"
                                aria-label={`Delete image ${imageIndex + 1}`}
                                title="Remove Image"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Live Preview, SEO, Summary & Visibility */}
          <div className="space-y-5 sm:space-y-6 min-w-0">
            {/* Live Preview Card */}
            <section className="rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm shadow-xl min-w-0">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800 text-xl font-bold text-zinc-200 shrink-0">
                  <Package size={22} className="sm:hidden" />
                  <Package size={24} className="hidden sm:block" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-100">Live Preview</h3>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    Preview how this product card and badge appears in catalog.
                  </p>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 space-y-4 rounded-xl sm:rounded-2xl border border-zinc-800 bg-zinc-950/80 p-3.5 sm:p-5 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="inline-block rounded-md bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs font-semibold text-amber-300 uppercase tracking-wide">
                      {selectedCategory ? selectedCategory.name : "Uncategorized"}
                    </span>
                    <h4 className="mt-2 text-base font-bold text-zinc-100 break-words">
                      {formData.nameEn || formData.nameAr || "Untitled Product"}
                    </h4>
                    {formData.nameAr && (
                      <p className="mt-0.5 text-xs text-zinc-400 break-words" dir="rtl">
                        {formData.nameAr}
                      </p>
                    )}
                  </div>
                  <span
                    className={`inline-flex self-start sm:self-auto items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium shrink-0 ${
                      formData.isActive
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-zinc-700 bg-zinc-850 text-zinc-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        formData.isActive ? "bg-emerald-400" : "bg-zinc-400"
                      }`}
                    />
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex items-baseline justify-between border-t border-zinc-800/80 pt-3">
                  <span className="text-xs text-zinc-400">Base Price</span>
                  <div className="font-mono text-lg sm:text-xl font-bold text-zinc-100">
                    {Number(formData.price || 0).toLocaleString()}{" "}
                    <span className="text-xs font-semibold text-zinc-400">EGP</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Layers size={13} className="text-zinc-400" />
                    {formData.variants.length} variant{formData.variants.length !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Boxes size={13} className="text-zinc-400" />
                    {totalStockQuantity} total units
                  </span>
                </div>
              </div>
            </section>

            {/* SEO and Pricing Component */}
            <SeoPricingCard values={formData} onSeoChange={handleSeoFieldChange} />

            {/* Variant Summary Card */}
            <section className="rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm shadow-xl min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 shrink-0">
                  <Layers size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-zinc-100">Variant Summary</h2>
                  <p className="text-xs text-zinc-400">
                    Configured variant matrix and inventory count.
                  </p>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2.5 sm:gap-4 min-w-0">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 sm:p-4 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 truncate">
                    <Layers size={14} className="text-zinc-400 shrink-0" />
                    <span className="truncate">Total Variants</span>
                  </div>
                  <div className="mt-1.5 sm:mt-2 font-mono text-xl sm:text-2xl font-bold text-zinc-100">
                    {formData.variants.length}
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 sm:p-4 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 truncate">
                    <ImagePlus size={14} className="text-zinc-400 shrink-0" />
                    <span className="truncate">Image Rows</span>
                  </div>
                  <div className="mt-1.5 sm:mt-2 font-mono text-xl sm:text-2xl font-bold text-zinc-100">
                    {totalVariantImages}
                  </div>
                </div>
              </div>
            </section>

            {/* Visibility Settings Card */}
            <section className="rounded-xl sm:rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-4 sm:p-6 text-zinc-200 shadow-xl min-w-0">
              <div className="flex items-start justify-between gap-3 sm:gap-4 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-zinc-400 shrink-0" />
                    <h3 className="text-base sm:text-lg font-bold text-zinc-100">Visibility</h3>
                  </div>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-relaxed text-zinc-400">
                    Toggle whether this product is active and visible to customers in your storefront.
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
                  title="Toggle product visibility"
                >
                  <span
                    className={`h-6 w-6 rounded-full shadow-md transition ${
                      formData.isActive ? "translate-x-6 bg-white" : "translate-x-0 bg-zinc-400"
                    }`}
                  />
                </button>
              </div>

              <div
                className={`mt-4 sm:mt-6 rounded-xl border p-3.5 sm:p-4 min-w-0 transition ${
                  formData.isActive
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-zinc-800 bg-zinc-950/80"
                }`}
              >
                <div className="text-[11px] sm:text-xs uppercase tracking-wider text-zinc-400">Current status</div>
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

export default EditProduct;
