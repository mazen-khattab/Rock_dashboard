interface BaseProduct {
  isActive: boolean;
  price: number;
}

export interface Product extends BaseProduct {
  id: number;
  name: string;
  quantity: number;
  reserved: number;
  available: number;
  sizes: string[];
  imageUrl: string;
  currentPhysicalQuantity?: number;
  reservedQuantity?: number;
  status?: string;
  category: string;
}

export interface ProductFormData extends BaseProduct {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  slugEn: string;
  slugAr: string;
  metaTitleEn: string;
  metaTitleAr: string;
  metaDescriptionEn: string;
  metaDescriptionAr: string;
  variants: CreateVariant[];
  category: number;
}

export interface Variant {
  id: number;
  productId: number;
  imagesDtos: VariantImage[];
  colorName: string;
  hexCode: string;
  sizeName: string;
  quantity: number;
  reserved: number;
}

export interface VariantImage {
  id: number;
  altText: string;
  imageUrl: string;
}

export interface CreateVariant {
  id: string;
  size: string;
  color: string;
  quantity: number;
  images: CreatedVariantImage[];
}

export type CreatedVariantImage = {
  id: string;
  file: File | null;
  previewUrl?: string;
  sortOrder: string;
};

// export type CreatedVariantImage = {
//   id: string;
//   file: File | null;
//   sortOrder: string;
// };

// export type ProductFormData = {
//   nameAr: string;
//   nameEn: string;
//   language: string;
//   category: string;
//   description: string;
//   slug: string;
//   metaTitle: string;
//   metaDescription: string;
//   price: string;
//   isActive: boolean;
//   variants: CreateVariant[];
// };

export interface PaginatedProducts {
  items: Product[];
  totalPages: number;
  totalCount: number;
  pageNumber: number;
}

export type ProductContextValue = {
  products: Product[]; // The global list of products
  loading: boolean;   // Global loading state for product operations
  error: string | null; // Global error message state
  totalProductCount: number; // Total count of products for pagination purposes
  getAllProducts: (pageNumber: number, pageSize: number, category?: string, size?: string, color?: string) => Promise<PaginatedProducts>; // Function to fetch all products
  createProduct: (payload: FormData) => Promise<Product>; // Function to create a new product
  // getProductById: (productId: string) => Promise<Product>; // Function to fetch a single product
};

export const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: "Classic White T-Shirt", category: "Tops", slug: "TS-WHT-M-001", price: 29.99, sizes: ["XS", "S", "M", "L", "XL"], currentPhysicalQuantity: 24, reservedQuantity: 4, isActive: true },
  { id: 2, name: "Slim Fit Jeans", category: "Bottoms", slug: "JN-BLU-32-003", price: 59.99, sizes: ["S", "M", "L", "XL", "XXL"], currentPhysicalQuantity: 0, reservedQuantity: 0, isActive: true },
  { id: 3, name: "Summer Floral Dress", category: "Dresses", slug: "DR-PNK-S-004", price: 79.99, sizes: ["XS", "S", "M", "L"], currentPhysicalQuantity: 12, reservedQuantity: 2, isActive: true },
  { id: 4, name: "Leather Jacket", category: "Outerwear", slug: "JK-BRN-XL-005", price: 149.99, sizes: ["S", "M", "L", "XL"], currentPhysicalQuantity: 4, reservedQuantity: 1, isActive: true },
  { id: 5, name: "Gold Chain Necklace", category: "Accessories", slug: "NC-GLD-XS-007", price: 34.99, sizes: ["XS"], currentPhysicalQuantity: 18, reservedQuantity: 5, isActive: true },
  { id: 6, name: "Striped Long Sleeve Shirt", category: "Tops", slug: "SH-STR-L-008", price: 44.99, sizes: ["XS", "S", "M", "L", "XL", "XXL"], currentPhysicalQuantity: 10, reservedQuantity: 3, isActive: true },
  { id: 7, name: "Cargo Pants", category: "Bottoms", slug: "PT-CRG-M-009", price: 69.99, sizes: ["S", "M", "L", "XL"], currentPhysicalQuantity: 6, reservedQuantity: 2, status: "Draft" },
  { id: 8, name: "Evening Gown", category: "Dresses", slug: "GW-EVG-L-010", price: 199.99, sizes: ["XS", "S", "M", "L"], currentPhysicalQuantity: 2, reservedQuantity: 1, status: "Active" },
  { id: 9, name: "Winter Wool Coat", category: "Outerwear", slug: "CT-WWL-XL-011", price: 189.99, sizes: ["S", "M", "L", "XL", "XXL"], currentPhysicalQuantity: 8, reservedQuantity: 2, status: "Active" },
  { id: 10, name: "Silk Scarf", category: "Accessories", slug: "SC-RSE-OS-006", price: 49.99, sizes: ["XS"], currentPhysicalQuantity: 17, reservedQuantity: 6, status: "Active" },
  { id: 11, name: "Casual Polo Shirt", category: "Tops", slug: "PL-CSL-M-012", price: 39.99, sizes: ["S", "M", "L", "XL"], currentPhysicalQuantity: 15, reservedQuantity: 4, status: "Active" },
  { id: 12, name: "Denim Skirt", category: "Bottoms", slug: "SK-DNM-S-013", price: 54.99, sizes: ["XS", "S", "M", "L"], currentPhysicalQuantity: 9, reservedQuantity: 2, status: "Active" },
  { id: 13, name: "Cocktail Dress", category: "Dresses", slug: "DR-CKT-M-014", price: 129.99, sizes: ["XS", "S", "M", "L", "XL"], currentPhysicalQuantity: 5, reservedQuantity: 1, status: "Active" },
  { id: 14, name: "Bomber Jacket", category: "Outerwear", slug: "JK-BMB-L-015", price: 119.99, sizes: ["M", "L", "XL"], currentPhysicalQuantity: 3, reservedQuantity: 1, status: "Draft" },
  { id: 15, name: "Leather Belt", category: "Accessories", slug: "BL-LTH-M-016", price: 29.99, sizes: ["S", "M", "L"], currentPhysicalQuantity: 20, reservedQuantity: 5, status: "Active" },
];
