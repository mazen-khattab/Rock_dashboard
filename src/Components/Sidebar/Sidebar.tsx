import { NavLink } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import logo from "../../assets/photo_2026-11-04_19-43-43.jpg";
import { useEffect, useState } from "react";
import { useAuth } from "../../Context/useAuth";
import { LogoutButton } from "../Auth/LogoutButton";

export const Sidebar = () => {
    const { user, profile } = useAuth();
    const displayName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : user?.userName;
    const [isDesktopOpen, setIsDesktopOpen] = useState<boolean>(false);
    const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
    const [displayLogo, setDisplayLogo] = useState<boolean>(false);

    const menuItems = [
        { name: "Dashboard", link: "/admin", icon: <i className="fa-solid fa-house" /> },
        { name: "Products", link: "/admin/products", icon: <i className="fa-solid fa-boxes-stacked" /> },
        { name: "Categories", link: "/admin/categories", icon: <i className="fa-solid fa-layer-group" /> },
        { name: "Orders", link: "/admin/orders", icon: <i className="fa-solid fa-cart-shopping" /> },
        { name: "Stock Management", link: "/admin/stock-management", icon: <i className="fa-solid fa-warehouse" /> },
        { name: "Colors", link: "/admin/colors", icon: <i className="fa-solid fa-palette" /> },
        { name: "Sizes", link: "/admin/sizes", icon: <i className="fa-solid fa-up-right-and-down-left-from-center" /> },
        { name: "Customer", link: "/admin/customers", icon: <i className="fa-solid fa-people-group" /> },
        { name: "Users", link: "/admin/users", icon: <i className="fa-solid fa-users" /> },
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
        };

        updateSideBar();
        window.addEventListener("resize", updateSideBar);

        return () => window.removeEventListener("resize", updateSideBar);
    }, []);

    // Close mobile menu on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isMobileOpen) {
                setIsMobileOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMobileOpen]);

    // Prevent body scrolling when mobile drawer is open
    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileOpen]);

    const openDesktopMenu = () => {
        setIsDesktopOpen((prev) => !prev);
        setDisplayLogo((prev) => !prev);
    };

    return (
        <>
            {/* Top Navigation Bar for Mobile and Tablet (< 1024px) */}
            <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-3 sm:px-4 backdrop-blur shadow-xs lg:hidden">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsMobileOpen(true)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-slate-50 active:scale-95 cursor-pointer"
                        aria-label="Open navigation menu"
                    >
                        <Menu size={20} />
                    </button>

                    <NavLink to="/admin" className="flex items-center gap-2.5">
                        <img src={logo} alt="Rock logo" className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg object-cover shadow-xs" />
                        <span className="text-xl font-extrabold tracking-tight text-slate-900">Rock</span>
                    </NavLink>
                </div>

                <div className="flex items-center gap-2">
                    <NavLink
                        to="/admin"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                        title="Dashboard Profile"
                    >
                        <User size={18} />
                    </NavLink>
                </div>
            </header>

            {/* Mobile Drawer Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Drawer (Left Slide-in) */}
            <aside
                className={`fixed top-0 left-0 z-50 flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                aria-label="Mobile navigation"
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <NavLink to="/admin" className="flex items-center gap-3" onClick={() => setIsMobileOpen(false)}>
                        <img src={logo} alt="Keef Wear logo" className="h-9 w-9 rounded-xl object-cover shadow-xs" />
                        <span className="text-2xl font-extrabold tracking-tight text-slate-900">Keef Wear</span>
                    </NavLink>

                    <button
                        type="button"
                        onClick={() => setIsMobileOpen(false)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 cursor-pointer"
                        aria-label="Close navigation menu"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    {menuItems.map((item, index) => {
                        const baseClasses =
                            "flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200";

                        if (!item.link) {
                            return (
                                <div key={index} className={`${baseClasses} text-slate-400`}>
                                    <span className="text-lg w-6 text-center">{item.icon}</span>
                                    <span className="flex-1">{item.name}</span>
                                </div>
                            );
                        }

                        return (
                            <NavLink
                                to={item.link}
                                key={item.link}
                                end={item.link === "/admin"}
                                onClick={() => setIsMobileOpen(false)}
                                className={({ isActive }) =>
                                    [
                                        baseClasses,
                                        isActive
                                            ? "bg-linear-to-r from-[#003334] to-[#014849b8] text-white shadow-sm font-semibold"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                                    ].join(" ")
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className="text-lg w-6 text-center" aria-hidden="true">
                                            {item.icon}
                                        </span>
                                        <span className="flex-1">{item.name}</span>
                                        {isActive && <span className="text-xl leading-none">&rsaquo;</span>}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="border-t border-slate-100 p-4">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-800 font-bold text-sm">
                            {user?.userName}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-slate-900">{displayName}</p>
                            <p className="truncate text-xs text-slate-500">{profile?.email ?? user?.role.join(", ")}</p>
                        </div>
                    </div>
                    <LogoutButton />
                </div>
            </aside>

            {/* Desktop Sidebar (>= 1024px) - Preserved exactly for desktop */}
            <div className="hidden lg:flex min-h-screen bg-slate-100 shrink-0">
                <aside
                    className={`${
                        isDesktopOpen ? "lg:w-65" : "lg:w-20"
                    } sticky top-0 left-0 z-30 flex h-screen flex-col bg-white px-3 py-8 shadow-[1px_0_15px_-8px_#00000066] transition-all duration-300 overflow-y-auto`}
                >
                    <div className={`mb-12 flex items-center ${displayLogo ? "justify-between" : "justify-center"}`}>
                        {displayLogo && (
                            <NavLink to="/admin" className="flex items-center gap-3">
                                <img src={logo} alt="Rock logo" className="w-15 rounded-[10px]" />
                                <span className="text-2xl font-extrabold text-slate-800">Rock</span>
                            </NavLink>
                        )}

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={openDesktopMenu}
                                className={`rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 inline-flex ${
                                    isDesktopOpen ? "" : "justify-center"
                                } cursor-pointer`}
                                aria-label={isDesktopOpen ? "Collapse sidebar" : "Expand sidebar"}
                            >
                                <i className={`fa-solid ${isDesktopOpen ? "fa-angle-left" : "fa-angle-right"} text-xl`} />
                            </button>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-2">
                        {menuItems.map((item, index) => {
                            const baseClasses =
                                "flex items-center gap-4 rounded-[10px] px-4 py-3.5 text-base transition-all duration-300";

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
                                    className={({ isActive }) =>
                                        [
                                            baseClasses,
                                            isActive
                                                ? "bg-linear-to-r from-[#003334] to-[#014849b8] text-white shadow-[0_4px_12px_rgba(79,209,197,0.3)]"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                                        ].join(" ")
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span className="text-xl" aria-hidden="true">
                                                {item.icon}
                                            </span>
                                            {isDesktopOpen && (
                                                <>
                                                    <span className="flex-1 font-medium">{item.name}</span>
                                                    {isActive && <span className="text-2xl leading-none">&rsaquo;</span>}
                                                </>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>
                    <div className="mt-auto border-t border-slate-100 pt-3">
                        <LogoutButton compact={!isDesktopOpen} />
                    </div>
                </aside>
            </div>
        </>
    );
};
