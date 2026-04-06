import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bold,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Save,
  Type,
} from "lucide-react";

import { MOCK_PRODUCTS, type Product } from "../../../Types/Product";

const languageOptions = [
  { label: "Arabic", value: "ar" },
  { label: "English", value: "en" },
];

const categoryOptions = [
  { label: "Tops", value: "tops" },
  { label: "Bottoms", value: "bottoms" },
  { label: "Dresses", value: "dresses" },
  { label: "Outerwear", value: "outerwear" },
  { label: "Accessories", value: "accessories" },
];

const toolbarButtons = [
  { label: "Bold", icon: Bold, command: "bold" },
  { label: "Italic", icon: Italic, command: "italic" },
  { label: "Paragraph", icon: Pilcrow, command: "formatBlock", value: "p" },
  { label: "Heading", icon: Type, command: "formatBlock", value: "h3" },
  { label: "Bullets", icon: List, command: "insertUnorderedList" },
  { label: "Numbered", icon: ListOrdered, command: "insertOrderedList" },
];

const normalizeCategory = (category: string) => category.toLowerCase().replace(/\s+/g, "");

const generateSlug = (name: string): string =>
  name.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// this will return the intial values for form data inputs
const buildInitialFormData = (product: Product) => {
  const { name, category, sizes, price, status } = product;

  return {
    nameAr: `${name} Arabic`,
    nameEn: name,
    language: "en",
    category: normalizeCategory(category),
    description: `<p>${name} is part of the ${category} collection.</p><p>Available sizes: ${sizes.join(", ")}.</p>`,
    slug: generateSlug(name),
    metaTitle: `${name} | Rock`,
    metaDescription: `${name} from the ${category} category at Rock.`,
    price: price.toFixed(2),
    isActive: status === "Active",
  };
};

export const EditProduct = () => {
  const { productId } = useParams();
  const { state } = useLocation();

  // userMemo here to cache the product and prevent research in MOCK_PRODUCTS each render
  // useMemo will work each time the productId and state change
  const product = useMemo(() => {
    const stateProduct = (state as { product?: Product })?.product;
    return stateProduct ?? MOCK_PRODUCTS.find((p) => p.id === productId);
  }, [productId, state]);

  const editorRef = useRef<HTMLDivElement>(null);

  // set intial form data
  const [formData, setFormData] = useState(() =>
    product ? buildInitialFormData(product) : null,
  );

  useEffect(() => {
    if (!product) {
      return;
    }

    const nextFormData = buildInitialFormData(product);
    setFormData(nextFormData);

    if (editorRef.current) {
      editorRef.current.innerHTML = nextFormData.description;
    }
  }, [product]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) =>
      current
        ? {
          ...current,
          [name]: value,
        }
        : current,
    );
  };

  const applyEditorCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    setFormData((current) =>
      current
        ? {
          ...current,
          description: editorRef.current?.innerHTML ?? "",
        }
        : current,
    );
  };

  const handleDescriptionChange = () => {
    setFormData((current) =>
      current
        ? {
          ...current,
          description: editorRef.current?.innerHTML ?? "",
        }
        : current,
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Edit product payload:", { productId, ...formData });
  };

  if (!product || !formData) {
    return <Navigate to="/admin/products" replace />;
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl p-6 shadow-sm ring-1 ring-slate-200/70">
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
              <p className="mt-2 text-sm text-slate-500">
                Updating <span className="font-semibold text-slate-800">{product.name}</span>
              </p>
            </div>
          </div>

          <button
            type="submit"
            form="edit-product-form"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-(--main-color) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--hover-color)"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>

        <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-8">
          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6 rounded-[10px] border border-slate-200 bg-slate-50/80 p-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Product Details</h2>
              </div>

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
                      className="w-full bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>
              </div>

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
                      className="w-full resize-none rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
                    />
                  </label>
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
                      setFormData((current) =>
                        current
                          ? {
                            ...current,
                            isActive: !current.isActive,
                          }
                          : current,
                      )
                    }
                    className={`relative inline-flex h-8 w-14 items-center rounded-full p-1 transition ${formData.isActive ? "bg-teal-400" : "bg-white/20"}`}
                    aria-pressed={formData.isActive}
                  >
                    <span
                      className={`h-6 w-6 rounded-full bg-white shadow-md transition ${formData.isActive ? "translate-x-6" : "translate-x-0"}`}
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
