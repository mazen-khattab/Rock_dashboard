import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { ProductService } from "../Services/ProductService";
import type { Product, ProductContextValue, } from "../Types/Product";

/**
 * Initialize the context with undefined. 
 * This helps us catch cases where the hook is used outside of the provider.
 */
const ProductContext = createContext<ProductContextValue | undefined>(undefined);

/**
 * The Provider component that wraps your app (or a section of it).
 * It manages the state and provides it to all children via Context.
 */
export const ProductProvider = ({ children }: PropsWithChildren) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches all products and updates the local state.
   * Wrapped in useCallback to prevent unnecessary re-renders in components using this function.
   */
  const getAllProducts = useCallback(async (pageNumber: number, pageSize: number, category?: string, size?: string, color?: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await ProductService.getAllProducts(pageNumber, pageSize, category, size, color);

      setProducts(data.items);
      setTotalProductCount(data.totalCount);
      
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      const message = error instanceof Error ? error.message : "Failed to fetch products.";
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Creates a new product and adds it to the local cache.
   */
  const createProduct = useCallback(async (payload: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const product = await ProductService.createProduct(payload);

      setProducts((currentProducts) => [product, ...currentProducts]);
      setTotalProductCount((currentCount) => currentCount + 1);

      return product;
    } catch (error) {
      console.error("Error creating product:", error);
      const message = error instanceof Error ? error.message : "Failed to create product.";
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches a single product and intelligently updates it in the global list.
   * If the product exists in the list, it updates it; otherwise, it appends it.
   */
  // const getProductById = useCallback(
  //   async (productId: string) => {
  //     setLoading(true);
  //     setError(null);

  //     try {
  //       const product = await ProductService.getProductById(productId);

  //       // Update the products array state while maintaining immutability
  //       setProducts((currentProducts) => {
  //         const existingIndex = currentProducts.findIndex((item) => item.id === product.id);

  //         // If product not in list, add it
  //         if (existingIndex === -1) {
  //           return [...currentProducts, product];
  //         }

  //         // If product exists, replace only that specific item to ensure data is fresh
  //         return currentProducts.map((item) => (item.id === product.id ? product : item));
  //       });

  //       return product;
  //     } catch (error) {
  //       const message = error instanceof Error ? error.message : "Failed to fetch product details.";
  //       setError(message);
  //       throw error;
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [],
  // );

  /**
   * Memoize the context value to prevent consumers from re-rendering 
   * unless one of these specific dependencies actually changes.
   */
  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      totalProductCount,
      getAllProducts,
      createProduct,
      // getProductById,
    }),
    [createProduct, error, getAllProducts, loading, products, totalProductCount],
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

/**
 * Custom hook to easily access the ProductContext.
 * Includes a safety check to ensure it's used within a ProductProvider.
 */
export const useProduct = () => {
  const context = useContext(ProductContext);

  if (!context) {
    // This error is a lifesaver during development
    throw new Error("useProduct must be used within a ProductProvider.");
  }

  return context;
};
