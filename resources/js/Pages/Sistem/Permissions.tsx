import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import '../../../css/sistem/roles.css';
import PermissionFormModal from './Partials/PermissionFormModal';
import DeletePermissionModal from './Partials/DeletePermissionModal';

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    is_active: boolean;
    roles_count?: number;
}

interface PaginatedPermissions {
    data: Permission[];
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
    total_permissions: number;
    active_permissions: number;
    inactive_permissions: number;
}

interface PageProps {
    permissions: PaginatedPermissions;
    filters: {
        search: string;
    };
    stats: Stats;
}

// Animated Counter Component
function AnimatedCounter({ value }: { value: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) return;

        const duration = 1000; // ms
        const stepTime = 16;   // ~60fps
        const totalSteps = duration / stepTime;
        const increment = end / totalSteps;

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{count.toLocaleString('id-ID')}</span>;
}

export default function PermissionsIndex({ permissions, filters, stats }: PageProps) {
    // Filters State
    const [searchVal, setSearchVal] = useState(filters.search || '');

    // Modal states
    const [permissionModalOpen, setPermissionModalOpen] = useState(false);
    const [permissionModalMode, setPermissionModalMode] = useState<'add' | 'edit'>('add');
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
    const [permissionFormName, setPermissionFormName] = useState('');
    const [permissionFormGuard, setPermissionFormGuard] = useState('web');
    const [permissionFormActive, setPermissionFormActive] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletePermissionName, setDeletePermissionName] = useState('');

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

    // Filter Trigger
    const runFilters = (search: string) => {
        router.get('/sistem/permissions', {
            search: search,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchVal(val);
        // Debounce search
        const delayDebounce = setTimeout(() => {
            runFilters(val);
        }, 500);
        return () => clearTimeout(delayDebounce);
    };

    // Show Toast Helper
    const triggerToast = (msg: string, type: 'success' | 'danger' = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    // Modal controls
    const openAddPermission = () => {
        setPermissionModalMode('add');
        setSelectedPermission(null);
        setPermissionFormName('');
        setPermissionFormGuard('web');
        setPermissionFormActive(true);
        setPermissionModalOpen(true);
    };

    const openEditPermission = (permission: Permission) => {
        setPermissionModalMode('edit');
        setSelectedPermission(permission);
        setPermissionFormName(permission.name);
        setPermissionFormGuard(permission.guard_name);
        setPermissionFormActive(permission.is_active);
        setPermissionModalOpen(true);
    };

    const openDeletePermission = (permission: Permission) => {
        setSelectedPermission(permission);
        setDeletePermissionName(permission.name);
        setDeleteModalOpen(true);
    };

    // Save Permission
    const savePermission = () => {
        if (!permissionFormName.trim()) {
            triggerToast('Nama permission wajib diisi', 'danger');
            return;
        }

        setProcessing(true);
        const data = {
            name: permissionFormName,
            guard_name: permissionFormGuard,
            is_active: permissionFormActive,
        };

        if (permissionModalMode === 'add') {
            router.post('/sistem/permissions', data, {
                onSuccess: () => {
                    setPermissionModalOpen(false);
                    triggerToast('Permission baru berhasil disimpan');
                },
                onError: (err) => {
                    const errMsg = Object.values(err)[0] || 'Gagal menyimpan permission';
                    triggerToast(errMsg as string, 'danger');
                },
                onFinish: () => setProcessing(false)
            });
        } else {
            if (!selectedPermission) return;
            router.put(`/sistem/permissions/${selectedPermission.id}`, data, {
                onSuccess: () => {
                    setPermissionModalOpen(false);
                    triggerToast('Perubahan permission berhasil disimpan');
                },
                onError: (err) => {
                    const errMsg = Object.values(err)[0] || 'Gagal mengubah permission';
                    triggerToast(errMsg as string, 'danger');
                },
                onFinish: () => setProcessing(false)
            });
        }
    };

    // Delete Permission
    const confirmDeletePermission = () => {
        if (!selectedPermission) return;
        setProcessing(true);
        router.delete(`/sistem/permissions/${selectedPermission.id}`, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                triggerToast('Permission berhasil dihapus');
            },
            onError: (err) => {
                const errMsg = Object.values(err)[0] || 'Gagal menghapus permission';
                triggerToast(errMsg as string, 'danger');
            },
            onFinish: () => setProcessing(false)
        });
    };

    // Copy to clipboard helper
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        triggerToast(`Disalin ke papan klip: "${text}"`);
    };

    // Pagination links generator with ellipsis
    const getFilteredLinks = () => {
        const links = permissions.links;
        if (links.length <= 10) return links;

        const current = permissions.current_page;
        const last = permissions.last_page;
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
            <Head title="Manajemen Permissions" />

            <div className="min-h-screen bg-[#f0f4ff] dark:bg-slate-950 p-4 sm:p-6 lg:p-8 font-poppins relative">
                {/* Background Blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-300/10 dark:bg-blue-500/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 -left-20 w-[450px] h-[450px] bg-teal-300/10 dark:bg-teal-500/5 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10 w-full">
                    {/* Page Header Banner */}
                    <div className="page-header relative overflow-hidden text-white rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-none mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div>
                                <h4 className="text-xl sm:text-2xl font-extrabold font-playfair tracking-tight mb-1 flex items-center gap-2">
                                    <i className="bi bi-key-fill" /> Manajemen Permissions
                                </h4>
                                <p className="text-sm text-blue-100 font-medium">
                                    Kelola semua hak akses detail sistem yang terhubung dengan modul dan role pengguna
                                </p>
                            </div>
                            <div className="flex gap-3 shrink-0">
                                <button className="btn-ph btn-ph-solid font-poppins" onClick={openAddPermission}>
                                    <i className="bi bi-plus-lg" /> Tambah Permission
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Summary Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Card 1: Total Permission */}
                        <div className="card-custom flex items-center gap-4 p-5 hover:-translate-y-0.5 transition-all duration-300">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shrink-0">
                                <i className="bi bi-key-fill" />
                            </div>
                            <div>
                                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">Total Permission</span>
                                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-poppins mt-0.5 leading-none">
                                    <AnimatedCounter value={stats.total_permissions} />
                                </h3>
                            </div>
                        </div>

                        {/* Card 2: Active */}
                        <div className="card-custom flex items-center gap-4 p-5 hover:-translate-y-0.5 transition-all duration-300">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shrink-0">
                                <i className="bi bi-check-circle-fill" />
                            </div>
                            <div>
                                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">Aktif</span>
                                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-poppins mt-0.5 leading-none">
                                    <AnimatedCounter value={stats.active_permissions} />
                                    <span className="text-xs font-semibold text-emerald-500 ml-2">
                                        ({stats.total_permissions > 0 ? ((stats.active_permissions / stats.total_permissions) * 100).toFixed(1) : 100}%)
                                    </span>
                                </h3>
                            </div>
                        </div>

                        {/* Card 3: Inactive */}
                        <div className="card-custom flex items-center gap-4 p-5 hover:-translate-y-0.5 transition-all duration-300">
                            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl shrink-0">
                                <i className="bi bi-x-circle-fill" />
                            </div>
                            <div>
                                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">Tidak Aktif</span>
                                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-poppins mt-0.5 leading-none">
                                    <AnimatedCounter value={stats.inactive_permissions} />
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Table Container Card */}
                    <div className="card-custom">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                            <h5 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                                <i className="bi bi-list-check text-blue-600" /> Daftar Hak Akses (Permissions)
                            </h5>
                            
                            {/* Search Filter Bar */}
                            <div className="filter-bar">
                                <div className="relative flex-1 min-w-[200px]">
                                    <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                    <input 
                                        type="text" 
                                        className="filter-input w-full pl-9" 
                                        placeholder="Cari nama permission atau guard..." 
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
                                        <th className="w-16">#</th>
                                        <th>Nama Permission</th>
                                        <th className="w-40 text-center">Guard Name</th>
                                        <th className="w-48 text-center">Terhubung ke Role</th>
                                        <th className="w-40 text-center">Status</th>
                                        <th className="w-32 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissions.data.map((p, i) => {
                                        return (
                                            <tr key={p.id}>
                                                <td className="text-slate-400 font-semibold text-xs">{(permissions.current_page - 1) * permissions.per_page + i + 1}</td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded-lg">
                                                            {p.name}
                                                        </span>
                                                        <button 
                                                            onClick={() => handleCopy(p.name)}
                                                            className="text-slate-400 hover:text-blue-600 transition-colors"
                                                            title="Salin Nama Permission"
                                                        >
                                                            <i className="bi bi-clipboard text-xs" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <span className="font-mono text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                                                        {p.guard_name}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <span className={`role-pill bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-extrabold`}>
                                                        {p.roles_count || 0} Role
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <span className={`inline-flex items-center text-xs font-semibold ${p.is_active ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        <span className={`status-dot ${p.is_active ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600'}`} />
                                                        {p.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button 
                                                            className="btn-icon-sm edit" 
                                                            title="Edit Permission"
                                                            onClick={() => openEditPermission(p)}
                                                        >
                                                            <i className="bi bi-pencil" />
                                                        </button>
                                                        <button 
                                                            className="btn-icon-sm del" 
                                                            title="Hapus Permission"
                                                            onClick={() => openDeletePermission(p)}
                                                        >
                                                            <i className="bi bi-trash" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {permissions.data.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-slate-400">
                                                Tidak ada permission ditemukan dengan kriteria tersebut.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination Links */}
                            {permissions.last_page > 1 && (
                                <div className="flex items-center justify-between mt-5 flex-wrap gap-4">
                                    <div className="text-xs text-slate-400">
                                        Menampilkan <strong>{permissions.from || 0}–{permissions.to || 0}</strong> dari <strong>{permissions.total}</strong> permission
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
            </div>

            {/* Scroll to Top */}
            <button 
                className={`scroll-top ${showScrollTop ? 'visible' : ''}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                <i className="bi bi-chevron-up" />
            </button>

            {/* Modals */}
            <PermissionFormModal 
                isOpen={permissionModalOpen}
                mode={permissionModalMode}
                selectedPermission={selectedPermission}
                name={permissionFormName}
                setName={setPermissionFormName}
                guardName={permissionFormGuard}
                setGuardName={setPermissionFormGuard}
                isActive={permissionFormActive}
                setIsActive={setPermissionFormActive}
                processing={processing}
                onClose={() => setPermissionModalOpen(false)}
                onSave={savePermission}
            />

            <DeletePermissionModal 
                isOpen={deleteModalOpen}
                permissionName={deletePermissionName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDeletePermission}
                processing={processing}
            />

            {/* Toast Notifications */}
            {toast?.show && (
                <div 
                    className="flex items-center gap-3 fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.15)] font-bold text-xs transition-all duration-300 font-poppins"
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
