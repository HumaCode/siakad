import React from 'react';
import { useForm } from '@inertiajs/react';
import { store as storeProdi } from '@/actions/App/Http/Controllers/MainMenu/AkademikController';

interface KurikulumModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (msg: string) => void;
    fakultas: any[];
}

export default function KurikulumModal({ isOpen, onClose, onSave, fakultas }: KurikulumModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        fakultas_id: '',
        kode: '',
        nama: '',
        jenjang: 'S1',
        kaprodi: '',
        tahun: 2024,
        sks: 144,
        lama_studi: 8,
        akreditasi: 'Unggul',
        status: 'Aktif',
        deskripsi: '',
    });

    React.useEffect(() => {
        if (isOpen) {
            setData({
                fakultas_id: fakultas[0]?.id || '',
                kode: '',
                nama: '',
                jenjang: 'S1',
                kaprodi: '',
                tahun: 2024,
                sks: 144,
                lama_studi: 8,
                akreditasi: 'Unggul',
                status: 'Aktif',
                deskripsi: '',
            });
        }
    }, [isOpen, fakultas]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(storeProdi.url(), {
            onSuccess: () => {
                reset();
                onSave('Program Studi baru berhasil disimpan');
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
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
                <form onSubmit={handleSubmit} id="kurikulum-form" className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="form-label-c">Nama Program Studi</label>
                            <input
                                className={`form-ctrl ${errors.nama ? 'border-red-500' : ''}`}
                                type="text"
                                placeholder="cth: Teknik Informatika"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                required
                            />
                            {errors.nama && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.nama}</span>
                            )}
                        </div>
                        <div>
                            <label className="form-label-c">Kode Program Studi</label>
                            <input
                                className={`form-ctrl ${errors.kode ? 'border-red-500' : ''}`}
                                type="text"
                                placeholder="cth: IF, SI, MAT"
                                value={data.kode}
                                onChange={(e) => setData('kode', e.target.value)}
                                required
                            />
                            {errors.kode && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.kode}</span>
                            )}
                        </div>
                        <div>
                            <label className="form-label-c">Jenjang</label>
                            <select
                                className="form-ctrl"
                                value={data.jenjang}
                                onChange={(e) => setData('jenjang', e.target.value)}
                            >
                                <option value="S1">S1 (Sarjana)</option>
                                <option value="S2">S2 (Magister)</option>
                                <option value="S3">S3 (Doktor)</option>
                                <option value="D3">D3 (Diploma III)</option>
                            </select>
                            {errors.jenjang && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.jenjang}</span>
                            )}
                        </div>
                        <div>
                            <label className="form-label-c">Tahun Kurikulum</label>
                            <input
                                className="form-ctrl"
                                type="number"
                                placeholder="2024"
                                value={data.tahun}
                                onChange={(e) => setData('tahun', parseInt(e.target.value) || 2024)}
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label-c">Total SKS</label>
                            <input
                                className="form-ctrl"
                                type="number"
                                placeholder="144"
                                value={data.sks}
                                onChange={(e) => setData('sks', parseInt(e.target.value) || 144)}
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label-c">Lama Studi (Semester)</label>
                            <input
                                className="form-ctrl"
                                type="number"
                                placeholder="8"
                                value={data.lama_studi}
                                onChange={(e) => setData('lama_studi', parseInt(e.target.value) || 8)}
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label-c">Fakultas</label>
                            <select
                                className={`form-ctrl ${errors.fakultas_id ? 'border-red-500' : ''}`}
                                value={data.fakultas_id}
                                onChange={(e) => setData('fakultas_id', e.target.value)}
                            >
                                {fakultas.map(f => (
                                    <option key={f.id} value={f.id}>{f.nama}</option>
                                ))}
                            </select>
                            {errors.fakultas_id && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.fakultas_id}</span>
                            )}
                        </div>
                        <div>
                            <label className="form-label-c">Status Akreditasi</label>
                            <select
                                className="form-ctrl"
                                value={data.akreditasi}
                                onChange={(e) => setData('akreditasi', e.target.value)}
                            >
                                <option>Unggul</option>
                                <option>A</option>
                                <option>B</option>
                                <option>C</option>
                                <option>Dalam Proses</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label-c">Ketua Program Studi</label>
                            <input
                                className={`form-ctrl ${errors.kaprodi ? 'border-red-500' : ''}`}
                                type="text"
                                placeholder="Nama dosen kaprodi"
                                value={data.kaprodi}
                                onChange={(e) => setData('kaprodi', e.target.value)}
                                required
                            />
                            {errors.kaprodi && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.kaprodi}</span>
                            )}
                        </div>
                        <div className="md:col-span-3">
                            <label className="form-label-c">Status Kurikulum</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                                {[
                                    { value: 'Aktif', label: 'Aktif', icon: 'bi-check-circle-fill', activeBg: 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-400', ring: 'ring-blue-500' },
                                    { value: 'Revisi', label: 'Dalam Revisi', icon: 'bi-exclamation-circle-fill', activeBg: 'bg-purple-50 border-purple-500 text-purple-700 dark:bg-purple-950/30 dark:border-purple-800 dark:text-purple-400', ring: 'ring-purple-500' },
                                    { value: 'Tidak Aktif', label: 'Tidak Aktif', icon: 'bi-x-circle-fill', activeBg: 'bg-slate-100 border-slate-500 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300', ring: 'ring-slate-500' }
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
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${opt.value === 'Aktif' ? 'bg-blue-600' : opt.value === 'Revisi' ? 'bg-purple-600' : 'bg-slate-600'}`}>
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
                        <div className="md:col-span-3">
                            <label className="form-label-c">Deskripsi / Profil Lulusan</label>
                            <textarea
                                className="form-ctrl"
                                rows={3}
                                placeholder="Deskripsi kurikulum dan profil lulusan..."
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                required
                            />
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
                        form="kurikulum-form"
                        className="btn-add cursor-pointer"
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                Menyimpan...
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
