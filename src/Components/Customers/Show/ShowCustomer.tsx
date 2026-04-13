import { useMemo } from "react";
import { ArrowLeft, Mail, MapPinned, Phone, UserRound } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./ShowCustomer.css";
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
      <div className="min-h-screen rounded-3xl bg-white p-6 text-slate-800 shadow-sm">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Customer not found</h1>
          <p className="mt-3 text-slate-500">The customer you are looking for does not exist or could not be loaded.</p>
          <Link
            to="/admin/customers"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-(--main-color) px-4 py-2 text-white transition-colors hover:bg-(--hover-color)"
          >
            <ArrowLeft size={16} />
            <span>Back to Customers</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-slate-800 shadow-sm">
      <div className="space-y-3 mb-8">
        <Link
          to="/admin/customers"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft size={16} />
          Back to customers
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Customer Details</h1>
        </div>
      </div>

      <div className="grid gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
              <UserRound size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Profile Summary</h2>
              <p className="text-sm text-slate-500">Basic customer identity and registered location.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">First Name</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{customer.firstName}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Last Name</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{customer.lastName}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Customer ID</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{customer.id}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
              <Mail size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Contact Information</h2>
              <p className="text-sm text-slate-500">Primary channels to reach the customer.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Email</p>
              <p className="mt-2 font-semibold text-slate-900">{customer.email}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Phone size={16} />
                <span>Phone</span>
              </div>
              <p className="mt-2 font-semibold text-slate-900">{customer.phone}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
              <MapPinned size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Location</h2>
              <p className="text-sm text-slate-500">Governorate and city for the customer profile.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Governorate</p>
              <p className="mt-2 font-semibold text-slate-900">{customer.governorate}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">City</p>
              <p className="mt-2 font-semibold text-slate-900">{customer.city}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
