import { useEffect } from 'react';
import FormModal from '@/Components/FormModal';
import FormInput from '@/Components/FormInput';
import FormSelect from '@/Components/FormSelect';
import FormSwitch from '@/Components/FormSwitch';
import { Permission } from '../Roles';

interface PermissionFormModalProps {
    isOpen: boolean;
    mode: 'add' | 'edit';
    selectedPermission: Permission | null;
    name: string;
    setName: (name: string) => void;
    guardName: string;
    setGuardName: (guard: string) => void;
    isActive: boolean;
    setIsActive: (active: boolean) => void;
    processing: boolean;
    onClose: () => void;
    onSave: () => void;
}

export default function PermissionFormModal({
    isOpen,
    mode,
    selectedPermission,
    name,
    setName,
    guardName,
    setGuardName,
    isActive,
    setIsActive,
    processing,
    onClose,
    onSave,
}: PermissionFormModalProps) {
    return (
        <FormModal
            show={isOpen}
            onClose={onClose}
            onSave={onSave}
            processing={processing}
            maxWidth="md"
            title={mode === 'add' ? 'Tambah Permission Baru' : `Edit Permission: ${selectedPermission?.name}`}
            subtitle="Konfigurasi detail hak akses sistem"
            saveText={mode === 'add' ? 'Simpan Permission' : 'Simpan Perubahan'}
        >
            <div className="space-y-4">
                <FormInput 
                    label="Nama Permission" 
                    placeholder="cth: sistem.roles.create" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
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

                <FormSwitch 
                    label="Status Aktif"
                    description="Aktifkan untuk mengizinkan penggunaan permission ini"
                    checked={isActive}
                    onChange={setIsActive}
                />
            </div>
        </FormModal>
    );
}
