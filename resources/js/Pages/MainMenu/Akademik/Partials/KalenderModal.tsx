import React from 'react';

interface KalenderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (msg: string) => void;
}

export default function KalenderModal({ isOpen, onClose, onSave }: KalenderModalProps) {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave('Event berhasil ditambahkan');
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                            Tambah Event Kalender
                        </h3>
                        <p className="text-[10px] text-slate-400">
                            Kalender akademik Semester Gasal 2025/2026
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg transition-colors cursor-pointer"
                    >
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="form-label-c">Nama Kegiatan</label>
                            <input className="form-ctrl" type="text" placeholder="cth: Ujian Tengah Semester" required />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="form-label-c">Tanggal Mulai</label>
                                <input className="form-ctrl" type="date" required />
                            </div>
                            <div>
                                <label className="form-label-c">Tanggal Selesai</label>
                                <input className="form-ctrl" type="date" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="form-label-c">Kategori</label>
                                <select className="form-ctrl">
                                    <option>Perkuliahan</option>
                                    <option>Ujian</option>
                                    <option>Libur Nasional</option>
                                    <option>Libur Kampus</option>
                                    <option>Kegiatan Mahasiswa</option>
                                    <option>Wisuda</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label-c">Berlaku Untuk</label>
                                <select className="form-ctrl">
                                    <option>Semua Prodi</option>
                                    <option>Teknik Informatika</option>
                                    <option>Sistem Informasi</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="form-label-c">Keterangan</label>
                            <textarea className="form-ctrl" rows={2} placeholder="Informasi tambahan kegiatan..." required />
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-outline cursor-pointer"
                    >
                        <i className="bi bi-x-lg" /> Batal
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="btn-add cursor-pointer"
                    >
                        <i className="bi bi-check-lg" /> Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}
