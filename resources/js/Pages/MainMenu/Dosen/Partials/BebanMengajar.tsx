import React from 'react';
import { avgColors } from './DosenTable';

export default function BebanMengajar({ dosens }: { dosens: any[] }) {
    // We can filter dosens or use the default list from mock data if not provided
    const overloadDosens = dosens.filter(d => (d.sks || 0) >= 12);
    
    return (
        <div className="row g-4">
            {/* LEFT COLUMN: STATS SUMMARY */}
            <div className="col-12 col-lg-4" data-aos="fade-right">
                <div className="card-custom p-4" style={{ height: '100%' }}>
                    <h5 className="font-poppins mb-3" style={{ fontSize: '.9rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                        <i className="bi bi-pie-chart-fill me-2 text-primary"></i>Distribusi Beban SKS
                    </h5>
                    
                    <div style={{ padding: '16px 20px', background: 'var(--primary-light)', borderRadius: '14px', marginBottom: '20px' }}>
                        <div style={{ fontSize: '.73rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                            Total Beban Diampu
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>
                                892
                            </span>
                            <span style={{ fontSize: '.95rem', fontWeight: 800, color: 'var(--primary)' }}>
                                SKS
                            </span>
                        </div>
                        <div style={{ fontSize: '.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Terbagi dalam 294 Mata Kuliah aktif
                        </div>
                    </div>

                    <div className="prog-row">
                        <div className="prog-label">Ringan (≤ 6 SKS)</div>
                        <div className="prog-bar-bg">
                            <div className="prog-bar-fill" style={{ width: '26%', background: 'var(--green)' }}></div>
                        </div>
                        <div className="prog-val" style={{ color: 'var(--green)' }}>124 (26%)</div>
                    </div>

                    <div className="prog-row">
                        <div className="prog-label">Normal (7-9 SKS)</div>
                        <div className="prog-bar-bg">
                            <div className="prog-bar-fill" style={{ width: '50%', background: 'var(--primary)' }}></div>
                        </div>
                        <div className="prog-val" style={{ color: 'var(--primary)' }}>242 (50%)</div>
                    </div>

                    <div className="prog-row">
                        <div className="prog-label">Berat (10-12 SKS)</div>
                        <div className="prog-bar-bg">
                            <div className="prog-bar-fill" style={{ width: '18%', background: 'var(--amber)' }}></div>
                        </div>
                        <div className="prog-val" style={{ color: 'var(--amber)' }}>86 (18%)</div>
                    </div>

                    <div className="prog-row">
                        <div className="prog-label">Sangat Berat (&gt; 12 SKS)</div>
                        <div className="prog-bar-bg">
                            <div className="prog-bar-fill" style={{ width: '6%', background: 'var(--rose)' }}></div>
                        </div>
                        <div className="prog-val" style={{ color: 'var(--rose)' }}>30 (6%)</div>
                    </div>

                    <div style={{ marginTop: '22px', padding: '14px', border: '1.5px dashed var(--border)', borderRadius: '12px', background: 'rgba(255,255,255,.5)' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <i className="bi bi-info-circle-fill text-primary" style={{ fontSize: '15px', marginTop: '2px' }}></i>
                            <p style={{ fontSize: '.72rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                                Beban mengajar ideal untuk dosen tetap adalah <strong>8-12 SKS per semester</strong> sesuai Permendikbudristek No. 53 Tahun 2023.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: BEBAN TABLE */}
            <div className="col-12 col-lg-8" data-aos="fade-left">
                <div className="card-custom" style={{ height: '100%' }}>
                    <div className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between">
                        <h5 className="font-poppins m-0" style={{ fontSize: '.9rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                            <i className="bi bi-list-task me-2 text-primary"></i>Rincian Beban Kerja
                        </h5>
                        <div className="fi-wrap" style={{ maxWidth: '200px' }}>
                            <i className="bi bi-search fi-icon"></i>
                            <input className="fi-input py-1.5" type="text" placeholder="Cari dosen..." style={{ fontSize: '.75rem' }} />
                        </div>
                    </div>

                    <div className="tbl-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nama Dosen</th>
                                    <th>Program Studi</th>
                                    <th style={{ textAlign: 'center' }}>Mata Kuliah</th>
                                    <th style={{ textAlign: 'center' }}>Total SKS</th>
                                    <th style={{ textAlign: 'center' }}>Mhs Wali</th>
                                    <th>Status Beban</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dosens.slice(0, 8).map((d, i) => {
                                    const level = d.sks <= 6
                                        ? { label: 'Ringan', cls: 'bp-green' }
                                        : d.sks <= 9
                                            ? { label: 'Normal', cls: 'bp-blue' }
                                            : d.sks <= 12
                                                ? { label: 'Berat', cls: 'bp-amber' }
                                                : { label: 'Sangat Berat', cls: 'bp-rose' };

                                    return (
                                        <tr key={d.id || d.nidn}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                                                    <div style={{
                                                        width: '30px',
                                                        height: '30px',
                                                        borderRadius: '8px',
                                                        background: avgColors[i % avgColors.length],
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '.65rem',
                                                        fontWeight: 800,
                                                        color: '#fff',
                                                        flexShrink: 0
                                                    }}>
                                                        {d.initials || d.nama.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div style={{ fontWeight: 700, fontSize: '.8rem', color: 'var(--text-dark)' }}>
                                                        {(d.nama_lengkap || d.nama).length > 28 ? (d.nama_lengkap || d.nama).slice(0, 28) + '…' : (d.nama_lengkap || d.nama)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>
                                                {d.prodi?.nama || d.prodi || '-'}
                                            </td>
                                            <td style={{ textAlign: 'center', fontWeight: 700 }}>
                                                {Array.isArray(d.mk) ? d.mk.length : 1}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '.95rem', fontWeight: 800, color: 'var(--primary)' }}>
                                                    {d.sks || 0}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {d.mhsBimbing || 0}
                                            </td>
                                            <td>
                                                <span className={`bp ${level.cls}`}>
                                                    {level.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* OVERLOAD WARNING SECTION */}
            <div className="col-12 mt-4" data-aos="fade-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <i className="bi bi-exclamation-triangle-fill text-rose" style={{ fontSize: '18px' }}></i>
                    <h6 className="font-poppins m-0" style={{ fontSize: '.85rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                        Perhatian: Dosen dengan Beban Mengajar Berlebih (&gt; 12 SKS)
                    </h6>
                </div>
                
                <div className="row g-3" id="overloadGrid">
                    {overloadDosens.length === 0 ? (
                        <div className="col-12 text-slate-500 font-medium text-xs">
                            Tidak ada dosen dengan beban mengajar berlebih.
                        </div>
                    ) : (
                        overloadDosens.map((d, i) => (
                            <div key={d.id || d.nidn} className="col-12 col-md-6 col-lg-4">
                                <div className="beban-card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '11px',
                                            background: avgColors[i % avgColors.length],
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '.75rem',
                                            fontWeight: 800,
                                            color: '#fff',
                                            flexShrink: 0
                                        }}>
                                            {d.initials || d.nama.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '.83rem', color: 'var(--text-dark)' }}>
                                                {(d.nama_lengkap || d.nama).length > 30 ? (d.nama_lengkap || d.nama).slice(0, 30) + '…' : (d.nama_lengkap || d.nama)}
                                            </div>
                                            <div style={{ fontSize: '.68rem', color: 'var(--text-muted)' }}>
                                                {d.prodi?.nama || d.prodi || '-'}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                                        <div style={{ textAlign: 'center', background: 'var(--rose-light)', borderRadius: '8px', padding: '8px' }}>
                                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 800, color: 'var(--rose)' }}>
                                                {d.sks}
                                            </div>
                                            <div style={{ fontSize: '.6rem', color: 'var(--rose)', fontWeight: 600 }}>SKS</div>
                                        </div>
                                        <div style={{ textAlign: 'center', background: 'var(--primary-light)', borderRadius: '8px', padding: '8px' }}>
                                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                                                {Array.isArray(d.mk) ? d.mk.length : 1}
                                            </div>
                                            <div style={{ fontSize: '.6rem', color: 'var(--primary)', fontWeight: 600 }}>MK</div>
                                        </div>
                                        <div style={{ textAlign: 'center', background: 'var(--accent-light)', borderRadius: '8px', padding: '8px' }}>
                                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 800, color: '#b45309' }}>
                                                {d.mhsBimbing}
                                            </div>
                                            <div style={{ fontSize: '.6rem', color: '#b45309', fontWeight: 600 }}>Mhs Wali</div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                        <span className="bp bp-rose" style={{ fontSize: '.65rem' }}>
                                            <i className="bi bi-exclamation-triangle-fill me-1"></i>Beban melebihi batas wajar
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
