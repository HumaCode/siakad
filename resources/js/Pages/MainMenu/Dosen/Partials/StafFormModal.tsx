import React, { useEffect } from 'react';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';

interface StafFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    staf: any | null;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export default function StafFormModal({
    isOpen,
    onClose,
    staf,
    onSuccess,
    onError
}: StafFormModalProps) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nama: '',
        email: '',
        role: 'admin',
        password: '',
    });

    useEffect(() => {
        if (staf) {
            setData({
                nama: staf.nama || '',
                email: staf.email || '',
                role: staf.role || 'admin',
                password: '',
            });
        } else {
            reset();
        }
        clearErrors();
    }, [staf, isOpen]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (staf) {
            put(`/dosen/staf/${staf.id}`, {
                onSuccess: () => {
                    onSuccess('Data staf non-dosen berhasil diperbarui.');
                    onClose();
                },
                onError: (err) => {
                    onError('Gagal memperbarui data staf. Periksa kembali inputan Anda.');
                }
            });
        } else {
            post('/dosen/staf', {
                onSuccess: () => {
                    onSuccess('Data staf non-dosen baru berhasil ditambahkan.');
                    onClose();
                    reset();
                },
                onError: (err) => {
                    onError('Gagal menambahkan data staf. Periksa kembali inputan Anda.');
                }
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="xl">
            <div className="modal-content" style={{ background: '#fff', border: 'none', borderRadius: '16px' }}>
                <div className="modal-header flex justify-between items-center p-4 border-b border-gray-100">
                    <h5 className="modal-title font-poppins m-0">
                        <i className="bi bi-person-plus-fill me-2 text-primary"></i>
                        {staf ? 'Edit Data Staf' : 'Tambah Staf Non-Dosen Baru'}
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
                        <div className="grid grid-cols-1 gap-5">
                            {/* Nama Lengkap */}
                            <div>
                                <label className="form-label-c">Nama Lengkap</label>
                                <input
                                    type="text"
                                    className={`form-ctrl ${errors.nama ? 'border-rose-500' : ''}`}
                                    placeholder="Contoh: Budi Setiawan"
                                    value={data.nama}
                                    onChange={e => setData('nama', e.target.value)}
                                    required
                                />
                                {errors.nama && <p className="text-rose-500 text-xs mt-1">{errors.nama}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="form-label-c">Email</label>
                                <input
                                    type="email"
                                    className={`form-ctrl ${errors.email ? 'border-rose-500' : ''}`}
                                    placeholder="staff@universitas.ac.id"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Role / Divisi */}
                            <div>
                                <label className="form-label-c">Divisi / Role Akses</label>
                                <select
                                    className={`form-ctrl ${errors.role ? 'border-rose-500' : ''}`}
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                    required
                                >
                                    <option value="super_admin">Super Administrator (IT)</option>
                                    <option value="dev">Developer (IT)</option>
                                    <option value="admin">Administrator / Staf IT</option>
                                    <option value="akademik">Akademik & Registrar</option>
                                    <option value="keuangan">Keuangan</option>
                                </select>
                                {errors.role && <p className="text-rose-500 text-xs mt-1">{errors.role}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="form-label-c">
                                    Password {staf && <span className="text-xs text-gray-400 font-normal">(kosongkan jika tidak ingin diubah)</span>}
                                </label>
                                <input
                                    type="password"
                                    className={`form-ctrl ${errors.password ? 'border-rose-500' : ''}`}
                                    placeholder={staf ? '••••••••' : 'Minimal 8 karakter'}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    required={!staf}
                                />
                                {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password}</p>}
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
