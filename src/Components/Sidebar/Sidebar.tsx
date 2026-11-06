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
            <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center justify-between border-b border-zinc-800/80 bg-zinc-950/95 px-3 sm:px-4 backdrop-blur shadow-md lg:hidden">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsMobileOpen(true)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 shadow-xs transition hover:bg-zinc-800 hover:text-zinc-100 active:scale-95 cursor-pointer"
                        aria-label="Open navigation menu"
                    >
                        <Menu size={20} />
                    </button>

                    <NavLink to="/admin" className="flex items-center gap-2.5">
                        <img src={logo} alt="Rock logo" className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg object-cover border border-zinc-800 shadow-xs" />
                        <span className="text-xl font-extrabold tracking-tight text-zinc-100">Rock</span>
                    </NavLink>
                </div>

                <div className="flex items-center gap-2">
                    <NavLink
                        to="/admin"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition"
                        title="Dashboard Profile"
                    >
                        <User size={18} />
                    </NavLink>
                </div>
            </header>

            {/* Mobile Drawer Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Drawer (Left Slide-in) */}
            <aside
                className={`fixed top-0 left-0 z-50 flex h-full w-72 max-w-[85vw] flex-col bg-zinc-950 border-r border-zinc-800 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                aria-label="Mobile navigation"
            >
                <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-4">
                    <NavLink to="/admin" className="flex items-center gap-3" onClick={() => setIsMobileOpen(false)}>
                        <img src={logo} alt="Rock logo" className="h-9 w-9 rounded-xl object-cover border border-zinc-800 shadow-xs" />
                        <span className="text-2xl font-extrabold tracking-tight text-zinc-100">Rock</span>
                    </NavLink>

                    <button
                        type="button"
                        onClick={() => setIsMobileOpen(false)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer"
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
                                <div key={index} className={`${baseClasses} text-zinc-500`}>
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
                                            ? "bg-gradient-to-r from-zinc-800 to-zinc-900 text-zinc-100 border border-zinc-700/60 shadow-sm font-semibold"
                                            : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200",
                                    ].join(" ")
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`text-lg w-6 text-center transition-colors ${isActive ? "text-emerald-400" : "text-zinc-500"}`} aria-hidden="true">
                                            {item.icon}
                                        </span>
                                        <span className="flex-1">{item.name}</span>
                                        {isActive && <span className="text-xl leading-none text-zinc-400">&rsaquo;</span>}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="border-t border-zinc-800/80 p-4 bg-zinc-950">
                    <div className="flex items-center gap-3 rounded-xl bg-zinc-900/90 border border-zinc-800 p-2.5 mb-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-sm">
                            {user?.userName}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-zinc-200">{displayName}</p>
                            <p className="truncate text-xs text-zinc-500">{profile?.email ?? user?.role.join(", ")}</p>
                        </div>
                    </div>
                    <LogoutButton />
                </div>
            </aside>

            {/* Desktop Sidebar (>= 1024px) */}
            <div className="hidden lg:flex min-h-screen bg-black shrink-0 border-r border-zinc-800/80">
                <aside
                    className={`${
                        isDesktopOpen ? "lg:w-65" : "lg:w-20"
                    } sticky top-0 left-0 z-30 flex h-screen flex-col bg-zinc-950 px-3 py-6 shadow-2xl transition-all duration-300 overflow-y-auto no-scrollbar`}
                >
                    <div className={`mb-8 flex items-center ${displayLogo ? "justify-between" : "justify-center"}`}>
                        {displayLogo && (
                            <NavLink to="/admin" className="flex items-center gap-3">
                                <img src={logo} alt="Rock logo" className="w-10 h-10 rounded-xl object-cover border border-zinc-800 shadow-xs" />
                                <span className="text-2xl font-black tracking-tight text-zinc-100">Rock</span>
                            </NavLink>
                        )}

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={openDesktopMenu}
                                className={`rounded-xl p-2.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-zinc-800/80 transition inline-flex ${
                                    isDesktopOpen ? "" : "justify-center"
                                } cursor-pointer`}
                                aria-label={isDesktopOpen ? "Collapse sidebar" : "Expand sidebar"}
                            >
                                <i className={`fa-solid ${isDesktopOpen ? "fa-angle-left" : "fa-angle-right"} text-lg`} />
                            </button>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-1.5">
                        {menuItems.map((item, index) => {
                            const baseClasses =
                                "flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm transition-all duration-200";

                            if (!item.link) {
                                return (
                                    <div key={index} className={`${baseClasses} text-zinc-500`}>
                                        <span className="text-lg w-6 text-center">{item.icon}</span>
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
                                                ? "bg-gradient-to-r from-zinc-800 to-zinc-900 text-zinc-100 border border-zinc-700/70 shadow-[0_2px_12px_rgba(0,0,0,0.5)] font-semibold"
                                                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
                                        ].join(" ")
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span className={`text-lg w-6 text-center transition-colors ${isActive ? "text-emerald-400" : "text-zinc-500"}`} aria-hidden="true">
                                                {item.icon}
                                            </span>
                                            {isDesktopOpen && (
                                                <>
                                                    <span className="flex-1 font-medium">{item.name}</span>
                                                    {isActive && <span className="text-xl leading-none text-zinc-400">&rsaquo;</span>}
                                                </>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>

                    <div className="mt-auto border-t border-zinc-800/80 pt-3">
                        <LogoutButton compact={!isDesktopOpen} />
                    </div>
                </aside>
            </div>
        </>
    );
};
