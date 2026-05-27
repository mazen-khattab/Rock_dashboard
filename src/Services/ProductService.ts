import { isAxiosError } from "axios";
import api from "../API";
import type { PaginatedProducts, Product } from "../Types/Product";

/**
 * Defines the possible shapes of the Product List API response.
 * Supports a direct array or an object containing a 'data' or 'items' key and pagination information.
 */
type ProductListResponse = Product[] | {
  data?: Product[];
  items?: Product[];
  totalPages: number;
  totalCount: number;
  pageNumber: number;
};

/**
 * Defines the possible shapes of a Single Product API response.
 */
type ProductDetailsResponse = Product | { data?: Product };

/**
 * Extracts a human-readable error message from an unknown error object.
 * Primarily handles Axios errors and falls back to a provided default message.
 */
const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  // Check if the error is a standard Axios error
  if (isAxiosError<{ message?: string }>(error)) {
    // Attempt to get the server's custom error message
    return error.response?.data?.message ?? fallbackMessage;
  }

  // Check if it's a standard JavaScript Error object
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

/**
 * Normalizes different API response formats into a consistent Product array.
 * Ensures the UI always receives an array regardless of the backend's wrapping logic.
 */
// const normalizeProducts = (payload: ProductListResponse) => {
//   // return payload
//   // Case 1: Payload is a direct array [{}, {}]
//   if (Array.isArray(payload)) {
//     console.log("the first case is working");
//     return payload;
//   }

//   // Case 2: Payload is an object with a 'data' property and pagination info
//   if (Array.isArray(payload.data)) {
//     console.log("the second case is working");
//     return {
//       items: payload.data,
//       totalCount: payload.totalCount,
//       totalPages: payload.totalPages,
//       pageNumber: payload.pageNumber,
//     };
//   }

//   // Case 3: Payload is an object with an 'items' property (common in paginated APIs) and pagination info
//   if (Array.isArray(payload.items)) {
//     console.log("the third case is working");
//     return {
//       items: payload.items,
//       totalCount: payload.totalCount,
//       totalPages: payload.totalPages,
//       pageNumber: payload.pageNumber
//     };
//   }

//   // Defensive fallback: Return empty array to prevent .map() crashes in the UI
//   return [];
// };

// const normalizeProducts = (payload: ProductListResponse): PaginatedProducts => {
//   const products = Array.isArray(payload)
//     ? payload
//     : (payload.items || payload.data || []);

//   return {
//     products,
//     pagination: {
//       totalPages: (!Array.isArray(payload) && payload.totalPages) ? payload.totalPages : 1,
//       totalCount: (!Array.isArray(payload) && payload.totalCount) ? payload.totalCount : products.length,
//       pageNumber: (!Array.isArray(payload) && payload.pageNumber) ? payload.pageNumber : 1,
//     }
//   };
// };

/**
 * Normalizes a single product response, extracting it from nested 'data' if necessary.
 */
const normalizeProduct = (payload: ProductDetailsResponse): Product | null => {
  if (!payload) {
    return null;
  }

  // Type Guard: Check if 'id' exists directly on the object
  // like { id: "123", name: "Product A", ... }
  if ("id" in payload) {
    return payload;
  }

  // If not direct, look inside the 'data' wrapper
  return payload.data ?? null;
};

/**
 * Service to handle all product-related API communications.
 * Encapsulates data fetching and normalization logic away from UI components.
 */
export const ProductService = {
  /**
   * Fetches all products and returns a normalized array.
   */
  async getAllProducts(pageNumber: number, pageSize: number, category?: string, size?: string, color?: string): Promise<PaginatedProducts> {
    try {
      const response = await api.get<PaginatedProducts>("/Products/admin/2", {
        params: {
          pageNumber,
          pageSize,
          category,
          size,
          color,
        },
      });

      return response.data
    } catch (error) {
      console.error("Error fetching products:", error);
      // Re-throw with a sanitized error message
      throw new Error(getErrorMessage(error, "Failed to fetch products."));
    }
  },

  /**
   * Creates a new product using multipart/form-data.
   */
  async createProduct(payload: FormData): Promise<Product> {
    try {
      const response = await api.post<ProductDetailsResponse>("/Products/admin/Products", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      console.log("Raw API response for created product:", response.data);

      const product = normalizeProduct(response.data);

      if (!product) {
        throw new Error("Created product response was empty.");
      }

      return product;
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error(getErrorMessage(error, "Failed to create product."));
    }
  },

  // /**
  //  * Fetches a single product by its unique ID.
  //  * @param productId - The unique identifier of the product.
  //  */
  // async getProductById(productId: string): Promise<Product> {
  //   try {
  //     const response = await api.get<ProductDetailsResponse>(`/products/${productId}`);
  //     const product = normalizeProduct(response.data);

  //     // Explicitly check if normalization failed to find a product
  //     if (!product) {
  //       throw new Error("Product not found.");
  //     }

  //     return product;
  //   } catch (error) {
  //     throw new Error(getErrorMessage(error, "Failed to fetch product details."));
  //   }
  // },
};
