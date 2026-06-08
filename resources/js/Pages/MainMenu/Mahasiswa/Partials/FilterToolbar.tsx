import React from 'react';

export default function FilterToolbar({ 
    search, setSearch,
    prodiFilter, setProdiFilter,
    angkatanFilter, setAngkatanFilter,
    statusFilter, setStatusFilter,
    allProdis,
    angkatanList,
    viewMode, setViewMode,
    onAdd
}: any) {
    return (
        <div className="filter-toolbar" data-aos="fade-up" data-aos-duration="400">
            <div className="fi-wrap">
                <i className="bi bi-search fi-icon"></i>
                <input 
                    className="fi-input" 
                    type="text" 
                    placeholder="Cari nama, NIM mahasiswa..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            
            <select className="fsel" value={prodiFilter} onChange={(e) => setProdiFilter(e.target.value)}>
                <option value="">Semua Prodi</option>
                {allProdis.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
            </select>
            
            <select className="fsel" value={angkatanFilter} onChange={(e) => setAngkatanFilter(e.target.value)}>
                <option value="">Semua Angkatan</option>
                {angkatanList.map((a: any) => (
                    <option key={a} value={a}>{a}</option>
                ))}
            </select>
            
            <select className="fsel" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Cuti">Cuti</option>
                <option value="Non-Aktif">Non-Aktif</option>
                <option value="Drop Out">Drop Out</option>
                <option value="Lulus">Lulus</option>
            </select>
            
            <div className="view-toggle">
                <button 
                    className={`vt-btn ${viewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setViewMode('table')}
                    title="Tampilan Tabel"
                ><i className="bi bi-table"></i></button>
                <button 
                    className={`vt-btn ${viewMode === 'card' ? 'active' : ''}`}
                    onClick={() => setViewMode('card')}
                    title="Tampilan Kartu"
                ><i className="bi bi-grid-3x3-gap-fill"></i></button>
            </div>
            
            <button className="btn-add" onClick={onAdd}><i className="bi bi-person-plus-fill"></i> Tambah</button>
        </div>
    );
}
