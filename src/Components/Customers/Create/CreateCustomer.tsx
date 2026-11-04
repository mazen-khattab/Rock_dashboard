import { ArrowLeft, Save, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import "./CreateCustomer.css";

export const CreateCustomer = () => {
  return (
    <div className="min-h-screen p-3.5 sm:p-5 lg:p-6 text-slate-800 shadow-sm">
      <div className="mx-auto max-w-5xl rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:pb-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 sm:space-y-3">
            <Link
              to="/admin/customers"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
            >
              <ArrowLeft size={16} />
              Back to customers
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">Create Customer</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Prepare the customer form and connect it to your API when backend endpoints are ready.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-(--main-color) px-5 py-2.5 sm:py-3 text-sm font-semibold text-white transition hover:bg-(--hover-color)"
          >
            <Save size={16} />
            Save Customer
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[10px] border border-slate-200 bg-slate-50/80 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">Customer Information</h2>

            <div className="mt-5 sm:mt-6 grid gap-4 sm:gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs sm:text-sm font-medium text-slate-700">First Name</span>
                <input
                  type="text"
                  placeholder="Enter first name"
                  className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs sm:text-sm font-medium text-slate-700">Last Name</span>
                <input
                  type="text"
                  placeholder="Enter last name"
                  className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-xs sm:text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs sm:text-sm font-medium text-slate-700">Phone</span>
                <input
                  type="tel"
                  placeholder="+20 1xx xxx xxxx"
                  className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs sm:text-sm font-medium text-slate-700">Governorate</span>
                <input
                  type="text"
                  placeholder="Enter governorate"
                  className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-xs sm:text-sm font-medium text-slate-700">City</span>
                <input
                  type="text"
                  placeholder="Enter city"
                  className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </label>
            </div>
          </section>

          <section className="rounded-[10px] border border-slate-200 bg-linear-to-r from-[#003334] to-[#014849d7] p-4 sm:p-6 text-white shadow-sm">
            <div className="flex items-start sm:items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-2.5 sm:p-3 shrink-0">
                <UserPlus size={20} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold">Ready for Integration</h2>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-200">
                  This screen is prepared for your create flow and keeps the same visual style as the rest of the dashboard.
                </p>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 rounded-[10px] bg-white/10 p-3.5 sm:p-4">
              <p className="text-xs sm:text-sm text-slate-200">Next step</p>
              <p className="mt-1.5 sm:mt-2 text-base sm:text-lg font-semibold">Connect submit handling to your customer API.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
