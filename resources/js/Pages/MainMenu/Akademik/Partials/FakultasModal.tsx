import React from 'react';
import { useForm } from '@inertiajs/react';
import { storeFakultas, updateFakultas } from '@/actions/App/Http/Controllers/MainMenu/AkademikController';

interface FakultasItem {
    id: string;
    kode: string;
    nama: string;
    dekan: string | null;
}

interface FakultasModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (msg: string) => void;
    fakultas: FakultasItem | null;
}

export default function FakultasModal({ isOpen, onClose, onSave, fakultas }: FakultasModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        kode: '',
        nama: '',
        dekan: '',
    });

    React.useEffect(() => {
        if (isOpen) {
            setData({
                kode: fakultas ? fakultas.kode : '',
                nama: fakultas ? fakultas.nama : '',
                dekan: fakultas ? (fakultas.dekan || '') : '',
            });
        }
    }, [isOpen, fakultas]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (fakultas) {
            put(updateFakultas.url(fakultas.id), {
                onSuccess: () => {
                    reset();
                    onSave('Fakultas berhasil diperbarui');
                }
            });
        } else {
            post(storeFakultas.url(), {
                onSuccess: () => {
                    reset();
                    onSave('Fakultas baru berhasil disimpan');
                }
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                            {fakultas ? 'Edit Fakultas' : 'Tambah Fakultas'}
                        </h3>
                        <p className="text-[10px] text-slate-400">
                            Data master fakultas di lingkungan universitas
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
                            <label className="form-label-c">Kode Fakultas</label>
                            <input
                                className={`form-ctrl ${errors.kode ? 'border-red-500' : ''}`}
                                type="text"
                                placeholder="cth: FT, FEB, FMIPA"
                                value={data.kode}
                                onChange={(e) => setData('kode', e.target.value)}
                                required
                            />
                            {errors.kode && (
                                <p className="text-rose-500 text-[10px] mt-1 font-semibold">{errors.kode}</p>
                            )}
                        </div>

                        <div>
                            <label className="form-label-c">Nama Fakultas</label>
                            <input
                                className={`form-ctrl ${errors.nama ? 'border-red-500' : ''}`}
                                type="text"
                                placeholder="cth: Fakultas Teknik"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                required
                            />
                            {errors.nama && (
                                <p className="text-rose-500 text-[10px] mt-1 font-semibold">{errors.nama}</p>
                            )}
                        </div>

                        <div>
                            <label className="form-label-c">Dekan Fakultas (Nama Lengkap & Gelar)</label>
                            <input
                                className={`form-ctrl ${errors.dekan ? 'border-red-500' : ''}`}
                                type="text"
                                placeholder="cth: Prof. Dr. Ir. H. Ahmad Fauzi, M.T."
                                value={data.dekan}
                                onChange={(e) => setData('dekan', e.target.value)}
                            />
                            {errors.dekan && (
                                <p className="text-rose-500 text-[10px] mt-1 font-semibold">{errors.dekan}</p>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                            {processing ? (
                                <>
                                    <span className="spinner-border animate-spin inline-block w-3 h-3 border-2 rounded-full" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-lg" />
                                    Simpan Fakultas
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
