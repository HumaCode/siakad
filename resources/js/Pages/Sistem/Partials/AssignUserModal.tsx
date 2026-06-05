import Modal from '@/Components/Modal';

interface Role {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}

interface AssignUserModalProps {
    isOpen: boolean;
    roles: Role[];
    onClose: () => void;
    onSave: () => void;
}

export default function AssignUserModal({
    isOpen,
    roles,
    onClose,
    onSave,
}: AssignUserModalProps) {
    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="md">
            <div className="border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
                <div className="modal-header p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                        <h5 className="modal-title font-bold text-slate-850 dark:text-slate-100">Assign Role ke User</h5>
                        <div className="text-xs text-slate-400 mt-1">Cari pengguna dan tentukan role-nya</div>
                    </div>
                    <button type="button" className="btn-close text-lg text-slate-400 hover:text-slate-600 bg-none border-none cursor-pointer" onClick={onClose}>
                        <i className="bi bi-x-lg" />
                    </button>
                </div>
                <div className="modal-body p-5 space-y-4">
                    <div>
                        <label className="form-label-custom mb-1 font-bold text-xs">Cari Pengguna</label>
                        <input type="text" className="form-ctrl" placeholder="Nama, NIM, NIDN, atau email..." />
                    </div>
                    <div>
                        <label className="form-label-custom mb-1 font-bold text-xs">Assign Role</label>
                        <select className="form-ctrl">
                            <option value="">-- Pilih Role --</option>
                            {roles.map(r => (
                                <option key={r.id} value={r.name}>{r.name.replace('_', ' ').toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="form-label-custom mb-1 font-bold text-xs">Keterangan (opsional)</label>
                        <textarea className="form-ctrl" rows={2} placeholder="Alasan penugasan role ini..." />
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl p-3 flex gap-2">
                        <i className="bi bi-exclamation-triangle-fill text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                        <div className="text-xs text-amber-800 dark:text-amber-400 leading-normal font-semibold">
                            Perubahan role akan langsung berlaku. Pastikan pengguna yang dipilih memiliki hak akses yang sesuai.
                        </div>
                    </div>
                </div>
                <div className="modal-footer p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                    <button type="button" className="btn-outline-sm font-poppins" onClick={onClose}>
                        <i className="bi bi-x-lg" /> Batal
                    </button>
                    <button type="button" className="btn-primary-sm font-poppins" onClick={onSave}>
                        <i className="bi bi-person-check" /> Assign Role
                    </button>
                </div>
            </div>
        </Modal>
    );
}
