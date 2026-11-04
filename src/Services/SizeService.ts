import { isAxiosError } from "axios";
import api from "../API";
import type {
  PaginatedSizes,
  Size,
  SizeDetailsDto,
  SizeDetailsResponse,
  SizeFormData,
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

  const raw = ("id" in payload || "name" in payload)
    ? (payload as any)
    : (payload.data as any) ?? null;

  if (!raw) return null;

  return {
    ...raw,
    sortOrder: typeof raw.sortOrder === "number" ? raw.sortOrder : Number(raw.sortOrder || 0),
  } as Size;
};

export const SizeService = {
  /**
   * Fetches all sizes with pagination info.
   * Endpoint: GET /api/Sizes
   */
  async getAllSizes(): Promise<PaginatedSizes> {
    try {
      const response = await api.get<PaginatedSizes>("/Sizes");
      const items = (response.data.items ?? []).map((item) => ({
        ...item,
        sortOrder: typeof item.sortOrder === "number" ? item.sortOrder : Number(item.sortOrder || 0),
      }));

      return {
        ...response.data,
        items,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch sizes."));
    }
  },

  /**
   * Fetches a single size by its unique ID.
   * Endpoint: GET /api/Sizes/{id}
   */
  async getSizeById(sizeId: SizeId): Promise<Size> {
    try {
      const response = await api.get<ApiResponse<SizeDetailsResponse>>(`/Sizes/${sizeId}`);
      const size = normalizeSize(response.data.data);

      if (!size) {
        throw new Error("Size not found.");
      }

      if (!size.id) {
        size.id = sizeId;
      }

      return size;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch size details."));
    }
  },

  /**
   * Fetches the size lookup list for dropdown selects.
   * Endpoint: GET /api/Sizes/lookup
   */
  async getSizeLookup(): Promise<SizeLookupItem[]> {
    try {
      const response = await api.get<ApiResponse<SizeLookupResponse>>("/Sizes/lookup");

      return normalizeList(response.data.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch size lookup."));
    }
  },

  /**
   * Creates a new size with its sort order and active status.
   * Endpoint: POST /api/Sizes/admin/create
   */
  async createSize(payload: SizeFormData): Promise<Size> {
    try {
      const response = await api.post<ApiResponse<SizeDetailsDto | Size>>(
        "/Sizes/admin/create",
        {
          name: payload.name.trim(),
          sortOrder: Number(payload.sortOrder),
          isActive: payload.isActive,
        },
      );

      const responseData = response.data?.data;
      const id = (responseData as any)?.id ?? (response.data as any)?.id ?? Date.now();
      const name = (responseData as any)?.name ?? payload.name;
      const sortOrder = Number((responseData as any)?.sortOrder ?? payload.sortOrder);

      return {
        id,
        name,
        sortOrder,
        isActive: payload.isActive,
        ...(typeof responseData === "object" ? responseData : {}),
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to create size."));
    }
  },

  /**
   * Updates an existing size.
   * Target endpoint: PUT /api/Sizes/admin/{id}/edit (follows the Product admin pattern)
   * Ready for direct use once the backend endpoint is added.
   */
  async updateSize(sizeId: SizeId, payload: SizeFormData): Promise<Size> {
    try {
      const response = await api.put<ApiResponse<Size>>(
        `/Sizes/admin/${sizeId}/edit`,
        {
          name: payload.name.trim(),
          sortOrder: Number(payload.sortOrder),
          isActive: payload.isActive,
        },
      );

      const responseData = response.data?.data;
      const normalized = normalizeSize(responseData as SizeDetailsResponse);

      return (
        normalized ?? {
          id: sizeId,
          name: payload.name,
          sortOrder: Number(payload.sortOrder),
          isActive: payload.isActive,
        }
      );
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to update size."));
    }
  },

  /**
   * Deletes a size by ID.
   * Target endpoint: DELETE /api/Sizes/admin/{id}/delete (follows the Product admin pattern)
   * Ready for direct use once the backend endpoint is added.
   */
  async deleteSize(sizeId: SizeId): Promise<void> {
    try {
      await api.delete(`/Sizes/admin/${sizeId}/delete`);
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to delete size."));
    }
  },
};
