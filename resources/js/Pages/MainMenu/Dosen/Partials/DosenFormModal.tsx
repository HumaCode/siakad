import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import SearchableSelect from '@/Components/SearchableSelect';

interface DosenFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    dosen: any | null;
    onSubmit: (data: any) => void;
    allProdis?: string[];
}

export default function DosenFormModal({
    isOpen,
    onClose,
    dosen,
    onSubmit,
    allProdis = [
        'Teknik Informatika',
        'Sistem Informasi',
        'Manajemen Bisnis',
        'Ilmu Hukum',
        'Kedokteran Gigi',
        'Teknik Elektro'
    ]
}: DosenFormModalProps) {
    const [formData, setFormData] = useState({
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
            setFormData({
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
            setFormData({
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
        }
    }, [dosen, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="4xl" overflow="visible">
            <div className="modal-content" style={{ background: '#fff', border: 'none' }}>
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
                                    className="form-ctrl"
                                    placeholder="10 digit angka NIDN"
                                    name="nidn"
                                    value={formData.nidn}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Nama Lengkap */}
                            <div className="col-span-1 md:col-span-6">
                                <label className="form-label-c">Nama Lengkap (tanpa gelar)</label>
                                <input
                                    type="text"
                                    className="form-ctrl"
                                    placeholder="Contoh: Agus Maulana"
                                    name="nama"
                                    value={formData.nama}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Gelar Depan */}
                            <div className="col-span-1 md:col-span-6">
                                <label className="form-label-c">Gelar Depan (jika ada)</label>
                                <input
                                    type="text"
                                    className="form-ctrl"
                                    placeholder="Contoh: Prof. Dr."
                                    name="gelar_depan"
                                    value={formData.gelar_depan}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Gelar Belakang */}
                            <div className="col-span-1 md:col-span-6">
                                <label className="form-label-c">Gelar Belakang</label>
                                <input
                                    type="text"
                                    className="form-ctrl"
                                    placeholder="Contoh: M.T., Ph.D"
                                    name="gelar_belakang"
                                    value={formData.gelar_belakang}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Email Kampus */}
                            <div className="col-span-1 md:col-span-6">
                                <label className="form-label-c">Email Kampus</label>
                                <input
                                    type="email"
                                    className="form-ctrl"
                                    placeholder="dosen@universitas.ac.id"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Nomor HP */}
                            <div className="col-span-1 md:col-span-6">
                                <label className="form-label-c">Nomor HP / WhatsApp</label>
                                <input
                                    type="tel"
                                    className="form-ctrl"
                                    placeholder="Contoh: 08123456789"
                                    name="hp"
                                    value={formData.hp}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Program Studi (Searchable Select) */}
                            <div className="col-span-1 md:col-span-4">
                                <SearchableSelect
                                    label="Program Studi Homebase"
                                    placeholder="Pilih Program Studi"
                                    value={formData.prodi}
                                    onChange={(val) => setFormData(prev => ({ ...prev, prodi: val }))}
                                    options={allProdis.map((prodi) => ({
                                        value: prodi,
                                        label: prodi
                                    }))}
                                    required
                                />
                            </div>

                            {/* Jabatan Fungsional */}
                            <div className="col-span-1 md:col-span-4">
                                <label className="form-label-c">Jabatan Fungsional Akademik</label>
                                <select
                                    className="form-ctrl"
                                    name="jabatan"
                                    value={formData.jabatan}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Asisten Ahli">Asisten Ahli</option>
                                    <option value="Lektor">Lektor</option>
                                    <option value="Lektor Kepala">Lektor Kepala</option>
                                    <option value="Guru Besar">Guru Besar</option>
                                </select>
                            </div>

                            {/* Status Dosen */}
                            <div className="col-span-1 md:col-span-4">
                                <label className="form-label-c">Status Aktif Dosen</label>
                                <select
                                    className="form-ctrl"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Aktif">Aktif</option>
                                    <option value="Cuti">Cuti</option>
                                    <option value="Pensiun">Pensiun</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer flex justify-between p-4 border-t border-gray-100">
                        <button type="button" className="btn-outline" onClick={onClose}>
                            <i className="bi bi-x-lg"></i> Batal
                        </button>
                        <button type="submit" className="btn-add">
                            <i className="bi bi-check-lg"></i> Simpan Data
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
