import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Package,
  RefreshCw,
  Search,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useOrder } from "../../../Context/OrderContext";
import { getOrderStatusBadge } from "../../../Types/Order";

const STATUS_FILTERS = [
  "All",
  "Pending",
  "Processing",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
];

export const ListOrders = () => {
  const navigate = useNavigate();
  const { orders, loading, error, totalOrderCount, getAllOrders } = useOrder();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    void getAllOrders(currentPage, rowsPerPage).catch(() => {
      console.error("Error fetching orders. Check OrderContext for details.");
    });
  }, [getAllOrders, currentPage, rowsPerPage]);

  // Client-side filtering for fast searching and status tabs
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "All" ||
      order.status?.toLowerCase() === selectedStatus.toLowerCase();

    if (!matchesStatus) return false;

    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const orderNum = (order.orderNumber ?? order.number ?? "").toLowerCase();
    const customer = (order.customerName ?? order.customer ?? "").toLowerCase();
    const city = (order.city ?? "").toLowerCase();
    const status = (order.status ?? "").toLowerCase();
    const id = String(order.id).toLowerCase();

    return (
      orderNum.includes(query) ||
      customer.includes(query) ||
      city.includes(query) ||
      status.includes(query) ||
      id.includes(query)
    );
  });

  const totalRows = filteredOrders.length > 0 ? filteredOrders.length : totalOrderCount;
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / rowsPerPage));
  const from = (currentPage - 1) * rowsPerPage;
  const currentOrders = filteredOrders.slice(from, from + rowsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleOrderRowClick = (orderId: number | string) => {
    navigate(`/admin/orders/${orderId}`);
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

  return (
    <div className="min-h-screen bg-black p-3.5 sm:p-5 lg:p-6 text-zinc-200">
      {/* Header */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">Orders</h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Monitor customer orders, delivery destinations, and payment statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void getAllOrders(currentPage, rowsPerPage).catch(() => {})}
            disabled={loading}
            className="inline-flex h-9 sm:h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 sm:px-3.5 text-xs sm:text-sm font-medium text-zinc-300 shadow-xs transition hover:bg-zinc-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
            title="Refresh orders"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-4 sm:mb-6 rounded-2xl border border-rose-900/40 bg-zinc-900/90 p-3.5 sm:p-4 text-xs sm:text-sm text-rose-300">
          <div className="font-semibold">Unable to load orders from server</div>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
        {/* Status Pills with smooth mobile swipe */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 sm:flex-wrap no-scrollbar">
          {STATUS_FILTERS.map((status) => {
            const isSelected = selectedStatus === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setSelectedStatus(status);
                  setCurrentPage(1);
                }}
                className={`cursor-pointer whitespace-nowrap rounded-full px-3 sm:px-3.5 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    : "border border-zinc-800/90 bg-zinc-900/70 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by order #, customer, city, or ID..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-2 sm:py-2.5 pl-10 pr-4 text-xs sm:text-sm text-zinc-200 outline-none transition placeholder:text-zinc-500 focus:border-zinc-600 focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-700"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-2 text-xs sm:text-sm text-zinc-400">
            <span>Total orders:</span>
            <span className="font-semibold text-zinc-200 bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 rounded-lg">
              {orders.length}
            </span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="w-full overflow-x-auto rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-xl backdrop-blur-sm">
        <table className="min-w-[700px] w-full table-auto">
          <thead className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 text-xs sm:text-sm font-semibold">
            <tr>
              <th className="px-3.5 sm:px-5 py-3 sm:py-3.5 text-left whitespace-nowrap">Order Number</th>
              <th className="px-3.5 sm:px-5 py-3 sm:py-3.5 text-left whitespace-nowrap">Customer</th>
              <th className="px-3.5 sm:px-5 py-3 sm:py-3.5 text-left whitespace-nowrap">City</th>
              <th className="px-3.5 sm:px-5 py-3 sm:py-3.5 text-left whitespace-nowrap">Total Price</th>
              <th className="px-3.5 sm:px-5 py-3 sm:py-3.5 text-left whitespace-nowrap">Status</th>
              <th className="px-3.5 sm:px-5 py-3 sm:py-3.5 text-left whitespace-nowrap">Created Date</th>
              <th className="px-3.5 sm:px-5 py-3 sm:py-3.5 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/60 text-xs sm:text-sm">
            {loading && orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-zinc-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCw size={22} className="animate-spin text-zinc-300" />
                    <span className="text-sm">Loading orders...</span>
                  </div>
                </td>
              </tr>
            ) : currentOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 sm:py-16 text-center px-4">
                  <div className="mx-auto flex max-w-sm flex-col items-center justify-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400">
                      <Package size={22} />
                    </div>
                    <h3 className="mt-3 text-base sm:text-lg font-bold text-zinc-200">
                      {searchQuery || selectedStatus !== "All"
                        ? "No matching orders"
                        : "No orders yet"}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                      {searchQuery || selectedStatus !== "All"
                        ? "Try clearing filters to find what you're looking for."
                        : "Orders placed by customers will appear here."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => {
                const orderNumber = order.orderNumber || order.number || `#${order.id}`;
                const customer = order.customerName || order.customer || "Customer";
                const dateDisplay = formatDate(order.createdAt || order.created);

                return (
                  <tr
                    key={order.id}
                    onClick={() => handleOrderRowClick(order.id)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleOrderRowClick(order.id);
                      }
                    }}
                    className="cursor-pointer transition-colors hover:bg-zinc-850/50 focus:bg-zinc-850/70 focus:outline-none"
                  >
                    {/* Order Number */}
                    <td className="px-3.5 sm:px-5 py-3 whitespace-nowrap font-mono font-medium text-zinc-300">
                      {orderNumber}
                    </td>

                    {/* Customer */}
                    <td className="px-3.5 sm:px-5 py-3 whitespace-nowrap font-medium text-zinc-200">
                      {customer}
                    </td>

                    {/* City */}
                    <td className="px-3.5 sm:px-5 py-3 whitespace-nowrap text-zinc-400">
                      {order.city || "—"}
                    </td>

                    {/* Total Price */}
                    <td className="px-3.5 sm:px-5 py-3 whitespace-nowrap font-semibold text-zinc-100">
                      {typeof order.totalPrice === "number" ? `${order.totalPrice.toFixed(2)} EGP` : "—"}
                    </td>

                    {/* Status */}
                    <td className="px-3.5 sm:px-5 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${getOrderStatusBadge(
                          order.status,
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {order.status}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="px-3.5 sm:px-5 py-3 whitespace-nowrap text-zinc-400">
                      {dateDisplay}
                    </td>

                    {/* Actions: View only */}
                    <td className="px-3.5 sm:px-5 py-3 whitespace-nowrap text-right">
                      <div
                        className="inline-flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          to={`${order.id}`}
                          state={{ order }}
                          className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="mt-4 sm:mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs sm:text-sm text-zinc-400">
          Showing {filteredOrders.length === 0 ? 0 : from + 1} to{" "}
          {Math.min(from + rowsPerPage, filteredOrders.length)} of {totalRows} row(s)
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-6 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Rows:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-zinc-200 outline-none focus:border-zinc-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-zinc-400">
              Page {currentPage} of {totalPages || 1}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="h-8 w-8 sm:h-9 sm:w-9 inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
                title="First Page"
              >
                <ChevronsLeft size={15} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 sm:h-9 sm:w-9 inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
                title="Previous Page"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="h-8 w-8 sm:h-9 sm:w-9 inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
                title="Next Page"
              >
                <ChevronRight size={15} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="h-8 w-8 sm:h-9 sm:w-9 inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
                title="Last Page"
              >
                <ChevronsRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
