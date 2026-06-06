import React from 'react';

interface KurikulumModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (msg: string) => void;
    fakultas: any[];
}

export default function KurikulumModal({ isOpen, onClose, onSave, fakultas }: KurikulumModalProps) {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave('Kurikulum berhasil disimpan');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                            Tambah / Edit Kurikulum
                        </h3>
                        <p className="text-[10px] text-slate-400">
                            Data program studi dan kurikulum aktif
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="form-label-c">Nama Program Studi</label>
                            <input className="form-ctrl" type="text" placeholder="cth: Teknik Informatika" required />
                        </div>
                        <div>
                            <label className="form-label-c">Jenjang</label>
                            <select className="form-ctrl">
                                <option>S1 (Sarjana)</option>
                                <option>S2 (Magister)</option>
                                <option>S3 (Doktor)</option>
                                <option>D3 (Diploma III)</option>
                                <option>D4 (Diploma IV)</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label-c">Tahun Kurikulum</label>
                            <input className="form-ctrl" type="number" placeholder="2024" required />
                        </div>
                        <div>
                            <label className="form-label-c">Total SKS</label>
                            <input className="form-ctrl" type="number" placeholder="144" required />
                        </div>
                        <div>
                            <label className="form-label-c">Lama Studi (Semester)</label>
                            <input className="form-ctrl" type="number" placeholder="8" required />
                        </div>
                        <div>
                            <label className="form-label-c">Fakultas</label>
                            <select className="form-ctrl">
                                {fakultas.map(f => (
                                    <option key={f.id} value={f.id}>{f.nama}</option>
                                ))}
                                {fakultas.length === 0 && (
                                    <>
                                        <option>Teknik & Teknologi</option>
                                        <option>Ekonomi & Bisnis</option>
                                        <option>Hukum</option>
                                        <option>Kedokteran</option>
                                    </>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="form-label-c">Status Akreditasi</label>
                            <select className="form-ctrl">
                                <option>Unggul</option>
                                <option>A</option>
                                <option>B</option>
                                <option>C</option>
                                <option>Dalam Proses</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label-c">Ketua Program Studi</label>
                            <input className="form-ctrl" type="text" placeholder="Nama dosen kaprodi" required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="form-label-c">Status Kurikulum</label>
                            <select className="form-ctrl">
                                <option>Aktif</option>
                                <option>Revisi</option>
                                <option>Tidak Aktif</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="form-label-c">Deskripsi / Profil Lulusan</label>
                            <textarea className="form-ctrl" rows={3} placeholder="Deskripsi kurikulum dan profil lulusan..." required />
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
