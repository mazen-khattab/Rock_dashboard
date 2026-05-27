import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { SizeService } from "../Services/SizeService";
import type {
  Size,
  SizeContextValue,
  SizeId,
  SizeLookupItem,
} from "../Types/Size";

const SizeContext = createContext<SizeContextValue | undefined>(undefined);

export const SizeProvider = ({ children }: PropsWithChildren) => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [totalSizeCount, setTotalSizeCount] = useState(0);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [sizeLookup, setSizeLookup] = useState<SizeLookupItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllSizes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await SizeService.getAllSizes();

      setSizes(data.items);
      setTotalSizeCount(data.totalCount);

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch sizes.";
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSizeById = useCallback(async (sizeId: SizeId) => {
    setLoading(true);
    setError(null);

    try {
      const size = await SizeService.getSizeById(sizeId);

      setSelectedSize(size);
      setSizes((currentSizes) => {
        const existingIndex = currentSizes.findIndex((item) => item.id === size.id);

        if (existingIndex === -1) {
          return [...currentSizes, size];
        }

        return currentSizes.map((item) => (item.id === size.id ? size : item));
      });

      return size;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch size details.";
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSizeLookup = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await SizeService.getSizeLookup();
      setSizeLookup(data);
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch size lookup.";
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      sizes,
      selectedSize,
      sizeLookup,
      loading,
      error,
      totalSizeCount,
      getAllSizes,
      getSizeById,
      getSizeLookup,
    }),
    [
      sizes,
      selectedSize,
      sizeLookup,
      loading,
      error,
      totalSizeCount,
      getAllSizes,
      getSizeById,
      getSizeLookup,
    ],
  );

  return <SizeContext.Provider value={value}>{children}</SizeContext.Provider>;
};

export const useSize = () => {
  const context = useContext(SizeContext);

  if (!context) {
    throw new Error("useSize must be used within a SizeProvider.");
  }

  return context;
};
