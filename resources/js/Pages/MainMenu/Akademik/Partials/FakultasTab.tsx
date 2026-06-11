import React, { useState } from 'react';

interface FakultasItem {
    id: string;
    kode: string;
    nama: string;
    dekan: string | null;
    prodis_count?: number;
}

interface FakultasTabProps {
    fakultas: FakultasItem[];
    onOpenModal: (fakultas?: FakultasItem) => void;
    onDelete: (fakultas: FakultasItem) => void;
}

const getFakultasStylePreset = (kode: string) => {
    switch (kode.toUpperCase()) {
        case 'FT':
            return {
                icon: 'bi-cpu-fill',
                bgIcon: '#e8f0fe',
                colorIcon: '#1a56db',
                classPrefix: 'kc-ti',
            };
        case 'FEB':
            return {
                icon: 'bi-briefcase-fill',
                bgIcon: 'var(--accent-light)',
                colorIcon: '#b45309',
                classPrefix: 'kc-mb',
            };
        case 'FMIPA':
            return {
                icon: 'bi-calculator-fill',
                bgIcon: 'var(--purple-light)',
                colorIcon: 'var(--purple)',
                classPrefix: 'kc-hk',
            };
        default:
            return {
                icon: 'bi-building-fill',
                bgIcon: 'var(--teal-light)',
                colorIcon: 'var(--teal)',
                classPrefix: 'kc-si',
            };
    }
};

export default function FakultasTab({ fakultas, onOpenModal, onDelete }: FakultasTabProps) {
    const [search, setSearch] = useState('');

    const filteredFakultas = fakultas.filter(f => 
        f.nama.toLowerCase().includes(search.toLowerCase()) ||
        f.kode.toLowerCase().includes(search.toLowerCase()) ||
        (f.dekan && f.dekan.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="tab-panel active">
            {/* Filter & Action Header */}
            <div className="card-custom mb-6 p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="fi-wrap flex-1 min-w-[200px]">
                        <i className="bi bi-search fi-icon" />
                        <input
                            className="fi w-full"
                            type="text"
                            placeholder="Cari fakultas..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="btn-add cursor-pointer" onClick={() => onOpenModal()}>
                        <i className="bi bi-plus-lg" /> Tambah Fakultas
                    </button>
                </div>
                <div className="mt-3 px-1">
                    <small className="text-xs text-slate-400">
                        Menampilkan {filteredFakultas.length} dari {fakultas.length} fakultas
                    </small>
                </div>
            </div>

            {/* Grid View */}
            {filteredFakultas.length === 0 ? (
                <div className="card-custom p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden group">
                    <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
                    
                    <div className="relative w-24 h-24 mb-6 mx-auto">
                        <div className="absolute inset-0 border-2 border-dashed border-blue-500/30 rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-4 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg shadow-blue-500/20 transform group-hover:scale-110">
                            <i className="bi bi-building-fill" />
                        </div>
                    </div>

                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">
                        Tidak Ada Fakultas Ditemukan
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                        Coba sesuaikan kata kunci pencarian Anda untuk menemukan fakultas.
                    </p>
                    
                    <button 
                        onClick={() => setSearch('')}
                        className="btn-add flex items-center gap-2 px-6 py-2.5 cursor-pointer"
                    >
                        <i className="bi bi-arrow-counterclockwise" /> Reset Pencarian
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFakultas.map((item) => {
                        const style = getFakultasStylePreset(item.kode);
                        return (
                            <div key={item.id} className={`kurikulum-card ${style.classPrefix}`}>
                                <div className="kc-header">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div
                                            className="kc-icon"
                                            style={{ backgroundColor: style.bgIcon, color: style.colorIcon }}
                                        >
                                            <i className={`bi ${style.icon}`} />
                                        </div>
                                        <div>
                                            <div className="kc-title">{item.nama}</div>
                                            <div className="kc-sub">
                                                Kode: <strong className="text-blue-600 dark:text-blue-400 font-bold">{item.kode}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                    Dekan: <strong className="text-slate-700 dark:text-slate-300 font-bold">{item.dekan || 'Belum Ditentukan'}</strong>
                                </div>
                                <div className="kc-stats mt-auto">
                                    <div className="kcs-item">
                                        <span className="kcs-num text-teal-600 dark:text-teal-400">{item.prodis_count || 0}</span>
                                        <span className="kcs-lbl">Program Studi</span>
                                    </div>
                                </div>
                                <div className="kc-footer pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
                                    <div className="text-xs text-slate-400">
                                        Status: <span className="text-emerald-500 font-bold">Aktif</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <button className="btn-icon bi-edit" title="Edit Fakultas" onClick={() => onOpenModal(item)}>
                                            <i className="bi bi-pencil" />
                                        </button>
                                        <button 
                                            className="btn-icon bi-del" 
                                            title="Hapus Fakultas" 
                                            onClick={() => onDelete(item)}
                                            disabled={item.prodis_count ? item.prodis_count > 0 : false}
                                            style={{ opacity: item.prodis_count && item.prodis_count > 0 ? 0.4 : 1 }}
                                        >
                                            <i className="bi bi-trash" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
