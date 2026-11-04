import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { CategoryServices } from "../Services/CategoryServices";
import {
  type Category,
  type CategoryContextValue,
  type CategoryFormData,
  type CategoryId,
  type CategoryLookupItem,
} from "../Types/Category";

const CategoryContext = createContext<CategoryContextValue | undefined>(undefined);

export const CategoryProvider = ({ children }: PropsWithChildren) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCategoryCount, setTotalCategoryCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryLookup, setCategoryLookup] = useState<CategoryLookupItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches all categories and updates state.
   */
  const getAllCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await CategoryServices.getAllCategories();
      const items = data.items ?? [];
      const count = data.totalCount ?? items.length;

      setCategories(items);
      setTotalCategoryCount(count);

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch categories.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches a single category by ID and updates selectedCategory & cache.
   */
  const getCategoryById = useCallback(async (categoryId: CategoryId) => {
    setLoading(true);
    setError(null);

    try {
      const category = await CategoryServices.getCategoryById(categoryId);

      setSelectedCategory(category);
      setCategories((currentCategories) => {
        const existingIndex = currentCategories.findIndex((item) => item.id === category.id);

        if (existingIndex === -1) {
          return [...currentCategories, category];
        }

        return currentCategories.map((item) => (item.id === category.id ? category : item));
      });

      return category;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch category details.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches category lookup items for dropdown selects.
   */
  const getCategoryLookup = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await CategoryServices.getCategoryLookup();
      setCategoryLookup(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch category lookup.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Creates a new category and adds it to local state.
   */
  const createCategory = useCallback(async (payload: CategoryFormData) => {
    setLoading(true);
    setError(null);

    try {
      const created = await CategoryServices.createCategory(payload);

      setCategories((currentCategories) => [created, ...currentCategories]);
      setTotalCategoryCount((currentCount) => currentCount + 1);

      return created;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create category.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Updates an existing category and syncs local state.
   * Directly ready to hit backend PUT once endpoint is created.
   */
  const updateCategory = useCallback(async (categoryId: CategoryId, payload: CategoryFormData) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await CategoryServices.updateCategory(categoryId, payload);

      setCategories((currentCategories) =>
        currentCategories.map((item) => (item.id === categoryId ? updated : item)),
      );

      setSelectedCategory((current) =>
        current?.id === categoryId ? updated : current,
      );

      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update category.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Deletes a category and removes it from local state.
   * Directly ready to hit backend DELETE once endpoint is created.
   */
  const deleteCategory = useCallback(async (categoryId: CategoryId) => {
    setLoading(true);
    setError(null);

    try {
      await CategoryServices.deleteCategory(categoryId);

      setCategories((currentCategories) =>
        currentCategories.filter((item) => item.id !== categoryId),
      );
      setTotalCategoryCount((currentCount) => Math.max(0, currentCount - 1));

      setSelectedCategory((current) => (current?.id === categoryId ? null : current));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete category.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      categories,
      selectedCategory,
      categoryLookup,
      loading,
      error,
      totalCategoryCount,
      getAllCategories,
      getCategoryById,
      getCategoryLookup,
      createCategory,
      updateCategory,
      deleteCategory,
    }),
    [
      categories,
      selectedCategory,
      categoryLookup,
      loading,
      error,
      totalCategoryCount,
      getAllCategories,
      getCategoryById,
      getCategoryLookup,
      createCategory,
      updateCategory,
      deleteCategory,
    ],
  );

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};

export const useCategory = () => {
  const context = useContext(CategoryContext);

  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider.");
  }

  return context;
};
