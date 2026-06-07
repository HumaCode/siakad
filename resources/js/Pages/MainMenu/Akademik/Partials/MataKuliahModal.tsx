import React, { useState, useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { storeMataKuliah, updateMataKuliah } from '@/actions/App/Http/Controllers/MainMenu/AkademikController';

interface DosenOption {
    id: string;
    nama: string;
    nidn: string;
}

interface ProdiOption {
    id: string;
    nama: string;
}

interface MataKuliahModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (msg: string) => void;
    dosens: DosenOption[];
    prodis: ProdiOption[];
    mataKuliah?: any | null;
}

export default function MataKuliahModal({ 
    isOpen, 
    onClose, 
    onSave, 
    dosens, 
    prodis, 
    mataKuliah 
}: MataKuliahModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        prodi_id: '',
        kode: '',
        nama: '',
        sks_teori: 2,
        sks_praktik: 1,
        sem: 1,
        jenis: 'Wajib',
        prasyarat: '',
        dosen_id: '',
        deskripsi: '',
        status: 'Aktif',
    });

    const [isDosenDropdownOpen, setIsDosenDropdownOpen] = useState(false);
    const [dosenSearch, setDosenSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (mataKuliah) {
                setData({
                    prodi_id: mataKuliah.prodi_id || '',
                    kode: mataKuliah.kode || '',
                    nama: mataKuliah.nama || '',
                    sks_teori: typeof mataKuliah.sks_teori !== 'undefined' ? parseInt(mataKuliah.sks_teori) : 0,
                    sks_praktik: typeof mataKuliah.sks_praktik !== 'undefined' ? parseInt(mataKuliah.sks_praktik) : 0,
                    sem: parseInt(mataKuliah.sem) || 1,
                    jenis: mataKuliah.jenis || 'Wajib',
                    prasyarat: mataKuliah.prasyarat || '',
                    dosen_id: mataKuliah.dosen_id || '',
                    deskripsi: mataKuliah.deskripsi || '',
                    status: mataKuliah.status || 'Aktif',
                });
            } else {
                setData({
                    prodi_id: prodis[0]?.id || '',
                    kode: '',
                    nama: '',
                    sks_teori: 2,
                    sks_praktik: 1,
                    sem: 1,
                    jenis: 'Wajib',
                    prasyarat: '',
                    dosen_id: '',
                    deskripsi: '',
                    status: 'Aktif',
                });
            }
        }
    }, [isOpen, mataKuliah, prodis, dosens]);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDosenDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mataKuliah) {
            put(updateMataKuliah.url(mataKuliah.id), {
                onSuccess: () => {
                    reset();
                    onSave('Mata kuliah berhasil diperbarui');
                }
            });
        } else {
            post(storeMataKuliah.url(), {
                onSuccess: () => {
                    reset();
                    onSave('Mata kuliah baru berhasil disimpan');
                }
            });
        }
    };

    const selectedDosen = dosens.find(d => d.id === data.dosen_id);
    const filteredDosens = dosens.filter(d => 
        d.nama.toLowerCase().includes(dosenSearch.toLowerCase()) || 
        d.nidn.toLowerCase().includes(dosenSearch.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                            {mataKuliah ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}
                        </h3>
                        <p className="text-[10px] text-slate-400">
                            Data mata kuliah dalam kurikulum
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
                <form onSubmit={handleSubmit} id="matakuliah-form" className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="form-label-c">Kode Mata Kuliah</label>
                            <input 
                                className={`form-ctrl font-mono ${errors.kode ? 'border-red-500' : ''}`} 
                                type="text" 
                                placeholder="cth: TI501" 
                                value={data.kode}
                                onChange={(e) => setData('kode', e.target.value)}
                                required 
                            />
                            {errors.kode && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.kode}</span>
                            )}
                        </div>
                        <div className="md:col-span-2">
                            <label className="form-label-c">Nama Mata Kuliah</label>
                            <input 
                                className={`form-ctrl ${errors.nama ? 'border-red-500' : ''}`} 
                                type="text" 
                                placeholder="cth: Algoritma & Pemrograman" 
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                required 
                            />
                            {errors.nama && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.nama}</span>
                            )}
                        </div>
                        <div>
                            <label className="form-label-c">Program Studi</label>
                            <select 
                                className={`form-ctrl ${errors.prodi_id ? 'border-red-500' : ''}`}
                                value={data.prodi_id}
                                onChange={(e) => setData('prodi_id', e.target.value)}
                                required
                            >
                                {prodis.map((p) => (
                                    <option key={p.id} value={p.id}>{p.nama}</option>
                                ))}
                            </select>
                            {errors.prodi_id && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.prodi_id}</span>
                            )}
                        </div>
                        <div>
                            <label className="form-label-c">SKS Teori</label>
                            <input 
                                className={`form-ctrl ${errors.sks_teori ? 'border-red-500' : ''}`} 
                                type="number" 
                                placeholder="2" 
                                value={data.sks_teori}
                                onChange={(e) => setData('sks_teori', parseInt(e.target.value) || 0)}
                                required 
                            />
                            {errors.sks_teori && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.sks_teori}</span>
                            )}
                        </div>
                        <div>
                            <label className="form-label-c">SKS Praktik</label>
                            <input 
                                className={`form-ctrl ${errors.sks_praktik ? 'border-red-500' : ''}`} 
                                type="number" 
                                placeholder="1" 
                                value={data.sks_praktik}
                                onChange={(e) => setData('sks_praktik', parseInt(e.target.value) || 0)}
                                required 
                            />
                            {errors.sks_praktik && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.sks_praktik}</span>
                            )}
                        </div>
                        <div>
                            <label className="form-label-c">Semester</label>
                            <select 
                                className={`form-ctrl ${errors.sem ? 'border-red-500' : ''}`}
                                value={data.sem}
                                onChange={(e) => setData('sem', parseInt(e.target.value) || 1)}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            {errors.sem && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.sem}</span>
                            )}
                        </div>
                        <div>
                            <label className="form-label-c">Jenis</label>
                            <select 
                                className={`form-ctrl ${errors.jenis ? 'border-red-500' : ''}`}
                                value={data.jenis}
                                onChange={(e) => setData('jenis', e.target.value)}
                            >
                                <option value="Wajib">Wajib</option>
                                <option value="Pilihan">Pilihan</option>
                                <option value="Praktikum">Praktikum</option>
                            </select>
                            {errors.jenis && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.jenis}</span>
                            )}
                        </div>
                        <div>
                            <label className="form-label-c">Prasyarat</label>
                            <input 
                                className={`form-ctrl font-mono ${errors.prasyarat ? 'border-red-500' : ''}`} 
                                type="text" 
                                placeholder="Kode MK prasyarat (opsional)" 
                                value={data.prasyarat}
                                onChange={(e) => setData('prasyarat', e.target.value)}
                            />
                            {errors.prasyarat && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.prasyarat}</span>
                            )}
                        </div>

                        {/* Searchable Select2 for Dosen */}
                        <div className="md:col-span-3 relative" ref={dropdownRef}>
                            <label className="form-label-c">Dosen Pengampu</label>
                            <div 
                                className={`form-ctrl flex items-center justify-between cursor-pointer select-none ${errors.dosen_id ? 'border-red-500' : ''}`}
                                onClick={() => {
                                    setIsDosenDropdownOpen(!isDosenDropdownOpen);
                                    setDosenSearch('');
                                }}
                                style={{ minHeight: '38px' }}
                            >
                                <span className={selectedDosen ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}>
                                    {selectedDosen 
                                        ? `${selectedDosen.nama} (NIDN: ${selectedDosen.nidn})` 
                                        : 'Pilih Dosen Pengampu...'}
                                </span>
                                <i className={`bi bi-chevron-${isDosenDropdownOpen ? 'up' : 'down'} text-xs text-slate-400`} />
                            </div>
                            {errors.dosen_id && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.dosen_id}</span>
                            )}

                            {isDosenDropdownOpen && (
                                <div className="absolute z-[2100] left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-60">
                                    <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                        <div className="relative flex items-center">
                                            <i className="bi bi-search absolute left-3 text-slate-400 text-xs" />
                                            <input
                                                type="text"
                                                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                                                placeholder="Cari nama atau NIDN dosen..."
                                                value={dosenSearch}
                                                onChange={(e) => setDosenSearch(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <div className="overflow-y-auto py-1">
                                        {filteredDosens.length === 0 ? (
                                            <div className="px-4 py-3 text-xs text-slate-400 text-center">
                                                Dosen tidak ditemukan
                                            </div>
                                        ) : (
                                            filteredDosens.map((d) => (
                                                <button
                                                    key={d.id}
                                                    type="button"
                                                    className={`w-full text-left px-4 py-2 text-xs flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                                                        data.dosen_id === d.id ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                                                    }`}
                                                    onClick={() => {
                                                        setData('dosen_id', d.id);
                                                        setIsDosenDropdownOpen(false);
                                                    }}
                                                >
                                                    <span>{d.nama}</span>
                                                    <span className="text-[10px] text-slate-400 font-mono">NIDN: {d.nidn}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-3">
                            <label className="form-label-c">Deskripsi Mata Kuliah</label>
                            <textarea 
                                className={`form-ctrl ${errors.deskripsi ? 'border-red-500' : ''}`} 
                                rows={2} 
                                placeholder="Deskripsi singkat capaian pembelajaran mata kuliah..." 
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                required 
                            />
                            {errors.deskripsi && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.deskripsi}</span>
                            )}
                        </div>
                        <div className="md:col-span-3">
                            <label className="form-label-c">Status Mata Kuliah</label>
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
                        form="matakuliah-form"
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
