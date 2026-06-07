import React from 'react';

interface MataKuliahDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    mataKuliah: any | null;
}

export default function MataKuliahDetailModal({ isOpen, onClose, mataKuliah }: MataKuliahDetailModalProps) {
    if (!isOpen || !mataKuliah) return null;

    const getJenisBadgeClass = (jenis: string) => {
        switch (jenis) {
            case 'Wajib': return 'bp-blue';
            case 'Pilihan': return 'bp-teal';
            case 'Praktikum': return 'bp-purple';
            default: return 'bp-gray';
        }
    };

    const getStatusBadgeClass = (status: string) => {
        return status === 'Aktif' ? 'bp-green' : 'bp-rose';
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-4">
                        <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm bg-blue-50/60 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                        >
                            <i className="bi bi-journal-bookmark-fill" />
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                {mataKuliah.nama}
                                <span className={`badge-pill text-[10px] ${getStatusBadgeClass(mataKuliah.status)}`}>
                                    {mataKuliah.status}
                                </span>
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">
                                Kode MK: <span className="font-mono font-bold text-slate-600 dark:text-slate-400">{mataKuliah.kode}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100/30 dark:border-blue-900/20 rounded-xl p-4 text-center">
                            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 block">{mataKuliah.sks}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total SKS</span>
                        </div>
                        <div className="bg-teal-50/40 dark:bg-teal-950/20 border border-teal-100/30 dark:border-teal-900/20 rounded-xl p-4 text-center">
                            <span className="text-2xl font-black text-teal-600 dark:text-teal-400 block">Sem {mataKuliah.sem}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Semester</span>
                        </div>
                        <div className="bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100/30 dark:border-purple-900/20 rounded-xl p-4 text-center flex flex-col justify-center items-center">
                            <span className={`badge-pill ${getJenisBadgeClass(mataKuliah.jenis)}`}>
                                {mataKuliah.jenis}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">Kategori</span>
                        </div>
                    </div>

                    {/* Detail Information */}
                    <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-xl p-5 space-y-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                            Informasi Akademik Mata Kuliah
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="text-slate-400 text-sm mt-0.5">
                                    <i className="bi bi-award-fill" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 block font-medium">Program Studi</span>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        {mataKuliah.prodi?.nama || '-'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="text-slate-400 text-sm mt-0.5">
                                    <i className="bi bi-person-video3" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 block font-medium">Dosen Pengampu</span>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        {mataKuliah.dosen_nama || '-'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="text-slate-400 text-sm mt-0.5">
                                    <i className="bi bi-shield-exclamation" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 block font-medium">Mata Kuliah Prasyarat</span>
                                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                                        {mataKuliah.prasyarat || '-'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="text-slate-400 text-sm mt-0.5">
                                    <i className="bi bi-calendar-event-fill" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 block font-medium">Tanggal Dibuat</span>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        {mataKuliah.created_at ? new Date(mataKuliah.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                            Deskripsi / Capaian Pembelajaran
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            {mataKuliah.deskripsi || 'Belum ada deskripsi capaian pembelajaran untuk mata kuliah ini.'}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-outline cursor-pointer px-5"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
