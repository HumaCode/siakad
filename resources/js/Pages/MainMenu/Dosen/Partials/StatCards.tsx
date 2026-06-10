import React from 'react';

export default function StatCards({ stats }: { stats?: any }) {
    const data = stats || {
        totalDosen: 482,
        dosenAktif: 461,
        bergelarDoktor: 128,
        sesiMengajar: 892,
        rating: 4.32,
        publikasi: 1247
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
            {/* Card 1 */}
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
                <div style={{ fontSize: '2.3rem', fontWeight: '800', color: '#2563eb', lineHeight: 1.1, marginBottom: '6px' }}>
                    {data.totalDosen.toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: '.78rem', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>
                    Total Dosen
                </div>
                <div
                    style={{
                        background: '#eff6ff',
                        color: '#2563eb',
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
                    <i className="bi bi-check-circle-fill" style={{ fontSize: '.65rem' }}></i> Aktif
                </div>
            </div>

            {/* Card 2 */}
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
                <div style={{ fontSize: '2.3rem', fontWeight: '800', color: '#0d9488', lineHeight: 1.1, marginBottom: '6px' }}>
                    {data.dosenAktif.toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: '.78rem', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>
                    Dosen Aktif
                </div>
                <div
                    style={{
                        background: '#f0fdfa',
                        color: '#0d9488',
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
                    Semester ini
                </div>
            </div>

            {/* Card 3 */}
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
                <div style={{ fontSize: '2.3rem', fontWeight: '800', color: '#7c3aed', lineHeight: 1.1, marginBottom: '6px' }}>
                    {data.bergelarDoktor.toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: '.78rem', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>
                    Bergelar Doktor
                </div>
                <div
                    style={{
                        background: '#f5f3ff',
                        color: '#7c3aed',
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
                    S3 Pendidikan
                </div>
            </div>

            {/* Card 4 */}
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
                <div style={{ fontSize: '2.3rem', fontWeight: '800', color: '#ea580c', lineHeight: 1.1, marginBottom: '6px' }}>
                    {data.sesiMengajar.toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: '.78rem', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>
                    Sesi Mengajar
                </div>
                <div
                    style={{
                        background: '#fffbeb',
                        color: '#d97706',
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
                    Mingguan
                </div>
            </div>

            {/* Card 5 */}
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
                <div style={{ fontSize: '2.3rem', fontWeight: '800', color: '#16a34a', lineHeight: 1.1, marginBottom: '6px' }}>
                    {data.publikasi.toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: '.78rem', color: '#4b5563', fontWeight: '600', marginBottom: '8px' }}>
                    Total Publikasi
                    </div>
                    <div
                        style={{
                            background: '#f0fdf4',
                            color: '#16a34a',
                            fontSize: '.68rem',
                            fontWeight: '700',
                            padding: '3px 12px',
                            borderRadius: '20px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            border: '1px solid rgba(22, 163, 74, 0.08)'
                        }}
                    >
                        Tersedia
                    </div>
                </div>
            </div>
    );
}
