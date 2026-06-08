import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import ConfirmationModal from '@/Components/ConfirmationModal';

interface KalenderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventDetail: any;
    onEdit: () => void;
    onDeleted: (msg: string) => void;
}

export default function KalenderDetailModal({ isOpen, onClose, eventDetail, onEdit, onDeleted }: KalenderDetailModalProps) {
    const { delete: destroy, processing } = useForm();
    const [showConfirm, setShowConfirm] = useState(false);

    if (!isOpen || !eventDetail) return null;

    const confirmDelete = () => {
        destroy(route('akademik.kalender.destroy', eventDetail.id), {
            preserveScroll: true,
            preserveState: true,
            only: ['kalender', 'errors'],
            onSuccess: () => {
                setShowConfirm(false);
                onClose();
                onDeleted('Event berhasil dihapus');
            }
        });
    };

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
                            style={{ backgroundColor: eventDetail.warna || '#3b82f6' }}
                        >
                            <i className={`bi ${eventDetail.ikon || 'bi-calendar-event'} text-lg`} />
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                                {eventDetail.judul}
                            </h3>
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                {eventDetail.jenis}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg transition-colors cursor-pointer"
                        disabled={processing}
                    >
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">Tanggal Mulai</span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                            {eventDetail.tanggal_mulai ? new Date(eventDetail.tanggal_mulai).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                        </span>
                    </div>

                    {eventDetail.tanggal_selesai && eventDetail.tanggal_selesai !== eventDetail.tanggal_mulai && (
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase">Tanggal Selesai</span>
                            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                                {new Date(eventDetail.tanggal_selesai).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    )}

                    {eventDetail.deskripsi && (
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase">Keterangan</span>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                {eventDetail.deskripsi}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                    <button
                        onClick={handleDeleteClick}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-xl transition-colors disabled:opacity-50"
                        disabled={processing}
                    >
                        {processing ? <i className="bi bi-arrow-repeat animate-spin" /> : <i className="bi bi-trash-fill" />}
                        Hapus
                    </button>
                    
                    <button
                        onClick={onEdit}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/30 rounded-xl transition-all disabled:opacity-50"
                        disabled={processing}
                    >
                        <i className="bi bi-pencil-square" />
                        Edit
                    </button>
                </div>
            </div>

            <ConfirmationModal
                show={showConfirm}
                title="Hapus Event Kalender"
                description={
                    <>
                        Apakah Anda yakin ingin menghapus event <strong>{eventDetail.judul}</strong>?
                    </>
                }
                warningText="Tindakan ini tidak dapat dibatalkan. Event akan dihapus dari kalender akademik secara permanen."
                confirmText="Hapus Event"
                cancelText="Batal"
                onClose={() => setShowConfirm(false)}
                onConfirm={confirmDelete}
                processing={processing}
                variant="danger"
            />
        </div>
    );
}
