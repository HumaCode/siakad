import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

interface KalenderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (msg: string) => void;
    tahun?: string;
    eventToEdit?: any;
}

export default function KalenderModal({ isOpen, onClose, onSave, tahun, eventToEdit }: KalenderModalProps) {
    const defaultTahun = tahun || new Date().getFullYear().toString();

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        judul: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        jenis: 'Perkuliahan',
        deskripsi: '',
        tahun: defaultTahun,
    });

    useEffect(() => {
        if (isOpen) {
            if (eventToEdit) {
                setData({
                    judul: eventToEdit.judul || '',
                    tanggal_mulai: eventToEdit.tanggal_mulai || '',
                    tanggal_selesai: eventToEdit.tanggal_selesai || '',
                    jenis: eventToEdit.jenis || 'Perkuliahan',
                    deskripsi: eventToEdit.deskripsi || '',
                    tahun: eventToEdit.tahun || defaultTahun,
                });
            } else {
                setData('tahun', defaultTahun);
            }
        } else {
            reset();
            clearErrors();
        }
    }, [isOpen, defaultTahun]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const options = {
            preserveScroll: true,
            preserveState: true,
            only: ['kalender', 'errors'],
            onSuccess: () => {
                onClose();
                onSave(eventToEdit ? 'Event berhasil diperbarui' : 'Event berhasil ditambahkan');
                reset();
            }
        };

        if (eventToEdit) {
            put(route('akademik.kalender.update', eventToEdit.id), options);
        } else {
            post(route('akademik.kalender.store'), options);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                            {eventToEdit ? 'Edit Event Kalender' : 'Tambah Event Kalender'}
                        </h3>
                        <p className="text-[10px] text-slate-400">
                            Tahun akademik {data.tahun}
                        </p>
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
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6" id="kalender-form">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="form-label-c">Nama Kegiatan</label>
                            <input 
                                className="form-ctrl" 
                                type="text" 
                                placeholder="cth: Ujian Tengah Semester" 
                                required 
                                value={data.judul}
                                onChange={(e) => setData('judul', e.target.value)}
                                disabled={processing}
                            />
                            {errors.judul && <p className="text-red-500 text-xs mt-1">{errors.judul}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="form-label-c">Tanggal Mulai</label>
                                <input 
                                    className="form-ctrl" 
                                    type="date" 
                                    required 
                                    value={data.tanggal_mulai}
                                    onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                    disabled={processing}
                                />
                                {errors.tanggal_mulai && <p className="text-red-500 text-xs mt-1">{errors.tanggal_mulai}</p>}
                            </div>
                            <div>
                                <label className="form-label-c">Tanggal Selesai <span className="text-slate-400 font-normal text-[10px]">(Opsional)</span></label>
                                <input 
                                    className="form-ctrl" 
                                    type="date" 
                                    value={data.tanggal_selesai}
                                    onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                    disabled={processing}
                                />
                                {errors.tanggal_selesai && <p className="text-red-500 text-xs mt-1">{errors.tanggal_selesai}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                                <label className="form-label-c">Kategori</label>
                                <select 
                                    className="form-ctrl"
                                    value={data.jenis}
                                    onChange={(e) => setData('jenis', e.target.value)}
                                    disabled={processing}
                                >
                                    <option>Perkuliahan</option>
                                    <option>Ujian</option>
                                    <option>Libur Nasional</option>
                                    <option>Libur Kampus</option>
                                    <option>Kegiatan Mahasiswa</option>
                                    <option>Wisuda</option>
                                </select>
                                {errors.jenis && <p className="text-red-500 text-xs mt-1">{errors.jenis}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="form-label-c">Keterangan <span className="text-slate-400 font-normal text-[10px]">(Opsional)</span></label>
                            <textarea 
                                className="form-ctrl" 
                                rows={2} 
                                placeholder="Informasi tambahan kegiatan..." 
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                disabled={processing}
                            />
                            {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>}
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
                        form="kalender-form"
                        className="btn-add cursor-pointer flex items-center justify-center min-w-[140px] gap-2"
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <i className="bi bi-arrow-repeat animate-spin" /> Sedang proses...
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
