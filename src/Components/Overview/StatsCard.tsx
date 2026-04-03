import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export default function StatsCard({ title, value, change, icon: Icon, iconColor, iconBg }: StatsCardProps) {
  const isPositive = change >= 0;

  return (
    <article className="group relative overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="mb-2 text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {isPositive ? '+' : ''}
              {change}%
            </span>
            <span className="text-sm text-slate-500">vs last month</span>
          </div>
        </div>

        <div className={`${iconBg} rounded-2xl p-4 shadow-inner`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>

      <div className="mt-6 h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />
      <p className="mt-4 text-sm leading-6 text-slate-500">
        A quick summary of how this metric is trending compared with the previous reporting period.
      </p>
    </article>
  );
}
