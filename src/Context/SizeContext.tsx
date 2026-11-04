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
  SizeFormData,
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

  /**
   * Fetches all sizes and updates state.
   */
  const getAllSizes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await SizeService.getAllSizes();
      const items = data.items ?? [];
      const count = data.totalCount ?? items.length;

      setSizes(items);
      setTotalSizeCount(count);

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch sizes.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches a single size by ID and updates selectedSize & cache.
   */
  const getSizeById = useCallback(async (sizeId: SizeId) => {
    setLoading(true);
    setError(null);

    try {
      const size = await SizeService.getSizeById(sizeId);

      setSelectedSize(size);
      setSizes((currentSizes) => {
        const existingIndex = currentSizes.findIndex((item) => String(item.id) === String(size.id));

        if (existingIndex === -1) {
          return [...currentSizes, size];
        }

        return currentSizes.map((item) => (String(item.id) === String(size.id) ? size : item));
      });

      return size;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch size details.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches size lookup items for dropdown selects.
   */
  const getSizeLookup = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await SizeService.getSizeLookup();
      setSizeLookup(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch size lookup.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Creates a new size and adds it to local state.
   */
  const createSize = useCallback(async (payload: SizeFormData) => {
    setLoading(true);
    setError(null);

    try {
      const created = await SizeService.createSize(payload);

      setSizes((currentSizes) => [created, ...currentSizes]);
      setTotalSizeCount((currentCount) => currentCount + 1);

      return created;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create size.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Updates an existing size and syncs local state.
   * Directly ready to hit backend PUT once endpoint is created.
   */
  const updateSize = useCallback(async (sizeId: SizeId, payload: SizeFormData) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await SizeService.updateSize(sizeId, payload);

      setSizes((currentSizes) =>
        currentSizes.map((item) => (String(item.id) === String(sizeId) ? updated : item)),
      );

      setSelectedSize((current) =>
        current && String(current.id) === String(sizeId) ? updated : current,
      );

      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update size.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Deletes a size and removes it from local state.
   * Directly ready to hit backend DELETE once endpoint is created.
   */
  const deleteSize = useCallback(async (sizeId: SizeId) => {
    setLoading(true);
    setError(null);

    try {
      await SizeService.deleteSize(sizeId);

      setSizes((currentSizes) =>
        currentSizes.filter((item) => String(item.id) !== String(sizeId)),
      );
      setTotalSizeCount((currentCount) => Math.max(0, currentCount - 1));

      setSelectedSize((current) =>
        current && String(current.id) === String(sizeId) ? null : current,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete size.";
      setError(message);
      throw err;
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
      createSize,
      updateSize,
      deleteSize,
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
      createSize,
      updateSize,
      deleteSize,
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
