import ConfirmationModal from '@/Components/ConfirmationModal';

interface DeleteMenuModalProps {
    isOpen: boolean;
    menuName: string;
    onClose: () => void;
    onConfirm: () => void;
    processing: boolean;
}

export default function DeleteMenuModal({
    isOpen,
    menuName,
    onClose,
    onConfirm,
    processing,
}: DeleteMenuModalProps) {
    return (
        <ConfirmationModal
            show={isOpen}
            title="Hapus Menu Permanen?"
            onClose={onClose}
            onConfirm={onConfirm}
            processing={processing}
            confirmText="Ya, Hapus Menu"
            variant="danger"
            warningText="Seluruh sub-menu yang berada di bawah menu ini juga akan ikut terhapus secara otomatis (cascade delete)."
            description={
                <>
                    Anda akan menghapus menu 
                    <span className="inline-flex items-center gap-1.5 mx-2 px-3 py-1 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200/40 dark:border-red-900/40 text-red-600 dark:text-red-400 font-bold text-xs shadow-sm shadow-red-500/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        {menuName}
                    </span> 
                    secara permanen dari database.
                </>
            }
        />
    );
}
