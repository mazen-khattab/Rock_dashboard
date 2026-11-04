import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
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
  Sparkles,
  Tag,
  Trash2,
  Type,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useProduct } from "../../../Context/ProductContext";
import type { CreatedVariantImage, CreateVariant, ProductFormData } from "../../../Types/Product";
import { SeoPricingCard } from "../Shared/SeoPricingCard";
import { useCategory } from "../../../Context/CategoryContext";
import { useSize } from "../../../Context/SizeContext";
import { useColor } from "../../../Context/ColorContext";
import { toast } from "react-toastify";
import { VariantImageUploader } from "../../Global/Components";
import { prepareProductFormData } from "../../../Helper/PrepareProductFormData";
import { productFormDataSchema } from "../../../Helper/ProductFormDataSchema";

const createEmptyVariantImage = (): CreatedVariantImage => ({
  id: Math.floor(Date.now() / Math.max(1, Math.floor(Math.random() * 100000))),
  file: null,
  sortOrder: 0,
});

const createEmptyVariant = (): CreateVariant => ({
  id: Math.floor(Date.now() / Math.max(1, Math.floor(Math.random() * 100000))),
  sizeId: 0,
  colorId: 0,
  quantity: 0,
  images: [createEmptyVariantImage()],
});

// text editor buttons 
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

