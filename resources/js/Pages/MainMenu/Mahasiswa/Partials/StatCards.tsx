import React from 'react';

export default function StatCards({ stats }: { stats: any }) {
    const calcPercent = (part: number, total: number) => {
        if (!total) return 0;
        return ((part / total) * 100).toFixed(1);
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            <div data-aos="fade-up" data-aos-delay="0">
                <div className="stat-mini" style={{ '--c': 'var(--primary)' } as any}>
                    <div className="sm-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                        <i className="bi bi-people-fill"></i>
                    </div>
                    <div className="sm-num" style={{ color: 'var(--primary)' }}>{stats.total || 0}</div>
                    <div className="sm-lbl">Total Mahasiswa</div>
                    <div className="sm-change" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                        <i className="bi bi-arrow-up-short"></i>+124 baru
                    </div>
                </div>
            </div>
            <div data-aos="fade-up" data-aos-delay="70">
                <div className="stat-mini">
                    <div className="sm-icon" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                        <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <div className="sm-num" style={{ color: 'var(--green)' }}>{stats.aktif || 0}</div>
                    <div className="sm-lbl">Status Aktif</div>
                    <div className="sm-change" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                        {calcPercent(stats.aktif, stats.total)}% dari total
                    </div>
                </div>
            </div>
            <div data-aos="fade-up" data-aos-delay="140">
                <div className="stat-mini">
                    <div className="sm-icon" style={{ background: 'var(--accent-light)', color: '#b45309' }}>
                        <i className="bi bi-pause-circle-fill"></i>
                    </div>
                    <div className="sm-num" style={{ color: '#b45309' }}>{stats.cuti || 0}</div>
                    <div className="sm-lbl">Cuti Akademik</div>
                    <div className="sm-change" style={{ background: 'var(--accent-light)', color: '#b45309' }}>
                        {calcPercent(stats.cuti, stats.total)}% dari total
                    </div>
                </div>
            </div>
            <div data-aos="fade-up" data-aos-delay="210">
                <div className="stat-mini">
                    <div className="sm-icon" style={{ background: 'var(--rose-light)', color: 'var(--rose)' }}>
                        <i className="bi bi-x-circle-fill"></i>
                    </div>
                    <div className="sm-num" style={{ color: 'var(--rose)' }}>{stats.nonaktif || 0}</div>
                    <div className="sm-lbl">Nonaktif / DO</div>
                    <div className="sm-change" style={{ background: 'var(--rose-light)', color: 'var(--rose)' }}>
                        {calcPercent(stats.nonaktif, stats.total)}% dari total
                    </div>
                </div>
            </div>
            <div data-aos="fade-up" data-aos-delay="280">
                <div className="stat-mini">
                    <div className="sm-icon" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>
                        <i className="bi bi-mortarboard-fill"></i>
                    </div>
                    <div className="sm-num" style={{ color: 'var(--purple)' }}>{stats.lulus || 0}</div>
                    <div className="sm-lbl">Lulus Tahun Ini</div>
                    <div className="sm-change" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>
                        <i className="bi bi-arrow-up-short"></i>+8.2%
                    </div>
                </div>
            </div>
            <div data-aos="fade-up" data-aos-delay="350">
                <div className="stat-mini">
                    <div className="sm-icon" style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}>
                        <i className="bi bi-graph-up-arrow"></i>
                    </div>
                    <div className="sm-num" style={{ color: 'var(--teal)' }}>3.42</div>
                    <div className="sm-lbl">Rata-rata IPK</div>
                    <div className="sm-change" style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}>
                        <i className="bi bi-arrow-up-short"></i>+0.04
                    </div>
                </div>
            </div>
        </div>
    );
}
