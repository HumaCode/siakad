import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import '../../../css/sistem/roles.css';
import MenuFormModal, { MenuData, ParentMenu, PermissionItem } from './Partials/MenuFormModal';
import DeleteMenuModal from './Partials/DeleteMenuModal';

export interface Menu {
    id: number;
    name: string;
    url: string;
    category: string | null;
    icon: string | null;
    active: boolean;
    orders: number;
    main_menu_id: number | null;
    main_menu_name: string | null;
    sub_menus_count: number;
    permissions: { id: number; name: string }[];
}

interface PaginatedMenus {
    data: Menu[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface Stats {
    total_menus: number;
    parent_menus: number;
    sub_menus: number;
    active_menus: number;
}

interface PageProps {
    menuList: PaginatedMenus;
    filters: {
        search: string;
    };
    stats: Stats;
    parentMenus: ParentMenu[];
    permissionsList: PermissionItem[];
}

// Animated Counter Component
function AnimatedCounter({ value }: { value: number }) {
    const [count, setCount] = useState(value);
    const prevValueRef = useRef(value);

    useEffect(() => {
        const start = prevValueRef.current;
        const end = value;
        
        if (start === end) {
            setCount(end);
            return;
        }

        const duration = 600; // ms
        const stepTime = 16;  // ~60fps
        const totalSteps = duration / stepTime;
        const increment = (end - start) / totalSteps;
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.round(current));
            }
        }, stepTime);

        prevValueRef.current = value;

        return () => clearInterval(timer);
    }, [value]);

    return <span>{count.toLocaleString('id-ID')}</span>;
}

