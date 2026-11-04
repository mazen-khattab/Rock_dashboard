import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { StatsCardProps } from '../../Types/Overview';

export default function StatsCard({ title, value, change, icon: Icon, iconColor, iconBg }: StatsCardProps) {
  const isPositive = change >= 0;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-slate-500 truncate">{title}</p>
          <h3 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs sm:text-sm font-semibold ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {isPositive ? <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              {isPositive ? '+' : ''}
              {change}%
            </span>
            <span className="text-xs sm:text-sm text-slate-400">vs last month</span>
          </div>
        </div>

        <div className={`${iconBg} rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-inner shrink-0`}>
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColor}`} />
        </div>
      </div>

      <div className="mt-4 sm:mt-5 h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />
      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-500">
        A quick summary of how this metric is trending compared with the previous reporting period.
      </p>
    </article>
  );
}
