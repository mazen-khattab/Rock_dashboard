import { useEffect, useRef, useState } from 'react';
import { DollarSign, LogOut, ShoppingCart, Users, X } from 'lucide-react';
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

    // Handles the logout action.
    const handleLogout = () => {
        setIsProfileMenuOpen(false);
        console.log('Logout clicked');
    };

    return (
        <section className="min-h-screen">
            {isNotificationsOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-sm"
                        onClick={() => setIsNotificationsOpen(false)}
                        aria-hidden="true"
                    />

                    <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col bg-white shadow-[-12px_0_30px_-18px_rgba(15,23,42,0.45)]">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
                                <p className="text-sm text-slate-500">Recent updates from your dashboard.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsNotificationsOpen(false)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 cursor-pointer"
                                aria-label="Close notifications"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{notification.title}</h4>
                                            <p className="mt-1 text-sm leading-6 text-slate-600">{notification.description}</p>
                                        </div>
                                        {notification.unread && (
                                            <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                                        )}
                                    </div>
                                    <p className="mt-3 text-xs font-medium text-slate-400">{notification.time}</p>
                                </div>
                            ))}
                        </div>
                    </aside>
                </>
            )}

            <div>
                <div className="mb-4 border-b border-solid border-[#e9e9e9] p-4 shadow-[0_7px_8px_-11px_gray]">
                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={toggleLanguage}
                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-slate-700 transition hover:bg-gray-200"
                            aria-label={`Switch language to ${language === 'EN' ? 'Arabic' : 'English'}`}
                        >
                            {language}
                        </button>

                        <button
                            type="button"
                            onClick={openNotifications}
                            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-slate-700 transition hover:bg-gray-200"
                            aria-label="Open notifications"
                        >
                            <i className="fa-regular fa-bell" />
                            {unreadNotificationsCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
                                    {unreadNotificationsCount}
                                </span>
                            )}
                        </button>

                        <div ref={profileMenuRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setIsProfileMenuOpen((current) => !current)}
                                className="flex cursor-pointer items-center rounded-2xl px-2 py-1 transition hover:bg-slate-100"
                                aria-label="Open profile menu"
                            >
                                <div className="mx-2 flex h-13 w-13 items-center justify-center rounded-full bg-gray-100">
                                    <i className="fa-solid fa-user text-2xl" />
                                </div>
                                <div className="text-left hidden md:block">
                                    <h4 className="font-bold">Mazen khatab</h4>
                                    <p className="text-[#919191]">mazenkhtab11@gmail.com</p>
                                </div>
                            </button>

                            {isProfileMenuOpen && (
                                <div className="absolute right-0 top-[calc(100%+12px)] z-30 min-w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                                    <div className="text-left md:hidden block p-2 border-b border-slate-200 mb-2">
                                        <h4 className="font-bold">Mazen khatab</h4>
                                        <p className="text-[#919191]">mazenkhtab11@gmail.com</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 px-4 md:grid-cols-2 xl:grid-cols-3">
                    {stats.map((stat, index) => (
                        <StatsCard key={index} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    );
};
