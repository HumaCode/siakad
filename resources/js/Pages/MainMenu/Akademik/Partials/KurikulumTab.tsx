import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

interface PaginatedProdis {
    data: any[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface KurikulumItem {
    id: number;
    prodi: string;
    jenjang: string;
    tahun: number;
    akreditasi: string;
    status: 'Aktif' | 'Revisi' | 'Tidak Aktif';
    deskripsi: string;
    sks: number;
    mkCount: number;
    semesters: number;
    kaprodi: string;
    icon: string;
    bgIcon: string;
    colorIcon: string;
    classPrefix: string;
}

interface KurikulumTabProps {
    fakultas: any[];
    prodis: PaginatedProdis;
    initialSearch: string;
    initialFakultas: string;
    initialTahun: string;
    onFiltersChange: (search: string, fakultas: string, tahun: string) => void;
    onOpenModal: (prodi?: any) => void;
    onDelete: (prodi: any) => void;
}

const getProdiStylePreset = (kode: string) => {
    switch (kode.toUpperCase()) {
        case 'IF':
            return {
                icon: 'bi-cpu-fill',
                bgIcon: '#e8f0fe',
                colorIcon: '#1a56db',
                classPrefix: 'kc-ti',
                deskripsi: 'Kurikulum berbasis KKNI Level 6, menekankan pada rekayasa perangkat lunak, kecerdasan buatan, dan keamanan siber.',
                sks: 148,
                mkCount: 62,
                semesters: 8,
                akreditasi: 'Unggul',
                tahun: 2023,
                status: 'Aktif' as const
            };
        case 'SI':
            return {
                icon: 'bi-database-fill',
                bgIcon: 'var(--teal-light)',
                colorIcon: 'var(--teal)',
                classPrefix: 'kc-si',
                deskripsi: 'Fokus pada perancangan dan pengelolaan sistem informasi bisnis, analitik data, dan transformasi digital.',
                sks: 144,
                mkCount: 58,
                semesters: 8,
                akreditasi: 'Unggul',
                tahun: 2022,
                status: 'Aktif' as const
            };
        case 'MAT':
            return {
                icon: 'bi-calculator-fill',
                bgIcon: 'var(--purple-light)',
                colorIcon: 'var(--purple)',
                classPrefix: 'kc-hk',
                deskripsi: 'Mata kuliah dasar matematika murni dan aplikasi terapan komputer, sains data, serta optimisasi sistem.',
                sks: 144,
                mkCount: 52,
                semesters: 8,
                akreditasi: 'A',
                tahun: 2023,
                status: 'Aktif' as const
            };
        case 'MAN':
            return {
                icon: 'bi-briefcase-fill',
                bgIcon: 'var(--accent-light)',
                colorIcon: '#b45309',
                classPrefix: 'kc-mb',
                deskripsi: 'Mengembangkan kompetensi manajemen strategis, kewirausahaan, pemasaran, dan keuangan bisnis modern.',
                sks: 144,
                mkCount: 55,
                semesters: 8,
                akreditasi: 'A',
                tahun: 2023,
                status: 'Aktif' as const
            };
        default:
            return {
                icon: 'bi-journal-code',
                bgIcon: '#f1f5f9',
                colorIcon: '#64748b',
                classPrefix: 'kc-ti',
                deskripsi: 'Program studi akademik tingkat tinggi dengan fokus keilmuan mendalam serta kesiapan industri terapan.',
                sks: 144,
                mkCount: 50,
                semesters: 8,
                akreditasi: 'B',
                tahun: 2024,
                status: 'Aktif' as const
            };
    }
};

export default function KurikulumTab({ 
    fakultas, 
    prodis, 
    initialSearch, 
    initialFakultas, 
    initialTahun, 
    onFiltersChange, 
    onOpenModal, 
    onDelete 
}: KurikulumTabProps) {
    const [search, setSearch] = useState(initialSearch || '');
    const [selectedFakultas, setSelectedFakultas] = useState(initialFakultas || 'Semua Fakultas');
    const [selectedTahun, setSelectedTahun] = useState(initialTahun || 'Semua Tahun');

    useEffect(() => {
        const handler = setTimeout(() => {
            onFiltersChange(search, selectedFakultas, selectedTahun);
        }, 400);
        return () => clearTimeout(handler);
    }, [search, selectedFakultas, selectedTahun]);

    const kurikulumList = (prodis.data || []).map((p: any) => {
        const preset = getProdiStylePreset(p.kode);
        return {
            ...preset,
            id: p.id,
            kode: p.kode,
            nama: p.nama,
            prodi: p.nama,
            jenjang: p.jenjang,
            kaprodi: p.kaprodi || 'Belum Ditentukan',
            fakultas_id: p.fakultas_id,
            fakultas_nama: p.fakultas?.nama || '',
            deskripsi: p.deskripsi || preset.deskripsi,
            sks: p.sks || preset.sks,
            semesters: p.lama_studi || preset.semesters,
            akreditasi: p.akreditasi || preset.akreditasi,
            tahun: p.tahun || preset.tahun,
            status: p.status || preset.status || 'Aktif',
        };
    });

    const filteredKurikulum = kurikulumList;

    const getFilteredLinks = () => {
        const links = prodis.links;
        if (!links || links.length <= 10) return links || [];

        const current = prodis.current_page;
        const last = prodis.last_page;
        const delta = 2;

        const range = [];
        for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
            range.push(i);
        }

        if (current - delta > 2) {
            range.unshift('...');
        }
        if (current + delta < last - 1) {
            range.push('...');
        }

        range.unshift(1);
        if (last > 1) {
            range.push(last);
        }

        const filtered = [];
        filtered.push(links[0]); // Previous link

        range.forEach((page) => {
            if (page === '...') {
                filtered.push({ url: null, label: '...', active: false });
            } else {
                const found = links.find(l => l.label === page.toString());
                if (found) filtered.push(found);
            }
        });

        filtered.push(links[links.length - 1]); // Next link
        return filtered;
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Aktif': return 'bp-blue';
            case 'Revisi': return 'bp-purple';
            default: return 'bp-gray';
        }
    };

