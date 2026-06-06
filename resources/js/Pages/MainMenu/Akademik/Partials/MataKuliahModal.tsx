import React from 'react';

interface MataKuliahModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (msg: string) => void;
}

export default function MataKuliahModal({ isOpen, onClose, onSave }: MataKuliahModalProps) {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave('Mata kuliah berhasil disimpan');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                            Tambah / Edit Mata Kuliah
                        </h3>
                        <p className="text-[10px] text-slate-400">
                            Data mata kuliah dalam kurikulum
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="form-label-c">Kode Mata Kuliah</label>
                            <input className="form-ctrl font-mono" type="text" placeholder="cth: TI501" required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="form-label-c">Nama Mata Kuliah</label>
                            <input className="form-ctrl" type="text" placeholder="cth: Algoritma & Pemrograman" required />
                        </div>
                        <div>
                            <label className="form-label-c">Program Studi</label>
                            <select className="form-ctrl">
                                <option>Teknik Informatika</option>
                                <option>Sistem Informasi</option>
                                <option>Manajemen Bisnis</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label-c">SKS Teori</label>
                            <input className="form-ctrl" type="number" placeholder="2" required />
                        </div>
                        <div>
                            <label className="form-label-c">SKS Praktik</label>
                            <input className="form-ctrl" type="number" placeholder="1" required />
                        </div>
                        <div>
                            <label className="form-label-c">Semester</label>
                            <select className="form-ctrl">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                    <option key={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="form-label-c">Jenis</label>
                            <select className="form-ctrl">
                                <option>Wajib</option>
                                <option>Pilihan</option>
                                <option>Praktikum</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label-c">Prasyarat</label>
                            <input className="form-ctrl font-mono" type="text" placeholder="Kode MK prasyarat (opsional)" />
                        </div>
                        <div className="md:col-span-3">
                            <label className="form-label-c">Dosen Pengampu</label>
                            <input className="form-ctrl" type="text" placeholder="Nama dosen / NIDN" required />
                        </div>
                        <div className="md:col-span-3">
                            <label className="form-label-c">Deskripsi Mata Kuliah</label>
                            <textarea className="form-ctrl" rows={2} placeholder="Deskripsi singkat capaian pembelajaran mata kuliah..." required />
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
