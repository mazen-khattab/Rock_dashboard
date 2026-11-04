import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  Clock,
  Mail,
  MapPin,
  Package,
  Phone,
  Ruler,
  Tag,
  UserRound,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useOrder } from "../../../Context/OrderContext";
import { getOrderStatusBadge, type Order } from "../../../Types/Order";

export const ShowOrder = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const { getOrderById } = useOrder();

  const locationState = location.state as { order?: Order } | null;
  const [order, setOrder] = useState<Order | null>(locationState?.order ?? null);
  const [loading, setLoading] = useState(!locationState?.order?.items?.length);
  const [error, setError] = useState<string | null>(null);

  // Track expanded item cards
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!orderId) return;

    // Fetch full order details if items list isn't populated from list state
    if (!locationState?.order?.items?.length) {
      setLoading(true);
      setError(null);

      getOrderById(orderId)
        .then((fetched) => {
          setOrder(fetched);
          // Open first item by default
          if (fetched.items && fetched.items.length > 0) {
            setOpenItems({ [fetched.items[0].id]: true });
          }
        })
        .catch((err) => {
          const message = err instanceof Error ? err.message : "Failed to load order details.";
          setError(message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Open first item
      if (locationState.order.items.length > 0) {
        setOpenItems({ [locationState.order.items[0].id]: true });
      }
    }
  }, [orderId, getOrderById, locationState]);

  const toggleItem = (itemId: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen rounded-3xl bg-white p-12 text-center text-slate-800 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
          <p className="text-slate-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen rounded-3xl bg-white p-6 text-slate-800 shadow-sm">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Order not found</h1>
          <p className="mt-3 text-slate-500">
            {error ?? "The order you are looking for does not exist or could not be loaded."}
          </p>
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

  const orderNumber = order.orderNumber || order.number || `#${order.id}`;
  const customerName = order.customerName || order.customer || order.userName || "Customer";
  const items = order.items ?? order.orderDetails ?? [];
  const dateFormatted = formatDate(order.createdAt || order.created);

  return (
    <div className="min-h-screen p-6 text-slate-800 shadow-sm">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft size={16} />
            Back to orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Order Details
            </h1>
            <span className="font-mono text-lg font-semibold text-slate-600">
              {orderNumber}
            </span>
          </div>
        </div>

        <div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium ${getOrderStatusBadge(
              order.status,
            )}`}
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Order Summary Section */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
              <Package size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Order Summary</h2>
              <p className="text-sm text-slate-500">
                Main order number, status, created date, and total amount.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Tag size={16} />
                <span>Order Number</span>
              </div>
              <p className="mt-2 font-mono text-xl font-bold text-slate-900">{orderNumber}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Tag size={16} />
                <span>Total Amount</span>
              </div>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {typeof order.totalPrice === "number" ? `${order.totalPrice.toFixed(2)} EGP` : "—"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock size={16} />
                <span>Order Date</span>
              </div>
              <p className="mt-2 text-base font-semibold text-slate-800">{dateFormatted}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Package size={16} />
                <span>Items Count</span>
              </div>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {items.reduce((sum, item) => sum + (item.variantQuantity || item.quantity || 1), 0)} item(s)
              </p>
            </div>
          </div>
        </section>

        {/* Customer & Delivery Information Section */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
              <UserRound size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Customer & Delivery</h2>
              <p className="text-sm text-slate-500">Recipient contact information and delivery address.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <UserRound size={16} />
                <span>Customer Name</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-slate-900">{customerName}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Mail size={16} />
                <span>Email Address</span>
              </div>
              <p className="mt-2 font-semibold text-slate-900">{order.email || order.userEmail || "—"}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Phone size={16} />
                <span>Phone Number</span>
              </div>
              <p className="mt-2 font-semibold text-slate-900">{order.phone || "—"}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin size={16} />
                <span>City & Governorate</span>
              </div>
              <p className="mt-2 font-semibold text-slate-900">
                {order.city ? `${order.city}` : ""}{order.governorate ? `, ${order.governorate}` : "—"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 md:col-span-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin size={16} />
                <span>Full Delivery Address</span>
              </div>
              <p className="mt-2 font-semibold text-slate-900">{order.fullAddress || "—"}</p>
            </div>
          </div>
        </section>

        {/* Order Items Section */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Purchased Items</h2>
              <p className="text-sm text-slate-500">
                Products, variants, and price breakdown for this order.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {items.length} product(s)
            </span>
          </div>

          {items.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              No product items listed for this order.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const isOpen = Boolean(openItems[item.id]);
                const name = item.productName || item.name || "Product";
                const price = Number(item.unitPrice ?? item.productPrice ?? 0);
                const qty = Number(item.variantQuantity ?? item.quantity ?? 1);
                const color = item.variantColor || item.colorName || "";
                const size = item.variantSize || item.sizeName || "";
                const img = item.variantImage || item.image || "";

                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-4">
                        {/* Thumbnail */}
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white shrink-0 overflow-hidden">
                          {img ? (
                            <img src={img} alt={name} className="h-full w-full object-cover" />
                          ) : (
                            <Package size={20} className="text-slate-400" />
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">{name}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span>{price.toFixed(2)} EGP</span>
                            <span>&bull;</span>
                            <span>Qty: {qty}</span>
                            {color && (
                              <>
                                <span>&bull;</span>
                                <span className="inline-flex items-center gap-1">
                                  {item.hexCode && (
                                    <span
                                      className="inline-block h-2.5 w-2.5 rounded-full border border-slate-300"
                                      style={{ backgroundColor: item.hexCode }}
                                    />
                                  )}
                                  {color}
                                </span>
                              </>
                            )}
                            {size && (
                              <>
                                <span>&bull;</span>
                                <span className="font-semibold text-slate-700">Size: {size}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900">
                          {(item.totalPrice ?? (price * qty)).toFixed(2)} EGP
                        </span>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 text-slate-500 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="grid gap-5 border-t border-slate-200 bg-white p-5 lg:grid-cols-[200px_1fr]">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                          {img ? (
                            <img src={img} alt={name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-40 items-center justify-center text-slate-400">
                              <Package size={36} />
                            </div>
                          )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {item.productDescription && (
                            <div className="sm:col-span-2 lg:col-span-3">
                              <p className="text-xs font-medium text-slate-500 uppercase">
                                Description
                              </p>
                              <p className="mt-1 leading-6 text-slate-700">
                                {item.productDescription || item.description}
                              </p>
                            </div>
                          )}

                          <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium text-slate-500 uppercase">Unit Price</p>
                            <p className="mt-1 font-semibold text-slate-900">{price.toFixed(2)} EGP</p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium text-slate-500 uppercase">Quantity</p>
                            <p className="mt-1 font-semibold text-slate-900">{qty}</p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium text-slate-500 uppercase">Line Total</p>
                            <p className="mt-1 font-bold text-slate-900">
                              {(item.totalPrice ?? (price * qty)).toFixed(2)} EGP
                            </p>
                          </div>

                          {color && (
                            <div className="rounded-xl bg-slate-50 p-4">
                              <p className="text-xs font-medium text-slate-500 uppercase">Selected Color</p>
                              <div className="mt-1 flex items-center gap-2">
                                {item.hexCode && (
                                  <span
                                    className="h-4 w-4 rounded-full border border-slate-300"
                                    style={{ backgroundColor: item.hexCode }}
                                  />
                                )}
                                <span className="font-semibold text-slate-900">{color}</span>
                              </div>
                            </div>
                          )}

                          {size && (
                            <div className="rounded-xl bg-slate-50 p-4">
                              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 uppercase">
                                <Ruler size={13} />
                                <span>Selected Size</span>
                              </div>
                              <p className="mt-1 font-semibold text-slate-900">{size}</p>
                            </div>
                          )}

                          {item.discount ? (
                            <div className="rounded-xl bg-slate-50 p-4">
                              <p className="text-xs font-medium text-slate-500 uppercase">Discount</p>
                              <p className="mt-1 font-semibold text-emerald-600">
                                -{item.discount.toFixed(2)} EGP
                              </p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
