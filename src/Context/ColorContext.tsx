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

  const getAllColors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await ColorService.getAllColors();

      setColors(data.items);
      setTotalColorCount(data.totalCount);

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch colors.";
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getColorById = useCallback(async (colorId: ColorId) => {
    setLoading(true);
    setError(null);

    try {
      const color = await ColorService.getColorById(colorId);

      setSelectedColor(color);
      setColors((currentColors) => {
        const existingIndex = currentColors.findIndex((item) => item.id === color.id);

        if (existingIndex === -1) {
          return [...currentColors, color];
        }

        return currentColors.map((item) => (item.id === color.id ? color : item));
      });

      return color;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch color details.";
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getColorLookup = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await ColorService.getColorLookup();
      setColorLookup(data);
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch color lookup.";
      setError(message);
      throw error;
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
