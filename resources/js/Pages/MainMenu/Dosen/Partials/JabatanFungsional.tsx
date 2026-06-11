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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4" data-aos="fade-up">
                {/* Guru Besar */}
                <div
                    className="card-custom p-4 text-center d-flex flex-column align-items-center justify-content-center"
                    style={{
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
                        border: '1px solid rgba(0, 0, 0, 0.04)',
                        minHeight: '135px',
                        transition: 'transform 0.25s ease-in-out',
                    }}
                >
                    <div style={{ fontSize: '2.3rem', fontWeight: '800', color: 'var(--purple)', lineHeight: 1.1, marginBottom: '6px' }}>
                        24
                    </div>
                    <div style={{ fontSize: '.78rem', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>
                        Guru Besar
                    </div>
                    <div
                        style={{
                            background: '#f5f3ff',
                            color: 'var(--purple)',
                            fontSize: '.68rem',
                            fontWeight: '700',
                            padding: '3px 12px',
                            borderRadius: '20px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            border: '1px solid rgba(124, 58, 237, 0.08)'
                        }}
                    >
                        5.0% dari total dosen
                    </div>
                </div>

                {/* Lektor Kepala */}
                <div
                    className="card-custom p-4 text-center d-flex flex-column align-items-center justify-content-center"
                    style={{
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
                        border: '1px solid rgba(0, 0, 0, 0.04)',
                        minHeight: '135px',
                        transition: 'transform 0.25s ease-in-out',
                    }}
                >
                    <div style={{ fontSize: '2.3rem', fontWeight: '800', color: 'var(--primary)', lineHeight: 1.1, marginBottom: '6px' }}>
                        86
                    </div>
                    <div style={{ fontSize: '.78rem', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>
                        Lektor Kepala
                    </div>
                    <div
                        style={{
                            background: '#eff6ff',
                            color: 'var(--primary)',
                            fontSize: '.68rem',
                            fontWeight: '700',
                            padding: '3px 12px',
                            borderRadius: '20px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            border: '1px solid rgba(37, 99, 235, 0.08)'
                        }}
                    >
                        17.8% dari total dosen
                    </div>
                </div>

                {/* Lektor */}
                <div
                    className="card-custom p-4 text-center d-flex flex-column align-items-center justify-content-center"
                    style={{
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
                        border: '1px solid rgba(0, 0, 0, 0.04)',
                        minHeight: '135px',
                        transition: 'transform 0.25s ease-in-out',
                    }}
                >
                    <div style={{ fontSize: '2.3rem', fontWeight: '800', color: 'var(--teal)', lineHeight: 1.1, marginBottom: '6px' }}>
                        198
                    </div>
                    <div style={{ fontSize: '.78rem', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>
                        Lektor
                    </div>
                    <div
                        style={{
                            background: '#f0fdfa',
                            color: 'var(--teal)',
                            fontSize: '.68rem',
                            fontWeight: '700',
                            padding: '3px 12px',
                            borderRadius: '20px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            border: '1px solid rgba(13, 148, 136, 0.08)'
                        }}
                    >
                        41.1% dari total dosen
                    </div>
                </div>

                {/* Asisten Ahli */}
                <div
                    className="card-custom p-4 text-center d-flex flex-column align-items-center justify-content-center"
                    style={{
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
                        border: '1px solid rgba(0, 0, 0, 0.04)',
                        minHeight: '135px',
                        transition: 'transform 0.25s ease-in-out',
                    }}
                >
                    <div style={{ fontSize: '2.3rem', fontWeight: '800', color: '#b45309', lineHeight: 1.1, marginBottom: '6px' }}>
                        174
                    </div>
                    <div style={{ fontSize: '.78rem', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>
                        Asisten Ahli
                    </div>
                    <div
                        style={{
                            background: '#fffbeb',
                            color: '#b45309',
                            fontSize: '.68rem',
                            fontWeight: '700',
                            padding: '3px 12px',
                            borderRadius: '20px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            border: '1px solid rgba(217, 119, 6, 0.08)'
                        }}
                    >
                        36.1% dari total dosen
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
