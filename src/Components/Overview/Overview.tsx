import { DollarSign, Users, ShoppingCart } from 'lucide-react';
import StatsCard from './StatsCard';

export const Overview = () => {
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

    return (
        <section className="min-h-screen">
            <div className="mx-auto max-w-7xl">
                {/* <div className="mb-8 rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-white to-teal-50 p-8 shadow-sm">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <span className="mb-3 inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
                                Overview
                            </span>
                            <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Dashboard Overview
                            </h2>
                            <p className="text-base leading-7 text-slate-600">
                                Welcome back! Here&apos;s a clean snapshot of your store performance, customer activity, and growth this month.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
                            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                                <p className="text-sm text-slate-500">Updated</p>
                                <p className="mt-1 text-lg font-semibold text-slate-900">Today</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                                <p className="text-sm text-slate-500">Performance</p>
                                <p className="mt-1 text-lg font-semibold text-emerald-600">Strong</p>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className='p-4 border-b border-solid border-[#e9e9e9] mb-4 shadow-[0_7px_8px_-11px_gray]'>
                    <div className='flex items-center justify-end'>
                        <div className=' bg-gray-100 flex items-center justify-center w-10 h-10 rounded-full mx-2 cursor-pointer'>
                            EN
                        </div>
                        <div className=' bg-gray-100 flex items-center justify-center w-10 h-10 rounded-full mx-2 cursor-pointer'>
                            <i className="fa-regular fa-bell"></i>
                        </div>
                        <div className=' bg-gray-100 flex items-center justify-center w-10 h-10 rounded-full mx-1 cursor-pointer'>
                            <i className="fa-regular fa-envelope"></i>
                        </div>
                        <div className='flex items-center'>
                            <div className=' bg-gray-100 flex items-center justify-center w-13 h-13 rounded-full mx-2'>
                                <i className="fa-solid fa-user text-2xl"></i>
                            </div>
                            <div>
                                <h4 className='font-bold'>Mazen khatab</h4>
                                <p className='text-[#919191]'>mazenkhtab11@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 px-4">
                    {stats.map((stat, index) => (
                        <StatsCard key={index} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    );
}
