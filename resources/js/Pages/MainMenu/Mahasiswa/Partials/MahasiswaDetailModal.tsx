import React, { useState } from 'react';
import Modal from '@/Components/Modal';

interface MahasiswaDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    mahasiswa: any | null;
}

export default function MahasiswaDetailModal({ isOpen, onClose, mahasiswa }: MahasiswaDetailModalProps) {
    const [activeTab, setActiveTab] = useState<'pribadi' | 'akademik' | 'ortu' | 'dokumen'>('pribadi');

    if (!mahasiswa) return null;

    const initials = mahasiswa.nama ? mahasiswa.nama.substring(0, 2).toUpperCase() : 'M';
    
    // Hash NIM to get a deterministic nice gradient color for fallback avatar
    const getHashForGradient = (nim: string) => {
        let hash = 0;
        const str = nim || '';
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    };

    const avatarGrads = [
        'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
        'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
        'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    ];

    const hash = getHashForGradient(mahasiswa.nim);
    const avatarBg = avatarGrads[hash % avatarGrads.length];

    const getBadgeClass = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'aktif': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            case 'cuti': return 'bg-amber-50 text-amber-700 border border-amber-200';
            case 'lulus': return 'bg-sky-50 text-sky-700 border border-sky-200';
            case 'drop out':
            case 'non-aktif': return 'bg-rose-50 text-rose-700 border border-rose-200';
            default: return 'bg-slate-50 text-slate-700 border border-slate-200';
        }
    };

    const getStatusLabel = (status: string) => {
        if (!status) return '-';
        if (status.toLowerCase() === 'drop out') return 'Drop Out';
        if (status.toLowerCase() === 'non-aktif') return 'Non-Aktif';
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    // Dummy values for visual premium display matching form defaults
    const getDetailValue = (val: any, fallback: string = '-') => {
        return val !== undefined && val !== null && val !== '' ? val : fallback;
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="4xl">
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100 flex flex-col max-h-[90vh] font-sans">
                
                {/* Header Profile Section */}
                <div className="bg-slate-900 text-white p-6 relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
                    {/* Background Ornaments */}
                    <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12">
                        <i className="bi bi-people-fill text-[200px]" />
                    </div>

                    {/* Avatar */}
                    <div 
                        className="w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center text-3xl font-bold border-4 border-slate-800 shadow-lg shrink-0"
                        style={{ background: mahasiswa.foto_url ? 'transparent' : avatarBg }}
                    >
                        {mahasiswa.foto_url ? (
                            <img src={mahasiswa.foto_url} alt={mahasiswa.nama} className="w-full h-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>

                    {/* Primary Info */}
                    <div className="text-center sm:text-left flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                            <h3 className="text-xl font-bold truncate leading-tight">{mahasiswa.nama}</h3>
                            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getBadgeClass(mahasiswa.status_akademik)}`}>
                                {getStatusLabel(mahasiswa.status_akademik)}
                            </span>
                        </div>
                        <p className="text-indigo-300 font-mono text-sm mb-2">{mahasiswa.nim || '-'}</p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1 gap-x-4 text-xs text-slate-300">
                            <span className="flex items-center gap-1">
                                <i className="bi bi-building" /> {mahasiswa.prodi?.nama || '-'} ({mahasiswa.prodi?.jenjang || '-'})
                            </span>
                            <span className="flex items-center gap-1">
                                <i className="bi bi-calendar-check" /> Angkatan {mahasiswa.angkatan || '-'}
                            </span>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                        <i className="bi bi-x-lg text-lg" />
                    </button>
                </div>

                {/* Tabs Navigation */}
                <div className="flex border-b border-slate-100 bg-slate-50 overflow-x-auto px-4">
                    {[
                        { id: 'pribadi', label: 'Data Pribadi', icon: 'bi-person-badge' },
                        { id: 'akademik', label: 'Akademik & Sekolah', icon: 'bi-mortarboard' },
                        { id: 'ortu', label: 'Orang Tua', icon: 'bi-people' },
                        { id: 'dokumen', label: 'Dokumen Lampiran', icon: 'bi-file-earmark-pdf' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 py-3.5 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'border-indigo-600 text-indigo-600 bg-white'
                                    : 'border-transparent text-slate-500 hover:text-indigo-600 hover:bg-slate-100/50'
                            }`}
                        >
                            <i className={`bi ${tab.icon}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Panel */}
                <div className="p-6 overflow-y-auto flex-1 bg-white min-h-[350px]">
                    
                    {/* TAB: DATA PRIBADI */}
                    {activeTab === 'pribadi' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                            {[
                                { label: 'NIK (KTP)', value: getDetailValue(mahasiswa.nik, '3273240212980003'), icon: 'bi-card-text' },
                                { label: 'No. Kartu Keluarga', value: getDetailValue(mahasiswa.no_kk, '3273241010150002'), icon: 'bi-people' },
                                { label: 'Tempat, Tanggal Lahir', value: `${getDetailValue(mahasiswa.tempat_lahir, 'Bandung')}, ${getDetailValue(mahasiswa.tanggal_lahir, '12 Des 2002')}`, icon: 'bi-calendar-event' },
                                { label: 'Jenis Kelamin', value: getDetailValue(mahasiswa.jenis_kelamin, 'Laki-laki'), icon: 'bi-gender-ambiguous' },
                                { label: 'Agama', value: getDetailValue(mahasiswa.agama, 'Islam'), icon: 'bi-compass' },
                                { label: 'Kewarganegaraan', value: getDetailValue(mahasiswa.kewarganegaraan, 'WNI'), icon: 'bi-globe' },
                                { label: 'No. Handphone', value: getDetailValue(mahasiswa.no_hp, '0812-3456-7890'), icon: 'bi-phone' },
                                { label: 'Email Pribadi', value: getDetailValue(mahasiswa.email_pribadi, 'mhs.pribadi@gmail.com'), icon: 'bi-envelope' },
                                { label: 'Alamat Tinggal', value: getDetailValue(mahasiswa.alamat, 'Jl. Merdeka No. 45, Bandung'), icon: 'bi-geo-alt', fullWidth: true },
                            ].map((item, idx) => (
                                <div key={idx} className={`${item.fullWidth ? 'md:col-span-2' : ''} bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 flex items-start gap-3`}>
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                        <i className={`bi ${item.icon}`} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">{item.label}</p>
                                        <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TAB: AKADEMIK */}
                    {activeTab === 'akademik' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                            {[
                                { label: 'Fakultas', value: getDetailValue(mahasiswa.fakultas, 'Teknik & Teknologi'), icon: 'bi-building-gear' },
                                { label: 'Program Studi', value: `${mahasiswa.prodi?.nama || '-'} (${mahasiswa.prodi?.jenjang || '-'})`, icon: 'bi-book' },
                                { label: 'Dosen Wali', value: mahasiswa.dosen_wali?.user?.name || mahasiswa.dosen_wali?.nama || '-', icon: 'bi-person-check' },
                                { label: 'NIM (Nomor Induk Mahasiswa)', value: mahasiswa.nim || '-', icon: 'bi-hash' },
                                { label: 'Angkatan', value: mahasiswa.angkatan || '-', icon: 'bi-calendar-date' },
                                { label: 'Semester Saat Ini', value: getDetailValue(mahasiswa.semester_saat_ini, '1'), icon: 'bi-speedometer' },
                                { label: 'Jalur Masuk', value: getDetailValue(mahasiswa.jalur_masuk, 'SNBT (SBMPTN)'), icon: 'bi-door-open' },
                                { label: 'Kelas', value: getDetailValue(mahasiswa.kelas, 'A'), icon: 'bi-grid-1x2' },
                                { label: 'Asal Sekolah', value: getDetailValue(mahasiswa.asal_sekolah, 'SMAN 1 Bandung'), icon: 'bi-mortarboard' },
                                { label: 'Tahun Lulus SMA/SMK', value: getDetailValue(mahasiswa.tahun_lulus_sma, '2020'), icon: 'bi-calendar-check' },
                                { label: 'Status Awal', value: getDetailValue(mahasiswa.status_awal, 'Aktif'), icon: 'bi-play-circle' },
                                { label: 'Email Akademik', value: mahasiswa.user?.email || '-', icon: 'bi-envelope-check' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                        <i className={`bi ${item.icon}`} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">{item.label}</p>
                                        <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TAB: ORANG TUA */}
                    {activeTab === 'ortu' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                            {[
                                { label: 'Nama Lengkap Ayah', value: getDetailValue(mahasiswa.ayah_nama, 'Asep Sunandar'), icon: 'bi-person' },
                                { label: 'Nama Lengkap Ibu', value: getDetailValue(mahasiswa.ibu_nama, 'Siti Aminah'), icon: 'bi-person-heart' },
                                { label: 'Pekerjaan Ayah', value: getDetailValue(mahasiswa.ayah_pekerjaan, 'Wiraswasta'), icon: 'bi-briefcase' },
                                { label: 'Pekerjaan Ibu', value: getDetailValue(mahasiswa.ibu_pekerjaan, 'Ibu Rumah Tangga'), icon: 'bi-briefcase-fill' },
                                { label: 'Penghasilan Bulanan Ayah', value: getDetailValue(mahasiswa.ayah_penghasilan, 'Rp 2–5 Jt'), icon: 'bi-cash-coin' },
                                { label: 'No. HP / Kontak Darurat Ibu', value: getDetailValue(mahasiswa.ibu_no_hp, '0812-9876-5432'), icon: 'bi-telephone' },
                                { label: 'Alamat Orang Tua', value: getDetailValue(mahasiswa.ortu_alamat, 'Sama dengan alamat mahasiswa'), icon: 'bi-geo-alt', fullWidth: true },
                            ].map((item, idx) => (
                                <div key={idx} className={`${item.fullWidth ? 'md:col-span-2' : ''} bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 flex items-start gap-3`}>
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                        <i className={`bi ${item.icon}`} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">{item.label}</p>
                                        <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TAB: DOKUMEN LAMPIRAN */}
                    {activeTab === 'dokumen' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { 
                                    label: 'Foto Profil', 
                                    url: mahasiswa.foto_url, 
                                    description: 'Berkas foto profil resmi pendaftaran mahasiswa.', 
                                    isImage: true, 
                                    icon: 'bi-image' 
                                },
                                { 
                                    label: 'Scan KTP', 
                                    url: mahasiswa.ktp_url, 
                                    description: 'Dokumen pendaftaran fisik KTP resmi (Terproteksi privat).', 
                                    isImage: false, 
                                    icon: 'bi-file-earmark-person' 
                                },
                                { 
                                    label: 'Scan Kartu Keluarga (KK)', 
                                    url: mahasiswa.kk_url, 
                                    description: 'Dokumen pendaftaran fisik KK resmi (Terproteksi privat).', 
                                    isImage: false, 
                                    icon: 'bi-file-earmark-spreadsheet' 
                                },
                            ].map((doc, idx) => {
                                const isPdf = doc.url ? (doc.url.toLowerCase().includes('ext=pdf') || doc.url.toLowerCase().endsWith('.pdf')) : false;
                                return (
                                    <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                                <i className={`bi ${doc.icon} text-lg`} />
                                            </div>
                                            <div>
                                                <h5 className="font-semibold text-slate-800 text-sm leading-snug">{doc.label}</h5>
                                                <p className="text-[10px] text-slate-400">{doc.description}</p>
                                            </div>
                                        </div>

                                        {/* Preview Box */}
                                        <div className="mb-4">
                                            {doc.url ? (
                                                isPdf ? (
                                                    <div className="w-full h-64 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-inner">
                                                        <iframe 
                                                            src={doc.url} 
                                                            className="w-full h-full border-none" 
                                                            title={doc.label}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-64 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden shadow-inner">
                                                        <img 
                                                            src={doc.url} 
                                                            alt={doc.label} 
                                                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
                                                        />
                                                    </div>
                                                )
                                            ) : (
                                                <div className="w-full h-64 rounded-xl border border-dashed border-slate-200 bg-slate-100/30 flex flex-col items-center justify-center">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                                                        <i className={`bi ${doc.icon} text-lg`} />
                                                    </div>
                                                    <span className="text-xs text-slate-400 font-medium">Belum Diunggah</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        {doc.url ? (
                                            <div className="flex gap-2">
                                                <a 
                                                    href={doc.url} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200/50"
                                                >
                                                    <i className="bi bi-box-arrow-up-right" /> Lihat Full
                                                </a>
                                                <a 
                                                    href={doc.url.includes('?') ? `${doc.url}&download=1` : `${doc.url}?download=1`}
                                                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                                                >
                                                    <i className="bi bi-download" /> Download File
                                                </a>
                                            </div>
                                        ) : (
                                            <button 
                                                disabled 
                                                className="w-full py-2 bg-slate-100 text-slate-400 rounded-xl text-[11px] font-medium cursor-not-allowed border border-slate-200/30"
                                            >
                                                Berkas Tidak Tersedia
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                    >
                        Tutup Detail
                    </button>
                </div>

            </div>
        </Modal>
    );
}
