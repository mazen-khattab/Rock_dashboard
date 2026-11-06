import { useEffect, useRef, useState } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  X,
  Plus,
  ArrowRight,
  Package,
  Layers,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../Context/useAuth';
import { LogoutButton } from '../Auth/LogoutButton';
import StatsCard from './StatsCard';
import type { NotificationItem, RecentOrderOverview } from '../../Types/Overview';

const notificationsSeed: NotificationItem[] = [
  {
    id: 1,
    title: 'New order received',
    description: 'Order #ORD-1054 was placed for $189.00.',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    title: 'Stock warning',
    description: 'Black Oversized Hoodie (Size L) is below 5 units.',
    time: '15 min ago',
    unread: true,
  },
  {
    id: 3,
    title: 'Customer inquiry',
    description: 'A customer requested delivery schedule details.',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 4,
    title: 'Catalog update',
    description: 'Winter Collection category was published successfully.',
    time: '3 hours ago',
    unread: false,
  },
];

const mockRecentOrders: RecentOrderOverview[] = [
  {
    id: 'ORD-1054',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    date: 'Today, 14:20',
    amount: '$189.00',
    status: 'Completed',
    itemsCount: 3,
  },
  {
    id: 'ORD-1053',
    customerName: 'Michael Torres',
    customerEmail: 'm.torres@example.com',
    date: 'Today, 12:45',
    amount: '$94.50',
    status: 'Processing',
    itemsCount: 1,
  },
  {
    id: 'ORD-1052',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.r@example.com',
    date: 'Yesterday, 19:10',
    amount: '$312.00',
    status: 'Shipped',
    itemsCount: 4,
  },
  {
    id: 'ORD-1051',
    customerName: 'David Chen',
    customerEmail: 'david.c@example.com',
    date: 'Yesterday, 11:30',
    amount: '$78.00',
    status: 'Completed',
    itemsCount: 2,
  },
  {
    id: 'ORD-1050',
    customerName: 'Amina Mansoor',
    customerEmail: 'amina.m@example.com',
    date: 'Nov 03, 16:05',
    amount: '$420.00',
    status: 'Completed',
    itemsCount: 5,
  },
];

const weeklyRevenueData = [
  { day: 'Mon', revenue: 4200, height: '48%', orders: 38 },
  { day: 'Tue', revenue: 5800, height: '65%', orders: 52 },
  { day: 'Wed', revenue: 5100, height: '58%', orders: 46 },
  { day: 'Thu', revenue: 6900, height: '78%', orders: 63 },
  { day: 'Fri', revenue: 8420, height: '95%', orders: 79, peak: true },
  { day: 'Sat', revenue: 7600, height: '86%', orders: 71 },
  { day: 'Sun', revenue: 6210, height: '70%', orders: 56 },
];

