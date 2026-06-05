import { useState, useEffect } from 'react';
import FormModal from '@/Components/FormModal';
import FormInput from '@/Components/FormInput';
import FormSelect from '@/Components/FormSelect';
import FormTextarea from '@/Components/FormTextarea';

interface Role {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}

interface AssignUserModalProps {
    isOpen: boolean;
    roles: Role[];
    processing: boolean;
    onClose: () => void;
    onSave: () => void;
}

export default function AssignUserModal({
    isOpen,
    roles,
    processing,
    onClose,
    onSave,
}: AssignUserModalProps) {
    const [searchUser, setSearchUser] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setSearchUser('');
            setSelectedRole('');
            setNotes('');
        }
    }, [isOpen]);

    return (
        <FormModal
            show={isOpen}
            title="Assign Role ke User"
            subtitle="Cari pengguna dan tentukan role-nya"
            onClose={onClose}
            onSave={onSave}
            processing={processing}
            maxWidth="xl"
            saveText="Assign Role"
            cancelText="Batal"
        >
            <FormInput
                label="Cari Pengguna"
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                placeholder="Nama, NIM, NIDN, atau email..."
                required
            />
            
            <FormSelect
                label="Assign Role"
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                required
                options={[
                    { value: '', label: '-- Pilih Role --' },
                    ...roles.map(r => ({
                        value: r.name,
                        label: r.name.replace('_', ' ').toUpperCase()
                    }))
                ]}
            />

            <FormTextarea
                label="Keterangan (opsional)"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Alasan penugasan role ini..."
                rows={2}
            />

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl p-3 flex gap-2">
                <i className="bi bi-exclamation-triangle-fill text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                <div className="text-xs text-amber-800 dark:text-amber-400 leading-normal font-semibold">
                    Perubahan role akan langsung berlaku. Pastikan pengguna yang dipilih memiliki hak akses yang sesuai.
                </div>
            </div>
        </FormModal>
    );
}
