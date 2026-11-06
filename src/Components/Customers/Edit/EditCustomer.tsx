import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";

import { MOCK_CUSTOMERS, type Customer } from "../../../Types/Customer";

const AVAILABLE_ROLES = ["user", "admin", "owner"] as const;

type CustomerRole = (typeof AVAILABLE_ROLES)[number];

type CustomerFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  governorate: string;
  city: string;
  password: string;
  confirmPassword: string;
  role: CustomerRole;
};

const buildInitialFormData = (customer: Customer): CustomerFormData => ({
  firstName: customer.firstName,
  lastName: customer.lastName,
  email: customer.email,
  phone: customer.phone,
  governorate: customer.governorate,
  city: customer.city,
  password: "",
  confirmPassword: "",
  role: "user",
});

type FormFieldElement = HTMLInputElement | HTMLSelectElement;

const sectionTitleClassName = "text-base sm:text-lg font-bold text-zinc-100";
const sectionCardClassName = "rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 sm:p-6 backdrop-blur-xs";
const inputClassName =
  "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600";

export const EditCustomer = () => {
  const { customerId } = useParams();
  const { state } = useLocation();

  const customer = useMemo(() => {
    const stateCustomer = (state as { customer?: Customer })?.customer;
    return stateCustomer ?? MOCK_CUSTOMERS.find((item) => item.id === customerId);
  }, [customerId, state]);

  const [formData, setFormData] = useState(() => (customer ? buildInitialFormData(customer) : null));

  const handleChange = (event: ChangeEvent<FormFieldElement>) => {
    const { name, value } = event.target;
    setFormData((current) => (current ? { ...current, [name]: value } : current));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  if (!customer || !formData) {
    return <Navigate to="/admin/customers" replace />;
  }

  return (
    <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
      <div className="w-full rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
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
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">Edit Customer</h1>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                Update the profile, access, and location details for{" "}
                <span className="font-semibold text-zinc-200">
                  {customer.firstName} {customer.lastName}
                </span>
                .
              </p>
            </div>
          </div>

          <button
            type="submit"
            form="edit-customer-form"
            className="inline-flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>

        <form id="edit-customer-form" onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <section className={sectionCardClassName}>
            <h2 className={sectionTitleClassName}>Profile Data</h2>

            <div className="mt-5 sm:mt-6 grid gap-4 sm:gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs sm:text-sm font-medium text-zinc-400">First Name</span>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={inputClassName}
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs sm:text-sm font-medium text-zinc-400">Last Name</span>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className={inputClassName}
                />
              </label>
            </div>
          </section>

          <section className={sectionCardClassName}>
            <h2 className={sectionTitleClassName}>Contact Info</h2>

            <div className="mt-5 sm:mt-6 grid gap-4 sm:gap-5 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-xs sm:text-sm font-medium text-zinc-400">Email Address</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={inputClassName}
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs sm:text-sm font-medium text-zinc-400">Phone Number</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+20 1xx xxx xxxx"
                  className={inputClassName}
                />
              </label>
            </div>
          </section>

          <section className={sectionCardClassName}>
            <h2 className={sectionTitleClassName}>Location</h2>

            <div className="mt-5 sm:mt-6 grid gap-4 sm:gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs sm:text-sm font-medium text-zinc-400">Governorate</span>
                <input
                  type="text"
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleChange}
                  placeholder="Enter governorate"
                  className={inputClassName}
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs sm:text-sm font-medium text-zinc-400">City</span>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className={inputClassName}
                />
              </label>
            </div>
          </section>

          <section className={sectionCardClassName}>
            <div className="flex flex-col gap-1">
              <h2 className={sectionTitleClassName}>Password</h2>
              <p className="text-xs sm:text-sm text-zinc-400">Leave both fields empty if you do not want to change the password.</p>
            </div>

            <div className="mt-5 sm:mt-6 grid gap-4 sm:gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs sm:text-sm font-medium text-zinc-400">New Password</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className={inputClassName}
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs sm:text-sm font-medium text-zinc-400">Confirm Password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className={inputClassName}
                />
              </label>
            </div>
          </section>

          <section className={sectionCardClassName}>
            <h2 className={sectionTitleClassName}>Permission</h2>

            <div className="mt-5 sm:mt-6 grid gap-4 sm:gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs sm:text-sm font-medium text-zinc-400">Role</span>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  {AVAILABLE_ROLES.map((role) => (
                    <option key={role} value={role} className="bg-zinc-950 text-zinc-100">
                      {role}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};
