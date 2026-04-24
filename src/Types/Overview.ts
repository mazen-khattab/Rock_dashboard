import type { LucideIcon } from "lucide-react";

export interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export type NotificationItem = {
  id: number;
  title: string;
  description: string;
  time: string;
  unread: boolean;
};