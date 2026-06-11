import React, { useEffect, useRef, useState } from 'react';
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
    onError,
}: StafFormModalProps) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<{
        nama: string;
        email: string;
        role: string;
        password: string;
        password_confirmation: string;
        foto: File | null;
    }>({
        nama: '',
        email: '',
        role: 'admin',
        password: '',
        password_confirmation: '',
        foto: null,
    });

    const [showPassword, setShowPassword]             = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [previewUrl, setPreviewUrl]                  = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (staf) {
            setData({
                nama: staf.nama || '',
                email: staf.email || '',
                role: staf.role || 'admin',
                password: '',
                password_confirmation: '',
                foto: null,
            });
            // Show existing photo if available
            setPreviewUrl(staf.foto_url || null);
        } else {
            reset();
            setPreviewUrl(null);
        }
        clearErrors();
        setShowPassword(false);
        setShowConfirmPassword(false);
    }, [staf, isOpen]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('foto', file);
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleRemovePhoto = () => {
        setData('foto', null);
        setPreviewUrl(staf?.foto_url || null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            forceFormData: true,
            onSuccess: () => {
                onSuccess(staf ? 'Data staf non-dosen berhasil diperbarui.' : 'Data staf non-dosen baru berhasil ditambahkan.');
                onClose();
                if (!staf) reset();
            },
            onError: () => {
                onError('Gagal menyimpan data staf. Periksa kembali inputan Anda.');
            },
        };

        if (staf) {
            put(`/dosen/staf/${staf.id}`, options);
        } else {
            post('/dosen/staf', options);
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="xl">
            <div className="modal-content" style={{ background: '#fff', border: 'none', borderRadius: '16px' }}>
                {/* Header */}
                <div className="modal-header flex justify-between items-center p-4 border-b border-gray-100">
                    <h5 className="modal-title font-poppins m-0">
                        <i className="bi bi-person-plus-fill me-2 text-primary" />
                        {staf ? 'Edit Data Staf' : 'Tambah Staf Non-Dosen Baru'}
                    </h5>
                    <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 transition border-0 bg-transparent p-1 cursor-pointer"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <i className="bi bi-x-lg" style={{ fontSize: '1.2rem' }} />
                    </button>
                </div>

                <form onSubmit={handleFormSubmit}>
                    <div className="modal-body p-6">
                        <div className="grid grid-cols-1 gap-5">

                            {/* ── Foto Profil ──────────────────────────────── */}
                            <div>
                                <label className="form-label-c">Foto Profil <span className="text-xs text-gray-400 font-normal">(opsional)</span></label>
                                <div className="flex items-center gap-4 mt-1">
                                    {/* Avatar preview */}
                                    <div
                                        className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer relative group"
                                        onClick={() => fileInputRef.current?.click()}
                                        title="Klik untuk pilih foto"
                                    >
                                        {previewUrl ? (
                                            <>
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <i className="bi bi-pencil text-white text-xl" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center">
                                                <i className="bi bi-person text-slate-300 text-3xl block" />
                                                <span className="text-[9px] text-slate-400 mt-0.5 block">Pilih Foto</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Controls */}
                                    <div className="flex flex-col gap-2 flex-1">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer w-fit"
                                        >
                                            <i className="bi bi-image" /> Pilih Foto
                                        </button>

                                        {data.foto && (
                                            <button
                                                type="button"
                                                onClick={handleRemovePhoto}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-100 text-xs font-semibold text-rose-500 hover:bg-rose-50 transition cursor-pointer w-fit"
                                            >
                                                <i className="bi bi-trash" /> Hapus
                                            </button>
                                        )}

                                        <p className="text-[10px] text-slate-400 leading-relaxed">
                                            Mendukung PNG, JPG, JPEG, atau WEBP.<br />
                                            Maksimal 2MB. Format akan dikonversi otomatis ke WebP.
                                        </p>
                                    </div>
                                </div>

                                {/* Hidden file input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    className="hidden"
                                    onChange={handlePhotoChange}
                                />
                                {errors.foto && <p className="text-rose-500 text-xs mt-1">{errors.foto}</p>}
                            </div>

                            {/* ── Nama Lengkap ──────────────────────────────── */}
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

                            {/* ── Email ──────────────────────────────── */}
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

                            {/* ── Divisi / Role ──────────────────────────────── */}
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
                                    <option value="akademik">Akademik &amp; Registrar</option>
                                    <option value="keuangan">Keuangan</option>
                                </select>
                                {errors.role && <p className="text-rose-500 text-xs mt-1">{errors.role}</p>}
                            </div>

                            {/* ── Password ──────────────────────────────── */}
                            <div>
                                <label className="form-label-c">
                                    Password {staf && <span className="text-xs text-gray-400 font-normal">(kosongkan jika tidak ingin diubah)</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={`form-ctrl pr-10 ${errors.password ? 'border-rose-500' : ''}`}
                                        placeholder={staf ? '••••••••' : 'Minimal 8 karakter'}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        required={!staf}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setShowPassword(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                                    >
                                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                                    </button>
                                </div>
                                {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            {/* ── Konfirmasi Password ──────────────────────────────── */}
                            <div>
                                <label className="form-label-c">
                                    Konfirmasi Password {staf && <span className="text-xs text-gray-400 font-normal">(kosongkan jika tidak ingin diubah)</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className={`form-ctrl pr-10 ${errors.password_confirmation ? 'border-rose-500' : ''}`}
                                        placeholder="Ulangi password"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        required={!staf}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setShowConfirmPassword(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                                    >
                                        <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-rose-500 text-xs mt-1">{errors.password_confirmation}</p>
                                )}
                                {/* Live match hint */}
                                {data.password && data.password_confirmation && (
                                    <p className={`text-xs mt-1 flex items-center gap-1 ${data.password === data.password_confirmation ? 'text-emerald-500' : 'text-rose-400'}`}>
                                        <i className={`bi ${data.password === data.password_confirmation ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`} />
                                        {data.password === data.password_confirmation ? 'Password cocok' : 'Password tidak cocok'}
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer flex justify-between p-4 border-t border-gray-100">
                        <button type="button" className="btn-outline cursor-pointer" onClick={onClose}>
                            <i className="bi bi-x-lg" /> Batal
                        </button>
                        <button
                            type="submit"
                            className="btn-add flex items-center gap-2 cursor-pointer"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm animate-spin inline-block w-4 h-4 border-2 rounded-full border-r-transparent"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    Sedang Proses...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-lg" /> Simpan Data
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
