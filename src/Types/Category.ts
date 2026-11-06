export type CategoryId = number | string;

export interface Category {
  id: CategoryId;
  name: string;
  isActive?: boolean;
  nameAr?: string;
  nameEn?: string;
  [key: string]: unknown;
}

export interface CategoryFormData {
  nameAr: string;
  nameEn: string;
  isActive: boolean;
}

export interface CategoryDetailsAdminDto {
  id?: number;
  nameAr: string;
  nameEn: string;
  isActive: boolean;
}

export interface CategoryLookupItem {
  id?: CategoryId;
  value?: CategoryId;
  label?: string;
  name?: string;
  [key: string]: unknown;
}

export type CategoryListResponse =
  | Category[]
  | {
    data?: Category[];
    items?: Category[];
  };

export interface PaginatedCategories {
  items: Category[];
  totalPages: number;
  totalCount: number;
  pageNumber: number;
}

export type CategoryDetailsResponse = Category | { data?: Category };

export type CategoryLookupResponse =
  | CategoryLookupItem[]
  | {
    data?: CategoryLookupItem[];
    items?: CategoryLookupItem[];
  };

export type CategoryContextValue = {
  categories: Category[];
  selectedCategory: Category | null;
  categoryLookup: CategoryLookupItem[];
  totalCategoryCount: number;
  loading: boolean;
  error: string | null;
  getAllCategories: () => Promise<PaginatedCategories>;
  getCategoryById: (categoryId: CategoryId) => Promise<Category>;
  getCategoryLookup: () => Promise<CategoryLookupItem[]>;
  createCategory: (payload: CategoryFormData) => Promise<Category>;
  updateCategory: (categoryId: CategoryId, payload: CategoryFormData) => Promise<Category>;
  deleteCategory: (categoryId: CategoryId) => Promise<void>;
};