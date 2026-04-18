import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
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
import { Link } from "react-router-dom";
import type { VariantImage, ProductVariant, ProductFormData } from "../../../Types/Product";

const languageOptions = [
  { label: "Arabic", value: "ar" },
  { label: "English", value: "en" },
];

const categoryOptions = [
  { label: "Rings", value: "rings" },
  { label: "Necklaces", value: "necklaces" },
  { label: "Bracelets", value: "bracelets" },
  { label: "Earrings", value: "earrings" },
];

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
const colorOptions = ["Gold", "Silver", "Rose Gold", "Black", "White", "Green", "Blue", "Red"];

const createEmptyVariantImage = (): VariantImage => ({
  id: crypto.randomUUID(),
  file: null,
  sortOrder: "",
});

const createEmptyVariant = (): ProductVariant => ({
  id: crypto.randomUUID(),
  size: "",
  color: "",
  quantity: "",
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

export const CreateProduct = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    nameAr: "",
    nameEn: "",
    language: "ar",
    category: "rings",
    description: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    price: "",
    isActive: true,
    variants: [createEmptyVariant()],
  });

  // Text editor.
  const editorRef = useRef<HTMLDivElement>(null);

  // used to handle changing in input value
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // used in text editor to apply the style on the editor value 
  const applyEditorCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    setFormData((current) => ({
      ...current,
      description: editorRef.current?.innerHTML ?? "",
    }));
  };

  // used to handle changing in editor value
  const handleDescriptionChange = () => {
    setFormData((current) => ({
      ...current,
      description: editorRef.current?.innerHTML ?? "",
    }));
  };

  // used to handle changing in variants values (size, color, quantity, and image)
  const handleVariantChange = (variantId: string, key: keyof Omit<ProductVariant, "id" | "images">, value: string) => {
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
  const handleRemoveVariant = (variantId: string) => {
    setFormData((current) => ({
      ...current,
      variants: current.variants.length === 1
        ? [createEmptyVariant()]
        : current.variants.filter((variant) => variant.id !== variantId),
    }));
  };

  // used to add a new variant image
  const handleAddVariantImage = (variantId: string) => {
    setFormData((current) => ({
      ...current,
      variants: current.variants.map((variant) => variant.id === variantId
        ? { ...variant, images: [...variant.images, createEmptyVariantImage()] }
        : variant,
      ),
    }));
  };

  // used to remove variant image by variant id
  const handleRemoveVariantImage = (variantId: string, imageId: string) => {
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
  const handleVariantImageFileChange = (variantId: string, imageId: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

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
  const handleVariantImageFieldsChange = (variantId: string, imageId: string, field: keyof VariantImage, value: any) => {
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      ...formData,
      variants: formData.variants.map((variant) => ({
        size: variant.size,
        color: variant.color,
        quantity: Number(variant.quantity || 0),
        images: variant.images
          .filter((image) => image.file)
          .map((image) => ({
            name: image.file?.name ?? "",
            sortOrder: Number(image.sortOrder || 0),
          })),
      })),
    };

    console.log("Create product payload:", payload);
  };

  const totalVariantImages = formData.variants.reduce((total, variant) => total + variant.images.length, 0);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl p-6 shadow-sm ring-1 ring-slate-200/70">

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
            className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-(--main-color) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--hover-color) cursor-pointer">
            <Plus size={16} />
            Create
          </button>
        </div>

        {/* form inputs */}
        <form id="create-product-form" onSubmit={handleSubmit} className="space-y-8">
          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6 rounded-[10px] border border-slate-200 bg-slate-50/80 p-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Product Details</h2>
                <p className="mt-1 text-sm text-slate-500">
                </p>
              </div>

              {/* Name, lang and category */}
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Name in Arabic</span>
                  <input
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
                    type="text"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleInputChange}
                    className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Language</span>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  >
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Category</span>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Price */}
              <div>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Price</span>
                  <div className="w-full flex overflow-hidden rounded-[10px] border border-slate-200 bg-slate-50 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-100">
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
                      step="0.01"
                      className="w-full px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 bg-white"
                    />
                  </div>
                </label>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Description</label>
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
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleDescriptionChange}
                    className="min-h-56 px-4 py-4 text-sm leading-7 text-slate-700 outline-none empty:before:pointer-events-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)] [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:list-disc"
                    data-placeholder="Write a rich description for your product..."
                  />
                </div>
              </div>

              <section className="space-y-5 rounded-[10px] border border-slate-200 bg-white p-6 shadow-sm">
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
                            value={variant.size}
                            onChange={(event) => handleVariantChange(variant.id, "size", event.target.value)}
                            className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-(--main-color) focus:ring-4 focus:ring-[#d9f1ee]"
                          >
                            <option value="">Select size</option>
                            {sizeOptions.map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-slate-700">Color</span>
                          <select
                            value={variant.color}
                            onChange={(event) => handleVariantChange(variant.id, "color", event.target.value)}
                            className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-(--main-color) focus:ring-4 focus:ring-[#d9f1ee]"
                          >
                            <option value="">Select color</option>
                            {colorOptions.map((color) => (
                              <option key={color} value={color}>
                                {color}
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
                              className="grid gap-4 rounded-[10px] border border-slate-200 bg-slate-50/70 p-4 md:grid-cols-[1.3fr_0.7fr_auto]"
                            >
                              <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700">Image {imageIndex + 1}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(event) => handleVariantImageFileChange(variant.id, image.id, event)}
                                  className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700"
                                />
                                {image.file ? (
                                  <span className="block text-xs text-slate-500">{image.file.name}</span>
                                ) : null}
                              </label>

                              <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700">Sort Order</span>
                                <input
                                  name="sortOrder"
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={image.sortOrder}
                                  onChange={(event) =>
                                    handleVariantImageFieldsChange(variant.id, image.id, event.target.name as keyof VariantImage, event.target.value)
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
              <section className="rounded-[10px] border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">SEO & Pricing</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Prepare the product for search and storefront listing.
                  </p>
                </div>

                <div className="mt-6 space-y-5">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Slug</span>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="silver-ring"
                      className="w-full rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Meta Title</span>
                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                      placeholder="Silver Ring | Rock"
                      className="w-full rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Meta Description</span>
                    <textarea
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Short SEO description for the product page."
                      className="w-full resize-none rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-[10px] border border-slate-200 bg-white p-6 shadow-sm">
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
