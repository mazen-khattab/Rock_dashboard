import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { CategoryServices } from "../Services/CategoryServices"
import {
  type Category,
  type CategoryContextValue,
  type CategoryId,
  type CategoryLookupItem,
} from "../Types/Category"

const CategoryContext = createContext<CategoryContextValue | undefined>(undefined);

export const CategoryProvider = ({ children }: PropsWithChildren) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCategoryCount, setTotalCategoryCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryLookup, setCategoryLookup] = useState<CategoryLookupItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await CategoryServices.getAllCategories();
      
      setCategories(data.items);
      setTotalCategoryCount(data.totalCount);
      
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch categories.";
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

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
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch category details.";
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategoryLookup = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await CategoryServices.getCategoryLookup();
      setCategoryLookup(data);
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch category lookup.";
      setError(message);
      throw error;
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
