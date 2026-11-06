import { ArrowLeft, Save, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import "./CreateCustomer.css";

export const CreateCustomer = () => {
  return (
    <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
      <div className="mx-auto max-w-5xl rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 border-b border-zinc-800/80 pb-5 sm:pb-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 sm:space-y-3">
            <Link
              to="/admin/customers"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
            >
              <ArrowLeft size={16} />
              Back to customers
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">Create Customer</h1>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                Prepare the customer form and connect it to your API when backend endpoints are ready.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-sm transition"
          >
            <Save size={16} />
            Save Customer
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 sm:p-6 backdrop-blur-xs">
            <h2 className="text-base sm:text-lg font-bold text-zinc-100">Customer Information</h2>

            <div className="mt-5 sm:mt-6 grid gap-4 sm:gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs sm:text-sm font-medium text-zinc-400">First Name</span>
                <input
                  type="text"
                  placeholder="Enter first name"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs sm:text-sm font-medium text-zinc-400">Last Name</span>
                <input
                  type="text"
                  placeholder="Enter last name"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-xs sm:text-sm font-medium text-zinc-400">Email</span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs sm:text-sm font-medium text-zinc-400">Phone</span>
                <input
                  type="tel"
                  placeholder="+20 1xx xxx xxxx"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs sm:text-sm font-medium text-zinc-400">Governorate</span>
                <input
                  type="text"
                  placeholder="Enter governorate"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-xs sm:text-sm font-medium text-zinc-400">City</span>
                <input
                  type="text"
                  placeholder="Enter city"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 sm:p-6 text-zinc-200 shadow-xl">
            <div className="flex items-start sm:items-center gap-3">
              <div className="rounded-xl bg-zinc-800/80 border border-zinc-700/60 p-2.5 sm:p-3 text-zinc-300 shrink-0">
                <UserPlus size={20} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-zinc-100">Ready for Integration</h2>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-zinc-400">
                  This screen is prepared for your create flow and keeps the same visual style as the rest of the dashboard.
                </p>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 rounded-xl border border-zinc-800 bg-zinc-950/80 p-3.5 sm:p-4">
              <p className="text-xs text-zinc-400">Next step</p>
              <p className="mt-1 text-sm sm:text-base font-semibold text-zinc-100">Connect submit handling to your customer API.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
