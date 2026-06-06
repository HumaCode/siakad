import React, { useState } from 'react';

interface MKItem {
    kode: string;
    nama: string;
    prodi: string;
    sks: number;
    sem: number;
    jenis: 'Wajib' | 'Pilihan' | 'Praktikum';
    prasyarat: string;
    dosen: string;
    status: 'Aktif' | 'Nonaktif';
}

interface MataKuliahTabProps {
    onOpenModal: () => void;
}

const mkData: MKItem[] = [
    { kode: 'TI501', nama: 'Algoritma & Pemrograman', prodi: 'Teknik Informatika', sks: 3, sem: 5, jenis: 'Wajib', prasyarat: 'TI302', dosen: 'Dr. Budi S.', status: 'Aktif' },
    { kode: 'TI502', nama: 'Basis Data Lanjut', prodi: 'Teknik Informatika', sks: 3, sem: 5, jenis: 'Wajib', prasyarat: 'TI301', dosen: 'Dr. Rina W.', status: 'Aktif' },
    { kode: 'TI503', nama: 'Rekayasa Perangkat Lunak', prodi: 'Teknik Informatika', sks: 3, sem: 5, jenis: 'Wajib', prasyarat: '-', dosen: 'Drs. Hendra', status: 'Aktif' },
    { kode: 'TI504', nama: 'Jaringan Komputer', prodi: 'Teknik Informatika', sks: 2, sem: 5, jenis: 'Wajib', prasyarat: '-', dosen: 'Ir. Surya P.', status: 'Aktif' },
    { kode: 'TI505', nama: 'Metode Penelitian', prodi: 'Teknik Informatika', sks: 2, sem: 5, jenis: 'Wajib', prasyarat: '-', dosen: 'Prof. Agus M.', status: 'Aktif' },
    { kode: 'TI506', nama: 'Keamanan Siber', prodi: 'Teknik Informatika', sks: 3, sem: 5, jenis: 'Pilihan', prasyarat: 'TI504', dosen: 'Dr. Andi K.', status: 'Aktif' },
    { kode: 'SI401', nama: 'Analisis & Desain Sistem', prodi: 'Sistem Informasi', sks: 3, sem: 4, jenis: 'Wajib', prasyarat: '-', dosen: 'Dr. Maya S.', status: 'Aktif' },
    { kode: 'SI402', nama: 'Manajemen Proyek SI', prodi: 'Sistem Informasi', sks: 2, sem: 4, jenis: 'Wajib', prasyarat: 'SI301', dosen: 'M. Rizal, M.Kom', status: 'Aktif' },
    { kode: 'MB301', nama: 'Manajemen Strategis', prodi: 'Manajemen Bisnis', sks: 3, sem: 3, jenis: 'Wajib', prasyarat: '-', dosen: 'Prof. Hendra K.', status: 'Aktif' },
    { kode: 'MB302', nama: 'Kewirausahaan Digital', prodi: 'Manajemen Bisnis', sks: 2, sem: 3, jenis: 'Pilihan', prasyarat: '-', dosen: 'Dr. Dewi A.', status: 'Aktif' },
    { kode: 'TI507', nama: 'Machine Learning', prodi: 'Teknik Informatika', sks: 3, sem: 7, jenis: 'Pilihan', prasyarat: 'TI601', dosen: 'Dr. Fajar N.', status: 'Nonaktif' },
    { kode: 'TI508', nama: 'Pengembangan Aplikasi Mobile', prodi: 'Teknik Informatika', sks: 3, sem: 6, jenis: 'Pilihan', prasyarat: 'TI501', dosen: 'M. Saleh, M.T', status: 'Aktif' },
];

const jenisStyle = {
    Wajib: 'bp-blue',
    Pilihan: 'bp-teal',
    Praktikum: 'bp-purple',
};

const statusStyle = {
    Aktif: 'bp-green',
    Nonaktif: 'bp-rose',
};

export default function MataKuliahTab({ onOpenModal }: MataKuliahTabProps) {
    const [search, setSearch] = useState('');
    const [selectedProdi, setSelectedProdi] = useState('');
    const [selectedSem, setSelectedSem] = useState('');
    const [selectedJenis, setSelectedJenis] = useState('');

    const filteredMK = mkData.filter(m => {
        const matchesSearch = m.nama.toLowerCase().includes(search.toLowerCase()) ||
            m.kode.toLowerCase().includes(search.toLowerCase());
        const matchesProdi = selectedProdi === '' || m.prodi === selectedProdi;
        const matchesSem = selectedSem === '' || m.sem.toString() === selectedSem;
        const matchesJenis = selectedJenis === '' || m.jenis === selectedJenis;

        return matchesSearch && matchesProdi && matchesSem && matchesJenis;
    });

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
                        <option>Teknik Informatika</option>
                        <option>Sistem Informasi</option>
                        <option>Manajemen Bisnis</option>
                        <option>Ilmu Hukum</option>
                    </select>
                    <select
                        className="fsel"
                        value={selectedSem}
                        onChange={(e) => setSelectedSem(e.target.value)}
                    >
                        <option value="">Semua Semester</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                            <option key={s} value={s.toString()}>Semester {s}</option>
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
                <div className="tbl-wrap px-5">
                    <table className="data-table w-full">
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
                            {filteredMK.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-8 text-slate-400">
                                        Tidak ada data mata kuliah yang sesuai filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredMK.map((m) => (
                                    <tr key={m.kode}>
                                        <td>
                                            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                                {m.kode}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                                                {m.nama}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {m.prodi}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                                                {m.sks}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span className="badge-pill bp-indigo">Sem {m.sem}</span>
                                        </td>
                                        <td>
                                            <span className={`badge-pill ${jenisStyle[m.jenis] ?? 'bp-gray'}`}>
                                                {m.jenis}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                                                {m.prasyarat}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-xs text-slate-800 dark:text-slate-200">
                                                {m.dosen}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge-pill ${statusStyle[m.status] ?? 'bp-gray'}`}>
                                                {m.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-1">
                                                <button className="btn-icon bi-edit" title="Edit" onClick={onOpenModal}>
                                                    <i className="bi bi-pencil" />
                                                </button>
                                                <button className="btn-icon bi-detail" title="Detail">
                                                    <i className="bi bi-eye" />
                                                </button>
                                                <button className="btn-icon bi-del" title="Hapus">
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
                <div className="pagi border-t border-slate-100 dark:border-slate-800">
                    <div className="pagi-info">
                        Menampilkan <strong>1–{filteredMK.length}</strong> dari <strong>{filteredMK.length}</strong> mata kuliah
                    </div>
                    <div className="pagi-btns">
                        <button className="pagi-btn">‹</button>
                        <button className="pagi-btn active">1</button>
                        <button className="pagi-btn">›</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
