import type { LucideIcon } from "lucide-react";

export interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}