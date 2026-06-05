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
        <Modal show={isOpen} onClose={onClose} maxWidth="md">
            <div className="relative border border-red-500/20 dark:border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl overflow-hidden p-8 transition-all duration-300">
                {/* Custom animations style */}
                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes pulse-ring {
                        0% { transform: scale(0.85); opacity: 0.8; }
                        50% { transform: scale(1.15); opacity: 0.3; }
                        100% { transform: scale(0.85); opacity: 0.8; }
                    }
                    .animate-pulse-ring {
                        animation: pulse-ring 2.5s ease-in-out infinite;
                    }
                    .btn-neon-cancel {
                        border: 1px solid rgba(148, 163, 184, 0.2);
                        background: rgba(255, 255, 255, 0.5);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .dark .btn-neon-cancel {
                        border: 1px solid rgba(148, 163, 184, 0.1);
                        background: rgba(15, 23, 42, 0.3);
                    }
                    .btn-neon-cancel:hover {
                        border-color: rgba(148, 163, 184, 0.5);
                        background: rgba(148, 163, 184, 0.08);
                        transform: translateY(-2px);
                    }
                    .btn-neon-delete {
                        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                        box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .btn-neon-delete:hover {
                        background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
                        box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5), 0 0 30px rgba(239, 68, 68, 0.2);
                        transform: translateY(-2px);
                    }
                    .btn-neon-delete:active {
                        transform: translateY(1px);
                    }
                `}} />

                {/* Top Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 dark:hover:text-slate-250 transition-colors duration-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <i className="bi bi-x-lg text-sm" />
                </button>

                {/* Modal Body */}
                <div className="flex flex-col items-center text-center mt-2">
                    {/* Animated Warning / Trash Icon */}
                    <div className="relative mb-6 flex items-center justify-center">
                        {/* Pulse effect rings */}
                        <div className="absolute w-24 h-24 bg-red-500/10 dark:bg-red-500/20 rounded-full animate-pulse-ring" />
                        <div className="absolute w-20 h-20 bg-red-500/20 dark:bg-red-500/30 rounded-full animate-pulse" />
                        
                        {/* Core Icon Wrapper */}
                        <div className="relative w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-red-500/30 dark:shadow-red-950/55 border border-red-400/20">
                            <i className="bi bi-exclamation-triangle-fill animate-bounce" style={{ animationDuration: '3s' }} />
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-poppins font-extrabold text-slate-850 dark:text-slate-100 text-xl tracking-tight mb-3">
                        Hapus Role Permanen?
                    </h3>

                    {/* Description */}
                    <div className="max-w-md px-2">
                        <p className="text-sm text-slate-555 dark:text-slate-400 leading-relaxed mb-6">
                            Anda akan menghapus role 
                            <span className="inline-flex items-center gap-1.5 mx-2 px-3 py-1 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200/40 dark:border-red-900/40 text-red-600 dark:text-red-400 font-bold text-xs shadow-sm shadow-red-500/5">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                {roleName}
                            </span> 
                            secara permanen dari sistem.
                        </p>
                        
                        {/* Warning Box */}
                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/30 text-left mb-8">
                            <div className="text-amber-500 dark:text-amber-400 text-lg mt-0.5">
                                <i className="bi bi-info-circle-fill" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-0.5">Konsekuensi Tindakan:</h4>
                                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                                    Pengguna yang saat ini memiliki role ini akan segera kehilangan seluruh hak akses dan permission terkait role tersebut.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-center gap-4">
                    <button 
                        onClick={onClose} 
                        className="btn-neon-cancel px-6 py-3 rounded-2xl text-slate-600 dark:text-slate-350 font-poppins font-bold text-sm tracking-wide flex items-center gap-2"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="btn-neon-delete px-6 py-3 rounded-2xl text-white font-poppins font-bold text-sm tracking-wide flex items-center gap-2"
                    >
                        <i className="bi bi-trash-fill" /> Ya, Hapus Role
                    </button>
                </div>
            </div>
        </Modal>
    );
}
