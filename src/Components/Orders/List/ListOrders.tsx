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
    <div className="min-h-screen rounded-3xl p-6 text-slate-800 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor customer orders, delivery destinations, and payment statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void getAllOrders(currentPage, rowsPerPage).catch(() => {})}
            disabled={loading}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="Refresh orders"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="font-semibold">Unable to load orders from server</div>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-col gap-4">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2">
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
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? "bg-(--main-color) text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by order #, customer, city, or ID..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
          </div>

          <div className="text-sm text-slate-500">
            Total: <span className="font-semibold text-slate-800">{orders.length}</span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="min-w-max w-full table-auto">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 text-[12px] sm:text-[14px] lg:text-[16px]">
            <tr>
              <th className="px-5 py-3.5 text-left font-medium whitespace-nowrap">Order Number</th>
              <th className="px-5 py-3.5 text-left font-medium whitespace-nowrap">Customer</th>
              <th className="px-5 py-3.5 text-left font-medium whitespace-nowrap">City</th>
              <th className="px-5 py-3.5 text-left font-medium whitespace-nowrap">Total Price</th>
              <th className="px-5 py-3.5 text-left font-medium whitespace-nowrap">Status</th>
              <th className="px-5 py-3.5 text-left font-medium whitespace-nowrap">Created Date</th>
              <th className="px-5 py-3.5 text-right font-medium whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-[12px] sm:text-[14px] lg:text-[16px]">
            {loading && orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCw size={24} className="animate-spin text-teal-600" />
                    <span>Loading orders...</span>
                  </div>
                </td>
              </tr>
            ) : currentOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center justify-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                      <Package size={24} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                      {searchQuery || selectedStatus !== "All"
                        ? "No matching orders"
                        : "No orders yet"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
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
                    className="cursor-pointer transition-colors hover:bg-slate-50/80 focus:bg-slate-50 focus:outline-none"
                  >
                    {/* Order Number */}
                    <td className="px-5 py-4 whitespace-nowrap font-mono text-sm font-semibold text-slate-900">
                      {orderNumber}
                    </td>

                    {/* Customer Name */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-medium text-slate-800">{customer}</span>
                    </td>

                    {/* City */}
                    <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                      {order.city || "—"}
                    </td>

                    {/* Total Price */}
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-slate-900">
                      {typeof order.totalPrice === "number"
                        ? `${order.totalPrice.toFixed(2)} EGP`
                        : "—"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getOrderStatusBadge(
                          order.status,
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {order.status}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-500">
                      {dateDisplay}
                    </td>

                    {/* Actions: View only (no add, update, or delete) */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div
                        className="inline-flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          to={`${order.id}`}
                          state={{ order }}
                          className="rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                          title="View Details"
                        >
                          <Eye size={16} />
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
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[12px] sm:text-[14px] text-slate-500">
          Showing {filteredOrders.length === 0 ? 0 : from + 1} to{" "}
          {Math.min(from + rowsPerPage, filteredOrders.length)} of {totalRows} row(s)
        </div>

        <div className="flex items-center gap-6 text-[12px] sm:text-[14px]">
          <div className="flex items-center gap-2">
            <span className="hidden text-slate-600 sm:block">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 outline-none focus:border-teal-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-slate-600 sm:block">
              Page {currentPage} of {totalPages || 1}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="rounded border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                title="First Page"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                title="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="rounded border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                title="Next Page"
              >
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="rounded border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                title="Last Page"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