export const Overview = () => {
  const { user, profile } = useAuth();
  const displayName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : user?.userName;
  const [language, setLanguage] = useState<'EN' | 'AR'>('EN');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(notificationsSeed);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'Today' | 'Week' | 'Month' | 'Year'>('Week');
  const [activeChartMetric, setActiveChartMetric] = useState<'revenue' | 'orders'>('revenue');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: 12.5,
      icon: DollarSign,
      iconBg: 'bg-zinc-800/80 border-zinc-700/60',
      iconColor: 'text-zinc-300',
      subtitle: 'Total gross sales generated across all categories.',
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: 4.8,
      icon: ShoppingCart,
      iconBg: 'bg-zinc-800/80 border-zinc-700/60',
      iconColor: 'text-zinc-300',
      subtitle: 'Fulfilled and pending customer orders this cycle.',
    },
    {
      title: 'Active Users',
      value: '2,845',
      change: 8.2,
      icon: Users,
      iconBg: 'bg-zinc-800/80 border-zinc-700/60',
      iconColor: 'text-zinc-300',
      subtitle: 'Registered buyers and active account profiles.',
    },
    {
      title: 'Avg Order Value',
      value: '$136.50',
      change: 2.1,
      icon: TrendingUp,
      iconBg: 'bg-zinc-800/80 border-zinc-700/60',
      iconColor: 'text-zinc-300',
      subtitle: 'Average cart checkout spend per completed order.',
    },
  ];

  // Calculate unread notifications count
  const unreadNotificationsCount = notifications.filter((notification) => notification.unread).length;

  // Closes profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggles the language
  const toggleLanguage = () => {
    setLanguage((current) => (current === 'EN' ? 'AR' : 'EN'));
  };

  // Opens notifications drawer and marks all as read
  const openNotifications = () => {
    setIsNotificationsOpen(true);
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  return (
    <section className="min-h-screen bg-black pb-12 text-zinc-200">
      {/* Notifications Drawer Backdrop */}
      {isNotificationsOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsNotificationsOpen(false)}
            aria-hidden="true"
          />

          <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-sm sm:max-w-md flex-col bg-zinc-950 border-l border-zinc-800 shadow-2xl transition-transform duration-300">
            <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-4 sm:py-5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-zinc-100">Notifications</h3>
                <p className="text-xs text-zinc-400">Live operational events & alerts.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer"
                aria-label="Close notifications"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 transition hover:border-zinc-700 hover:bg-zinc-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-zinc-200 truncate">{notification.title}</h4>
                      <p className="mt-1 text-xs leading-5 text-zinc-400">{notification.description}</p>
                    </div>
                    {notification.unread && (
                      <span className="mt-1.5 inline-flex h-2 w-2 rounded-full bg-zinc-400 shrink-0 shadow-sm" />
                    )}
                  </div>
                  <p className="mt-2 text-xs font-medium text-zinc-500">{notification.time}</p>
                </div>
              ))}
            </div>
          </aside>
        </>
      )}

      {/* Top Action Header Bar */}
      <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md px-4 sm:px-8 py-3.5 sm:py-4 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Breadcrumb / Title Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Rock Dashboard
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Home
            </span>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Live Operational Status Tag */}
            <div className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>Live Operations</span>
            </div>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex h-9 w-9 sm:h-10 sm:w-10 cursor-pointer items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-xs sm:text-sm font-bold text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
              aria-label={`Switch language to ${language === 'EN' ? 'Arabic' : 'English'}`}
            >
              {language}
            </button>

            {/* Notifications Button */}
            <button
              type="button"
              onClick={openNotifications}
              className="relative flex h-9 w-9 sm:h-10 sm:w-10 cursor-pointer items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
              aria-label="Open notifications"
            >
              <i className="fa-regular fa-bell text-sm sm:text-base" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-600 border border-rose-500 px-1 text-[10px] font-bold text-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User Profile Menu */}
            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((current) => !current)}
                className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/90 p-1.5 sm:pr-3 transition hover:bg-zinc-800 hover:border-zinc-700"
                aria-label="Open profile menu"
              >
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-xs sm:text-sm">
                  {user?.userName}
                </div>
                <div className="text-left hidden md:block">
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-200 leading-tight">
                    {displayName}
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    {profile?.email ?? user?.role.join(', ')}
                  </p>
                </div>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
                  <div className="text-left md:hidden block p-3 border-b border-zinc-800/80 mb-1">
                    <h4 className="font-bold text-sm text-zinc-200">{displayName}</h4>
                    <p className="text-xs text-zinc-400 truncate">
                      {profile?.email ?? user?.role.join(', ')}
                    </p>
                  </div>
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Account
                  </div>
                  <NavLink
                    to="/admin/users"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition"
                  >
                    <Users size={16} className="text-zinc-400" />
                    <span>Manage Team</span>
                  </NavLink>
                  <div className="my-1 border-t border-zinc-800/80" />
                  <LogoutButton />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Body Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 pt-6 space-y-8">
        {/* Welcome Hero & Quick Action Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 sm:p-6 backdrop-blur-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-100">
              Welcome back, {displayName}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Monitor key metrics, track order volume, and keep your inventory optimized.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Timeframe Filter Buttons */}
            <div className="flex rounded-xl border border-zinc-800 bg-zinc-950/80 p-1">
              {(['Today', 'Week', 'Month', 'Year'] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setSelectedTimeframe(period)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                    selectedTimeframe === period
                      ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/80 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <NavLink
              to="/admin/products/create"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm px-3.5 py-1.5 text-xs sm:text-sm transition"
            >
              <Plus size={16} />
              <span>Add Product</span>
            </NavLink>

            <NavLink
              to="/admin/orders"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
            >
              <ShoppingCart size={16} />
              <span>Orders</span>
            </NavLink>
          </div>
        </div>

        {/* 4 Stats Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Performance Visualization & Inventory Overview Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Revenue Chart Section (2 Columns) */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 backdrop-blur-sm lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-zinc-100">
                  Revenue & Sales Activity
                </h3>
                <p className="text-xs text-zinc-400">
                  Daily breakdown for the current performance period.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveChartMetric('revenue')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium border transition cursor-pointer ${
                    activeChartMetric === 'revenue'
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Revenue ($)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChartMetric('orders')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium border transition cursor-pointer ${
                    activeChartMetric === 'orders'
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Orders (#)
                </button>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="relative pt-6 pb-2">
              <div className="h-48 sm:h-56 flex items-end justify-between gap-2 sm:gap-4 px-2">
                {weeklyRevenueData.map((item, index) => {
                  const isHovered = hoveredBar === index;
                  return (
                    <div
                      key={item.day}
                      onMouseEnter={() => setHoveredBar(index)}
                      onMouseLeave={() => setHoveredBar(null)}
                      className="group flex flex-1 flex-col items-center h-full justify-end cursor-pointer"
                    >
                      {/* Tooltip */}
                      <div
                        className={`mb-2 rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1 text-center shadow-lg transition-opacity duration-200 ${
                          isHovered || item.peak ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <p className="text-[10px] font-semibold text-zinc-200">
                          {activeChartMetric === 'revenue' ? `$${item.revenue}` : `${item.orders} orders`}
                        </p>
                      </div>

                      {/* Bar Pillar */}
                      <div className="w-full max-w-[42px] rounded-t-lg bg-zinc-800/80 border-t border-x border-zinc-700/60 transition-all duration-300 group-hover:bg-zinc-700 group-hover:border-zinc-500 relative overflow-hidden"
                        style={{ height: item.height }}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-800 to-zinc-700/80 ${
                            item.peak ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                          }`}
                        />
                      </div>

                      {/* Day Label */}
                      <span className={`mt-2.5 text-xs font-medium transition ${
                        item.peak || isHovered ? 'text-zinc-200 font-bold' : 'text-zinc-500'
                      }`}>
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart Summary Stats */}
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-zinc-800/80 pt-4 text-center">
              <div>
                <p className="text-xs text-zinc-500">Avg. Daily</p>
                <p className="mt-1 text-sm sm:text-base font-bold text-zinc-200">$6,318</p>
              </div>
              <div className="border-x border-zinc-800/80">
                <p className="text-xs text-zinc-500">Peak Performance</p>
                <p className="mt-1 text-sm sm:text-base font-bold text-zinc-200">$8,420 (Fri)</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Conversion Rate</p>
                <p className="mt-1 text-sm sm:text-base font-bold text-zinc-200">3.82%</p>
              </div>
            </div>
          </div>

          {/* Store Health & Inventory Summary (1 Column) */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-bold text-zinc-100">Inventory Health</h3>
                <span className="rounded-lg bg-zinc-800 border border-zinc-700/80 px-2 py-0.5 text-xs font-semibold text-zinc-300">
                  Live Status
                </span>
              </div>
              <p className="text-xs text-zinc-400 mb-6">
                Warehouse inventory metrics and fulfillment velocity.
              </p>

              {/* Progress bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                    <span className="text-zinc-300">In Stock Products</span>
                    <span className="text-zinc-400">92%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full rounded-full bg-zinc-400" style={{ width: '92%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                    <span className="text-zinc-300">Order Fulfillment Rate</span>
                    <span className="text-zinc-400">97.4%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full rounded-full bg-zinc-500" style={{ width: '97.4%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                    <span className="text-zinc-300">On-Time Shipping</span>
                    <span className="text-zinc-400">95.1%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full rounded-full bg-zinc-600" style={{ width: '95.1%' }} />
                  </div>
                </div>
              </div>

              {/* Action alert box */}
              <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-zinc-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-zinc-200">4 Items Low in Stock</p>
                  <p className="mt-0.5 text-zinc-500 leading-normal">
                    Certain sizes in the oversized hoodie line need replenishment.
                  </p>
                </div>
              </div>
            </div>

            <NavLink
              to="/admin/stock-management"
              className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-zinc-800 border border-zinc-700/80 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-750 hover:text-zinc-100 transition shadow-xs"
            >
              <span>Manage Stock Levels</span>
              <ArrowRight size={14} />
            </NavLink>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-100">Recent Orders</h3>
              <p className="text-xs text-zinc-400">
                Latest customer purchases processed through the checkout pipeline.
              </p>
            </div>

            <NavLink
              to="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition"
            >
              <span>View All Orders</span>
              <ArrowRight size={14} />
            </NavLink>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-400 bg-zinc-950/50">
                <tr>
                  <th className="py-3 px-3 sm:px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-3 sm:px-4 font-semibold">Customer</th>
                  <th className="py-3 px-3 sm:px-4 font-semibold">Date</th>
                  <th className="py-3 px-3 sm:px-4 font-semibold">Items</th>
                  <th className="py-3 px-3 sm:px-4 font-semibold">Total</th>
                  <th className="py-3 px-3 sm:px-4 font-semibold">Status</th>
                  <th className="py-3 px-3 sm:px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {mockRecentOrders.map((order) => {
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      {order.status}
                    </span>
                  );

                  if (order.status === 'Completed') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Completed
                      </span>
                    );
                  } else if (order.status === 'Shipped') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                        Shipped
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={order.id}
                      className="transition hover:bg-zinc-850/40"
                    >
                      <td className="py-3.5 px-3 sm:px-4 font-mono font-medium text-zinc-300">
                        #{order.id}
                      </td>
                      <td className="py-3.5 px-3 sm:px-4">
                        <p className="font-medium text-zinc-200">{order.customerName}</p>
                        <p className="text-xs text-zinc-500">{order.customerEmail}</p>
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 text-xs text-zinc-400">
                        {order.date}
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 text-xs text-zinc-400">
                        {order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'}
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 font-semibold text-zinc-100">
                        {order.amount}
                      </td>
                      <td className="py-3.5 px-3 sm:px-4">
                        {statusBadge}
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 text-right">
                        <NavLink
                          to={`/admin/orders`}
                          className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition"
                        >
                          <span>Details</span>
                          <ExternalLink size={12} />
                        </NavLink>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Hub Navigation Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NavLink
            to="/admin/products"
            className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition hover:border-zinc-700 hover:bg-zinc-900 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-zinc-800/80 p-2.5 border border-zinc-700/60 text-zinc-300">
                <Package size={20} />
              </div>
              <ArrowRight size={16} className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-zinc-300" />
            </div>
            <h4 className="mt-3 font-bold text-sm text-zinc-200">Products Catalog</h4>
            <p className="mt-1 text-xs text-zinc-400">Create, edit, and organize all store products.</p>
          </NavLink>

          <NavLink
            to="/admin/categories"
            className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition hover:border-zinc-700 hover:bg-zinc-900 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-zinc-800/80 p-2.5 border border-zinc-700/60 text-zinc-300">
                <Layers size={20} />
              </div>
              <ArrowRight size={16} className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-zinc-300" />
            </div>
            <h4 className="mt-3 font-bold text-sm text-zinc-200">Categories</h4>
            <p className="mt-1 text-xs text-zinc-400">Manage apparel collections and taxonomy.</p>
          </NavLink>

          <NavLink
            to="/admin/customers"
            className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition hover:border-zinc-700 hover:bg-zinc-900 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-zinc-800/80 p-2.5 border border-zinc-700/60 text-zinc-300">
                <Users size={20} />
              </div>
              <ArrowRight size={16} className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-zinc-300" />
            </div>
            <h4 className="mt-3 font-bold text-sm text-zinc-200">Customers</h4>
            <p className="mt-1 text-xs text-zinc-400">View customer records and purchasing behavior.</p>
          </NavLink>

          <NavLink
            to="/admin/stock-management"
            className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition hover:border-zinc-700 hover:bg-zinc-900 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-zinc-800/80 p-2.5 border border-zinc-700/60 text-zinc-300">
                <AlertCircle size={20} />
              </div>
              <ArrowRight size={16} className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-zinc-300" />
            </div>
            <h4 className="mt-3 font-bold text-sm text-zinc-200">Stock & Alerts</h4>
            <p className="mt-1 text-xs text-zinc-400">Track warehouse thresholds and restock runs.</p>
          </NavLink>
        </div>
      </div>
    </section>
  );
};
