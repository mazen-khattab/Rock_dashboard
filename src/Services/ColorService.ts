import { isAxiosError } from "axios";
import api from "../API";
import type { ApiResponse } from "../Types/auth";
import type {
  Color,
  ColorDetailsResponse,
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

  if ("id" in payload) {
    return payload;
  }

  return payload.data ?? null;
};

export const ColorService = {
  async getAllColors(): Promise<PaginatedColors> {
    try {
      const response = await api.get<PaginatedColors>("/colors");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch colors."));
    }
  },

  async getColorById(colorId: ColorId): Promise<Color> {
    try {
      const response = await api.get<ApiResponse<ColorDetailsResponse>>(`/colors/${colorId}`);
      const color = normalizeColor(response.data.data);

      if (!color) {
        throw new Error("Color not found.");
      }

      return color;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch color details."));
    }
  },

  async getColorLookup(): Promise<ColorLookupItem[]> {
    try {
      const response = await api.get<ApiResponse<ColorLookupResponse>>("/colors/lookup/2");
      
      return normalizeList(response.data.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch color lookup."));
    }
  },
};
