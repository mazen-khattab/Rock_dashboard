export type SizeId = string;

export interface Size {
  id: SizeId;
  name: string;
  sortOrder: number;
  isActive: boolean;
  [key: string]: unknown;
}

export interface SizeLookupItem {
  id?: SizeId;
  value?: SizeId;
  label?: string;
  name?: string;
  [key: string]: unknown;
}

export type SizeListResponse =
  | Size[]
  | {
      data?: Size[];
      items?: Size[];
    };

export interface PaginatedSizes {
  items: Size[];
  totalPages: number;
  totalCount: number;
  pageNumber: number;
}

export type SizeDetailsResponse = Size | { data?: Size };

export type SizeLookupResponse =
  | SizeLookupItem[]
  | {
      data?: SizeLookupItem[];
      items?: SizeLookupItem[];
    };

export type SizeContextValue = {
  sizes: Size[];
  selectedSize: Size | null;
  sizeLookup: SizeLookupItem[];
  totalSizeCount: number;
  loading: boolean;
  error: string | null;
  getAllSizes: () => Promise<PaginatedSizes>;
  getSizeById: (sizeId: SizeId) => Promise<Size>;
  getSizeLookup: () => Promise<SizeLookupItem[]>;
};

export type SizeFormData = {
  name: string;
  sortOrder: number;
  isActive: boolean;
};

export const MOCK_SIZES: Size[] = [
  { id: "1", name: "XS", sortOrder: 1, isActive: true },
  { id: "2", name: "S", sortOrder: 2, isActive: true },
  { id: "3", name: "M", sortOrder: 3, isActive: true },
  { id: "4", name: "L", sortOrder: 4, isActive: true },
  { id: "5", name: "XL", sortOrder: 5, isActive: true },
  { id: "6", name: "XXL", sortOrder: 6, isActive: false },
];
