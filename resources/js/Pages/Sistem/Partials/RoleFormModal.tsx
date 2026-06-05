import { useEffect } from 'react';
import FormModal from '@/Components/FormModal';
import FormInput from '@/Components/FormInput';
import FormSelect from '@/Components/FormSelect';
import FormSwitch from '@/Components/FormSwitch';
import FormTextarea from '@/Components/FormTextarea';

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
    
    // Automatically generate slug from name
    useEffect(() => {
        const generatedSlug = name
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setSlug(generatedSlug);
    }, [name, setSlug]);

    const togglePermission = (id: number) => {
        if (selectedPermissionIds.includes(id)) {
            setSelectedPermissionIds(selectedPermissionIds.filter(pid => pid !== id));
        } else {
            setSelectedPermissionIds([...selectedPermissionIds, id]);
        }
    };

    return (
        <FormModal
            show={isOpen}
            onClose={onClose}
            onSave={onSave}
            processing={processing}
            maxWidth="5xl"
            title={mode === 'add' ? 'Tambah Role Baru' : `Edit Role: ${selectedRole?.name.replace('_', ' ').toUpperCase()}`}
            subtitle="Konfigurasi role dan permission yang diberikan"
            saveText={mode === 'add' ? 'Simpan Role' : 'Simpan Perubahan'}
        >
                    {/* First Row: Name & Slug */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput 
                            label="Nama Role" 
                            placeholder="cth: Operator Perpustakaan" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <FormInput 
                            label="Slug (key_name)" 
                            className="font-mono bg-slate-50 dark:bg-slate-800/60 cursor-not-allowed opacity-80" 
                            placeholder="operator-perpustakaan" 
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            readOnly
                        />
                    </div>

                    {/* Second Row: Type, Guard & Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormSelect 
                            label="Tipe Role"
                            value={typeRole}
                            onChange={(e) => setTypeRole(e.target.value)}
                            options={[
                                { value: 'sistem', label: 'Sistem' },
                                { value: 'akademik', label: 'Akademik' },
                                { value: 'keuangan', label: 'Keuangan' },
                                { value: 'kemahasiswaan', label: 'Kemahasiswaan' },
                                { value: 'lainnya', label: 'Lainnya' },
                            ]}
                        />
                        <FormSelect 
                            label="Guard Name"
                            className="font-mono"
                            value={guardName}
                            onChange={(e) => setGuardName(e.target.value)}
                            options={[
                                { value: 'web', label: 'web' },
                                { value: 'api', label: 'api' },
                            ]}
                        />
                        <FormInput 
                            type="number" 
                            label="Prioritas (Urutan)" 
                            min={0}
                            value={priority}
                            onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
                        />
                    </div>

                    {/* Third Row: Badge Color & Status Toggle */}
                    <div className="bg-slate-50 dark:bg-slate-800/20 p-4 rounded-xl border border-slate-100/50 dark:border-slate-800">
                        <label className="form-label-custom mb-2 font-bold text-xs block">Warna Badge</label>
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

                    <FormSwitch 
                        label="Status Aktif"
                        description="Aktifkan untuk mengizinkan penggunaan role ini"
                        checked={isActive}
                        onChange={setIsActive}
                    />

                    {/* Fourth Row: Description */}
                    <FormTextarea 
                        label="Deskripsi Role" 
                        rows={2} 
                        placeholder="Jelaskan fungsi dan batasan role ini..." 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

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
        </FormModal>
    );
}
