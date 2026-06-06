import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import '../../../css/sistem/roles.css';
import RoleFormModal from './Partials/RoleFormModal';
import AssignUserModal from './Partials/AssignUserModal';
import DeleteRoleModal from './Partials/DeleteRoleModal';
import RolesTab from './Partials/RolesTab';
import MatrixTab from './Partials/MatrixTab';
import UsersTab from './Partials/UsersTab';

// Types definition
export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    is_active: boolean;
}

export interface Role {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    priority: number;
    is_active: boolean;
    users_count: number;
    permissions: Permission[];
    type_role?: string | null;
    guard_name?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    roles: Role[];
    mahasiswa?: {
        nim: string;
        status_akademik: string;
    } | null;
    dosen?: {
        nidn: string;
        status_dosen: string;
    } | null;
}

export interface PaginatedUsers {
    data: User[];
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
    total_roles: number;
    total_permissions: number;
    total_users: number;
    active_users: number;
    inactive_users: number;
}

interface PageProps {
    roles: Role[];
    permissions: Permission[];
    users: PaginatedUsers;
    filters: {
        search: string;
        role: string;
    };
    stats: Stats;
    auth: {
        user: {
            name: string;
            email: string;
        }
    };
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

export default function RolesIndex({ roles, permissions, users, filters, stats }: PageProps) {
    const [activeTab, setActiveTab] = useState<'roles' | 'matrix' | 'users'>('roles');
    
    // Filters State
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [roleVal, setRoleVal] = useState(filters.role || '');

    // Modal states
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [roleModalMode, setRoleModalMode] = useState<'add' | 'edit'>('add');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [roleFormName, setRoleFormName] = useState('');
    const [roleFormSlug, setRoleFormSlug] = useState('');
    const [roleFormDesc, setRoleFormDesc] = useState('');
    const [roleFormType, setRoleFormType] = useState('sistem');
    const [roleFormColor, setRoleFormColor] = useState('blue');
    const [roleFormPriority, setRoleFormPriority] = useState(0);
    const [roleFormActive, setRoleFormActive] = useState(true);
    const [roleFormGuard, setRoleFormGuard] = useState('web');
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
    const [processing, setProcessing] = useState(false);

    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [assignProcessing, setAssignProcessing] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteRoleName, setDeleteRoleName] = useState('');

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
    const runFilters = (search: string, role: string) => {
        router.get('/sistem/roles', {
            search: search,
            role: role,
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
            runFilters(val, roleVal);
        }, 500);
        return () => clearTimeout(delayDebounce);
    };