export default function MenusIndex({ menuList, filters, stats, parentMenus, permissionsList }: PageProps) {
    // Filters State
    const [searchVal, setSearchVal] = useState(filters.search || '');

    // Modal states
    const [menuModalOpen, setMenuModalOpen] = useState(false);
    const [menuModalMode, setMenuModalMode] = useState<'add' | 'edit'>('add');
    const [selectedMenu, setSelectedMenu] = useState<MenuData | null>(null);
    const [formProcessing, setFormProcessing] = useState(false);
    const [deleteProcessing, setDeleteProcessing] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteMenuName, setDeleteMenuName] = useState('');
    const [deleteMenuId, setDeleteMenuId] = useState<number | null>(null);

    // Toast state
    const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'danger' } | null>(null);

    // Scroll to top button visibility
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 200);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Toast handler helper
    const triggerToast = (msg: string, type: 'success' | 'danger' = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Debounced Search implementation
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchVal !== (filters.search || '')) {
                runFilters(searchVal);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [searchVal]);

    const runFilters = (search: string) => {
        router.get('/sistem/menu', {
            search: search,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchVal(e.target.value);
    };

    const openAddMenu = () => {
        setFormProcessing(false);
        setMenuModalMode('add');
        setSelectedMenu(null);
        setMenuModalOpen(true);
    };

    const openEditMenu = (menu: Menu) => {
        setFormProcessing(false);
        setMenuModalMode('edit');
        setSelectedMenu({
            id: menu.id,
            name: menu.name,
            url: menu.url,
            category: menu.category || 'MAIN MENU',
            icon: menu.icon || '',
            active: menu.active,
            orders: menu.orders,
            main_menu_id: menu.main_menu_id,
            permissions: menu.permissions.map(p => p.id),
        });
        setMenuModalOpen(true);
    };

    const openDeleteMenu = (menu: Menu) => {
        setDeleteMenuId(menu.id);
        setDeleteMenuName(menu.name);
        setDeleteModalOpen(true);
    };

    // Save Menu
    const saveMenu = (data: MenuData) => {
        setFormProcessing(true);
        if (menuModalMode === 'add') {
            router.post('/sistem/menu', data as any, {
                onSuccess: () => {
                    setMenuModalOpen(false);
                    triggerToast('Menu baru berhasil disimpan');
                },
                onError: (err) => {
                    const errMsg = Object.values(err)[0] || 'Gagal menyimpan menu';
                    triggerToast(errMsg as string, 'danger');
                },
                onFinish: () => setFormProcessing(false)
            });
        } else {
            if (!selectedMenu?.id) return;
            router.put(`/sistem/menu/${selectedMenu.id}`, data as any, {
                onSuccess: () => {
                    setMenuModalOpen(false);
                    triggerToast('Perubahan menu berhasil disimpan');
                },
                onError: (err) => {
                    const errMsg = Object.values(err)[0] || 'Gagal mengubah menu';
                    triggerToast(errMsg as string, 'danger');
                },
                onFinish: () => setFormProcessing(false)
            });
        }
    };

    // Delete Menu
    const confirmDeleteMenu = () => {
        if (!deleteMenuId) return;
        setDeleteProcessing(true);
        router.delete(`/sistem/menu/${deleteMenuId}`, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                triggerToast('Menu berhasil dihapus');
            },
            onError: (err) => {
                const errMsg = Object.values(err)[0] || 'Gagal menghapus menu';
                triggerToast(errMsg as string, 'danger');
            },
            onFinish: () => setDeleteProcessing(false)
        });
    };

    // Copy to clipboard helper
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        triggerToast(`Disalin ke papan klip: "${text}"`);
    };

    // Pagination links generator with ellipsis
    const getFilteredLinks = () => {
        const links = menuList.links;
        if (links.length <= 10) return links;

        const current = menuList.current_page;
        const last = menuList.last_page;
        const delta = 2;

        const range = [];
        for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
            range.push(i);
        }

        if (current - delta > 2) {
            range.unshift('...');
        }
        if (current + delta < last - 1) {
            range.push('...');
        }

        range.unshift(1);
        if (last > 1) {
            range.push(last);
        }

        const filtered = [];
        filtered.push(links[0]); // Previous link

        range.forEach((page) => {
            if (page === '...') {
                filtered.push({ url: null, label: '...', active: false });
            } else {
                const found = links.find(l => l.label === page.toString());
                if (found) filtered.push(found);
            }
        });

        filtered.push(links[links.length - 1]); // Next link
        return filtered;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Menu" />

            <div className="min-h-screen bg-[#f0f4ff] dark:bg-slate-950 p-4 sm:p-6 lg:p-8 font-poppins relative">
                {/* Background Blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-300/10 dark:bg-blue-500/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 -left-20 w-[450px] h-[450px] bg-indigo-300/10 dark:bg-indigo-500/5 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10 w-full">
                    {/* Page Header Banner */}
                    <div className="page-header relative overflow-hidden text-white rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-none mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div>
                                <h4 className="text-xl sm:text-2xl font-extrabold font-playfair tracking-tight mb-1 flex items-center gap-2">
                                    <i className="bi bi-menu-button-wide-fill" /> Menu Manajemen
                                </h4>
                                <p className="text-sm text-blue-100 font-medium">
                                    Kelola menu navigasi utama, sub-menu hirarki, serta kontrol hak akses pengguna
                                </p>
                            </div>
                            <div className="flex gap-3 shrink-0">
                                <button className="btn-ph btn-ph-solid font-poppins" onClick={openAddMenu}>
                                    <i className="bi bi-plus-lg" /> Tambah Menu
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Summary Row (4-columns) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {/* Card 1: Total Menu */}
                        <div className="card-custom flex items-center gap-4 p-5 hover:-translate-y-0.5 transition-all duration-300">
                            <div className="rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg shrink-0" style={{ width: '46px', height: '46px' }}>
                                <i className="bi bi-list-nested" />
                            </div>
                            <div>
                                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">Total Menu</span>
                                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-poppins mt-0.5 leading-none">
                                    <AnimatedCounter value={stats.total_menus} />
                                </h3>
                            </div>
                        </div>

                        {/* Card 2: Parent Menus */}
                        <div className="card-custom flex items-center gap-4 p-5 hover:-translate-y-0.5 transition-all duration-300">
                            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg shrink-0" style={{ width: '46px', height: '46px' }}>
                                <i className="bi bi-folder-fill" />
                            </div>
                            <div>
                                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">Menu Utama</span>
                                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-poppins mt-0.5 leading-none">
                                    <AnimatedCounter value={stats.parent_menus} />
                                </h3>
                            </div>
                        </div>

                        {/* Card 3: Sub Menus */}
                        <div className="card-custom flex items-center gap-4 p-5 hover:-translate-y-0.5 transition-all duration-300">
                            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg shrink-0" style={{ width: '46px', height: '46px' }}>
                                <i className="bi bi-file-earmark-text-fill" />
                            </div>
                            <div>
                                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">Sub Menu</span>
                                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-poppins mt-0.5 leading-none">
                                    <AnimatedCounter value={stats.sub_menus} />
                                </h3>
                            </div>
                        </div>

                        {/* Card 4: Active Menus */}
                        <div className="card-custom flex items-center gap-4 p-5 hover:-translate-y-0.5 transition-all duration-300">
                            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg shrink-0" style={{ width: '46px', height: '46px' }}>
                                <i className="bi bi-check-circle-fill" />
                            </div>
                            <div>
                                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">Aktif</span>
                                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-poppins mt-0.5 leading-none">
                                    <AnimatedCounter value={stats.active_menus} />
                                    <span className="text-xs font-semibold text-emerald-500 ml-2">
                                        ({stats.total_menus > 0 ? ((stats.active_menus / stats.total_menus) * 100).toFixed(1) : 100}%)
                                    </span>
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Table Container Card */}
                    <div className="card-custom">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                            <h5 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                                <i className="bi bi-list-check text-blue-600" /> Daftar Hierarki Menu Navigasi
                            </h5>
                            
                            {/* Search Filter Bar */}
                            <div className="filter-bar">
                                <div className="relative flex-1 min-w-[200px]">
                                    <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                    <input 
                                        type="text" 
                                        className="filter-input w-full pl-9" 
                                        placeholder="Cari nama menu, URL, atau kategori..." 
                                        value={searchVal}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-5 overflow-x-auto">
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th className="w-16 text-center">#</th>
                                        <th>Nama Menu</th>
                                        <th>URL Rute</th>
                                        <th>Kategori</th>
                                        <th className="text-center">Tipe Menu</th>
                                        <th className="w-20 text-center">Urutan</th>
                                        <th className="w-32 text-center">Status</th>
                                        <th>Hak Akses Permission</th>
                                        <th className="w-32 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {menuList.data.map((m, i) => {
                                        return (
                                            <tr key={m.id}>
                                                <td className="text-slate-400 font-semibold text-xs text-center">
                                                    {(menuList.current_page - 1) * menuList.per_page + i + 1}
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700/50">
                                                            {m.icon ? <i className={`bi ${m.icon}`} /> : <i className="bi bi-file-earmark" />}
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-slate-700 dark:text-slate-200 text-xs">
                                                                {m.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded">
                                                            /{m.url}
                                                        </span>
                                                        <button 
                                                            onClick={() => handleCopy(m.url)}
                                                            className="text-slate-400 hover:text-blue-600 transition-colors"
                                                            title="Salin Rute URL"
                                                        >
                                                            <i className="bi bi-clipboard text-xs" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                                                        {m.category || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    {m.main_menu_id ? (
                                                        <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-100/40 dark:border-indigo-900/40">
                                                            Sub: {m.main_menu_name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-100/40 dark:border-blue-900/40">
                                                            Menu Utama
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="text-center font-bold text-xs text-slate-600 dark:text-slate-300">
                                                    {m.orders}
                                                </td>
                                                <td className="text-center">
                                                    <span className={`inline-flex items-center text-xs font-semibold ${m.active ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        <span className={`status-dot ${m.active ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600'}`} />
                                                        {m.active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                                                        {m.permissions.length > 0 ? (
                                                            m.permissions.map(p => (
                                                                <span key={p.id} className="font-mono text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 px-1.5 py-0.5 rounded border border-blue-100/20 dark:border-blue-800/20">
                                                                    {p.name}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400 italic">Terbuka (Publik)</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button 
                                                            className="btn-icon-sm edit" 
                                                            title="Edit Menu"
                                                            onClick={() => openEditMenu(m)}
                                                        >
                                                            <i className="bi bi-pencil" />
                                                        </button>
                                                        <button 
                                                            className="btn-icon-sm del" 
                                                            title="Hapus Menu"
                                                            onClick={() => openDeleteMenu(m)}
                                                        >
                                                            <i className="bi bi-trash" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {menuList.data.length === 0 && (
                                        <tr>
                                            <td colSpan={9} className="text-center py-8 text-slate-400">
                                                Tidak ada menu ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Section */}
                        {menuList.last_page > 1 && (
                            <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
                                <div className="text-xs text-slate-400">
                                    Menampilkan <strong>{menuList.from || 0}–{menuList.to || 0}</strong> dari <strong>{menuList.total}</strong> menu
                                </div>
                                <div className="flex gap-1">
                                    {getFilteredLinks().map((link, idx) => {
                                        if (!link.url) {
                                            return (
                                                <span 
                                                    key={idx} 
                                                    className="px-3 py-1.5 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-300 pointer-events-none"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        }
                                        return (
                                            <Link
                                                key={idx}
                                                href={link.url}
                                                className={`px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all ${
                                                    link.active 
                                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                                        : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700 hover:bg-slate-50'
                                                }`}
                                                preserveState
                                                preserveScroll
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Scroll to Top */}
            <button 
                className={`scroll-top ${showScrollTop ? 'visible' : ''}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                <i className="bi bi-chevron-up" />
            </button>

            {/* Modals */}
            <MenuFormModal 
                isOpen={menuModalOpen}
                mode={menuModalMode}
                selectedMenu={selectedMenu}
                parentMenus={parentMenus}
                permissionsList={permissionsList}
                processing={formProcessing}
                onClose={() => setMenuModalOpen(false)}
                onSave={saveMenu}
            />

            <DeleteMenuModal 
                isOpen={deleteModalOpen}
                menuName={deleteMenuName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDeleteMenu}
                processing={deleteProcessing}
            />

            {/* Toast Notifications */}
            {toast?.show && (
                <div 
                    className="flex items-center gap-3 fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.15)] font-bold text-xs transition-all duration-300 font-poppins animate-fade-in"
                    style={{ 
                        backgroundColor: toast.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                        border: toast.type === 'success' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)',
                        color: toast.type === 'success' ? '#10b981' : '#f43f5e',
                        boxShadow: toast.type === 'success' 
                            ? '0 0 20px rgba(16, 185, 129, 0.35), inset 0 0 10px rgba(16, 185, 129, 0.1)' 
                            : '0 0 20px rgba(244, 63, 94, 0.35), inset 0 0 10px rgba(244, 63, 94, 0.1)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        zIndex: 9999,
                        animation: 'toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${toast.type === 'success' ? 'bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}>
                        <i className={`bi ${toast.type === 'success' ? 'bi-check-lg' : 'bi-x-lg'} text-[10px]`} />
                    </div>
                    <span className="tracking-wide">{toast.msg}</span>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
