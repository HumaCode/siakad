import React from 'react';
import { Link, router } from '@inertiajs/react';

export default function MahasiswaTable({ mahasiswas, onEdit, onDetail }: any) {
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

    return (
        <div id="viewTable" data-aos="fade-up" data-aos-duration="500">
            <div className="card-custom">
                <div style={{ padding: '14px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>
                        Menampilkan <strong>{mahasiswas.data.length}</strong> dari <strong>{mahasiswas.total}</strong> mahasiswa
                    </div>
                </div>
                <div className="tbl-wrap" style={{ padding: '10px 0 0' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="chk-col"><input type="checkbox" /></th>
                                <th>NIM</th>
                                <th>Mahasiswa</th>
                                <th>Program Studi</th>
                                <th>Angkatan</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mahasiswas.data.length > 0 ? mahasiswas.data.map((mhs: any) => (
                                <tr key={mhs.id}>
                                    <td className="chk-col"><input type="checkbox" /></td>
                                    <td><span className="nim-code">{mhs.nim}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div className="mhs-avatar bg-primary overflow-hidden flex items-center justify-center">
                                                {mhs.foto_url ? (
                                                    <img src={mhs.foto_url} alt={mhs.nama} className="w-full h-full object-cover" />
                                                ) : (
                                                    mhs.nama.substring(0, 2).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <div className="mhs-name">{mhs.nama}</div>
                                                <div className="mhs-email">{mhs.user?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--text-dark)' }}>{mhs.prodi?.nama}</div>
                                        <div style={{ fontSize: '.7rem', color: 'var(--text-muted)' }}>{mhs.prodi?.jenjang}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{mhs.angkatan}</div>
                                    </td>
                                    <td>
                                        <span className={`badge-pill ${getBadgeClass(mhs.status_akademik)}`}>
                                            {getStatusLabel(mhs.status_akademik)}
                                        </span>
                                    </td>
                                    <td>
                                         <div style={{ display: 'flex', gap: '6px' }}>
                                             <button className="btn-icon bi-view" onClick={() => onDetail(mhs)} title="Detail"><i className="bi bi-eye-fill"></i></button>
                                             <button className="btn-icon bi-edit" onClick={() => onEdit(mhs)} title="Edit"><i className="bi bi-pencil-fill"></i></button>
                                             <button className="btn-icon bi-del" onClick={() => {
                                                 if (confirm('Hapus mahasiswa ini?')) {
                                                     router.delete(route('mahasiswa.destroy', mhs.id), {
                                                         preserveScroll: true
                                                     });
                                                 }
                                             }} title="Hapus"><i className="bi bi-trash-fill"></i></button>
                                         </div>
                                     </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-4 text-muted">
                                        Tidak ada data mahasiswa.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Simplified for now) */}
                {mahasiswas.links && mahasiswas.last_page > 1 && (
                    <div className="d-flex justify-content-center p-3">
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
        </div>
    );
}
