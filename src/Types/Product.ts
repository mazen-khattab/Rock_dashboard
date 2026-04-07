export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  sizes: string[];
  currentPhysicalQuantity: number;
  reservedQuantity: number;
  status: "Active" | "Draft";
  image_url?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Classic White T-Shirt", category: "Tops", sku: "TS-WHT-M-001", price: 29.99, sizes: ["XS", "S", "M", "L", "XL"], currentPhysicalQuantity: 24, reservedQuantity: 4, status: "Active" },
  { id: "2", name: "Slim Fit Jeans", category: "Bottoms", sku: "JN-BLU-32-003", price: 59.99, sizes: ["S", "M", "L", "XL", "XXL"], currentPhysicalQuantity: 0, reservedQuantity: 0, status: "Active" },
  { id: "3", name: "Summer Floral Dress", category: "Dresses", sku: "DR-PNK-S-004", price: 79.99, sizes: ["XS", "S", "M", "L"], currentPhysicalQuantity: 12, reservedQuantity: 2, status: "Active" },
  { id: "4", name: "Leather Jacket", category: "Outerwear", sku: "JK-BRN-XL-005", price: 149.99, sizes: ["S", "M", "L", "XL"], currentPhysicalQuantity: 4, reservedQuantity: 1, status: "Active" },
  { id: "5", name: "Gold Chain Necklace", category: "Accessories", sku: "NC-GLD-XS-007", price: 34.99, sizes: ["XS"], currentPhysicalQuantity: 18, reservedQuantity: 5, status: "Active" },
  { id: "6", name: "Striped Long Sleeve Shirt", category: "Tops", sku: "SH-STR-L-008", price: 44.99, sizes: ["XS", "S", "M", "L", "XL", "XXL"], currentPhysicalQuantity: 10, reservedQuantity: 3, status: "Active" },
  { id: "7", name: "Cargo Pants", category: "Bottoms", sku: "PT-CRG-M-009", price: 69.99, sizes: ["S", "M", "L", "XL"], currentPhysicalQuantity: 6, reservedQuantity: 2, status: "Draft" },
  { id: "8", name: "Evening Gown", category: "Dresses", sku: "GW-EVG-L-010", price: 199.99, sizes: ["XS", "S", "M", "L"], currentPhysicalQuantity: 2, reservedQuantity: 1, status: "Active" },
  { id: "9", name: "Winter Wool Coat", category: "Outerwear", sku: "CT-WWL-XL-011", price: 189.99, sizes: ["S", "M", "L", "XL", "XXL"], currentPhysicalQuantity: 8, reservedQuantity: 2, status: "Active" },
  { id: "10", name: "Silk Scarf", category: "Accessories", sku: "SC-RSE-OS-006", price: 49.99, sizes: ["XS"], currentPhysicalQuantity: 17, reservedQuantity: 6, status: "Active" },
  { id: "11", name: "Casual Polo Shirt", category: "Tops", sku: "PL-CSL-M-012", price: 39.99, sizes: ["S", "M", "L", "XL"], currentPhysicalQuantity: 15, reservedQuantity: 4, status: "Active" },
  { id: "12", name: "Denim Skirt", category: "Bottoms", sku: "SK-DNM-S-013", price: 54.99, sizes: ["XS", "S", "M", "L"], currentPhysicalQuantity: 9, reservedQuantity: 2, status: "Active" },
  { id: "13", name: "Cocktail Dress", category: "Dresses", sku: "DR-CKT-M-014", price: 129.99, sizes: ["XS", "S", "M", "L", "XL"], currentPhysicalQuantity: 5, reservedQuantity: 1, status: "Active" },
  { id: "14", name: "Bomber Jacket", category: "Outerwear", sku: "JK-BMB-L-015", price: 119.99, sizes: ["M", "L", "XL"], currentPhysicalQuantity: 3, reservedQuantity: 1, status: "Draft" },
  { id: "15", name: "Leather Belt", category: "Accessories", sku: "BL-LTH-M-016", price: 29.99, sizes: ["S", "M", "L"], currentPhysicalQuantity: 20, reservedQuantity: 5, status: "Active" },
];
