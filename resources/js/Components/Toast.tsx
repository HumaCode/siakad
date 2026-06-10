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
    duration?: number;
}

export default function Toast({ toast, onClose, duration = 3000 }: ToastProps) {
    const dismiss = useCallback(() => onClose?.(), [onClose]);

    useEffect(() => {
        if (!toast?.show) return;
        const t = setTimeout(dismiss, duration);
        return () => clearTimeout(t);
    }, [toast?.show, toast?.msg, duration, dismiss]);

    if (!toast?.show) return null;

    const isSuccess = toast.type === 'success';

    return (
        <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-3 fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.15)] font-bold text-xs transition-all duration-300 font-poppins"
            style={{
                backgroundColor:      isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                border:               isSuccess ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)',
                color:                isSuccess ? '#10b981' : '#f43f5e',
                boxShadow:            isSuccess
                    ? '0 0 20px rgba(16, 185, 129, 0.35), inset 0 0 10px rgba(16, 185, 129, 0.1)'
                    : '0 0 20px rgba(244, 63, 94, 0.35), inset 0 0 10px rgba(244, 63, 94, 0.1)',
                backdropFilter:       'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                zIndex:               99999,
                animation:            'toastIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                whiteSpace:           'nowrap',
            }}
        >
            {/* Icon circle */}
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0 ${
                isSuccess
                    ? 'bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                    : 'bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
            }`}>
                <i className={`bi ${isSuccess ? 'bi-check-lg' : 'bi-x-lg'} text-[10px]`} />
            </div>

            {/* Message */}
            <span className="tracking-wide">{toast.msg}</span>
        </div>
    );
}

/**
 * Hook helper — gunakan di setiap halaman
 * const { toast, triggerToast, clearToast } = useToast();
 */
export function useToast(duration = 3000) {
    const [toast, setToast] = React.useState<ToastState | null>(null);

    const triggerToast = useCallback((msg: string, type: ToastType = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast(null), duration + 400);
    }, [duration]);

    const clearToast = useCallback(() => setToast(null), []);

    return { toast, triggerToast, clearToast };
}
