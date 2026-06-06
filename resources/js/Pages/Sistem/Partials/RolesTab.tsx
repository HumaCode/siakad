import React from 'react';
import { Role } from '../Roles';

interface RolesTabProps {
    roles: Role[];
    getRoleConfig: (slug: string) => { icon: string; class: string };
    setRoleVal: (val: string) => void;
    setActiveTab: (tab: 'roles' | 'matrix' | 'users') => void;
    runFilters: (search: string, role: string) => void;
    searchVal: string;
    openEditRole: (role: Role) => void;
    openDeleteRole: (role: Role) => void;
    openAddRole: () => void;
}

export default function RolesTab({
    roles,
    getRoleConfig,
    setRoleVal,
    setActiveTab,
    runFilters,
    searchVal,
    openEditRole,
    openDeleteRole,
    openAddRole
}: RolesTabProps) {
    return (
        <div className="tab-panel active">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map(role => {
                    const config = getRoleConfig(role.name);
                    return (
                        <div key={role.id} className={`role-card ${role.is_active ? config.class : 'rc-inactive'}`}>
                            {/* Status Badge */}
                            <div className="absolute top-4 right-4">
                                {role.is_active ? (
                                    <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Aktif
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                        Tidak Aktif
                                    </span>
                                )}
                            </div>

                            <div className="role-icon-bg">
                                <i className={`bi ${config.icon}`} />
                            </div>
                            <div className="role-card-name">{role.name.replace('_', ' ').toUpperCase()}</div>
                            <div className="role-card-slug">{role.slug || role.name}</div>
                            <div className="role-card-desc min-h-[50px]">
                                {role.description || 'Tidak ada deskripsi untuk role ini.'}
                            </div>
                            <div className="role-card-footer border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
                                <div className="role-user-count">
                                    {role.users_count} <span>pengguna</span>
                                </div>
                                <div className="role-actions">
                                    <button 
                                        className="btn-icon-sm view" 
                                        title="Lihat Pengguna"
                                        onClick={() => {
                                            setRoleVal(role.name);
                                            setActiveTab('users');
                                            runFilters(searchVal, role.name);
                                        }}
                                    >
                                        <i className="bi bi-eye" />
                                    </button>
                                    <button 
                                        className="btn-icon-sm edit" 
                                        title="Edit Role"
                                        onClick={() => openEditRole(role)}
                                    >
                                        <i className="bi bi-pencil" />
                                    </button>
                                    {role.name !== 'super_admin' && (
                                        <button 
                                            className="btn-icon-sm del" 
                                            title="Hapus Role"
                                            onClick={() => openDeleteRole(role)}
                                        >
                                            <i className="bi bi-trash" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Add new role card */}
                <div className="role-card flex flex-col items-center justify-center min-h-[220px] border-dashed border-2 border-blue-500/20 hover:border-blue-500/40 bg-white/20 dark:bg-slate-900/10 cursor-pointer transition-all duration-300" onClick={openAddRole}>
                    <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 text-lg mb-3">
                        <i className="bi bi-plus-lg" />
                    </div>
                    <div className="text-center">
                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400">Tambah Role Baru</div>
                        <div className="text-xs text-slate-400 mt-1">Klik untuk membuat role kustom</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
