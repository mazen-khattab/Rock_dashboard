import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { OrderService } from "../Services/OrderService";
import type { Order, OrderContextValue } from "../Types/Order";

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export const OrderProvider = ({ children }: PropsWithChildren) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches all admin orders with pagination support.
   */
  const getAllOrders = useCallback(async (pageNumber = 1, pageSize = 12) => {
    setLoading(true);
    setError(null);

    try {
      const data = await OrderService.getAllOrders(pageNumber, pageSize);
      const items = data.items ?? [];
      const count = data.totalCount ?? items.length;

      setOrders(items);
      setTotalOrderCount(count);

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch orders.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches order details by ID and caches the selected order.
   */
  const getOrderById = useCallback(async (orderId: number | string) => {
    setLoading(true);
    setError(null);

    try {
      const order = await OrderService.getOrderById(orderId);

      setSelectedOrder(order);
      setOrders((currentOrders) => {
        const existingIndex = currentOrders.findIndex((item) => String(item.id) === String(order.id));

        if (existingIndex === -1) {
          return [...currentOrders, order];
        }

        return currentOrders.map((item) => (String(item.id) === String(order.id) ? order : item));
      });

      return order;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch order details.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      orders,
      selectedOrder,
      totalOrderCount,
      loading,
      error,
      getAllOrders,
      getOrderById,
    }),
    [orders, selectedOrder, totalOrderCount, loading, error, getAllOrders, getOrderById],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider.");
  }

  return context;
};
