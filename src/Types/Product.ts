export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  sizes: string[];
  status: "Active" | "Draft";
  image_url?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Classic White T-Shirt", category: "Tops", price: 29.99, sizes: ["XS", "S", "M", "L", "XL"], status: "Active" },
  { id: "2", name: "Slim Fit Jeans", category: "Bottoms", price: 59.99, sizes: ["S", "M", "L", "XL", "XXL"], status: "Active" },
  { id: "3", name: "Summer Floral Dress", category: "Dresses", price: 79.99, sizes: ["XS", "S", "M", "L"], status: "Active" },
  { id: "4", name: "Leather Jacket", category: "Outerwear", price: 149.99, sizes: ["S", "M", "L", "XL"], status: "Active" },
  { id: "5", name: "Gold Chain Necklace", category: "Accessories", price: 34.99, sizes: ["XS"], status: "Active" },
  { id: "6", name: "Striped Long Sleeve Shirt", category: "Tops", price: 44.99, sizes: ["XS", "S", "M", "L", "XL", "XXL"], status: "Active" },
  { id: "7", name: "Cargo Pants", category: "Bottoms", price: 69.99, sizes: ["S", "M", "L", "XL"], status: "Draft" },
  { id: "8", name: "Evening Gown", category: "Dresses", price: 199.99, sizes: ["XS", "S", "M", "L"], status: "Active" },
  { id: "9", name: "Winter Wool Coat", category: "Outerwear", price: 189.99, sizes: ["S", "M", "L", "XL", "XXL"], status: "Active" },
  { id: "10", name: "Silk Scarf", category: "Accessories", price: 49.99, sizes: ["XS"], status: "Active" },
  { id: "11", name: "Casual Polo Shirt", category: "Tops", price: 39.99, sizes: ["S", "M", "L", "XL"], status: "Active" },
  { id: "12", name: "Denim Skirt", category: "Bottoms", price: 54.99, sizes: ["XS", "S", "M", "L"], status: "Active" },
  { id: "13", name: "Cocktail Dress", category: "Dresses", price: 129.99, sizes: ["XS", "S", "M", "L", "XL"], status: "Active" },
  { id: "14", name: "Bomber Jacket", category: "Outerwear", price: 119.99, sizes: ["M", "L", "XL"], status: "Draft" },
  { id: "15", name: "Leather Belt", category: "Accessories", price: 29.99, sizes: ["S", "M", "L"], status: "Active" },
];
