import { useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronLeft, Package, UserRound } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./ShowOrder.css";
import { MOCK_ORDERS, orderStatusClassName, type Order } from "../../../Types/Order";

export const ShowOrder = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const locationState = location.state as { order?: Order } | null;

  // userMemo here to cache the order and prevent research in MOCK_ORDERS each render
  // useMemo will work each time the orderId and state change
  const order = useMemo(() => {
    if (locationState?.order) {
      return locationState.order;
    }

    return MOCK_ORDERS.find((currentOrder) => currentOrder.id === orderId);
  }, [locationState, orderId]);

  // Initialize state for tracking which items are expanded/open
  // Record<string, boolean> means an object where keys are item IDs and values are true/false
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    const firstItemId = order?.items[0]?.id;
    return firstItemId ? { [firstItemId]: true } : {};
  });

  // Toggles the visibility of a specific item
  const toggleItem = (itemId: string) => {
    setOpenItems((currentState) => ({
      ...currentState,
      [itemId]: !currentState[itemId],
    }));
  };

  if (!order) {
    return (
      <div className="min-h-screen rounded-3xl bg-white p-6 text-slate-800 shadow-sm">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Order not found</h1>
          <p className="mt-3 text-slate-500">The order you are looking for does not exist or could not be loaded.</p>
          <Link
            to="/admin/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-(--main-color) px-4 py-2 text-white transition-colors hover:bg-(--hover-color)"
          >
            <ChevronLeft size={16} />
            <span>Back to Orders</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen rounded-3xl p-6 text-slate-800 shadow-sm">
        <div className="space-y-3 mb-8">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Order Details</h1>
          </div>
        </div>

      <div className="grid gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
              <Package size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Order Summary</h2>
              <p className="text-sm text-slate-500">Main order number, status, and total amount.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Order Number</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{order.number}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Total Price</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">${order.totalPrice.toFixed(2)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Status</p>
              <div className="mt-3">
                <span className={`rounded-full border px-4 py-2 text-sm font-medium ${orderStatusClassName[order.status]}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
              <UserRound size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Customer Information</h2>
              <p className="text-sm text-slate-500">All contact and delivery details for this order.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">User Name</p>
              <p className="mt-2 font-semibold text-slate-900">{order.userName}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">User Email</p>
              <p className="mt-2 font-semibold text-slate-900">{order.userEmail}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Phone</p>
              <p className="mt-2 font-semibold text-slate-900">{order.phone}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5 md:col-span-2 xl:col-span-1">
              <p className="text-sm text-slate-500">Address</p>
              <p className="mt-2 font-semibold text-slate-900">{order.fullAddress}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">City</p>
              <p className="mt-2 font-semibold text-slate-900">{order.city}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Governorate</p>
              <p className="mt-2 font-semibold text-slate-900">{order.governorate}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">Order Items</h2>
            <p className="mt-1 text-sm text-slate-500">Expand each product to view the selected variant details.</p>
          </div>

          <div className="space-y-4">
            {order.items.map((item) => {
              const isOpen = Boolean(openItems[item.id]);

              return (
                <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-100"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{item.productName}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        ${item.productPrice.toFixed(2)} • Qty {item.variantQuantity} • {item.variantColor}
                      </p>
                    </div>

                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="grid gap-5 border-t border-slate-200 bg-white p-5 lg:grid-cols-[220px_1fr]">
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                        <img src={item.variantImage} alt={item.productName} className="h-full w-full object-cover" />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <p className="text-sm text-slate-500">Product Description</p>
                          <p className="mt-2 leading-7 text-slate-700">{item.productDescription}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Product Price</p>
                          <p className="mt-2 font-semibold text-slate-900">${item.productPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Variant Color</p>
                          <p className="mt-2 font-semibold text-slate-900">{item.variantColor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Variant Size</p>
                          <p className="mt-2 font-semibold text-slate-900">{item.variantSize}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Variant Quantity</p>
                          <p className="mt-2 font-semibold text-slate-900">{item.variantQuantity}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
