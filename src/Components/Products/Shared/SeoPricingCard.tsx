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
    <section className="rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm min-w-0">
      <div className="flex flex-col gap-3 sm:gap-4 border-b border-zinc-800/80 pb-4 sm:pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-zinc-100">SEO & Metadata</h2>
            <p className="mt-0.5 text-xs sm:text-sm text-zinc-400">
              Prepare the product for search indexing and storefront listing.
            </p>
          </div>

          <div className="inline-flex w-fit rounded-full border border-zinc-800 bg-zinc-950 p-1 shrink-0 self-start sm:self-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-zinc-800 text-zinc-100 border border-zinc-700/80 shadow-xs"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
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
        className={`mt-4 sm:mt-6 space-y-4 sm:space-y-5 transition-all duration-200 min-w-0 ${activeFields.alignClassName}`}
      >
        <label className="block space-y-1.5 min-w-0">
          <span className="block text-xs sm:text-sm font-medium text-zinc-300">{activeFields.slugLabel}</span>
          <input
            type="text"
            required
            value={currentValues.slug}
            onChange={(event) => onSeoChange(activeTab, "slug", event.target.value)}
            placeholder={activeFields.slugPlaceholder}
            className={`w-full min-w-0 rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-200 outline-none transition-all duration-200 placeholder:text-zinc-600 focus:border-zinc-500 focus:bg-zinc-900/90 focus:ring-2 focus:ring-zinc-700 ${activeFields.alignClassName}`}
          />
        </label>

        <label className="block space-y-1.5 min-w-0">
          <span className="block text-xs sm:text-sm font-medium text-zinc-300">{activeFields.metaTitleLabel}</span>
          <input
            type="text"
            value={currentValues.metaTitle}
            required
            onChange={(event) => onSeoChange(activeTab, "metaTitle", event.target.value)}
            placeholder={activeFields.metaTitlePlaceholder}
            className={`w-full min-w-0 rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-200 outline-none transition-all duration-200 placeholder:text-zinc-600 focus:border-zinc-500 focus:bg-zinc-900/90 focus:ring-2 focus:ring-zinc-700 ${activeFields.alignClassName}`}
          />
        </label>

        <label className="block space-y-1.5 min-w-0">
          <span className="block text-xs sm:text-sm font-medium text-zinc-300">{activeFields.metaDescriptionLabel}</span>
          <textarea
            value={currentValues.metaDescription}
            required
            onChange={(event) => onSeoChange(activeTab, "metaDescription", event.target.value)}
            rows={3}
            placeholder={activeFields.metaDescriptionPlaceholder}
            className={`w-full min-w-0 resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-200 outline-none transition-all duration-200 placeholder:text-zinc-600 focus:border-zinc-500 focus:bg-zinc-900/90 focus:ring-2 focus:ring-zinc-700 ${activeFields.alignClassName}`}
          />
        </label>
      </div>
    </section>
  );
};
