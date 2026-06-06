import React from 'react';

interface JadwalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (msg: string) => void;
}

export default function JadwalModal({ isOpen, onClose, onSave }: JadwalModalProps) {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave('Jadwal berhasil ditambahkan');
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                            Tambah Sesi Jadwal
                        </h3>
                        <p className="text-[10px] text-slate-400">
                            Konfigurasikan jadwal perkuliahan
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
                            <label className="form-label-c">Mata Kuliah</label>
                            <select className="form-ctrl">
                                <option>Algoritma & Pemrograman (TI501)</option>
                                <option>Basis Data Lanjut (TI502)</option>
                                <option>Rekayasa Perangkat Lunak (TI503)</option>
                                <option>Jaringan Komputer (TI504)</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="form-label-c">Hari</label>
                                <select className="form-ctrl">
                                    <option>Senin</option>
                                    <option>Selasa</option>
                                    <option>Rabu</option>
                                    <option>Kamis</option>
                                    <option>Jumat</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label-c">Kelas</label>
                                <select className="form-ctrl">
                                    <option>A</option>
                                    <option>B</option>
                                    <option>C</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="form-label-c">Jam Mulai</label>
                                <input className="form-ctrl" type="time" defaultValue="07:00" required />
                            </div>
                            <div>
                                <label className="form-label-c">Jam Selesai</label>
                                <input className="form-ctrl" type="time" defaultValue="08:40" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="form-label-c">Ruangan</label>
                                <select className="form-ctrl">
                                    <option>R.101</option>
                                    <option>R.204</option>
                                    <option>R.304</option>
                                    <option>Lab TI</option>
                                    <option>Lab Jaringan</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label-c">Tipe</label>
                                <select className="form-ctrl">
                                    <option>Teori</option>
                                    <option>Praktikum</option>
                                    <option>Studio</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="form-label-c">Dosen</label>
                            <input className="form-ctrl" type="text" placeholder="Cari nama dosen..." required />
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
