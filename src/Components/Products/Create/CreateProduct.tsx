import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowLeft,
  Bold,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Plus,
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
import { toast } from 'react-toastify';
import { VariantImageUploader } from "../../Global/Components";
import { prepareProductFormData } from "../../../Helper/PrepareProductFormData";
import { productFormDataSchema } from "../../../Helper/ProductFormDataSchema";

const createEmptyVariantImage = (): CreatedVariantImage => ({
  id: Math.floor(Date.now() / Math.floor(Math.random() * 100000)), // Using timestamp as a simple unique ID for images
  file: null,
  sortOrder: 0,
});

const createEmptyVariant = (): CreateVariant => ({
  id: Math.floor(Date.now() / Math.floor(Math.random() * 100000)), // Using timestamp as a simple unique ID for variants
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

  // Text editor.
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

  // used to handle changing in input value
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
 * @param locale - The current language locale ("en" or "ar").
 * @param field - The generic SEO field name ("slug", "metaTitle", or "metaDescription").
 * @param value - The text string entered by the user.
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

  // used in text editor to apply the style on the editor value 
  const applyEditorCommand = (command: string, value?: string) => {
    // editorRefAR.current?.focus();
    document.execCommand(command, false, value);
    setFormData((current) => ({
      ...current,
      descriptionAr: editorRefAR.current?.innerHTML ?? "",
      descriptionEn: editorRefEn.current?.innerHTML ?? "",
    }));
  };

  // used to handle changing in editor value
  const handleDescriptionChange = () => {
    setFormData((current) => ({
      ...current,
      descriptionAr: editorRefAR.current?.innerHTML ?? "",
      descriptionEn: editorRefEn.current?.innerHTML ?? "",
    }));
  };

  // used to handle changing in variants values (size, color, quantity, and image)
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

  // used to add a new empty variant.
  const handleAddVariant = () => {
    setFormData((current) => ({
      ...current,
      variants: [...current.variants, createEmptyVariant()],
    }));
  };

  // used to remove the variant by id.
  const handleRemoveVariant = (variantId: number) => {
    setFormData((current) => ({
      ...current,
      variants: current.variants.length === 1
        ? [createEmptyVariant()]
        : current.variants.filter((variant) => variant.id !== variantId),
    }));
  };

  // used to add a new variant image
  const handleAddVariantImage = (variantId: number) => {
    setFormData((current) => ({
      ...current,
      variants: current.variants.map((variant) => variant.id === variantId
        ? { ...variant, images: [...variant.images, createEmptyVariantImage()] }
        : variant,
      ),
    }));
  };

  // used to remove variant image by variant id
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

  // used to handle change in the variant image file value.
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

  // used to handle change in all fields except file in the variant image.
  const handleVariantImageFieldsChange = (variantId: number, imageId: number, field: keyof CreatedVariantImage, value: any) => {
    if (field === "sortOrder") {
      value = Number(value);
    }

    setFormData((current) => ({
      ...current,
      variants: current.variants.map((variant) =>
        variant.id === variantId ? {
          ...variant,
          images: variant.images.map((img) =>
            img.id === imageId ? { ...img, [field]: value } : img
          )
        } : variant
      ),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("Submitting form with data:", formData);

    const result = productFormDataSchema.safeParse(formData);

    if (!result.success) {
      const firstError = result.error.issues;

      firstError.forEach(error => {
        toast.error(error.message);
      });

      return;
    }

    const data = prepareProductFormData(formData);

    try {
      const product = await createProduct(data);
      navigate(`/admin/products/edit/${product.id}`);

      toast.success("Product created successfully!");
    } catch (submitError) {
      console.error("Failed to create product:", submitError);
    }
  };

  const totalVariantImages = formData.variants.reduce((total, variant) => total + variant.images.length, 0);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl p-3 sm:p-6  shadow-sm ring-1 ring-slate-200/70">

        {/* header */}
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
            >
              <ArrowLeft size={16} />
              Back to products
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Create Product</h1>
          </div>

          <button
            type="submit"
            form="create-product-form"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-(--main-color) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--hover-color) disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer">
            <Plus size={16} />
            {loading ? "Creating..." : "Create"}
          </button>
        </div>

        {/* form inputs */}
        <form id="create-product-form" onSubmit={handleSubmit} className="space-y-8">
          {error ? (
            <div className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6 rounded-[10px] border border-slate-200 bg-slate-50/80 p-3 sm:p-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Product Details</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Fill in the details for the new product.
                </p>
              </div>

              {/* Name, lang and category */}
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Name in Arabic</span>
                  <input
                    required
                    type="text"
                    name="nameAr"
                    value={formData.nameAr}
                    onChange={handleInputChange}
                    className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Name in English</span>
                  <input
                    required
                    type="text"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleInputChange}
                    className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Category</span>
                  <select
                    name="categoryId"
                    required
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

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Price</span>
                  <div className="flex w-full overflow-hidden rounded-[10px] border border-slate-200 bg-slate-50 transition-all duration-200 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-100">
                    <span className="flex items-center border-r border-slate-200 px-4 text-sm font-medium text-slate-500">
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

              <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
                {/* DescriptionEn */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Description in English</label>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                      {toolbarButtons.map((button) => {
                        const Icon = button.icon;

                        return (
                          <button
                            key={button.label}
                            type="button"
                            onClick={() => applyEditorCommand(button.command, button.value)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                            aria-label={button.label}
                            title={button.label}
                          >
                            <Icon size={16} />
                          </button>
                        );
                      })}
                    </div>

                    <div
                      ref={editorRefEn}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={handleDescriptionChange}
                      className="min-h-56 px-4 py-4 text-sm leading-7 text-slate-700 outline-none empty:before:pointer-events-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)] [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:list-disc"
                      data-placeholder="Write a rich description for your product..."
                    />
                  </div>
                </div>

                {/* DescriptionAr */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Description in Arabic</label>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                      {toolbarButtons.map((button) => {
                        const Icon = button.icon;

                        return (
                          <button
                            key={button.label}
                            type="button"
                            onClick={() => applyEditorCommand(button.command, button.value)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                            aria-label={button.label}
                            title={button.label}
                          >
                            <Icon size={16} />
                          </button>
                        );
                      })}
                    </div>

                    <div
                      ref={editorRefAR}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={handleDescriptionChange}
                      className="min-h-56 px-4 py-4 text-sm leading-7 text-slate-700 outline-none empty:before:pointer-events-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)] [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:list-disc"
                      data-placeholder="Write a rich description for your product..."
                    />
                  </div>
                </div>
              </div>

              <section className="space-y-5 rounded-[10px] border border-slate-200 bg-white p-3 sm:p-6 shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Variants</h2>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-slate-200 bg-(--main-color) px-4 py-2.5 text-sm font-medium text-white transition hover:border-(--main-color) hover:bg-white hover:text-(--main-color)"
                  >
                    <Plus size={16} />
                    Add Variant
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.variants.map((variant, variantIndex) => (
                    <div key={variant.id} className="space-y-4 rounded-[10px] border border-slate-200 bg-slate-50/70 p-4">
                      <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">Variant {variantIndex + 1}</h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(variant.id)}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-600 transition hover:bg-red-100 cursor-pointer"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <label className="space-y-2">
                          <span className="text-sm font-medium text-slate-700">Size</span>
                          <select
                            value={variant.sizeId}
                            onChange={(event) => handleVariantChange(variant.id, "sizeId", event.target.value)}
                            className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-(--main-color) focus:ring-4 focus:ring-[#d9f1ee]"
                          >
                            <option value="">Select size</option>
                            {sizeLookup.map((size) => (
                              <option key={size.id} value={size.id}>
                                {size.name}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-slate-700">Color</span>
                          <select
                            value={variant.colorId}
                            onChange={(event) => handleVariantChange(variant.id, "colorId", event.target.value)}
                            className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-(--main-color) focus:ring-4 focus:ring-[#d9f1ee]"
                          >
                            <option value="">Select color</option>
                            {colorLookup.map((color) => (
                              <option key={color.id} value={color.id}>
                                {color.name}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-slate-700">Quantity</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={variant.quantity}
                            onChange={(event) => handleVariantChange(variant.id, "quantity", event.target.value)}
                            placeholder="0"
                            className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-(--main-color) focus:ring-4 focus:ring-[#d9f1ee]"
                          />
                        </label>
                      </div>

                      <div className="space-y-4 rounded-[10px] border border-slate-200 bg-white p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900">Variant Images</h4>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddVariantImage(variant.id)}
                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-(--main-color) hover:bg-white hover:text-(--main-color)"
                          >
                            <ImagePlus size={16} />
                            Add Image
                          </button>
                        </div>

                        <div className="space-y-3">
                          {variant.images.map((image, imageIndex) => (
                            <div
                              key={image.id}
                              className="grid gap-4 rounded-[10px] border border-slate-200 bg-slate-50/70 p-4 md:grid-cols-[1.3fr_1fr_auto]"
                            >
                              <VariantImageUploader
                                image={image}
                                imageIndex={imageIndex}
                                variantId={variant.id}
                                onFileSelect={handleVariantImageFileChange}
                              />

                              <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700">Sort Order</span>
                                <input
                                  name="sortOrder"
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={image.sortOrder}
                                  onChange={(event) =>
                                    handleVariantImageFieldsChange(variant.id, image.id, event.target.name as keyof CreatedVariantImage, event.target.value)
                                  }
                                  placeholder="0"
                                  className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-(--main-color) focus:ring-4 focus:ring-[#d9f1ee]"
                                />
                              </label>

                              <div className="flex items-end">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariantImage(variant.id, image.id)}
                                  className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-[10px] border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                                  aria-label={`Delete image ${imageIndex + 1}`}
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

            <div className="space-y-6">
              <SeoPricingCard
                values={formData}
                onSeoChange={handleSeoFieldChange}
              />

              <section className="rounded-[10px] border border-slate-200 bg-white p-3 sm:p-6 shadow-sm">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Variant Summary</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Quick overview of how many variant rows and image rows are currently configured.
                  </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[10px] border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Total variants</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-900">{formData.variants.length}</div>
                  </div>

                  <div className="rounded-[10px] border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Image rows</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-900">{totalVariantImages}</div>
                  </div>
                </div>
              </section>

              <section className="rounded-[10px] border border-slate-200 bg-linear-to-r from-[#003334] to-[#014849d7] p-6 text-white shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">Visibility</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      Toggle whether this product should appear as active in your dashboard.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((current) => ({
                        ...current,
                        isActive: !current.isActive,
                      }))
                    }
                    className={`relative inline-flex h-8 w-14 items-center rounded-full p-1 transition cursor-pointer ${formData.isActive ? "bg-teal-400" : "bg-white/20"
                      }`}
                    aria-pressed={formData.isActive}
                  >
                    <span
                      className={`h-6 w-6 rounded-full bg-white shadow-md transition ${formData.isActive ? "translate-x-6" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>

                <div className="mt-6 rounded-[10px] bg-white/10 p-4">
                  <div className="text-sm text-slate-200">Current status</div>
                  <div className="mt-2 text-2xl font-semibold">
                    {formData.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              </section>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};
