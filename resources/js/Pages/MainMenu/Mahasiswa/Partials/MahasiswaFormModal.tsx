import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function MahasiswaFormModal({ isOpen, onClose, mahasiswa, allProdis, allDosens }: any) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nim: '',
        nama: '',
        prodi_id: '',
        angkatan: new Date().getFullYear().toString(),
        status_akademik: 'Aktif',
        dosen_wali_id: '',
    });

    useEffect(() => {
        if (isOpen) {
            if (mahasiswa) {
                setData({
                    nim: mahasiswa.nim || '',
                    nama: mahasiswa.nama || '',
                    prodi_id: mahasiswa.prodi_id || '',
                    angkatan: mahasiswa.angkatan || '',
                    status_akademik: mahasiswa.status_akademik || 'Aktif',
                    dosen_wali_id: mahasiswa.dosen_wali_id || '',
                });
            } else {
                reset();
            }
            clearErrors();
        }
    }, [isOpen, mahasiswa]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                reset();
            }
        };

        if (mahasiswa) {
            put(route('mahasiswa.update', mahasiswa.id), options);
        } else {
            post(route('mahasiswa.store'), options);
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="xl">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl p-6">
                <div className="flex justify-between items-center border-b pb-4 mb-4 dark:border-slate-800">
                    <h5 className="text-lg font-bold text-slate-800 dark:text-white">
                        {mahasiswa ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}
                    </h5>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="form-label text-sm font-medium dark:text-slate-300">NIM</label>
                            <input 
                                type="text" 
                                className={`form-control ${errors.nim ? 'is-invalid' : ''} dark:bg-slate-800 dark:border-slate-700 dark:text-white`} 
                                value={data.nim}
                                onChange={e => setData('nim', e.target.value)}
                            />
                            {errors.nim && <div className="invalid-feedback">{errors.nim}</div>}
                        </div>
                        
                        <div>
                            <label className="form-label text-sm font-medium dark:text-slate-300">Nama Lengkap</label>
                            <input 
                                type="text" 
                                className={`form-control ${errors.nama ? 'is-invalid' : ''} dark:bg-slate-800 dark:border-slate-700 dark:text-white`}
                                value={data.nama}
                                onChange={e => setData('nama', e.target.value)}
                            />
                            {errors.nama && <div className="invalid-feedback">{errors.nama}</div>}
                        </div>
                        
                        <div>
                            <label className="form-label text-sm font-medium dark:text-slate-300">Program Studi</label>
                            <select 
                                className={`form-select ${errors.prodi_id ? 'is-invalid' : ''} dark:bg-slate-800 dark:border-slate-700 dark:text-white`}
                                value={data.prodi_id}
                                onChange={e => setData('prodi_id', e.target.value)}
                            >
                                <option value="">Pilih Prodi</option>
                                {allProdis.map((p: any) => (
                                    <option key={p.id} value={p.id}>{p.nama} ({p.jenjang})</option>
                                ))}
                            </select>
                            {errors.prodi_id && <div className="invalid-feedback">{errors.prodi_id}</div>}
                        </div>
                        
                        <div>
                            <label className="form-label text-sm font-medium dark:text-slate-300">Angkatan</label>
                            <input 
                                type="text" 
                                className={`form-control ${errors.angkatan ? 'is-invalid' : ''} dark:bg-slate-800 dark:border-slate-700 dark:text-white`}
                                value={data.angkatan}
                                onChange={e => setData('angkatan', e.target.value)}
                            />
                            {errors.angkatan && <div className="invalid-feedback">{errors.angkatan}</div>}
                        </div>
                        
                        <div>
                            <label className="form-label text-sm font-medium dark:text-slate-300">Status Akademik</label>
                            <select 
                                className={`form-select ${errors.status_akademik ? 'is-invalid' : ''} dark:bg-slate-800 dark:border-slate-700 dark:text-white`}
                                value={data.status_akademik}
                                onChange={e => setData('status_akademik', e.target.value)}
                            >
                                <option value="Aktif">Aktif</option>
                                <option value="Cuti">Cuti</option>
                                <option value="Non-Aktif">Non-Aktif</option>
                                <option value="Drop Out">Drop Out</option>
                                <option value="Lulus">Lulus</option>
                            </select>
                            {errors.status_akademik && <div className="invalid-feedback">{errors.status_akademik}</div>}
                        </div>

                        <div>
                            <label className="form-label text-sm font-medium dark:text-slate-300">Dosen Wali</label>
                            <select 
                                className={`form-select ${errors.dosen_wali_id ? 'is-invalid' : ''} dark:bg-slate-800 dark:border-slate-700 dark:text-white`}
                                value={data.dosen_wali_id}
                                onChange={e => setData('dosen_wali_id', e.target.value)}
                            >
                                <option value="">Pilih Dosen Wali</option>
                                {allDosens.map((d: any) => (
                                    <option key={d.id} value={d.id}>{d.nama}</option>
                                ))}
                            </select>
                            {errors.dosen_wali_id && <div className="invalid-feedback">{errors.dosen_wali_id}</div>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t dark:border-slate-800">
                        <button type="button" className="btn btn-light" onClick={onClose} disabled={processing}>
                            Batal
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
