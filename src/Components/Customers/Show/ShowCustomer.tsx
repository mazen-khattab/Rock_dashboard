import { useMemo } from "react";
import { ArrowLeft, Mail, MapPinned, Phone, UserRound } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { MOCK_CUSTOMERS, type Customer } from "../../../Types/Customer";

export const ShowCustomer = () => {
  const { customerId } = useParams();
  const location = useLocation();
  const locationState = location.state as { customer?: Customer } | null;

  const customer = useMemo(() => {
    if (locationState?.customer) {
      return locationState.customer;
    }

    return MOCK_CUSTOMERS.find((item) => item.id === customerId);
  }, [customerId, locationState]);

  if (!customer) {
    return (
      <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
        <div className="rounded-2xl sm:rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-10 text-center shadow-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">Customer not found</h1>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-zinc-400">
            The customer you are looking for does not exist or could not be loaded.
          </p>
          <Link
            to="/admin/customers"
            className="mt-5 sm:mt-6 inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
          >
            <ArrowLeft size={16} />
            <span>Back to Customers</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
      <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
        <Link
          to="/admin/customers"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
        >
          <ArrowLeft size={16} />
          Back to customers
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">Customer Details</h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">View customer profile and registered destination information.</p>
        </div>
      </div>

      <div className="grid gap-5 sm:gap-6">
        <section className="rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
          <div className="mb-4 sm:mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-zinc-800/80 border border-zinc-700/60 p-2.5 sm:p-3 text-zinc-300 shrink-0">
              <UserRound size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-100">Profile Summary</h2>
              <p className="text-xs sm:text-sm text-zinc-400">Basic customer identity and identifier.</p>
            </div>
          </div>

          <div className="grid gap-3.5 sm:gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">First Name</p>
              <p className="mt-1.5 sm:mt-2 text-lg sm:text-xl font-bold text-zinc-100">{customer.firstName}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Last Name</p>
              <p className="mt-1.5 sm:mt-2 text-lg sm:text-xl font-bold text-zinc-100">{customer.lastName}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Customer ID</p>
              <p className="mt-1.5 sm:mt-2 font-mono text-lg sm:text-xl font-bold text-zinc-200">#{customer.id}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
          <div className="mb-4 sm:mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-zinc-800/80 border border-zinc-700/60 p-2.5 sm:p-3 text-zinc-300 shrink-0">
              <Mail size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-100">Contact Information</h2>
              <p className="text-xs sm:text-sm text-zinc-400">Primary channels to reach the customer.</p>
            </div>
          </div>

          <div className="grid gap-3.5 sm:gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Email Address</p>
              <p className="mt-1.5 sm:mt-2 font-semibold text-sm sm:text-base text-zinc-200 break-all">{customer.email}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                <Phone size={14} className="text-zinc-400" />
                <span>Phone Number</span>
              </div>
              <p className="mt-1.5 sm:mt-2 font-mono font-semibold text-sm sm:text-base text-zinc-200">{customer.phone}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
          <div className="mb-4 sm:mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-zinc-800/80 border border-zinc-700/60 p-2.5 sm:p-3 text-zinc-300 shrink-0">
              <MapPinned size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-100">Location</h2>
              <p className="text-xs sm:text-sm text-zinc-400">Governorate and city for the customer profile.</p>
            </div>
          </div>

          <div className="grid gap-3.5 sm:gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Governorate</p>
              <p className="mt-1.5 sm:mt-2 font-semibold text-sm sm:text-base text-zinc-200">{customer.governorate}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">City</p>
              <p className="mt-1.5 sm:mt-2 font-semibold text-sm sm:text-base text-zinc-200">{customer.city}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
