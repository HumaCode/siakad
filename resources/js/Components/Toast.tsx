import React, { useEffect, useCallback } from 'react';

export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export interface ToastState {
    show: boolean;
    msg: string;
    type: ToastType;
}

interface ToastProps {
    toast: ToastState | null;
    onClose?: () => void;
    duration?: number; // ms, default 3000
}

const CONFIGS: Record<ToastType, {
    bg: string; border: string; color: string; shadow: string;
    iconBg: string; iconShadow: string; icon: string;
}> = {
    success: {
        bg:         'rgba(16, 185, 129, 0.12)',
        border:     '1px solid rgba(16, 185, 129, 0.35)',
        color:      '#10b981',
        shadow:     '0 0 24px rgba(16,185,129,.3), inset 0 0 10px rgba(16,185,129,.08)',
        iconBg:     'bg-emerald-500/80',
        iconShadow: 'shadow-[0_0_8px_rgba(16,185,129,.5)]',
        icon:       'bi-check-lg',
    },
    danger: {
        bg:         'rgba(244, 63, 94, 0.12)',
        border:     '1px solid rgba(244, 63, 94, 0.35)',
        color:      '#f43f5e',
        shadow:     '0 0 24px rgba(244,63,94,.3), inset 0 0 10px rgba(244,63,94,.08)',
        iconBg:     'bg-rose-500/80',
        iconShadow: 'shadow-[0_0_8px_rgba(244,63,94,.5)]',
        icon:       'bi-x-lg',
    },
    warning: {
        bg:         'rgba(245, 158, 11, 0.12)',
        border:     '1px solid rgba(245, 158, 11, 0.35)',
        color:      '#f59e0b',
        shadow:     '0 0 24px rgba(245,158,11,.3), inset 0 0 10px rgba(245,158,11,.08)',
        iconBg:     'bg-amber-500/80',
        iconShadow: 'shadow-[0_0_8px_rgba(245,158,11,.5)]',
        icon:       'bi-exclamation-lg',
    },
    info: {
        bg:         'rgba(59, 130, 246, 0.12)',
        border:     '1px solid rgba(59, 130, 246, 0.35)',
        color:      '#3b82f6',
        shadow:     '0 0 24px rgba(59,130,246,.3), inset 0 0 10px rgba(59,130,246,.08)',
        iconBg:     'bg-blue-500/80',
        iconShadow: 'shadow-[0_0_8px_rgba(59,130,246,.5)]',
        icon:       'bi-info-lg',
    },
};

export default function Toast({ toast, onClose, duration = 3000 }: ToastProps) {
    const dismiss = useCallback(() => onClose?.(), [onClose]);

    // Auto-dismiss
    useEffect(() => {
        if (!toast?.show) return;
        const t = setTimeout(dismiss, duration);
        return () => clearTimeout(t);
    }, [toast?.show, toast?.msg, duration, dismiss]);

    if (!toast?.show) return null;

    const cfg = CONFIGS[toast.type] ?? CONFIGS.success;

    return (
        <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-3 fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl font-semibold text-xs font-poppins cursor-pointer select-none"
            style={{
                backgroundColor:        cfg.bg,
                border:                 cfg.border,
                color:                  cfg.color,
                boxShadow:              cfg.shadow,
                backdropFilter:         'blur(14px)',
                WebkitBackdropFilter:   'blur(14px)',
                zIndex:                 99999,
                animation:              'toastIn .3s cubic-bezier(.16,1,.3,1)',
                minWidth:               '220px',
                maxWidth:               '480px',
                whiteSpace:             'nowrap',
            }}
            onClick={dismiss}
        >
            {/* Icon circle */}
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0 ${cfg.iconBg} ${cfg.iconShadow}`}>
                <i className={`bi ${cfg.icon} text-[10px]`} />
            </div>

            {/* Message */}
            <span className="tracking-wide flex-1">{toast.msg}</span>

            {/* Close button */}
            <button
                type="button"
                onClick={e => { e.stopPropagation(); dismiss(); }}
                className="ml-2 opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
                aria-label="Tutup notifikasi"
            >
                <i className="bi bi-x text-sm" />
            </button>
        </div>
    );
}

/**
 * Hook helper — gunakan ini di setiap halaman
 * const { toast, triggerToast, clearToast } = useToast();
 */
export function useToast(duration = 3000) {
    const [toast, setToast] = React.useState<ToastState | null>(null);

    const triggerToast = useCallback((msg: string, type: ToastType = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast(null), duration + 300); // cleanup after animation
    }, [duration]);

    const clearToast = useCallback(() => setToast(null), []);

    return { toast, triggerToast, clearToast };
}
