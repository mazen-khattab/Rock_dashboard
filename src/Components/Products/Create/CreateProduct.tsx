import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Type,
  Plus,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";


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
  const [formData, setFormData] = useState({
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
  });

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Create product payload:", formData);
  };

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
                    className={`relative inline-flex h-8 w-14 items-center rounded-full p-1 transition ${formData.isActive ? "bg-teal-400" : "bg-white/20"
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
