import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { ColorService } from "../Services/ColorService";
import type {
  Color,
  ColorContextValue,
  ColorFormData,
  ColorId,
  ColorLookupItem,
} from "../Types/Color";

const ColorContext = createContext<ColorContextValue | undefined>(undefined);

export const ColorProvider = ({ children }: PropsWithChildren) => {
  const [colors, setColors] = useState<Color[]>([]);
  const [totalColorCount, setTotalColorCount] = useState(0);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [colorLookup, setColorLookup] = useState<ColorLookupItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches all colors and updates state.
   */
  const getAllColors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await ColorService.getAllColors();
      const items = data.items ?? [];
      const count = data.totalCount ?? items.length;

      setColors(items);
      setTotalColorCount(count);

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch colors.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches a single color by ID and updates selectedColor & cache.
   */
  const getColorById = useCallback(async (colorId: ColorId) => {
    setLoading(true);
    setError(null);

    try {
      const color = await ColorService.getColorById(colorId);

      setSelectedColor(color);
      setColors((currentColors) => {
        const existingIndex = currentColors.findIndex((item) => String(item.id) === String(color.id));

        if (existingIndex === -1) {
          return [...currentColors, color];
        }

        return currentColors.map((item) => (String(item.id) === String(color.id) ? color : item));
      });

      return color;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch color details.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches color lookup items for dropdown selects.
   */
  const getColorLookup = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await ColorService.getColorLookup();
      setColorLookup(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch color lookup.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Creates a new color and adds it to local state.
   */
  const createColor = useCallback(async (payload: ColorFormData) => {
    setLoading(true);
    setError(null);

    try {
      const created = await ColorService.createColor(payload);

      setColors((currentColors) => [created, ...currentColors]);
      setTotalColorCount((currentCount) => currentCount + 1);

      return created;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create color.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Updates an existing color and syncs local state.
   * Directly ready to hit backend PUT once endpoint is created.
   */
  const updateColor = useCallback(async (colorId: ColorId, payload: ColorFormData) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await ColorService.updateColor(colorId, payload);

      setColors((currentColors) =>
        currentColors.map((item) => (String(item.id) === String(colorId) ? updated : item)),
      );

      setSelectedColor((current) =>
        current && String(current.id) === String(colorId) ? updated : current,
      );

      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update color.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Deletes a color and removes it from local state.
   * Directly ready to hit backend DELETE once endpoint is created.
   */
  const deleteColor = useCallback(async (colorId: ColorId) => {
    setLoading(true);
    setError(null);

    try {
      await ColorService.deleteColor(colorId);

      setColors((currentColors) =>
        currentColors.filter((item) => String(item.id) !== String(colorId)),
      );
      setTotalColorCount((currentCount) => Math.max(0, currentCount - 1));

      setSelectedColor((current) =>
        current && String(current.id) === String(colorId) ? null : current,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete color.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      colors,
      selectedColor,
      colorLookup,
      loading,
      error,
      totalColorCount,
      getAllColors,
      getColorById,
      getColorLookup,
      createColor,
      updateColor,
      deleteColor,
    }),
    [
      colors,
      selectedColor,
      colorLookup,
      loading,
      error,
      totalColorCount,
      getAllColors,
      getColorById,
      getColorLookup,
      createColor,
      updateColor,
      deleteColor,
    ],
  );

  return <ColorContext.Provider value={value}>{children}</ColorContext.Provider>;
};

export const useColor = () => {
  const context = useContext(ColorContext);

  if (!context) {
    throw new Error("useColor must be used within a ColorProvider.");
  }

  return context;
};
