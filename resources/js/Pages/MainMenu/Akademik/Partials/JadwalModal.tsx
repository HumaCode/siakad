import React, { useEffect, useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';

interface RuanganItem {
    id: string;
    nama: string;
    gedung: string;
    kapasitas: number;
}

interface MataKuliahItem {
    id: string;
    kode: string;
    nama: string;
    dosen_id: string;
    prodi_id: string;
    sks_teori?: number;
    sks_praktik?: number;
}

interface DosenItem {
    id: string;
    nama: string;
    nidn: string;
}

interface JadwalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (msg: string) => void;
    ruangans: RuanganItem[];
    mataKuliahs: MataKuliahItem[];
    dosens: DosenItem[];
    allKelas?: any[];
    jadwal?: any;
}

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const getMinuteOptions = (currentMinute: string) => {
    const base = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
    if (currentMinute && !base.includes(currentMinute)) {
        base.push(currentMinute);
    }
    return base.sort((a, b) => Number(a) - Number(b));
};

export default function JadwalModal({ isOpen, onClose, onSave, ruangans = [], mataKuliahs = [], dosens = [], allKelas = [], jadwal = null }: JadwalModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        mata_kuliah_id: '',
        hari: 'Senin',
        kelas_id: '',
        jam_mulai: '07:00',
        jam_selesai: '08:40',
        ruangan_id: '',
        tipe: 'Teori',
    });

    const [isMkDropdownOpen, setIsMkDropdownOpen] = useState(false);
    const [mkSearch, setMkSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [isKelasDropdownOpen, setIsKelasDropdownOpen] = useState(false);
    const [kelasSearch, setKelasSearch] = useState('');
    const kelasDropdownRef = useRef<HTMLDivElement>(null);

    const [isRuanganDropdownOpen, setIsRuanganDropdownOpen] = useState(false);
    const [ruanganSearch, setRuanganSearch] = useState('');
    const ruanganDropdownRef = useRef<HTMLDivElement>(null);

    const [isJamMulaiOpen, setIsJamMulaiOpen] = useState(false);
    const [isJamSelesaiOpen, setIsJamSelesaiOpen] = useState(false);
    const jamMulaiDropdownRef = useRef<HTMLDivElement>(null);
    const jamSelesaiDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsMkDropdownOpen(false);
            }
            if (kelasDropdownRef.current && !kelasDropdownRef.current.contains(event.target as Node)) {
                setIsKelasDropdownOpen(false);
            }
            if (ruanganDropdownRef.current && !ruanganDropdownRef.current.contains(event.target as Node)) {
                setIsRuanganDropdownOpen(false);
            }
            if (jamMulaiDropdownRef.current && !jamMulaiDropdownRef.current.contains(event.target as Node)) {
                setIsJamMulaiOpen(false);
            }
            if (jamSelesaiDropdownRef.current && !jamSelesaiDropdownRef.current.contains(event.target as Node)) {
                setIsJamSelesaiOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (jadwal) {
                setData({
                    mata_kuliah_id: jadwal.mata_kuliah_id || '',
                    hari: jadwal.hari || 'Senin',
                    kelas_id: jadwal.kelas_id || '',
                    jam_mulai: jadwal.jam_mulai || '07:00',
                    jam_selesai: jadwal.jam_selesai || '08:40',
                    ruangan_id: jadwal.ruangan_id || '',
                    tipe: jadwal.tipe || 'Teori',
                });
            } else {
                const firstMk = mataKuliahs[0];
                const firstMkProdiId = firstMk ? firstMk.prodi_id : '';
                const firstMkKelas = allKelas.filter((k: any) => k.prodi_id === firstMkProdiId);

                // Determine Tipe for first MK
                const tSks = firstMk ? (Number(firstMk.sks_teori) || 0) : 0;
                const pSks = firstMk ? (Number(firstMk.sks_praktik) || 0) : 0;
                let autoTipe = 'Teori';
                if (tSks > 0 && pSks > 0) {
                    autoTipe = 'Studio';
                } else if (pSks > 0) {
                    autoTipe = 'Praktikum';
                }

                setData({
                    mata_kuliah_id: firstMk?.id || '',
                    hari: 'Senin',
                    kelas_id: firstMkKelas[0]?.id || '',
                    jam_mulai: '07:00',
                    jam_selesai: '08:40',
                    ruangan_id: ruangans[0]?.id || '',
                    tipe: autoTipe,
                });
            }
            setIsMkDropdownOpen(false);
            setMkSearch('');
            setIsKelasDropdownOpen(false);
            setKelasSearch('');
            setIsRuanganDropdownOpen(false);
            setRuanganSearch('');
            setIsJamMulaiOpen(false);
            setIsJamSelesaiOpen(false);
        }
    }, [isOpen, mataKuliahs, ruangans, allKelas, jadwal]);

    useEffect(() => {
        if (data.mata_kuliah_id) {
            const selectedMk = mataKuliahs.find(mk => mk.id === data.mata_kuliah_id);
            if (selectedMk) {
                const mkKelas = allKelas.filter((k: any) => k.prodi_id === selectedMk.prodi_id);

                // Determine Tipe
                const tSks = Number(selectedMk.sks_teori) || 0;
                const pSks = Number(selectedMk.sks_praktik) || 0;
                let autoTipe = 'Teori';
                if (tSks > 0 && pSks > 0) {
                    autoTipe = 'Studio'; // Teori & Praktik
                } else if (pSks > 0) {
                    autoTipe = 'Praktikum'; // Praktik
                } else {
                    autoTipe = 'Teori'; // Teori
                }

                const newKelasId = (mkKelas.length > 0 && !mkKelas.some((k: any) => k.id === data.kelas_id)) ? mkKelas[0].id : data.kelas_id;

                if (data.tipe !== autoTipe || data.kelas_id !== newKelasId) {
                    setData({
                        ...data,
                        tipe: autoTipe,
                        kelas_id: newKelasId
                    });
                }
            }
        }
    }, [data.mata_kuliah_id, allKelas, mataKuliahs]);

    if (!isOpen) return null;

    // Find current lecturer based on selected course
    const selectedCourse = mataKuliahs.find(mk => mk.id === data.mata_kuliah_id);
    const lecturer = selectedCourse ? dosens.find(d => d.id === selectedCourse.dosen_id) : null;
    const lecturerName = lecturer ? lecturer.nama : 'Belum ditentukan';

    const courseProdiId = selectedCourse ? selectedCourse.prodi_id : '';
    const prodiKelas = allKelas.filter((k: any) => k.prodi_id === courseProdiId);

    const selectedKelas = allKelas.find((k: any) => k.id === data.kelas_id);
    const selectedRuangan = ruangans.find(r => r.id === data.ruangan_id);

    const filteredMataKuliahs = mataKuliahs.filter(mk => 
        mk.nama.toLowerCase().includes(mkSearch.toLowerCase()) || 
        mk.kode.toLowerCase().includes(mkSearch.toLowerCase())
    );

    const filteredKelas = prodiKelas.filter((k: any) => 
        k.nama.toLowerCase().includes(kelasSearch.toLowerCase())
    );

    const filteredRuangans = ruangans.filter(r => 
        r.nama.toLowerCase().includes(ruanganSearch.toLowerCase()) ||
        r.gedung.toLowerCase().includes(ruanganSearch.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (jadwal) {
            put(route('akademik.jadwal.update', jadwal.id), {
                onSuccess: () => {
                    onSave('Jadwal kuliah berhasil diperbarui.');
                    onClose();
                },
                preserveScroll: true,
            });
        } else {
            post(route('akademik.jadwal.store'), {
                onSuccess: () => {
                    reset();
                    onSave('Jadwal berhasil ditambahkan');
                },
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                            {jadwal ? 'Edit Sesi Jadwal' : 'Tambah Sesi Jadwal'}
                        </h3>
                        <p className="text-[10px] text-slate-400">
                            Konfigurasikan jadwal perkuliahan
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg transition-colors cursor-pointer"
                    >
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="relative" ref={dropdownRef}>
                            <label className="form-label-c">Mata Kuliah</label>
                            <div 
                                className={`form-ctrl flex items-center justify-between cursor-pointer select-none ${errors.mata_kuliah_id ? 'border-red-500' : ''}`}
                                onClick={() => {
                                    setIsMkDropdownOpen(!isMkDropdownOpen);
                                    setMkSearch('');
                                }}
                                style={{ minHeight: '38px' }}
                            >
                                <span className={selectedCourse ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}>
                                    {selectedCourse 
                                        ? `${selectedCourse.nama} (${selectedCourse.kode})` 
                                        : 'Pilih Mata Kuliah...'}
                                </span>
                                <i className={`bi bi-chevron-${isMkDropdownOpen ? 'up' : 'down'} text-xs text-slate-400`} />
                            </div>
                            {errors.mata_kuliah_id && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.mata_kuliah_id}</span>
                            )}

                            {isMkDropdownOpen && (
                                <div className="absolute z-[2100] left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-60">
                                    <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                        <div className="relative flex items-center">
                                            <i className="bi bi-search absolute left-3 text-slate-400 text-xs" />
                                            <input
                                                type="text"
                                                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                                                placeholder="Cari nama atau kode mata kuliah..."
                                                value={mkSearch}
                                                onChange={(e) => setMkSearch(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <div className="overflow-y-auto py-1">
                                        {filteredMataKuliahs.length === 0 ? (
                                            <div className="px-4 py-3 text-xs text-slate-400 text-center">
                                                Mata kuliah tidak ditemukan
                                            </div>
                                        ) : (
                                            filteredMataKuliahs.map((mk) => (
                                                <button
                                                    key={mk.id}
                                                    type="button"
                                                    className={`w-full text-left px-4 py-2 text-xs flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                                                        data.mata_kuliah_id === mk.id ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                                                    }`}
                                                    onClick={() => {
                                                        setData('mata_kuliah_id', mk.id);
                                                        setIsMkDropdownOpen(false);
                                                    }}
                                                >
                                                    <span>{mk.nama}</span>
                                                    <span className="text-[10px] text-slate-400 font-mono">{mk.kode}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tipe Radio Card Selector */}
                        <div>
                            <label className="form-label-c block mb-2">Tipe</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { value: 'Teori', label: 'Teori' },
                                    { value: 'Praktikum', label: 'Praktikum' },
                                    { value: 'Studio', label: 'Praktikum & Teori' }
                                ].map((opt) => (
                                    <label
                                        key={opt.value}
                                        className={`flex items-center justify-center p-3 rounded-xl border text-center cursor-pointer transition-all duration-200 select-none ${
                                            data.tipe === opt.value
                                                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-bold ring-1 ring-blue-500'
                                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="tipe"
                                            value={opt.value}
                                            checked={data.tipe === opt.value}
                                            onChange={(e) => setData('tipe', e.target.value)}
                                            className="sr-only"
                                        />
                                        <span className="text-xs">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.tipe && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.tipe}</span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="form-label-c">Hari</label>
                                <select 
                                    className={`form-ctrl ${errors.hari ? 'border-red-500' : ''}`}
                                    value={data.hari}
                                    onChange={(e) => setData('hari', e.target.value)}
                                >
                                    <option value="Senin">Senin</option>
                                    <option value="Selasa">Selasa</option>
                                    <option value="Rabu">Rabu</option>
                                    <option value="Kamis">Kamis</option>
                                    <option value="Jumat">Jumat</option>
                                    <option value="Sabtu">Sabtu</option>
                                    <option value="Minggu">Minggu</option>
                                </select>
                                {errors.hari && (
                                    <span className="text-red-500 text-[10px] mt-1 block">{errors.hari}</span>
                                )}
                            </div>
                            <div className="relative" ref={kelasDropdownRef}>
                                <label className="form-label-c">Kelas</label>
                                <div 
                                    className={`form-ctrl flex items-center justify-between cursor-pointer select-none ${errors.kelas_id ? 'border-red-500' : ''}`}
                                    onClick={() => {
                                        setIsKelasDropdownOpen(!isKelasDropdownOpen);
                                        setKelasSearch('');
                                    }}
                                    style={{ minHeight: '38px' }}
                                >
                                    <span className={selectedKelas ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}>
                                        {selectedKelas 
                                            ? selectedKelas.nama 
                                            : 'Pilih Kelas...'}
                                    </span>
                                    <i className={`bi bi-chevron-${isKelasDropdownOpen ? 'up' : 'down'} text-xs text-slate-400`} />
                                </div>
                                {errors.kelas_id && (
                                    <span className="text-red-500 text-[10px] mt-1 block">{errors.kelas_id}</span>
                                )}

                                {isKelasDropdownOpen && (
                                    <div className="absolute z-[2100] left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-60">
                                        <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                            <div className="relative flex items-center">
                                                <i className="bi bi-search absolute left-3 text-slate-400 text-xs" />
                                                <input
                                                    type="text"
                                                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                                                    placeholder="Cari kelas..."
                                                    value={kelasSearch}
                                                    onChange={(e) => setKelasSearch(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <div className="overflow-y-auto py-1">
                                            {filteredKelas.length === 0 ? (
                                                <div className="px-4 py-3 text-xs text-slate-400 text-center">
                                                    Kelas tidak ditemukan
                                                </div>
                                            ) : (
                                                filteredKelas.map((k: any) => (
                                                    <button
                                                        key={k.id}
                                                        type="button"
                                                        className={`w-full text-left px-4 py-2 text-xs flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                                                            data.kelas_id === k.id ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                                                        }`}
                                                        onClick={() => {
                                                            setData('kelas_id', k.id);
                                                            setIsKelasDropdownOpen(false);
                                                        }}
                                                    >
                                                        <span>{k.nama}</span>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Jam Mulai Custom Timepicker */}
                            <div className="relative" ref={jamMulaiDropdownRef}>
                                <label className="form-label-c">Jam Mulai</label>
                                <div 
                                    className={`form-ctrl flex items-center justify-between cursor-pointer select-none ${errors.jam_mulai ? 'border-red-500' : ''}`}
                                    onClick={() => {
                                        setIsJamMulaiOpen(!isJamMulaiOpen);
                                        setIsJamSelesaiOpen(false);
                                    }}
                                    style={{ minHeight: '38px' }}
                                >
                                    <span className="text-slate-800 dark:text-slate-200">
                                        {data.jam_mulai || '07:00'}
                                    </span>
                                    <i className="bi bi-clock text-xs text-slate-400" />
                                </div>
                                {errors.jam_mulai && (
                                    <span className="text-red-500 text-[10px] mt-1 block">{errors.jam_mulai}</span>
                                )}

                                {isJamMulaiOpen && (
                                    <div className="absolute z-[2100] left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden flex h-48">
                                        {/* Hours Column */}
                                        <div className="flex-1 overflow-y-auto border-r border-slate-100 dark:border-slate-800 py-1">
                                            <div className="px-2 py-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-slate-900">Jam</div>
                                            {hours.map(h => (
                                                <button
                                                    key={h}
                                                    type="button"
                                                    className={`w-full text-center py-1 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                                                        data.jam_mulai.split(':')[0] === h 
                                                            ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold' 
                                                            : 'text-slate-700 dark:text-slate-300'
                                                    }`}
                                                    onClick={() => {
                                                        const currentMin = data.jam_mulai.split(':')[1] || '00';
                                                        setData('jam_mulai', `${h}:${currentMin}`);
                                                    }}
                                                >
                                                    {h}
                                                </button>
                                            ))}
                                        </div>
                                        {/* Minutes Column */}
                                        <div className="flex-1 overflow-y-auto py-1">
                                            <div className="px-2 py-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-slate-900">Menit</div>
                                            {getMinuteOptions(data.jam_mulai.split(':')[1] || '00').map(m => (
                                                <button
                                                    key={m}
                                                    type="button"
                                                    className={`w-full text-center py-1 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                                                        data.jam_mulai.split(':')[1] === m 
                                                            ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold' 
                                                            : 'text-slate-700 dark:text-slate-300'
                                                    }`}
                                                    onClick={() => {
                                                        const currentHour = data.jam_mulai.split(':')[0] || '07';
                                                        setData('jam_mulai', `${currentHour}:${m}`);
                                                    }}
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Jam Selesai Custom Timepicker */}
                            <div className="relative" ref={jamSelesaiDropdownRef}>
                                <label className="form-label-c">Jam Selesai</label>
                                <div 
                                    className={`form-ctrl flex items-center justify-between cursor-pointer select-none ${errors.jam_selesai ? 'border-red-500' : ''}`}
                                    onClick={() => {
                                        setIsJamSelesaiOpen(!isJamSelesaiOpen);
                                        setIsJamMulaiOpen(false);
                                    }}
                                    style={{ minHeight: '38px' }}
                                >
                                    <span className="text-slate-800 dark:text-slate-200">
                                        {data.jam_selesai || '08:40'}
                                    </span>
                                    <i className="bi bi-clock text-xs text-slate-400" />
                                </div>
                                {errors.jam_selesai && (
                                    <span className="text-red-500 text-[10px] mt-1 block">{errors.jam_selesai}</span>
                                )}

                                {isJamSelesaiOpen && (
                                    <div className="absolute z-[2100] left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden flex h-48">
                                        {/* Hours Column */}
                                        <div className="flex-1 overflow-y-auto border-r border-slate-100 dark:border-slate-800 py-1">
                                            <div className="px-2 py-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-slate-900">Jam</div>
                                            {hours.map(h => (
                                                <button
                                                    key={h}
                                                    type="button"
                                                    className={`w-full text-center py-1 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                                                        data.jam_selesai.split(':')[0] === h 
                                                            ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold' 
                                                            : 'text-slate-700 dark:text-slate-300'
                                                    }`}
                                                    onClick={() => {
                                                        const currentMin = data.jam_selesai.split(':')[1] || '00';
                                                        setData('jam_selesai', `${h}:${currentMin}`);
                                                    }}
                                                >
                                                    {h}
                                                </button>
                                            ))}
                                        </div>
                                        {/* Minutes Column */}
                                        <div className="flex-1 overflow-y-auto py-1">
                                            <div className="px-2 py-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-slate-900">Menit</div>
                                            {getMinuteOptions(data.jam_selesai.split(':')[1] || '00').map(m => (
                                                <button
                                                    key={m}
                                                    type="button"
                                                    className={`w-full text-center py-1 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                                                        data.jam_selesai.split(':')[1] === m 
                                                            ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold' 
                                                            : 'text-slate-700 dark:text-slate-300'
                                                    }`}
                                                    onClick={() => {
                                                        const currentHour = data.jam_selesai.split(':')[0] || '08';
                                                        setData('jam_selesai', `${currentHour}:${m}`);
                                                    }}
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="relative" ref={ruanganDropdownRef}>
                            <label className="form-label-c">Ruangan</label>
                            <div 
                                className={`form-ctrl flex items-center justify-between cursor-pointer select-none ${errors.ruangan_id ? 'border-red-500' : ''}`}
                                onClick={() => {
                                    setIsRuanganDropdownOpen(!isRuanganDropdownOpen);
                                    setRuanganSearch('');
                                }}
                                style={{ minHeight: '38px' }}
                            >
                                <span className={selectedRuangan ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}>
                                    {selectedRuangan 
                                        ? `${selectedRuangan.nama} (${selectedRuangan.gedung})` 
                                        : 'Pilih Ruangan...'}
                                </span>
                                <i className={`bi bi-chevron-${isRuanganDropdownOpen ? 'up' : 'down'} text-xs text-slate-400`} />
                            </div>
                            {errors.ruangan_id && (
                                <span className="text-red-500 text-[10px] mt-1 block">{errors.ruangan_id}</span>
                            )}

                            {isRuanganDropdownOpen && (
                                <div className="absolute z-[2100] left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-60">
                                    <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                        <div className="relative flex items-center">
                                            <i className="bi bi-search absolute left-3 text-slate-400 text-xs" />
                                            <input
                                                type="text"
                                                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                                                placeholder="Cari ruangan atau gedung..."
                                                value={ruanganSearch}
                                                onChange={(e) => setRuanganSearch(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <div className="overflow-y-auto py-1">
                                        {filteredRuangans.length === 0 ? (
                                            <div className="px-4 py-3 text-xs text-slate-400 text-center">
                                                Ruangan tidak ditemukan
                                            </div>
                                        ) : (
                                            filteredRuangans.map((r) => (
                                                <button
                                                    key={r.id}
                                                    type="button"
                                                    className={`w-full text-left px-4 py-2 text-xs flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                                                        data.ruangan_id === r.id ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                                                    }`}
                                                    onClick={() => {
                                                        setData('ruangan_id', r.id);
                                                        setIsRuanganDropdownOpen(false);
                                                    }}
                                                >
                                                    <span>{r.nama}</span>
                                                    <span className="text-[10px] text-slate-400 font-mono">{r.gedung}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {data.mata_kuliah_id && (
                            <div className="animate-fade-in">
                                <label className="form-label-c">Dosen Pengampu</label>
                                <input 
                                    className="form-ctrl bg-slate-50 dark:bg-slate-900 cursor-not-allowed" 
                                    type="text" 
                                    value={lecturerName} 
                                    readOnly 
                                />
                            </div>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-outline cursor-pointer"
                        disabled={processing}
                    >
                        <i className="bi bi-x-lg" /> Batal
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="btn-add cursor-pointer animate-fade-in"
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2 inline-block animate-spin" /> Menyimpan...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg" /> Simpan
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
