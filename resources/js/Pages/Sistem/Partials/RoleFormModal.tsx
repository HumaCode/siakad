import { useEffect } from 'react';
import Modal from '@/Components/Modal';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    is_active: boolean;
}

interface Role {
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

interface RoleFormModalProps {
    isOpen: boolean;
    mode: 'add' | 'edit';
    selectedRole: Role | null;
    name: string;
    setName: (name: string) => void;
    slug: string;
    setSlug: (slug: string) => void;
    description: string;
    setDescription: (desc: string) => void;
    typeRole: string;
    setTypeRole: (type: string) => void;
    color: string;
    setColor: (color: string) => void;
    priority: number;
    setPriority: (priority: number) => void;
    isActive: boolean;
    setIsActive: (active: boolean) => void;
    guardName: string;
    setGuardName: (guard: string) => void;
    groupedPermissions: { [key: string]: Permission[] };
    selectedPermissionIds: number[];
    setSelectedPermissionIds: (ids: number[]) => void;
    processing: boolean;
    onClose: () => void;
    onSave: () => void;
}

export default function RoleFormModal({
    isOpen,
    mode,
    selectedRole,
    name,
    setName,
    slug,
    setSlug,
    description,
    setDescription,
    typeRole,
    setTypeRole,
    color,
    setColor,
    priority,
    setPriority,
    isActive,
    setIsActive,
    guardName,
    setGuardName,
    groupedPermissions,
    selectedPermissionIds,
    setSelectedPermissionIds,
    processing,
    onClose,
    onSave,
}: RoleFormModalProps) {
    
    // Automatically generate slug from name when adding a new role
    useEffect(() => {
        if (mode === 'add') {
            const generatedSlug = name
                .toLowerCase()
                .replace(/[^a-z0-9_]+/g, '_')
                .replace(/^_+|_+$/g, '');
            setSlug(generatedSlug);
        }
    }, [name, mode, setSlug]);

    const togglePermission = (id: number) => {
        if (selectedPermissionIds.includes(id)) {
            setSelectedPermissionIds(selectedPermissionIds.filter(pid => pid !== id));
        } else {
            setSelectedPermissionIds([...selectedPermissionIds, id]);
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="5xl">
            <div className="border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
                <div className="modal-header p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                        <h5 className="modal-title font-bold text-slate-800 dark:text-slate-100">
                            {mode === 'add' ? 'Tambah Role Baru' : `Edit Role: ${selectedRole?.name.replace('_', ' ').toUpperCase()}`}
                        </h5>
                        <div className="text-xs text-slate-400 mt-1">Konfigurasi role dan permission yang diberikan</div>
                    </div>
                    <button type="button" className="btn-close text-lg text-slate-400 hover:text-slate-600 bg-none border-none cursor-pointer" onClick={onClose}>
                        <i className="bi bi-x-lg" />
                    </button>
                </div>
                <div className="modal-body p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                    {/* First Row: Name & Slug */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="form-label-custom mb-1 font-bold text-xs">Nama Role</label>
                            <input 
                                type="text" 
                                className="form-ctrl" 
                                placeholder="cth: Operator Perpustakaan" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="form-label-custom mb-1 font-bold text-xs">Slug (key_name)</label>
                            <input 
                                type="text" 
                                className="form-ctrl font-mono bg-slate-50 dark:bg-slate-800/60 cursor-not-allowed opacity-80" 
                                placeholder="operator_perpustakaan" 
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Second Row: Type, Guard & Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="form-label-custom mb-1 font-bold text-xs">Tipe Role</label>
                            <select 
                                className="form-ctrl" 
                                value={typeRole}
                                onChange={(e) => setTypeRole(e.target.value)}
                            >
                                <option value="sistem">Sistem</option>
                                <option value="akademik">Akademik</option>
                                <option value="keuangan">Keuangan</option>
                                <option value="kemahasiswaan">Kemahasiswaan</option>
                                <option value="lainnya">Lainnya</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label-custom mb-1 font-bold text-xs">Guard Name</label>
                            <select 
                                className="form-ctrl font-mono" 
                                value={guardName}
                                onChange={(e) => setGuardName(e.target.value)}
                            >
                                <option value="web">web</option>
                                <option value="api">api</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label-custom mb-1 font-bold text-xs">Prioritas (Urutan)</label>
                            <input 
                                type="number" 
                                className="form-ctrl" 
                                min={0}
                                value={priority}
                                onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    {/* Third Row: Badge Color & Status Toggle */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-50 dark:bg-slate-800/20 p-4 rounded-xl border border-slate-100/50 dark:border-slate-800">
                        <div>
                            <label className="form-label-custom mb-2 font-bold text-xs">Warna Badge</label>
                            <div className="flex gap-2 flex-wrap">
                                {['blue', 'emerald', 'amber', 'rose', 'indigo', 'violet', 'slate'].map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-all ${
                                            color === c 
                                                ? 'border-slate-800 dark:border-slate-100 scale-110 shadow-md' 
                                                : 'border-transparent hover:scale-105'
                                        }`}
                                        style={{ 
                                            backgroundColor: c === 'blue' ? '#3b82f6' : 
                                                             c === 'emerald' ? '#10b981' : 
                                                             c === 'amber' ? '#f59e0b' : 
                                                             c === 'rose' ? '#f43f5e' : 
                                                             c === 'indigo' ? '#6366f1' : 
                                                             c === 'violet' ? '#8b5cf6' : '#64748b'
                                        }}
                                        onClick={() => setColor(c)}
                                        title={c.toUpperCase()}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="form-label-custom font-bold text-xs mb-0 cursor-pointer select-none flex items-center gap-2" onClick={() => setIsActive(!isActive)}>
                                <div className={`w-10 h-6 rounded-full transition-colors flex items-center p-1 cursor-pointer ${isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                                </div>
                                <span className="text-slate-700 dark:text-slate-200">Role Aktif</span>
                            </label>
                        </div>
                    </div>

                    {/* Fourth Row: Description */}
                    <div>
                        <label className="form-label-custom mb-1 font-bold text-xs">Deskripsi Role</label>
                        <textarea 
                            className="form-ctrl" 
                            rows={2} 
                            placeholder="Jelaskan fungsi dan batasan role ini..." 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Fifth Row: Permissions Grouped */}
                    <label className="form-label-custom mb-2 font-bold text-xs">Permission yang Diberikan</label>
                    <div className="space-y-3">
                        {Object.entries(groupedPermissions).map(([sectionName, perms]) => {
                            if (perms.length === 0) return null;
                            return (
                                <div key={sectionName} className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100/50 dark:border-slate-800">
                                    <div className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                                        {sectionName}
                                    </div>
                                    <div className="perm-toggle-grid">
                                        {perms.map(perm => {
                                            const isSelected = selectedPermissionIds.includes(perm.id);
                                            return (
                                                <div 
                                                    key={perm.id} 
                                                    className={`perm-toggle cursor-pointer select-none ${isSelected ? 'on' : ''}`}
                                                    onClick={() => togglePermission(perm.id)}
                                                >
                                                    <div>
                                                        <div className="pt-label font-bold">{perm.name}</div>
                                                        <div className="pt-key">{perm.guard_name}</div>
                                                    </div>
                                                    <div className="toggle-switch" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="modal-footer p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                    <button type="button" className="btn-outline-sm font-poppins" onClick={onClose} disabled={processing}>
                        <i className="bi bi-x-lg" /> Batal
                    </button>
                    <button type="button" className="btn-primary-sm font-poppins flex items-center gap-2" onClick={onSave} disabled={processing}>
                        {processing ? (
                            <>
                                <span className="animate-spin inline-block w-4 h-4 border-2 rounded-full border-t-transparent border-white" role="status" aria-hidden="true" />
                                Sedang proses...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg" /> Simpan Role
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
