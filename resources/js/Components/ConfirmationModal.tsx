import { ReactNode } from 'react';
import Modal from './Modal';

interface ConfirmationModalProps {
    show: boolean;
    title: string;
    description: ReactNode;
    warningText?: string;
    confirmText?: string;
    cancelText?: string;
    onClose: () => void;
    onConfirm: () => void;
    processing?: boolean;
    variant?: 'danger' | 'warning' | 'info';
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export default function ConfirmationModal({
    show,
    title,
    description,
    warningText,
    confirmText = 'Ya, Konfirmasi',
    cancelText = 'Batal',
    onClose,
    onConfirm,
    processing = false,
    variant = 'danger',
    maxWidth = 'md',
}: ConfirmationModalProps) {
    // Config colors & styles based on variant
    const getVariantConfig = () => {
        switch (variant) {
            case 'warning':
                return {
                    borderClass: 'border-amber-500/20 dark:border-amber-500/30',
                    shadowClass: 'shadow-[0_0_50px_rgba(245,158,11,0.15)]',
                    pulse1Bg: 'bg-amber-500/10 dark:bg-amber-500/20',
                    pulse2Bg: 'bg-amber-500/20 dark:bg-amber-500/30',
                    iconWrapperBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
                    iconShadow: 'shadow-amber-500/30 dark:shadow-amber-950/55',
                    iconBorder: 'border-amber-400/20',
                    iconClass: 'bi-exclamation-circle-fill',
                    btnConfirmClass: 'btn-neon-warning',
                    confirmBtnStyle: `
                        .btn-neon-warning {
                            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        }
                        .btn-neon-warning:hover:not(:disabled) {
                            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                            box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5), 0 0 30px rgba(245, 158, 11, 0.2);
                            transform: translateY(-2px);
                        }
                        .btn-neon-warning:active:not(:disabled) {
                            transform: translateY(1px);
                        }
                    `
                };
            case 'info':
                return {
                    borderClass: 'border-blue-500/20 dark:border-blue-500/30',
                    shadowClass: 'shadow-[0_0_50px_rgba(59,130,246,0.15)]',
                    pulse1Bg: 'bg-blue-500/10 dark:bg-blue-500/20',
                    pulse2Bg: 'bg-blue-500/20 dark:bg-blue-500/30',
                    iconWrapperBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
                    iconShadow: 'shadow-blue-500/30 dark:shadow-blue-950/55',
                    iconBorder: 'border-blue-400/20',
                    iconClass: 'bi-info-circle-fill',
                    btnConfirmClass: 'btn-neon-info',
                    confirmBtnStyle: `
                        .btn-neon-info {
                            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        }
                        .btn-neon-info:hover:not(:disabled) {
                            background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
                            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5), 0 0 30px rgba(59, 130, 246, 0.2);
                            transform: translateY(-2px);
                        }
                        .btn-neon-info:active:not(:disabled) {
                            transform: translateY(1px);
                        }
                    `
                };
            case 'danger':
            default:
                return {
                    borderClass: 'border-red-500/20 dark:border-red-500/30',
                    shadowClass: 'shadow-[0_0_50px_rgba(239,68,68,0.15)]',
                    pulse1Bg: 'bg-red-500/10 dark:bg-red-500/20',
                    pulse2Bg: 'bg-red-500/20 dark:bg-red-500/30',
                    iconWrapperBg: 'bg-gradient-to-br from-red-500 to-red-600',
                    iconShadow: 'shadow-red-500/30 dark:shadow-red-950/55',
                    iconBorder: 'border-red-400/20',
                    iconClass: 'bi-exclamation-triangle-fill',
                    btnConfirmClass: 'btn-neon-delete',
                    confirmBtnStyle: `
                        .btn-neon-delete {
                            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        }
                        .btn-neon-delete:hover:not(:disabled) {
                            background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
                            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5), 0 0 30px rgba(239, 68, 68, 0.2);
                            transform: translateY(-2px);
                        }
                        .btn-neon-delete:active:not(:disabled) {
                            transform: translateY(1px);
                        }
                    `
                };
        }
    };

    const cfg = getVariantConfig();

    return (
        <Modal show={show} onClose={onClose} maxWidth={maxWidth} unstyled={true}>
            <div className={`relative border ${cfg.borderClass} ${cfg.shadowClass} rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl overflow-hidden p-8 transition-all duration-300`}>
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
                    .btn-neon-cancel:hover:not(:disabled) {
                        border-color: rgba(148, 163, 184, 0.5);
                        background: rgba(148, 163, 184, 0.08);
                        transform: translateY(-2px);
                    }
                    ${cfg.confirmBtnStyle}
                `}} />

                {/* Top Close Button */}
                <button 
                    onClick={onClose} 
                    disabled={processing}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 dark:hover:text-slate-250 transition-colors duration-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <i className="bi bi-x-lg text-sm" />
                </button>

                {/* Modal Body */}
                <div className="flex flex-col items-center text-center mt-2">
                    {/* Animated Icon */}
                    <div className="relative mb-6 flex items-center justify-center">
                        <div className={`absolute w-24 h-24 ${cfg.pulse1Bg} rounded-full animate-pulse-ring`} />
                        <div className={`absolute w-20 h-20 ${cfg.pulse2Bg} rounded-full animate-pulse`} />
                        
                        <div className={`relative w-16 h-16 ${cfg.iconWrapperBg} rounded-2xl flex items-center justify-center text-white text-2xl ${cfg.iconShadow} border ${cfg.iconBorder}`}>
                            <i className={`bi ${cfg.iconClass} animate-bounce`} style={{ animationDuration: '3s' }} />
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-poppins font-extrabold text-slate-850 dark:text-slate-100 text-xl tracking-tight mb-3">
                        {title}
                    </h3>

                    {/* Description */}
                    <div className="max-w-md px-2">
                        <div className="text-sm text-slate-555 dark:text-slate-400 leading-relaxed mb-6">
                            {description}
                        </div>
                        
                        {/* Warning Box */}
                        {warningText && (
                            <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/30 text-left mb-8">
                                <div className="text-amber-500 dark:text-amber-400 text-lg mt-0.5">
                                    <i className="bi bi-info-circle-fill" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-0.5">Konsekuensi Tindakan:</h4>
                                    <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                                        {warningText}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-center gap-4">
                    <button 
                        onClick={onClose} 
                        disabled={processing}
                        className="btn-neon-cancel px-6 py-3 rounded-2xl text-slate-600 dark:text-slate-350 font-poppins font-bold text-sm tracking-wide flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={onConfirm} 
                        disabled={processing}
                        className={`${cfg.btnConfirmClass} px-6 py-3 rounded-2xl text-white font-poppins font-bold text-sm tracking-wide flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                        {processing ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                Sedang proses...
                            </>
                        ) : (
                            <>
                                {variant === 'danger' && <i className="bi bi-trash-fill" />}
                                {confirmText}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
