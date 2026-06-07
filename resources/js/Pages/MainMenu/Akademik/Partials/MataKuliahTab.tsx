import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

interface PaginatedMataKuliahs {
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

interface MataKuliahTabProps {
    mataKuliahs: PaginatedMataKuliahs;
    allProdis: any[];
    initialSearch: string;
    initialProdi: string;
    initialSem: string;
    initialJenis: string;
    onFiltersChange: (search: string, prodi: string, sem: string, jenis: string) => void;
    onOpenModal: () => void;
    onEdit: (mk: any) => void;
    onDetail: (mk: any) => void;
    onDelete: (mk: any) => void;
}

const jenisStyle: Record<string, string> = {
    Wajib: 'bp-blue',
    Pilihan: 'bp-teal',
    Praktikum: 'bp-purple',
};

const statusStyle: Record<string, string> = {
    Aktif: 'bp-green',
    Nonaktif: 'bp-rose',
};

export default function MataKuliahTab({
    mataKuliahs,
    allProdis,
    initialSearch,
    initialProdi,
    initialSem,
    initialJenis,
    onFiltersChange,
    onOpenModal,
    onEdit,
    onDetail,
    onDelete,
}: MataKuliahTabProps) {
    const [search, setSearch] = useState(initialSearch || '');
    const [selectedProdi, setSelectedProdi] = useState(initialProdi || '');
    const [selectedSem, setSelectedSem] = useState(initialSem || '');
    const [selectedJenis, setSelectedJenis] = useState(initialJenis || '');

    useEffect(() => {
        const handler = setTimeout(() => {
            onFiltersChange(search, selectedProdi, selectedSem, selectedJenis);
        }, 400);
        return () => clearTimeout(handler);
    }, [search, selectedProdi, selectedSem, selectedJenis]);

    const getFilteredLinks = () => {
        const links = mataKuliahs.links;
        if (!links || links.length <= 10) return links || [];

        const current = mataKuliahs.current_page;
        const last = mataKuliahs.last_page;
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

    return (
        <div className="tab-panel active">
            <div className="card-custom">
                {/* Filter bar */}
                <div className="filter-bar mb-4">
                    <div className="fi-wrap flex-1 min-w-[200px]">
                        <i className="bi bi-search fi-icon" />
                        <input
                            className="fi w-full"
                            type="text"
                            placeholder="Cari kode/nama mata kuliah..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="fsel"
                        value={selectedProdi}
                        onChange={(e) => setSelectedProdi(e.target.value)}
                    >
                        <option value="">Semua Prodi</option>
                        {allProdis.map((p) => (
                            <option key={p.id} value={p.nama}>
                                {p.nama}
                            </option>
                        ))}
                    </select>
                    <select
                        className="fsel"
                        value={selectedSem}
                        onChange={(e) => setSelectedSem(e.target.value)}
                    >
                        <option value="">Semua Semester</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                            <option key={s} value={s.toString()}>
                                Semester {s}
                            </option>
                        ))}
                    </select>
                    <select
                        className="fsel"
                        value={selectedJenis}
                        onChange={(e) => setSelectedJenis(e.target.value)}
                    >
                        <option value="">Semua Jenis</option>
                        <option value="Wajib">Wajib</option>
                        <option value="Pilihan">Pilihan</option>
                        <option value="Praktikum">Praktikum</option>
                    </select>
                    <button className="btn-add cursor-pointer" onClick={onOpenModal}>
                        <i className="bi bi-journal-plus" /> Tambah MK
                    </button>
                    <button className="btn-outline cursor-pointer">
                        <i className="bi bi-download" /> Export
                    </button>
                </div>

                {/* Table */}
                <div className="tbl-wrap" style={{ padding: '0 20px 0' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Kode MK</th>
                                <th>Nama Mata Kuliah</th>
                                <th>Prodi</th>
                                <th>SKS</th>
                                <th>Semester</th>
                                <th>Jenis</th>
                                <th>Prasyarat</th>
                                <th>Dosen</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(mataKuliahs.data || []).length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-8 text-slate-400">
                                        Tidak ada data mata kuliah yang sesuai filter.
                                    </td>
                                </tr>
                            ) : (
                                mataKuliahs.data.map((m) => (
                                    <tr key={m.kode}>
                                        <td>
                                            <span style={{ fontFamily: 'monospace', fontSize: '.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                                                {m.kode}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 700, fontSize: '.82rem' }} className="text-slate-800 dark:text-slate-200">
                                                {m.nama}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '.72rem' }} className="text-slate-500 dark:text-slate-400">
                                                {m.prodi?.nama || '-'}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: "'Playfair Display', serif", fontSize: '.95rem' }}>
                                                {m.sks}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className="badge-pill bp-indigo">Sem {m.sem}</span>
                                        </td>
                                        <td>
                                            <span className={`badge-pill ${jenisStyle[m.jenis] ?? 'bp-gray'}`}>
                                                {m.jenis}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '.75rem', fontFamily: 'monospace' }} className="text-slate-500 dark:text-slate-400">
                                                {m.prasyarat || '-'}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '.75rem' }} className="text-slate-800 dark:text-slate-200">
                                                {m.dosen_nama || '-'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge-pill ${statusStyle[m.status] ?? 'bp-gray'}`}>
                                                {m.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <button className="btn-icon bi-edit" title="Edit" onClick={() => onEdit(m)}>
                                                    <i className="bi bi-pencil" />
                                                </button>
                                                <button className="btn-icon bi-detail" title="Detail" onClick={() => onDetail(m)}>
                                                    <i className="bi bi-eye" />
                                                </button>
                                                <button className="btn-icon bi-del" title="Hapus" onClick={() => onDelete(m)}>
                                                    <i className="bi bi-trash" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {mataKuliahs.last_page > 1 && (
                    <div className="pagi border-t border-slate-100 dark:border-slate-800">
                        <div className="pagi-info">
                            Menampilkan <strong>{mataKuliahs.from || 0}–{mataKuliahs.to || 0}</strong> dari <strong>{mataKuliahs.total}</strong> mata kuliah
                        </div>
                        <div className="pagi-btns">
                            {getFilteredLinks().map((link, idx) => {
                                if (!link.url) {
                                    return (
                                        <span 
                                            key={idx} 
                                            className="pagi-btn opacity-50 cursor-not-allowed pointer-events-none"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                }
                                return (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        className={`pagi-btn ${link.active ? 'active' : ''}`}
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
        </div>
    );
}