    const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setRoleVal(val);
        runFilters(searchVal, val);
    };

    // Show Toast Helper
    const triggerToast = (msg: string, type: 'success' | 'danger' = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    // Modal controls
    const openAddRole = () => {
        setRoleModalMode('add');
        setSelectedRole(null);
        setRoleFormName('');
        setRoleFormSlug('');
        setRoleFormDesc('');
        setRoleFormType('sistem');
        setRoleFormColor('blue');
        setRoleFormPriority(0);
        setRoleFormActive(true);
        setRoleFormGuard('web');
        setSelectedPermissionIds([]);
        setRoleModalOpen(true);
    };

    const openEditRole = (role: Role) => {
        setRoleModalMode('edit');
        setSelectedRole(role);
        setRoleFormName(role.name);
        setRoleFormSlug(role.slug);
        setRoleFormDesc(role.description || '');
        setRoleFormType(role.type_role || 'sistem');
        setRoleFormColor(role.color || 'blue');
        setRoleFormPriority(role.priority || 0);
        setRoleFormActive(role.is_active !== false);
        setRoleFormGuard(role.guard_name || 'web');
        setSelectedPermissionIds(Array.isArray(role.permissions) ? role.permissions.map(p => Number(p.id)) : []);
        setRoleModalOpen(true);
    };

    const saveRole = () => {
        if (roleModalMode === 'add') {
            router.post('/sistem/roles', {
                name: roleFormName,
                slug: roleFormSlug,
                description: roleFormDesc,
                type_role: roleFormType,
                color: roleFormColor,
                priority: roleFormPriority,
                is_active: roleFormActive,
                guard_name: roleFormGuard,
                permissions: selectedPermissionIds
            }, {
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
                onSuccess: () => {
                    setRoleModalOpen(false);
                    triggerToast('Role baru berhasil disimpan');
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0] as string;
                    triggerToast(firstError || 'Gagal menyimpan role', 'danger');
                }
            });
        } else {
            if (!selectedRole) return;
            router.put(`/sistem/roles/${selectedRole.id}`, {
                name: roleFormName,
                slug: roleFormSlug,
                description: roleFormDesc,
                type_role: roleFormType,
                color: roleFormColor,
                priority: roleFormPriority,
                is_active: roleFormActive,
                guard_name: roleFormGuard,
                permissions: selectedPermissionIds
            }, {
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
                onSuccess: () => {
                    setRoleModalOpen(false);
                    triggerToast('Perubahan role berhasil disimpan');
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0] as string;
                    triggerToast(firstError || 'Gagal menyimpan perubahan role', 'danger');
                }
            });
        }
    };

    const openDeleteRole = (role: Role) => {
        setSelectedRole(role);
        setDeleteRoleName(role.name);
        setDeleteModalOpen(true);
    };

    const doDelete = () => {
        if (!selectedRole) return;
        router.delete(`/sistem/roles/${selectedRole.id}`, {
            onStart: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                setDeleteModalOpen(false);
            },
            onSuccess: () => {
                triggerToast('Role berhasil dihapus');
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0] as string;
                triggerToast(firstError || 'Gagal menghapus role', 'danger');
            }
        });
    };

    const openAssignUser = () => {
        setAssignModalOpen(true);
    };

    const saveAssign = () => {
        setAssignProcessing(true);
        setTimeout(() => {
            setAssignProcessing(false);
            setAssignModalOpen(false);
            triggerToast('Role berhasil di-assign ke pengguna', 'success');
        }, 1200);
    };

    // Role dynamic colors and icons
    const getRoleConfig = (slug: string) => {
        const cleanSlug = slug.toLowerCase().replace('-', '_');
        switch (cleanSlug) {
            case 'super_admin':
            case 'super-admin':
                return { icon: 'bi-shield-fill-exclamation', class: 'rc-super_admin' };
            case 'admin':
                return { icon: 'bi-person-gear', class: 'rc-admin' };
            case 'akademik':
                return { icon: 'bi-journal-text', class: 'rc-akademik' };
            case 'dosen':
                return { icon: 'bi-person-badge-fill', class: 'rc-dosen' };
            case 'mahasiswa':
                return { icon: 'bi-mortarboard-fill', class: 'rc-mahasiswa' };
            case 'keuangan':
                return { icon: 'bi-cash-coin', class: 'rc-keuangan' };
            default:
                return { icon: 'bi-shield-check', class: 'rc-admin' };
        }
    };

    // Grouping Permissions dynamically
    const groupPermissions = () => {
        const groups: { [key: string]: Permission[] } = {
            'Mahasiswa': [],
            'KRS': [],
            'Nilai': [],
            'Jadwal': [],
            'Keuangan': [],
            'Absensi': [],
            'Sistem': [],
        };

        permissions.forEach(p => {
            const name = p.name.toLowerCase();
            if (name.includes('mahasiswa') || name.includes('dosen')) {
                groups['Mahasiswa'].push(p);
            } else if (name.includes('krs')) {
                groups['KRS'].push(p);
            } else if (name.includes('grade') || name.includes('nilai') || name.includes('grades')) {
                groups['Nilai'].push(p);
            } else if (name.includes('schedule') || name.includes('jadwal') || name.includes('curriculum') || name.includes('subject') || name.includes('room') || name.includes('academic-year')) {
                groups['Jadwal'].push(p);
            } else if (name.includes('billing') || name.includes('payment') || name.includes('billing') || name.includes('keuangan') || name.includes('spp')) {
                groups['Keuangan'].push(p);
            } else if (name.includes('attendance') || name.includes('absensi')) {
                groups['Absensi'].push(p);
            } else {
                groups['Sistem'].push(p);
            }
        });

        return groups;
    };

    const groupedPermissions = groupPermissions();

    const getFilteredLinks = () => {
        const totalLinks = users.links.length;
        if (totalLinks <= 3) return users.links;

        const prevLink = users.links[0];
        const nextLink = users.links[totalLinks - 1];
        const pageLinks = users.links.slice(1, totalLinks - 1);

        const currentPage = users.current_page;
        const lastPage = users.last_page;

        const delta = 1;
        const range: number[] = [];
        const rangeWithDots: any[] = [];
        let l: number | undefined;

        for (let i = 1; i <= lastPage; i++) {
            if (
                i === 1 ||
                i === lastPage ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            }
        }

        for (const i of range) {
            if (l !== undefined) {
                if (i - l === 2) {
                    rangeWithDots.push(pageLinks[l]);
                } else if (i - l > 2) {
                    rangeWithDots.push({ url: null, label: '...', active: false });
                }
            }
            rangeWithDots.push(pageLinks[i - 1]);
            l = i;
        }

        return [prevLink, ...rangeWithDots, nextLink];
    };

    return (
        <AuthenticatedLayout header="Roles & Akses">
            <Head title="Roles & Akses" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 relative min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
                
                {/* Modern Backdrop Orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-300/10 dark:bg-blue-500/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 -left-20 w-[450px] h-[450px] bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10 w-full">
                    
                    {/* Page Header Banner */}
                    <div className="page-header relative overflow-hidden text-white rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-none mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div>
                                <h4 className="text-xl sm:text-2xl font-extrabold font-playfair tracking-tight mb-1 flex items-center gap-2">
                                    <i className="bi bi-shield-lock-fill" /> Manajemen Roles & Akses
                                </h4>
                                <p className="text-sm text-blue-100 font-medium">
                                    Kelola hak akses pengguna berdasarkan role menggunakan Spatie Laravel Permission
                                </p>
                            </div>
                            <div className="flex gap-3 shrink-0">
                                <button className="btn-ph btn-ph-white font-poppins" onClick={openAddRole}>
                                    <i className="bi bi-plus-lg" /> Tambah Role
                                </button>
                                <button className="btn-ph btn-ph-solid font-poppins" onClick={openAssignUser}>
                                    <i className="bi bi-person-plus" /> Assign User
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Summary Row */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                        <div className="stat-mini">
                            <div className="stat-mini-num text-blue-600 dark:text-blue-400">
                                <AnimatedCounter value={stats.total_roles} />
                            </div>
                            <div className="stat-mini-lbl">Total Role</div>
                            <div className="stat-mini-sub bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">Aktif Semua</div>
                        </div>

                        <div className="stat-mini">
                            <div className="stat-mini-num text-teal-600 dark:text-teal-400">
                                <AnimatedCounter value={stats.total_permissions} />
                            </div>
                            <div className="stat-mini-lbl">Permission</div>
                            <div className="stat-mini-sub bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">Terdaftar</div>
                        </div>

                        <div className="stat-mini">
                            <div className="stat-mini-num text-purple-600 dark:text-purple-400">
                                <AnimatedCounter value={stats.total_users} />
                            </div>
                            <div className="stat-mini-lbl">Total User</div>
                            <div className="stat-mini-sub bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-poppins">Ter-assign</div>
                        </div>

                        <div className="stat-mini">
                            <div className="stat-mini-num text-emerald-600 dark:text-emerald-400">
                                <AnimatedCounter value={stats.active_users} />
                            </div>
                            <div className="stat-mini-lbl">Akun Aktif</div>
                            <div className="stat-mini-sub bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                {stats.total_users > 0 ? ((stats.active_users / stats.total_users) * 100).toFixed(1) : 100}%
                            </div>
                        </div>

                        <div className="stat-mini">
                            <div className="stat-mini-num text-rose-600 dark:text-rose-400">
                                <AnimatedCounter value={stats.inactive_users} />
                            </div>
                            <div className="stat-mini-lbl">Akun Nonaktif</div>
                            <div className="stat-mini-sub bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">Terbatas</div>
                        </div>

                        <div className="stat-mini">
                            <div className="stat-mini-num text-amber-500">
                                <AnimatedCounter value={7} />
                            </div>
                            <div className="stat-mini-lbl">Login Hari Ini</div>
                            <div className="stat-mini-sub bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500">Sesi Aktif</div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="custom-tabs">
                        <button 
                            className={`custom-tab ${activeTab === 'roles' ? 'active' : ''}`}
                            onClick={() => setActiveTab('roles')}
                        >
                            <i className="bi bi-shield-fill" /> Daftar Role
                        </button>
                        <button 
                            className={`custom-tab ${activeTab === 'matrix' ? 'active' : ''}`}
                            onClick={() => setActiveTab('matrix')}
                        >
                            <i className="bi bi-grid-3x3-gap-fill" /> Matriks Permission
                        </button>
                        <button 
                            className={`custom-tab ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => setActiveTab('users')}
                        >
                            <i className="bi bi-people-fill" /> Pengguna & Role
                        </button>
                    </div>

                    {/* TAB 1: ROLES CARDS */}
                    {activeTab === 'roles' && (
                        <RolesTab
                            roles={roles}
                            getRoleConfig={getRoleConfig}
                            setRoleVal={setRoleVal}
                            setActiveTab={setActiveTab}
                            runFilters={runFilters}
                            searchVal={searchVal}
                            openEditRole={openEditRole}
                            openDeleteRole={openDeleteRole}
                            openAddRole={openAddRole}
                        />
                    )}

                    {/* TAB 2: PERMISSION MATRIX */}
                    {activeTab === 'matrix' && (
                        <MatrixTab
                            roles={roles}
                            groupedPermissions={groupedPermissions}
                        />
                    )}

                    {/* TAB 3: USER & ROLES */}
                    {activeTab === 'users' && (
                        <UsersTab
                            users={users}
                            roles={roles}
                            searchVal={searchVal}
                            handleSearchChange={handleSearchChange}
                            roleVal={roleVal}
                            handleRoleFilterChange={handleRoleFilterChange}
                            openAssignUser={openAssignUser}
                            getFilteredLinks={getFilteredLinks}
                        />
                    )}
                </div>
            </div>

            {/* Scroll to Top */}
            <button 
                className={`scroll-top ${showScrollTop ? 'visible' : ''}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                <i className="bi bi-chevron-up" />
            </button>            <RoleFormModal
                isOpen={roleModalOpen}
                mode={roleModalMode}
                selectedRole={selectedRole}
                name={roleFormName}
                setName={setRoleFormName}
                slug={roleFormSlug}
                setSlug={setRoleFormSlug}
                description={roleFormDesc}
                setDescription={setRoleFormDesc}
                typeRole={roleFormType}
                setTypeRole={setRoleFormType}
                color={roleFormColor}
                setColor={setRoleFormColor}
                priority={roleFormPriority}
                setPriority={setRoleFormPriority}
                isActive={roleFormActive}
                setIsActive={setRoleFormActive}
                guardName={roleFormGuard}
                setGuardName={setRoleFormGuard}
                groupedPermissions={groupedPermissions}
                selectedPermissionIds={selectedPermissionIds}
                setSelectedPermissionIds={setSelectedPermissionIds}
                processing={processing}
                onClose={() => setRoleModalOpen(false)}
                onSave={saveRole}
            />

            <AssignUserModal
                isOpen={assignModalOpen}
                roles={roles}
                processing={assignProcessing}
                onClose={() => setAssignModalOpen(false)}
                onSave={saveAssign}
            />

            <DeleteRoleModal
                isOpen={deleteModalOpen}
                roleName={deleteRoleName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={doDelete}
                processing={processing}
            />

            {/* Custom Toast Notification */}
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
