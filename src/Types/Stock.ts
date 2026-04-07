import type { ReactNode } from "react";
import { MOCK_PRODUCTS, type Product } from "./Product";

export type TransactionType = "Shipping" | "Returned" | "Damaged" | "Updating";

export interface InventoryProduct extends Product {
  colors: string[];
}

export interface VariantRow {
  id: string;
  size: string;
  color: string;
  quantity: string;
}

export interface StockVariant {
  id: string;
  productName: string;
  category: string;
  color: string;
  size: string;
  sku: string;
  quantity: number;
}

export interface StockFieldProps {
  label: string;
  children: ReactNode;
}

export const TRANSACTION_TYPE_OPTIONS: TransactionType[] = [
  "Shipping",
  "Returned",
  "Damaged",
  "Updating",
];

export const PRODUCT_COLOR_MAP: Record<string, string[]> = {
  "1": ["White", "Black", "Stone"],
  "2": ["Blue", "Washed Black"],
  "3": ["Pink", "Ivory", "Floral Mix"],
  "4": ["Brown", "Black"],
  "5": ["Gold"],
  "6": ["Navy", "Sand", "Forest"],
  "7": ["Olive", "Black"],
  "8": ["Burgundy", "Emerald"],
  "9": ["Charcoal", "Camel"],
  "10": ["Rose", "Navy"],
  "11": ["White", "Sky Blue", "Black"],
  "12": ["Denim Blue", "Washed Grey"],
  "13": ["Cherry", "Black", "Champagne"],
  "14": ["Black", "Army Green"],
  "15": ["Brown", "Black", "Tan"],
};

export const INVENTORY_PRODUCTS: InventoryProduct[] = MOCK_PRODUCTS.map((product) => ({
  ...product,
  colors: PRODUCT_COLOR_MAP[product.id] ?? ["Default"],
}));

export const STOCK_VARIANTS: StockVariant[] = [
  { id: "1", productName: "Classic White T-Shirt", category: "Tops", color: "White", size: "M", sku: "TS-WHT-M-001", quantity: 24 },
  { id: "2", productName: "Classic White T-Shirt", category: "Tops", color: "Black", size: "L", sku: "TS-BLK-L-002", quantity: 3 },
  { id: "3", productName: "Slim Fit Jeans", category: "Bottoms", color: "Blue", size: "32", sku: "JN-BLU-32-003", quantity: 0 },
  { id: "4", productName: "Summer Floral Dress", category: "Dresses", color: "Pink", size: "S", sku: "DR-PNK-S-004", quantity: 12 },
  { id: "5", productName: "Leather Jacket", category: "Outerwear", color: "Brown", size: "XL", sku: "JK-BRN-XL-005", quantity: 4 },
  { id: "6", productName: "Silk Scarf", category: "Accessories", color: "Rose", size: "One Size", sku: "SC-RSE-OS-006", quantity: 17 },
];
