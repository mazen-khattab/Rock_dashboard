import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { StatsCardProps } from '../../Types/Overview';

export default function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
  iconBg,
  subtitle,
}: StatsCardProps) {
  const isPositive = change >= 0;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900/90 hover:shadow-[0_12px_28px_rgba(0,0,0,0.65)]">
      {/* Subtle top ambient sheen */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-zinc-850/40 blur-2xl group-hover:bg-zinc-700/20 transition-all" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-400 truncate">
            {title}
          </p>
          <h3 className="mb-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100">
            {value}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-semibold border ${
                isPositive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-rose-400" />
              )}
              {isPositive ? '+' : ''}
              {change}%
            </span>
            <span className="text-xs text-zinc-500">vs last month</span>
          </div>
        </div>

        <div
          className={`${
            iconBg ? iconBg : 'bg-zinc-800/90'
          } rounded-xl p-3 border border-zinc-700/60 shadow-inner shrink-0 group-hover:border-zinc-600 transition-colors`}
        >
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColor ? iconColor : 'text-zinc-300'}`} />
        </div>
      </div>

      <div className="mt-4 h-px bg-gradient-to-r from-zinc-800 via-zinc-800/60 to-transparent" />
      <p className="mt-3 text-xs leading-relaxed text-zinc-400">
        {subtitle ?? 'Real-time performance summary tracked across all store channels.'}
      </p>
    </article>
  );
}
