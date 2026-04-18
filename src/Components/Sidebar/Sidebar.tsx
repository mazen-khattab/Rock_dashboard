import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../assets/Rock_logo.jpg";
import { useEffect, useState } from "react";

export const Sidebar = () => {
    const [isDesktopOpen, setIsDesktopOpen] = useState<boolean>();
    const [isMobileOpen, setIsMobileOpen] = useState<boolean>();
    const [displayLogo, setDisplayLogo] = useState<boolean>();

    const menuItems = [
        { name: "Dashboard", link: "/admin", icon: <i className="fa-solid fa-house" /> },
        { name: "Products", link: "/admin/products", icon: <i className="fa-solid fa-boxes-stacked" /> },
        { name: "Orders", link: "/admin/orders", icon: <i className="fa-solid fa-cart-shopping" /> },
        { name: "Colors", link: "/admin/colors", icon: <i className="fa-solid fa-palette" /> },
        { name: "Stock Management", link: "/admin/stock-management", icon: <i className="fa-solid fa-warehouse" /> },
        { name: "Customer", link: "/admin/customers", icon: <i className="fa-solid fa-people-group" /> },
        { name: "Users", link: "/admin/users", icon: <i className="fa-solid fa-users" /> },
        // { name: "Offers", link: "/admin/offers", icon: <i className="fa-solid fa-tag" /> },
        // { name: "Settings", link: "/admin/settings", icon: <i className="fa-solid fa-gear" /> },
    ];

    useEffect(() => {
        const updateSideBar = () => {
            if (window.innerWidth < 1024) {
                setDisplayLogo(true);
                setIsMobileOpen(false);
                setIsDesktopOpen(false);
            } else {
                setIsDesktopOpen(false);
                setDisplayLogo(false);
                setIsMobileOpen(false);
            }
        }

        updateSideBar();
        window.addEventListener('resize', updateSideBar);

        return () => window.removeEventListener('resize', updateSideBar);
    }, [])
    

    const openDesktopMenu = () => {
        setIsDesktopOpen((prev) => !prev)
        setDisplayLogo((prev) => !prev)
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsMobileOpen(true)}
                className="fixed top-4 left-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50 lg:hidden"
                aria-label="Open menu"
            >
                <Menu size={20} />
            </button>

            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            <div className="flex min-h-screen bg-slate-100">
                <aside className={`${isDesktopOpen ? "lg:w-65" : "lg:w-20"} fixed top-0 left-0 z-50 flex h-screen w-72 flex-col bg-white px-3 py-8 shadow-[1px_0_15px_-8px_#00000066] transition-transform duration-300 lg:sticky lg:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:block`}>
                    <div className={`mb-12 flex items-center ${displayLogo ? "justify-between" : "justify-center"}`}>
                        {displayLogo &&
                            <NavLink to="/admin" className="flex items-center gap-3" onClick={() => setIsMobileOpen(false)}>
                                <img src={logo} alt="Rock logo" className="w-15 rounded-[10px]" />
                                <span className="text-2xl font-extrabold text-slate-800">Rock</span>
                            </NavLink>
                        }

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={openDesktopMenu}
                                className={`hidden rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:inline-flex ${isDesktopOpen ? "" : "justify-center"} cursor-pointer`}
                                aria-label={isDesktopOpen ? "Collapse sidebar" : "Expand sidebar"}
                            >
                                <i className={`fa-solid ${isDesktopOpen ? "fa-angle-left" : "fa-angle-right"} text-xl`} />
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsMobileOpen(false)}
                                className="inline-flex rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
                                aria-label="Close menu"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-2">
                        {menuItems.map((item, index) => {
                            const baseClasses = "flex items-center gap-4 rounded-[10px] px-4 py-3.5 text-base transition-all duration-300";

                            if (!item.link) {
                                return (
                                    <div key={index} className={`${baseClasses} text-slate-500`}>
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="flex-1 font-medium">{item.name}</span>
                                    </div>
                                );
                            }

                         return (
                                <NavLink
                                    to={item.link}
                                    key={item.link}
                                    end={item.link === "/admin"}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={({ isActive }) => [
                                        baseClasses,
                                        isActive
                                            ? "bg-linear-to-r from-[#003334] to-[#014849b8] text-white shadow-[0_4px_12px_rgba(79,209,197,0.3)]"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                                    ].join(" ")}>
                                    {({ isActive }) => (
                                        <>
                                            {/* <span className="text-xl">{item.icon}</span> */}
                                            <span className="text-xl" aria-hidden="true">{item.icon}</span>
                                            {(isDesktopOpen || isMobileOpen) &&
                                                <>
                                                    <span className="flex-1 font-medium">{item.name}</span>
                                                    {isActive && <span className="text-2xl leading-none">&rsaquo;</span>}
                                                </>
                                            }
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>
                </aside>
            </div>
        </>
    );
};