    return (
        <div className="tab-panel active">
            {/* Filter */}
            <div className="card-custom mb-6 p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="fi-wrap flex-1 min-w-[200px]">
                        <i className="bi bi-search fi-icon" />
                        <input
                            className="fi w-full"
                            type="text"
                            placeholder="Cari program studi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="fsel"
                        value={selectedFakultas}
                        onChange={(e) => setSelectedFakultas(e.target.value)}
                    >
                        <option>Semua Fakultas</option>
                        {fakultas.map(f => (
                            <option key={f.id}>{f.nama}</option>
                        ))}
                    </select>
                    <select
                        className="fsel"
                        value={selectedTahun}
                        onChange={(e) => setSelectedTahun(e.target.value)}
                    >
                        <option>Semua Tahun</option>
                        <option>2024</option>
                        <option>2023</option>
                        <option>2022</option>
                        <option>2021</option>
                    </select>
                    <button className="btn-add cursor-pointer" onClick={onOpenModal}>
                        <i className="bi bi-plus-lg" /> Tambah Prodi
                    </button>
                    <button className="btn-outline cursor-pointer">
                        <i className="bi bi-download" /> Export
                    </button>
                </div>
                <div className="mt-3 px-1">
                    <small className="text-xs text-slate-400">
                        Menampilkan {filteredKurikulum.length} dari {kurikulumList.length} program studi
                    </small>
                </div>
            </div>

            {/* Kurikulum Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKurikulum.map((item) => (
                    <div key={item.id} className={`kurikulum-card ${item.classPrefix} ${item.status === 'Tidak Aktif' ? 'kc-tidak-aktif' : ''}`}>
                        <div className="kc-header">
                            <div className="flex items-center gap-3 flex-1">
                                <div
                                    className="kc-icon"
                                    style={{ backgroundColor: item.bgIcon, color: item.colorIcon }}
                                >
                                    <i className={`bi ${item.icon}`} />
                                </div>
                                <div>
                                    <div className="kc-title">{item.prodi}</div>
                                    <div className="kc-sub">
                                        {item.jenjang} · Kurikulum {item.tahun} · Akreditasi{' '}
                                        <strong className="text-amber-500">{item.akreditasi}</strong>
                                    </div>
                                </div>
                            </div>
                            <span className={`badge-pill ${getStatusBadgeClass(item.status)}`}>
                                {item.status}
                            </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                            {item.deskripsi}
                        </div>
                        <div className="kc-stats">
                            <div className="kcs-item">
                                <span className="kcs-num text-blue-600 dark:text-blue-400">{item.sks}</span>
                                <span className="kcs-lbl">SKS Total</span>
                            </div>
                            <div className="kcs-item">
                                <span className="kcs-num text-teal-600 dark:text-teal-400">{item.mkCount}</span>
                                <span className="kcs-lbl">Mata Kuliah</span>
                            </div>
                            <div className="kcs-item">
                                <span className="kcs-num text-amber-600 dark:text-amber-400">{item.semesters}</span>
                                <span className="kcs-lbl">Semester</span>
                            </div>
                        </div>
                        <div className="kc-footer">
                            <div className="text-xs text-slate-500">
                                Kaprodi: <strong className="text-slate-700 dark:text-slate-300">{item.kaprodi}</strong>
                            </div>
                            <div className="flex gap-1.5">
                                <button className="btn-icon bi-detail" title="Detail kurikulum">
                                    <i className="bi bi-eye" />
                                </button>
                                <button className="btn-icon bi-edit" title="Edit" onClick={() => onOpenModal(item)}>
                                    <i className="bi bi-pencil" />
                                </button>
                                <button className="btn-icon bi-del" title="Hapus" onClick={() => onDelete(item)}>
                                    <i className="bi bi-trash" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Links */}
            {prodis.last_page > 1 && (
                <div className="flex items-center justify-between mt-6 flex-wrap gap-4 px-2">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        Menampilkan <strong>{prodis.from || 0}–{prodis.to || 0}</strong> dari <strong>{prodis.total}</strong> program studi
                    </div>
                    <div className="flex gap-1">
                        {getFilteredLinks().map((link, idx) => {
                            if (!link.url) {
                                return (
                                    <span 
                                        key={idx} 
                                        className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-300 dark:text-slate-600 pointer-events-none"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            }
                            return (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all ${
                                        link.active 
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                            : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                                    preserveState
                                    preserveScroll
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
