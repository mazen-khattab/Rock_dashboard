import heroImage from "../assets/hero.png";

export interface OrderItem {
  id: number;
  variantId?: number;
  productId?: number;
  name?: string;
  productName: string;
  description?: string;
  productDescription?: string;
  productPrice: number;
  unitPrice?: number;
  discount?: number;
  totalPrice?: number;
  variantImage: string;
  image?: string;
  variantColor: string;
  colorName?: string;
  hexCode?: string;
  variantSize: string;
  sizeName?: string;
  variantQuantity: number;
  quantity?: number;
  [key: string]: unknown;
}

export interface Order {
  id: number;
  number: string;
  orderNumber?: string;
  customer: string;
  customerName?: string;
  userName?: string;
  userEmail?: string;
  email?: string;
  phone?: string;
  totalPrice: number;
  fullAddress?: string;
  governorate?: string;
  city?: string;
  status: string;
  createdAt?: string;
  created?: string;
  items?: OrderItem[];
  orderDetails?: OrderItem[];
  [key: string]: unknown;
}

export interface PaginatedOrders {
  items: Order[];
  totalPages: number;
  totalCount: number;
  pageNumber: number;
  pageSize?: number;
}

export type OrderDetailsResponse = Order | { data?: Order; [key: string]: unknown };

export type OrderContextValue = {
  orders: Order[];
  selectedOrder: Order | null;
  totalOrderCount: number;
  loading: boolean;
  error: string | null;
  getAllOrders: (pageNumber?: number, pageSize?: number) => Promise<PaginatedOrders>;
  getOrderById: (orderId: number | string) => Promise<Order>;
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 1,
    number: "#1001",
    orderNumber: "#1001",
    customer: "Mazen Ahmed",
    customerName: "Mazen Ahmed",
    userName: "Mazen Ahmed",
    userEmail: "mazen.ahmed@example.com",
    email: "mazen.ahmed@example.com",
    phone: "+20 100 123 4567",
    totalPrice: 149.99,
    fullAddress: "12 Nile Street, Building A, Apartment 4",
    governorate: "Cairo",
    city: "Nasr City",
    status: "Pending",
    createdAt: "2026-04-05 10:15 AM",
    created: "2026-04-05 10:15 AM",
    items: [
      {
        id: 1,
        productName: "Classic White T-Shirt",
        productDescription: "Soft cotton t-shirt with a relaxed fit for everyday wear.",
        productPrice: 29.99,
        variantImage: heroImage,
        variantColor: "White",
        variantSize: "L",
        variantQuantity: 2,
      },
      {
        id: 2,
        productName: "Cargo Pants",
        productDescription: "Utility cargo pants with side pockets and tapered ankles.",
        productPrice: 90.01,
        variantImage: heroImage,
        variantColor: "Olive",
        variantSize: "M",
        variantQuantity: 1,
      },
    ],
  },
  {
    id: 2,
    number: "#1002",
    orderNumber: "#1002",
    customer: "Sara Adel",
    customerName: "Sara Adel",
    userName: "Sara Adel",
    userEmail: "sara.adel@example.com",
    email: "sara.adel@example.com",
    phone: "+20 101 555 0101",
    totalPrice: 289.5,
    fullAddress: "45 Tahrir Square, Floor 2",
    governorate: "Giza",
    city: "Dokki",
    status: "Processing",
    createdAt: "2026-04-04 03:40 PM",
    created: "2026-04-04 03:40 PM",
    items: [
      {
        id: 3,
        productName: "Evening Gown",
        productDescription: "Elegant evening gown with flowing fabric and modern silhouette.",
        productPrice: 199.99,
        variantImage: heroImage,
        variantColor: "Midnight Blue",
        variantSize: "M",
        variantQuantity: 1,
      },
      {
        id: 4,
        productName: "Silk Scarf",
        productDescription: "Lightweight silk scarf with a smooth finish and soft texture.",
        productPrice: 44.76,
        variantImage: heroImage,
        variantColor: "Rose",
        variantSize: "One Size",
        variantQuantity: 2,
      },
    ],
  },
  {
    id: 3,
    number: "#1003",
    orderNumber: "#1003",
    customer: "Omar Khaled",
    customerName: "Omar Khaled",
    userName: "Omar Khaled",
    userEmail: "omar.khaled@example.com",
    email: "omar.khaled@example.com",
    phone: "+20 102 987 6543",
    totalPrice: 99.0,
    fullAddress: "8 Sea View Road, Villa 3",
    governorate: "Alexandria",
    city: "Smouha",
    status: "Delivered",
    createdAt: "2026-04-03 11:20 AM",
    created: "2026-04-03 11:20 AM",
    items: [
      {
        id: 5,
        productName: "Leather Belt",
        productDescription: "Classic leather belt with a brushed-metal buckle.",
        productPrice: 29.99,
        variantImage: heroImage,
        variantColor: "Brown",
        variantSize: "M",
        variantQuantity: 1,
      },
      {
        id: 6,
        productName: "Casual Polo Shirt",
        productDescription: "Smart casual polo shirt made from breathable knit fabric.",
        productPrice: 34.5,
        variantImage: heroImage,
        variantColor: "Navy",
        variantSize: "XL",
        variantQuantity: 2,
      },
    ],
  },
  {
    id: 4,
    number: "#1004",
    orderNumber: "#1004",
    customer: "Nour Hany",
    customerName: "Nour Hany",
    userName: "Nour Hany",
    userEmail: "nour.hany@example.com",
    email: "nour.hany@example.com",
    phone: "+20 109 333 1212",
    totalPrice: 420.75,
    fullAddress: "21 Garden Street, Tower C",
    governorate: "Cairo",
    city: "Heliopolis",
    status: "Cancelled",
    createdAt: "2026-04-03 08:10 PM",
    created: "2026-04-03 08:10 PM",
    items: [
      {
        id: 7,
        productName: "Leather Jacket",
        productDescription: "Premium leather jacket with structured shoulders and sleek fit.",
        productPrice: 149.99,
        variantImage: heroImage,
        variantColor: "Black",
        variantSize: "L",
        variantQuantity: 1,
      },
    ],
  },
];

export const orderStatusClassName: Record<string, string> = {
  Pending: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  Processing: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  Confirmed: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  Shipped: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400",
  Delivered: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  Cancelled: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  Returned: "border-orange-500/30 bg-orange-500/10 text-orange-400",
};

export const getOrderStatusBadge = (status: string) => {
  return (
    orderStatusClassName[status] ||
    "border-zinc-700 bg-zinc-800 text-zinc-300"
  );
};
