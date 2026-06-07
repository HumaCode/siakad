import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

interface ProdiItem {
    id: string;
    nama: string;
}

interface KelasItem {
    id: string;
    nama: string;
    prodi_id: string;
    status: string;
}

interface KelasModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (msg: string) => void;
    prodis: ProdiItem[];
    kelas: KelasItem | null;
}

export default function KelasModal({ isOpen, onClose, onSave, prodis = [], kelas }: KelasModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        prodi_id: '',
        nama: '',
        status: 'Aktif',
    });

    useEffect(() => {
        if (isOpen) {
            if (kelas) {
                setData({
                    prodi_id: kelas.prodi_id,
                    nama: kelas.nama,
                    status: kelas.status,
                });
            } else {
                setData({
                    prodi_id: prodis[0]?.id || '',
                    nama: '',
                    status: 'Aktif',
                });
            }
        }
    }, [isOpen, kelas, prodis]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (kelas) {
            put(route('akademik.kelas.update', kelas.id), {
                onSuccess: () => {
                    reset();
                    onSave('Kelas berhasil diperbarui');
                },
                preserveScroll: true,
            });
        } else {
            post(route('akademik.kelas.store'), {
                onSuccess: () => {
                    reset();
                    onSave('Kelas baru berhasil disimpan');
                },
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                            {kelas ? 'Edit Kelas' : 'Tambah Kelas'}
                        </h3>
                        <p className="text-[10px] text-slate-400">
                            Konfigurasikan data kelas master
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
                            <label className="form-label-c">Program Studi</label>
                            <select 
                                className={`form-ctrl ${errors.prodi_id ? 'border-red-500' : ''}`}
                                value={data.prodi_id}
                                onChange={(e) => setData('prodi_id', e.target.value)}
                                required
                            >
                                {prodis.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nama}
                                    </option>
                                ))}
                            </select>
                            {errors.prodi_id && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.prodi_id}</span>
                            )}
                        </div>

                        <div>
                            <label className="form-label-c">Nama Kelas</label>
                            <input 
                                className={`form-ctrl ${errors.nama ? 'border-red-500' : ''}`}
                                type="text"
                                placeholder="Contoh: Kelas A, Reguler B, Executive"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                required 
                            />
                            {errors.nama && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.nama}</span>
                            )}
                        </div>

                        <div>
                            <label className="form-label-c">Status</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                {[
                                    { value: 'Aktif', label: 'Aktif', icon: 'bi-check-circle-fill', activeBg: 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-400', ring: 'ring-blue-500' },
                                    { value: 'Nonaktif', label: 'Nonaktif', icon: 'bi-x-circle-fill', activeBg: 'bg-slate-100 border-slate-500 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300', ring: 'ring-slate-500' }
                                ].map((opt) => {
                                    const isSelected = data.status === opt.value;
                                    return (
                                        <label
                                            key={opt.value}
                                            className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all duration-200 select-none ${
                                                isSelected 
                                                    ? `${opt.activeBg} ${opt.ring} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 border-transparent` 
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="status"
                                                value={opt.value}
                                                checked={isSelected}
                                                onChange={() => setData('status', opt.value)}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center gap-2">
                                                <i className={`bi ${opt.icon} text-base`} />
                                                <span className="text-xs font-bold">{opt.label}</span>
                                            </div>
                                            {isSelected && (
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${opt.value === 'Aktif' ? 'bg-blue-600' : 'bg-slate-600'}`}>
                                                    <i className="bi bi-check text-[10px] font-black" />
                                                </div>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                            {errors.status && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.status}</span>
                            )}
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-outline cursor-pointer"
                        disabled={processing}
                    >
                        <i className="bi bi-x-lg" /> Batal
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="btn-add cursor-pointer animate-fade-in"
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2 inline-block animate-spin" /> Menyimpan...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg" /> Simpan
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
