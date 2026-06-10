import React from 'react';

interface FilterToolbarProps {
    search: string;
    onSearchChange: (val: string) => void;
    prodiFilter: string;
    onProdiChange: (val: string) => void;
    gelarFilter: string;
    onGelarChange: (val: string) => void;
    statusFilter: string;
    onStatusChange: (val: string) => void;
    viewMode: 'table' | 'card';
    onViewModeChange: (mode: 'table' | 'card') => void;
    onAddClick: () => void;
    onImportClick: () => void;
    allProdis?: string[];
}

export default function FilterToolbar({
    search,
    onSearchChange,
    prodiFilter,
    onProdiChange,
    gelarFilter,
    onGelarChange,
    statusFilter,
    onStatusChange,
    viewMode,
    onViewModeChange,
    onAddClick,
    onImportClick,
    allProdis = [
        'Teknik Informatika',
        'Sistem Informasi',
        'Manajemen Bisnis',
        'Ilmu Hukum',
        'Kedokteran Gigi',
        'Teknik Elektro'
    ]
}: FilterToolbarProps) {
    return (
        <div className="filter-bar">
            <div className="fi-wrap">
                <i className="bi bi-search fi-icon"></i>
                <input
                    className="fi-input"
                    type="text"
                    placeholder="Cari nama, NIDN, email dosen..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <select
                className="fsel"
                value={prodiFilter}
                onChange={(e) => onProdiChange(e.target.value)}
            >
                <option value="">Semua Prodi</option>
                {allProdis.map((prodi) => (
                    <option key={prodi} value={prodi}>
                        {prodi}
                    </option>
                ))}
            </select>

            <select
                className="fsel"
                value={gelarFilter}
                onChange={(e) => onGelarChange(e.target.value)}
            >
                <option value="">Semua Gelar</option>
                <option value="Profesor">Profesor</option>
                <option value="Doktor">Doktor</option>
                <option value="Magister">Magister</option>
            </select>

            <select
                className="fsel"
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
            >
                <option value="">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Cuti">Cuti</option>
                <option value="Pensiun">Pensiun</option>
            </select>

            <div className="view-toggle">
                <button
                    className={`vt-btn ${viewMode === 'table' ? 'active' : ''}`}
                    onClick={() => onViewModeChange('table')}
                    title="Tabel"
                >
                    <i className="bi bi-table"></i>
                </button>
                <button
                    className={`vt-btn ${viewMode === 'card' ? 'active' : ''}`}
                    onClick={() => onViewModeChange('card')}
                    title="Kartu"
                >
                    <i className="bi bi-grid-3x3-gap-fill"></i>
                </button>
            </div>

            <button className="btn-outline">
                <i className="bi bi-download"></i> Export
            </button>
            <button className="btn-add" onClick={onAddClick}>
                <i className="bi bi-person-plus-fill"></i> Tambah
            </button>
        </div>
    );
}
