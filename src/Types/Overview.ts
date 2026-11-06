import type { LucideIcon } from "lucide-react";

export interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  subtitle?: string;
}

export type NotificationItem = {
  id: number;
  title: string;
  description: string;
  time: string;
  unread: boolean;
};

export interface RecentOrderOverview {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  amount: string;
  status: "Completed" | "Processing" | "Shipped" | "Cancelled";
  itemsCount: number;
}
