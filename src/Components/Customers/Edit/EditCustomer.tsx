import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { MOCK_CUSTOMERS, type Customer } from "../../../Types/Customer";

export const EditCustomer = () => {
  const { customerId } = useParams();
  const { state } = useLocation();

  const customer = useMemo(() => {
    const stateCustomer = (state as { customer?: Customer })?.customer;
    return stateCustomer ?? MOCK_CUSTOMERS.find((item) => item.id === customerId);
  }, [customerId, state]);

  const [formData, setFormData] = useState(() =>
    customer
      ? {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          governorate: customer.governorate,
          city: customer.city,
        }
      : null,
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => (current ? { ...current, [name]: value } : current));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Edit customer payload:", { customerId, ...formData });
  };

  if (!customer || !formData) {
    return <Navigate to="/admin/customers" replace />;
  }

  return (
    <div className="min-h-screen p-6 text-slate-800 shadow-sm">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-6">
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Link
              to="/admin/customers"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
            >
              <ArrowLeft size={16} />
              Back to customers
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">Edit Customer</h1>
              <p className="mt-2 text-sm text-slate-500">
                Updating <span className="font-semibold text-slate-800">{customer.firstName} {customer.lastName}</span>
              </p>
            </div>
          </div>

          <button
            type="submit"
            form="edit-customer-form"
            className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-(--main-color) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--hover-color)"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>

        <form id="edit-customer-form" onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">First Name</span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Last Name</span>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Phone</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Governorate</span>
            <input
              type="text"
              name="governorate"
              value={formData.governorate}
              onChange={handleChange}
              className="w-full rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">City</span>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
          </label>
        </form>
      </div>
    </div>
  );
};
