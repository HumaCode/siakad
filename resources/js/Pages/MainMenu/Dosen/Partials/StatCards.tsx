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
        <div className="row g-3 mb-4">
            <div className="col-6 col-md-4 col-lg-2">
                <div className="stat-mini">
                    <div className="sm-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                        <i className="bi bi-person-badge-fill"></i>
                    </div>
                    <div className="sm-num" style={{ color: 'var(--primary)' }}>
                        {data.totalDosen.toLocaleString('id-ID')}
                    </div>
                    <div className="sm-lbl">Total Dosen</div>
                    <div className="sm-badge" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                        <i className="bi bi-arrow-up-short"></i>+8 bulan ini
                    </div>
                </div>
            </div>

            <div className="col-6 col-md-4 col-lg-2">
                <div className="stat-mini">
                    <div className="sm-icon" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                        <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <div className="sm-num" style={{ color: 'var(--green)' }}>
                        {data.dosenAktif.toLocaleString('id-ID')}
                    </div>
                    <div className="sm-lbl">Dosen Aktif</div>
                    <div className="sm-badge" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                        95.6%
                    </div>
                </div>
            </div>

            <div className="col-6 col-md-4 col-lg-2">
                <div className="stat-mini">
                    <div className="sm-icon" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>
                        <i className="bi bi-award-fill"></i>
                    </div>
                    <div className="sm-num" style={{ color: 'var(--purple)' }}>
                        {data.bergelarDoktor.toLocaleString('id-ID')}
                    </div>
                    <div className="sm-lbl">Bergelar Doktor</div>
                    <div className="sm-badge" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>
                        26.6%
                    </div>
                </div>
            </div>

            <div className="col-6 col-md-4 col-lg-2">
                <div className="stat-mini">
                    <div className="sm-icon" style={{ background: 'var(--accent-light)', color: '#b45309' }}>
                        <i className="bi bi-journal-richtext"></i>
                    </div>
                    <div className="sm-num" style={{ color: '#b45309' }}>
                        {data.sesiMengajar.toLocaleString('id-ID')}
                    </div>
                    <div className="sm-lbl">Sesi Mengajar</div>
                    <div className="sm-badge" style={{ background: 'var(--accent-light)', color: '#b45309' }}>
                        Per minggu
                    </div>
                </div>
            </div>

            <div className="col-6 col-md-4 col-lg-2">
                <div className="stat-mini">
                    <div className="sm-icon" style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}>
                        <i className="bi bi-star-fill"></i>
                    </div>
                    <div className="sm-num" style={{ color: 'var(--teal)' }}>
                        {data.rating.toFixed(2)}
                    </div>
                    <div className="sm-lbl">Rata-rata Rating</div>
                    <div className="sm-badge" style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}>
                        <i className="bi bi-arrow-up-short"></i>+0.06
                    </div>
                </div>
            </div>

            <div className="col-6 col-md-4 col-lg-2">
                <div className="stat-mini">
                    <div className="sm-icon" style={{ background: 'var(--indigo-light)', color: 'var(--indigo)' }}>
                        <i className="bi bi-file-earmark-text-fill"></i>
                    </div>
                    <div className="sm-num" style={{ color: 'var(--indigo)' }}>
                        {data.publikasi.toLocaleString('id-ID')}
                    </div>
                    <div className="sm-lbl">Total Publikasi</div>
                    <div className="sm-badge" style={{ background: 'var(--indigo-light)', color: 'var(--indigo)' }}>
                        <i className="bi bi-arrow-up-short"></i>+84
                    </div>
                </div>
            </div>
        </div>
    );
}
