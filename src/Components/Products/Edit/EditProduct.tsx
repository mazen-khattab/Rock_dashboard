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
        console.error("Error fetching product details:", err);
      } finally {
        setIsFetchAttempted(true);
      }
    };

    fetchProduct();
  }, [productId, getProductById]);

  useEffect(() => {
    void getCategoryLookup().catch(() => {
      console.error("Error fetching categories. Check CategoryContext for details.");
    });
    void getSizeLookup().catch(() => {
      console.error("Error fetching sizes. Check SizeContext for details.");
    });
    void getColorLookup().catch(() => {
      console.error("Error fetching colors. Check ColorContext for details.");
    });
  }, [getCategoryLookup, getSizeLookup, getColorLookup]);

  useEffect(() => {
    if (!selectedProduct) return;

    const nextFormData = buildInitialFormData(selectedProduct);
    setFormData(nextFormData);
  }, [selectedProduct]);

  useEffect(() => {
    if (!formData) return;

    if (editorRefAR.current && editorRefAR.current.innerHTML !== (formData.descriptionAr ?? "")) {
      editorRefAR.current.innerHTML = formData.descriptionAr ?? "";
    }

    if (editorRefEn.current && editorRefEn.current.innerHTML !== (formData.descriptionEn ?? "")) {
      editorRefEn.current.innerHTML = formData.descriptionEn ?? "";
    }
  }, [formData]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    let finalValue: string | number = value;

    if (name === "categoryId" || name === "price") {
      finalValue = Number(value);
    }

    setFormData((current) =>
      current
        ? {
            ...current,
            [name]: finalValue,
          }
        : current,
    );
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

    const legacyFieldMap = {
      slug: "slug",
      metaTitle: "metaTitle",
      metaDescription: "metaDescription",
    } as const;

    const localizedField = fieldMap[locale][field];

    setFormData((current) =>
      current
        ? {
            ...current,
            [localizedField]: value,
            ...(locale === "en" ? { [legacyFieldMap[field]]: value } : {}),
          }
        : current,
    );
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
        : current,
    );
  };

  const handleDescriptionChange = () => {
    setFormData((current) =>
      current
        ? {
            ...current,
            descriptionEn: editorRefEn.current?.innerHTML ?? "",
            descriptionAr: editorRefAR.current?.innerHTML ?? "",
          }
        : current,
    );
  };

  const handleVariantChange = (
    variantId: number,
    key: keyof Omit<CreateVariant, "id" | "images">,
    value: string | number,
  ) => {
    let finalVal = value;
    if (key === "sizeId" || key === "colorId" || key === "quantity") {
      finalVal = Number(value);
    }

    setFormData((current) =>
      current
        ? {
            ...current,
            variants: current.variants.map((variant) =>
              variant.id === variantId ? { ...variant, [key]: finalVal } : variant,
            ),
          }
        : current,
    );
  };

  const handleAddVariant = () => {
    setFormData((current) =>
      current
        ? {
            ...current,
            variants: [...current.variants, createEmptyVariant()],
          }
        : current,
    );
  };

  const handleRemoveVariant = (variantId: number) => {
    setFormData((current) =>
      current
        ? {
            ...current,
            variants:
              current.variants.length === 1
                ? [createEmptyVariant()]
                : current.variants.filter((variant) => variant.id !== variantId),
          }
        : current,
    );
  };

  const handleAddVariantImage = (variantId: number) => {
    setFormData((current) =>
      current
        ? {
            ...current,
            variants: current.variants.map((variant) =>
              variant.id === variantId
                ? { ...variant, images: [...variant.images, createEmptyVariantImage()] }
                : variant,
            ),
          }
        : current,
    );
  };

  const handleRemoveVariantImage = (variantId: number, imageId: number) => {
    setFormData((current) =>
      current
        ? {
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
          }
        : current,
    );
  };

  const handleVariantImageFileChange = (variantId: number, imageId: number, file: File | null) => {
    setFormData((current) =>
      current
        ? {
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
          }
        : current,
    );
  };

  const handleVariantImageFieldsChange = (
    variantId: number,
    imageId: number,
    field: keyof CreatedVariantImage,
    value: string | number,
  ) => {
    let finalValue = value;
    if (field === "sortOrder") {
      finalValue = Number(value);
    }

    setFormData((current) =>
      current
        ? {
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
          }
        : current,
    );
  };

  const handleToggleStatus = () => {
    setFormData((current) =>
      current
        ? {
            ...current,
            isActive: !current.isActive,
          }
        : current,
    );
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
    } catch (submitError) {
      console.error("Failed to update product:", submitError);
    }
  };

  const handleDeleting = async () => {
    if (!productId) return;

    try {
      await deleteProdeuct(Number(productId));
      setDeleting(false);
      toast.success("Product deleted successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product.");
    }
  };

  if (!isFetchAttempted && !selectedProduct) {
    return (
      <div className="min-h-screen rounded-3xl bg-white p-12 text-center text-slate-800 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
          <p className="text-slate-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error && !selectedProduct) {
    return (
      <div className="min-h-screen rounded-3xl bg-white p-6 text-slate-800 shadow-sm">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Failed to load product</h1>
          <p className="mt-3 text-slate-500">{error}</p>
          <Link
            to="/admin/products"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-(--main-color) px-4 py-2 text-white transition-colors hover:bg-(--hover-color)"
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
      <div className="min-h-screen rounded-3xl bg-white p-12 text-center text-slate-800 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
          <p className="text-slate-500">Preparing form...</p>
        </div>
      </div>
    );
  }

  const totalVariantImages = formData.variants.reduce((total, variant) => total + variant.images.length, 0);
  const totalStockQuantity = formData.variants.reduce((total, variant) => total + Number(variant.quantity || 0), 0);
  const selectedCategory = categoryLookup.find((c) => c.id === formData.categoryId);

  return (
    <div className="min-h-screen p-6 text-slate-800 shadow-sm">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
            >
              <ArrowLeft size={16} />
              Back to products
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">Edit Product</h1>
              <p className="mt-1 text-sm text-slate-500">
                Updating <span className="font-semibold text-slate-800">{formData.nameEn || formData.nameAr || "Product"}</span> — manage details, variants, and catalog visibility.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setDeleting(true)}
              disabled={loading}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>

            <button
              type="submit"
              form="edit-product-form"
              disabled={loading}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-(--main-color) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--hover-color) disabled:cursor-not-allowed disabled:opacity-70"
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
          className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"
        >
          {/* Left Column: Form Fields & Variants */}
          <div className="space-y-6">
            {/* Product Details Section */}
            <section className="space-y-6 rounded-[10px] border border-slate-200 bg-slate-50/70 p-6">
              <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Package size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Product Details</h2>
                  <p className="text-xs text-slate-500">
                    Basic naming, category classification, and base pricing.
                  </p>
                </div>
              </div>

              {/* Name, category, price */}
              <div className="grid gap-5 md:grid-cols-2">
                {/* Arabic Name */}
                <label className="block space-y-2">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Globe size={15} className="text-slate-400" />
                    Name in Arabic <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    name="nameAr"
                    dir="rtl"
                    value={formData.nameAr}
                    onChange={handleInputChange}
                    placeholder="مثال: تي شيرت كلاسيك قطن"
                    className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                </label>

                {/* English Name */}
                <label className="block space-y-2">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Globe size={15} className="text-slate-400" />
                    Name in English <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleInputChange}
                    placeholder="e.g. Classic Cotton T-Shirt"
                    className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                </label>

                {/* Category */}
                <label className="block space-y-2">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <FolderTree size={15} className="text-slate-400" />
                    Category <span className="text-red-500">*</span>
                  </span>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
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
                <label className="block space-y-2">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Tag size={15} className="text-slate-400" />
                    Base Price <span className="text-red-500">*</span>
                  </span>
                  <div className="flex w-full overflow-hidden rounded-[10px] border border-slate-200 bg-slate-50 transition-all duration-200 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-100">
                    <span className="flex items-center border-r border-slate-200 px-4 text-xs font-bold text-slate-500">
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
                      className="w-full bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>
              </div>

              {/* Descriptions */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Description in English */}
                <div className="space-y-2">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <FileText size={15} className="text-slate-400" />
                    Description in English
                  </span>

                  <div className="overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-xs">
                    <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 px-3 py-2">
                      {toolbarButtons.map((button) => {
                        const Icon = button.icon;
                        return (
                          <button
                            key={button.label}
                            type="button"
                            onClick={() => applyEditorCommand(button.command, button.value)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 cursor-pointer"
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
                      className="min-h-48 px-4 py-3 text-sm leading-6 text-slate-700 outline-none empty:before:pointer-events-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)] [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-2 [&_ul]:list-disc"
                      data-placeholder="Write an English product description..."
                    />
                  </div>
                </div>

                {/* Description in Arabic */}
                <div className="space-y-2" dir="rtl">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <FileText size={15} className="text-slate-400" />
                    الوصف باللغة العربية
                  </span>

                  <div className="overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-xs" dir="ltr">
                    <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 px-3 py-2">
                      {toolbarButtons.map((button) => {
                        const Icon = button.icon;
                        return (
                          <button
                            key={button.label}
                            type="button"
                            onClick={() => applyEditorCommand(button.command, button.value)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 cursor-pointer"
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
                      className="min-h-48 px-4 py-3 text-sm leading-6 text-slate-700 outline-none empty:before:pointer-events-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)] [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_li]:mr-5 [&_ol]:list-decimal [&_p]:mb-2 [&_ul]:list-disc"
                      data-placeholder="اكتب وصف المنتج باللغة العربية..."
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Product Variants Section */}
            <section className="space-y-5 rounded-[10px] border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Product Variants</h2>
                    <p className="text-xs text-slate-500">
                      Configure size, color, stock quantities, and variant images.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-(--main-color) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--hover-color)"
                >
                  <Plus size={16} />
                  Add Variant
                </button>
              </div>

              <div className="space-y-4">
                {formData.variants.map((variant, variantIndex) => (
                  <div
                    key={variant.id}
                    className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-slate-300"
                  >
                    <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 font-mono text-xs font-bold text-teal-800">
                          {variantIndex + 1}
                        </span>
                        <h3 className="text-base font-semibold text-slate-900">
                          Variant #{variantIndex + 1}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(variant.id)}
                        className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={14} />
                        Remove Variant
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      {/* Size */}
                      <label className="block space-y-1.5">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          <Ruler size={13} className="text-slate-400" />
                          Size
                        </span>
                        <select
                          value={variant.sizeId}
                          onChange={(event) =>
                            handleVariantChange(variant.id, "sizeId", event.target.value)
                          }
                          className="w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
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
                        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          <Palette size={13} className="text-slate-400" />
                          Color
                        </span>
                        <select
                          value={variant.colorId}
                          onChange={(event) =>
                            handleVariantChange(variant.id, "colorId", event.target.value)
                          }
                          className="w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
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
                        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          <Boxes size={13} className="text-slate-400" />
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
                          className="w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2.5 text-sm font-mono text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                        />
                      </label>
                    </div>

                    {/* Variant Images Card */}
                    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">Variant Images</h4>
                          <p className="text-xs text-slate-500">
                            Each image row stores one file and its sort order.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddVariantImage(variant.id)}
                          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-(--main-color) hover:bg-white hover:text-(--main-color)"
                        >
                          <ImagePlus size={14} />
                          Add Image
                        </button>
                      </div>

                      <div className="space-y-3">
                        {variant.images.map((image, imageIndex) => (
                          <div
                            key={image.id}
                            className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50/70 p-3 md:grid-cols-[1.3fr_1fr_auto]"
                          >
                            <VariantImageUploader
                              image={image}
                              imageIndex={imageIndex}
                              variantId={variant.id}
                              imageUrl={image.imageUrl}
                              onFileSelect={handleVariantImageFileChange}
                            />

                            <label className="block space-y-1.5">
                              <span className="text-xs font-medium text-slate-700">Sort Priority</span>
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
                                className="w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2.5 text-xs font-mono text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                              />
                            </label>

                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => handleRemoveVariantImage(variant.id, image.id)}
                                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                                aria-label={`Delete image ${imageIndex + 1}`}
                                title="Remove Image"
                              >
                                <Trash2 size={16} />
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
          <div className="space-y-6">
            {/* Live Preview Card */}
            <section className="rounded-[10px] border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50 text-xl font-bold text-teal-700">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Live Preview</h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Preview how this product card and badge appears in catalog.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block rounded-md bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800 uppercase tracking-wide">
                      {selectedCategory ? selectedCategory.name : "Uncategorized"}
                    </span>
                    <h4 className="mt-2 text-base font-bold text-slate-900">
                      {formData.nameEn || formData.nameAr || "Untitled Product"}
                    </h4>
                    {formData.nameAr && (
                      <p className="mt-0.5 text-xs text-slate-500" dir="rtl">
                        {formData.nameAr}
                      </p>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                      formData.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        formData.isActive ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex items-baseline justify-between border-t border-slate-200/80 pt-3">
                  <span className="text-xs text-slate-500">Base Price</span>
                  <div className="font-mono text-xl font-bold text-slate-900">
                    {Number(formData.price || 0).toLocaleString()}{" "}
                    <span className="text-xs font-semibold text-slate-500">EGP</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/80 pt-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Layers size={13} className="text-slate-400" />
                    {formData.variants.length} variant{formData.variants.length !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Boxes size={13} className="text-slate-400" />
                    {totalStockQuantity} total units
                  </span>
                </div>
              </div>
            </section>

            {/* SEO and Pricing Component */}
            <SeoPricingCard values={formData} onSeoChange={handleSeoFieldChange} />

            {/* Variant Summary Card */}
            <section className="rounded-[10px] border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Layers size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Variant Summary</h2>
                  <p className="text-xs text-slate-500">
                    Configured variant matrix and inventory count.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Layers size={14} className="text-slate-400" />
                    Total Variants
                  </div>
                  <div className="mt-2 font-mono text-2xl font-bold text-slate-900">
                    {formData.variants.length}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <ImagePlus size={14} className="text-slate-400" />
                    Image Rows
                  </div>
                  <div className="mt-2 font-mono text-2xl font-bold text-slate-900">
                    {totalVariantImages}
                  </div>
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
                    Toggle whether this product is active and visible to customers in your storefront.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleStatus}
                  className={`relative inline-flex h-8 w-14 cursor-pointer items-center rounded-full p-1 transition ${
                    formData.isActive ? "bg-teal-400" : "bg-white/20"
                  }`}
                  aria-pressed={formData.isActive}
                  title="Toggle product visibility"
                >
                  <span
                    className={`h-6 w-6 rounded-full bg-white shadow-md transition ${
                      formData.isActive ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-6 rounded-[10px] bg-white/10 p-4">
                <div className="text-xs uppercase tracking-wider text-slate-200">Current status</div>
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
