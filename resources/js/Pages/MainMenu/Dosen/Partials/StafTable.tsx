import React from 'react';
import { avgColors, statusBadge } from './DosenTable';

interface StafItem {
    nip: string;
    nama: string;
    initials: string;
    divisi: string;
    jabatan: string;
    masaKerja: string;
    status: string;
}

interface StafTableProps {
    stafList?: StafItem[];
    onEdit?: (staf: StafItem) => void;
    onDelete?: (staf: StafItem) => void;
    onView?: (staf: StafItem) => void;
}

export default function StafTable({
    stafList,
    onEdit,
    onDelete,
    onView
}: StafTableProps) {
    const list = stafList || [
        { nip: '199001202019022001', nama: 'Dewi Kartika, S.E', initials: 'DK', divisi: 'Keuangan', jabatan: 'Kepala Bagian Keuangan', masaKerja: '7 tahun', status: 'Aktif' },
        { nip: '198812152018031002', nama: 'Rudi Santoso, A.Md', initials: 'RS', divisi: 'Akademik & Registrar', jabatan: 'Staff Registrasi', masaKerja: '8 tahun', status: 'Aktif' },
        { nip: '199203282020012003', nama: 'Ayu Lestari, S.Kom', initials: 'AL', divisi: 'IT & Infrastruktur', jabatan: 'Admin Sistem SIAKAD', masaKerja: '6 tahun', status: 'Aktif' },
        { nip: '198507112016041004', nama: 'Bambang Suharto', initials: 'BS', divisi: 'Kemahasiswaan', jabatan: 'Staff Kemahasiswaan', masaKerja: '10 tahun', status: 'Aktif' },
        { nip: '199510052021022005', nama: 'Nurul Fadhilah, S.IP', initials: 'NF', divisi: 'Perpustakaan', jabatan: 'Pustakawan', masaKerja: '5 tahun', status: 'Aktif' },
        { nip: '198902172019032006', nama: 'Hendro Prabowo', initials: 'HP', divisi: 'IT & Infrastruktur', jabatan: 'Network Administrator', masaKerja: '7 tahun', status: 'Cuti' },
        { nip: '199112082022011007', nama: 'Dita Pratiwi, S.Akt', initials: 'DP', divisi: 'Keuangan', jabatan: 'Staf Keuangan', masaKerja: '4 tahun', status: 'Aktif' },
        { nip: '198706202015041008', nama: 'Haryono, S.E.', initials: 'HY', divisi: 'Akademik & Registrar', jabatan: 'Kepala Administrasi', masaKerja: '11 tahun', status: 'Aktif' },
    ];

    const divisiColor: Record<string, string> = {
        'Keuangan': 'bp-green',
        'Akademik & Registrar': 'bp-blue',
        'IT & Infrastruktur': 'bp-purple',
        'Kemahasiswaan': 'bp-amber',
        'Perpustakaan': 'bp-teal'
    };

    return (
        <div className="card-custom" data-aos="fade-up">
            <div className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between">
                <h5 className="font-poppins m-0" style={{ fontSize: '.9rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                    <i className="bi bi-people-fill me-2 text-teal"></i>Daftar Staf Non-Dosen
                </h5>
                <div className="fi-wrap" style={{ maxWidth: '200px' }}>
                    <i className="bi bi-search fi-icon"></i>
                    <input className="fi-input py-1.5" type="text" placeholder="Cari staf..." style={{ fontSize: '.75rem' }} />
                </div>
            </div>

            <div className="tbl-wrap">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>NIP / ID</th>
                            <th>Nama Lengkap</th>
                            <th>Divisi / Bagian</th>
                            <th>Jabatan Struktural</th>
                            <th>Masa Kerja</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((s, i) => (
                            <tr key={s.nip}>
                                <td>
                                    <span style={{
                                        fontFamily: 'monospace',
                                        fontSize: '.72rem',
                                        fontWeight: 700,
                                        color: 'var(--teal)',
                                        background: 'var(--teal-light)',
                                        padding: '2px 7px',
                                        borderRadius: '5px'
                                    }}>
                                        {s.nip.slice(-8)}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '34px',
                                            height: '34px',
                                            borderRadius: '9px',
                                            background: avgColors[i % avgColors.length],
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '.68rem',
                                            fontWeight: 800,
                                            color: '#fff'
                                        }}>
                                            {s.initials}
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: '.82rem' }}>
                                            {s.nama}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`bp ${divisiColor[s.divisi] || 'bp-gray'}`}>
                                        {s.divisi}
                                    </span>
                                </td>
                                <td style={{ fontSize: '.78rem', color: 'var(--text-dark)' }}>
                                    {s.jabatan}
                                </td>
                                <td style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>
                                    {s.masaKerja}
                                </td>
                                <td>{statusBadge(s.status)}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button
                                            className="btn-icon bi-view"
                                            title="Detail"
                                            onClick={() => onView && onView(s)}
                                        >
                                            <i className="bi bi-eye"></i>
                                        </button>
                                        <button
                                            className="btn-icon bi-edit"
                                            title="Edit"
                                            onClick={() => onEdit && onEdit(s)}
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button
                                            className="btn-icon bi-del"
                                            title="Hapus"
                                            onClick={() => onDelete && onDelete(s)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
