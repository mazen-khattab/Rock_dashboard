import { useEffect, useRef, useState } from 'react';
import { DollarSign, ShoppingCart, Users, X } from 'lucide-react';
import { useAuth } from '../../Context/useAuth';
import { LogoutButton } from '../Auth/LogoutButton';
import StatsCard from './StatsCard';
import type { NotificationItem } from '../../Types/Overview';

const notificationsSeed: NotificationItem[] = [
    {
        id: 1,
        title: 'New order received',
        description: 'Order #1054 was placed a few minutes ago.',
        time: '2 min ago',
        unread: true,
    },
    {
        id: 2,
        title: 'Stock alert',
        description: 'Black hoodie size L is running low in stock.',
        time: '15 min ago',
        unread: true,
    },
    {
        id: 3,
        title: 'Customer message',
        description: 'A customer asked about delivery availability.',
        time: '1 hour ago',
        unread: true,
    },
];

export const Overview = () => {
    const { user, profile } = useAuth();
    const displayName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : user?.userName;
    const [language, setLanguage] = useState<'EN' | 'AR'>('EN');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>(notificationsSeed);
    const profileMenuRef = useRef<HTMLDivElement | null>(null);

    const stats = [
        {
            title: 'Total Revenue',
            value: '$45,231',
            change: 12.5,
            icon: DollarSign,
            iconColor: 'text-green-600',
            iconBg: 'bg-green-100',
        },
        {
            title: 'Active Users',
            value: '2,845',
            change: 8.2,
            icon: Users,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100',
        },
        {
            title: 'Total Orders',
            value: '1,234',
            change: -3.4,
            icon: ShoppingCart,
            iconColor: 'text-orange-600',
            iconBg: 'bg-orange-100',
        },
    ];

    // Calculate the number of unread notifications
    const unreadNotificationsCount = notifications.filter((notification) => notification.unread).length;

    // Closes the profile menu if the user clicks anywhere outside of the dropdown element.
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Toggles the language between English and Arabic.
    const toggleLanguage = () => {
        setLanguage((currentLanguage) => (currentLanguage === 'EN' ? 'AR' : 'EN'));
    };

    // Opens the notifications panel and marks all notifications as read.
    const openNotifications = () => {
        setIsNotificationsOpen(true);
        setNotifications((currentNotifications) =>
            currentNotifications.map((notification) => ({
                ...notification,
                unread: false,
            })),
        );
    };

    return (
        <section className="min-h-screen pb-10">
            {/* Notification Drawer Backdrop */}
            {isNotificationsOpen && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-xs transition-opacity"
                        onClick={() => setIsNotificationsOpen(false)}
                        aria-hidden="true"
                    />

                    <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-sm sm:max-w-md flex-col bg-white shadow-2xl transition-transform duration-300">
                        <div className="flex items-center justify-between border-b border-slate-200 px-4 sm:px-6 py-4 sm:py-5">
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900">Notifications</h3>
                                <p className="text-xs sm:text-sm text-slate-500">Recent updates from your dashboard.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsNotificationsOpen(false)}
                                className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 cursor-pointer"
                                aria-label="Close notifications"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 sm:p-4 shadow-xs"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-sm sm:text-base text-slate-900 truncate">{notification.title}</h4>
                                            <p className="mt-1 text-xs sm:text-sm leading-5 text-slate-600">{notification.description}</p>
                                        </div>
                                        {notification.unread && (
                                            <span className="mt-1.5 inline-flex h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                                        )}
                                    </div>
                                    <p className="mt-2 text-xs font-medium text-slate-400">{notification.time}</p>
                                </div>
                            ))}
                        </div>
                    </aside>
                </>
            )}

            <div>
                {/* Top Action Bar */}
                <div className="mb-4 sm:mb-6 border-b border-slate-200 bg-white px-3 sm:px-6 py-3 sm:py-4 shadow-xs">
                    <div className="flex items-center justify-end gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={toggleLanguage}
                            className="flex h-9 w-9 sm:h-10 sm:w-10 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-xs sm:text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                            aria-label={`Switch language to ${language === 'EN' ? 'Arabic' : 'English'}`}
                        >
                            {language}
                        </button>

                        <button
                            type="button"
                            onClick={openNotifications}
                            className="relative flex h-9 w-9 sm:h-10 sm:w-10 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                            aria-label="Open notifications"
                        >
                            <i className="fa-regular fa-bell text-sm sm:text-base" />
                            {unreadNotificationsCount > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 flex min-h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                                    {unreadNotificationsCount}
                                </span>
                            )}
                        </button>

                        <div ref={profileMenuRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setIsProfileMenuOpen((current) => !current)}
                                className="flex cursor-pointer items-center rounded-xl p-1 transition hover:bg-slate-100"
                                aria-label="Open profile menu"
                            >
                                <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-teal-50 text-teal-800 font-bold text-xs sm:text-sm border border-teal-100">
                                    {user?.userName}
                                </div>
                                <div className="text-left hidden md:block ml-2.5 mr-1">
                                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{displayName}</h4>
                                    <p className="text-xs text-slate-500">{profile?.email ?? user?.role.join(', ')}</p>
                                </div>
                            </button>

                            {isProfileMenuOpen && (
                                <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-60 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                                    <div className="text-left md:hidden block p-3 border-b border-slate-100 mb-1">
                                        <h4 className="font-bold text-sm text-slate-900">{displayName}</h4>
                                        <p className="text-xs text-slate-500 truncate">{profile?.email ?? user?.role.join(', ')}</p>
                                    </div>
                                    <LogoutButton />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dashboard Metrics Grid */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 px-3 sm:px-6 md:grid-cols-2 xl:grid-cols-3">
                    {stats.map((stat, index) => (
                        <StatsCard key={index} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    );
};
