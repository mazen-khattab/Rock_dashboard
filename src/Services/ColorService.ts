import { isAxiosError } from "axios";
import api from "../API";
import type { ApiResponse } from "../Types/auth";
import type {
  Color,
  ColorDetailsAdminDto,
  ColorDetailsResponse,
  ColorFormData,
  ColorId,
  ColorLookupItem,
  ColorLookupResponse,
  PaginatedColors,
} from "../Types/Color";

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

const normalizeColor = (payload: ColorDetailsResponse): Color | null => {
  if (!payload) {
    return null;
  }

  const raw = ("id" in payload || "name" in payload || "hexCode" in payload || "hex" in payload)
    ? (payload as any)
    : (payload.data as any) ?? null;

  if (!raw) return null;

  const hex = raw.hexCode ?? raw.hex ?? "#000000";

  return {
    ...raw,
    hex,
    hexCode: hex,
  } as Color;
};

export const ColorService = {
  /**
   * Fetches all colors with pagination info.
   * Endpoint: GET /api/Colors
   */
  async getAllColors(): Promise<PaginatedColors> {
    try {
      const response = await api.get<PaginatedColors>("/Colors");
      const items = (response.data.items ?? []).map((item) => {
        const hex = (item as any).hexCode ?? (item as any).hex ?? "#000000";
        return {
          ...item,
          hex,
          hexCode: hex,
        };
      });

      return {
        ...response.data,
        items,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch colors."));
    }
  },

  /**
   * Fetches a single color by its unique ID.
   * Endpoint: GET /api/Colors/{id}
   */
  async getColorById(colorId: ColorId): Promise<Color> {
    try {
      const response = await api.get<ApiResponse<ColorDetailsResponse>>(`/Colors/${colorId}`);
      const color = normalizeColor(response.data.data);

      if (!color) {
        throw new Error("Color not found.");
      }

      if (!color.id) {
        color.id = colorId;
      }

      return color;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch color details."));
    }
  },

  /**
   * Fetches the color lookup list for dropdown selects.
   * Endpoint: GET /api/Colors/lookup
   */
  async getColorLookup(): Promise<ColorLookupItem[]> {
    try {
      const response = await api.get<ApiResponse<ColorLookupResponse>>("/Colors/lookup");

      return normalizeList(response.data.data).map((item) => {
        const hex = (item as any).hexCode ?? (item as any).hex ?? "#000000";
        return {
          ...item,
          hex,
          hexCode: hex,
        };
      });
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch color lookup."));
    }
  },

  /**
   * Creates a new color with hex code and Arabic/English translations.
   * Endpoint: POST /api/Colors/admin/create
   */
  async createColor(payload: ColorFormData): Promise<Color> {
    try {
      const hex = payload.hex || payload.hexCode || "#000000";
      const response = await api.post<ApiResponse<ColorDetailsAdminDto | Color>>(
        "/Colors/admin/create",
        {
          nameAr: payload.nameAr,
          nameEn: payload.nameEn,
          hexCode: hex,
          isActive: payload.isActive,
        },
      );

      const responseData = response.data?.data;
      const id = (responseData as any)?.id ?? (response.data as any)?.id ?? Date.now();
      const name = (responseData as any)?.name ?? (payload.nameEn || payload.nameAr);

      return {
        id,
        name,
        nameEn: payload.nameEn,
        nameAr: payload.nameAr,
        hex,
        hexCode: hex,
        isActive: payload.isActive,
        ...(typeof responseData === "object" ? responseData : {}),
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to create color."));
    }
  },

  /**
   * Updates an existing color.
   * Target endpoint: PUT /api/Colors/admin/{id}/edit (follows the Product admin pattern)
   * Ready for direct use once the backend endpoint is added.
   */
  async updateColor(colorId: ColorId, payload: ColorFormData): Promise<Color> {
    try {
      const hex = payload.hex || payload.hexCode || "#000000";
      const response = await api.put<ApiResponse<Color>>(
        `/Colors/admin/${colorId}/edit`,
        {
          nameAr: payload.nameAr,
          nameEn: payload.nameEn,
          hexCode: hex,
          isActive: payload.isActive,
        },
      );

      const responseData = response.data?.data;
      const normalized = normalizeColor(responseData as ColorDetailsResponse);

      return (
        normalized ?? {
          id: colorId,
          name: payload.nameEn || payload.nameAr,
          nameEn: payload.nameEn,
          nameAr: payload.nameAr,
          hex,
          hexCode: hex,
          isActive: payload.isActive,
        }
      );
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to update color."));
    }
  },

  /**
   * Deletes a color by ID.
   * Target endpoint: DELETE /api/Colors/admin/{id}/delete (follows the Product admin pattern)
   * Ready for direct use once the backend endpoint is added.
   */
  async deleteColor(colorId: ColorId): Promise<void> {
    try {
      await api.delete(`/Colors/admin/${colorId}/delete`);
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to delete color."));
    }
  },
};
