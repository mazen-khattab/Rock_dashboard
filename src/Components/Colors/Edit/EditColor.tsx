import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, Palette, Save } from "lucide-react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { MOCK_COLORS, type Color, type ColorFormData } from "../../../Types/Color";


// const normalizeHexValue = (value: string) => {
//   const sanitizedValue = value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
//   // console.log(value);
//   // console.log(sanitizedValue);
//   return `#${sanitizedValue}`;
// };

// const isValidHexColor = (value: string) => /^#[0-9a-fA-F]{6}$/.test(value);

export const EditColor = () => {
  const { colorId } = useParams();
  const { state } = useLocation();

  const color = useMemo(() => {
    const stateColor = (state as { color?: Color })?.color;
    return stateColor ?? MOCK_COLORS.find((item) => item.id === colorId);
  }, [colorId, state]);

  const [formData, setFormData] = useState<ColorFormData | null>(() =>
    color
      ? {
        name: color.name,
        hex: color.hex,
        isActive: color.isActive,
      }
      : null,
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((current) =>
      current
        ? {
          ...current,
          [name]:  value,
        }
        : current,
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData) {
      return;
    }

    console.log("Edit color payload:", {
      colorId,
      ...formData,
    });
  };

  if (!color || !formData) {
    return <Navigate to="/admin/colors" replace />;
  }

  // const previewHex = isValidHexColor(formData.hex) ? formData.hex : "#E2E8F0";

  return (
    <div className="min-h-screen p-6 text-slate-800 shadow-sm">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-6">
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Link
              to="/admin/colors"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
            >
              <ArrowLeft size={16} />
              Back to colors
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">Edit Color</h1>
              <p className="mt-2 text-sm text-slate-500">
                Updating <span className="font-semibold text-slate-800">{color.name}</span>
              </p>
            </div>
          </div>

          <button
            type="submit"
            form="edit-color-form"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-(--main-color) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--hover-color)"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>

        <form id="edit-color-form" onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-5 rounded-[10px] border border-slate-200 bg-slate-50/70 p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Color Details</h2>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="space-y-2 flex-1">
                <span className="text-sm font-medium text-slate-700">Color Name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Gold"
                  className="w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </label>

              <label className="space-y-2 flex-1">
                <span className="text-sm font-medium text-slate-700">Hex Code</span>
                <div className="flex overflow-hidden rounded-[10px] border border-slate-200 bg-white focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-100">
                  <span
                    className="w-14 border-r border-slate-200"
                    style={{ backgroundColor: formData.hex }}
                    aria-hidden="true"
                  />
                  <input
                    type="color"
                    name="hex"
                    value={formData.hex}
                    onChange={handleChange}
                    className="w-full h-11 px-4 py-3 font-mono text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </label>
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-[10px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200"
                  style={{ backgroundColor: formData.hex }}
                >
                  <Palette size={20} className="text-white mix-blend-difference" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Live Preview</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Check how the edited color reads before saving.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[10px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <span
                    className="h-8 w-8 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: formData.hex }}
                    aria-hidden="true"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">{formData.name || "Unnamed Color"}</div>
                    <div className="font-mono text-sm text-slate-500">{formData.hex || "#------"}</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[10px] border border-slate-200 bg-linear-to-r from-[#003334] to-[#014849d7] p-6 text-white shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Visibility</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Control whether this color is currently available to the dashboard.
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
