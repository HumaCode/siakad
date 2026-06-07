import React from 'react';

interface ScheduleItem {
    id: string;
    mata_kuliah_id: string;
    mata_kuliah: {
        id: string;
        kode: string;
        nama: string;
        sks: number;
        sks_teori: number;
        sks_praktik: number;
        sem: number;
        jenis: string;
    };
    ruangan_id: string;
    ruangan: {
        id: string;
        nama_gedung: string;
        nama_ruangan: string;
        kapasitas: number;
    };
    dosen_id: string;
    dosen: {
        id: string;
        nama: string;
        nidn: string;
        initials: string;
    };
    prodi_id: string;
    prodi: {
        id: string;
        nama: string;
        kode: string;
    };
    hari: string;
    kelas_id: string;
    kelas: {
        id: string;
        nama: string;
    };
    jam_mulai: string;
    jam_selesai: string;
    tipe: string;
}

interface JadwalDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    jadwal: ScheduleItem | null;
    onEdit: () => void;
    onDelete: () => void;
}

export default function JadwalDetailModal({ isOpen, onClose, jadwal, onEdit, onDelete }: JadwalDetailModalProps) {
    if (!isOpen || !jadwal) return null;

    let typeColor = 'bg-blue-600';
    let typeLabel = 'Teori';
    if (jadwal.tipe === 'Praktikum') {
        typeColor = 'bg-teal-600';
        typeLabel = 'Praktikum';
    } else if (jadwal.tipe === 'Studio') {
        typeColor = 'bg-purple-600';
        typeLabel = 'Praktikum & Teori';
    }

    return (
        <div className="fixed inset-0 z-[2050] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
                {/* Header Banner */}
                <div className={`px-6 py-5 ${typeColor} text-white relative`}>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white text-lg transition-colors cursor-pointer"
                    >
                        <i className="bi bi-x-lg" />
                    </button>
                    <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-white/20 rounded-full tracking-wider">
                        {typeLabel}
                    </span>
                    <h3 className="text-base font-extrabold mt-2 line-clamp-2 leading-tight">
                        {jadwal.mata_kuliah?.nama}
                    </h3>
                    <p className="text-xs text-white/80 mt-1 font-mono">
                        {jadwal.mata_kuliah?.kode} · Semester {jadwal.mata_kuliah?.sem || '-'}
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Time & Day */}
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0">
                            <i className="bi bi-calendar3 text-sm" />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Waktu Pelaksanaan</div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                                {jadwal.hari}, {jadwal.jam_mulai} – {jadwal.jam_selesai}
                            </div>
                        </div>
                    </div>

                    {/* Class & SKS */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0">
                                <i className="bi bi-mortarboard text-sm" />
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kelas</div>
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                                    {jadwal.kelas?.nama}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0">
                                <i className="bi bi-bookmark-star text-sm" />
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bobot</div>
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                                    {jadwal.mata_kuliah?.sks || 0} SKS
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Room */}
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0">
                            <i className="bi bi-door-open text-sm" />
                        </div>
                        <div className="flex-1">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ruangan Kuliah</div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                                {jadwal.ruangan?.nama_ruangan}
                            </div>
                            <div className="text-[10px] text-slate-400">
                                Gedung {jadwal.ruangan?.nama_gedung || '-'} · Kapasitas {jadwal.ruangan?.kapasitas || 0} Mahasiswa
                            </div>
                        </div>
                    </div>

                    {/* Lecturer */}
                    <div className="flex items-start gap-3 pt-2 border-t border-slate-50 dark:border-slate-900">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0">
                            <i className="bi bi-person-badge text-sm" />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dosen Pengampu</div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                                {jadwal.dosen?.nama}
                            </div>
                            {jadwal.dosen?.nidn && (
                                <div className="text-[10px] text-slate-400 font-mono">
                                    NIDN. {jadwal.dosen.nidn}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                    <button
                        onClick={onClose}
                        className="btn-outline text-xs cursor-pointer py-1.5"
                    >
                        Tutup
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={onDelete}
                            className="px-3 py-1.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                            <i className="bi bi-trash3 text-xs" /> Hapus
                        </button>
                        <button
                            onClick={onEdit}
                            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                            <i className="bi bi-pencil text-xs" /> Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
