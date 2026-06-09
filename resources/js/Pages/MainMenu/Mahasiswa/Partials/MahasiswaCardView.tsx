import React from 'react';
import { Link, router } from '@inertiajs/react';

export default function MahasiswaCardView({ mahasiswas, onEdit }: any) {
    const avatarGrads = [
        'linear-gradient(135deg,#1a56db,#4f83f0)',
        'linear-gradient(135deg,#0d9488,#2dd4bf)',
        'linear-gradient(135deg,#7c3aed,#a78bfa)',
        'linear-gradient(135deg,#f59e0b,#fbbf24)',
        'linear-gradient(135deg,#e11d48,#fb7185)',
        'linear-gradient(135deg,#16a34a,#4ade80)',
        'linear-gradient(135deg,#ea580c,#fb923c)',
        'linear-gradient(135deg,#4338ca,#818cf8)',
    ];

    const getBadgeClass = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'aktif': return 'bp-green';
            case 'cuti': return 'bp-amber';
            case 'lulus': return 'bp-purple';
            case 'do':
            case 'drop out':
            case 'non-aktif': return 'bp-rose';
            default: return 'bp-gray';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'aktif': return 'Aktif';
            case 'cuti': return 'Cuti';
            case 'lulus': return 'Lulus';
            case 'do': return 'Drop Out';
            default: return status || '';
        }
    };

    const getIpkColor = (ipk: number) => {
        if (ipk >= 3.5) return 'var(--green)';
        if (ipk >= 3.0) return 'var(--primary)';
        if (ipk >= 2.5) return '#b45309';
        return 'var(--rose)';
    };

    const getDeterministicStats = (nim: string) => {
        let hash = 0;
        const str = nim || '';
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        hash = Math.abs(hash);

        const ipk = (3.0 + (hash % 10) * 0.09).toFixed(2);
        const sks = 60 + (hash % 85);
        const semester = Math.min(8, (hash % 8) + 1);

        return { ipk, sks, semester };
    };

    const getHashForGradient = (nim: string) => {
        let hash = 0;
        const str = nim || '';
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    };

    return (
        <div id="viewCard" data-aos="fade-up" data-aos-duration="500">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {mahasiswas.data.length > 0 ? mahasiswas.data.map((mhs: any) => {
                    const hash = getHashForGradient(mhs.nim);
                    const color = avatarGrads[hash % avatarGrads.length];
                    const { ipk, sks, semester } = getDeterministicStats(mhs.nim);
                    const initials = mhs.nama.substring(0, 2).toUpperCase();

                    return (
                        <div key={mhs.id}>
                            <div className="student-card">
                                <div className="sc-top">
                                    <div className="sc-cover" style={{ background: color, opacity: 0.85 }}></div>
                                    <div className="sc-avatar overflow-hidden flex items-center justify-center" style={{ background: color }}>
                                        {mhs.foto_url ? (
                                            <img src={mhs.foto_url} alt={mhs.nama} className="w-full h-full object-cover" />
                                        ) : (
                                            initials
                                        )}
                                    </div>
                                    <div className="sc-name">{mhs.nama}</div>
                                    <div><span className="sc-nim">{mhs.nim}</span></div>
                                    <div className="sc-prodi"><i className="bi bi-building me-1"></i>{mhs.prodi?.nama}</div>
                                    <div className="sc-stats">
                                        <div className="sc-stat">
                                            <span className="sc-stat-num" style={{ color: getIpkColor(parseFloat(ipk)) }}>{ipk}</span>
                                            <span className="sc-stat-lbl">IPK</span>
                                        </div>
                                        <div className="sc-stat">
                                            <span className="sc-stat-num" style={{ color: 'var(--primary)' }}>{sks}</span>
                                            <span className="sc-stat-lbl">SKS</span>
                                        </div>
                                        <div className="sc-stat">
                                            <span className="sc-stat-num" style={{ color: 'var(--teal)' }}>{semester}</span>
                                            <span className="sc-stat-lbl">Semester</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="sc-footer">
                                    <div className="sc-status">
                                        <span className={`badge-pill ${getBadgeClass(mhs.status_akademik)}`}>
                                            {getStatusLabel(mhs.status_akademik)}
                                        </span>
                                    </div>
                                    <div className="sc-actions">
                                        <button className="btn-icon bi-edit" onClick={(e) => { e.stopPropagation(); onEdit(mhs); }} title="Edit"><i className="bi bi-pencil-fill"></i></button>
                                        <button className="btn-icon bi-del" onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Hapus mahasiswa ini?')) {
                                                router.delete(route('mahasiswa.destroy', mhs.id), {
                                                    preserveScroll: true
                                                });
                                            }
                                        }} title="Hapus"><i className="bi bi-trash-fill"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="col-span-full text-center py-5 text-muted">
                        Tidak ada data mahasiswa.
                    </div>
                )}
            </div>

            {/* Pagination */}
            {mahasiswas.links && mahasiswas.last_page > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <div className="btn-group">
                        {mahasiswas.links.map((link: any, index: number) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`btn btn-sm ${link.active ? 'btn-primary' : 'btn-outline-secondary'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
