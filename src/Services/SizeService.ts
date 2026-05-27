import { isAxiosError } from "axios";
import api from "../API";
import type {
  PaginatedSizes,
  Size,
  SizeDetailsResponse,
  SizeId,
  SizeLookupItem,
  SizeLookupResponse,
} from "../Types/Size";
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

const normalizeSize = (payload: SizeDetailsResponse): Size | null => {
  if (!payload) {
    return null;
  }

  if ("id" in payload) {
    return payload;
  }

  return payload.data ?? null;
};

export const SizeService = {
  async getAllSizes(): Promise<PaginatedSizes> {
    try {
      const response = await api.get<PaginatedSizes>("/sizes");
      
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch sizes."));
    }
  },

  async getSizeById(sizeId: SizeId): Promise<Size> {
    try {
      const response = await api.get<ApiResponse<SizeDetailsResponse>>(`/sizes/${sizeId}`);
      const size = normalizeSize(response.data.data);

      if (!size) {
        throw new Error("Size not found.");
      }

      return size;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch size details."));
    }
  },

  async getSizeLookup(): Promise<SizeLookupItem[]> {
    try {
      const response = await api.get<ApiResponse<SizeLookupResponse>>("/sizes/lookup");
      return normalizeList(response.data.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch size lookup."));
    }
  },
};
