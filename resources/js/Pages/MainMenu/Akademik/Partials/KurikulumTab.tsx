import React, { useState } from 'react';

interface KurikulumItem {
    id: number;
    prodi: string;
    jenjang: string;
    tahun: number;
    akreditasi: string;
    status: 'Aktif' | 'Revisi' | 'Tidak Aktif';
    deskripsi: string;
    sks: number;
    mkCount: number;
    semesters: number;
    kaprodi: string;
    icon: string;
    bgIcon: string;
    colorIcon: string;
    classPrefix: string;
}

interface KurikulumTabProps {
    fakultas: any[];
    onOpenModal: () => void;
}

const kurikulumData: KurikulumItem[] = [
    {
        id: 1,
        prodi: 'Teknik Informatika',
        jenjang: 'S1',
        tahun: 2023,
        akreditasi: 'Unggul',
        status: 'Aktif',
        deskripsi: 'Kurikulum berbasis KKNI Level 6, menekankan pada rekayasa perangkat lunak, kecerdasan buatan, dan keamanan siber.',
        sks: 148,
        mkCount: 62,
        semesters: 8,
        kaprodi: 'Dr. Budi S., M.Kom',
        icon: 'bi-cpu-fill',
        bgIcon: '#e8f0fe',
        colorIcon: '#1a56db',
        classPrefix: 'kc-ti'
    },
    {
        id: 2,
        prodi: 'Sistem Informasi',
        jenjang: 'S1',
        tahun: 2022,
        akreditasi: 'Unggul',
        status: 'Aktif',
        deskripsi: 'Fokus pada perancangan dan pengelolaan sistem informasi bisnis, analitik data, dan transformasi digital.',
        sks: 144,
        mkCount: 58,
        semesters: 8,
        kaprodi: 'Dr. Rina W., M.T',
        icon: 'bi-database-fill',
        bgIcon: 'var(--teal-light)',
        colorIcon: 'var(--teal)',
        classPrefix: 'kc-si'
    },
    {
        id: 3,
        prodi: 'Manajemen Bisnis',
        jenjang: 'S1',
        tahun: 2023,
        akreditasi: 'A',
        status: 'Aktif',
        deskripsi: 'Mengembangkan kompetensi manajemen strategis, kewirausahaan, pemasaran, dan keuangan bisnis modern.',
        sks: 144,
        mkCount: 55,
        semesters: 8,
        kaprodi: 'Prof. Hendra K., Ph.D',
        icon: 'bi-briefcase-fill',
        bgIcon: 'var(--accent-light)',
        colorIcon: '#b45309',
        classPrefix: 'kc-mb'
    },
    {
        id: 4,
        prodi: 'Ilmu Hukum',
        jenjang: 'S1',
        tahun: 2021,
        akreditasi: 'A',
        status: 'Revisi',
        deskripsi: 'Pembentukan ahli hukum yang kompeten di bidang hukum perdata, pidana, tata negara, dan hukum internasional.',
        sks: 152,
        mkCount: 64,
        semesters: 8,
        kaprodi: 'Dr. Sari D., S.H., M.H',
        icon: 'bi-bank2',
        bgIcon: 'var(--purple-light)',
        colorIcon: 'var(--purple)',
        classPrefix: 'kc-hk'
    },
    {
        id: 5,
        prodi: 'Kedokteran Gigi',
        jenjang: 'S1',
        tahun: 2022,
        akreditasi: 'B',
        status: 'Aktif',
        deskripsi: 'Mencetak dokter gigi yang kompeten dan beretika dalam pelayanan kesehatan gigi dan mulut di masyarakat.',
        sks: 160,
        mkCount: 72,
        semesters: 10,
        kaprodi: 'Prof. Agus M., Ph.D',
        icon: 'bi-heart-pulse-fill',
        bgIcon: 'var(--rose-light)',
        colorIcon: 'var(--rose)',
        classPrefix: 'kc-kd'
    },
    {
        id: 6,
        prodi: 'Teknik Elektro',
        jenjang: 'S1',
        tahun: 2023,
        akreditasi: 'A',
        status: 'Aktif',
        deskripsi: 'Menghasilkan insinyur elektro yang ahli dalam sistem tenaga, elektronika, telekomunikasi, dan otomasi industri.',
        sks: 144,
        mkCount: 60,
        semesters: 8,
        kaprodi: 'Ir. Surya P., M.T',
        icon: 'bi-lightning-charge-fill',
        bgIcon: 'var(--green-light)',
        colorIcon: 'var(--green)',
        classPrefix: 'kc-te'
    }
];

