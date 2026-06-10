import React, { useState, useEffect } from 'react';

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

    if (!isOpen) return null;

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
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(15, 30, 69, 0.4)', zIndex: 1050 }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-lg modal-custom">
                <div className="modal-content">
                    <div className="modal-header d-flex justify-content-between align-items-center">
                        <h5 className="modal-title font-poppins">
                            <i className="bi bi-person-plus-fill me-2 text-primary"></i>
                            {dosen ? 'Edit Data Dosen' : 'Tambah Dosen Baru'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-12 col-md-6">
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
                                <div className="col-12 col-md-6">
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
                                <div className="col-12 col-md-6">
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
                                <div className="col-12 col-md-6">
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
                                <div className="col-12 col-md-6">
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
                                <div className="col-12 col-md-6">
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
                                <div className="col-12 col-md-4">
                                    <label className="form-label-c">Program Studi Homebase</label>
                                    <select
                                        className="form-ctrl"
                                        name="prodi"
                                        value={formData.prodi}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Pilih Program Studi</option>
                                        {allProdis.map((prodi) => (
                                            <option key={prodi} value={prodi}>
                                                {prodi}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-12 col-md-4">
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
                                <div className="col-12 col-md-4">
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
                        <div className="modal-footer d-flex justify-content-between">
                            <button type="button" className="btn-outline" onClick={onClose}>
                                <i className="bi bi-x-lg"></i> Batal
                            </button>
                            <button type="submit" className="btn-add">
                                <i className="bi bi-check-lg"></i> Simpan Data
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
