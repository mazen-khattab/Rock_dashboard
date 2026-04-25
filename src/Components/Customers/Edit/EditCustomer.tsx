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

const sectionTitleClassName = "text-lg font-semibold text-slate-900";
const sectionCardClassName = "rounded-[10px] border border-slate-200 bg-slate-50/80 p-6";
const inputClassName = "w-full rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100";

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
    console.log("Edit customer payload:", { customerId, ...formData });
  };

  if (!customer || !formData) {
    return <Navigate to="/admin/customers" replace />;
  }

  return (
    <div className="min-h-screen p-6 text-slate-800 shadow-sm">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-6">
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
                Update the profile, access, and location details for{" "}
                <span className="font-semibold text-slate-800">
                  {customer.firstName} {customer.lastName}
                </span>
                .
              </p>
            </div>
          </div>

          <button
            type="submit"
            form="edit-customer-form"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-(--main-color) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--hover-color)"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>

        <form id="edit-customer-form" onSubmit={handleSubmit} className="space-y-6">
          <section className={sectionCardClassName}>
            <h2 className={sectionTitleClassName}>Profile Data</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">First Name</span>
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
                <span className="text-sm font-medium text-slate-700">Last Name</span>
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

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Email</span>
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
                <span className="text-sm font-medium text-slate-700">Phone</span>
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

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Governorate</span>
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
                <span className="text-sm font-medium text-slate-700">City</span>
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
            <div className="flex flex-col gap-2">
              <h2 className={sectionTitleClassName}>Password</h2>
              <p className="text-sm text-slate-500">Leave both fields empty if you do not want to change the password.</p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">New Password</span>
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
                <span className="text-sm font-medium text-slate-700">Confirm Password</span>
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

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Role</span>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  {AVAILABLE_ROLES.map((role) => (
                    <option key={role} value={role}>
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
