import React from 'react';

export const avgColors = [
    'linear-gradient(135deg,#1a56db,#4f83f0)',
    'linear-gradient(135deg,#0d9488,#2dd4bf)',
    'linear-gradient(135deg,#7c3aed,#a78bfa)',
    'linear-gradient(135deg,#f59e0b,#fbbf24)',
    'linear-gradient(135deg,#e11d48,#fb7185)',
    'linear-gradient(135deg,#16a34a,#4ade80)',
    'linear-gradient(135deg,#ea580c,#fb923c)',
    'linear-gradient(135deg,#4338ca,#818cf8)',
    'linear-gradient(135deg,#0284c7,#38bdf8)',
    'linear-gradient(135deg,#be185d,#f472b6)',
    'linear-gradient(135deg,#92400e,#d97706)',
    'linear-gradient(135deg,#065f46,#10b981)',
];

export function statusBadge(s: string) {
    const maps: Record<string, { cls: string; icon: string }> = {
        Aktif: { cls: 'bp-green', icon: 'bi-check-circle-fill' },
        Cuti: { cls: 'bp-amber', icon: 'bi-pause-circle-fill' },
        Pensiun: { cls: 'bp-gray', icon: 'bi-archive-fill' }
    };
    const item = maps[s] || { cls: 'bp-gray', icon: 'bi-archive-fill' };
    return (
        <span className={`bp ${item.cls}`}>
            <i className={`bi ${item.icon} me-1`}></i>
            {s}
        </span>
    );
}

export function gelarBadge(g: string) {
    const maps: Record<string, string> = {
        Profesor: 'bp-purple',
        Doktor: 'bp-blue',
        Magister: 'bp-teal'
    };
    const cls = maps[g] || 'bp-gray';
    return <span className={`bp ${cls}`}>{g}</span>;
}

export function jabatanChip(j: string) {
    const maps: Record<string, { bg: string; color: string }> = {
        'Guru Besar': { bg: 'var(--purple-light)', color: 'var(--purple)' },
        'Lektor Kepala': { bg: 'var(--primary-light)', color: 'var(--primary)' },
        Lektor: { bg: 'var(--teal-light)', color: 'var(--teal)' },
        'Asisten Ahli': { bg: 'var(--accent-light)', color: '#b45309' },
        'Tenaga Pengajar': { bg: '#f1f5f9', color: '#475569' }
    };
    const style = maps[j] || { bg: '#f1f5f9', color: '#475569' };
    return (
        <span className="jab-chip" style={{ background: style.bg, color: style.color }}>
            {j}
        </span>
    );
}

export function ratingStars(r: number) {
    const full = Math.floor(r);
    const hasHalf = r - full >= 0.5;

    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
                {[...Array(5)].map((_, i) => {
                    let icon = 'bi-star';
                    if (i < full) icon = 'bi-star-fill';
                    else if (i === full && hasHalf) icon = 'bi-star-half';

                    return (
                        <i
                            key={i}
                            className={`bi ${icon}`}
                            style={{ color: i < full || (i === full && hasHalf) ? '#f59e0b' : '#cbd5e1', fontSize: '10px' }}
                        ></i>
                    );
                })}
            </span>
            <span style={{ fontSize: '.72rem', fontWeight: 700, color: '#b45309' }}>
                {r.toFixed(1)}
            </span>
        </span>
    );
}

interface DosenTableProps {
    dosens: any[];
    onViewDetail: (dosen: any) => void;
    onEdit: (dosen: any) => void;
    onDelete: (dosen: any) => void;
    onSchedule?: (dosen: any) => void;
}

export default function DosenTable({
    dosens,
    onViewDetail,
    onEdit,
    onDelete,
    onSchedule
}: DosenTableProps) {
    return (
        <div className="card-custom">
            <div className="tbl-wrap">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>NIDN</th>
                            <th>Dosen</th>
                            <th>Gelar & Jabatan</th>
                            <th>Prodi</th>
                            <th>Matakuliah Utama</th>
                            <th style={{ textAlign: 'center' }}>SKS</th>
                            <th>Rating</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dosens.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-4 text-slate-500">
                                    Tidak ada data dosen yang sesuai dengan filter.
                                </td>
                            </tr>
                        ) : (
                            dosens.map((d, i) => (
                                <tr key={d.id || d.nidn}>
                                    <td>
                                        <span style={{
                                            fontFamily: 'monospace',
                                            fontSize: '.75rem',
                                            fontWeight: 700,
                                            color: 'var(--primary)',
                                            background: 'var(--primary-light)',
                                            padding: '2px 8px',
                                            borderRadius: '6px'
                                        }}>
                                            {d.nidn}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {d.foto_url ? (
                                                <img
                                                    src={d.foto_url}
                                                    alt={d.nama}
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '10px',
                                                        objectFit: 'cover',
                                                        flexShrink: 0
                                                    }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '10px',
                                                    background: avgColors[i % avgColors.length],
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '.7rem',
                                                    fontWeight: 800,
                                                    color: '#fff',
                                                    flexShrink: 0
                                                }}>
                                                    {d.initials || d.nama.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '.83rem', color: 'var(--text-dark)' }}>
                                                    {d.nama_lengkap || d.nama}
                                                </div>
                                                <div style={{ fontSize: '.68rem', color: 'var(--text-muted)' }}>
                                                    {d.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-1 flex-wrap">
                                            {gelarBadge(d.gelar || (d.gelar_depan === 'Prof.' ? 'Profesor' : d.gelar_depan === 'Dr.' ? 'Doktor' : 'Magister'))}
                                            {jabatanChip(d.jabatan || 'Asisten Ahli')}
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>
                                        {d.prodi?.nama || d.prodi || '-'}
                                    </td>
                                    <td style={{ fontSize: '.75rem', color: 'var(--text-dark)' }}>
                                        {Array.isArray(d.mk) ? d.mk.join(', ') : (d.keahlian || '-')}
                                    </td>
                                    <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--primary)' }}>
                                        {d.sks || 0}
                                    </td>
                                    <td>{ratingStars(d.rating || 4.5)}</td>
                                    <td>{statusBadge(d.status || d.status_dosen || 'Aktif')}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button
                                                className="btn-icon bi-view"
                                                title="Profil Detail"
                                                onClick={() => onViewDetail(d)}
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            <button
                                                className="btn-icon bi-edit"
                                                title="Edit"
                                                onClick={() => onEdit(d)}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            {onSchedule && (
                                                <button
                                                    className="btn-icon bi-sched"
                                                    title="Jadwal"
                                                    onClick={() => onSchedule(d)}
                                                >
                                                    <i className="bi bi-calendar3-week"></i>
                                                </button>
                                            )}
                                            <button
                                                className="btn-icon bi-del"
                                                title="Hapus"
                                                onClick={() => onDelete(d)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
