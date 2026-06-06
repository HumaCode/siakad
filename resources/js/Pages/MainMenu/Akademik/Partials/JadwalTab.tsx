import React, { useState } from 'react';

interface ScheduleItem {
    name: string;
    room: string;
    dosen: string;
    color: string;
    type: string;
}

interface DosenItem {
    initials: string;
    name: string;
    mk: string;
    color: string;
    count: number;
}

interface JadwalTabProps {
    onOpenModal: () => void;
}

const times = ['07:00–08:40', '08:40–10:20', '10:20–12:00', '13:00–14:40', '14:40–16:20', '16:20–18:00'];
const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

const jadwalData: Record<string, Record<string, ScheduleItem>> = {
    '07:00–08:40': {
        Senin: { name: 'Algoritma & Pemrog.', room: 'R.304', dosen: 'Dr. Budi S.', color: '#1a56db', type: 'Teori' },
        Selasa: { name: 'Jaringan Komputer', room: 'Lab Jaringan', dosen: 'Ir. Surya P.', color: '#16a34a', type: 'Praktikum' },
        Rabu: { name: 'Metode Penelitian', room: 'R.101', dosen: 'Prof. Agus M.', color: '#f59e0b', type: 'Teori' },
    },
    '08:40–10:20': {
        Senin: { name: 'Basis Data Lanjut', room: 'Lab TI', dosen: 'Dr. Rina W.', color: '#0d9488', type: 'Praktikum' },
        Kamis: { name: 'Rekayasa PL', room: 'R.205', dosen: 'Drs. Hendra', color: '#7c3aed', type: 'Teori' },
        Jumat: { name: 'Algoritma & Pemrog.', room: 'R.304', dosen: 'Dr. Budi S.', color: '#1a56db', type: 'Teori' },
    },
    '10:20–12:00': {
        Selasa: { name: 'Rekayasa PL', room: 'R.205', dosen: 'Drs. Hendra', color: '#7c3aed', type: 'Teori' },
        Rabu: { name: 'Basis Data Lanjut', room: 'Lab TI', dosen: 'Dr. Rina W.', color: '#0d9488', type: 'Praktikum' },
        Kamis: { name: 'Keamanan Siber', room: 'Lab TI', dosen: 'Dr. Andi K.', color: '#e11d48', type: 'Praktikum' },
    },
    '13:00–14:40': {
        Senin: { name: 'Metode Penelitian', room: 'R.101', dosen: 'Prof. Agus M.', color: '#f59e0b', type: 'Teori' },
        Rabu: { name: 'Keamanan Siber', room: 'R.304', dosen: 'Dr. Andi K.', color: '#e11d48', type: 'Teori' },
        Jumat: { name: 'Jaringan Komputer', room: 'R.302', dosen: 'Ir. Surya P.', color: '#16a34a', type: 'Teori' },
    },
    '14:40–16:20': {
        Selasa: { name: 'Machine Learning', room: 'Lab AI', dosen: 'Dr. Fajar N.', color: '#4338ca', type: 'Praktikum' },
        Kamis: { name: 'Algoritma & Pemrog.', room: 'Lab TI', dosen: 'Dr. Budi S.', color: '#1a56db', type: 'Praktikum' },
    },
    '16:20–18:00': {
        Jumat: { name: 'Rekayasa PL', room: 'R.205', dosen: 'Drs. Hendra', color: '#7c3aed', type: 'Studio' },
    }
};

const dosenData: DosenItem[] = [
    { initials: 'BS', name: 'Dr. Budi S., M.Kom', mk: 'Algoritma & Pemrog.', color: 'linear-gradient(135deg,#1a56db,#4f83f0)', count: 3 },
    { initials: 'RW', name: 'Dr. Rina W., M.T', mk: 'Basis Data Lanjut', color: 'linear-gradient(135deg,#0d9488,#2dd4bf)', count: 2 },
    { initials: 'DH', name: 'Drs. Hendra, M.Cs', mk: 'Rekayasa PL', color: 'linear-gradient(135deg,#7c3aed,#a78bfa)', count: 3 },
    { initials: 'SP', name: 'Ir. Surya P., M.T', mk: 'Jaringan Komputer', color: 'linear-gradient(135deg,#16a34a,#4ade80)', count: 2 },
    { initials: 'AM', name: 'Prof. Agus M., Ph.D', mk: 'Metode Penelitian', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)', count: 2 },
];

