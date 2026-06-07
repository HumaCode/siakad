import React, { useState, useEffect } from 'react';
import JadwalDetailModal from './JadwalDetailModal';

interface ScheduleItem {
    id: string;
    mata_kuliah_id: string;
    mata_kuliah: {
        id: string;
        kode: string;
        nama: string;
        sks: number;
        sks_teori: number;
        sks_praktik: number;
        sem: number;
        jenis: string;
    };
    ruangan_id: string;
    ruangan: {
        id: string;
        nama_gedung: string;
        nama_ruangan: string;
        kapasitas: number;
    };
    dosen_id: string;
    dosen: {
        id: string;
        nama: string;
        nidn: string;
        initials: string;
    };
    prodi_id: string;
    prodi: {
        id: string;
        nama: string;
        kode: string;
    };
    hari: string;
    kelas_id: string;
    kelas: {
        id: string;
        nama: string;
    };
    jam_mulai: string;
    jam_selesai: string;
    tipe: string;
}

interface JadwalTabProps {
    jadwals: ScheduleItem[];
    allProdis: any[];
    allKelas?: any[];
    onOpenModal: (jadwal?: any) => void;
    onDeleteJadwal: (jadwal: any) => void;
}

const times = ['07:00–08:40', '08:40–10:20', '10:20–12:00', '13:00–14:40', '14:40–16:20', '16:20–18:00'];
const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export default function JadwalTab({ jadwals = [], allProdis = [], allKelas = [], onOpenModal, onDeleteJadwal }: JadwalTabProps) {
    const [selectedDetailJadwal, setSelectedDetailJadwal] = useState<ScheduleItem | null>(null);
    // Initialize selected prodi to first available prodi id
    const [selectedProdiId, setSelectedProdiId] = useState(allProdis[0]?.id || '');
    const [selectedSem, setSelectedSem] = useState(5);
    
    // Filter classes belonging to selected prodi
    const prodiKelas = allKelas.filter(k => k.prodi_id === selectedProdiId);
    
    const [selectedKelasId, setSelectedKelasId] = useState('');
    const activeKelas = prodiKelas.find(k => k.id === selectedKelasId);
    const selectedKelas = activeKelas ? activeKelas.nama : '';

    // Update selected class when prodi changes or classes load
    useEffect(() => {
        if (prodiKelas.length > 0) {
            if (!prodiKelas.some(k => k.id === selectedKelasId)) {
                setSelectedKelasId(prodiKelas[0].id);
            }
        } else {
            setSelectedKelasId('');
        }
    }, [selectedProdiId, allKelas]);

    // Find the prodi name for header display
    const currentProdi = allProdis.find(p => p.id === selectedProdiId);
    const prodiNameDisplay = currentProdi ? currentProdi.nama : 'Teknik Informatika';

    const currentKelas = prodiKelas.find(k => k.id === selectedKelasId);
    const kelasNameDisplay = currentKelas ? currentKelas.nama : '';

    // Filter schedules
    const filteredJadwals = jadwals.filter(j => 
        j.prodi_id === selectedProdiId &&
        j.kelas_id === selectedKelasId &&
        (j.mata_kuliah?.sem === selectedSem || (selectedSem === 5 && !j.mata_kuliah?.sem))
    );

    // Compute Beban SKS aggregates
    const coursesSks: Record<string, { sks: number; color: string; textColor: string }> = {};
    filteredJadwals.forEach(j => {
        const name = j.mata_kuliah?.nama;
        if (name && !coursesSks[name]) {
            let colorClass = 'from-blue-600 to-blue-400';
            let textClass = 'text-blue-600 dark:text-blue-400';
            if (j.tipe === 'Praktikum') {
                colorClass = 'from-teal-600 to-teal-400';
                textClass = 'text-teal-600 dark:text-teal-400';
            } else if (j.tipe === 'Studio') {
                colorClass = 'from-purple-600 to-purple-400';
                textClass = 'text-purple-600 dark:text-purple-400';
            }
            coursesSks[name] = { 
                sks: parseInt(j.mata_kuliah?.sks as any) || 0,
                color: colorClass,
                textColor: textClass,
            };
        }
    });

    const totalSks = Object.values(coursesSks).reduce((sum, c) => sum + c.sks, 0);

    // Compute distinct Dosen Pengampu in the active filters
    const lecturersMap: Record<string, { initials: string; name: string; mk: string; color: string; count: number }> = {};
    filteredJadwals.forEach(j => {
        const dName = j.dosen?.nama;
        const dInit = j.dosen?.initials || 'DS';
        const mkName = j.mata_kuliah?.nama || '';
        if (dName) {
            if (!lecturersMap[dName]) {
                let color = 'linear-gradient(135deg,#1a56db,#4f83f0)';
                const charCode = dInit.charCodeAt(0) || 65;
                if (charCode % 5 === 0) color = 'linear-gradient(135deg,#0d9488,#2dd4bf)';
                else if (charCode % 5 === 1) color = 'linear-gradient(135deg,#7c3aed,#a78bfa)';
                else if (charCode % 5 === 2) color = 'linear-gradient(135deg,#16a34a,#4ade80)';
                else if (charCode % 5 === 3) color = 'linear-gradient(135deg,#f59e0b,#fbbf24)';
                else if (charCode % 5 === 4) color = 'linear-gradient(135deg,#e11d48,#fda4af)';
                
                lecturersMap[dName] = {
                    initials: dInit,
                    name: dName,
                    mk: mkName,
                    color: color,
                    count: 0,
                };
            }
            lecturersMap[dName].count += 1;
        }
    });
    const dosenData = Object.values(lecturersMap);

    return (
        <div className="tab-panel active">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Schedule Grid */}
                <div className="col-span-1 lg:col-span-9">
                    <div className="card-custom">
                        <div className="filter-bar border-b border-slate-100 dark:border-slate-800 pb-4">
                            <select
                                className="fsel"
                                value={selectedProdiId}
                                onChange={(e) => setSelectedProdiId(e.target.value)}
                            >
                                {allProdis.map(p => (
                                    <option key={p.id} value={p.id}>{p.nama}</option>
                                ))}
                            </select>
                            <select
                                className="fsel"
                                value={selectedSem}
                                onChange={(e) => setSelectedSem(parseInt(e.target.value) || 1)}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                    <option key={s} value={s}>Semester {s}</option>
                                ))}
                            </select>
                            <select
                                className="fsel"
                                value={selectedKelasId}
                                onChange={(e) => setSelectedKelasId(e.target.value)}
                            >
                                {prodiKelas.map(k => (
                                    <option key={k.id} value={k.id}>{k.nama}</option>
                                ))}
                                {prodiKelas.length === 0 && (
                                    <option value="">Tidak ada kelas</option>
                                )}
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
                                    Jadwal Kuliah — {prodiNameDisplay} · {kelasNameDisplay} · Semester {selectedSem}
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
                                    <span className="w-2.5 h-2.5 rounded-sm bg-[#7c3aed] inline-block" /> Praktikum & Teori
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
                                {times.map(t => {
                                    const slotParts = t.split('–');
                                    const start = slotParts[0]?.trim();
                                    return (
                                        <React.Fragment key={t}>
                                            <div className="jg-time text-[10px] py-3">
                                                {t.split('–').map((time, idx) => (
                                                    <div key={idx}>{time}</div>
                                                ))}
                                            </div>
                                            {days.map(d => {
                                                const item = filteredJadwals.find(j => 
                                                    j.hari === d && 
                                                    j.jam_mulai === start
                                                );

                                                let itemColor = '#1a56db';
                                                if (item) {
                                                    if (item.tipe === 'Praktikum') itemColor = '#0d9488';
                                                    else if (item.tipe === 'Studio') itemColor = '#7c3aed';
                                                }

                                                return (
                                                    <div key={d} className={`jg-cell ${!item ? 'empty' : ''}`}>
                                                        {item ? (
                                                            <div
                                                                className="jg-subject text-white cursor-pointer"
                                                                style={{ backgroundColor: itemColor }}
                                                                title={`${item.mata_kuliah?.nama} · ${item.ruangan?.nama_ruangan} · ${item.dosen?.nama}`}
                                                                onClick={() => setSelectedDetailJadwal(item)}
                                                            >
                                                                <div className="jg-name text-[10px] font-bold mb-0.5 truncate">{item.mata_kuliah?.nama}</div>
                                                                <div className="jg-meta text-[9px] opacity-90 truncate">
                                                                    <i className="bi bi-door-open me-0.5" /> {item.ruangan?.nama_ruangan}
                                                                </div>
                                                                <span className="jg-sks text-[8px] mt-1 font-extrabold uppercase">
                                                                    {item.tipe}
                                                                </span>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                })}
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
                            {Object.entries(coursesSks).map(([name, data]) => (
                                <div key={name}>
                                    <div className="flex justify-between text-[11px] font-bold mb-1">
                                        <span className="truncate max-w-[70%]">{name}</span>
                                        <span className={data.textColor}>{data.sks} SKS</span>
                                    </div>
                                    <div className="prog-bar-bg">
                                        <div className={`prog-bar-fill bg-gradient-to-r ${data.color}`} style={{ width: `${Math.min(100, (data.sks / 4) * 100)}%` }} />
                                    </div>
                                </div>
                            ))}
                            {Object.keys(coursesSks).length === 0 && (
                                <div className="text-xs text-slate-400 py-2 text-center">
                                    Belum ada mata kuliah dijadwalkan.
                                </div>
                            )}
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl flex justify-between items-center">
                                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">Total SKS Semester</span>
                                <span className="text-sm font-extrabold text-blue-700 dark:text-blue-300">{totalSks} SKS</span>
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
                                <div key={d.name} className="flex items-center gap-3 py-1.5 border-b border-slate-50 dark:border-slate-800/40 last:border-0">
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
                            {dosenData.length === 0 && (
                                <div className="text-xs text-slate-400 py-2 text-center">
                                    Tidak ada dosen pengampu.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <JadwalDetailModal
                isOpen={selectedDetailJadwal !== null}
                onClose={() => setSelectedDetailJadwal(null)}
                jadwal={selectedDetailJadwal}
                onEdit={() => {
                    const temp = selectedDetailJadwal;
                    setSelectedDetailJadwal(null);
                    onOpenModal(temp);
                }}
                onDelete={() => {
                    const temp = selectedDetailJadwal;
                    setSelectedDetailJadwal(null);
                    onDeleteJadwal(temp);
                }}
            />
        </div>
    );
}
