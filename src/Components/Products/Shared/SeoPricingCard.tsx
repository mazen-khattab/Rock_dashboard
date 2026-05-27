import { useState } from "react";

type SeoLocale = "en" | "ar";
type SeoField = "slug" | "metaTitle" | "metaDescription";

type SeoPricingValues = {
  slugEn: string;
  slugAr: string;
  metaTitleEn: string;
  metaTitleAr: string;
  metaDescriptionEn: string;
  metaDescriptionAr: string;
};

type SeoPricingCardProps = {
  values: SeoPricingValues;
  onSeoChange: (locale: SeoLocale, field: SeoField, value: string) => void;
};

const tabs: Array<{ label: string; value: SeoLocale }> = [
  { label: "English", value: "en" },
  { label: "العربية", value: "ar" },
];

const localizedFields = {
  en: {
    dir: "ltr" as const,
    alignClassName: "text-left",
    slugLabel: "Slug",
    slugPlaceholder: "silver-ring",
    metaTitleLabel: "Meta Title",
    metaTitlePlaceholder: "Silver Ring | Rock",
    metaDescriptionLabel: "Meta Description",
    metaDescriptionPlaceholder: "Short SEO description for the product page.",
  },
  ar: {
    dir: "rtl" as const,
    alignClassName: "text-right",
    slugLabel: "الرابط الدائم",
    slugPlaceholder: "خاتم-فضة",
    metaTitleLabel: "عنوان الميتا",
    metaTitlePlaceholder: "خاتم فضة | روك",
    metaDescriptionLabel: "وصف الميتا",
    metaDescriptionPlaceholder: "وصف سيو قصير لصفحة المنتج.",
  },
};

export const SeoPricingCard = ({ values, onSeoChange }: SeoPricingCardProps) => {
  const [activeTab, setActiveTab] = useState<SeoLocale>("en");

  const activeFields = localizedFields[activeTab];
  const currentValues = activeTab === "en"
    ? {
      slug: values.slugEn,
      metaTitle: values.metaTitleEn,
      metaDescription: values.metaDescriptionEn,
    }
    : {
      slug: values.slugAr,
      metaTitle: values.metaTitleAr,
      metaDescription: values.metaDescriptionAr,
    };

  return (
    <section className="rounded-[10px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">SEO & Pricing</h2>
            <p className="mt-1 text-sm text-slate-500">
              Prepare the product for search and storefront listing.
            </p>
          </div>

          <div className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-100 p-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#0F172A] text-white shadow-sm"
                      : "text-slate-500 hover:bg-white hover:text-slate-900"
                  }`}
                  aria-pressed={isActive}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        
      </div>

      <div
        key={activeTab}
        dir={activeFields.dir}
        className={`mt-6 space-y-5 transition-all duration-200 ${activeFields.alignClassName}`}
      >
        <label className="block space-y-2">
          <span className="block text-sm font-medium text-slate-700">{activeFields.slugLabel}</span>
          <input
            type="text"
            required
            value={currentValues.slug}
            onChange={(event) => onSeoChange(activeTab, "slug", event.target.value)}
            placeholder={activeFields.slugPlaceholder}
            className={`w-full rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100 ${activeFields.alignClassName}`}
          />
        </label>

        <label className="block space-y-2">
          <span className="block text-sm font-medium text-slate-700">{activeFields.metaTitleLabel}</span>
          <input
            type="text"
            value={currentValues.metaTitle}
            required
            onChange={(event) => onSeoChange(activeTab, "metaTitle", event.target.value)}
            placeholder={activeFields.metaTitlePlaceholder}
            className={`w-full rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100 ${activeFields.alignClassName}`}
          />
        </label>

        <label className="block space-y-2">
          <span className="block text-sm font-medium text-slate-700">{activeFields.metaDescriptionLabel}</span>
          <textarea
            value={currentValues.metaDescription}
            required
            onChange={(event) => onSeoChange(activeTab, "metaDescription", event.target.value)}
            rows={4}
            placeholder={activeFields.metaDescriptionPlaceholder}
            className={`w-full resize-none rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100 ${activeFields.alignClassName}`}
          />
        </label>
      </div>
    </section>
  );
};
