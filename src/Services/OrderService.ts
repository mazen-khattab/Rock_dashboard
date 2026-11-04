import { isAxiosError } from "axios";
import api from "../API";
import type { ApiResponse } from "../Types/auth";
import type {
  Order,
  OrderDetailsResponse,
  OrderItem,
  PaginatedOrders,
} from "../Types/Order";

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallbackMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

const normalizeOrderItem = (raw: any): OrderItem => {
  const name = raw.name || raw.productName || "Product";
  const desc = raw.description || raw.productDescription || "";
  const price = Number(raw.unitPrice ?? raw.productPrice ?? 0);
  const qty = Number(raw.quantity ?? raw.variantQuantity ?? 1);
  const total = Number(raw.totalPrice ?? (price * qty));
  const img = raw.image || raw.variantImage || "";
  const color = raw.colorName || raw.variantColor || "";
  const size = raw.sizeName || raw.variantSize || "";

  return {
    id: raw.id,
    variantId: raw.variantId,
    productId: raw.productId,
    name,
    productName: name,
    description: desc,
    productDescription: desc,
    productPrice: price,
    unitPrice: price,
    discount: Number(raw.discount ?? 0),
    totalPrice: total,
    variantImage: img,
    image: img,
    variantColor: color,
    colorName: color,
    hexCode: raw.hexCode,
    variantSize: size,
    sizeName: size,
    variantQuantity: qty,
    quantity: qty,
  };
};

const normalizeOrder = (raw: any): Order => {
  const id = raw.id;
  const number = raw.orderNumber || raw.number || `#${id}`;
  const customer = raw.customerName || raw.customer || raw.userName || "Customer";
  const rawItems = raw.orderDetails || raw.items || [];
  const items = Array.isArray(rawItems) ? rawItems.map(normalizeOrderItem) : [];
  const totalPrice = Number(raw.totalPrice ?? 0);
  const createdAt = raw.createdAt || raw.created || "";

  return {
    ...raw,
    id,
    number,
    orderNumber: number,
    customer,
    customerName: customer,
    userName: raw.userName || customer,
    userEmail: raw.email || raw.userEmail || "",
    email: raw.email || raw.userEmail || "",
    phone: raw.phone || "",
    totalPrice,
    fullAddress: raw.fullAddress || "",
    governorate: raw.governorate || "",
    city: raw.city || "",
    status: raw.status || "Pending",
    createdAt,
    created: createdAt,
    items,
    orderDetails: items,
  };
};

export const OrderService = {
  /**
   * Fetches all admin orders with pagination info.
   * Endpoint: GET /api/Orders/admin
   */
  async getAllOrders(pageNumber = 1, pageSize = 12): Promise<PaginatedOrders> {
    try {
      const response = await api.get<PaginatedOrders>("/Orders/admin", {
        params: {
          PageNumber: pageNumber,
          PageSize: pageSize,
        },
      });

      const rawItems = response.data?.items ?? [];
      const items = Array.isArray(rawItems) ? rawItems.map(normalizeOrder) : [];

      return {
        ...response.data,
        items,
        totalCount: response.data?.totalCount ?? items.length,
        totalPages: response.data?.totalPages ?? 1,
        pageNumber: response.data?.pageNumber ?? pageNumber,
        pageSize: response.data?.pageSize ?? pageSize,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch orders."));
    }
  },

  /**
   * Fetches a single order details by its ID.
   * Endpoint: GET /api/Orders/admin/{id}
   */
  async getOrderById(orderId: number | string): Promise<Order> {
    try {
      const response = await api.get<ApiResponse<OrderDetailsResponse>>(`/Orders/admin/${orderId}`);
      const raw = response.data?.data ?? response.data;

      if (!raw) {
        throw new Error("Order not found.");
      }

      return normalizeOrder(raw);
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch order details."));
    }
  },
};