export const CreateProduct = () => {
  const navigate = useNavigate();
  const { createProduct, loading, error } = useProduct();
  const { categoryLookup, getCategoryLookup } = useCategory();
  const { sizeLookup, getSizeLookup } = useSize();
  const { colorLookup, getColorLookup } = useColor();

  const [formData, setFormData] = useState<ProductFormData>({
    price: 0,
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    descriptionEn: "",
    slugEn: "",
    slugAr: "",
    metaTitleEn: "",
    metaTitleAr: "",
    metaDescriptionEn: "",
    metaDescriptionAr: "",
    categoryId: 0,
    isActive: true,
    variants: [createEmptyVariant()],
  });

  // Text editor refs
  const editorRefAR = useRef<HTMLDivElement>(null);
  const editorRefEn = useRef<HTMLDivElement>(null);

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

  // Handle changing in input values
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    let finalValue: string | number = value;
    
    if (name === "categoryId" || name === "price") {
      finalValue = Number(value);
    }

    setFormData((current) => ({
      ...current,
      [name]: finalValue,
    }));
  };

  /**
   * Updates localized SEO field values (slug, metaTitle, metaDescription) in the form state.
   */
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

    setFormData((current) => ({
      ...current,
      [localizedField]: value,
    }));
  };

  // Used in text editor to apply styling
  const applyEditorCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    setFormData((current) => ({
      ...current,
      descriptionAr: editorRefAR.current?.innerHTML ?? "",
      descriptionEn: editorRefEn.current?.innerHTML ?? "",
    }));
  };

  // Used to handle change in editor value
  const handleDescriptionChange = () => {
    setFormData((current) => ({
      ...current,
      descriptionAr: editorRefAR.current?.innerHTML ?? "",
      descriptionEn: editorRefEn.current?.innerHTML ?? "",
    }));
  };

  // Used to handle changes in variants values (size, color, quantity)
  const handleVariantChange = (variantId: number, key: keyof Omit<CreateVariant, "id" | "images">, value: string | number) => {
    if (key === "sizeId" || key === "colorId" || key === "quantity") {
      value = Number(value);
    }

    setFormData((current) => ({
      ...current,
      variants: current.variants.map((variant) =>
        variant.id === variantId ? { ...variant, [key]: value } : variant,
      ),
    }));
  };

  // Add a new empty variant
  const handleAddVariant = () => {
    setFormData((current) => ({
      ...current,
      variants: [...current.variants, createEmptyVariant()],
    }));
  };

  // Remove variant by id
  const handleRemoveVariant = (variantId: number) => {
    setFormData((current) => ({
      ...current,
      variants: current.variants.length === 1
        ? [createEmptyVariant()]
        : current.variants.filter((variant) => variant.id !== variantId),
    }));
  };

  // Add a new variant image
  const handleAddVariantImage = (variantId: number) => {
    setFormData((current) => ({
      ...current,
      variants: current.variants.map((variant) =>
        variant.id === variantId
          ? { ...variant, images: [...variant.images, createEmptyVariantImage()] }
          : variant,
      ),
    }));
  };

  // Remove variant image by variant id & image id
  const handleRemoveVariantImage = (variantId: number, imageId: number) => {
    setFormData((current) => ({
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
    }));
  };

  // Handle change in variant image file
  const handleVariantImageFileChange = (variantId: number, imageId: number, file: File | null) => {
    setFormData((current) => ({
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
    }));
  };

  // Handle change in variant image metadata fields
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

    setFormData((current) => ({
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
    }));
  };

  const handleToggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = productFormDataSchema.safeParse(formData);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      return;
    }

    const data = prepareProductFormData(formData);

    try {
      const product = await createProduct(data);
      toast.success("Product created successfully!");
      navigate(`/admin/products/edit/${product.id}`);
    } catch (submitError) {
      console.error("Failed to create product:", submitError);
    }
  };

  const totalVariantImages = formData.variants.reduce((total, variant) => total + variant.images.length, 0);
  const totalStockQuantity = formData.variants.reduce((total, variant) => total + Number(variant.quantity || 0), 0);
  const selectedCategory = categoryLookup.find((c) => c.id === formData.categoryId);

  return (
    <div className="min-h-screen p-3.5 sm:p-5 lg:p-6 text-slate-800">
      <div className="w-full rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 sm:pb-6">
          <div className="space-y-2">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 transition hover:text-slate-800"
            >
              <ArrowLeft size={15} />
              Back to products
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">Create Product</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Configure product details, variants, images, pricing, and SEO settings.
              </p>
            </div>
          </div>

          <button
            type="submit"
            form="create-product-form"
            disabled={loading}
            className="w-full sm:w-auto inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--main-color) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--hover-color) disabled:cursor-not-allowed disabled:opacity-70 shadow-xs"
          >
            <Plus size={16} />
            <span>{loading ? "Creating..." : "Create Product"}</span>
          </button>
        </div>

        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {/* Form Grid */}
        <form
          id="create-product-form"
          onSubmit={handleSubmit}
          className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] min-w-0"
        >
          {/* Left Column: Form Fields & Variants */}
          <div className="space-y-5 sm:space-y-6 min-w-0">
            {/* Product Details Section */}
            <section className="space-y-4 sm:space-y-6 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6 min-w-0">
              <div className="flex items-center gap-3 border-b border-slate-200/80 pb-3 sm:pb-4 min-w-0">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 shrink-0">
                  <Package size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900">Product Details</h2>
                  <p className="text-xs text-slate-500">
                    Basic naming, category classification, and base pricing.
                  </p>
                </div>
              </div>

              {/* Name, category, price */}
              <div className="grid gap-3.5 sm:gap-5 grid-cols-1 sm:grid-cols-2 min-w-0">
                {/* Arabic Name */}
                <label className="block space-y-1.5 sm:space-y-2 min-w-0">
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
                    <Globe size={15} className="text-slate-400" />
                    Name in Arabic <span className="text-red-500">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    name="nameAr"
                    dir="rtl"
                    value={formData.nameAr}
                    onChange={handleInputChange}
                    placeholder="مثال: تي شيرت كلاسيك قطن"
                    className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 font-['Cairo']"
                  />
                </label>

                {/* English Name */}
                <label className="block space-y-1.5 sm:space-y-2 min-w-0">
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
                    <Globe size={15} className="text-slate-400" />
                    Name in English <span className="text-red-500">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleInputChange}
                    placeholder="e.g. Classic Cotton T-Shirt"
                    className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                </label>

                {/* Category */}
                <label className="block space-y-1.5 sm:space-y-2 min-w-0">
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
                    <FolderTree size={15} className="text-slate-400" />
                    Category <span className="text-red-500">*</span>
                  </span>
                  <select
                    name="categoryId"
                    required
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
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
                <label className="block space-y-1.5 sm:space-y-2 min-w-0">
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
                    <Tag size={15} className="text-slate-400" />
                    Base Price <span className="text-red-500">*</span>
                  </span>
                  <div className="flex w-full overflow-hidden rounded-[10px] border border-slate-200 bg-slate-50 transition-all duration-200 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-100 min-w-0">
                    <span className="flex items-center border-r border-slate-200 px-3 sm:px-4 text-xs font-bold text-slate-500 shrink-0">
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
                      className="w-full min-w-0 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>
              </div>

              {/* Descriptions */}
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                {/* Description in English */}
                <div className="space-y-1.5 sm:space-y-2 min-w-0">
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
                    <FileText size={15} className="text-slate-400" />
                    Description in English
                  </span>

                  <div className="overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-xs">
                    <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 px-2 sm:px-3 py-1.5 sm:py-2">
                      {toolbarButtons.map((button) => {
                        const Icon = button.icon;
                        return (
                          <button
                            key={button.label}
                            type="button"
                            onClick={() => applyEditorCommand(button.command, button.value)}
                            className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 cursor-pointer shrink-0"
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
                      className="min-h-36 sm:min-h-48 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm leading-6 text-slate-700 outline-none empty:before:pointer-events-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)] [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-2 [&_ul]:list-disc break-words"
                      data-placeholder="Write an English product description..."
                    />
                  </div>
                </div>

                {/* Description in Arabic */}
                <div className="space-y-1.5 sm:space-y-2 min-w-0" dir="rtl">
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
                    <FileText size={15} className="text-slate-400" />
                    الوصف باللغة العربية
                  </span>

                  <div className="overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-xs" dir="ltr">
                    <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 px-2 sm:px-3 py-1.5 sm:py-2">
                      {toolbarButtons.map((button) => {
                        const Icon = button.icon;
                        return (
                          <button
                            key={button.label}
                            type="button"
                            onClick={() => applyEditorCommand(button.command, button.value)}
                            className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 cursor-pointer shrink-0"
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
                      className="min-h-36 sm:min-h-48 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm leading-6 text-slate-700 outline-none empty:before:pointer-events-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)] [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_li]:mr-5 [&_ol]:list-decimal [&_p]:mb-2 [&_ul]:list-disc break-words font-['Cairo']"
                      data-placeholder="اكتب وصف المنتج باللغة العربية..."
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Product Variants Section */}
            <section className="space-y-4 sm:space-y-5 rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-6 shadow-xs min-w-0">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-3 sm:pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 shrink-0">
                    <Layers size={20} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-semibold text-slate-900">Product Variants</h2>
                    <p className="text-xs text-slate-500">
                      Configure size, color, stock quantities, and variant images.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--main-color) px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-(--hover-color) w-full sm:w-auto shrink-0"
                >
                  <Plus size={16} />
                  Add Variant
                </button>
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                {formData.variants.map((variant, variantIndex) => (
                  <div
                    key={variant.id}
                    className="space-y-3 sm:space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:p-5 transition hover:border-slate-300 min-w-0"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3 sm:pb-4 gap-2">
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                        <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-teal-100 font-mono text-xs font-bold text-teal-800 shrink-0">
                          {variantIndex + 1}
                        </span>
                        <h3 className="text-xs sm:text-base font-semibold text-slate-900 truncate">
                          Variant #{variantIndex + 1}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(variant.id)}
                        className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 shrink-0"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3 min-w-0">
                      {/* Size */}
                      <label className="block space-y-1.5 min-w-0">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          <Ruler size={13} className="text-slate-400" />
                          Size
                        </span>
                        <select
                          value={variant.sizeId}
                          onChange={(event) =>
                            handleVariantChange(variant.id, "sizeId", event.target.value)
                          }
                          className="w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
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
                      <label className="block space-y-1.5 min-w-0">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          <Palette size={13} className="text-slate-400" />
                          Color
                        </span>
                        <select
                          value={variant.colorId}
                          onChange={(event) =>
                            handleVariantChange(variant.id, "colorId", event.target.value)
                          }
                          className="w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
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
                      <label className="block space-y-1.5 min-w-0">
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
                          className="w-full min-w-0 rounded-[10px] border border-slate-200 bg-white px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-mono text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                        />
                      </label>
                    </div>

                    {/* Variant Images Card */}
                    <div className="space-y-3 sm:space-y-4 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 min-w-0">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-900">Variant Images</h4>
                          <p className="text-[11px] sm:text-xs text-slate-500">
                            Each image row stores one file and its sort order.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddVariantImage(variant.id)}
                          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-(--main-color) hover:bg-white hover:text-(--main-color) w-full sm:w-auto shrink-0"
                        >
                          <ImagePlus size={14} />
                          Add Image
                        </button>
                      </div>

                      <div className="space-y-3">
                        {variant.images.map((image, imageIndex) => (
                          <div
                            key={image.id}
                            className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 grid-cols-1 sm:grid-cols-[1.3fr_1fr_auto] items-start min-w-0"
                          >
                            <div className="min-w-0 w-full">
                              <VariantImageUploader
                                image={image}
                                imageIndex={imageIndex}
                                variantId={variant.id}
                                onFileSelect={handleVariantImageFileChange}
                              />
                            </div>

                            <div className="flex items-end gap-2.5 sm:contents">
                              <label className="block space-y-1.5 flex-1 min-w-0 sm:self-center">
                                <span className="text-xs font-medium text-slate-700">Sort Priority</span>
                                <input
                                  name="sortOrder"
                                  type="number"
                                  min="0"
                                  step="1"
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
                                  className="w-full min-w-0 rounded-[10px] border border-slate-200 bg-white px-3 py-2 sm:py-2.5 text-xs font-mono text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                                />
                              </label>

                              <button
                                type="button"
                                onClick={() => handleRemoveVariantImage(variant.id, image.id)}
                                className="inline-flex h-9 sm:h-10 w-9 sm:w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 sm:self-center"
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
            <section className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs min-w-0">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50 text-xl font-bold text-teal-700 shrink-0">
                  <Package size={22} className="sm:hidden" />
                  <Package size={24} className="hidden sm:block" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">Live Preview</h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Preview how this product card and badge appears in catalog.
                  </p>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 space-y-4 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 p-3.5 sm:p-5 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 min-w-0">
                  <div className="min-w-0">
                    <span className="inline-block rounded-md bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800 uppercase tracking-wide truncate max-w-full">
                      {selectedCategory ? selectedCategory.name : "Uncategorized"}
                    </span>
                    <h4 className="mt-2 text-base font-bold text-slate-900 break-words">
                      {formData.nameEn || formData.nameAr || "Untitled Product"}
                    </h4>
                    {formData.nameAr && (
                      <p className="mt-0.5 text-xs text-slate-500 break-words" dir="rtl">
                        {formData.nameAr}
                      </p>
                    )}
                  </div>
                  <span
                    className={`inline-flex self-start sm:self-auto items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium shrink-0 ${
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
                  <div className="font-mono text-lg sm:text-xl font-bold text-slate-900 truncate">
                    {Number(formData.price || 0).toLocaleString()}{" "}
                    <span className="text-xs font-semibold text-slate-500">EGP</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/80 pt-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Layers size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{formData.variants.length} variant{formData.variants.length !== 1 ? "s" : ""}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Boxes size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{totalStockQuantity} total units</span>
                  </span>
                </div>
              </div>
            </section>

            {/* SEO and Pricing Component */}
            <SeoPricingCard values={formData} onSeoChange={handleSeoFieldChange} />

            {/* Variant Summary Card */}
            <section className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shrink-0">
                  <Layers size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900">Variant Summary</h2>
                  <p className="text-xs text-slate-500">
                    Configured variant matrix and inventory count.
                  </p>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2.5 sm:gap-4 min-w-0">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                    <Layers size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">Total Variants</span>
                  </div>
                  <div className="mt-1.5 sm:mt-2 font-mono text-xl sm:text-2xl font-bold text-slate-900">
                    {formData.variants.length}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                    <ImagePlus size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">Image Rows</span>
                  </div>
                  <div className="mt-1.5 sm:mt-2 font-mono text-xl sm:text-2xl font-bold text-slate-900">
                    {totalVariantImages}
                  </div>
                </div>
              </div>
            </section>

            {/* Visibility Settings Card */}
            <section className="rounded-xl sm:rounded-2xl border border-slate-200 bg-linear-to-r from-[#003334] to-[#014849d7] p-4 sm:p-6 text-white shadow-xs min-w-0">
              <div className="flex items-start justify-between gap-3 sm:gap-4 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-teal-300 shrink-0" />
                    <h3 className="text-base sm:text-lg font-semibold">Visibility</h3>
                  </div>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-relaxed text-slate-200">
                    Toggle whether this product is active and visible to customers in your storefront.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleStatus}
                  className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full p-1 transition ${
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

              <div className="mt-4 sm:mt-6 rounded-xl bg-white/10 p-3.5 sm:p-4 min-w-0">
                <div className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-200">Current status</div>
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
