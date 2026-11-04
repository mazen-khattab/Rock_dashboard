import { isAxiosError } from "axios";
import api from "../API";
import type {
  Category,
  CategoryDetailsAdminDto,
  CategoryDetailsResponse,
  CategoryId,
  CategoryFormData,
  CategoryLookupItem,
  CategoryLookupResponse,
  PaginatedCategories,
} from "../Types/Category";
import type { ApiResponse } from "../Types/auth";

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallbackMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

const normalizeList = <T>(payload: T[] | { data?: T[]; items?: T[] }): T[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
};

const normalizeCategory = (payload: CategoryDetailsResponse): Category | null => {
  if (!payload) {
    return null;
  }

  if ("id" in payload || "name" in payload) {
    return payload as Category;
  }

  return (payload.data as Category) ?? null;
};

export const CategoryServices = {
  /**
   * Fetches all categories with pagination info.
   * Endpoint: GET /api/Categories
   */
  async getAllCategories(): Promise<PaginatedCategories> {
    try {
      const response = await api.get<PaginatedCategories>("/Categories");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch categories."));
    }
  },

  /**
   * Fetches a single category by its unique ID.
   * Endpoint: GET /api/Categories/{id}
   */
  async getCategoryById(categoryId: CategoryId): Promise<Category> {
    try {
      const response = await api.get<ApiResponse<CategoryDetailsResponse>>(`/Categories/${categoryId}`);
      const category = normalizeCategory(response.data.data);

      if (!category) {
        throw new Error("Category not found.");
      }

      if (!category.id) {
        category.id = categoryId;
      }

      return category;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch category details."));
    }
  },

  /**
   * Fetches the category lookup list for select dropdowns.
   * Endpoint: GET /api/Categories/lookup
   */
  async getCategoryLookup(): Promise<CategoryLookupItem[]> {
    try {
      const response = await api.get<ApiResponse<CategoryLookupResponse>>("/Categories/lookup");

      return normalizeList(response.data.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch category lookup."));
    }
  },

  /**
   * Creates a new category with English and Arabic translations.
   * Endpoint: POST /api/Categories/admin/create
   */
  async createCategory(payload: CategoryFormData): Promise<Category> {
    try {
      const response = await api.post<ApiResponse<CategoryDetailsAdminDto | Category>>(
        "/Categories/admin/create",
        payload,
      );

      const responseData = response.data?.data;
      const id = (responseData as any)?.id ?? (response.data as any)?.id ?? Date.now();
      const name = (responseData as any)?.name ?? (payload.nameEn || payload.nameAr);

      return {
        id,
        name,
        nameEn: payload.nameEn,
        nameAr: payload.nameAr,
        isActive: payload.isActive,
        ...(typeof responseData === "object" ? responseData : {}),
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to create category."));
    }
  },

  /**
   * Updates an existing category.
   * Target endpoint: PUT /api/Categories/admin/{id}/edit (follows the Product admin pattern)
   * Ready for direct use once the backend endpoint is added.
   */
  async updateCategory(categoryId: CategoryId, payload: CategoryFormData): Promise<Category> {
    try {
      const response = await api.put<ApiResponse<Category>>(
        `/Categories/admin/${categoryId}/edit`,
        payload,
      );

      const responseData = response.data?.data;
      const normalized = normalizeCategory(responseData as CategoryDetailsResponse);

      return (
        normalized ?? {
          id: categoryId,
          name: payload.nameEn || payload.nameAr,
          nameEn: payload.nameEn,
          nameAr: payload.nameAr,
          isActive: payload.isActive,
        }
      );
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to update category."));
    }
  },

  /**
   * Deletes a category by ID.
   * Target endpoint: DELETE /api/Categories/admin/{id}/delete (follows the Product admin pattern)
   * Ready for direct use once the backend endpoint is added.
   */
  async deleteCategory(categoryId: CategoryId): Promise<void> {
    try {
      await api.delete(`/Categories/admin/${categoryId}/delete`);
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to delete category."));
    }
  },
};
