import { Link, usePage, router } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState, useEffect } from 'react';

interface SubMenu {
    id: number;
    name: string;
    url: string;
    icon: string | null;
}

interface MenuItem {
    id: number;
    name: string;
    url: string;
    category: string;
    icon: string | null;
    sub_menus: SubMenu[];
}

const mapIcon = (iconName: string | null) => {
    switch (iconName) {
        case 'academic-cap': return 'bi-mortarboard-fill';
        case 'user-group': return 'bi-people-fill';
        case 'briefcase': return 'bi-person-badge-fill';
        case 'document-text': return 'bi-file-earmark-text-fill';
        case 'calendar': return 'bi-calendar3';
        case 'credit-card': return 'bi-credit-card-fill';
        case 'receipt-refund': return 'bi-receipt-cutoff';
        case 'menu': return 'bi-menu-button-wide-fill';
        case 'shield-check': return 'bi-shield-fill-check';
        case 'key': return 'bi-key-fill';
        case 'clipboard-list': return 'bi-clipboard-data-fill';
        case 'cog': return 'bi-gear-fill';
        default: return 'bi-circle-fill';
    }
};

const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, menus } = usePage<any>().props;
    const user = auth.user;
    const menuData: Record<string, MenuItem[]> = menus || {};

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState<Record<number, boolean>>({});
    const [isDark, setIsDark] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleTheme = () => {
        const nextDark = !isDark;
        setIsDark(nextDark);
        if (nextDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const toggleSubmenu = (menuId: number) => {
        setOpenSubmenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const userRole = user?.roles && user.roles.length > 0
        ? user.roles[0].replace('_', ' ').toUpperCase()
        : 'USER';

    // Pretty display role for header / layout user info
    const displayRole = user?.roles && user.roles.length > 0
        ? user.roles[0].split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : 'User';

    return (
        <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-300 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${isCollapsed ? 'sidebar-collapsed' : ''}`}>

            {/* Dotted Grid & Orbs Background */}
            <div className="bg-anim">
                <div className="dot-grid" />
                <div className="bg-orb bg-orb-1" />
                <div className="bg-orb bg-orb-2" />
                <div className="bg-orb bg-orb-3" />
            </div>

            {/* Fixed Left Sidebar */}
            <aside className="sidebar">
                {/* Brand Header */}
                <div className="sidebar-brand">
                    <div className="brand-icon">
                        <i className="bi bi-mortarboard-fill text-white" />
                    </div>
                    <div className="brand-text">
                        <h6>SIAKAD PORTAL</h6>
                        <small>Universitas Nusantara</small>
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <div className="sidebar-nav">
                    {/* Fixed Dashboard Link */}
                    <Link
                        href={route('dashboard')}
                        className={`nav-item-link ${route().current('dashboard') ? 'active' : ''}`}
                    >
                        <span className="nav-icon">
                            <i className="bi bi-speedometer2" />
                        </span>
                        <span className="nav-label">Dashboard Overview</span>
                    </Link>

                    {/* Dynamic Seeded Menus Grouped by Category */}
                    {Object.entries(menuData).map(([category, items]) => (
                        <div key={category} className="mb-4">
                            <div className="nav-section-title">{category}</div>
                            {items.map((item) => {
                                const hasSub = item.sub_menus && item.sub_menus.length > 0;
                                const isSubOpen = !!openSubmenus[item.id];
                                const isActive = route().current(item.url + '*') || window.location.pathname.startsWith('/' + item.url);

                                return (
                                    <div key={item.id}>
                                        {hasSub ? (
                                            <button
                                                onClick={() => toggleSubmenu(item.id)}
                                                className={`nav-item-link ${isActive ? 'active' : ''}`}
                                            >
                                                <span className="nav-icon">
                                                    <i className={`bi ${mapIcon(item.icon)}`} />
                                                </span>
                                                <span className="nav-label">{item.name}</span>
                                                <span className="mr-2">
                                                    <i className={`bi bi-chevron-${isSubOpen ? 'up' : 'down'} text-[10px] opacity-50`} />
                                                </span>
                                            </button>
                                        ) : (
                                            <Link
                                                href={`/${item.url}`}
                                                className={`nav-item-link ${isActive ? 'active' : ''}`}
                                            >
                                                <span className="nav-icon">
                                                    <i className={`bi ${mapIcon(item.icon)}`} />
                                                </span>
                                                <span className="nav-label">{item.name}</span>
                                            </Link>
                                        )}

                                        {/* Submenus */}
                                        {hasSub && (
                                            <div className={`nav-submenu ${isSubOpen ? 'open' : ''}`}>
                                                {item.sub_menus.map((sub) => {
                                                    const isSubActive = window.location.pathname.endsWith('/' + sub.url) || window.location.pathname.includes('/' + sub.url);
                                                    return (
                                                        <Link
                                                            key={sub.id}
                                                            href={`/${sub.url}`}
                                                            className={`nav-subitem ${isSubActive ? 'active' : ''}`}
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Sidebar User Info (Bottom) */}
                {user && (
                    <div className="sidebar-user">
                        <div className="user-avatar-sm">
                            {getInitials(user.name)}
                        </div>
                        <div className="sidebar-user-info">
                            <div className="name">{user.name}</div>
                            <div className="role">{userRole}</div>
                        </div>
                    </div>
                )}
            </aside>

            {/* Topbar Header */}
            <header className="topbar">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="topbar-toggle transition-colors duration-200"
                    title="Toggle Sidebar"
                >
                    <i className="bi bi-list" />
                </button>

                {/* Breadcrumbs / Page Title */}
                <div className="topbar-breadcrumb">
                    <div className="page-title text-slate-800 dark:text-slate-100 font-extrabold flex items-center gap-2 font-poppins">
                        {header ? header : "Dashboard"}
                    </div>
                    <p className="breadcrumb-trail text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5 font-poppins">
                        SIAKAD / {header ? header : 'Dashboard'}
                    </p>
                </div>

                {/* Actions (Search, Notification, Dark Mode, Profile) */}
                <div className="flex items-center gap-3 ml-auto">
                    {/* Search Field */}
                    <div className="relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Cari mahasiswa, mata kuliah..."
                            className="w-56 pl-9 pr-4 py-1.5 text-xs bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full focus:w-72 focus:border-blue-500 outline-none transition-all duration-300 font-medium"
                        />
                        <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    </div>

                    {/* Notification Button */}
                    <button className="topbar-btn" title="Notifikasi">
                        <i className="bi bi-bell" />
                        <span className="topbar-badge" />
                    </button>

                    {/* Chat Button */}
                    <button className="topbar-btn" title="Pesan">
                        <i className="bi bi-chat-left-text" />
                    </button>

                    {/* Help Button */}
                    <button className="topbar-btn" title="Bantuan">
                        <i className="bi bi-question-circle" />
                    </button>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="topbar-btn"
                        title={isDark ? "Light Mode" : "Dark Mode"}
                    >
                        <i className={`bi bi-${isDark ? 'sun' : 'moon'}`} />
                    </button>

                    {/* Profile Dropdown */}
                    {user && (
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className="topbar-user"
                            >
                                <div className="topbar-avatar">
                                    {getInitials(user.name)}
                                </div>
                                <div className="topbar-user-text hidden sm:block">
                                    <span className="name">{user.name}</span>
                                    <span className="role">{displayRole}</span>
                                </div>
                                <i className="bi bi-chevron-down text-[10px] text-slate-400 ml-1" />
                            </button>

                            {/* Dropdown Menu */}
                            {showProfileDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <Link
                                        href={route('profile.edit')}
                                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 transition-all font-semibold"
                                        onClick={() => setShowProfileDropdown(false)}
                                    >
                                        <i className="bi bi-person-fill" /> Edit Profil
                                    </Link>
                                    <div className="border-t border-slate-100 dark:border-slate-800/80 my-1" />
                                    <form onSubmit={handleLogout}>
                                        <button
                                            type="submit"
                                            className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all font-semibold cursor-pointer"
                                        >
                                            <i className="bi bi-box-arrow-right" /> Keluar Aplikasi
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Main Wrapper */}
            <main className="main-wrapper">
                <div className="main-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
