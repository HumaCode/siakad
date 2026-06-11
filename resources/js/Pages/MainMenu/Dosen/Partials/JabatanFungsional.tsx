import React from 'react';

interface JabatanProdi {
    p: string;
    gb: number;
    lk: number;
    l: number;
    aa: number;
    total: number;
}

export default function JabatanFungsional({ dataProdi }: { dataProdi?: JabatanProdi[] }) {
    const list = dataProdi || [
        { p: 'Teknik Informatika', gb: 3, lk: 12, l: 28, aa: 18, total: 61 },
        { p: 'Sistem Informasi', gb: 2, lk: 10, l: 24, aa: 14, total: 50 },
        { p: 'Manajemen Bisnis', gb: 5, lk: 14, l: 32, aa: 22, total: 73 },
        { p: 'Ilmu Hukum', gb: 6, lk: 18, l: 42, aa: 28, total: 94 },
        { p: 'Kedokteran Gigi', gb: 4, lk: 16, l: 38, aa: 24, total: 82 },
        { p: 'Teknik Elektro', gb: 4, lk: 16, l: 34, aa: 28, total: 82 },
    ];

    return (
        <div>
            {/* CARDS STATS */}
            <div className="row g-3 mb-4" data-aos="fade-up">
                <div className="col-12 col-sm-6 col-md-3">
                    <div className="card-custom p-3 d-flex align-items-center justify-content-between" style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: '1.5px solid #ddd6fe' }}>
                        <div>
                            <span style={{ fontSize: '.73rem', fontWeight: 700, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                                Guru Besar
                            </span>
                            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--purple)', marginTop: '2px', lineHeight: 1.1 }}>
                                24
                            </div>
                            <span style={{ fontSize: '.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                5.0% dari total dosen
                            </span>
                        </div>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ddd6fe', color: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                            <i className="bi bi-award-fill"></i>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-md-3">
                    <div className="card-custom p-3 d-flex align-items-center justify-content-between" style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1.5px solid #bfdbfe' }}>
                        <div>
                            <span style={{ fontSize: '.73rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                                Lektor Kepala
                            </span>
                            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)', marginTop: '2px', lineHeight: 1.1 }}>
                                86
                            </div>
                            <span style={{ fontSize: '.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                17.8% dari total dosen
                            </span>
                        </div>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#bfdbfe', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                            <i className="bi bi-mortarboard-fill"></i>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-md-3">
                    <div className="card-custom p-3 d-flex align-items-center justify-content-between" style={{ background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)', border: '1.5px solid #99f6e4' }}>
                        <div>
                            <span style={{ fontSize: '.73rem', fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                                Lektor
                            </span>
                            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--teal)', marginTop: '2px', lineHeight: 1.1 }}>
                                198
                            </div>
                            <span style={{ fontSize: '.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                41.1% dari total dosen
                            </span>
                        </div>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#99f6e4', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                            <i className="bi bi-person-workspace"></i>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-md-3">
                    <div className="card-custom p-3 d-flex align-items-center justify-content-between" style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', border: '1.5px solid #fde68a' }}>
                        <div>
                            <span style={{ fontSize: '.73rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                                Asisten Ahli
                            </span>
                            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#b45309', marginTop: '2px', lineHeight: 1.1 }}>
                                174
                            </div>
                            <span style={{ fontSize: '.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                36.1% dari total dosen
                            </span>
                        </div>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fde68a', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                            <i className="bi bi-journal-check"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLE OF JABATAN PER PRODI */}
            <div className="card-custom" data-aos="fade-up" data-aos-delay="100">
                <div className="px-4 py-3 border-bottom">
                    <h5 className="font-poppins m-0" style={{ fontSize: '.9rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                        <i className="bi bi-diagram-3-fill me-2 text-primary"></i>Komposisi Jabatan per Program Studi
                    </h5>
                </div>
                
                <div className="tbl-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Program Studi</th>
                                <th style={{ textAlign: 'center' }}>Guru Besar (GB)</th>
                                <th style={{ textAlign: 'center' }}>Lektor Kepala (LK)</th>
                                <th style={{ textAlign: 'center' }}>Lektor (L)</th>
                                <th style={{ textAlign: 'center' }}>Asisten Ahli (AA)</th>
                                <th style={{ textAlign: 'center' }}>Total Dosen</th>
                                <th>Rasio Dosen : Mahasiswa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((j) => {
                                // Rasio calculation as done in the html template
                                const rasio = (12480 / 482 / j.total).toFixed(1);
                                const rasioVal = parseFloat(rasio);
                                const rasioColor = rasioVal < 20 ? 'var(--green)' : rasioVal < 30 ? 'var(--primary)' : 'var(--rose)';

                                return (
                                    <tr key={j.p}>
                                        <td style={{ fontWeight: 600 }}>{j.p}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className="bp bp-purple">{j.gb}</span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className="bp bp-blue">{j.lk}</span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className="bp bp-teal">{j.l}</span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className="bp bp-amber">{j.aa}</span>
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: 800, fontSize: '.9rem', color: 'var(--text-dark)' }}>
                                            {j.total}
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 700, color: rasioColor }}>
                                                1 : {rasio}
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
    );
}
