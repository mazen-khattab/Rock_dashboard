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
  quantity: number;
}

export interface StockTransaction {
  id: string;
  productId: string;
  type: TransactionType;
  price: number | null;
  note: string;
  createdAt: string;
  variants: VariantRow[];
}

// used in listStockManagment page.
export interface StockVariant {
  id: string;
  productName: string;
  category: string;
  transactiounType: string;
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
  { id: "1", productName: "Classic White T-Shirt", category: "Tops", transactiounType: "Shipping", color: "White", size: "M", sku: "TS-WHT-M-001", quantity: 24 },
  { id: "2", productName: "Classic White T-Shirt", category: "Tops", transactiounType: "Returned", color: "Black", size: "L", sku: "TS-BLK-L-002", quantity: 3 },
  { id: "3", productName: "Slim Fit Jeans", category: "Bottoms", transactiounType: "Damaged", color: "Blue", size: "32", sku: "JN-BLU-32-003", quantity: 0 },
  { id: "4", productName: "Summer Floral Dress", category: "Dresses", transactiounType: "Returned", color: "Pink", size: "S", sku: "DR-PNK-S-004", quantity: 12 },
  { id: "5", productName: "Leather Jacket", category: "Outerwear", transactiounType: "Damaged", color: "Brown", size: "XL", sku: "JK-BRN-XL-005", quantity: 4 },
  { id: "6", productName: "Silk Scarf", category: "Accessories", transactiounType: "Updating", color: "Rose", size: "One Size", sku: "SC-RSE-OS-006", quantity: 17 },
];

export const MOCK_STOCK_TRANSACTIONS: StockTransaction[] = [
  {
    id: "1",
    productId: "1",
    type: "Returned",
    price: 29.99,
    note: "Customer return received and items checked back into stock.",
    createdAt: "2026-04-07",
    variants: [
      { id: "1-1", size: "M", color: "White", quantity: 12 },
      { id: "1-2", size: "L", color: "Black", quantity: 12 },
    ],
  },
  {
    id: "2",
    productId: "2",
    type: "Damaged",
    price: 59.99,
    note: "Units removed after warehouse quality inspection.",
    createdAt: "2026-04-08",
    variants: [
      { id: "2-1", size: "32", color: "Blue", quantity: 3 },
    ],
  },
  {
    id: "3",
    productId: "3",
    type: "Shipping",
    price: 79.99,
    note: "Store replenishment transfer to Alexandria branch.",
    createdAt: "2026-04-09",
    variants: [
      { id: "3-1", size: "S", color: "Pink", quantity: 7 },
      { id: "3-2", size: "M", color: "Ivory", quantity: 5 },
    ],
  },
  {
    id: "4",
    productId: "4",
    type: "Updating",
    price: null,
    note: "Cycle count update after quarterly audit.",
    createdAt: "2026-04-10",
    variants: [
      { id: "4-1", size: "XL", color: "Brown", quantity: 4 },
    ],
  },
];
