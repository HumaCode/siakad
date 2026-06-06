import { ReactNode } from 'react';
import Modal from './Modal';

interface FormModalProps {
    show: boolean;
    title: string;
    subtitle?: string;
    onClose: () => void;
    onSave: () => void;
    processing: boolean;
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
    saveText?: string;
    cancelText?: string;
}

export default function FormModal({
    show,
    title,
    subtitle,
    onClose,
    onSave,
    processing = false,
    children,
    maxWidth = '5xl',
    saveText = 'Simpan Perubahan',
    cancelText = 'Batal',
}: FormModalProps) {
    return (
        <Modal show={show} onClose={onClose} maxWidth={maxWidth}>
            <div className="border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
                {/* Header */}
                <div className="modal-header p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                        <h5 className="modal-title font-bold text-slate-800 dark:text-slate-100">
                            {title}
                        </h5>
                        {subtitle && <div className="text-xs text-slate-400 mt-1">{subtitle}</div>}
                    </div>
                    <button 
                        type="button" 
                        className="btn-close text-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-none border-none cursor-pointer disabled:opacity-50" 
                        onClick={onClose}
                        disabled={processing}
                    >
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                    {children}
                </div>

                {/* Footer */}
                <div className="modal-footer p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                    <button 
                        type="button" 
                        className="btn-outline-sm font-poppins disabled:opacity-50" 
                        onClick={onClose} 
                        disabled={processing}
                    >
                        <i className="bi bi-x-lg" /> {cancelText}
                    </button>
                    <button 
                        type="button" 
                        className="btn-primary-sm font-poppins flex items-center gap-2 disabled:opacity-60" 
                        onClick={onSave} 
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                Sedang proses...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg" /> {saveText}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
