import React from 'react';
import { statusBadge, gelarBadge, ratingStars, avgColors } from './DosenTable';
import { coverGrads } from './DosenCardView';

interface DosenDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    dosen: any;
    onEdit?: (dosen: any) => void;
}

const hariColors: Record<string, string> = {
    Senin: '#1a56db', Selasa: '#7c3aed', Rabu: '#0d9488',
    Kamis: '#ea580c', Jumat: '#16a34a', Sabtu: '#be185d',
};

const hariShort: Record<string, string> = {
    Senin: 'Sen', Selasa: 'Sel', Rabu: 'Rab',
    Kamis: 'Kam', Jumat: 'Jum', Sabtu: 'Sab',
};

const statusMkBadge = (status: string) => {
    const cls = status === 'Aktif' ? 'bp-green' : 'bp-rose';
    return <span className={`bp ${cls}`} style={{ fontSize: '.6rem' }}>{status}</span>;
};

export default function DosenDetailDrawer({
    isOpen,
    onClose,
    dosen,
    onEdit,
}: DosenDetailDrawerProps) {
    if (!dosen) return null;

    const initials  = dosen.initials || dosen.nama.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
    const coverIdx  = Math.abs(dosen.nidn?.charCodeAt(0) ?? 0) % coverGrads.length;
    const avatarIdx = Math.abs(dosen.nidn?.charCodeAt(0) ?? 0) % avgColors.length;
    const coverBg   = coverGrads[coverIdx];
    const avatarBg  = avgColors[avatarIdx];
    const rating    = dosen.rating || 4.5;

    // Real data from backend
    const jadwal: any[]              = Array.isArray(dosen.jadwal) ? dosen.jadwal : [];
    const mataKuliahs: any[]         = Array.isArray(dosen.mataKuliahs) ? dosen.mataKuliahs : [];
    const mahasiswaBimbingan: any[]  = Array.isArray(dosen.mahasiswaBimbingan) ? dosen.mahasiswaBimbingan : [];

    return (
        <>
            <div
                className={`drawer-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />
            <div className={`drawer ${isOpen ? 'open' : ''}`}>

                {/* ── Cover ── */}
                <div className="drawer-cover" style={{ background: coverBg }}>
                    <button className="drawer-close" onClick={onClose} aria-label="Close">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                {/* ── Avatar + CTA ── */}
                <div className="drawer-avatar-row">
                    <div className="drawer-avatar" style={{ background: avatarBg }}>
                        {initials}
                    </div>
                    <div className="drawer-quick-btns">
                        <a href={`mailto:${dosen.email}`} className="dqb dqb-outline text-decoration-none">
                            <i className="bi bi-envelope-fill"></i> Email
                        </a>
                        <a
                            href={dosen.hp && dosen.hp !== '-' ? `https://wa.me/${dosen.hp}` : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dqb dqb-primary text-decoration-none"
                        >
                            <i className="bi bi-whatsapp"></i> Chat
                        </a>
                    </div>
                </div>

                <div className="drawer-body">

                    {/* ── Section 1: Identitas + Stats ── */}
                    <div className="dw-section">
                        <div className="dw-name">{dosen.nama_lengkap || dosen.nama}</div>
                        <div>
                            <span className="dw-nidn">{dosen.nidn}</span>
                        </div>
                        <div className="dw-title">
                            {dosen.jabatan || 'Tenaga Pengajar'} · {dosen.prodi || '-'}
                        </div>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '16px' }}>
                            {statusBadge(dosen.status_dosen || 'Aktif')}
                            {gelarBadge(dosen.gelar_depan === 'Prof.' ? 'Profesor' : dosen.gelar_depan === 'Dr.' ? 'Doktor' : 'Magister')}
                            {mataKuliahs.length > 0 && (
                                <span className="bp bp-indigo">
                                    <i className="bi bi-mortarboard-fill me-1"></i>
                                    {mataKuliahs[0].nama}
                                </span>
                            )}
                        </div>

                        {/* Stats grid */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '4px', padding: '14px', background: 'var(--soft-bg)', borderRadius: '14px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 800, color: '#b45309', lineHeight: 1 }}>
                                    {rating.toFixed(1)}
                                </div>
                                <div style={{ margin: '3px 0' }}>{ratingStars(rating)}</div>
                                <div style={{ fontSize: '.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>Rating Dosen</div>
                            </div>
                            <div style={{ flex: 1, borderLeft: '1px solid var(--border)', paddingLeft: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                    {[
                                        { val: dosen.sks || 0,          lbl: 'SKS/Smt',    color: 'var(--primary)' },
                                        { val: mahasiswaBimbingan.length || dosen.mhsBimbing || 0, lbl: 'Mhs Wali', color: 'var(--teal)' },
                                        { val: mataKuliahs.length || 0,  lbl: 'Mata Kuliah', color: 'var(--purple)' },
                                        { val: jadwal.length || 0,       lbl: 'Sesi/Pekan',  color: 'var(--accent)' },
                                    ].map(({ val, lbl, color }) => (
                                        <div key={lbl} style={{ textAlign: 'center' }}>
                                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 800, color, display: 'block' }}>
                                                {val}
                                            </span>
                                            <span style={{ fontSize: '.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>{lbl}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Section 2: Data Diri ── */}
                    <div className="dw-section">
                        <div className="dw-section-title">
                            <i className="bi bi-person-fill text-primary me-2"></i>Data Diri
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <div className="info-lbl">NIDN</div>
                                <div className="info-val" style={{ fontFamily: 'monospace' }}>{dosen.nidn}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-lbl">Jabatan Fungsional</div>
                                <div className="info-val">{dosen.jabatan || '-'}</div>
                            </div>
                            <div className="info-item full">
                                <div className="info-lbl">Email Kampus</div>
                                <div className="info-val">{dosen.email || '-'}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-lbl">Jenjang Pendidikan</div>
                                <div className="info-val">{dosen.pendidikan || '-'}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-lbl">Program Studi</div>
                                <div className="info-val">{dosen.prodi || '-'}</div>
                            </div>
                            <div className="info-item full">
                                <div className="info-lbl">Bidang Keahlian</div>
                                <div className="info-val">{dosen.keahlian || '-'}</div>
                            </div>
                        </div>
                    </div>

                    {/* ── Section 3: Matakuliah Diampu ── */}
                    <div className="dw-section">
                        <div className="dw-section-title">
                            <i className="bi bi-book-fill text-primary me-2"></i>
                            Mata Kuliah Diampu
                            <span className="bp bp-blue ms-2" style={{ fontSize: '.6rem' }}>{mataKuliahs.length} MK</span>
                        </div>
                        {mataKuliahs.length === 0 ? (
                            <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', padding: '12px 0' }}>
                                Belum ada mata kuliah yang ditugaskan.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {mataKuliahs.map((mk: any, idx: number) => (
                                    <div key={idx} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '10px 12px', background: 'var(--soft-bg)', borderRadius: '10px',
                                        border: '1px solid var(--border)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '8px',
                                                background: 'var(--primary-light)', color: 'var(--primary)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '.65rem', fontWeight: 800, flexShrink: 0
                                            }}>
                                                {mk.sks}
                                                <span style={{ fontSize: '.5rem', fontWeight: 600 }}>SKS</span>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '.78rem', color: 'var(--text-dark)' }}>{mk.nama}</div>
                                                <div style={{ fontSize: '.65rem', color: 'var(--text-muted)' }}>
                                                    {mk.kode} · Sem {mk.sem} · {mk.jenis}
                                                </div>
                                            </div>
                                        </div>
                                        {statusMkBadge(mk.status)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Section 4: Jadwal Mengajar ── */}
                    <div className="dw-section">
                        <div className="dw-section-title">
                            <i className="bi bi-calendar3-week text-teal me-2"></i>
                            Jadwal Mengajar
                            <span className="bp bp-teal ms-2" style={{ fontSize: '.6rem' }}>{jadwal.length} sesi</span>
                        </div>
                        {jadwal.length === 0 ? (
                            <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', padding: '12px 0' }}>
                                Belum ada jadwal yang terdaftar.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                {jadwal.map((j: any, idx: number) => {
                                    const color = hariColors[j.hari] ?? '#64748b';
                                    const dayShort = hariShort[j.hari] ?? j.hari?.slice(0, 3);
                                    return (
                                        <div className="jadwal-mini" key={idx}>
                                            <div className="jm-day" style={{ background: `${color}18`, color }}>
                                                {dayShort}
                                                <br />
                                                <span style={{ fontSize: '.52rem' }}>{j.jam_mulai}</span>
                                            </div>
                                            <div className="jm-info">
                                                <div className="jm-name">{j.mk}</div>
                                                <div className="jm-meta">
                                                    <i className="bi bi-door-open me-1"></i>
                                                    {j.ruangan}
                                                    {j.kelas && j.kelas !== '-' && <> · {j.kelas}</>}
                                                    <span style={{
                                                        marginLeft: '6px',
                                                        padding: '1px 6px',
                                                        borderRadius: '5px',
                                                        background: `${color}18`,
                                                        color,
                                                        fontWeight: 700,
                                                        fontSize: '.58rem'
                                                    }}>{j.tipe}</span>
                                                </div>
                                            </div>
                                            <span className="jm-sks">{j.sks_mk} SKS</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* ── Section 5: Mahasiswa Bimbingan ── */}
                    <div className="dw-section">
                        <div className="dw-section-title">
                            <i className="bi bi-people-fill text-purple me-2"></i>
                            Mahasiswa Wali
                            <span className="bp bp-purple ms-2" style={{ fontSize: '.6rem' }}>{mahasiswaBimbingan.length} mhs</span>
                        </div>
                        {mahasiswaBimbingan.length === 0 ? (
                            <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', padding: '12px 0' }}>
                                Belum ada mahasiswa wali yang terdaftar.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                {mahasiswaBimbingan.map((m: any, idx: number) => (
                                    <div key={idx} style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '9px 12px', background: 'var(--soft-bg)',
                                        borderRadius: '10px', border: '1px solid var(--border)'
                                    }}>
                                        <div style={{
                                            width: '30px', height: '30px', borderRadius: '8px',
                                            background: avgColors[idx % avgColors.length],
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '.62rem', fontWeight: 800, color: '#fff', flexShrink: 0
                                        }}>
                                            {m.nama?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 700, fontSize: '.78rem', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {m.nama}
                                            </div>
                                            <div style={{ fontSize: '.65rem', color: 'var(--text-muted)' }}>
                                                {m.nim} · {m.prodi} · {m.angkatan}
                                            </div>
                                        </div>
                                        <span className={`bp ${m.status === 'aktif' ? 'bp-green' : 'bp-amber'}`} style={{ fontSize: '.6rem', flexShrink: 0 }}>
                                            {m.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Quick Actions ── */}
                    <div className="dw-section">
                        <div className="dw-section-title">
                            <i className="bi bi-lightning-charge-fill text-accent me-2"></i>Aksi Cepat
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            {[
                                { icon: 'bi-calendar3-week', label: 'Jadwal Lengkap' },
                                { icon: 'bi-people-fill',    label: 'Daftar Mhs Wali' },
                                { icon: 'bi-star-fill',      label: 'Rekap Penilaian' },
                            ].map(({ icon, label }) => (
                                <button
                                    key={label}
                                    style={{
                                        padding: '9px', border: '1.5px solid var(--border)',
                                        borderRadius: '10px', background: 'rgba(255,255,255,.7)',
                                        fontSize: '.73rem', fontWeight: 600, cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        color: 'var(--text-dark)', transition: 'var(--transition)',
                                        fontFamily: "'Plus Jakarta Sans',sans-serif"
                                    }}
                                    className="action-btn-hover"
                                >
                                    <i className={`bi ${icon}`}></i>{label}
                                </button>
                            ))}
                            <button
                                style={{
                                    padding: '9px', border: '1.5px solid var(--border)',
                                    borderRadius: '10px', background: 'rgba(255,255,255,.7)',
                                    fontSize: '.73rem', fontWeight: 600, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    color: 'var(--text-dark)', transition: 'var(--transition)',
                                    fontFamily: "'Plus Jakarta Sans',sans-serif"
                                }}
                                className="action-btn-hover"
                                onClick={() => { onClose(); if (onEdit) onEdit(dosen); }}
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
