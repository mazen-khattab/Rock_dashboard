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

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Tops", nameEn: "Tops", nameAr: "ملابس علوية", isActive: true },
  { id: 2, name: "Bottoms", nameEn: "Bottoms", nameAr: "بناطيل وبنطلونات", isActive: true },
  { id: 3, name: "Dresses", nameEn: "Dresses", nameAr: "فساتين", isActive: true },
  { id: 4, name: "Outerwear", nameEn: "Outerwear", nameAr: "ملابس خارجية", isActive: true },
  { id: 5, name: "Accessories", nameEn: "Accessories", nameAr: "إكسسوارات", isActive: true },
];
