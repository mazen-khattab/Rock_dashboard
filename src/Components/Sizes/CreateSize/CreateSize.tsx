import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, Plus, Ruler } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { MOCK_SIZES, type SizeFormData } from "../../../Types/Size";

// Builds the initial form state, optionally seeding it from a size id in the URL.
const buildInitialFormData = (sizeId?: string): SizeFormData => {
  const matchedSize = MOCK_SIZES.find((item) => item.id === sizeId);

  return matchedSize
    ? {
        name: matchedSize.name,
        sortOrder: matchedSize.sortOrder,
        isActive: matchedSize.isActive,
      }
    : {
        name: "",
        sortOrder: 1,
        isActive: true,
      };
};

export const CreateSize = () => {
  const { sizeId } = useParams();

  // Memoizes the initial form values so they stay stable across re-renders.
  const initialFormData = useMemo(() => buildInitialFormData(sizeId), [sizeId]);

  const [formData, setFormData] = useState<SizeFormData>(initialFormData);

  // Updates the matching form field whenever an input changes.
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // Toggles the current active status for the new size.
  const handleToggleStatus = () => {
    setFormData((current) => ({
      ...current,
      isActive: !current.isActive,
    }));
  };

  // Prevents the default submit refresh and logs the create payload.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("Create size payload:", {
      sizeId,
      ...formData,
    });
  };

  return (
    <div className="min-h-screen p-6 text-slate-800 shadow-sm">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-6">
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Link
              to="/admin/sizes"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
            >
              <ArrowLeft size={16} />
              Back to sizes
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">Create Size</h1>
              <p className="mt-2 text-sm text-slate-500">
                Add a new size with display order and visibility settings.
              </p>
            </div>
          </div>

          <button
            type="submit"
            form="create-size-form"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-(--main-color) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--hover-color)"
          >
            <Plus size={16} />
            Create Size
          </button>
        </div>

        <form id="create-size-form" onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-5 rounded-[10px] border border-slate-200 bg-slate-50/70 p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Size Details</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Size Name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="XL"
                  className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Sort Order</span>
                <input
                  type="number"
                  name="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  placeholder="1"
                  className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </label>
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-[10px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-700">
                  <Ruler size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Live Preview</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Review the size label and sort order before creating it.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[10px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-slate-200 bg-white px-3 font-semibold text-slate-800 shadow-sm">
                    {formData.name || "--"}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900">{formData.name || "Unnamed Size"}</div>
                    <div className="text-sm text-slate-500">Sort order: {formData.sortOrder}</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[10px] border border-slate-200 bg-linear-to-r from-[#003334] to-[#014849d7] p-6 text-white shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Visibility</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Control whether this size should be available as soon as it is created.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleStatus}
                  className={`relative inline-flex h-8 w-14 cursor-pointer items-center rounded-full p-1 transition ${formData.isActive ? "bg-teal-400" : "bg-white/20"}`}
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
        </form>
      </div>
    </div>
  );
};
