import React, { useState } from 'react';

interface ProdiItem {
    id: string;
    nama: string;
}

interface KelasItem {
    id: string;
    nama: string;
    prodi_id: string;
    status: string;
}

interface KelasTabProps {
    allKelas: KelasItem[];
    allProdis: ProdiItem[];
    onOpenModal: (kelas?: KelasItem | null) => void;
    onDelete: (kelas: KelasItem) => void;
}

const statusStyle: Record<string, string> = {
    Aktif: 'bp-green',
    Nonaktif: 'bp-gray',
};

export default function KelasTab({ allKelas = [], allProdis = [], onOpenModal, onDelete }: KelasTabProps) {
    const [search, setSearch] = useState('');
    const [prodiFilter, setProdiFilter] = useState('');

    const filteredKelas = allKelas.filter(k => {
        const matchesSearch = k.nama.toLowerCase().includes(search.toLowerCase());
        const matchesProdi = prodiFilter === '' || k.prodi_id === prodiFilter;
        return matchesSearch && matchesProdi;
    });

    const getProdiName = (prodiId: string) => {
        const p = allProdis.find(item => item.id === prodiId);
        return p ? p.nama : 'Tidak diketahui';
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
                            placeholder="Cari kelas..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="fsel"
                        value={prodiFilter}
                        onChange={(e) => setProdiFilter(e.target.value)}
                    >
                        <option value="">Semua Program Studi</option>
                        {allProdis.map(p => (
                            <option key={p.id} value={p.id}>{p.nama}</option>
                        ))}
                    </select>
                    <button className="btn-add cursor-pointer animate-fade-in" onClick={() => onOpenModal(null)}>
                        <i className="bi bi-plus-lg" /> Tambah Kelas
                    </button>
                </div>

                {/* Table */}
                <div className="tbl-wrap" style={{ padding: '0 20px 0' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>No</th>
                                <th>Nama Kelas</th>
                                <th>Program Studi</th>
                                <th>Status</th>
                                <th style={{ width: '150px', textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredKelas.map((k, index) => {
                                const isNonaktif = k.status === 'Nonaktif';
                                return (
                                    <tr 
                                        key={k.id}
                                        style={isNonaktif ? { opacity: 0.5, filter: 'grayscale(1)' } : undefined}
                                    >
                                        <td>
                                            <span style={{ fontWeight: 600, fontSize: '.8rem', color: 'var(--text-muted)' }}>
                                                {index + 1}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 700, fontSize: '.82rem' }} className="text-slate-800 dark:text-slate-200">
                                                {k.nama}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '.75rem' }} className="text-slate-500 dark:text-slate-400">
                                                {getProdiName(k.prodi_id)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge-pill ${statusStyle[k.status] ?? 'bp-gray'}`}>
                                                <i className={`bi ${k.status === 'Aktif' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`} />
                                                {k.status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                                <button className="btn-icon bi-edit" title="Edit Kelas" onClick={() => onOpenModal(k)}>
                                                    <i className="bi bi-pencil" />
                                                </button>
                                                <button className="btn-icon bi-del" title="Hapus Kelas" onClick={() => onDelete(k)}>
                                                    <i className="bi bi-trash" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredKelas.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-slate-400 text-xs">
                                        Tidak ada data kelas yang cocok.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
