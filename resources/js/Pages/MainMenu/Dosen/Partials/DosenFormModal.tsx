import React, { useEffect } from 'react';
import Modal from '@/Components/Modal';
import SearchableSelect from '@/Components/SearchableSelect';
import { useForm } from '@inertiajs/react';

interface DosenFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    dosen: any | null;
    allProdis?: string[];
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export default function DosenFormModal({
    isOpen,
    onClose,
    dosen,
    allProdis = [
        'Teknik Informatika',
        'Sistem Informasi',
        'Manajemen Bisnis',
        'Ilmu Hukum',
        'Kedokteran Gigi',
        'Teknik Elektro'
    ],
    onSuccess,
    onError
}: DosenFormModalProps) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nidn: '',
        nama: '',
        gelar_depan: '',
        gelar_belakang: '',
        email: '',
        hp: '',
        prodi: '',
        jabatan: 'Asisten Ahli',
        status: 'Aktif'
    });

    useEffect(() => {
        if (dosen) {
            setData({
                nidn: dosen.nidn || '',
                nama: dosen.nama || '',
                gelar_depan: dosen.gelar_depan || '',
                gelar_belakang: dosen.gelar_belakang || '',
                email: dosen.email || '',
                hp: dosen.hp || '',
                prodi: dosen.prodi?.nama || dosen.prodi || '',
                jabatan: dosen.jabatan || 'Asisten Ahli',
                status: dosen.status || dosen.status_dosen || 'Aktif'
            });
        } else {
            reset();
        }
        clearErrors();
    }, [dosen, isOpen]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (dosen) {
            put(`/dosen/${dosen.id}`, {
                onSuccess: () => {
                    onSuccess('Data dosen berhasil diperbarui.');
                    onClose();
                },
                onError: (err) => {
                    onError('Gagal memperbarui data dosen. Periksa kembali inputan Anda.');
                }
            });
        } else {
            post('/dosen', {
                onSuccess: () => {
                    onSuccess('Data dosen baru berhasil ditambahkan.');
                    onClose();
                    reset();
                },
                onError: (err) => {
                    onError('Gagal menambahkan data dosen. Periksa kembali inputan Anda.');
                }
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="4xl" overflow="visible">
            <div className="modal-content" style={{ background: '#fff', border: 'none', borderRadius: '16px' }}>
                <div className="modal-header flex justify-between items-center p-4 border-b border-gray-100">
                    <h5 className="modal-title font-poppins m-0">
                        <i className="bi bi-person-plus-fill me-2 text-primary"></i>
                        {dosen ? 'Edit Data Dosen' : 'Tambah Dosen Baru'}
                    </h5>
                    <button 
                        type="button" 
                        className="text-gray-400 hover:text-gray-600 transition border-0 bg-transparent p-1" 
                        onClick={onClose} 
                        aria-label="Close"
                    >
                        <i className="bi bi-x-lg" style={{ fontSize: '1.2rem' }}></i>
                    </button>
                </div>
                <form onSubmit={handleFormSubmit}>
                    <div className="modal-body p-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-5 my-2">
                            {/* NIDN */}
                            <div className="col-span-1 md:col-span-6">
                                <label className="form-label-c">Nomor Induk Dosen Nasional (NIDN)</label>
                                <input
                                    type="text"
                                    className={`form-ctrl ${errors.nidn ? 'border-rose-500' : ''}`}
                                    placeholder="10 digit angka NIDN"
                                    value={data.nidn}
                                    onChange={e => setData('nidn', e.target.value)}
                                    required
                                />
                                {errors.nidn && <p className="text-rose-500 text-xs mt-1">{errors.nidn}</p>}
                            </div>

                            {/* Nama Lengkap */}
                            <div className="col-span-1 md:col-span-6">
                                <label className="form-label-c">Nama Lengkap (tanpa gelar)</label>
                                <input
                                    type="text"
                                    className={`form-ctrl ${errors.nama ? 'border-rose-500' : ''}`}
                                    placeholder="Contoh: Agus Maulana"
                                    value={data.nama}
                                    onChange={e => setData('nama', e.target.value)}
                                    required
                                />
                                {errors.nama && <p className="text-rose-500 text-xs mt-1">{errors.nama}</p>}
                            </div>

                            {/* Gelar Depan */}
                            <div className="col-span-1 md:col-span-6">
                                <label className="form-label-c">Gelar Depan (jika ada)</label>
                                <input
                                    type="text"
                                    className={`form-ctrl ${errors.gelar_depan ? 'border-rose-500' : ''}`}
                                    placeholder="Contoh: Prof. Dr."
                                    value={data.gelar_depan}
                                    onChange={e => setData('gelar_depan', e.target.value)}
                                />
                                {errors.gelar_depan && <p className="text-rose-500 text-xs mt-1">{errors.gelar_depan}</p>}
                            </div>

                            {/* Gelar Belakang */}
                            <div className="col-span-1 md:col-span-6">
                                <label className="form-label-c">Gelar Belakang</label>
                                <input
                                    type="text"
                                    className={`form-ctrl ${errors.gelar_belakang ? 'border-rose-500' : ''}`}
                                    placeholder="Contoh: M.T., Ph.D"
                                    value={data.gelar_belakang}
                                    onChange={e => setData('gelar_belakang', e.target.value)}
                                />
                                {errors.gelar_belakang && <p className="text-rose-500 text-xs mt-1">{errors.gelar_belakang}</p>}
                            </div>

                            {/* Email Kampus */}
                            <div className="col-span-1 md:col-span-6">
                                <label className="form-label-c">Email Kampus</label>
                                <input
                                    type="email"
                                    className={`form-ctrl ${errors.email ? 'border-rose-500' : ''}`}
                                    placeholder="dosen@universitas.ac.id"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Nomor HP */}
                            <div className="col-span-1 md:col-span-6">
                                <label className="form-label-c">Nomor HP / WhatsApp</label>
                                <input
                                    type="tel"
                                    className={`form-ctrl ${errors.hp ? 'border-rose-500' : ''}`}
                                    placeholder="Contoh: 08123456789"
                                    value={data.hp}
                                    onChange={e => setData('hp', e.target.value)}
                                    required
                                />
                                {errors.hp && <p className="text-rose-500 text-xs mt-1">{errors.hp}</p>}
                            </div>

                            {/* Program Studi (Searchable Select) */}
                            <div className="col-span-1 md:col-span-4">
                                <SearchableSelect
                                    label="Program Studi Homebase"
                                    placeholder="Pilih Program Studi"
                                    value={data.prodi}
                                    onChange={(val) => setData('prodi', val)}
                                    options={allProdis.map((prodi) => ({
                                        value: prodi,
                                        label: prodi
                                    }))}
                                    error={errors.prodi}
                                    required
                                />
                            </div>

                            {/* Jabatan Fungsional */}
                            <div className="col-span-1 md:col-span-4">
                                <label className="form-label-c">Jabatan Fungsional Akademik</label>
                                <select
                                    className={`form-ctrl ${errors.jabatan ? 'border-rose-500' : ''}`}
                                    value={data.jabatan}
                                    onChange={e => setData('jabatan', e.target.value)}
                                    required
                                >
                                    <option value="Asisten Ahli">Asisten Ahli</option>
                                    <option value="Lektor">Lektor</option>
                                    <option value="Lektor Kepala">Lektor Kepala</option>
                                    <option value="Guru Besar">Guru Besar</option>
                                </select>
                                {errors.jabatan && <p className="text-rose-500 text-xs mt-1">{errors.jabatan}</p>}
                            </div>

                            {/* Status Dosen */}
                            <div className="col-span-1 md:col-span-4">
                                <label className="form-label-c">Status Aktif Dosen</label>
                                <select
                                    className={`form-ctrl ${errors.status ? 'border-rose-500' : ''}`}
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    required
                                >
                                    <option value="Aktif">Aktif</option>
                                    <option value="Cuti">Cuti</option>
                                    <option value="Pensiun">Pensiun</option>
                                </select>
                                {errors.status && <p className="text-rose-500 text-xs mt-1">{errors.status}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer flex justify-between p-4 border-t border-gray-100">
                        <button type="button" className="btn-outline" onClick={onClose}>
                            <i className="bi bi-x-lg"></i> Batal
                        </button>
                        <button type="submit" className="btn-add flex items-center gap-2" disabled={processing}>
                            {processing ? (
                                <>
                                    <span className="spinner-border spinner-border-sm animate-spin inline-block w-4 h-4 border-2 rounded-full border-r-transparent" role="status" aria-hidden="true" />
                                    Sedang Proses...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-lg"></i> Simpan Data
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
