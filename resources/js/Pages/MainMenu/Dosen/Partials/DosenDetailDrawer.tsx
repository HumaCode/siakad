import React from 'react';
import { statusBadge, gelarBadge, ratingStars } from './DosenTable';
import { coverGrads } from './DosenCardView';
import { avgColors } from './DosenTable';

interface DosenDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    dosen: any;
    onEdit?: (dosen: any) => void;
}

export default function DosenDetailDrawer({
    isOpen,
    onClose,
    dosen,
    onEdit
}: DosenDetailDrawerProps) {
    if (!dosen) return null;

    const initials = dosen.initials || dosen.nama.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
    const coverBg = coverGrads[dosen.id % coverGrads.length || 0];
    const avatarBg = avgColors[dosen.id % avgColors.length || 0];
    const rating = dosen.rating || 4.5;

    const jadwalMengajar = [
        { day: 'Sen', dayFull: 'Senin', time: '07:00–08:40', mk: 'Machine Learning', room: 'Lab AI', kelas: 'TI-A', color: '#1a56db' },
        { day: 'Rab', dayFull: 'Rabu', time: '10:20–12:00', mk: 'Kecerdasan Buatan', room: 'R.301', kelas: 'TI-B', color: '#7c3aed' },
        { day: 'Kam', dayFull: 'Kamis', time: '13:00–14:40', mk: 'Machine Learning', room: 'R.304', kelas: 'TI-C', color: '#1a56db' },
        { day: 'Jum', dayFull: 'Jumat', time: '08:40–10:20', mk: 'Deep Learning', room: 'Lab AI', kelas: 'TI-A', color: '#0d9488' },
    ];

    const publications = [
        { title: 'Deep Neural Network for Batik Pattern Recognition Using CNN', journal: 'IEEE Transactions on Neural Networks, 2024', cite: 42 },
        { title: 'Federated Learning Framework for Privacy-Preserving AI in Healthcare', journal: 'Nature Digital Medicine, 2023', cite: 89 },
        { title: 'Optimization of Transformer Models for Low-Resource Indonesian NLP', journal: 'ACL Proceedings, 2023', cite: 64 },
    ];

    return (
        <>
            <div
                className={`drawer-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            ></div>
            <div className={`drawer ${isOpen ? 'open' : ''}`}>
                <div className="drawer-cover" style={{ background: coverBg }}>
                    <button className="drawer-close" onClick={onClose} aria-label="Close">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <div className="drawer-avatar-row">
                    <div className="drawer-avatar" style={{ background: avatarBg }}>
                        {initials}
                    </div>
                    <div className="drawer-quick-btns">
                        <a
                            href={`mailto:${dosen.email}`}
                            className="dqb dqb-outline text-decoration-none"
                        >
                            <i className="bi bi-envelope-fill"></i> Email
                        </a>
                        <a
                            href={`https://wa.me/${dosen.hp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dqb dqb-primary text-decoration-none"
                        >
                            <i className="bi bi-whatsapp"></i> Chat
                        </a>
                    </div>
                </div>

                <div className="drawer-body">
                    <div className="dw-section">
                        <div className="dw-name">{dosen.nama_lengkap || dosen.nama}</div>
                        <div>
                            <span className="dw-nidn">{dosen.nidn}</span>
                        </div>
                        <div className="dw-title">
                            {dosen.jabatan || 'Lektor'} · {dosen.prodi?.nama || dosen.prodi || '-'}
                        </div>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '16px' }}>
                            {statusBadge(dosen.status || dosen.status_dosen || 'Aktif')}
                            {gelarBadge(dosen.gelar || (dosen.gelar_depan === 'Prof.' ? 'Profesor' : dosen.gelar_depan === 'Dr.' ? 'Doktor' : 'Magister'))}
                            <span className="bp bp-indigo">
                                <i className="bi bi-mortarboard-fill me-1"></i>
                                {dosen.keahlian?.split(',')[0].trim() || (Array.isArray(dosen.mk) ? dosen.mk[0] : '-')}
                            </span>
                        </div>

                        {/* Rating + Stats */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '4px', padding: '14px', background: 'var(--soft-bg)', borderRadius: '14px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 800, color: '#b45309', lineHeight: 1 }}>
                                    {rating.toFixed(1)}
                                </div>
                                <div style={{ margin: '3px 0' }}>
                                    {ratingStars(rating)}
                                </div>
                                <div style={{ fontSize: '.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                    Rating Dosen
                                </div>
                            </div>
                            <div style={{ flex: 1, borderLeft: '1px solid var(--border)', paddingLeft: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', display: 'block' }}>
                                            {dosen.sks || 0}
                                        </span>
                                        <span style={{ fontSize: '.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>SKS/Smt</span>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 800, color: 'var(--teal)', display: 'block' }}>
                                            {dosen.mhsBimbing || 0}
                                        </span>
                                        <span style={{ fontSize: '.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>Mhs Wali</span>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 800, color: 'var(--purple)', display: 'block' }}>
                                            {dosen.pub || 0}
                                        </span>
                                        <span style={{ fontSize: '.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>Publikasi</span>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 800, color: 'var(--accent)', display: 'block' }}>
                                            {dosen.masaKerja?.replace(' tahun', '') || '10'}
                                        </span>
                                        <span style={{ fontSize: '.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>Thn Mengajar</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Pribadi */}
                    <div className="dw-section">
                        <div className="dw-section-title">
                            <i className="bi bi-person-fill text-primary me-2"></i>Data Diri
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <div className="info-lbl">Tempat, Tgl Lahir</div>
                                <div className="info-val">{dosen.ttl || 'Bandung, 15 Maret 1968'}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-lbl">No. HP</div>
                                <div className="info-val">{dosen.hp || '-'}</div>
                            </div>
                            <div className="info-item full">
                                <div className="info-lbl">Email Kampus</div>
                                <div className="info-val">{dosen.email || '-'}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-lbl">Pendidikan</div>
                                <div className="info-val">{dosen.pendidikan || 'S3'}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-lbl">Scopus ID</div>
                                <div className="info-val">{dosen.scopus || '-'}</div>
                            </div>
                            <div className="info-item full">
                                <div className="info-lbl">Bidang Keahlian</div>
                                <div className="info-val">{dosen.keahlian || '-'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Jadwal mengajar */}
                    <div className="dw-section">
                        <div className="dw-section-title">
                            <i className="bi bi-calendar3-week text-teal me-2"></i>Jadwal Mengajar Saat Ini
                        </div>
                        {jadwalMengajar.map((j, idx) => (
                            <div className="jadwal-mini" key={idx}>
                                <div className="jm-day" style={{ background: `${j.color}22`, color: j.color }}>
                                    {j.day}
                                    <br />
                                    <span style={{ fontSize: '.55rem' }}>{j.time.split('–')[0]}</span>
                                </div>
                                <div className="jm-info">
                                    <div className="jm-name">{j.mk}</div>
                                    <div className="jm-meta">
                                        <i className="bi bi-door-open me-1"></i>
                                        {j.room} · Kelas {j.kelas}
                                    </div>
                                </div>
                                <span className="jm-sks">3 SKS</span>
                            </div>
                        ))}
                    </div>

                    {/* Publikasi */}
                    <div className="dw-section">
                        <div className="dw-section-title">
                            <i className="bi bi-file-earmark-text-fill text-purple me-2"></i>Publikasi Terbaru
                        </div>
                        {publications.map((p, idx) => (
                            <div className="pub-item" key={idx}>
                                <div className="pub-title">{p.title}</div>
                                <div className="pub-meta">
                                    {p.journal} · <strong>{p.cite}</strong> sitasi
                                </div>
                            </div>
                        ))}
                        <a
                            href="#"
                            style={{
                                fontSize: '.75rem',
                                fontWeight: 700,
                                color: 'var(--primary)',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                marginTop: '6px'
                            }}
                        >
                            <i className="bi bi-arrow-right-circle-fill"></i>Lihat semua {dosen.pub || 0} publikasi
                        </a>
                    </div>

                    {/* Quick Actions */}
                    <div className="dw-section">
                        <div className="dw-section-title">
                            <i className="bi bi-lightning-charge-fill text-accent me-2"></i>Aksi Cepat
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <button
                                style={{
                                    padding: '9px',
                                    border: '1.5px solid var(--border)',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,.7)',
                                    fontSize: '.73rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: 'var(--text-dark)',
                                    transition: 'var(--transition)',
                                    fontFamily: "'Plus Jakarta Sans',sans-serif"
                                }}
                                className="action-btn-hover"
                            >
                                <i className="bi bi-calendar3-week"></i>Jadwal Lengkap
                            </button>
                            <button
                                style={{
                                    padding: '9px',
                                    border: '1.5px solid var(--border)',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,.7)',
                                    fontSize: '.73rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: 'var(--text-dark)',
                                    transition: 'var(--transition)',
                                    fontFamily: "'Plus Jakarta Sans',sans-serif"
                                }}
                                className="action-btn-hover"
                            >
                                <i className="bi bi-people-fill"></i>Daftar Mhs Wali
                            </button>
                            <button
                                style={{
                                    padding: '9px',
                                    border: '1.5px solid var(--border)',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,.7)',
                                    fontSize: '.73rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: 'var(--text-dark)',
                                    transition: 'var(--transition)',
                                    fontFamily: "'Plus Jakarta Sans',sans-serif"
                                }}
                                className="action-btn-hover"
                            >
                                <i className="bi bi-star-fill"></i>Rekap Penilaian
                            </button>
                            <button
                                style={{
                                    padding: '9px',
                                    border: '1.5px solid var(--border)',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,.7)',
                                    fontSize: '.73rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: 'var(--text-dark)',
                                    transition: 'var(--transition)',
                                    fontFamily: "'Plus Jakarta Sans',sans-serif"
                                }}
                                className="action-btn-hover"
                                onClick={() => {
                                    onClose();
                                    if (onEdit) onEdit(dosen);
                                }}
                            >
                                <i className="bi bi-pencil-fill"></i>Edit Data Dosen
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
