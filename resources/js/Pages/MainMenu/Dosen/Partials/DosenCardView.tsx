import React from 'react';
import { avgColors, statusBadge } from './DosenTable';

export const coverGrads = [
    'linear-gradient(135deg,#1344b8,#1a56db)',
    'linear-gradient(135deg,#065f46,#0d9488)',
    'linear-gradient(135deg,#5b21b6,#7c3aed)',
    'linear-gradient(135deg,#92400e,#f59e0b)',
    'linear-gradient(135deg,#9f1239,#e11d48)',
    'linear-gradient(135deg,#064e3b,#16a34a)',
    'linear-gradient(135deg,#7c2d12,#ea580c)',
    'linear-gradient(135deg,#312e81,#4338ca)',
    'linear-gradient(135deg,#0c4a6e,#0284c7)',
    'linear-gradient(135deg,#831843,#be185d)',
    'linear-gradient(135deg,#78350f,#d97706)',
    'linear-gradient(135deg,#1a56db,#7c3aed)',
];

interface DosenCardViewProps {
    dosens: any[];
    onViewDetail: (dosen: any) => void;
    onEdit: (dosen: any) => void;
}

export default function DosenCardView({
    dosens,
    onViewDetail,
    onEdit
}: DosenCardViewProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" id="cardGrid">
            {dosens.length === 0 ? (
                <div className="col-span-full text-center py-4 text-slate-500">
                    Tidak ada data dosen yang sesuai dengan filter.
                </div>
            ) : (
                dosens.map((d, i) => {
                    const initials = d.initials || d.nama.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                    const coverBg = coverGrads[i % coverGrads.length];
                    const avatarBg = avgColors[i % avgColors.length];
                    const rating = d.rating || 4.5;
                    const ratingFull = Math.floor(rating);

                    return (
                        <div key={d.id || d.nidn}>
                            <div className="dosen-card" onClick={() => onViewDetail(d)}>
                                <div className="dc-cover" style={{ background: coverBg }}></div>
                                <div className="dc-avatar-wrap">
                                    {d.foto_url ? (
                                        <img
                                            src={d.foto_url}
                                            alt={d.nama}
                                            className="dc-avatar"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="dc-avatar" style={{ background: avatarBg }}>
                                            {initials}
                                        </div>
                                    )}
                                    <div className="dc-badges">
                                        {statusBadge(d.status || d.status_dosen || 'Aktif')}
                                    </div>
                                </div>
                                <div className="dc-name">{d.nama_lengkap || d.nama}</div>
                                <div>
                                    <span className="dc-nidn">{d.nidn}</span>
                                </div>
                                <div className="dc-title">
                                    {d.jabatan || 'Lektor'} · {d.prodi?.nama || d.prodi || '-'}
                                </div>
                                <div className="dc-prodi">
                                    <i className="bi bi-book-fill" style={{ color: 'var(--primary)', marginRight: '6px' }}></i>
                                    {d.keahlian?.split(',')[0] || (Array.isArray(d.mk) ? d.mk[0] : '-')}
                                </div>
                                <div className="dc-stats">
                                    <div className="dc-stat">
                                        <span className="dc-stat-num" style={{ color: 'var(--primary)' }}>
                                            {d.sks || 0}
                                        </span>
                                        <span className="dc-stat-lbl">SKS/Smt</span>
                                    </div>
                                    <div className="dc-stat">
                                        <span className="dc-stat-num" style={{ color: 'var(--teal)' }}>
                                            {d.mhsBimbing || d.mahasiswa_bimbingan_count || 0}
                                        </span>
                                        <span className="dc-stat-lbl">Mhs Wali</span>
                                    </div>
                                    <div className="dc-stat">
                                        <span className="dc-stat-num" style={{ color: 'var(--purple)' }}>
                                            {d.pub || 0}
                                        </span>
                                        <span className="dc-stat-lbl">Publikasi</span>
                                    </div>
                                </div>
                                <div className="dc-footer" onClick={(e) => e.stopPropagation()}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                        {[...Array(5)].map((_, si) => (
                                            <i
                                                key={si}
                                                className={`bi ${si < ratingFull ? 'bi-star-fill' : 'bi-star'}`}
                                                style={{ color: si < ratingFull ? '#f59e0b' : '#e2e8f0', fontSize: '9px' }}
                                            ></i>
                                        ))}
                                        <span style={{ fontSize: '.72rem', fontWeight: 700, color: '#b45309', marginLeft: '2px' }}>
                                            {rating.toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="dc-contact">
                                        <a href={`mailto:${d.email}`} title="Email">
                                            <i className="bi bi-envelope-fill"></i>
                                        </a>
                                        <a href={`https://wa.me/${d.hp}`} target="_blank" rel="noopener noreferrer" title="WhatsApp">
                                            <i className="bi bi-whatsapp"></i>
                                        </a>
                                        <button
                                            className="btn border-0 p-0"
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '8px',
                                                background: 'var(--primary-light)',
                                                color: 'var(--primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '12px'
                                            }}
                                            onClick={() => onEdit(d)}
                                            title="Edit"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
