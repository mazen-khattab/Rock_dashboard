import { NavLink } from "react-router-dom";
import logo from "../../assets/Rock_logo.jpg";

export const Sidebar = () => {
    const menuItems = [
        { name: "Dashboard", link: "/admin", icon: <i className="fa-solid fa-house" /> },
        { name: "Products", link: "/admin/products", icon: <i className="fa-solid fa-boxes-stacked" /> },
        { name: "Orders", link: "/admin/orders", icon: <i className="fa-solid fa-cart-shopping" /> },
        { name: "Offers", link: "/admin/offers", icon: <i className="fa-solid fa-tag" /> },
        { name: "Inventory", link: "/admin/inventory", icon: <i className="fa-solid fa-warehouse" /> },
        { name: "Customer", link: "/admin/customers", icon: <i className="fa-solid fa-people-group" /> },
        { name: "Users", link: "/admin/users", icon: <i className="fa-solid fa-users" /> },
        { name: "Settings", link: "/admin/settings", icon: <i className="fa-solid fa-gear" /> },
    ];

    return (
        <div className="flex min-h-screen bg-slate-100">
            <aside className="w-65 bg-white px-3 py-8 shadow-[1px_0_15px_-8px_#00000066]">
                <NavLink to="/admin" className="mb-12 flex items-center gap-3">
                    <img src={logo} alt="Rock logo" className="w-15 rounded-[10px]" />
                    <span className="text-2xl font-extrabold text-slate-800">Rock</span>
                </NavLink>

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
                                key={index}
                                end={item.link === "/admin"}
                                className={({ isActive }) => [
                                    baseClasses,
                                    isActive
                                        ? "bg-linear-to-r from-[#003334] to-[#014849b8] text-white shadow-[0_4px_12px_rgba(79,209,197,0.3)]"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                                ].join(" ")}>
                                {({ isActive }) => (
                                    <>
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="flex-1 font-medium">{item.name}</span>
                                        {isActive && <span className="text-2xl leading-none">&rsaquo;</span>}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>
        </div>
    );
};
