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
      <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
        <div className="rounded-2xl sm:rounded-3xl bg-zinc-950 p-8 sm:p-12 text-center text-zinc-300 shadow-2xl border border-zinc-800">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-zinc-400" />
            <p className="text-sm sm:text-base text-zinc-400">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black p-3.5 sm:p-6 text-zinc-200">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-10 text-center shadow-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">Order not found</h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            {error ?? "The order you are looking for does not exist or could not be loaded."}
          </p>
          <Link
            to="/admin/orders"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-200 transition hover:bg-zinc-750 hover:text-zinc-100"
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
    <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-4 sm:pb-6">
        <div className="space-y-2">
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
          >
            <ArrowLeft size={15} />
            Back to orders
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              Order Details
            </h1>
            <span className="font-mono text-base sm:text-lg font-semibold text-zinc-200 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-lg">
              {orderNumber}
            </span>
          </div>
        </div>

        <div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs sm:text-sm font-medium ${getOrderStatusBadge(
              order.status,
            )}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {/* Order Summary Section */}
        <section className="rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
          <div className="mb-4 sm:mb-5 flex items-center gap-3.5">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 shrink-0">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">Order Summary</h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Main order number, status, created date, and total amount.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                <Tag size={15} className="text-zinc-400" />
                <span>Order Number</span>
              </div>
              <p className="mt-1.5 font-mono text-lg sm:text-xl font-bold text-zinc-200 truncate">{orderNumber}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                <Tag size={15} className="text-zinc-400" />
                <span>Total Amount</span>
              </div>
              <p className="mt-1.5 text-lg sm:text-xl font-bold text-zinc-100">
                {typeof order.totalPrice === "number" ? `${order.totalPrice.toFixed(2)} EGP` : "—"}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                <Clock size={15} className="text-zinc-400" />
                <span>Order Date</span>
              </div>
              <p className="mt-1.5 text-sm sm:text-base font-semibold text-zinc-200">{dateFormatted}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                <Package size={15} className="text-zinc-400" />
                <span>Items Count</span>
              </div>
              <p className="mt-1.5 text-lg sm:text-xl font-bold text-zinc-100">
                {items.reduce((sum, item) => sum + (item.variantQuantity || item.quantity || 1), 0)} item(s)
              </p>
            </div>
          </div>
        </section>

        {/* Customer & Delivery Information Section */}
        <section className="rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
          <div className="mb-4 sm:mb-5 flex items-center gap-3.5">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 shrink-0">
              <UserRound size={24} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">Customer & Delivery</h2>
              <p className="text-xs sm:text-sm text-zinc-400">Recipient contact information and delivery address.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                <UserRound size={15} className="text-zinc-400" />
                <span>Customer Name</span>
              </div>
              <p className="mt-1.5 text-base sm:text-lg font-semibold text-zinc-100">{customerName}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                <Mail size={15} className="text-zinc-400" />
                <span>Email Address</span>
              </div>
              <p className="mt-1.5 font-semibold text-sm sm:text-base text-zinc-200 break-all">{order.email || order.userEmail || "—"}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                <Phone size={15} className="text-zinc-400" />
                <span>Phone Number</span>
              </div>
              <p className="mt-1.5 font-semibold text-sm sm:text-base text-zinc-200">{order.phone || "—"}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                <MapPin size={15} className="text-zinc-400" />
                <span>City & Governorate</span>
              </div>
              <p className="mt-1.5 font-semibold text-sm sm:text-base text-zinc-200">
                {order.city ? `${order.city}` : ""}{order.governorate ? `, ${order.governorate}` : "—"}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 sm:p-4 sm:col-span-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                <MapPin size={15} className="text-zinc-400" />
                <span>Full Delivery Address</span>
              </div>
              <p className="mt-1.5 font-semibold text-sm sm:text-base text-zinc-200">{order.fullAddress || "—"}</p>
            </div>
          </div>
        </section>

        {/* Order Items Section */}
        <section className="rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
          <div className="mb-4 sm:mb-5 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">Purchased Items</h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Products, variants, and price breakdown for this order.
              </p>
            </div>
            <span className="rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-300">
              {items.length} product(s)
            </span>
          </div>

          {items.length === 0 ? (
            <div className="py-8 text-center text-xs sm:text-sm text-zinc-500">
              No product items listed for this order.
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
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
                    className="overflow-hidden rounded-xl sm:rounded-2xl border border-zinc-800 bg-zinc-900/60"
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className="flex w-full cursor-pointer flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 text-left transition-colors hover:bg-zinc-850/60"
                    >
                      <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 shrink-0 overflow-hidden">
                          {img ? (
                            <img src={img} alt={name} className="h-full w-full object-cover" />
                          ) : (
                            <Package size={18} className="text-zinc-500" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm sm:text-base text-zinc-100 truncate">{name}</p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-zinc-400">
                            <span>{price.toFixed(2)} EGP</span>
                            <span>&bull;</span>
                            <span>Qty: {qty}</span>
                            {color && (
                              <>
                                <span>&bull;</span>
                                <span className="inline-flex items-center gap-1">
                                  {item.hexCode && (
                                    <span
                                      className="inline-block h-2 w-2 rounded-full border border-zinc-700"
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
                                <span className="font-semibold text-zinc-300">Size: {size}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                        <span className="font-bold text-sm sm:text-base text-zinc-100">
                          {(item.totalPrice ?? price * qty).toFixed(2)} EGP
                        </span>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 text-zinc-400 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="grid gap-4 sm:gap-5 border-t border-zinc-800 bg-zinc-950/80 p-3.5 sm:p-5 lg:grid-cols-[180px_1fr]">
                        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 max-h-48 flex items-center justify-center">
                          {img ? (
                            <img src={img} alt={name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-32 items-center justify-center text-zinc-500">
                              <Package size={32} />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {item.productDescription && (
                            <div className="sm:col-span-2 lg:col-span-3">
                              <p className="text-[11px] font-semibold text-zinc-400 uppercase">
                                Description
                              </p>
                              <p className="mt-1 text-xs sm:text-sm leading-5 text-zinc-300">
                                {item.productDescription || item.description}
                              </p>
                            </div>
                          )}

                          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
                            <p className="text-[11px] font-semibold text-zinc-400 uppercase">Unit Price</p>
                            <p className="mt-1 font-semibold text-xs sm:text-sm text-zinc-200">{price.toFixed(2)} EGP</p>
                          </div>

                          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
                            <p className="text-[11px] font-semibold text-zinc-400 uppercase">Quantity</p>
                            <p className="mt-1 font-semibold text-xs sm:text-sm text-zinc-200">{qty}</p>
                          </div>

                          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
                            <p className="text-[11px] font-semibold text-zinc-400 uppercase">Line Total</p>
                            <p className="mt-1 font-bold text-xs sm:text-sm text-zinc-100">
                              {(item.totalPrice ?? price * qty).toFixed(2)} EGP
                            </p>
                          </div>

                          {color && (
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
                              <p className="text-[11px] font-semibold text-zinc-400 uppercase">Selected Color</p>
                              <div className="mt-1 flex items-center gap-1.5">
                                {item.hexCode && (
                                  <span
                                    className="h-3.5 w-3.5 rounded-full border border-zinc-700"
                                    style={{ backgroundColor: item.hexCode }}
                                  />
                                )}
                                <span className="font-semibold text-xs sm:text-sm text-zinc-200">{color}</span>
                              </div>
                            </div>
                          )}

                          {size && (
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
                              <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 uppercase">
                                <Ruler size={12} />
                                <span>Selected Size</span>
                              </div>
                              <p className="mt-1 font-semibold text-xs sm:text-sm text-zinc-200">{size}</p>
                            </div>
                          )}

                          {item.discount ? (
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
                              <p className="text-[11px] font-semibold text-zinc-400 uppercase">Discount</p>
                              <p className="mt-1 font-semibold text-xs sm:text-sm text-emerald-400">
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
