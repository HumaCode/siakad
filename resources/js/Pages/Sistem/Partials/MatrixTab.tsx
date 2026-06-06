import React from 'react';
import { Role, Permission } from '../Roles';

interface MatrixTabProps {
    roles: Role[];
    groupedPermissions: Record<string, Permission[]>;
}

export default function MatrixTab({ roles, groupedPermissions }: MatrixTabProps) {
    return (
        <div className="tab-panel active">
            <div className="card-custom">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h5 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <i className="bi bi-grid-3x3-gap-fill text-blue-600" /> Matriks Hak Akses
                        </h5>
                        <p className="text-xs text-slate-400 mt-1">Status permission aktual berdasarkan data peran pada database</p>
                    </div>
                    <div className="flex gap-4">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                            <span className="chk yes w-4 h-4 text-[9px]"><i className="bi bi-check-lg" /></span> Diizinkan
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                            <span className="chk no w-4 h-4 text-[9px]"><i className="bi bi-x-lg" /></span> Tidak
                        </span>
                    </div>
                </div>
                <div className="p-5">
                    <div className="perm-table-wrap">
                        <table className="perm-table">
                            <thead>
                                <tr>
                                    <th>Permission</th>
                                    {roles.map(role => (
                                        <th key={role.id} className="role-header text-center">
                                            <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                                                {role.name.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(groupedPermissions).map(([sectionName, perms]) => {
                                    if (perms.length === 0) return null;
                                    return (
                                        <React.Fragment key={sectionName}>
                                            <tr className="section-row">
                                                <td colSpan={roles.length + 1}>
                                                    <i className="bi bi-folder-fill me-2" /> {sectionName}
                                                </td>
                                            </tr>
                                            {perms.map(perm => (
                                                <tr key={perm.id}>
                                                    <td>
                                                        <div className="perm-label">
                                                            <span className="perm-icon"><i className="bi bi-key" /></span>
                                                            <div>
                                                                <div className="perm-name font-semibold">{perm.name}</div>
                                                                <div className="perm-key">{perm.guard_name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    {roles.map(role => {
                                                        const hasPerm = Array.isArray(role.permissions) && role.permissions.some(rp => Number(rp.id) === Number(perm.id));
                                                        return (
                                                            <td key={role.id} className="perm-check text-center">
                                                                <span className={`chk ${hasPerm ? 'yes' : 'no'}`}>
                                                                    <i className={`bi ${hasPerm ? 'bi-check-lg' : 'bi-x-lg'}`} />
                                                                </span>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
