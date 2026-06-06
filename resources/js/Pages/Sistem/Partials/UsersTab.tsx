import React from 'react';
import { Link } from '@inertiajs/react';
import { Role, PaginatedUsers } from '../Roles';

interface UsersTabProps {
    users: PaginatedUsers;
    roles: Role[];
    searchVal: string;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    roleVal: string;
    handleRoleFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    openAssignUser: () => void;
    getFilteredLinks: () => any[];
}

export default function UsersTab({
    users,
    roles,
    searchVal,
    handleSearchChange,
    roleVal,
    handleRoleFilterChange,
    openAssignUser,
    getFilteredLinks
}: UsersTabProps) {
    return (
        <div className="tab-panel active">
            <div className="card-custom">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                    <h5 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                        <i className="bi bi-people-fill text-blue-600" /> Pengguna & Role
                    </h5>
                    
                    {/* Filters Bar */}
                    <div className="filter-bar">
                        <div className="relative flex-1 min-w-[200px]">
                            <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                            <input 
                                type="text" 
                                className="filter-input w-full pl-9" 
                                placeholder="Cari nama, email, identitas..." 
                                value={searchVal}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <select 
                            className="filter-select"
                            value={roleVal}
                            onChange={handleRoleFilterChange}
                        >
                            <option value="">Semua Role</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.name}>
                                    {role.name.replace('_', ' ').toUpperCase()}
                                </option>
                            ))}
                        </select>
                        <button className="btn-primary-sm" onClick={openAssignUser}>
                            <i className="bi bi-person-plus" /> Assign User
                        </button>
                    </div>
                </div>

                <div className="p-5 overflow-x-auto">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Pengguna</th>
                                <th>Identitas</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((u, i) => {
                                const initials = (u.name || '').split(' ').slice(0, 2).filter(Boolean).map(w => w[0] || '').join('').toUpperCase() || 'U';
                                const academicStatus = u.mahasiswa ? u.mahasiswa.status_akademik : (u.dosen ? 'aktif' : 'aktif');
                                
                                return (
                                    <tr key={u.id}>
                                        <td className="text-slate-400 font-semibold text-xs">{(users.current_page - 1) * users.per_page + i + 1}</td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="user-avatar bg-gradient-to-br from-blue-600 to-indigo-700">
                                                    {initials}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 dark:text-slate-100">{u.name || 'User'}</div>
                                                    <div className="text-xs text-slate-400">{u.email || ''}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="font-mono text-xs text-slate-500">
                                            {u.mahasiswa ? `NIM ${u.mahasiswa.nim}` : (u.dosen ? `NIDN ${u.dosen.nidn}` : 'INTERNAL STAFF')}
                                        </td>
                                        <td>
                                            <div className="flex flex-wrap gap-1">
                                                {(u.roles || []).map(r => (
                                                    <span key={r.id} className="role-pill bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                        {r.name ? r.name.replace('_', ' ').toUpperCase() : ''}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`inline-flex items-center text-xs font-semibold ${academicStatus === 'aktif' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                <span className={`status-dot ${academicStatus === 'aktif' ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                                                {academicStatus === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button className="btn-icon-sm edit" title="Edit Role Pengguna" onClick={openAssignUser}>
                                                    <i className="bi bi-pencil" />
                                                </button>
                                                <button className="btn-icon-sm view" title="Lihat Profil">
                                                    <i className="bi bi-eye" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {users.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-slate-400">
                                        Tidak ada pengguna ditemukan dengan kriteria tersebut.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Links */}
                    {users.last_page > 1 && (
                        <div className="flex items-center justify-between mt-5 flex-wrap gap-4">
                            <div className="text-xs text-slate-400">
                                Menampilkan <strong>{users.from || 0}–{users.to || 0}</strong> dari <strong>{users.total}</strong> pengguna
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
                                            preserveScroll
                                            preserveState
                                            className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-all duration-200 ${
                                                link.active 
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20' 
                                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-800 dark:hover:text-slate-200'
                                            }`}
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
    );
}
