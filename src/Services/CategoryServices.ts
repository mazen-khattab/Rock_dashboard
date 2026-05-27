import { isAxiosError } from "axios";
import api from "../API";
import type { Category, CategoryDetailsResponse, CategoryId, CategoryLookupItem, CategoryLookupResponse, PaginatedCategories } from "../Types/Category";
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

  if ("id" in payload) {
    return payload;
  }

  return payload.data ?? null;
};

export const CategoryServices = {
  async getAllCategories(): Promise<PaginatedCategories> {
    try {
      const response = await api.get<PaginatedCategories>("/categories");
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch categories."));
    }
  },

  async getCategoryById(categoryId: CategoryId): Promise<Category> {
    try {
      const response = await api.get<ApiResponse<CategoryDetailsResponse>>(`/categories/${categoryId}`);
      const category = normalizeCategory(response.data.data);

      if (!category) {
        throw new Error("Category not found.");
      }

      return category;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch category details."));
    }
  },

  async getCategoryLookup(): Promise<CategoryLookupItem[]> {
    try {
      const response = await api.get<ApiResponse<CategoryLookupResponse>>("/categories/lookup/2");
      
      return normalizeList(response.data.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch category lookup."));
    }
  },
};