export default function KurikulumTab({ fakultas, onOpenModal }: KurikulumTabProps) {
    const [search, setSearch] = useState('');
    const [selectedFakultas, setSelectedFakultas] = useState('Semua Fakultas');
    const [selectedTahun, setSelectedTahun] = useState('Semua Tahun');

    const filteredKurikulum = kurikulumData.filter(item => {
        const matchesSearch = item.prodi.toLowerCase().includes(search.toLowerCase()) ||
            item.kaprodi.toLowerCase().includes(search.toLowerCase());
        const matchesTahun = selectedTahun === 'Semua Tahun' || item.tahun.toString() === selectedTahun;
        return matchesSearch && matchesTahun;
    });

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Aktif': return 'bp-blue';
            case 'Revisi': return 'bp-purple';
            default: return 'bp-gray';
        }
    };

    return (
        <div className="tab-panel active">
            {/* Filter */}
            <div className="card-custom mb-6 p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="fi-wrap flex-1 min-w-[200px]">
                        <i className="bi bi-search fi-icon" />
                        <input
                            className="fi w-full"
                            type="text"
                            placeholder="Cari program studi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="fsel"
                        value={selectedFakultas}
                        onChange={(e) => setSelectedFakultas(e.target.value)}
                    >
                        <option>Semua Fakultas</option>
                        {fakultas.map(f => (
                            <option key={f.id}>{f.nama}</option>
                        ))}
                    </select>
                    <select
                        className="fsel"
                        value={selectedTahun}
                        onChange={(e) => setSelectedTahun(e.target.value)}
                    >
                        <option>Semua Tahun</option>
                        <option>2024</option>
                        <option>2023</option>
                        <option>2022</option>
                        <option>2021</option>
                    </select>
                    <button className="btn-add cursor-pointer" onClick={onOpenModal}>
                        <i className="bi bi-plus-lg" /> Tambah Prodi
                    </button>
                    <button className="btn-outline cursor-pointer">
                        <i className="bi bi-download" /> Export
                    </button>
                </div>
                <div className="mt-3 px-1">
                    <small className="text-xs text-slate-400">
                        Menampilkan {filteredKurikulum.length} dari {kurikulumData.length} program studi
                    </small>
                </div>
            </div>

            {/* Kurikulum Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKurikulum.map((item) => (
                    <div key={item.id} className={`kurikulum-card ${item.classPrefix}`}>
                        <div className="kc-header">
                            <div className="flex items-center gap-3 flex-1">
                                <div
                                    className="kc-icon"
                                    style={{ backgroundColor: item.bgIcon, color: item.colorIcon }}
                                >
                                    <i className={`bi ${item.icon}`} />
                                </div>
                                <div>
                                    <div className="kc-title">{item.prodi}</div>
                                    <div className="kc-sub">
                                        {item.jenjang} · Kurikulum {item.tahun} · Akreditasi{' '}
                                        <strong className="text-amber-500">{item.akreditasi}</strong>
                                    </div>
                                </div>
                            </div>
                            <span className={`badge-pill ${getStatusBadgeClass(item.status)}`}>
                                {item.status}
                            </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                            {item.deskripsi}
                        </div>
                        <div className="kc-stats">
                            <div className="kcs-item">
                                <span className="kcs-num text-blue-600 dark:text-blue-400">{item.sks}</span>
                                <span className="kcs-lbl">SKS Total</span>
                            </div>
                            <div className="kcs-item">
                                <span className="kcs-num text-teal-600 dark:text-teal-400">{item.mkCount}</span>
                                <span className="kcs-lbl">Mata Kuliah</span>
                            </div>
                            <div className="kcs-item">
                                <span className="kcs-num text-amber-600 dark:text-amber-400">{item.semesters}</span>
                                <span className="kcs-lbl">Semester</span>
                            </div>
                        </div>
                        <div className="kc-footer">
                            <div className="text-xs text-slate-500">
                                Kaprodi: <strong className="text-slate-700 dark:text-slate-300">{item.kaprodi}</strong>
                            </div>
                            <div className="flex gap-1.5">
                                <button className="btn-icon bi-detail" title="Detail kurikulum">
                                    <i className="bi bi-eye" />
                                </button>
                                <button className="btn-icon bi-edit" title="Edit" onClick={onOpenModal}>
                                    <i className="bi bi-pencil" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
