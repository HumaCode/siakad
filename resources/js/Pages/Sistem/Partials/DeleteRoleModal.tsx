import ConfirmationModal from '@/Components/ConfirmationModal';

interface DeleteRoleModalProps {
    isOpen: boolean;
    roleName: string;
    onClose: () => void;
    onConfirm: () => void;
    processing: boolean;
}

export default function DeleteRoleModal({
    isOpen,
    roleName,
    onClose,
    onConfirm,
    processing,
}: DeleteRoleModalProps) {
    return (
        <ConfirmationModal
            show={isOpen}
            title="Hapus Role Permanen?"
            onClose={onClose}
            onConfirm={onConfirm}
            processing={processing}
            confirmText="Ya, Hapus Role"
            variant="danger"
            warningText="Pengguna yang saat ini memiliki role ini akan segera kehilangan seluruh hak akses dan permission terkait role tersebut."
            description={
                <>
                    Anda akan menghapus role 
                    <span className="inline-flex items-center gap-1.5 mx-2 px-3 py-1 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200/40 dark:border-red-900/40 text-red-600 dark:text-red-400 font-bold text-xs shadow-sm shadow-red-500/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        {roleName}
                    </span> 
                    secara permanen dari sistem.
                </>
            }
        />
    );
}
