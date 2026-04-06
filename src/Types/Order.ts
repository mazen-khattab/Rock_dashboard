import heroImage from "../assets/hero.png";

export interface OrderItem {
  id: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  variantImage: string;
  variantColor: string;
  variantSize: string;
  variantQuantity: number;
}

export interface Order {
  id: string;
  number: string;
  customer: string;
  userName: string;
  userEmail: string;
  phone: string;
  totalPrice: number;
  fullAddress: string;
  governorate: string;
  city: string;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  createdAt: string;
  items: OrderItem[];
}

export const MOCK_ORDERS: Order[] = [
  {
    id: "ord-1001",
    number: "#1001",
    customer: "Mazen Ahmed",
    userName: "Mazen Ahmed",
    userEmail: "mazen.ahmed@example.com",
    phone: "+20 100 123 4567",
    totalPrice: 149.99,
    fullAddress: "12 Nile Street, Building A, Apartment 4",
    governorate: "Cairo",
    city: "Nasr City",
    status: "Pending",
    createdAt: "2026-04-05 10:15 AM",
    items: [
      {
        id: "item-1",
        productName: "Classic White T-Shirt",
        productDescription: "Soft cotton t-shirt with a relaxed fit for everyday wear.",
        productPrice: 29.99,
        variantImage: heroImage,
        variantColor: "White",
        variantSize: "L",
        variantQuantity: 2,
      },
      {
        id: "item-2",
        productName: "Cargo Pants",
        productDescription: "Utility cargo pants with side pockets and tapered ankles.",
        productPrice: 90.01,
        variantImage: heroImage,
        variantColor: "Olive",
        variantSize: "M",
        variantQuantity: 1,
      },
      {
        id: "item-3",
        productName: "Classic White T-Shirt",
        productDescription: "Soft cotton t-shirt with a relaxed fit for everyday wear.",
        productPrice: 29.99,
        variantImage: heroImage,
        variantColor: "White",
        variantSize: "L",
        variantQuantity: 2,
      },
      {
        id: "item-4",
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
    id: "ord-1002",
    number: "#1002",
    customer: "Sara Adel",
    userName: "Sara Adel",
    userEmail: "sara.adel@example.com",
    phone: "+20 101 555 0101",
    totalPrice: 289.5,
    fullAddress: "45 Tahrir Square, Floor 2",
    governorate: "Giza",
    city: "Dokki",
    status: "Processing",
    createdAt: "2026-04-04 03:40 PM",
    items: [
      {
        id: "item-3",
        productName: "Evening Gown",
        productDescription: "Elegant evening gown with flowing fabric and modern silhouette.",
        productPrice: 199.99,
        variantImage: heroImage,
        variantColor: "Midnight Blue",
        variantSize: "M",
        variantQuantity: 1,
      },
      {
        id: "item-4",
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
    id: "ord-1003",
    number: "#1003",
    customer: "Omar Khaled",
    userName: "Omar Khaled",
    userEmail: "omar.khaled@example.com",
    phone: "+20 102 987 6543",
    totalPrice: 99.0,
    fullAddress: "8 Sea View Road, Villa 3",
    governorate: "Alexandria",
    city: "Smouha",
    status: "Delivered",
    createdAt: "2026-04-03 11:20 AM",
    items: [
      {
        id: "item-5",
        productName: "Leather Belt",
        productDescription: "Classic leather belt with a brushed-metal buckle.",
        productPrice: 29.99,
        variantImage: heroImage,
        variantColor: "Brown",
        variantSize: "M",
        variantQuantity: 1,
      },
      {
        id: "item-6",
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
    id: "ord-1004",
    number: "#1004",
    customer: "Nour Hany",
    userName: "Nour Hany",
    userEmail: "nour.hany@example.com",
    phone: "+20 109 333 1212",
    totalPrice: 420.75,
    fullAddress: "21 Garden Street, Tower C",
    governorate: "Cairo",
    city: "Heliopolis",
    status: "Processing",
    createdAt: "2026-04-03 08:10 PM",
    items: [
      {
        id: "item-7",
        productName: "Leather Jacket",
        productDescription: "Premium leather jacket with structured shoulders and sleek fit.",
        productPrice: 149.99,
        variantImage: heroImage,
        variantColor: "Black",
        variantSize: "L",
        variantQuantity: 1,
      },
      {
        id: "item-8",
        productName: "Bomber Jacket",
        productDescription: "Casual bomber jacket with ribbed cuffs and soft inner lining.",
        productPrice: 119.99,
        variantImage: heroImage,
        variantColor: "Sand",
        variantSize: "XL",
        variantQuantity: 1,
      },
      {
        id: "item-9",
        productName: "Striped Long Sleeve Shirt",
        productDescription: "Long sleeve shirt with subtle stripes and regular fit.",
        productPrice: 75.38,
        variantImage: heroImage,
        variantColor: "Sky Blue",
        variantSize: "M",
        variantQuantity: 2,
      },
    ],
  },
];

export const orderStatusClassName: Record<Order["status"], string> = {
  Pending: "border-amber-200 bg-amber-50 text-amber-700",
  Processing: "border-sky-200 bg-sky-50 text-sky-700",
  Delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

