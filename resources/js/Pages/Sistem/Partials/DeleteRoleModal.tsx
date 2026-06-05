import Modal from '@/Components/Modal';

interface DeleteRoleModalProps {
    isOpen: boolean;
    roleName: string;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteRoleModal({
    isOpen,
    roleName,
    onClose,
    onConfirm,
}: DeleteRoleModalProps) {
    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="sm">
            <div className="border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
                <div className="modal-body p-6 text-center">
                    <div className="w-14 h-14 bg-red-50 dark:bg-red-950/40 rounded-2xl flex items-center justify-center text-red-650 dark:text-red-500 text-2xl mx-auto mb-4">
                        <i className="bi bi-trash-fill" />
                    </div>
                    <h6 className="font-bold text-slate-850 dark:text-slate-100 text-base mb-1">Hapus Role?</h6>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Role <strong className="text-slate-700 dark:text-slate-200">{roleName}</strong> akan dihapus secara permanen. Pengguna yang memiliki role ini akan kehilangan aksesnya.
                    </p>
                </div>
                <div className="modal-footer p-4 border-none flex justify-center gap-3">
                    <button className="btn-outline-sm font-poppins" onClick={onClose}>Batal</button>
                    <button className="btn-primary-sm font-poppins bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm}>
                        <i className="bi bi-trash" /> Ya, Hapus
                    </button>
                </div>
            </div>
        </Modal>
    );
}
