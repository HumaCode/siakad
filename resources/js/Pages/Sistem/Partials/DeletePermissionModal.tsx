import ConfirmationModal from '@/Components/ConfirmationModal';

interface DeletePermissionModalProps {
    isOpen: boolean;
    permissionName: string;
    onClose: () => void;
    onConfirm: () => void;
    processing: boolean;
}

export default function DeletePermissionModal({
    isOpen,
    permissionName,
    onClose,
    onConfirm,
    processing,
}: DeletePermissionModalProps) {
    return (
        <ConfirmationModal
            show={isOpen}
            title="Hapus Permission Permanen?"
            onClose={onClose}
            onConfirm={onConfirm}
            processing={processing}
            confirmText="Ya, Hapus Permission"
            variant="danger"
            warningText="Role dan pengguna yang bergantung pada permission ini akan kehilangan hak akses terkait secara instan."
            description={
                <>
                    Anda akan menghapus permission 
                    <span className="inline-flex items-center gap-1.5 mx-2 px-3 py-1 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200/40 dark:border-red-900/40 text-red-600 dark:text-red-400 font-bold text-xs shadow-sm shadow-red-500/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        {permissionName}
                    </span> 
                    secara permanen dari database.
                </>
            }
        />
    );
}