export default function JadwalTab({ onOpenModal }: JadwalTabProps) {
    const [selectedProdi, setSelectedProdi] = useState('Teknik Informatika');
    const [selectedSem, setSelectedSem] = useState('Semester 5');
    const [selectedKelas, setSelectedKelas] = useState('Kelas A');

    return (
        <div className="tab-panel active">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Schedule Grid */}
                <div className="col-span-1 lg:col-span-9">
                    <div className="card-custom">
                        <div className="filter-bar border-b border-slate-100 dark:border-slate-800 pb-4">
                            <select
                                className="fsel"
                                value={selectedProdi}
                                onChange={(e) => setSelectedProdi(e.target.value)}
                            >
                                <option>Teknik Informatika</option>
                                <option>Sistem Informasi</option>
                                <option>Manajemen Bisnis</option>
                            </select>
                            <select
                                className="fsel"
                                value={selectedSem}
                                onChange={(e) => setSelectedSem(e.target.value)}
                            >
                                <option>Semester 1</option>
                                <option>Semester 3</option>
                                <option>Semester 5</option>
                                <option>Semester 7</option>
                            </select>
                            <select
                                className="fsel"
                                value={selectedKelas}
                                onChange={(e) => setSelectedKelas(e.target.value)}
                            >
                                <option>Kelas A</option>
                                <option>Kelas B</option>
                                <option>Kelas C</option>
                            </select>
                            <button className="btn-add cursor-pointer" onClick={onOpenModal}>
                                <i className="bi bi-plus-lg" /> Tambah Jadwal
                            </button>
                            <button className="btn-outline cursor-pointer">
                                <i className="bi bi-printer" /> Cetak
                            </button>
                        </div>

                        {/* Schedule Header info */}
                        <div className="p-5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/40">
                            <div>
                                <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                                    Jadwal Kuliah — {selectedProdi} · {selectedKelas} · {selectedSem}
                                </div>
                                <div className="text-xs text-slate-400">
                                    Semester Gasal 2025/2026 · 16 pertemuan per mata kuliah
                                </div>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                                <span className="text-[10px] font-bold flex items-center gap-1">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-[#1a56db] inline-block" /> Teori
                                </span>
                                <span className="text-[10px] font-bold flex items-center gap-1">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-[#0d9488] inline-block" /> Praktikum
                                </span>
                                <span className="text-[10px] font-bold flex items-center gap-1">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-[#7c3aed] inline-block" /> Studio
                                </span>
                            </div>
                        </div>

                        <div className="jadwal-mobile-note">
                            <i className="bi bi-info-circle me-1" />
                            Jadwal grid tersedia di layar yang lebih besar. Silakan gunakan tablet atau desktop.
                        </div>

                        <div className="p-5 overflow-x-auto">
                            <div className="jadwal-grid min-w-[700px]">
                                {/* Header Row */}
                                <div className="jg-header">Waktu</div>
                                {days.map(d => (
                                    <div key={d} className="jg-header">{d}</div>
                                ))}

                                {/* Data Rows */}
                                {times.map(t => (
                                    <React.Fragment key={t}>
                                        <div className="jg-time text-[10px] py-3">
                                            {t.split('–').map((time, idx) => (
                                                <div key={idx}>{time}</div>
                                            ))}
                                        </div>
                                        {days.map(d => {
                                            const item = jadwalData[t]?.[d];
                                            return (
                                                <div key={d} className={`jg-cell ${!item ? 'empty' : ''}`}>
                                                    {item ? (
                                                        <div
                                                            className="jg-subject text-white"
                                                            style={{ backgroundColor: item.color }}
                                                            title={`${item.name} · ${item.room} · ${item.dosen}`}
                                                        >
                                                            <div className="jg-name text-[10px] font-bold mb-0.5">{item.name}</div>
                                                            <div className="jg-meta text-[9px] opacity-90">
                                                                <i className="bi bi-door-open me-0.5" /> {item.room}
                                                            </div>
                                                            <span className="jg-sks text-[8px] mt-1 font-extrabold uppercase">
                                                                {item.type}
                                                            </span>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SKS Load & Lecturers */}
                <div className="col-span-1 lg:col-span-3">
                    {/* SKS Load */}
                    <div className="card-custom mb-3 p-4">
                        <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                            <i className="bi bi-bar-chart-fill text-blue-600 me-2" /> Beban SKS {selectedKelas}
                        </div>
                        <div className="flex flex-col gap-3">
                            <div>
                                <div className="flex justify-between text-[11px] font-bold mb-1">
                                    <span>Algoritma & Pemrog.</span>
                                    <span className="text-blue-600">3 SKS</span>
                                </div>
                                <div className="prog-bar-bg">
                                    <div className="prog-bar-fill bg-gradient-to-r from-blue-600 to-blue-400 w-3/4" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[11px] font-bold mb-1">
                                    <span>Basis Data Lanjut</span>
                                    <span className="text-teal-600">3 SKS</span>
                                </div>
                                <div className="prog-bar-bg">
                                    <div className="prog-bar-fill bg-gradient-to-r from-teal-600 to-teal-400 w-3/4" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[11px] font-bold mb-1">
                                    <span>Rekayasa Perangkat Lunak</span>
                                    <span className="text-purple-600">3 SKS</span>
                                </div>
                                <div className="prog-bar-bg">
                                    <div className="prog-bar-fill bg-gradient-to-r from-purple-600 to-purple-400 w-3/4" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[11px] font-bold mb-1">
                                    <span>Jaringan Komputer</span>
                                    <span className="text-green-600">2 SKS</span>
                                </div>
                                <div className="prog-bar-bg">
                                    <div className="prog-bar-fill bg-gradient-to-r from-green-600 to-green-400 w-1/2" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[11px] font-bold mb-1">
                                    <span>Metode Penelitian</span>
                                    <span className="text-amber-600">2 SKS</span>
                                </div>
                                <div className="prog-bar-bg">
                                    <div className="prog-bar-fill bg-gradient-to-r from-amber-600 to-amber-400 w-1/2" />
                                </div>
                            </div>
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl flex justify-between items-center">
                                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">Total SKS Semester</span>
                                <span className="text-sm font-extrabold text-blue-700 dark:text-blue-300">20 SKS</span>
                            </div>
                        </div>
                    </div>

                    {/* Dosen Pengampu */}
                    <div className="card-custom p-4">
                        <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                            <i className="bi bi-person-badge-fill text-warning me-2" /> Dosen Pengampu
                        </div>
                        <div className="flex flex-col gap-3">
                            {dosenData.map((d) => (
                                <div key={d.initials} className="flex items-center gap-3 py-1.5 border-b border-slate-50 dark:border-slate-800/40 last:border-0">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                        style={{ background: d.color }}
                                    >
                                        {d.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 truncate">
                                            {d.name}
                                        </div>
                                        <div className="text-[10px] text-slate-400 truncate">
                                            {d.mk} · {d.count} sesi/minggu
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
